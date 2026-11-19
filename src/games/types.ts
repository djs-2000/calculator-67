export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export type PlayMode = 'builtin' | 'embed' | 'external';

export interface GameItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  thumbnail_url: string;
  play_mode: PlayMode;
  embed_url: string | null;
  external_url: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface AccessCodeRecord {
  id: string;
  code_prefix: string;
  label: string | null;
  is_active: boolean;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
}
