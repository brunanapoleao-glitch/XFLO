import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/contexts/siteSettingsContext';
import { GENERAL_WHATSAPP_MESSAGE, getWhatsappHref } from '@/lib/whatsapp';

export default function WhatsappFloatingButton() {
  const { settings } = useSiteSettings();
  const href = getWhatsappHref(settings?.whatsapp, GENERAL_WHATSAPP_MESSAGE);
  const className =
    'fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-ink shadow-[0_16px_40px_-12px_rgba(37,211,102,0.8)] transition duration-300 hover:-translate-y-1 hover:brightness-110 active:translate-y-0 sm:bottom-8 sm:right-8';

  if (!href) {
    return (
      <button
        type="button"
        disabled
        aria-label="WhatsApp em configuração"
        className={`${className} cursor-not-allowed opacity-50`}
      >
        <MessageCircle size={26} aria-hidden="true" />
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp (abre em nova aba)"
      className={className}
    >
      <MessageCircle size={26} aria-hidden="true" />
    </a>
  );
}
