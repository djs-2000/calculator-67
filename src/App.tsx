import { useState, useEffect } from 'react';
import { Calculator, Tv, Gamepad2, MessageSquare, ShieldAlert } from 'lucide-react';
import { CalculatorView } from './components/CalculatorView';
import { YouTubeProxyView } from './components/YouTubeProxyView';
import { GamesArcadeView } from './components/GamesArcadeView';
import { MessagingView } from './components/MessagingView';

type HubTab = 'youtube' | 'games' | 'messaging';

export default function App() {
  const [mode, setMode] = useState<'calculator' | 'hub'>('calculator');
  const [hubUnlocked, setHubUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<HubTab>('youtube');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mode === 'hub') {
        setMode('calculator');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode]);

  if (mode === 'calculator') {
    return (
      <CalculatorView
        hubUnlocked={hubUnlocked}
        onUnlockHub={() => {
          setHubUnlocked(true);
          setMode('hub');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono-num font-bold text-sm">
              67
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100 leading-none">
                Calculator 67 Hub
              </h1>
              <p className="text-[11px] text-zinc-500 mt-1">
                Press Esc anytime to cloak back to calculator
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveTab('youtube')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'youtube'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">YouTube</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('games')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'games'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Games</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('messaging')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'messaging'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Messages</span>
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMode('calculator')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-rose-600/90 text-zinc-200 hover:text-white text-xs font-medium border border-zinc-700 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cloak</span>
            <Calculator className="w-3.5 h-3.5 sm:hidden" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'youtube' && <YouTubeProxyView />}
        {activeTab === 'games' && <GamesArcadeView />}
        {activeTab === 'messaging' && <MessagingView />}
      </main>
    </div>
  );
}
