import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAdmin } from '../_shared/auth.ts';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const admin = await requireAdmin(req);
    if (!admin) return jsonResponse({ error: 'Unauthorized.' }, 401);
    const { supabase } = admin;

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('game_categories')
        .select('id, name, slug, sort_order, created_at')
        .order('sort_order', { ascending: true });
      if (error) return jsonResponse({ error: 'Failed to load categories.' }, 500);
      return jsonResponse({ categories: data ?? [] });
    }

    if (req.method === 'POST') {
      const body = (await req.json().catch(() => ({}))) as { name?: string };
      const name = typeof body.name === 'string' ? body.name.trim().slice(0, 40) : '';
      if (!name) return jsonResponse({ error: 'Category name is required.' }, 400);
      const slug = slugify(name);
      if (!slug) return jsonResponse({ error: 'Invalid category name.' }, 400);

      const { data, error } = await supabase
        .from('game_categories')
        .insert({ name, slug, sort_order: 50 })
        .select()
        .single();
      if (error) return jsonResponse({ error: 'Unable to create category.' }, 400);
      return jsonResponse({ category: data }, 201);
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id')?.trim() ?? '';
      if (!id) return jsonResponse({ error: 'Missing category id.' }, 400);
      const { error } = await supabase.from('game_categories').delete().eq('id', id);
      if (error) {
        return jsonResponse(
          { error: 'Cannot delete a category that still has assigned games.' },
          400
        );
      }
      return jsonResponse({ deleted: true });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch {
    return jsonResponse({ error: 'Category service unavailable.' }, 500);
  }
});
