import { BookOpen, Gift, Globe, Megaphone, Palette, Sparkles, Smartphone, type LucideIcon } from 'lucide-react';

export const SERVICE_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  globe: { label: 'Globo (sites)', icon: Globe },
  smartphone: { label: 'Celular (aplicativos)', icon: Smartphone },
  'book-open': { label: 'Livro (catálogos)', icon: BookOpen },
  palette: { label: 'Paleta (identidade)', icon: Palette },
  gift: { label: 'Presente (convites)', icon: Gift },
  megaphone: { label: 'Megafone (redes sociais)', icon: Megaphone },
  sparkles: { label: 'Brilho (geral)', icon: Sparkles },
};

export const DEFAULT_SERVICE_ICON = 'sparkles';

export function getServiceIcon(key: string): LucideIcon {
  return (SERVICE_ICONS[key] ?? SERVICE_ICONS[DEFAULT_SERVICE_ICON]).icon;
}
