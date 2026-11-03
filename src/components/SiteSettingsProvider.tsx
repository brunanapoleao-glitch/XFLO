import type { ReactNode } from 'react';
import { SiteSettingsContext } from '@/contexts/siteSettingsContext';
import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchSettings } from '@/lib/publicContent';

export default function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const { data, status } = useAsyncData(fetchSettings);

  return (
    <SiteSettingsContext.Provider value={{ settings: data, status }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
