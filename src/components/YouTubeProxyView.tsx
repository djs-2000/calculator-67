import React, { useState } from 'react';
import { Play, Search, Link2, Tv, ExternalLink, Trash2 } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

const STARTER_VIDEOS: VideoItem[] = [
  {
    id: 'jfKfPfyJRdk',
    title: 'lofi hip hop radio 📚 - beats to relax/study to',
    channel: 'Lofi Girl',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
    channel: 'Rick Astley',
    thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  },
  {
    id: 'aqz-KE-bpKQ',
    title: 'Big Buck Bunny 60fps 4K - Blender Open Movie',
    channel: 'Blender Foundation',
    thumbnail: 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg',
  },
  {
    id: 'rfscVS0vtbw',
    title: 'Learn Python - Full Course for Beginners',
    channel: 'freeCodeCamp.org',
    thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg',
  },
];

function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
    const vParam = url.searchParams.get('v');
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;
    const parts = url.pathname.split('/').filter(Boolean);
    const embedIdx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live');
    if (embedIdx !== -1 && parts[embedIdx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[embedIdx + 1])) {
      return parts[embedIdx + 1];
    }
  } catch {
    return null;
  }
  return null;
}

export const YouTubeProxyView: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(STARTER_VIDEOS[0]);
  const [urlInput, setUrlInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<VideoItem[]>(STARTER_VIDEOS);
  const [recentQueue, setRecentQueue] = useState<VideoItem[]>(STARTER_VIDEOS);
  const [searching, setSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const playVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setRecentQueue((prev) => {
      const filtered = prev.filter((item) => item.id !== video.id);
      return [video, ...filtered].slice(0, 12);
    });
  };

  const handleLoadUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    const id = extractYouTubeId(urlInput);
    if (!id) {
      setStatusMessage('Enter a valid YouTube URL or 11-character video ID.');
      return;
    }

    try {
      const res = await fetch(`/api/video-info?id=${encodeURIComponent(id)}`);
      const data = (await res.json()) as {
        id: string;
        title: string;
        author_name: string;
        thumbnail_url: string;
      };
      playVideo({
        id: data.id,
        title: data.title,
        channel: data.author_name,
        thumbnail: data.thumbnail_url,
      });
      setUrlInput('');
    } catch {
      playVideo({
        id,
        title: `YouTube Video (${id})`,
        channel: 'YouTube',
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      });
      setUrlInput('');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    setSearching(true);
    setStatusMessage(null);

    try {
      const res = await fetch(`/api/youtube-search?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as {
        results: VideoItem[];
        fallback?: boolean;
      };
      if (data.results && data.results.length > 0) {
        setSearchResults(data.results);
      } else {
        setStatusMessage(
          'Live search returned no results in this network environment. You can still paste any YouTube URL above.'
        );
      }
    } catch {
      setStatusMessage('Search unavailable right now — paste a direct YouTube URL above.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Player & Controls */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="aspect-video bg-black relative">
            <iframe
              key={activeVideo.id}
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?rel=0`}
              title={activeVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800">
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100 truncate">
                {activeVideo.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-emerald-400" />
                {activeVideo.channel} · Privacy-enhanced nocookie embed
              </p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
            >
              Source <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Direct URL Loader + Search */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form
            onSubmit={handleLoadUrl}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5"
          >
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              Direct YouTube URL / Video ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://youtu.be/... or video ID"
                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shrink-0"
              >
                Load
              </button>
            </div>
          </form>

          <form
            onSubmit={handleSearch}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5"
          >
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              Proxy YouTube Search
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search videos..."
                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-100 text-sm font-medium transition shrink-0"
              >
                {searching ? '...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {statusMessage && (
          <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Results & Recent Queue */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-200">
              Search / Featured Videos
            </h3>
            <span className="text-xs text-zinc-500">{searchResults.length}</span>
          </div>
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {searchResults.map((vid) => (
              <button
                key={vid.id}
                type="button"
                onClick={() => playVideo(vid)}
                className={`w-full text-left flex gap-3 p-2 rounded-xl border transition ${
                  activeVideo.id === vid.id
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-zinc-950/60 border-zinc-800/70 hover:bg-zinc-800/60'
                }`}
              >
                <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white/90" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-100 line-clamp-2 leading-snug">
                    {vid.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1 truncate">
                    {vid.channel}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-sm font-semibold text-zinc-200">Recent Queue</h3>
            {recentQueue.length > 0 && (
              <button
                type="button"
                onClick={() => setRecentQueue([])}
                className="text-xs text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {recentQueue.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">
                Queue is empty.
              </p>
            ) : (
              recentQueue.map((item) => (
                <button
                  key={`q-${item.id}`}
                  type="button"
                  onClick={() => setActiveVideo(item)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-zinc-950/50 hover:bg-zinc-800/70 text-xs text-zinc-300 truncate block transition"
                >
                  {item.title}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
