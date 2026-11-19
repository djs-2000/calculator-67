import { supabase, isSupabaseClientConfigured } from './supabase';

const SESSION_STORAGE_KEY = 'calculator_access_session';
const BACKEND_MODE = (import.meta.env.VITE_BACKEND_MODE ?? 'api').trim().toLowerCase();
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export interface StoredAccessSession {
  token: string;
  expiresAt: string;
}

export function getStoredAccessSession(): StoredAccessSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAccessSession;
    if (!parsed.token || !parsed.expiresAt) return null;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredAccessSession(session: StoredAccessSession): void {
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredAccessSession(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

async function getAdminAccessToken(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

function buildEndpointUrl(apiPath: string, edgeFunction: string, query?: string): string {
  const qs = query ? `?${query}` : '';
  if (BACKEND_MODE === 'supabase' && isSupabaseClientConfigured) {
    return `${SUPABASE_URL}/functions/v1/${edgeFunction}${qs}`;
  }
  return `${apiPath}${qs}`;
}

async function requestJson<T>(
  apiPath: string,
  edgeFunction: string,
  options: {
    method?: string;
    body?: unknown;
    query?: string;
    includeAccessSession?: boolean;
    includeAdminAuth?: boolean;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (BACKEND_MODE === 'supabase' && isSupabaseClientConfigured) {
    headers.apikey = SUPABASE_ANON_KEY;
  }

  if (options.includeAccessSession) {
    const session = getStoredAccessSession();
    if (session) {
      headers['x-access-session'] = session.token;
    }
  }

  if (options.includeAdminAuth) {
    const token = await getAdminAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const url = buildEndpointUrl(apiPath, edgeFunction, options.query);
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const err = new Error('Authorization service unavailable.') as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }

  const data = (await res.json()) as T & {
    error?: string;
    unconfigured?: boolean;
  };

  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`) as Error & {
      status?: number;
      unconfigured?: boolean;
    };
    err.status = res.status;
    err.unconfigured = data.unconfigured;
    throw err;
  }

  return data;
}

export async function verifyAccessCode(code: string) {
  const data = await requestJson<{
    authorized: boolean;
    sessionToken: string;
    expiresAt: string;
  }>('/api/access/verify', 'verify-access-code', {
    method: 'POST',
    body: { code },
  });
  if (!data.authorized || !data.sessionToken || !data.expiresAt) {
    throw new Error('Invalid verification response.');
  }
  setStoredAccessSession({
    token: data.sessionToken,
    expiresAt: data.expiresAt,
  });
  return data;
}

export async function checkAuthorizationStatus() {
  return requestJson<{
    authorized: boolean;
    role: 'admin' | 'visitor';
    expiresAt: string | null;
  }>('/api/access/session', 'verify-access-code', {
    method: 'GET',
    includeAccessSession: true,
    includeAdminAuth: true,
  });
}

export async function fetchProtectedCatalog() {
  const data = await requestJson<{
    categories: Array<{ id: string; name: string; slug: string; sort_order: number }>;
    games: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      category_id: string;
      thumbnail_url: string;
      play_mode: 'builtin' | 'embed' | 'external';
      embed_url: string | null;
      external_url: string | null;
      is_active: boolean;
      created_at: string;
    }>;
  }>('/api/games', 'games-catalog', {
    method: 'GET',
    includeAccessSession: true,
    includeAdminAuth: true,
  });
  if (!Array.isArray(data.categories) || !Array.isArray(data.games)) {
    throw new Error('Authorization required.');
  }
  return data;
}

export async function verifyAdminRole() {
  const data = await requestJson<{
    admin?: { user_id: string; email: string; role: string };
  }>('/api/admin/me', 'admin-access-codes', {
    method: 'GET',
    includeAdminAuth: true,
  });
  if (!data.admin?.email) {
    throw new Error('Unauthorized.');
  }
  return { admin: data.admin };
}

export async function fetchAdminAccessCodes() {
  return requestJson<{
    codes: Array<{
      id: string;
      code_prefix: string;
      label: string | null;
      is_active: boolean;
      expires_at: string | null;
      revoked_at: string | null;
      created_at: string;
    }>;
  }>('/api/admin/access-codes', 'admin-access-codes', {
    method: 'GET',
    includeAdminAuth: true,
  });
}

export async function createOrRotateAccessCode(payload: {
  action: 'generate' | 'rotate';
  label?: string;
  expiresInHours?: number | null;
}) {
  return requestJson<{
    code: {
      id: string;
      code_prefix: string;
      label: string | null;
      is_active: boolean;
      expires_at: string | null;
      revoked_at: string | null;
      created_at: string;
    };
    plaintextCode: string;
  }>('/api/admin/access-codes', 'admin-access-codes', {
    method: 'POST',
    body: payload,
    includeAdminAuth: true,
  });
}

export async function revokeAccessCode(id: string) {
  return requestJson<{ revoked: boolean }>(
    '/api/admin/access-codes',
    'admin-access-codes',
    {
      method: 'DELETE',
      query: `id=${encodeURIComponent(id)}`,
      includeAdminAuth: true,
    }
  );
}

export async function fetchAdminGames() {
  return requestJson<{
    games: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
      category_id: string;
      thumbnail_url: string;
      play_mode: 'builtin' | 'embed' | 'external';
      embed_url: string | null;
      external_url: string | null;
      is_active: boolean;
      created_at: string;
    }>;
  }>('/api/admin/games', 'admin-games', {
    method: 'GET',
    includeAdminAuth: true,
  });
}

export async function saveAdminGame(
  mode: 'create' | 'edit',
  payload: Record<string, unknown>
) {
  return requestJson<{ game: unknown }>('/api/admin/games', 'admin-games', {
    method: mode === 'create' ? 'POST' : 'PUT',
    body: payload,
    includeAdminAuth: true,
  });
}

export async function deleteAdminGame(id: string) {
  return requestJson<{ deleted: boolean }>('/api/admin/games', 'admin-games', {
    method: 'DELETE',
    query: `id=${encodeURIComponent(id)}`,
    includeAdminAuth: true,
  });
}

export async function fetchAdminCategories() {
  return requestJson<{
    categories: Array<{
      id: string;
      name: string;
      slug: string;
      sort_order: number;
    }>;
  }>('/api/admin/categories', 'admin-categories', {
    method: 'GET',
    includeAdminAuth: true,
  });
}

export async function createAdminCategory(name: string) {
  return requestJson<{
    category: { id: string; name: string; slug: string; sort_order: number };
  }>('/api/admin/categories', 'admin-categories', {
    method: 'POST',
    body: { name },
    includeAdminAuth: true,
  });
}

export async function deleteAdminCategory(id: string) {
  return requestJson<{ deleted: boolean }>(
    '/api/admin/categories',
    'admin-categories',
    {
      method: 'DELETE',
      query: `id=${encodeURIComponent(id)}`,
      includeAdminAuth: true,
    }
  );
}
