import { useState, type FormEvent } from 'react';
import { MessageSquareQuote, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import Modal from '@/components/ui/Modal';
import FieldError from '@/components/ui/FieldError';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS, fieldBorder } from '@/components/ui/fieldStyles';
import StatusBanner from '@/components/ui/StatusBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  type TestimonialInput,
} from '@/lib/adminContent';
import { fetchTestimonials } from '@/lib/publicContent';
import type { Testimonial } from '@/types/site';

type DialogState = { mode: 'create' } | { mode: 'edit'; testimonial: Testimonial } | null;

export default function AdminTestimonialsSection() {
  const { data: testimonials, status, reload } = useAsyncData(fetchTestimonials);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [pendingDelete, setPendingDelete] = useState<Testimonial | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      await deleteTestimonial(pendingDelete.id);
      setPendingDelete(null);
      setSuccess('Depoimento removido.');
      reload();
    } catch (caught) {
      setDeleteError(caught instanceof Error ? caught.message : 'Não foi possível apagar o depoimento.');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-mist">Depoimentos de clientes</h2>
          <p className="mt-1 text-sm text-mist-muted">
            A seção de depoimentos só aparece no site quando houver pelo menos um cadastrado.
          </p>
        </div>
        <Button onClick={() => setDialog({ mode: 'create' })} className="w-full sm:w-auto">
          <Plus size={16} aria-hidden="true" />
          Novo depoimento
        </Button>
      </div>

      {success && <StatusBanner tone="success" message={success} />}

      {status === 'loading' && (
        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Carregando depoimentos">
          {[0, 1].map((key) => (
            <div key={key} className="h-28 animate-pulse rounded-2xl bg-night" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-deep/30 bg-night p-8 text-center">
          <p className="text-mist-muted">Não foi possível carregar os depoimentos.</p>
          <Button variant="secondary" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      )}

      {status === 'ready' && testimonials && testimonials.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand-deep/50 bg-night p-10 text-center">
          <MessageSquareQuote size={28} className="text-brand-glow" aria-hidden="true" />
          <p className="text-mist-muted">Nenhum depoimento cadastrado ainda.</p>
        </div>
      )}

      {status === 'ready' && testimonials && testimonials.length > 0 && (
        <ul className="flex flex-col gap-4">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className="flex flex-col gap-4 rounded-2xl border border-brand-deep/30 bg-night p-5 transition hover:border-brand/50 sm:flex-row sm:items-start"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-mist">{testimonial.nome}</p>
                  <span className="flex items-center gap-0.5 text-brand-glow" aria-label={`Nota ${testimonial.nota} de 5`}>
                    {Array.from({ length: testimonial.nota }).map((_, index) => (
                      <Star key={index} size={14} className="fill-brand-glow" aria-hidden="true" />
                    ))}
                  </span>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-mist-muted">{testimonial.texto}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="min-h-11 flex-1 px-4 py-2 sm:flex-none"
                  onClick={() => setDialog({ mode: 'edit', testimonial })}
                >
                  <Pencil size={15} aria-hidden="true" />
                  Editar
                </Button>
                <Button
                  variant="danger"
                  className="min-h-11 flex-1 px-4 py-2 sm:flex-none"
                  onClick={() => {
                    setDeleteError(null);
                    setPendingDelete(testimonial);
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
        <TestimonialDialog
          testimonial={dialog.mode === 'edit' ? dialog.testimonial : null}
          onClose={() => setDialog(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remover depoimento?"
        message={`O depoimento de "${pendingDelete?.nome ?? ''}" será apagado do site. Essa ação não pode ser desfeita.`}
        confirmLabel="Sim, remover"
        busy={deleteBusy}
        error={deleteError}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}

interface TestimonialDialogProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface TestimonialFormValues {
  nome: string;
  texto: string;
  nota: string;
}

type TestimonialFormErrors = Partial<Record<keyof TestimonialFormValues, string>>;

const NAME_MAX_LENGTH = 80;
const TEXT_MAX_LENGTH = 600;

function validate(values: TestimonialFormValues): TestimonialFormErrors {
  const errors: TestimonialFormErrors = {};
  if (!values.nome.trim()) errors.nome = 'Informe o nome do cliente.';
  if (!values.texto.trim()) errors.texto = 'Escreva o depoimento.';
  if (values.texto.trim().length > TEXT_MAX_LENGTH) {
    errors.texto = `O depoimento deve ter no máximo ${TEXT_MAX_LENGTH} caracteres.`;
  }
  return errors;
}

function TestimonialDialog({ testimonial, onClose, onSaved }: TestimonialDialogProps) {
  const [values, setValues] = useState<TestimonialFormValues>({
    nome: testimonial?.nome ?? '',
    texto: testimonial?.texto ?? '',
    nota: String(testimonial?.nota ?? 5),
  });
  const [errors, setErrors] = useState<TestimonialFormErrors>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: keyof TestimonialFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const input: TestimonialInput = {
      nome: values.nome.trim(),
      texto: values.texto.trim(),
      nota: Number(values.nota),
    };

    setBusy(true);
    setSubmitError(null);
    try {
      if (testimonial) {
        await updateTestimonial(testimonial.id, input);
        onSaved('Depoimento atualizado.');
      } else {
        await createTestimonial(input);
        onSaved('Depoimento adicionado.');
      }
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : 'Não foi possível salvar o depoimento.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open title={testimonial ? 'Editar depoimento' : 'Novo depoimento'} onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="Dados do depoimento">
        <div className="flex flex-col gap-2">
          <label htmlFor="testimonial-nome" className="text-sm font-semibold text-mist">
            Nome do cliente <span className="text-brand-glow">*</span>
          </label>
          <input
            id="testimonial-nome"
            type="text"
            maxLength={NAME_MAX_LENGTH}
            value={values.nome}
            onChange={(event) => updateField('nome', event.target.value)}
            aria-invalid={Boolean(errors.nome)}
            aria-describedby={errors.nome ? 'testimonial-nome-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.nome))}`}
            placeholder="Ex.: Ana Paula, Studio Lumi"
          />
          <FieldError id="testimonial-nome-error" message={errors.nome} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="testimonial-texto" className="text-sm font-semibold text-mist">
            Depoimento <span className="text-brand-glow">*</span>
          </label>
          <textarea
            id="testimonial-texto"
            rows={5}
            maxLength={TEXT_MAX_LENGTH + 100}
            value={values.texto}
            onChange={(event) => updateField('texto', event.target.value)}
            aria-invalid={Boolean(errors.texto)}
            aria-describedby={errors.texto ? 'testimonial-texto-error' : 'testimonial-texto-help'}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.texto))} min-h-32 resize-y`}
          />
          {errors.texto ? (
            <FieldError id="testimonial-texto-error" message={errors.texto} />
          ) : (
            <p id="testimonial-texto-help" className="text-xs text-mist-muted">
              {values.texto.trim().length}/{TEXT_MAX_LENGTH} caracteres
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="testimonial-nota" className="text-sm font-semibold text-mist">
            Nota
          </label>
          <select
            id="testimonial-nota"
            value={values.nota}
            onChange={(event) => updateField('nota', event.target.value)}
            className={`${FIELD_CLASS} ${fieldBorder(false)} appearance-none`}
          >
            {[5, 4, 3, 2, 1].map((nota) => (
              <option key={nota} value={nota}>
                {nota} {nota === 1 ? 'estrela' : 'estrelas'}
              </option>
            ))}
          </select>
        </div>

        {submitError && <StatusBanner tone="error" message={submitError} />}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy} aria-busy={busy}>
            {busy ? 'Salvando...' : 'Salvar depoimento'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
