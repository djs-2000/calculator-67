import React, { useState } from 'react';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { verifyAccessCode } from '../lib/api';

interface GuidesAccessGateProps {
  onAuthorized: () => void;
  backendConfigured: boolean;
}

export const GuidesAccessGate: React.FC<GuidesAccessGateProps> = ({
  onAuthorized,
  backendConfigured,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Enter an access code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await verifyAccessCode(trimmed);
      setCode('');
      onAuthorized();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to verify access code.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 sm:mt-16 bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-5">
        <Lock className="w-5 h-5" />
      </div>

      <h1 className="text-xl font-semibold text-slate-900">Protected Study Guides</h1>
      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
        Enter a valid access code or sign in as an administrator to open the guides library.
      </p>

      {!backendConfigured && (
        <div
          role="status"
          className="mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <div>
            Supabase credentials are not configured yet. Set{' '}
            <code className="font-mono-num">SUPABASE_URL</code> and{' '}
            <code className="font-mono-num">SUPABASE_SERVICE_ROLE_KEY</code> on the server
            (and run the SQL migration) to enable access code verification.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="access-code-input"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Access Code
          </label>
          <input
            id="access-code-input"
            type="password"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter access code"
            disabled={loading}
            className="w-full px-3.5 py-2.5 text-sm font-mono-num bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 disabled:bg-slate-50"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </form>
    </div>
  );
};
