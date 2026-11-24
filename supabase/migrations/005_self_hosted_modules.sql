-- Update Drive Mad to self-hosted path and deactivate incomplete modules
-- Idempotent migration safe to execute on existing databases.

INSERT INTO public.games (slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active)
SELECT
  'drivemad-kinematics',
  'Drive Mad — Torque Equilibrium & Suspension Lab',
  'Rigid-body mechanics simulation investigating rotational torque, center-of-mass balance, suspension impulse damping, and wheel-surface static friction across irregular terrain.',
  id,
  '',
  'embed',
  '/modules/drive-mad/index.html',
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

UPDATE public.games
SET is_active = false
WHERE slug IN ('motox3m-kinematics', 'moto-x3m', 'bitlife-probability', 'bitlife');
