import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { useRouter } from './lib/router';
import { isSupabaseClientConfigured, resolveBackendMode } from './lib/supabase';
import { clearStoredAccessSession } from './lib/api';
import { CalculatorPage } from './pages/CalculatorPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseReviewPage } from './pages/CourseReviewPage';
import { FormulasPage } from './pages/FormulasPage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideDetailPage } from './pages/GuideDetailPage';
import { AdminPage } from './pages/AdminPage';

const PORTAL_UNLOCK_KEY = 'calculator_portal_unlocked';

export default function App() {
  const { pathname, navigate } = useRouter();
  const [backendConfigured, setBackendConfigured] = useState(
    isSupabaseClientConfigured
  );
  const [portalUnlocked, setPortalUnlocked] = useState(
    () => sessionStorage.getItem(PORTAL_UNLOCK_KEY) === '1'
  );
  const [, setGuidesAuthorized] = useState(false);

  useEffect(() => {
    const mode = resolveBackendMode();
    if (mode === 'supabase') {
      setBackendConfigured(isSupabaseClientConfigured);
      return;
    }

    fetch('/api/health')
      .then((res) => {
        const ct = res.headers.get('content-type') ?? '';
        if (!res.ok || !ct.includes('application/json')) {
          throw new Error('Health endpoint unavailable');
        }
        return res.json();
      })
      .then((data: { supabaseConfigured?: boolean }) => {
        setBackendConfigured(Boolean(data.supabaseConfigured));
      })
      .catch(() => {
        setBackendConfigured(false);
      });
  }, []);

  const isPublicMathRoute =
    pathname === '/' ||
    pathname === '/courses' ||
    pathname.startsWith('/courses/') ||
    pathname === '/formulas';

  const effectivePath = portalUnlocked || isPublicMathRoute ? pathname : '/';

  const guideSlug = effectivePath.startsWith('/guides/')
    ? decodeURIComponent(effectivePath.slice('/guides/'.length).split('/')[0] ?? '')
    : '';

  const courseSegments = effectivePath.startsWith('/courses/')
    ? effectivePath
        .slice('/courses/'.length)
        .split('/')
        .filter(Boolean)
        .map(decodeURIComponent)
    : [];

  const handleUnlockPortal = () => {
    sessionStorage.setItem(PORTAL_UNLOCK_KEY, '1');
    setPortalUnlocked(true);
    navigate('/guides');
  };

  const handleLockAll = () => {
    sessionStorage.removeItem(PORTAL_UNLOCK_KEY);
    clearStoredAccessSession();
    setPortalUnlocked(false);
    setGuidesAuthorized(false);
    navigate('/');
  };

  const isKnownRoute =
    effectivePath === '/' ||
    effectivePath === '/courses' ||
    (effectivePath.startsWith('/courses/') && courseSegments.length >= 1) ||
    effectivePath === '/formulas' ||
    (portalUnlocked && effectivePath === '/guides') ||
    (portalUnlocked && effectivePath.startsWith('/guides/') && Boolean(guideSlug)) ||
    (portalUnlocked && effectivePath === '/admin');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <Navbar
        pathname={effectivePath}
        onNavigate={navigate}
        showHiddenNav={portalUnlocked}
        actionButton={
          portalUnlocked ? { label: 'Lock', onClick: handleLockAll } : null
        }
      />

      <main className="flex-1">
        {effectivePath === '/' && (
          <CalculatorPage
            onSecretSequence={handleUnlockPortal}
            onNavigate={navigate}
          />
        )}

        {effectivePath === '/courses' && <CoursesPage onNavigate={navigate} />}

        {effectivePath.startsWith('/courses/') && courseSegments.length >= 1 && (
          <CourseReviewPage
            courseSlug={courseSegments[0]}
            pageSlug={courseSegments[1]}
            onNavigate={navigate}
          />
        )}

        {effectivePath === '/formulas' && <FormulasPage onNavigate={navigate} />}

        {portalUnlocked && effectivePath === '/guides' && (
          <GuidesPage
            backendConfigured={backendConfigured}
            onNavigate={navigate}
            onAuthChange={setGuidesAuthorized}
          />
        )}

        {portalUnlocked && effectivePath.startsWith('/guides/') && guideSlug && (
          <GuideDetailPage
            slug={guideSlug}
            backendConfigured={backendConfigured}
            onNavigate={navigate}
            onAuthChange={setGuidesAuthorized}
          />
        )}

        {portalUnlocked && effectivePath === '/admin' && (
          <AdminPage backendConfigured={backendConfigured} />
        )}

        {!isKnownRoute && (
          <CalculatorPage
            onSecretSequence={handleUnlockPortal}
            onNavigate={navigate}
          />
        )}
      </main>
    </div>
  );
};
