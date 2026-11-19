import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { verifyVisitorOrAdmin } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const auth = await verifyVisitorOrAdmin(req);
    if (!auth.authorized) {
      return jsonResponse({ error: 'Authorization required.' }, 401);
    }

    const [{ data: categories, error: catErr }, { data: games, error: gameErr }] =
      await Promise.all([
        auth.supabase
          .from('game_categories')
          .select('id, name, slug, sort_order')
          .order('sort_order', { ascending: true }),
        auth.supabase
          .from('games')
          .select('id, slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active, created_at')
          .eq('is_active', true)
          .order('title', { ascending: true }),
      ]);

    if (catErr || gameErr) {
      return jsonResponse({ error: 'Unable to load catalog.' }, 500);
    }

    return jsonResponse({
      categories: categories ?? [],
      games: games ?? [],
    });
  } catch {
    return jsonResponse({ error: 'Catalog service unavailable.' }, 500);
  }
});
