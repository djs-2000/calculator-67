import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function normalizeSupabaseUrl(raw: string): string {
  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

export const normalizedSupabaseUrl = normalizeSupabaseUrl(
  import.meta.env.VITE_SUPABASE_URL ?? ''
);
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

export const isSupabaseClientConfigured =
  Boolean(normalizedSupabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !normalizedSupabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-supabase');

export const supabase: SupabaseClient | null = isSupabaseClientConfigured
  ? createClient(normalizedSupabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;
