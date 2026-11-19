import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { verifyAdminRole } from '../lib/api';
import { AdminLogin } from '../admin/AdminLogin';
import { AdminDashboard } from '../admin/AdminDashboard';

interface AdminPageProps {
  backendConfigured: boolean;
}

export const AdminPage: React.FC<AdminPageProps> = ({ backendConfigured }) => {
  const [checking, setChecking] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const checkSession = useCallback(async () => {
    if (!supabase || !backendConfigured) {
      setAdminEmail(null);
      setChecking(false);
      return;
    }

    setChecking(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setAdminEmail(null);
        return;
      }
      const res = await verifyAdminRole();
      setAdminEmail(res.admin.email);
    } catch {
      setAdminEmail(null);
    } finally {
      setChecking(false);
    }
  }, [backendConfigured]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => undefined);
    }
    setAdminEmail(null);
  };

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-600 gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Verifying session...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {adminEmail ? (
        <AdminDashboard adminEmail={adminEmail} onSignOut={handleSignOut} />
      ) : (
        <AdminLogin
          backendConfigured={backendConfigured}
          onAuthenticated={(email) => setAdminEmail(email)}
        />
      )}
    </div>
  );
};
