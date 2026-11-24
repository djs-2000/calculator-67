import { type GuideCategory, type GuideItem } from './types';

interface EmbeddedModuleBlueprint {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  embed_url: string;
}

const DEFAULT_EMBEDDED_BLUEPRINTS: EmbeddedModuleBlueprint[] = [
  {
    slug: 'polytrack-kinematics',
    title: 'PolyTrack — Spline Kinematics & Friction Lab',
    description:
      'Interactive low-poly kinematic simulation analyzing centripetal acceleration, banked-curve friction limits, spline curvature optimization, and angular momentum across bounded tracks.',
    categorySlug: 'physics-motion',
    embed_url: '/modules/polytrack/index.html',
  },
  {
    slug: 'retrobowl-kinematics',
    title: 'Retro Bowl — Parabolic Trajectory & Expected Value Lab',
    description:
      'Applied probability and projectile mechanics simulation modeling parabolic release angles, lateral intercept vectors, expected-value decision trees, and discrete interval budgeting.',
    categorySlug: 'tactics-logic',
    embed_url: 'https://retro-bowl-six.vercel.app/',
  },
  {
    slug: 'drivemad-kinematics',
    title: 'Drive Mad — Torque Equilibrium & Suspension Lab',
    description:
      'Rigid-body mechanics simulation investigating rotational torque, center-of-mass balance, suspension impulse damping, and wheel-surface static friction across irregular terrain.',
    categorySlug: 'physics-motion',
    embed_url: '/modules/drive-mad/index.html',
  },
];

const EXCLUDED_SLUGS = new Set([
  'procedural-terrain',
  'slow-roads',
  'motox3m-kinematics',
  'moto-x3m',
  'bitlife-probability',
  'bitlife',
]);

export function mergeDefaultEmbeddedModules(
  guides: GuideItem[],
  categories: GuideCategory[]
): GuideItem[] {
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const fallbackCategoryId = categories[0]?.id ?? 'general';

  const normalized = guides
    .filter((g) => {
      if (EXCLUDED_SLUGS.has(g.slug.toLowerCase())) return false;
      const ext = (g.external_url ?? '').toLowerCase();
      const emb = (g.embed_url ?? '').toLowerCase();
      if (ext.includes('slowroads.io') || emb.includes('slowroads.io')) return false;
      return true;
    })
    .map((g): GuideItem => {
      const lowerSlug = g.slug.toLowerCase();
      const lowerTitle = g.title.toLowerCase();

      if (
        lowerSlug === 'polytrack-kinematics' ||
        lowerSlug === 'polytrack' ||
        lowerTitle.includes('polytrack')
      ) {
        return {
          ...g,
          mode: 'embed',
          embed_url: '/modules/polytrack/index.html',
          external_url: null,
        };
      }

      if (
        lowerSlug === 'retrobowl-kinematics' ||
        lowerSlug === 'retro-bowl' ||
        lowerTitle.includes('retro bowl')
      ) {
        return {
          ...g,
          mode: 'embed',
          embed_url: 'https://retro-bowl-six.vercel.app/',
          external_url: null,
        };
      }

      if (
        lowerSlug === 'drivemad-kinematics' ||
        lowerSlug === 'drive-mad' ||
        lowerTitle.includes('drive mad')
      ) {
        return {
          ...g,
          mode: 'embed',
          embed_url: '/modules/drive-mad/index.html',
          external_url: null,
        };
      }

      return g;
    });

  const existingSlugs = new Set(normalized.map((g) => g.slug));

  for (const bp of DEFAULT_EMBEDDED_BLUEPRINTS) {
    if (existingSlugs.has(bp.slug)) continue;
    normalized.push({
      id: `default-${bp.slug}`,
      slug: bp.slug,
      title: bp.title,
      description: bp.description,
      category_id: categoryBySlug.get(bp.categorySlug) ?? fallbackCategoryId,
      thumbnail_url: '',
      mode: 'embed',
      embed_url: bp.embed_url,
      external_url: null,
      is_active: true,
      created_at: new Date(0).toISOString(),
    });
  }

  return normalized;
}
