import React from 'react';

interface NavbarProps {
  pathname: string;
  onNavigate: (to: string) => void;
  showHiddenNav: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  pathname,
  onNavigate,
  showHiddenNav,
  actionButton,
}) => {
  const isCalc = pathname === '/';
  const isCourses = pathname === '/courses' || pathname.startsWith('/courses/');
  const isFormulas = pathname === '/formulas';
  const isGuides = pathname === '/guides' || pathname.startsWith('/guides/');
  const isAdmin = pathname === '/admin';

  const linkClass = (active: boolean) =>
    `text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
      active
        ? 'text-slate-900 border-slate-900'
        : 'text-slate-600 border-transparent hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single brand wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          Calculator
        </a>

        {/* Zone 2: Primary navigation links (Guides & Admin hidden until unlocked via 1234 =) */}
        <nav className="flex items-center gap-5 sm:gap-6 overflow-x-auto" aria-label="Primary">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className={linkClass(isCalc)}
          >
            Calculator
          </a>
          <a
            href="/courses"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/courses');
            }}
            className={linkClass(isCourses)}
          >
            Courses
          </a>
          <a
            href="/formulas"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/formulas');
            }}
            className={linkClass(isFormulas)}
          >
            Formulas
          </a>

          {showHiddenNav && (
            <>
              <a
                href="/guides"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/guides');
                }}
                className={linkClass(isGuides)}
              >
                Guides
              </a>
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/admin');
                }}
                className={linkClass(isAdmin)}
              >
                Admin
              </a>
            </>
          )}
        </nav>

        {/* Zone 3: Optional single contextual action */}
        <div className="flex items-center shrink-0 min-w-[64px] justify-end">
          {actionButton ? (
            <button
              type="button"
              onClick={actionButton.onClick}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              {actionButton.label}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
