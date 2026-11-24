import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAdmin, sha256Hex } from '../_shared/auth.ts';

function generateSecureCode(length = 10): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
    if (i === 4) out += '-';
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return jsonResponse({ error: 'Unauthorized.' }, 401);
    }

    const { supabase, user } = admin;

    if (req.method === 'GET') {
      const primary = await supabase
        .from('access_codes')
        .select('id, code_prefix, label, is_active, expires_at, used_at, revoked_at, created_at')
        .order('created_at', { ascending: false });

      if (
        primary.error &&
        (primary.error.code === '42703' || primary.error.message?.includes('used_at'))
      ) {
        const fallback = await supabase
          .from('access_codes')
          .select('id, code_prefix, label, is_active, expires_at, revoked_at, created_at')
          .order('created_at', { ascending: false });

        if (fallback.error) {
          return jsonResponse({ error: 'Failed to load access codes.' }, 500);
        }

        const rows = fallback.data ?? [];
        const codeIds = rows.map((r) => r.id);
        const usedMap = new Map<string, string>();
        if (codeIds.length > 0) {
          const { data: sessions } = await supabase
            .from('access_sessions')
            .select('access_code_id, created_at')
            .in('access_code_id', codeIds)
            .order('created_at', { ascending: true });
          for (const s of sessions ?? []) {
            if (!usedMap.has(s.access_code_id)) {
              usedMap.set(s.access_code_id, s.created_at);
            }
          }
        }

        return jsonResponse({
          admin: admin.admin,
          codes: rows.map((r) => ({ ...r, used_at: usedMap.get(r.id) ?? null })),
        });
      }

      if (primary.error) return jsonResponse({ error: 'Failed to load access codes.' }, 500);
      return jsonResponse({ admin: admin.admin, codes: primary.data ?? [] });
    }

    if (req.method === 'POST') {
      const body = (await req.json().catch(() => ({}))) as {
        action?: 'generate' | 'rotate';
        label?: string;
        expiresInHours?: number | null;
      };

      const action = body.action === 'rotate' ? 'rotate' : 'generate';
      const label = typeof body.label === 'string' ? body.label.trim().slice(0, 80) : null;
      const expiresInHours =
        typeof body.expiresInHours === 'number' && body.expiresInHours > 0
          ? Math.min(body.expiresInHours, 24 * 365)
          : null;

      const nowIso = new Date().toISOString();

      if (action === 'rotate') {
        const { data: activeCodes } = await supabase
          .from('access_codes')
          .select('id')
          .eq('is_active', true);

        await supabase
          .from('access_codes')
          .update({ is_active: false, revoked_at: nowIso })
          .eq('is_active', true);

        if (activeCodes && activeCodes.length > 0) {
          await supabase
            .from('access_sessions')
            .update({ revoked_at: nowIso })
            .in(
              'access_code_id',
              activeCodes.map((c) => c.id)
            )
            .is('revoked_at', null);
        }
      }

      const plaintextCode = generateSecureCode(10);
      const codeHash = await sha256Hex(`code:${plaintextCode}`);
      const codePrefix = plaintextCode.slice(0, 4);
      const expiresAt = expiresInHours
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
        : null;

      const primaryInsert = await supabase
        .from('access_codes')
        .insert({
          code_hash: codeHash,
          code_prefix: codePrefix,
          label,
          is_active: true,
          expires_at: expiresAt,
          created_by: user.id,
        })
        .select('id, code_prefix, label, is_active, expires_at, used_at, revoked_at, created_at')
        .single();

      if (
        primaryInsert.error &&
        (primaryInsert.error.code === '42703' ||
          primaryInsert.error.message?.includes('used_at'))
      ) {
        const fallbackInsert = await supabase
          .from('access_codes')
          .insert({
            code_hash: codeHash,
            code_prefix: codePrefix,
            label,
            is_active: true,
            expires_at: expiresAt,
            created_by: user.id,
          })
          .select('id, code_prefix, label, is_active, expires_at, revoked_at, created_at')
          .single();

        if (fallbackInsert.error || !fallbackInsert.data) {
          return jsonResponse({ error: 'Unable to create access code.' }, 500);
        }
        return jsonResponse(
          { code: { ...fallbackInsert.data, used_at: null }, plaintextCode },
          201
        );
      }

      if (primaryInsert.error || !primaryInsert.data) {
        return jsonResponse({ error: 'Unable to create access code.' }, 500);
      }

      return jsonResponse({ code: primaryInsert.data, plaintextCode }, 201);
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id')?.trim() ?? '';
      if (!id) return jsonResponse({ error: 'Missing code id.' }, 400);

      const nowIso = new Date().toISOString();
      await supabase
        .from('access_codes')
        .update({ is_active: false, revoked_at: nowIso })
        .eq('id', id);

      await supabase
        .from('access_sessions')
        .update({ revoked_at: nowIso })
        .eq('access_code_id', id)
        .is('revoked_at', null);

      return jsonResponse({ revoked: true });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch {
    return jsonResponse({ error: 'Access code service unavailable.' }, 500);
  }
});
