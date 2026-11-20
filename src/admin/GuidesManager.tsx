import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import {
  fetchAdminGuides,
  fetchAdminCategories,
  saveAdminGuide,
  deleteAdminGuide,
} from '../lib/api';
import { type GuideCategory, type GuideItem, type GuideMode } from '../guides/types';

export const GuidesManager: React.FC = () => {
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [categories, setCategories] = useState<GuideCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mode, setMode] = useState<GuideMode>('external');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [guidesRes, catsRes] = await Promise.all([
        fetchAdminGuides(),
        fetchAdminCategories(),
      ]);
      setGuides(guidesRes.guides);
      setCategories(catsRes.categories);
      if (!categoryId && catsRes.categories.length > 0) {
        setCategoryId(catsRes.categories[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load guides.');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const openCreate = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategoryId(categories[0]?.id ?? '');
    setMode('external');
    setThumbnailUrl('');
    setEmbedUrl('');
    setExternalUrl('');
    setIsActive(true);
    setShowForm(true);
  };

  const openEdit = (g: GuideItem) => {
    setEditingId(g.id);
    setTitle(g.title);
    setDescription(g.description);
    setCategoryId(g.category_id);
    setMode(g.mode);
    setThumbnailUrl(g.thumbnail_url ?? '');
    setEmbedUrl(g.embed_url ?? '');
    setExternalUrl(g.external_url ?? '');
    setIsActive(g.is_active);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await saveAdminGuide(editingId ? 'edit' : 'create', {
        id: editingId ?? undefined,
        title,
        description,
        category_id: categoryId,
        mode,
        thumbnail_url: thumbnailUrl,
        embed_url: mode === 'embed' ? embedUrl : null,
        external_url: mode === 'external' ? externalUrl : null,
        is_active: isActive,
      });
      setShowForm(false);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save guide.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteAdminGuide(id);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete guide.');
    }
  };

  const catName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? 'General';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Manage Guides</h2>
          <p className="text-xs text-slate-600">
            Add, update, or remove guides in the protected library.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-3.5 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium inline-flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Guide
        </button>
      </div>

      {error && (
        <p
          className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-3"
          role="alert"
        >
          {error}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-lg p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {editingId ? 'Edit Guide' : 'Add Guide'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1 rounded hover:bg-slate-100 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Short Description
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Display Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as GuideMode)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white"
              >
                <option value="external">Official External Link</option>
                <option value="embed">Embedded Reference (iframe)</option>
                <option value="builtin">Built-in Interactive Module</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Thumbnail URL (optional)
              </label>
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://... or leave blank"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
              />
            </div>
          </div>

          {mode === 'embed' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Embed URL
              </label>
              <input
                type="url"
                required
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
              />
            </div>
          )}

          {mode === 'external' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Official External URL
              </label>
              <input
                type="url"
                required
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
              />
            </div>
          )}

          <label className="inline-flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-300"
            />
            Visible in library
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-md border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Guide'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading guides...</div>
        ) : guides.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No guides in catalog.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Title</th>
                  <th className="py-2.5 px-4 font-medium">Category</th>
                  <th className="py-2.5 px-4 font-medium">Mode</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {guides.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-4 font-medium text-slate-900">{g.title}</td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {catName(g.category_id)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 capitalize">{g.mode}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={
                          g.is_active
                            ? 'text-emerald-700 font-medium'
                            : 'text-slate-400'
                        }
                      >
                        {g.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEdit(g)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(g.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
