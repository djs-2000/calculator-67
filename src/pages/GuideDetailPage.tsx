import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { fetchProtectedCatalog, clearStoredAccessSession } from '../lib/api';
import { type GuideCategory, type GuideItem } from '../guides/types';
import { GuidesAccessGate } from '../guides/GuidesAccessGate';
import { GridPathCanvas } from '../guides/interactive/GridPathCanvas';
import { MatrixMergeBoard } from '../guides/interactive/MatrixMergeBoard';
import { ReflectionCanvas } from '../guides/interactive/ReflectionCanvas';
import { DeductionGrid } from '../guides/interactive/DeductionGrid';

interface GuideDetailPageProps {
  slug: string;
  backendConfigured: boolean;
  onNavigate: (to: string) => void;
  onAuthChange?: (authorized: boolean) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({
  slug,
  backendConfigured,
  onNavigate,
  onAuthChange,
}) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [guide, setGuide] = useState<GuideItem | null>(null);
  const [categoryName, setCategoryName] = useState('General');

  const loadGuide = useCallback(async () => {
    setChecking(true);
    try {
      const data = await fetchProtectedCatalog();
      if (!Array.isArray(data.guides) || !Array.isArray(data.categories)) {
        throw new Error('Authorization required.');
      }
      const found = data.guides.find((g) => g.slug === slug) ?? null;
      const cat = data.categories.find(
        (c: GuideCategory) => c.id === found?.category_id
      );
      setGuide(found);
      setCategoryName(cat?.name ?? 'General');
      setAuthorized(true);
      onAuthChange?.(true);
    } catch {
      clearStoredAccessSession();
      setGuide(null);
      setAuthorized(false);
      onAuthChange?.(false);
    } finally {
      setChecking(false);
    }
  }, [slug, onAuthChange]);

  useEffect(() => {
    loadGuide();
  }, [loadGuide]);

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-600 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading module...</span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <GuidesAccessGate
          backendConfigured={backendConfigured}
          onAuthorized={loadGuide}
        />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Guide Not Found</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          This guide entry may have been removed or disabled.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/guides')}
          className="mt-5 px-4 py-2 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Guides
        </button>
      </div>
    );
  }

  const renderInteractive = () => {
    switch (guide.slug) {
      case 'grid-path':
        return <GridPathCanvas />;
      case 'powers-merge':
        return <MatrixMergeBoard />;
      case 'elastic-reflection':
        return <ReflectionCanvas />;
      case 'adjacency-deduction':
        return <DeductionGrid />;
      default:
        return (
          <p className="text-sm text-slate-600 py-8 text-center">
            Interactive module is not registered for this slug.
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
            onClick={() => onNavigate('/guides')}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Guides
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>
              {guide.mode === 'external'
                ? 'Official External Reference'
                : guide.mode === 'embed'
                  ? 'Embedded Module'
                  : 'Interactive Module'}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {guide.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600">{guide.description}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8 shadow-xs">
        {guide.mode === 'builtin' && renderInteractive()}

        {guide.mode === 'embed' && guide.embed_url && (
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-200 bg-white">
              <iframe
                src={guide.embed_url}
                title={guide.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-slate-500 text-right">
              If the embedded frame is restricted by the host, visit the official guide
              source directly.
            </p>
          </div>
        )}

        {guide.mode === 'external' && guide.external_url && (
          <div className="py-10 text-center space-y-4">
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              This interactive guide module is hosted on its official website and opens in
              a dedicated tab.
            </p>
            <a
              href={guide.external_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors"
            >
              <span>Begin Activity</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
