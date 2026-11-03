import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { claimAdminAccess, fetchAdminExists } from '@/lib/adminAuth';

export type AdminStatus = 'loading' | 'signed-out' | 'forbidden' | 'admin' | 'error';

export interface AdminSession {
  status: AdminStatus;
  setupRequired: boolean;
}

export function useAdminSession(): AdminSession {
  const [session, setSession] = useState<AdminSession>({ status: 'loading', setupRequired: false });

  useEffect(() => {
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      (async () => {
        if (!currentSession) {
          const setupRequired = !(await fetchAdminExists());
          if (active) setSession({ status: 'signed-out', setupRequired });
          return;
        }
        const access = await claimAdminAccess();
        if (active) setSession({ status: access === 'admin' ? 'admin' : 'forbidden', setupRequired: false });
      })().catch(() => {
        if (active) setSession({ status: 'error', setupRequired: false });
      });
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return session;
}
