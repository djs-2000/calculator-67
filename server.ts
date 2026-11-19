import crypto from 'crypto';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { type Request, type Response } from 'express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const SUPABASE_URL = (process.env.SUPABASE_URL ?? '').trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').trim();
const ACCESS_TOKEN_SECRET = (process.env.ACCESS_TOKEN_SECRET ?? '').trim();

function isSupabaseConfigured(): boolean {
  return (
    Boolean(SUPABASE_URL) &&
    Boolean(SUPABASE_SERVICE_ROLE_KEY) &&
    !SUPABASE_URL.includes('your-project-ref') &&
    !SUPABASE_SERVICE_ROLE_KEY.includes('your-supabase')
  );
}

let cachedAdminClient: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return cachedAdminClient;
}

function sha256Hex(input: string): string {
  return crypto
    .createHash('sha256')
    .update(`${ACCESS_TOKEN_SECRET}:${input}`)
    .digest('hex');
}

function generateSecureCode(length = 10): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
    if (i === 4) out += '-';
  }
  return out;
}

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

async function requireAdmin(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { unconfigured: true as const };

  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return null;

  const { data: userData, error } = await supabase.auth.getUser(token);
  if (error || !userData?.user) return null;

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('user_id, email, role')
    .eq('user_id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!adminRow) return null;
  return { supabase, user: userData.user, admin: adminRow };
}

async function verifyVisitorOrAdmin(req: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { authorized: false as const, unconfigured: true as const };

  const adminCheck = await requireAdmin(req);
  if (adminCheck && !('unconfigured' in adminCheck)) {
    return { authorized: true as const, role: 'admin' as const, supabase };
  }

  const rawSession = req.headers['x-access-session'];
  const sessionToken = typeof rawSession === 'string' ? rawSession.trim() : '';
  if (!sessionToken) return { authorized: false as const };

  const tokenHash = sha256Hex(sessionToken);
  const { data: session } = await supabase
    .from('access_sessions')
    .select('id, expires_at, revoked_at, access_code_id, access_codes!inner(is_active, revoked_at, expires_at)')
    .eq('token_hash', tokenHash)
    .is('revoked_at', null)
    .maybeSingle();

  if (!session) return { authorized: false as const };
  const now = Date.now();
  if (new Date(session.expires_at).getTime() <= now) {
    return { authorized: false as const };
  }

  const codeInfo = Array.isArray(session.access_codes)
    ? session.access_codes[0]
    : session.access_codes;
  if (!codeInfo || !codeInfo.is_active || codeInfo.revoked_at) {
    return { authorized: false as const };
  }
  if (codeInfo.expires_at && new Date(codeInfo.expires_at).getTime() <= now) {
    return { authorized: false as const };
  }

  return {
    authorized: true as const,
    role: 'visitor' as const,
    expiresAt: session.expires_at,
    supabase,
  };
}

function sendUnconfigured(res: Response) {
  res.status(503).json({
    error:
      'Supabase server credentials are not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.',
    unconfigured: true,
  });
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      supabaseConfigured: isSupabaseConfigured(),
    });
  });

  // Verify visitor access code (rate-limited, server-side hash check)
  app.post('/api/access/verify', async (req, res) => {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      sendUnconfigured(res);
      return;
    }

    const clientIp =
      (typeof req.headers['cf-connecting-ip'] === 'string'
        ? req.headers['cf-connecting-ip']
        : req.ip) || 'unknown';
    const ipHash = sha256Hex(`ip:${clientIp}`);
    const now = new Date();

    const { data: limitRow } = await supabase
      .from('access_rate_limits')
      .select('attempts, window_started_at, blocked_until')
      .eq('ip_hash', ipHash)
      .maybeSingle();

    if (
      limitRow?.blocked_until &&
      new Date(limitRow.blocked_until).getTime() > now.getTime()
    ) {
      res
        .status(429)
        .json({ error: 'Too many invalid attempts. Please try again later.' });
      return;
    }

    const rawCode = (req.body as { code?: unknown })?.code;
    const code = typeof rawCode === 'string' ? rawCode.trim() : '';
    if (!code || code.length < 4 || code.length > 64) {
      res.status(400).json({ error: 'Invalid access code.' });
      return;
    }

    const codeHash = sha256Hex(`code:${code}`);
    const { data: codeRow } = await supabase
      .from('access_codes')
      .select('id, is_active, expires_at, revoked_at')
      .eq('code_hash', codeHash)
      .maybeSingle();

    const isValid =
      Boolean(codeRow) &&
      codeRow!.is_active &&
      !codeRow!.revoked_at &&
      (!codeRow!.expires_at ||
        new Date(codeRow!.expires_at).getTime() > now.getTime());

    if (!isValid) {
      const windowExpired =
        !limitRow ||
        now.getTime() - new Date(limitRow.window_started_at).getTime() > WINDOW_MS;
      const nextAttempts = windowExpired ? 1 : (limitRow?.attempts ?? 0) + 1;
      const blockedUntil =
        nextAttempts >= MAX_ATTEMPTS
          ? new Date(now.getTime() + WINDOW_MS).toISOString()
          : null;

      await supabase.from('access_rate_limits').upsert({
        ip_hash: ipHash,
        attempts: nextAttempts,
        window_started_at: windowExpired
          ? now.toISOString()
          : limitRow!.window_started_at,
        blocked_until: blockedUntil,
      });

      res.status(nextAttempts >= MAX_ATTEMPTS ? 429 : 401).json({
        error:
          nextAttempts >= MAX_ATTEMPTS
            ? 'Too many invalid attempts. Please try again later.'
            : 'Invalid or expired access code.',
      });
      return;
    }

    await supabase.from('access_rate_limits').delete().eq('ip_hash', ipHash);

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256Hex(sessionToken);

    let expiresAtMs = now.getTime() + 8 * 60 * 60 * 1000;
    if (codeRow!.expires_at) {
      expiresAtMs = Math.min(expiresAtMs, new Date(codeRow!.expires_at).getTime());
    }
    const expiresAt = new Date(expiresAtMs).toISOString();

    const { error: insertErr } = await supabase.from('access_sessions').insert({
      token_hash: tokenHash,
      access_code_id: codeRow!.id,
      expires_at: expiresAt,
    });

    if (insertErr) {
      res.status(500).json({ error: 'Unable to issue session.' });
      return;
    }

    res.json({ authorized: true, sessionToken, expiresAt });
  });

  app.get('/api/access/session', async (req, res) => {
    const check = await verifyVisitorOrAdmin(req);
    if ('unconfigured' in check && check.unconfigured) {
      sendUnconfigured(res);
      return;
    }
    if (!check.authorized) {
      res.status(401).json({ authorized: false });
      return;
    }
    res.json({
      authorized: true,
      role: check.role,
      expiresAt: 'expiresAt' in check ? check.expiresAt : null,
    });
  });

  // Protected games catalog endpoint
  app.get('/api/games', async (req, res) => {
    const check = await verifyVisitorOrAdmin(req);
    if ('unconfigured' in check && check.unconfigured) {
      sendUnconfigured(res);
      return;
    }
    if (!check.authorized) {
      res.status(401).json({ error: 'Authorization required.' });
      return;
    }

    const [{ data: categories, error: catErr }, { data: games, error: gameErr }] =
      await Promise.all([
        check.supabase
          .from('game_categories')
          .select('id, name, slug, sort_order')
          .order('sort_order', { ascending: true }),
        check.supabase
          .from('games')
          .select('id, slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active, created_at')
          .eq('is_active', true)
          .order('title', { ascending: true }),
      ]);

    if (catErr || gameErr) {
      res.status(500).json({ error: 'Unable to load games catalog.' });
      return;
    }

    res.json({ categories: categories ?? [], games: games ?? [] });
  });

  // Admin role check
  app.get('/api/admin/me', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }
    res.json({ admin: admin.admin });
  });

  // Admin access code management
  app.get('/api/admin/access-codes', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { data, error } = await admin.supabase
      .from('access_codes')
      .select('id, code_prefix, label, is_active, expires_at, revoked_at, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to load access codes.' });
      return;
    }
    res.json({ codes: data ?? [] });
  });

  app.post('/api/admin/access-codes', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const body = (req.body ?? {}) as {
      action?: 'generate' | 'rotate';
      label?: string;
      expiresInHours?: number | null;
    };
    const action = body.action === 'rotate' ? 'rotate' : 'generate';
    const label =
      typeof body.label === 'string' ? body.label.trim().slice(0, 80) : null;
    const expiresInHours =
      typeof body.expiresInHours === 'number' && body.expiresInHours > 0
        ? Math.min(body.expiresInHours, 24 * 365)
        : null;

    const nowIso = new Date().toISOString();

    if (action === 'rotate') {
      const { data: activeCodes } = await admin.supabase
        .from('access_codes')
        .select('id')
        .eq('is_active', true);

      await admin.supabase
        .from('access_codes')
        .update({ is_active: false, revoked_at: nowIso })
        .eq('is_active', true);

      if (activeCodes && activeCodes.length > 0) {
        await admin.supabase
          .from('access_sessions')
          .update({ revoked_at: nowIso })
          .in(
            'access_code_id',
            activeCodes.map((c) => c.id)
          )
          .is('revoked_at', null);
      }
    }

    const plaintextCode = generateSecureCode(10);
    const codeHash = sha256Hex(`code:${plaintextCode}`);
    const codePrefix = plaintextCode.slice(0, 4);
    const expiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
      : null;

    const { data: created, error } = await admin.supabase
      .from('access_codes')
      .insert({
        code_hash: codeHash,
        code_prefix: codePrefix,
        label,
        is_active: true,
        expires_at: expiresAt,
        created_by: admin.user.id,
      })
      .select('id, code_prefix, label, is_active, expires_at, revoked_at, created_at')
      .single();

    if (error || !created) {
      res.status(500).json({ error: 'Unable to generate access code.' });
      return;
    }

    res.status(201).json({ code: created, plaintextCode });
  });

  app.delete('/api/admin/access-codes', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
    if (!id) {
      res.status(400).json({ error: 'Missing code id.' });
      return;
    }

    const nowIso = new Date().toISOString();
    await admin.supabase
      .from('access_codes')
      .update({ is_active: false, revoked_at: nowIso })
      .eq('id', id);

    await admin.supabase
      .from('access_sessions')
      .update({ revoked_at: nowIso })
      .eq('access_code_id', id)
      .is('revoked_at', null);

    res.json({ revoked: true });
  });

  // Admin games CRUD
  app.get('/api/admin/games', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { data, error } = await admin.supabase
      .from('games')
      .select('id, slug, title, description, category_id, thumbnail_url, play_mode, embed_url, external_url, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: 'Failed to load games.' });
      return;
    }
    res.json({ games: data ?? [] });
  });

  app.post('/api/admin/games', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 80) : '';
    const description =
      typeof body.description === 'string' ? body.description.trim().slice(0, 320) : '';
    const categoryId = typeof body.category_id === 'string' ? body.category_id.trim() : '';
    const playMode =
      body.play_mode === 'builtin' || body.play_mode === 'embed' || body.play_mode === 'external'
        ? body.play_mode
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
      res.status(400).json({ error: 'Title, description, and category are required.' });
      return;
    }
    if (playMode === 'embed' && (!embedUrl || !isValidHttpUrl(embedUrl))) {
      res.status(400).json({ error: 'A valid HTTP(S) embed URL is required.' });
      return;
    }
    if (playMode === 'external' && (!externalUrl || !isValidHttpUrl(externalUrl))) {
      res.status(400).json({ error: 'A valid HTTP(S) external URL is required.' });
      return;
    }

    const baseSlug = slugify(typeof body.slug === 'string' && body.slug ? body.slug : title);
    const slug = baseSlug || `game-${Date.now()}`;

    const { data, error } = await admin.supabase
      .from('games')
      .insert({
        slug,
        title,
        description,
        category_id: categoryId,
        thumbnail_url: thumbnailUrl,
        play_mode: playMode,
        embed_url: embedUrl,
        external_url: externalUrl,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Unable to create game.' });
      return;
    }
    res.status(201).json({ game: data });
  });

  app.put('/api/admin/games', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 80) : '';
    const description =
      typeof body.description === 'string' ? body.description.trim().slice(0, 320) : '';
    const categoryId = typeof body.category_id === 'string' ? body.category_id.trim() : '';
    const playMode =
      body.play_mode === 'builtin' || body.play_mode === 'embed' || body.play_mode === 'external'
        ? body.play_mode
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

    if (!id || !title || !description || !categoryId) {
      res.status(400).json({ error: 'Missing required game fields.' });
      return;
    }
    if (playMode === 'embed' && (!embedUrl || !isValidHttpUrl(embedUrl))) {
      res.status(400).json({ error: 'A valid HTTP(S) embed URL is required.' });
      return;
    }
    if (playMode === 'external' && (!externalUrl || !isValidHttpUrl(externalUrl))) {
      res.status(400).json({ error: 'A valid HTTP(S) external URL is required.' });
      return;
    }

    const { data, error } = await admin.supabase
      .from('games')
      .update({
        title,
        description,
        category_id: categoryId,
        thumbnail_url: thumbnailUrl,
        play_mode: playMode,
        embed_url: embedUrl,
        external_url: externalUrl,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Unable to update game.' });
      return;
    }
    res.json({ game: data });
  });

  app.delete('/api/admin/games', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
    if (!id) {
      res.status(400).json({ error: 'Missing game id.' });
      return;
    }

    const { error } = await admin.supabase.from('games').delete().eq('id', id);
    if (error) {
      res.status(400).json({ error: 'Unable to delete game.' });
      return;
    }
    res.json({ deleted: true });
  });

  // Admin category CRUD
  app.get('/api/admin/categories', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const { data, error } = await admin.supabase
      .from('game_categories')
      .select('id, name, slug, sort_order, created_at')
      .order('sort_order', { ascending: true });

    if (error) {
      res.status(500).json({ error: 'Failed to load categories.' });
      return;
    }
    res.json({ categories: data ?? [] });
  });

  app.post('/api/admin/categories', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const rawName = (req.body as { name?: unknown })?.name;
    const name = typeof rawName === 'string' ? rawName.trim().slice(0, 40) : '';
    if (!name) {
      res.status(400).json({ error: 'Category name is required.' });
      return;
    }
    const slug = slugify(name);
    if (!slug) {
      res.status(400).json({ error: 'Invalid category name.' });
      return;
    }

    const { data, error } = await admin.supabase
      .from('game_categories')
      .insert({ name, slug, sort_order: 50 })
      .select()
      .single();

    if (error) {
      res.status(400).json({ error: 'Unable to create category.' });
      return;
    }
    res.status(201).json({ category: data });
  });

  app.delete('/api/admin/categories', async (req, res) => {
    const admin = await requireAdmin(req);
    if (admin && 'unconfigured' in admin) {
      sendUnconfigured(res);
      return;
    }
    if (!admin) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
    if (!id) {
      res.status(400).json({ error: 'Missing category id.' });
      return;
    }

    const { error } = await admin.supabase.from('game_categories').delete().eq('id', id);
    if (error) {
      res.status(400).json({
        error: 'Cannot delete a category that still has assigned games.',
      });
      return;
    }
    res.json({ deleted: true });
  });

  const httpServer = http.createServer(app);

  if (IS_PROD) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Calculator running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
