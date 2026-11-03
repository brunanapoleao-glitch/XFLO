export const FIELD_CLASS =
  'w-full min-h-11 rounded-2xl border bg-ink px-4 py-3 text-sm text-mist placeholder:text-mist-muted/60 transition focus:border-brand-glow focus:outline-none focus:ring-2 focus:ring-brand-glow/40';

export function fieldBorder(hasError: boolean): string {
  return hasError ? 'border-red-400/70' : 'border-brand-deep/40 hover:border-brand/60';
}
