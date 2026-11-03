import { useState } from 'react';
import { ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import PortfolioItemDialog from '@/components/admin/PortfolioItemDialog';
import { Button } from '@/components/ui/Button';
import StatusBanner from '@/components/ui/StatusBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { deletePortfolioItem } from '@/lib/adminContent';
import { fetchPortfolio } from '@/lib/publicContent';
import type { PortfolioItem } from '@/types/site';

type DialogState = { mode: 'create' } | { mode: 'edit'; item: PortfolioItem } | null;

export default function AdminPortfolioSection() {
  const { data: items, status, reload } = useAsyncData(fetchPortfolio);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [pendingDelete, setPendingDelete] = useState<PortfolioItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const nextOrder = items?.reduce((max, item) => Math.max(max, item.ordem), 0) ?? 0;

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
      await deletePortfolioItem(pendingDelete);
      setPendingDelete(null);
      setSuccess('Projeto removido do portfólio.');
      reload();
    } catch (caught) {
      setDeleteError(caught instanceof Error ? caught.message : 'Não foi possível apagar o projeto.');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-mist">Projetos do portfólio</h2>
          <p className="mt-1 text-sm text-mist-muted">Os projetos aparecem na seção Portfólio, na ordem informada.</p>
        </div>
        <Button onClick={() => setDialog({ mode: 'create' })} className="w-full sm:w-auto">
          <Plus size={16} aria-hidden="true" />
          Novo projeto
        </Button>
      </div>

      {success && <StatusBanner tone="success" message={success} />}

      {status === 'loading' && (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando projetos">
          {[0, 1].map((key) => (
            <div key={key} className="h-24 animate-pulse rounded-2xl bg-night" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-deep/30 bg-night p-8 text-center">
          <p className="text-mist-muted">Não foi possível carregar os projetos.</p>
          <Button variant="secondary" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      )}

      {status === 'ready' && items && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand-deep/50 bg-night p-10 text-center">
          <ImagePlus size={28} className="text-brand-glow" aria-hidden="true" />
          <p className="text-mist-muted">Nenhum projeto cadastrado ainda.</p>
        </div>
      )}

      {status === 'ready' && items && items.length > 0 && (
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-brand-deep/30 bg-night p-4 transition hover:border-brand/50 sm:flex-row sm:items-center"
            >
              <img
                src={item.imagem_url}
                alt={`Miniatura do projeto ${item.titulo}`}
                width={96}
                height={72}
                loading="lazy"
                decoding="async"
                className="h-16 w-full shrink-0 rounded-xl object-cover sm:w-24"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate font-semibold text-mist">{item.titulo}</p>
                <p className="text-sm text-mist-muted">
                  {item.tipo} · Ordem {item.ordem}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="min-h-11 flex-1 px-4 py-2 sm:flex-none" onClick={() => setDialog({ mode: 'edit', item })}>
                  <Pencil size={15} aria-hidden="true" />
                  Editar
                </Button>
                <Button
                  variant="danger"
                  className="min-h-11 flex-1 px-4 py-2 sm:flex-none"
                  onClick={() => {
                    setDeleteError(null);
                    setPendingDelete(item);
                  }}
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Remover
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {dialog && (
        <PortfolioItemDialog
          item={dialog.mode === 'edit' ? dialog.item : null}
          defaultOrder={nextOrder + 1}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remover projeto?"
        message={`O projeto "${pendingDelete?.titulo ?? ''}" e a foto dele serão apagados do site. Essa ação não pode ser desfeita.`}
        confirmLabel="Sim, remover"
        busy={deleteBusy}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}
