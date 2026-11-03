import { createContext, useContext } from 'react';
import type { SiteSettings } from '@/types/site';
import type { AsyncStatus } from '@/hooks/useAsyncData';

export interface SiteSettingsContextValue {
  settings: SiteSettings | null;
  status: AsyncStatus;
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);

export function useSiteSettings(): SiteSettingsContextValue {
  const context = useContext(SiteSettingsContext);
  if (!context) throw new Error('useSiteSettings deve ser usado dentro de SiteSettingsProvider.');
  return context;
}
