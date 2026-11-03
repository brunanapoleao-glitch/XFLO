import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import StatusBanner from '@/components/ui/StatusBanner';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="flex flex-col gap-6">
        <p className="text-pretty leading-relaxed text-mist-muted">{message}</p>
        {error && <StatusBanner tone="error" message={error} />}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy} aria-busy={busy}>
            {busy ? 'Apagando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
