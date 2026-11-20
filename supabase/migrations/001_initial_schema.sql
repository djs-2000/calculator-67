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

-- Seed guide categories
INSERT INTO public.game_categories (name, slug, sort_order) VALUES
  ('Spatial Mechanics', 'spatial-mechanics', 1),
  ('Number & Grid', 'number-grid', 2),
  ('Tactics & Logic', 'tactics-logic', 3),
  ('Physics & Motion', 'physics-motion', 4),
  ('Sequence & Timing', 'sequence-timing', 5),
  ('Collaborative', 'collaborative', 6),
  ('Quick Reference', 'quick-reference', 7),
  ('General', 'general', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed initial interactive guides catalog
INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'grid-path', 'Grid Pathing Guide', 'Step-by-step guide to Hamiltonian path planning, turning radius control, and spatial efficiency on a bounded grid.', id, 'builtin:grid-path', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'spatial-mechanics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'powers-merge', 'Powers of Two Merge Guide', 'Walkthrough of corner-anchoring heuristics, monotonic row ordering, and exponential tile-merging on a 4x4 grid.', id, 'builtin:powers-merge', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'number-grid'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'elastic-reflection', 'Elastic Reflection Guide', 'Visual guide to rebound angle geometry, momentum deflection, and target-clearing sequencing with a live canvas.', id, 'builtin:elastic-reflection', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'spatial-mechanics'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'adjacency-deduction', 'Adjacency Deduction Guide', 'Logical deduction guide covering numeric neighborhood constraints and safe-cell elimination on a matrix.', id, 'builtin:adjacency-deduction', 'builtin', NULL, NULL, true
FROM public.game_categories WHERE slug = 'tactics-logic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'open-chess-study', 'Classical Board Tactics Guide', 'Structured guide to opening principles, tactical forks, endgame calculation, and official external study boards.', id, '', 'external', NULL, 'https://lichess.org', true
FROM public.game_categories WHERE slug = 'tactics-logic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'procedural-terrain', 'Procedural Horizon Guide', 'Guide to procedural terrain generation, steering curve dynamics, and endless horizon rendering at the official showcase.', id, '', 'external', NULL, 'https://slowroads.io', true
FROM public.game_categories WHERE slug = 'physics-motion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'polytrack-kinematics', 'PolyTrack — Spline Kinematics & Friction Lab', 'Interactive low-poly kinematic simulation analyzing centripetal acceleration, banked-curve friction limits, spline curvature optimization, and angular momentum across bounded tracks.', id, '', 'embed', 'https://joe-the-chicken.github.io/polytrack/', NULL, true
FROM public.game_categories WHERE slug = 'physics-motion'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT 'retrobowl-kinematics', 'Retro Bowl — Parabolic Trajectory & Expected Value Lab', 'Applied probability and projectile mechanics simulation modeling parabolic release angles, lateral intercept vectors, expected-value decision trees, and discrete interval budgeting.', id, '', 'embed', 'https://game316009.konggames.com/gamez/0031/6009/live/index.html', NULL, true
FROM public.game_categories WHERE slug = 'tactics-logic'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.app_settings (key, value) VALUES
  ('session_ttl_hours', '{"hours": 8}'::jsonb),
  ('rate_limit', '{"max_attempts": 5, "window_minutes": 15}'::jsonb)
ON CONFLICT (key) DO NOTHING;
