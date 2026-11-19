import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { AccessCodeManager } from './AccessCodeManager';
import { GamesManager } from './GamesManager';
import { CategoryManager } from './CategoryManager';

interface AdminDashboardProps {
  adminEmail: string;
  onSignOut: () => void;
}

type AdminTab = 'codes' | 'games' | 'categories';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminEmail,
  onSignOut,
}) => {
  const [tab, setTab] = useState<AdminTab>('codes');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Administrator Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Signed in as <span className="font-medium text-slate-900">{adminEmail}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="px-3.5 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium inline-flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      <div
        className="inline-flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg"
        role="tablist"
      >
        {(
          [
            { id: 'codes', label: 'Access Codes' },
            { id: 'games', label: 'Games' },
            { id: 'categories', label: 'Categories' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              tab === item.id
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'codes' && <AccessCodeManager />}
      {tab === 'games' && <GamesManager />}
      {tab === 'categories' && <CategoryManager />}
    </div>
  );
};
