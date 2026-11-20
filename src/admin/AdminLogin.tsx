import React, { useState } from 'react';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { supabase, isSupabaseClientConfigured } from '../lib/supabase';
import { verifyAdminRole } from '../lib/api';

interface AdminLoginProps {
  onAuthenticated: (email: string) => void;
  backendConfigured: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onAuthenticated,
  backendConfigured,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseClientConfigured && backendConfigured;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !configured) {
      setError('Supabase authentication is not configured yet.');
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError('Enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        setError('Invalid email or password.');
        return;
      }

      const roleRes = await verifyAdminRole();
      onAuthenticated(roleRes.admin.email);
    } catch (err) {
      await supabase.auth.signOut().catch(() => undefined);
      const status = (err as { status?: number })?.status;
      if (status === 401 || status === 403) {
        setError('Invalid credentials or insufficient permissions.');
      } else {
        setError(
          'Unable to verify administrator role. Ensure Edge Functions are deployed and admin_users is configured.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 sm:mt-16 bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-5">
        <Shield className="w-5 h-5" />
      </div>

      <h1 className="text-xl font-semibold text-slate-900">Administrator Sign In</h1>
      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
        Sign in with a verified administrator account to manage access codes and guides.
      </p>

      {!configured && (
        <div
          role="status"
          className="mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <div>
            Supabase Auth requires <code className="font-mono-num">VITE_SUPABASE_URL</code>,{' '}
            <code className="font-mono-num">VITE_SUPABASE_ANON_KEY</code>, and server{' '}
            <code className="font-mono-num">SUPABASE_SERVICE_ROLE_KEY</code> before
            administrators can sign in.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            disabled={loading}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="block text-xs font-medium text-slate-700 mb-1.5"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
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
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>
    </div>
  );
};
