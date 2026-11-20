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
    embed_url: 'https://joe-the-chicken.github.io/polytrack/',
  },
  {
    slug: 'retrobowl-kinematics',
    title: 'Retro Bowl — Parabolic Trajectory & Expected Value Lab',
    description:
      'Applied probability and projectile mechanics simulation modeling parabolic release angles, lateral intercept vectors, expected-value decision trees, and discrete interval budgeting.',
    categorySlug: 'tactics-logic',
    embed_url: 'https://game316009.konggames.com/gamez/0031/6009/live/index.html',
  },
];

export function mergeDefaultEmbeddedModules(
  guides: GuideItem[],
  categories: GuideCategory[]
): GuideItem[] {
  const existingSlugs = new Set(guides.map((g) => g.slug));
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const fallbackCategoryId = categories[0]?.id ?? 'general';
  const merged = [...guides];

  for (const bp of DEFAULT_EMBEDDED_BLUEPRINTS) {
    if (existingSlugs.has(bp.slug)) continue;
    merged.push({
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

  return merged;
}
