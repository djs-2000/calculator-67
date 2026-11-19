import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { type GameCategory, type GameItem } from './types';
import { GameCard } from '../components/GameCard';

interface GamesLibraryProps {
  games: GameItem[];
  categories: GameCategory[];
  onSelectGame: (game: GameItem) => void;
}

export const GamesLibrary: React.FC<GamesLibraryProps> = ({
  games,
  categories,
  onSelectGame,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );
  const safeGames = useMemo(
    () => (Array.isArray(games) ? games : []),
    [games]
  );

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of safeCategories) {
      map.set(cat.id, cat.name);
    }
    return map;
  }, [safeCategories]);

  const filteredGames = useMemo(() => {
    const q = search.trim().toLowerCase();
    return safeGames.filter((g) => {
      if (selectedCategoryId !== 'all' && g.category_id !== selectedCategoryId) {
        return false;
      }
      if (!q) return true;
      const catName = (categoryMap.get(g.category_id) ?? '').toLowerCase();
      return (
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        catName.includes(q)
      );
    });
  }, [safeGames, search, selectedCategoryId, categoryMap]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Games Library
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse available titles by name or category.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search games..."
            aria-label="Search games"
            className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>
      </div>

      {/* Category Filter Bar */}
      <div
        className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg"
        role="tablist"
        aria-label="Game categories"
      >
        <button
          type="button"
          onClick={() => setSelectedCategoryId('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
            selectedCategoryId === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All
        </button>
        {safeCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              selectedCategoryId === cat.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredGames.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
          <p className="text-sm font-medium text-slate-900">No matching games found</p>
          <p className="mt-1 text-xs text-slate-500">
            Try clearing the search query or selecting another category.
          </p>
          {(search || selectedCategoryId !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategoryId('all');
              }}
              className="mt-4 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              categoryName={categoryMap.get(game.category_id) ?? 'Other'}
              onPlay={onSelectGame}
            />
          ))}
        </div>
      )}
    </div>
  );
};
