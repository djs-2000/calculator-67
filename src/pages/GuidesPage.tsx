import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import {
  fetchProtectedCatalog,
  clearStoredAccessSession,
} from '../lib/api';
import { type GuideCategory, type GuideItem } from '../guides/types';
import { GuidesAccessGate } from '../guides/GuidesAccessGate';
import { GuidesLibrary } from '../guides/GuidesLibrary';

interface GuidesPageProps {
  backendConfigured: boolean;
  onNavigate: (to: string) => void;
  onAuthChange?: (authorized: boolean) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({
  backendConfigured,
  onNavigate,
  onAuthChange,
}) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [categories, setCategories] = useState<GuideCategory[]>([]);

  const loadCatalog = useCallback(async () => {
    setChecking(true);
    try {
      const data = await fetchProtectedCatalog();
      if (!Array.isArray(data.guides) || !Array.isArray(data.categories)) {
        throw new Error('Authorization required.');
      }
      setGuides(data.guides);
      setCategories(data.categories);
      setAuthorized(true);
      onAuthChange?.(true);
    } catch {
      clearStoredAccessSession();
      setGuides([]);
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
        <GuidesAccessGate
          backendConfigured={backendConfigured}
          onAuthorized={loadCatalog}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <GuidesLibrary
        guides={guides}
        categories={categories}
        onSelectGuide={(guide) => onNavigate(`/guides/${guide.slug}`)}
      />
    </div>
  );
};
