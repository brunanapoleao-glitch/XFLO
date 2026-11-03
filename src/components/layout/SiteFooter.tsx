import { Instagram } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { XfloWordmark } from '@/components/ui/XfloLogo';
import { useSiteSettings } from '@/contexts/siteSettingsContext';
import { normalizeInstagram } from '@/lib/social';

export default function SiteFooter() {
  const { settings } = useSiteSettings();
  const instagramUrl = settings ? normalizeInstagram(settings.instagram) : null;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-deep/30 bg-ink px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <XfloWordmark />
          <p className="text-sm font-semibold tracking-wide text-brand-glow">Criatividade que conecta.</p>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          {instagramUrl && (
            <LinkButton
              variant="secondary"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da XFLO (abre em nova aba)"
            >
              <Instagram size={18} aria-hidden="true" />
              Instagram
            </LinkButton>
          )}
          <p className="text-center text-sm text-mist-muted md:text-right">
            &copy; {year} XFLO. Todos os direitos reservados.
          </p>
          <a
            href="/admin"
            className="rounded-md text-xs text-mist-muted/80 underline-offset-4 transition hover:text-brand-glow hover:underline"
          >
            Área do administrador
          </a>
        </div>
      </div>
    </footer>
  );
}
