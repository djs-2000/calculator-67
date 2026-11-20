import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  fetchAdminCategories,
  createAdminCategory,
  deleteAdminCategory,
} from '../lib/api';
import { type GuideCategory } from '../guides/types';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminCategories();
      setCategories(res.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load categories.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError(null);
    try {
      await createAdminCategory(name.trim());
      setName('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add category.');
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteAdminCategory(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete category.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h2 className="text-base font-semibold text-slate-900">Manage Categories</h2>
        <p className="mt-1 text-xs text-slate-600">
          Organize study guides into categories. Categories assigned to active guides
          cannot be deleted until reassigned.
        </p>

        <form onSubmit={handleAdd} className="mt-4 flex gap-2 max-w-md">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category name"
            maxLength={40}
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>

        {error && (
          <p className="mt-3 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Loading categories...
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="px-5 py-3 flex items-center justify-between text-sm"
              >
                <div>
                  <span className="font-medium text-slate-900">{cat.name}</span>
                  <span className="ml-2 text-xs font-mono-num text-slate-400">
                    /{cat.slug}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
