import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { verifyVisitorOrAdmin } from '../_shared/auth.ts';

const LEGACY_CATEGORY_MAP: Record<string, { name: string; slug: string }> = {
  arcade: { name: 'Spatial Mechanics', slug: 'spatial-mechanics' },
  puzzle: { name: 'Number & Grid', slug: 'number-grid' },
  strategy: { name: 'Tactics & Logic', slug: 'tactics-logic' },
  racing: { name: 'Physics & Motion', slug: 'physics-motion' },
  platformer: { name: 'Sequence & Timing', slug: 'sequence-timing' },
  multiplayer: { name: 'Collaborative', slug: 'collaborative' },
  casual: { name: 'Quick Reference', slug: 'quick-reference' },
  other: { name: 'General', slug: 'general' },
};

const LEGACY_GUIDE_MAP: Record<
  string,
  { slug: string; title: string; description: string; thumbnail_url: string }
> = {
  snake: {
    slug: 'grid-path',
    title: 'Grid Pathing Guide',
    description:
      'Step-by-step guide to Hamiltonian path planning, turning radius control, and spatial efficiency on a bounded grid.',
    thumbnail_url: 'builtin:grid-path',
  },
  '2048': {
    slug: 'powers-merge',
    title: 'Powers of Two Merge Guide',
    description:
      'Walkthrough of corner-anchoring heuristics, monotonic row ordering, and exponential tile-merging on a 4x4 grid.',
    thumbnail_url: 'builtin:powers-merge',
  },
  breakout: {
    slug: 'elastic-reflection',
    title: 'Elastic Reflection Guide',
    description:
      'Visual guide to rebound angle geometry, momentum deflection, and target-clearing sequencing with a live canvas.',
    thumbnail_url: 'builtin:elastic-reflection',
  },
  minesweeper: {
    slug: 'adjacency-deduction',
    title: 'Adjacency Deduction Guide',
    description:
      'Logical deduction guide covering numeric neighborhood constraints and safe-cell elimination on a matrix.',
    thumbnail_url: 'builtin:adjacency-deduction',
  },
  lichess: {
    slug: 'open-chess-study',
    title: 'Classical Board Tactics Guide',
    description:
      'Structured guide to opening principles, tactical forks, endgame calculation, and official external study boards.',
    thumbnail_url: '',
  },
  'slow-roads': {
    slug: 'procedural-terrain',
    title: 'Procedural Horizon Guide',
    description:
      'Guide to procedural terrain generation, steering curve dynamics, and endless horizon rendering at the official showcase.',
    thumbnail_url: '',
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const auth = await verifyVisitorOrAdmin(req);
    if (!auth.authorized) {
      return jsonResponse({ error: 'Authorization required.' }, 401);
    }

    const [{ data: rawCategories, error: catErr }, { data: rawItems, error: itemErr }] =
      await Promise.all([
        auth.supabase
          .from('game_categories')
          .select('id, name, slug, sort_order')
          .order('sort_order', { ascending: true }),
        auth.supabase
          .from('games')
          .select(
            'id, slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active, created_at'
          )
          .eq('is_active', true)
          .order('title', { ascending: true }),
      ]);

    if (catErr || itemErr) {
      return jsonResponse({ error: 'Unable to load catalog.' }, 500);
    }

    const categories = (rawCategories ?? []).map((cat) => {
      const mapped = LEGACY_CATEGORY_MAP[cat.slug];
      return mapped
        ? { ...cat, name: mapped.name, slug: mapped.slug }
        : cat;
    });

    const guides = (rawItems ?? []).map((item) => {
      const mapped = LEGACY_GUIDE_MAP[item.slug];
      const resolvedSlug = mapped ? mapped.slug : item.slug;
      const resolvedEmbedUrl =
        resolvedSlug === 'polytrack-kinematics' &&
        typeof item.embed_url === 'string' &&
        item.embed_url.includes('github.io/polytrack')
          ? '/modules/polytrack/index.html'
          : item.embed_url;
      return {
        id: item.id,
        slug: resolvedSlug,
        title: mapped ? mapped.title : item.title,
        description: mapped ? mapped.description : item.description,
        category_id: item.category_id,
        thumbnail_url: mapped ? mapped.thumbnail_url : item.thumbnail_url,
        mode: item.play_mode,
        embed_url: resolvedEmbedUrl,
        external_url: item.external_url,
        is_active: item.is_active,
        created_at: item.created_at,
      };
    });

    const catBySlug = new Map(categories.map((c) => [c.slug, c.id]));
    const fallbackCatId = categories[0]?.id ?? 'general';
    const existingSlugs = new Set(guides.map((g) => g.slug));

    const defaultEmbeds = [
      {
        slug: 'polytrack-kinematics',
        title: 'PolyTrack — Spline Kinematics & Friction Lab',
        description:
          'Interactive low-poly kinematic simulation analyzing centripetal acceleration, banked-curve friction limits, spline curvature optimization, and angular momentum across bounded tracks.',
        category_id: catBySlug.get('physics-motion') ?? fallbackCatId,
        embed_url: '/modules/polytrack/index.html',
      },
      {
        slug: 'retrobowl-kinematics',
        title: 'Retro Bowl — Parabolic Trajectory & Expected Value Lab',
        description:
          'Applied probability and projectile mechanics simulation modeling parabolic release angles, lateral intercept vectors, expected-value decision trees, and discrete interval budgeting.',
        category_id: catBySlug.get('tactics-logic') ?? fallbackCatId,
        embed_url: 'https://retro-bowl-six.vercel.app/',
      },
      {
        slug: 'drivemad-kinematics',
        title: 'Drive Mad — Torque Equilibrium & Suspension Lab',
        description:
          'Rigid-body mechanics simulation investigating rotational torque, center-of-mass balance, suspension impulse damping, and wheel-surface static friction across irregular terrain.',
        category_id: catBySlug.get('physics-motion') ?? fallbackCatId,
        embed_url: 'https://www.drivemad.com/',
      },
    ];

    for (const emb of defaultEmbeds) {
      if (existingSlugs.has(emb.slug)) continue;
      guides.push({
        id: `default-${emb.slug}`,
        slug: emb.slug,
        title: emb.title,
        description: emb.description,
        category_id: emb.category_id,
        thumbnail_url: '',
        mode: 'embed',
        embed_url: emb.embed_url,
        external_url: null,
        is_active: true,
        created_at: new Date(0).toISOString(),
      });
    }

    return jsonResponse({ categories, guides });
  } catch {
    return jsonResponse({ error: 'Catalog service unavailable.' }, 500);
  }
});
