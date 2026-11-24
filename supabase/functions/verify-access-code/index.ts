import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getAdminClient, sha256Hex, verifyVisitorOrAdmin } from '../_shared/auth.ts';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method === 'GET') {
      const check = await verifyVisitorOrAdmin(req);
      if (!check.authorized) {
        return jsonResponse({ authorized: false }, 401);
      }
      return jsonResponse({
        authorized: true,
        role: check.role,
        expiresAt: 'expiresAt' in check ? check.expiresAt : null,
      });
    }

    if (req.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    const supabase = getAdminClient();
    const clientIp =
      req.headers.get('cf-connecting-ip') ??
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';
    const ipHash = await sha256Hex(`ip:${clientIp}`);
    const now = new Date();

    const { data: limitRow } = await supabase
      .from('access_rate_limits')
      .select('attempts, window_started_at, blocked_until')
      .eq('ip_hash', ipHash)
      .maybeSingle();

    if (limitRow?.blocked_until && new Date(limitRow.blocked_until).getTime() > now.getTime()) {
      return jsonResponse(
        { error: 'Too many invalid attempts. Please try again later.' },
        429
      );
    }

    const body = (await req.json().catch(() => ({}))) as { code?: unknown };
    const code = typeof body.code === 'string' ? body.code.trim() : '';

    if (!code || code.length < 4 || code.length > 64) {
      return jsonResponse({ error: 'Invalid access code.' }, 400);
    }

    const codeHash = await sha256Hex(`code:${code}`);
    let hasUsedAtColumn = true;

    let codeRow: {
      id: string;
      is_active: boolean;
      expires_at: string | null;
      revoked_at: string | null;
      used_at: string | null;
    } | null = null;

    const primaryLookup = await supabase
      .from('access_codes')
      .select('id, is_active, expires_at, revoked_at, used_at')
      .eq('code_hash', codeHash)
      .maybeSingle();

    if (
      primaryLookup.error &&
      (primaryLookup.error.code === '42703' ||
        primaryLookup.error.message?.includes('used_at'))
    ) {
      hasUsedAtColumn = false;
      const fallbackLookup = await supabase
        .from('access_codes')
        .select('id, is_active, expires_at, revoked_at')
        .eq('code_hash', codeHash)
        .maybeSingle();
      if (fallbackLookup.data) {
        codeRow = { ...fallbackLookup.data, used_at: null };
      }
    } else {
      codeRow = primaryLookup.data;
    }

    const recordInvalidAttempt = async () => {
      const windowExpired =
        !limitRow ||
        now.getTime() - new Date(limitRow.window_started_at).getTime() > WINDOW_MS;
      const nextAttempts = windowExpired ? 1 : (limitRow?.attempts ?? 0) + 1;
      const blockedUntil =
        nextAttempts >= MAX_ATTEMPTS
          ? new Date(now.getTime() + WINDOW_MS).toISOString()
          : null;

      await supabase.from('access_rate_limits').upsert({
        ip_hash: ipHash,
        attempts: nextAttempts,
        window_started_at: windowExpired
          ? now.toISOString()
          : limitRow!.window_started_at,
        blocked_until: blockedUntil,
      });

      return jsonResponse(
        {
          error:
            nextAttempts >= MAX_ATTEMPTS
              ? 'Too many invalid attempts. Please try again later.'
              : 'Invalid, already used, or expired access code.',
        },
        nextAttempts >= MAX_ATTEMPTS ? 429 : 401
      );
    };

    const isEligible =
      Boolean(codeRow) &&
      codeRow!.is_active &&
      !codeRow!.revoked_at &&
      !codeRow!.used_at &&
      (!codeRow!.expires_at || new Date(codeRow!.expires_at).getTime() > now.getTime());

    if (!isEligible) {
      return await recordInvalidAttempt();
    }

    const nowIso = now.toISOString();

    if (hasUsedAtColumn) {
      // Atomically claim this single-use code before issuing a session.
      // Do NOT clear is_active/revoked_at so the one session issued remains valid until TTL/revocation.
      const { data: claimed, error: claimErr } = await supabase
        .from('access_codes')
        .update({ used_at: nowIso })
        .eq('id', codeRow!.id)
        .is('used_at', null)
        .eq('is_active', true)
        .is('revoked_at', null)
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
        .select('id')
        .maybeSingle();

      if (claimErr || !claimed) {
        return await recordInvalidAttempt();
      }
    } else {
      const { count: priorUses } = await supabase
        .from('access_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('access_code_id', codeRow!.id);

      if ((priorUses ?? 0) > 0) {
        return await recordInvalidAttempt();
      }
    }

    await supabase.from('access_rate_limits').delete().eq('ip_hash', ipHash);

    const rawBytes = new Uint8Array(32);
    crypto.getRandomValues(rawBytes);
    const sessionToken = Array.from(rawBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const tokenHash = await sha256Hex(sessionToken);

    const defaultTtlMs = 8 * 60 * 60 * 1000;
    let expiresAtMs = now.getTime() + defaultTtlMs;
    if (codeRow!.expires_at) {
      expiresAtMs = Math.min(expiresAtMs, new Date(codeRow!.expires_at).getTime());
    }
    const expiresAt = new Date(expiresAtMs).toISOString();

    const { data: insertedSession, error: insertErr } = await supabase
      .from('access_sessions')
      .insert({
        token_hash: tokenHash,
        access_code_id: codeRow!.id,
        expires_at: expiresAt,
      })
      .select('id, created_at')
      .single();

    if (insertErr || !insertedSession) {
      if (hasUsedAtColumn) {
        await supabase
          .from('access_codes')
          .update({ used_at: null })
          .eq('id', codeRow!.id)
          .eq('used_at', nowIso);
      }
      return jsonResponse({ error: 'Unable to create session.' }, 500);
    }

    if (!hasUsedAtColumn) {
      // Fallback guard against concurrent redemption before SQL migration 004 runs
      const { data: firstSession } = await supabase
        .from('access_sessions')
        .select('id')
        .eq('access_code_id', codeRow!.id)
        .order('created_at', { ascending: true })
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (firstSession && firstSession.id !== insertedSession.id) {
        await supabase.from('access_sessions').delete().eq('id', insertedSession.id);
        return await recordInvalidAttempt();
      }
    }

    return jsonResponse({
      authorized: true,
      sessionToken,
      expiresAt,
    });
  } catch {
    return jsonResponse({ error: 'Verification service unavailable.' }, 500);
  }
});
