export type ButtonVariant = 'primary' | 'whatsapp' | 'secondary' | 'ghost' | 'danger';

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-brand-deep to-[#9333ea] text-white shadow-glow hover:shadow-glow-lg',
  whatsapp:
    'bg-whatsapp text-ink shadow-[0_12px_32px_-12px_rgba(37,211,102,0.7)] hover:brightness-110',
  secondary:
    'border border-brand-deep/60 bg-night/70 text-mist hover:border-brand hover:bg-night-2 hover:shadow-glow',
  ghost: 'text-mist-muted hover:text-mist',
  danger: 'border border-red-400/40 bg-red-500/10 text-red-100 hover:bg-red-500/20',
};

export function buttonStyles(variant: ButtonVariant, extra = ''): string {
  return [BASE, VARIANTS[variant], extra].join(' ');
}
