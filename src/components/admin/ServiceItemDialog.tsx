import { useState, type FormEvent } from 'react';
import Modal from '@/components/ui/Modal';
import FieldError from '@/components/ui/FieldError';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS, fieldBorder } from '@/components/ui/fieldStyles';
import StatusBanner from '@/components/ui/StatusBanner';
import { createService, updateService, type ServiceInput } from '@/lib/adminContent';
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from '@/lib/serviceIcons';
import type { Service, ServicePricing } from '@/types/site';

const PRICING_OPTIONS: { value: ServicePricing; label: string }[] = [
  { value: 'site', label: 'Preço de sites (usa o valor das configurações)' },
  { value: 'invite', label: 'Preço de convites (usa o valor das configurações)' },
  { value: 'quote', label: 'Sob orçamento' },
];

interface ServiceItemDialogProps {
  service: Service | null;
  defaultOrder: number;
  onClose: () => void;
  onSaved: (message: string) => void;
}

interface ServiceFormValues {
  titulo: string;
  descricao: string;
  icone: string;
  tipoPreco: ServicePricing;
  ordem: string;
}

type ServiceFormErrors = Partial<Record<keyof ServiceFormValues, string>>;

function validate(values: ServiceFormValues): ServiceFormErrors {
  const errors: ServiceFormErrors = {};
  if (!values.titulo.trim()) errors.titulo = 'Informe o nome do serviço.';
  if (!values.descricao.trim()) errors.descricao = 'Descreva o serviço em uma frase.';

  const ordem = Number(values.ordem);
  if (values.ordem.trim() === '' || !Number.isInteger(ordem) || ordem < 0 || ordem > 9999) {
    errors.ordem = 'Use um número inteiro entre 0 e 9999.';
  }

  return errors;
}

export default function ServiceItemDialog({ service, defaultOrder, onClose, onSaved }: ServiceItemDialogProps) {
  const [values, setValues] = useState<ServiceFormValues>({
    titulo: service?.titulo ?? '',
    descricao: service?.descricao ?? '',
    icone: service?.icone ?? DEFAULT_SERVICE_ICON,
    tipoPreco: service?.tipo_preco ?? 'quote',
    ordem: String(service?.ordem ?? defaultOrder),
  });
  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = <K extends keyof ServiceFormValues>(field: K, value: ServiceFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setBusy(true);
    setSubmitError(null);
    try {
      const input: ServiceInput = {
        titulo: values.titulo.trim(),
        descricao: values.descricao.trim(),
        icone: values.icone,
        tipo_preco: values.tipoPreco,
        ordem: Number(values.ordem),
      };

      if (service) {
        await updateService(service.id, input);
        onSaved('Serviço atualizado com sucesso.');
      } else {
        await createService(input);
        onSaved('Serviço adicionado à lista.');
      }
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : 'Não foi possível salvar o serviço.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open title={service ? 'Editar serviço' : 'Novo serviço'} onClose={onClose}>
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="Dados do serviço">
        <div className="flex flex-col gap-2">
          <label htmlFor="service-titulo" className="text-sm font-semibold text-mist">
            Nome do serviço <span className="text-brand-glow">*</span>
          </label>
          <input
            id="service-titulo"
            type="text"
            value={values.titulo}
            onChange={(event) => updateField('titulo', event.target.value)}
            aria-invalid={Boolean(errors.titulo)}
            aria-describedby={errors.titulo ? 'service-titulo-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.titulo))}`}
            placeholder="Ex.: Social media"
          />
          <FieldError id="service-titulo-error" message={errors.titulo} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="service-descricao" className="text-sm font-semibold text-mist">
            Descrição <span className="text-brand-glow">*</span>
          </label>
          <textarea
            id="service-descricao"
            rows={4}
            value={values.descricao}
            onChange={(event) => updateField('descricao', event.target.value)}
            aria-invalid={Boolean(errors.descricao)}
            aria-describedby={errors.descricao ? 'service-descricao-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.descricao))} min-h-28 resize-y`}
            placeholder="Conte em poucas palavras o que você entrega ao cliente"
          />
          <FieldError id="service-descricao-error" message={errors.descricao} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="service-icone" className="text-sm font-semibold text-mist">
              Ícone
            </label>
            <select
              id="service-icone"
              value={values.icone}
              onChange={(event) => updateField('icone', event.target.value)}
              className={`${FIELD_CLASS} ${fieldBorder(false)} appearance-none`}
            >
              {Object.entries(SERVICE_ICONS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="service-ordem" className="text-sm font-semibold text-mist">
              Ordem de exibição
            </label>
            <input
              id="service-ordem"
              type="number"
              inputMode="numeric"
              min={0}
              max={9999}
              value={values.ordem}
              onChange={(event) => updateField('ordem', event.target.value)}
              aria-invalid={Boolean(errors.ordem)}
              aria-describedby={errors.ordem ? 'service-ordem-error' : undefined}
              className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.ordem))}`}
            />
            <FieldError id="service-ordem-error" message={errors.ordem} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="service-preco" className="text-sm font-semibold text-mist">
            Preço exibido
          </label>
          <select
            id="service-preco"
            value={values.tipoPreco}
            onChange={(event) => updateField('tipoPreco', event.target.value as ServicePricing)}
            className={`${FIELD_CLASS} ${fieldBorder(false)} appearance-none`}
          >
            {PRICING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-mist-muted">
            Marcar como convite faz o formulário de orçamento pedir os detalhes do convite.
          </p>
        </div>

        {submitError && <StatusBanner tone="error" message={submitError} />}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancelar
          </Button>
          <Button type="submit" disabled={busy} aria-busy={busy}>
            {busy ? 'Salvando...' : 'Salvar serviço'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
