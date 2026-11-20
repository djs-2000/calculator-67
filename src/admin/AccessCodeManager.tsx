import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, Plus, Ban, Loader2 } from 'lucide-react';
import {
  fetchAdminAccessCodes,
  createOrRotateAccessCode,
  revokeAccessCode,
} from '../lib/api';
import { type AccessCodeRecord } from '../guides/types';

export const AccessCodeManager: React.FC = () => {
  const [codes, setCodes] = useState<AccessCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [label, setLabel] = useState('');
  const [expiresHours, setExpiresHours] = useState<string>('24');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCodes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminAccessCodes();
      setCodes(data.codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load access codes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const handleAction = async (action: 'generate' | 'rotate') => {
    setSubmitting(true);
    setError(null);
    setCopied(false);
    try {
      const hoursNum = expiresHours === 'never' ? null : Number(expiresHours);
      const res = await createOrRotateAccessCode({
        action,
        label: label.trim() || undefined,
        expiresInHours: hoursNum,
      });
      setGeneratedCode(res.plaintextCode);
      setLabel('');
      await loadCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setError(null);
    try {
      await revokeAccessCode(id);
      await loadCodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to revoke code.');
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Generate or Rotate Access Code
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Codes are generated cryptographically on the server and stored exclusively as
            SHA-256 hashes. Rotating revokes all previous active codes and active visitor
            sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="code-label"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Label (optional)
            </label>
            <input
              id="code-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Friday session"
              maxLength={80}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="code-expiry"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Expiration
            </label>
            <select
              id="code-expiry"
              value={expiresHours}
              onChange={(e) => setExpiresHours(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="1">1 hour</option>
              <option value="8">8 hours</option>
              <option value="24">24 hours</option>
              <option value="168">7 days</option>
              <option value="720">30 days</option>
              <option value="never">No expiration</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleAction('rotate')}
            className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium inline-flex items-center gap-1.5"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            Rotate Active Code
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleAction('generate')}
            className="px-4 py-2 rounded-md bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-800 border border-slate-300 text-xs font-medium inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate Additional Code
          </button>
        </div>

        {generatedCode && (
          <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-emerald-900">
                New access code (copy now — plaintext is not stored):
              </p>
              <p className="mt-1 text-lg font-mono-num font-bold text-emerald-950 tracking-wider">
                {generatedCode}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-md bg-white border border-emerald-300 text-emerald-900 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-emerald-100/60"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Code History Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Issued Access Codes</h3>
          <span className="text-xs font-mono-num text-slate-500">
            {codes.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Loading access codes...
          </div>
        ) : codes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No access codes generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Prefix</th>
                  <th className="py-2.5 px-4 font-medium">Label</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium">Created</th>
                  <th className="py-2.5 px-4 font-medium">Expires</th>
                  <th className="py-2.5 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {codes.map((c) => {
                  const expired =
                    Boolean(c.expires_at) &&
                    new Date(c.expires_at!).getTime() <= Date.now();
                  const statusLabel = !c.is_active || c.revoked_at
                    ? 'Revoked'
                    : expired
                      ? 'Expired'
                      : 'Active';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-mono-num font-medium text-slate-900">
                        {c.code_prefix}••••
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">
                        {c.label || '—'}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`font-medium ${
                            statusLabel === 'Active'
                              ? 'text-emerald-700'
                              : 'text-slate-500'
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono-num text-slate-600">
                        {new Date(c.created_at).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-4 font-mono-num text-slate-600">
                        {c.expires_at
                          ? new Date(c.expires_at).toLocaleString()
                          : 'Never'}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {statusLabel === 'Active' ? (
                          <button
                            type="button"
                            onClick={() => handleRevoke(c.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-red-700 hover:bg-red-50 border border-red-200 font-medium"
                          >
                            <Ban className="w-3 h-3" /> Revoke
                          </button>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
