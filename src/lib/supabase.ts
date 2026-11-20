import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function normalizeSupabaseUrl(raw: string): string {
  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

export const normalizedSupabaseUrl = normalizeSupabaseUrl(
  import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    ''
);

export const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim();

export const isSupabaseClientConfigured =
  Boolean(normalizedSupabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !normalizedSupabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-supabase');

export function resolveBackendMode(): 'api' | 'supabase' {
  const explicit = (import.meta.env.VITE_BACKEND_MODE ?? '').trim().toLowerCase();
  if (explicit === 'supabase' || explicit === 'api') {
    return explicit;
  }
  if (!import.meta.env.DEV && isSupabaseClientConfigured) {
    return 'supabase';
  }
  return 'api';
}

export const supabase: SupabaseClient | null = isSupabaseClientConfigured
  ? createClient(normalizedSupabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
