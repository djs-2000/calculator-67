import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

export function getAdminClient() {
  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (!url || !serviceKey) {
    throw new Error('Missing Supabase environment configuration');
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function sha256Hex(input: string): Promise<string> {
  const pepper = Deno.env.get('ACCESS_TOKEN_SECRET') ?? '';
  const data = new TextEncoder().encode(`${pepper}:${input}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function requireAdmin(req: Request) {
  const authHeader = req.headers.get('Authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return null;

  const supabase = getAdminClient();
  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData?.user) return null;

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id, email, role')
    .eq('user_id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!adminRow) return null;
  return { supabase, user: userData.user, admin: adminRow };
}

export async function verifyVisitorOrAdmin(req: Request) {
  const adminCtx = await requireAdmin(req);
  if (adminCtx) {
    return { authorized: true as const, role: 'admin' as const, supabase: adminCtx.supabase };
  }

  const sessionToken = (req.headers.get('x-access-session') ?? '').trim();
  if (!sessionToken) return { authorized: false as const };

  const supabase = getAdminClient();
  const tokenHash = await sha256Hex(sessionToken);

  const { data: session } = await supabase
    .from('access_sessions')
    .select('id, expires_at, revoked_at, access_code_id, access_codes!inner(is_active, revoked_at, expires_at)')
    .eq('token_hash', tokenHash)
    .is('revoked_at', null)
    .maybeSingle();

  if (!session) return { authorized: false as const };

  const now = Date.now();
  if (new Date(session.expires_at).getTime() <= now) {
    return { authorized: false as const };
  }

  const codeInfo = Array.isArray(session.access_codes)
    ? session.access_codes[0]
    : session.access_codes;
  if (!codeInfo || !codeInfo.is_active || codeInfo.revoked_at) {
    return { authorized: false as const };
  }
  if (codeInfo.expires_at && new Date(codeInfo.expires_at).getTime() <= now) {
    return { authorized: false as const };
  }

  return {
    authorized: true as const,
    role: 'visitor' as const,
    expiresAt: session.expires_at,
    supabase,
  };
}
