-- Optional migration to update seeded category names and guide descriptions in-place
-- Safe to run multiple times on existing projects.

UPDATE public.game_categories SET name = 'Spatial Mechanics', slug = 'spatial-mechanics' WHERE slug = 'arcade';
UPDATE public.game_categories SET name = 'Number & Grid', slug = 'number-grid' WHERE slug = 'puzzle';
UPDATE public.game_categories SET name = 'Tactics & Logic', slug = 'tactics-logic' WHERE slug = 'strategy';
UPDATE public.game_categories SET name = 'Physics & Motion', slug = 'physics-motion' WHERE slug = 'racing';
UPDATE public.game_categories SET name = 'Sequence & Timing', slug = 'sequence-timing' WHERE slug = 'platformer';
UPDATE public.game_categories SET name = 'Collaborative', slug = 'collaborative' WHERE slug = 'multiplayer';
UPDATE public.game_categories SET name = 'Quick Reference', slug = 'quick-reference' WHERE slug = 'casual';
UPDATE public.game_categories SET name = 'General', slug = 'general' WHERE slug = 'other';

UPDATE public.games
SET
  slug = 'grid-path',
  title = 'Grid Pathing Guide',
  description = 'Step-by-step guide to Hamiltonian path planning, turning radius control, and spatial efficiency on a bounded grid.',
  thumbnail_url = 'builtin:grid-path'
WHERE slug = 'snake';

UPDATE public.games
SET
  slug = 'powers-merge',
  title = 'Powers of Two Merge Guide',
  description = 'Walkthrough of corner-anchoring heuristics, monotonic row ordering, and exponential tile-merging on a 4x4 grid.',
  thumbnail_url = 'builtin:powers-merge'
WHERE slug = '2048';

UPDATE public.games
SET
  slug = 'elastic-reflection',
  title = 'Elastic Reflection Guide',
  description = 'Visual guide to rebound angle geometry, momentum deflection, and target-clearing sequencing with a live canvas.',
  thumbnail_url = 'builtin:elastic-reflection'
WHERE slug = 'breakout';

UPDATE public.games
SET
  slug = 'adjacency-deduction',
  title = 'Adjacency Deduction Guide',
  description = 'Logical deduction guide covering numeric neighborhood constraints and safe-cell elimination on a matrix.',
  thumbnail_url = 'builtin:adjacency-deduction'
WHERE slug = 'minesweeper';

UPDATE public.games
SET
  slug = 'open-chess-study',
  title = 'Classical Board Tactics Guide',
  description = 'Structured guide to opening principles, tactical forks, endgame calculation, and official external study boards.'
WHERE slug = 'lichess';

UPDATE public.games
SET
  slug = 'procedural-terrain',
  title = 'Procedural Horizon Guide',
  description = 'Guide to procedural terrain generation, steering curve dynamics, and endless horizon rendering at the official showcase.'
WHERE slug = 'slow-roads';
