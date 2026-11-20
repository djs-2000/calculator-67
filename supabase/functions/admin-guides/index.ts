import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAdmin } from '../_shared/auth.ts';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

function mapGuideRow(row: Record<string, unknown>) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category_id: row.category_id,
    thumbnail_url: row.thumbnail_url,
    mode: row.play_mode,
    embed_url: row.embed_url,
    external_url: row.external_url,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
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
        .from('games')
        .select(
          'id, slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active, created_at, updated_at'
        )
        .order('created_at', { ascending: false });
      if (error) return jsonResponse({ error: 'Failed to load guides.' }, 500);
      return jsonResponse({ guides: (data ?? []).map(mapGuideRow) });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
      const id = typeof body.id === 'string' ? body.id.trim() : '';
      const title = typeof body.title === 'string' ? body.title.trim().slice(0, 80) : '';
      const description =
        typeof body.description === 'string' ? body.description.trim().slice(0, 320) : '';
      const categoryId = typeof body.category_id === 'string' ? body.category_id.trim() : '';
      const rawMode = body.mode ?? body.play_mode;
      const mode =
        rawMode === 'builtin' || rawMode === 'embed' || rawMode === 'external'
          ? rawMode
          : 'external';
      const thumbnailUrl =
        typeof body.thumbnail_url === 'string' ? body.thumbnail_url.trim().slice(0, 400) : '';
      const embedUrl =
        typeof body.embed_url === 'string' && body.embed_url.trim()
          ? body.embed_url.trim().slice(0, 500)
          : null;
      const externalUrl =
        typeof body.external_url === 'string' && body.external_url.trim()
          ? body.external_url.trim().slice(0, 500)
          : null;
      const isActive = typeof body.is_active === 'boolean' ? body.is_active : true;

      if (!title || !description || !categoryId) {
        return jsonResponse({ error: 'Title, description, and category are required.' }, 400);
      }
      if (mode === 'embed' && (!embedUrl || !isValidHttpUrl(embedUrl))) {
        return jsonResponse({ error: 'A valid HTTP(S) embed URL is required.' }, 400);
      }
      if (mode === 'external' && (!externalUrl || !isValidHttpUrl(externalUrl))) {
        return jsonResponse({ error: 'A valid HTTP(S) external URL is required.' }, 400);
      }

      if (req.method === 'POST') {
        const baseSlug = slugify(typeof body.slug === 'string' && body.slug ? body.slug : title);
        const slug = baseSlug || `guide-${Date.now()}`;
        const { data, error } = await supabase
          .from('games')
          .insert({
            slug,
            title,
            description,
            category_id: categoryId,
            thumbnail_url: thumbnailUrl,
            play_mode: mode,
            embed_url: embedUrl,
            external_url: externalUrl,
            is_active: isActive,
          })
          .select()
          .single();

        if (error || !data) return jsonResponse({ error: 'Unable to add guide.' }, 400);
        return jsonResponse({ guide: mapGuideRow(data) }, 201);
      } else {
        if (!id) return jsonResponse({ error: 'Missing guide id.' }, 400);
        const { data, error } = await supabase
          .from('games')
          .update({
            title,
            description,
            category_id: categoryId,
            thumbnail_url: thumbnailUrl,
            play_mode: mode,
            embed_url: embedUrl,
            external_url: externalUrl,
            is_active: isActive,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (error || !data) return jsonResponse({ error: 'Unable to update guide.' }, 400);
        return jsonResponse({ guide: mapGuideRow(data) });
      }
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id')?.trim() ?? '';
      if (!id) return jsonResponse({ error: 'Missing guide id.' }, 400);
      const { error } = await supabase.from('games').delete().eq('id', id);
      if (error) return jsonResponse({ error: 'Unable to delete guide.' }, 400);
      return jsonResponse({ deleted: true });
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  } catch {
    return jsonResponse({ error: 'Guides management service unavailable.' }, 500);
  }
});
