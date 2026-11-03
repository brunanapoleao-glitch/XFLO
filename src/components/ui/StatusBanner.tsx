import { CircleAlert, CircleCheck } from 'lucide-react';

export type StatusTone = 'success' | 'error';

interface StatusBannerProps {
  tone: StatusTone;
  message: string;
}

export default function StatusBanner({ tone, message }: StatusBannerProps) {
  const isError = tone === 'error';
  const Icon = isError ? CircleAlert : CircleCheck;

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`animate-fade-in flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
        isError
          ? 'border-red-400/40 bg-red-500/10 text-red-100'
          : 'border-whatsapp/40 bg-whatsapp/10 text-mist'
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}
