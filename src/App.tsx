import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { useRouter } from './lib/router';
import { isSupabaseClientConfigured, resolveBackendMode } from './lib/supabase';
import { clearStoredAccessSession } from './lib/api';
import { CalculatorPage } from './pages/CalculatorPage';
import { GamesPage } from './pages/GamesPage';
import { GamePlayerPage } from './pages/GamePlayerPage';
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
  const [, setGamesAuthorized] = useState(false);

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

  const gameSlug = pathname.startsWith('/games/')
    ? decodeURIComponent(pathname.slice('/games/'.length).split('/')[0] ?? '')
    : '';

  const handleUnlockPortal = () => {
    sessionStorage.setItem(PORTAL_UNLOCK_KEY, '1');
    setPortalUnlocked(true);
    navigate('/games');
  };

  const handleLockAll = () => {
    sessionStorage.removeItem(PORTAL_UNLOCK_KEY);
    clearStoredAccessSession();
    setPortalUnlocked(false);
    setGamesAuthorized(false);
    navigate('/');
  };

  const effectivePath = portalUnlocked ? pathname : '/';

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
          <CalculatorPage onSecretSequence={handleUnlockPortal} />
        )}

        {portalUnlocked && effectivePath === '/games' && (
          <GamesPage
            backendConfigured={backendConfigured}
            onNavigate={navigate}
            onAuthChange={setGamesAuthorized}
          />
        )}

        {portalUnlocked && effectivePath.startsWith('/games/') && gameSlug && (
          <GamePlayerPage
            slug={gameSlug}
            backendConfigured={backendConfigured}
            onNavigate={navigate}
            onAuthChange={setGamesAuthorized}
          />
        )}

        {portalUnlocked && effectivePath === '/admin' && (
          <AdminPage backendConfigured={backendConfigured} />
        )}

        {effectivePath !== '/' &&
          effectivePath !== '/games' &&
          !effectivePath.startsWith('/games/') &&
          effectivePath !== '/admin' && (
            <CalculatorPage onSecretSequence={handleUnlockPortal} />
          )}
      </main>
    </div>
  );
}
