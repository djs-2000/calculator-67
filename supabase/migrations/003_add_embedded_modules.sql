-- Add PolyTrack and Retro Bowl embedded educational simulation modules
-- Idempotent migration safe to execute on existing databases.

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT
  'polytrack-kinematics',
  'PolyTrack — Spline Kinematics & Friction Lab',
  'Interactive low-poly kinematic simulation analyzing centripetal acceleration, banked-curve friction limits, spline curvature optimization, and angular momentum across bounded tracks.',
  id,
  '',
  'embed',
  'https://joe-the-chicken.github.io/polytrack/',
  NULL,
  true
FROM public.game_categories
WHERE slug = 'physics-motion'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  play_mode = EXCLUDED.play_mode,
  embed_url = EXCLUDED.embed_url,
  is_active = true;

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT
  'retrobowl-kinematics',
  'Retro Bowl — Parabolic Trajectory & Expected Value Lab',
  'Applied probability and projectile mechanics simulation modeling parabolic release angles, lateral intercept vectors, expected-value decision trees, and discrete interval budgeting.',
  id,
  '',
  'embed',
  'https://game316009.konggames.com/gamez/0031/6009/live/index.html',
  NULL,
  true
FROM public.game_categories
WHERE slug = 'tactics-logic'
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  play_mode = EXCLUDED.play_mode,
  embed_url = EXCLUDED.embed_url,
  is_active = true;
