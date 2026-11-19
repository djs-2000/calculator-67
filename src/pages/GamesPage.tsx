import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import {
  fetchProtectedCatalog,
  clearStoredAccessSession,
} from '../lib/api';
import { type GameCategory, type GameItem } from '../games/types';
import { GamesAccessGate } from '../games/GamesAccessGate';
import { GamesLibrary } from '../games/GamesLibrary';

interface GamesPageProps {
  backendConfigured: boolean;
  onNavigate: (to: string) => void;
  onAuthChange?: (authorized: boolean) => void;
}

export const GamesPage: React.FC<GamesPageProps> = ({
  backendConfigured,
  onNavigate,
  onAuthChange,
}) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [games, setGames] = useState<GameItem[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);

  const loadCatalog = useCallback(async () => {
    setChecking(true);
    try {
      const data = await fetchProtectedCatalog();
      if (!Array.isArray(data.games) || !Array.isArray(data.categories)) {
        throw new Error('Authorization required.');
      }
      setGames(data.games);
      setCategories(data.categories);
      setAuthorized(true);
      onAuthChange?.(true);
    } catch {
      clearStoredAccessSession();
      setGames([]);
      setCategories([]);
      setAuthorized(false);
      onAuthChange?.(false);
    } finally {
      setChecking(false);
    }
  }, [onAuthChange]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-600 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking authorization...</span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <GamesAccessGate
          backendConfigured={backendConfigured}
          onAuthorized={loadCatalog}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <GamesLibrary
        games={games}
        categories={categories}
        onSelectGame={(game) => onNavigate(`/games/${game.slug}`)}
      />
    </div>
  );
};
