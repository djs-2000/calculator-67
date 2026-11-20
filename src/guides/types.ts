export interface GuideCategory {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export type GuideMode = 'builtin' | 'embed' | 'external';

export interface GuideItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string;
  thumbnail_url: string;
  mode: GuideMode;
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
