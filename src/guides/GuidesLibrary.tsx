import React, { useState, useMemo } from 'react';
import { type GuideCategory, type GuideItem } from './types';
import { GuideCard } from '../components/GuideCard';

interface GuidesLibraryProps {
  guides: GuideItem[];
  categories: GuideCategory[];
  onSelectGuide: (guide: GuideItem) => void;
}

export const GuidesLibrary: React.FC<GuidesLibraryProps> = ({
  guides,
  categories,
  onSelectGuide,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );
  const safeGuides = useMemo(
    () => (Array.isArray(guides) ? guides : []),
    [guides]
  );

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of safeCategories) {
      map.set(cat.id, cat.name);
    }
    return map;
  }, [safeCategories]);

  const filteredGuides = useMemo(() => {
    const q = search.trim().toLowerCase();
    return safeGuides.filter((g) => {
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
  }, [safeGuides, search, selectedCategoryId, categoryMap]);

  return (
    <div
      className="max-w-[800px] mx-auto bg-white py-4 space-y-6"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: '#333333' }}
    >
      <header className="border-b border-[#d4d4d4] pb-4 space-y-2">
        <p className="text-xs uppercase tracking-widest text-[#666666]">
          Assigned Curriculum Readings &amp; Modules
        </p>
        <h1 className="text-2xl font-normal text-[#333333]">
          Computational Logic Module Index
        </h1>
        <p className="text-sm text-[#4a4a4a] leading-relaxed">
          Select an assigned reading and accompanying interactive diagram below to examine
          constraint satisfaction, state transitions, and quantitative reasoning.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4">
        <div
          className="flex flex-wrap items-center gap-4 text-sm"
          role="tablist"
          aria-label="Module categories"
        >
          <button
            type="button"
            onClick={() => setSelectedCategoryId('all')}
            className={`cursor-pointer bg-transparent p-0 transition-colors ${
              selectedCategoryId === 'all'
                ? 'text-[#333333] underline underline-offset-4 font-bold'
                : 'text-[#666666] hover:text-[#333333]'
            }`}
          >
            All Modules
          </button>
          {safeCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`cursor-pointer bg-transparent p-0 transition-colors ${
                selectedCategoryId === cat.id
                  ? 'text-[#333333] underline underline-offset-4 font-bold'
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter readings..."
          aria-label="Filter readings"
          className="w-full sm:w-56 px-2.5 py-1.5 text-sm bg-white border border-[#cccccc] text-[#333333] placeholder:text-[#777777] focus:outline-none focus:border-[#333333]"
        />
      </div>

      {filteredGuides.length === 0 ? (
        <div className="py-10 text-center space-y-2">
          <p className="text-sm text-[#333333]">No matching modules found.</p>
          {(search || selectedCategoryId !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategoryId('all');
              }}
              className="text-sm underline underline-offset-4 text-[#333333] cursor-pointer bg-transparent"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              categoryName={categoryMap.get(guide.category_id) ?? 'General'}
              onOpen={onSelectGuide}
            />
          ))}
        </div>
      )}
    </div>
  );
};
