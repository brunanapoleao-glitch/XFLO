import { useEffect, useState, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import FieldError from '@/components/ui/FieldError';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS, fieldBorder } from '@/components/ui/fieldStyles';
import StatusBanner from '@/components/ui/StatusBanner';
import {
  createPortfolioItem,
  updatePortfolioItem,
  uploadPortfolioImage,
  type PortfolioInput,
} from '@/lib/adminContent';
import type { PortfolioItem } from '@/types/site';

const PROJECT_TYPE_SUGGESTIONS = [
  'Site institucional',
  'Site profissional',
  'Catálogo digital',
  'Identidade de negócio',
  'Convite interativo',
];

interface PortfolioItemDialogProps {
  item: PortfolioItem | null;
  defaultOrder: number;
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface PortfolioFormValues {
  titulo: string;
  tipo: string;
  ordem: string;
}

type PortfolioFormErrors = Partial<Record<keyof PortfolioFormValues | 'imagem', string>>;

function validate(values: PortfolioFormValues, hasImage: boolean): PortfolioFormErrors {
  const errors: PortfolioFormErrors = {};
  if (!values.titulo.trim()) errors.titulo = 'Informe o título do projeto.';
  if (!values.tipo.trim()) errors.tipo = 'Informe o tipo do projeto.';

  const ordem = Number(values.ordem);
  if (values.ordem.trim() === '' || !Number.isInteger(ordem) || ordem < 0 || ordem > 9999) {
    errors.ordem = 'Use um número inteiro entre 0 e 9999.';
  }
  if (!hasImage) errors.imagem = 'Escolha uma foto do projeto.';

  return errors;
}

export default function PortfolioItemDialog({ item, defaultOrder, onClose, onSaved }: PortfolioItemDialogProps) {
  const [values, setValues] = useState<PortfolioFormValues>({
    titulo: item?.titulo ?? '',
    tipo: item?.tipo ?? '',
    ordem: String(item?.ordem ?? defaultOrder),
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<PortfolioFormErrors>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const imageSrc = previewUrl ?? item?.imagem_url ?? null;

  const updateField = (field: keyof PortfolioFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values, Boolean(file) || Boolean(item));
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBusy(true);
    setSubmitError(null);
    try {
      const input: PortfolioInput = {
        titulo: values.titulo.trim(),
        tipo: values.tipo.trim(),
        ordem: Number(values.ordem),
      };
      const newImageUrl = file ? await uploadPortfolioImage(file) : undefined;

      if (item) {
        await updatePortfolioItem(item, input, newImageUrl);
        onSaved('Projeto atualizado com sucesso.');
      } else if (newImageUrl) {
        await createPortfolioItem(input, newImageUrl);
        onSaved('Projeto adicionado ao portfólio.');
      }
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : 'Não foi possível salvar o projeto.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open title={item ? 'Editar projeto' : 'Novo projeto'} onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="Dados do projeto">
        <div className="flex flex-col gap-2">
          <label htmlFor="portfolio-titulo" className="text-sm font-semibold text-mist">
            Título <span className="text-brand-glow">*</span>
          </label>
          <input
            id="portfolio-titulo"
            type="text"
            value={values.titulo}
            onChange={(event) => updateField('titulo', event.target.value)}
            aria-invalid={Boolean(errors.titulo)}
            aria-describedby={errors.titulo ? 'portfolio-titulo-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.titulo))}`}
            placeholder="Ex.: Site institucional Aurora Studio"
          />
          <FieldError id="portfolio-titulo-error" message={errors.titulo} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="portfolio-tipo" className="text-sm font-semibold text-mist">
            Tipo <span className="text-brand-glow">*</span>
          </label>
          <input
            id="portfolio-tipo"
            type="text"
            list="portfolio-tipo-options"
            value={values.tipo}
            onChange={(event) => updateField('tipo', event.target.value)}
            aria-invalid={Boolean(errors.tipo)}
            aria-describedby={errors.tipo ? 'portfolio-tipo-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.tipo))}`}
            placeholder="Ex.: Catálogo digital"
          />
          <datalist id="portfolio-tipo-options">
            {PROJECT_TYPE_SUGGESTIONS.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
          <FieldError id="portfolio-tipo-error" message={errors.tipo} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="portfolio-ordem" className="text-sm font-semibold text-mist">
            Ordem de exibição
          </label>
          <input
            id="portfolio-ordem"
            type="number"
            inputMode="numeric"
            min={0}
            max={9999}
            value={values.ordem}
            onChange={(event) => updateField('ordem', event.target.value)}
            aria-invalid={Boolean(errors.ordem)}
            aria-describedby={errors.ordem ? 'portfolio-ordem-error' : 'portfolio-ordem-help'}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.ordem))}`}
          />
          {errors.ordem ? (
            <FieldError id="portfolio-ordem-error" message={errors.ordem} />
          ) : (
            <p id="portfolio-ordem-help" className="text-xs text-mist-muted">
              Números menores aparecem primeiro.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-mist">
            Foto do projeto {!item && <span className="text-brand-glow">*</span>}
          </span>
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Pré-visualização da foto do projeto"
              className="aspect-[4/3] w-full rounded-2xl border border-brand-deep/30 object-cover"
            />
          )}
          <input
            id="portfolio-imagem"
            type="file"
            accept="image/*"
            className="peer sr-only"
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setErrors((current) => ({ ...current, imagem: undefined }));
              setSubmitError(null);
            }}
          />
          <label
            htmlFor="portfolio-imagem"
            className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-2xl border border-dashed border-brand/60 bg-night-2 px-4 py-3 text-sm font-semibold text-brand-glow transition hover:border-brand-glow hover:bg-night peer-focus-visible:ring-2 peer-focus-visible:ring-brand-glow peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-night"
          >
            {file ? `Trocar foto (${file.name})` : item ? 'Trocar foto' : 'Escolher foto'}
          </label>
          <FieldError id="portfolio-imagem-error" message={errors.imagem} />
          <p className="text-xs text-mist-muted">JPG, PNG ou WebP até 8 MB. A foto é otimizada automaticamente.</p>
        </div>

        {submitError && <StatusBanner tone="error" message={submitError} />}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy} aria-busy={busy}>
            {busy ? 'Salvando...' : 'Salvar projeto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
