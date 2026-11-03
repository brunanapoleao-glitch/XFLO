import { useState } from 'react';
import { Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ServiceItemDialog from '@/components/admin/ServiceItemDialog';
import { Button } from '@/components/ui/Button';
import StatusBanner from '@/components/ui/StatusBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { deleteService } from '@/lib/adminContent';
import { fetchServices } from '@/lib/publicContent';
import { getServiceIcon, SERVICE_ICONS } from '@/lib/serviceIcons';
import type { Service, ServicePricing } from '@/types/site';

type DialogState = { mode: 'create' } | { mode: 'edit'; service: Service } | null;

const PRICING_LABEL: Record<ServicePricing, string> = {
  site: 'Preço de sites',
  invite: 'Preço de convites',
  quote: 'Sob orçamento',
};

export default function AdminServicesSection() {
  const { data: services, status, reload } = useAsyncData(fetchServices);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const nextOrder = services?.reduce((max, service) => Math.max(max, service.ordem), 0) ?? 0;

  const handleSaved = (message: string) => {
    setDialog(null);
    setSuccess(message);
    reload();
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await deleteService(pendingDelete.id);
      setPendingDelete(null);
      setSuccess('Serviço removido da lista.');
      reload();
    } catch (caught) {
      setDeleteError(caught instanceof Error ? caught.message : 'Não foi possível apagar o serviço.');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-mist">Serviços oferecidos</h2>
          <p className="mt-1 text-sm text-mist-muted">
            Os serviços aparecem na seção Serviços do site e nas opções do formulário de orçamento.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: 'create' })} className="w-full sm:w-auto">
          <Plus size={16} aria-hidden="true" />
          Novo serviço
        </Button>
      </div>

      {success && <StatusBanner tone="success" message={success} />}

      {status === 'loading' && (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando serviços">
          {[0, 1].map((key) => (
            <div key={key} className="h-24 animate-pulse rounded-2xl bg-night" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-deep/30 bg-night p-8 text-center">
          <p className="text-mist-muted">Não foi possível carregar os serviços.</p>
          <Button variant="secondary" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      )}

      {status === 'ready' && services && services.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand-deep/50 bg-night p-10 text-center">
          <Sparkles size={28} className="text-brand-glow" aria-hidden="true" />
          <p className="text-mist-muted">Nenhum serviço cadastrado ainda.</p>
        </div>
      )}

      {status === 'ready' && services && services.length > 0 && (
        <ul className="flex flex-col gap-4">
          {services.map((service) => {
            const Icon = getServiceIcon(service.icone);
            return (
              <li
                key={service.id}
                className="flex flex-col gap-4 rounded-2xl border border-brand-deep/30 bg-night p-4 transition hover:border-brand/50 sm:flex-row sm:items-center"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-deep/25 text-brand-glow">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="truncate font-semibold text-mist">{service.titulo}</p>
                  <p className="text-sm text-mist-muted">
                    {SERVICE_ICONS[service.icone]?.label ?? 'Ícone padrão'} · {PRICING_LABEL[service.tipo_preco]} ·
                    Ordem {service.ordem}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="min-h-11 flex-1 px-4 py-2 sm:flex-none"
                    onClick={() => setDialog({ mode: 'edit', service })}
                  >
                    <Pencil size={15} aria-hidden="true" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    className="min-h-11 flex-1 px-4 py-2 sm:flex-none"
                    onClick={() => {
                      setDeleteError(null);
                      setPendingDelete(service);
                    }}
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Remover
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {dialog && (
        <ServiceItemDialog
          service={dialog.mode === 'edit' ? dialog.service : null}
          defaultOrder={nextOrder + 1}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remover serviço?"
        message={`O serviço "${pendingDelete?.titulo ?? ''}" deixará de aparecer no site e no formulário de orçamento. Essa ação não pode ser desfeita.`}
        confirmLabel="Sim, remover"
        busy={deleteBusy}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
