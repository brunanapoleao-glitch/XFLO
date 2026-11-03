const WHATSAPP_DIGITS_MIN = 10;
const WHATSAPP_DIGITS_MAX = 15;

export function normalizeWhatsappNumber(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (digits.length < WHATSAPP_DIGITS_MIN || digits.length > WHATSAPP_DIGITS_MAX) {
    return null;
  }
  return digits;
}

export const GENERAL_WHATSAPP_MESSAGE = 'Olá! Gostaria de conversar sobre um projeto com a XFLO.';

export function buildWhatsappUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getWhatsappHref(whatsapp: string | undefined, message: string): string | null {
  const number = whatsapp ? normalizeWhatsappNumber(whatsapp) : null;
  return number ? buildWhatsappUrl(number, message) : null;
}
