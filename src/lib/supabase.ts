import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function normalizeSupabaseUrl(raw: string): string {
  return raw
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

const SUPABASE_URL_CONFIG = 'https://qmzbcwwpptbaunaqhyby.supabase.co';
const SUPABASE_ANON_KEY_CONFIG = 'sb_publishable_hrT5IbZnGOa_QM9phaq58g_qIRYoeWh';

export const normalizedSupabaseUrl = normalizeSupabaseUrl(SUPABASE_URL_CONFIG);
export const supabaseAnonKey = SUPABASE_ANON_KEY_CONFIG.trim();
export const isSupabaseClientConfigured = true;

export function resolveBackendMode(): 'api' | 'supabase' {
  return 'supabase';
}

export const supabase: SupabaseClient = createClient(
  normalizedSupabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
