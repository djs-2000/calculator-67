import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { fetchProtectedCatalog, clearStoredAccessSession } from '../lib/api';
import { type GameCategory, type GameItem } from '../games/types';
import { GamesAccessGate } from '../games/GamesAccessGate';
import { SnakeCanvas } from '../games/playable/SnakeCanvas';
import { Puzzle2048 } from '../games/playable/Puzzle2048';
import { BreakoutCanvas } from '../games/playable/BreakoutCanvas';
import { MinesweeperBoard } from '../games/playable/MinesweeperBoard';

interface GamePlayerPageProps {
  slug: string;
  backendConfigured: boolean;
  onNavigate: (to: string) => void;
  onAuthChange?: (authorized: boolean) => void;
}

export const GamePlayerPage: React.FC<GamePlayerPageProps> = ({
  slug,
  backendConfigured,
  onNavigate,
  onAuthChange,
}) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [game, setGame] = useState<GameItem | null>(null);
  const [categoryName, setCategoryName] = useState('Other');

  const loadGame = useCallback(async () => {
    setChecking(true);
    try {
      const data = await fetchProtectedCatalog();
      if (!Array.isArray(data.games) || !Array.isArray(data.categories)) {
        throw new Error('Authorization required.');
      }
      const found = data.games.find((g) => g.slug === slug) ?? null;
      const cat = data.categories.find(
        (c: GameCategory) => c.id === found?.category_id
      );
      setGame(found);
      setCategoryName(cat?.name ?? 'Other');
      setAuthorized(true);
      onAuthChange?.(true);
    } catch {
      clearStoredAccessSession();
      setGame(null);
      setAuthorized(false);
      onAuthChange?.(false);
    } finally {
      setChecking(false);
    }
  }, [slug, onAuthChange]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-600 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <GamesAccessGate
          backendConfigured={backendConfigured}
          onAuthorized={loadGame}
        />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Game Not Found</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          This title may have been removed or disabled.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/games')}
          className="mt-5 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Games
        </button>
      </div>
    );
  }

  const renderBuiltin = () => {
    switch (game.slug) {
      case 'snake':
        return <SnakeCanvas />;
      case '2048':
        return <Puzzle2048 />;
      case 'breakout':
        return <BreakoutCanvas />;
      case 'minesweeper':
        return <MinesweeperBoard />;
      default:
        return (
          <p className="text-sm text-slate-600 py-8 text-center">
            Built-in player is not registered for this slug.
          </p>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/games')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Games
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>
              {game.play_mode === 'external'
                ? 'Official External Link'
                : game.play_mode === 'embed'
                  ? 'Embedded Player'
                  : 'Built-In Player'}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {game.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{game.description}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs">
        {game.play_mode === 'builtin' && renderBuiltin()}

        {game.play_mode === 'embed' && game.embed_url && (
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
              <iframe
                src={game.embed_url}
                title={game.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-slate-500 text-right">
              If the embed is blocked by the publisher, visit the official game website.
            </p>
          </div>
        )}

        {game.play_mode === 'external' && game.external_url && (
          <div className="py-10 text-center space-y-4">
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              This game is hosted on its official website and does not permit third-party
              embedding.
            </p>
            <a
              href={game.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
            >
              <span>Open Official Site</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
