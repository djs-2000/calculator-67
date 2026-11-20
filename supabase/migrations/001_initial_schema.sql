-- Calculator: Initial Schema & Row Level Security Policies
-- Run in Supabase SQL Editor or via `supabase db push`

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Administrator roles table
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Game categories
CREATE TABLE IF NOT EXISTS public.game_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Games catalog
CREATE TABLE IF NOT EXISTS public.games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  category_id uuid NOT NULL REFERENCES public.game_categories(id) ON DELETE RESTRICT,
  thumbnail_url text NOT NULL DEFAULT '',
  play_mode text NOT NULL DEFAULT 'builtin' CHECK (play_mode IN ('builtin', 'embed', 'external')),
  embed_url text,
  external_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Access codes (stored exclusively as SHA-256 hashes, never plaintext)
CREATE TABLE IF NOT EXISTS public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash text NOT NULL UNIQUE,
  code_prefix text NOT NULL,
  label text,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Expiring visitor sessions tied to a specific access code
CREATE TABLE IF NOT EXISTS public.access_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash text NOT NULL UNIQUE,
  access_code_id uuid NOT NULL REFERENCES public.access_codes(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Server-side rate limiting table for access code verification
CREATE TABLE IF NOT EXISTS public.access_rate_limits (
  ip_hash text PRIMARY KEY,
  attempts int NOT NULL DEFAULT 0,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  blocked_until timestamptz
);

-- 7. Application settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Helper function to verify admin membership cleanly in RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Enable Row Level Security on every table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Policies: admin_users
DROP POLICY IF EXISTS "Admins can view own admin record" ON public.admin_users;
CREATE POLICY "Admins can view own admin record"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies: game_categories (protected: NO anonymous SELECT)
DROP POLICY IF EXISTS "Admins full access to game_categories" ON public.game_categories;
CREATE POLICY "Admins full access to game_categories"
  ON public.game_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policies: games (protected: NO anonymous SELECT; catalog served only after authorization)
DROP POLICY IF EXISTS "Admins full access to games" ON public.games;
CREATE POLICY "Admins full access to games"
  ON public.games FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policies: access_codes (admin read metadata; mutations via service role / Edge Functions)
DROP POLICY IF EXISTS "Admins can view access_codes" ON public.access_codes;
CREATE POLICY "Admins can view access_codes"
  ON public.access_codes FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Policies: app_settings
DROP POLICY IF EXISTS "Admins full access to app_settings" ON public.app_settings;
CREATE POLICY "Admins full access to app_settings"
  ON public.app_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Explicit PostgreSQL role grants (RLS remains strictly enforced)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_categories, public.games, public.access_codes, public.app_settings TO authenticated;

-- Seed required game categories
INSERT INTO public.game_categories (name, slug, sort_order) VALUES
  ('Arcade', 'arcade', 1),
  ('Puzzle', 'puzzle', 2),
  ('Strategy', 'strategy', 3),
  ('Racing', 'racing', 4),
  ('Platformer', 'platformer', 5),
  ('Multiplayer', 'multiplayer', 6),
  ('Casual', 'casual', 7),
  ('Other', 'other', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed initial games catalog (built-in HTML5 games + legal official external links)
INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'snake', 'Classic Snake', 'Guide the snake across the grid, collect targets, and avoid colliding with walls or yourself.', id, 'builtin:snake', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'arcade'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT '2048', '2048 Tiles', 'Slide numbered tiles on a 4x4 grid to combine matching powers of two and reach 2048.', id, 'builtin:2048', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'puzzle'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'breakout', 'Block Breaker', 'Deflect the ball with your paddle to clear every row of blocks across the board.', id, 'builtin:breakout', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'arcade'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'minesweeper', 'Minesweeper', 'Use numeric adjacency clues to flag hidden mines and uncover every safe square.', id, 'builtin:minesweeper', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'strategy'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'lichess', 'Lichess Chess', 'Free, open-source online chess platform with puzzles, computer opponents, and live matches.', id, '', 'external', NULL, 'https://lichess.org', true
FROM public.game_categories WHERE slug = 'strategy'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'slow-roads', 'Slow Roads', 'Endless procedural driving game set across scenic landscapes directly in the browser.', id, '', 'external', NULL, 'https://slowroads.io', true
FROM public.game_categories WHERE slug = 'racing'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.app_settings (key, value) VALUES
  ('session_ttl_hours', '{"hours": 8}'::jsonb),
  ('rate_limit', '{"max_attempts": 5, "window_minutes": 15}'::jsonb)
ON CONFLICT (key) DO NOTHING;
