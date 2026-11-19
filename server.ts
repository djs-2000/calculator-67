import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

interface ChatMessage {
  id: string;
  room: string;
  author: string;
  text: string;
  timestamp: number;
}

interface ScoreEntry {
  game: string;
  player: string;
  score: number;
  timestamp: number;
}

const VALID_ROOMS = ['general', 'games', 'study-hall'] as const;
const VALID_VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;

const messagesByRoom = new Map<string, ChatMessage[]>([
  [
    'general',
    [
      {
        id: 'seed-1',
        room: 'general',
        author: 'system',
        text: 'Welcome to #general. Type 67 = on the calculator anytime to return here.',
        timestamp: Date.now() - 120000,
      },
    ],
  ],
  [
    'games',
    [
      {
        id: 'seed-2',
        room: 'games',
        author: 'system',
        text: 'Share high scores for Snake, 2048, and Breakout here.',
        timestamp: Date.now() - 90000,
      },
    ],
  ],
  [
    'study-hall',
    [
      {
        id: 'seed-3',
        room: 'study-hall',
        author: 'system',
        text: 'Press Esc at any time to cloak back into Calculator mode.',
        timestamp: Date.now() - 60000,
      },
    ],
  ],
]);

const highScores = new Map<string, ScoreEntry[]>([
  ['snake', []],
  ['2048', []],
  ['breakout', []],
]);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, status: 'running' });
  });

  // Safe YouTube metadata lookup via oEmbed
  app.get('/api/video-info', async (req, res) => {
    const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
    if (!VALID_VIDEO_ID.test(id)) {
      res.status(400).json({ error: 'Invalid YouTube video ID' });
      return;
    }

    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${id}`
      )}&format=json`;
      const response = await fetch(oembedUrl, {
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        res.json({
          id,
          title: `YouTube Video (${id})`,
          author_name: 'YouTube',
          thumbnail_url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        });
        return;
      }

      const data = (await response.json()) as {
        title?: string;
        author_name?: string;
        thumbnail_url?: string;
      };
      res.json({
        id,
        title: data.title || `YouTube Video (${id})`,
        author_name: data.author_name || 'YouTube',
        thumbnail_url:
          data.thumbnail_url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      });
    } catch {
      res.json({
        id,
        title: `YouTube Video (${id})`,
        author_name: 'YouTube',
        thumbnail_url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      });
    }
  });

  // Safe YouTube search proxy (parses public search results page)
  app.get('/api/youtube-search', async (req, res) => {
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!query || query.length > 120) {
      res.status(400).json({ error: 'Provide a valid search query' });
      return;
    }

    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        query
      )}`;
      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        res.json({ results: [], fallback: true });
        return;
      }

      const html = await response.text();
      const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
      if (!match) {
        res.json({ results: [], fallback: true });
        return;
      }

      const initialData = JSON.parse(match[1]) as Record<string, unknown>;
      const results: Array<{
        id: string;
        title: string;
        channel: string;
        thumbnail: string;
      }> = [];
      const seen = new Set<string>();

      const walk = (node: unknown) => {
        if (!node || typeof node !== 'object' || results.length >= 12) return;
        if (Array.isArray(node)) {
          for (const item of node) walk(item);
          return;
        }
        const record = node as Record<string, unknown>;
        if (
          record.videoRenderer &&
          typeof record.videoRenderer === 'object'
        ) {
          const vr = record.videoRenderer as Record<string, unknown>;
          const videoId = typeof vr.videoId === 'string' ? vr.videoId : '';
          if (VALID_VIDEO_ID.test(videoId) && !seen.has(videoId)) {
            seen.add(videoId);
            const titleObj = vr.title as
              | { runs?: Array<{ text?: string }> }
              | undefined;
            const ownerObj = vr.ownerText as
              | { runs?: Array<{ text?: string }> }
              | undefined;
            const title =
              titleObj?.runs?.map((r) => r.text ?? '').join('') ||
              'Untitled Video';
            const channel =
              ownerObj?.runs?.map((r) => r.text ?? '').join('') || 'YouTube';
            results.push({
              id: videoId,
              title,
              channel,
              thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            });
          }
        }
        for (const key of Object.keys(record)) {
          walk(record[key]);
        }
      };

      walk(initialData);
      res.json({ results, fallback: false });
    } catch {
      res.json({ results: [], fallback: true });
    }
  });

  // In-memory messaging endpoints
  app.get('/api/messages', (req, res) => {
    const room =
      typeof req.query.room === 'string' &&
      VALID_ROOMS.includes(req.query.room as (typeof VALID_ROOMS)[number])
        ? req.query.room
        : 'general';
    res.json({ room, messages: messagesByRoom.get(room) ?? [] });
  });

  app.post('/api/messages', (req, res) => {
    const { room, author, text } = req.body as {
      room?: string;
      author?: string;
      text?: string;
    };
    const safeRoom =
      room && VALID_ROOMS.includes(room as (typeof VALID_ROOMS)[number])
        ? room
        : 'general';
    const safeAuthor = (author ?? 'anon').trim().slice(0, 24) || 'anon';
    const safeText = (text ?? '').trim().slice(0, 500);

    if (!safeText) {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      room: safeRoom,
      author: safeAuthor,
      text: safeText,
      timestamp: Date.now(),
    };

    const list = messagesByRoom.get(safeRoom) ?? [];
    list.push(msg);
    if (list.length > 100) list.shift();
    messagesByRoom.set(safeRoom, list);

    broadcastWs({ type: 'chat:message', message: msg });
    res.status(201).json({ message: msg });
  });

  // In-memory high score leaderboard
  app.get('/api/scores', (req, res) => {
    const game = typeof req.query.game === 'string' ? req.query.game : 'snake';
    res.json({ game, scores: highScores.get(game) ?? [] });
  });

  app.post('/api/scores', (req, res) => {
    const { game, player, score } = req.body as {
      game?: string;
      player?: string;
      score?: number;
    };
    if (!game || !highScores.has(game) || typeof score !== 'number') {
      res.status(400).json({ error: 'Invalid score payload' });
      return;
    }

    const list = highScores.get(game) ?? [];
    list.push({
      game,
      player: (player ?? 'anon').trim().slice(0, 20) || 'anon',
      score: Math.max(0, Math.floor(score)),
      timestamp: Date.now(),
    });
    list.sort((a, b) => b.score - a.score);
    highScores.set(game, list.slice(0, 10));
    res.status(201).json({ scores: highScores.get(game) });
  });

  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  function broadcastWs(payload: unknown) {
    const serialized = JSON.stringify(payload);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized);
      }
    }
  }

  wss.on('connection', (ws) => {
    broadcastWs({ type: 'presence', count: wss.clients.size });

    ws.on('close', () => {
      broadcastWs({ type: 'presence', count: wss.clients.size });
    });
  });

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
    console.log(`Calculator 67 running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
