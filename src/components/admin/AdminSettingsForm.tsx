import { useEffect, useState, type FormEvent } from 'react';
import { Save } from 'lucide-react';
import FieldError from '@/components/ui/FieldError';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS, fieldBorder } from '@/components/ui/fieldStyles';
import StatusBanner from '@/components/ui/StatusBanner';
import { updateSettings, type SettingsInput } from '@/lib/adminContent';
import { fetchSettings } from '@/lib/publicContent';
import { useAsyncData } from '@/hooks/useAsyncData';
import { normalizeInstagram } from '@/lib/social';
import { normalizeWhatsappNumber } from '@/lib/whatsapp';

interface SettingsFormValues {
  whatsapp: string;
  instagram: string;
  precoSite: string;
  precoConvite: string;
}

type SettingsErrors = Partial<Record<keyof SettingsFormValues, string>>;

type Feedback = { tone: 'success' | 'error'; message: string } | null;

function toFormValues(settings: SettingsInput): SettingsFormValues {
  return {
    whatsapp: settings.whatsapp,
    instagram: settings.instagram,
    precoSite: settings.preco_site.toFixed(2).replace('.', ','),
    precoConvite: settings.preco_convite.toFixed(2).replace('.', ','),
  };
}

function parsePrice(value: string): number | null {
  const normalized = value.trim().replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Number(normalized);
}

function validate(values: SettingsFormValues): SettingsErrors {
  const errors: SettingsErrors = {};

  if (!normalizeWhatsappNumber(values.whatsapp)) {
    errors.whatsapp = 'Informe o número com DDI e DDD, somente números. Ex.: 5511912345678';
  }
  if (values.instagram.trim() && !normalizeInstagram(values.instagram)) {
    errors.instagram = 'Informe um link válido do Instagram ou o @ do perfil.';
  }
  if (parsePrice(values.precoSite) === null) {
    errors.precoSite = 'Informe um valor válido. Ex.: 249,99';
  }
  if (parsePrice(values.precoConvite) === null) {
    errors.precoConvite = 'Informe um valor válido. Ex.: 9,99';
  }

  return errors;
}

function toSettingsInput(values: SettingsFormValues): SettingsInput {
  return {
    whatsapp: normalizeWhatsappNumber(values.whatsapp) ?? '',
    instagram: normalizeInstagram(values.instagram) ?? '',
    preco_site: parsePrice(values.precoSite) ?? 0,
    preco_convite: parsePrice(values.precoConvite) ?? 0,
  };
}

export default function AdminSettingsForm() {
  const { data: settings, status, reload } = useAsyncData(fetchSettings);
  const [values, setValues] = useState<SettingsFormValues | null>(null);
  const [errors, setErrors] = useState<SettingsErrors>({});
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (settings) setValues(toFormValues(settings));
  }, [settings]);

  if (status === 'loading' && !values) {
    return <div className="h-96 animate-pulse rounded-3xl bg-night" aria-busy="true" aria-label="Carregando configurações" />;
  }

  if (status === 'error' || !values) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-deep/30 bg-night p-8 text-center">
        <p className="text-mist-muted">Não foi possível carregar as configurações.</p>
        <Button variant="secondary" onClick={reload}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  const updateField = (field: keyof SettingsFormValues, value: string) => {
    setValues((current) => (current ? { ...current, [field]: value } : current));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setFeedback({ tone: 'error', message: 'Revise os campos destacados antes de salvar.' });
      return;
    }

    setBusy(true);
    setFeedback(null);
    try {
      const input = toSettingsInput(values);
      await updateSettings(input);
      setValues(toFormValues(input));
      setFeedback({ tone: 'success', message: 'Configurações salvas. O site já mostra as novas informações.' });
    } catch (caught) {
      setFeedback({
        tone: 'error',
        message: caught instanceof Error ? caught.message : 'Não foi possível salvar as configurações.',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-3xl border border-brand-deep/30 bg-night p-6 sm:p-8"
      aria-label="Configurações do site"
    >
      <div>
        <h2 className="text-lg font-semibold text-mist">Contato e preços</h2>
        <p className="mt-1 text-sm text-mist-muted">Estas informações aparecem nos botões e no rodapé do site.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="settings-whatsapp" className="text-sm font-semibold text-mist">
            Número de WhatsApp
          </label>
          <input
            id="settings-whatsapp"
            type="tel"
            inputMode="tel"
            value={values.whatsapp}
            onChange={(event) => updateField('whatsapp', event.target.value)}
            aria-invalid={Boolean(errors.whatsapp)}
            aria-describedby={errors.whatsapp ? 'settings-whatsapp-error' : 'settings-whatsapp-help'}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.whatsapp))}`}
          />
          {errors.whatsapp ? (
            <FieldError id="settings-whatsapp-error" message={errors.whatsapp} />
          ) : (
            <p id="settings-whatsapp-help" className="text-xs text-mist-muted">
              Com código do país e DDD, somente números. Usado em todos os botões de WhatsApp.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label htmlFor="settings-instagram" className="text-sm font-semibold text-mist">
            Instagram <span className="font-normal text-mist-muted">(opcional)</span>
          </label>
          <input
            id="settings-instagram"
            type="text"
            value={values.instagram}
            onChange={(event) => updateField('instagram', event.target.value)}
            aria-invalid={Boolean(errors.instagram)}
            aria-describedby={errors.instagram ? 'settings-instagram-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.instagram))}`}
            placeholder="@seuperfil ou https://instagram.com/seuperfil"
          />
          <FieldError id="settings-instagram-error" message={errors.instagram} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="settings-preco-site" className="text-sm font-semibold text-mist">
            Sites: a partir de (R$)
          </label>
          <input
            id="settings-preco-site"
            type="text"
            inputMode="decimal"
            value={values.precoSite}
            onChange={(event) => updateField('precoSite', event.target.value)}
            aria-invalid={Boolean(errors.precoSite)}
            aria-describedby={errors.precoSite ? 'settings-preco-site-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.precoSite))}`}
          />
          <FieldError id="settings-preco-site-error" message={errors.precoSite} />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="settings-preco-convite" className="text-sm font-semibold text-mist">
            Convites: a partir de (R$)
          </label>
          <input
            id="settings-preco-convite"
            type="text"
            inputMode="decimal"
            value={values.precoConvite}
            onChange={(event) => updateField('precoConvite', event.target.value)}
            aria-invalid={Boolean(errors.precoConvite)}
            aria-describedby={errors.precoConvite ? 'settings-preco-convite-error' : undefined}
            className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.precoConvite))}`}
          />
          <FieldError id="settings-preco-convite-error" message={errors.precoConvite} />
        </div>
      </div>

      {feedback && <StatusBanner tone={feedback.tone} message={feedback.message} />}

      <div className="flex justify-end">
        <Button type="submit" disabled={busy} aria-busy={busy} className="w-full sm:w-auto">
          <Save size={16} aria-hidden="true" />
          {busy ? 'Salvando...' : 'Salvar configurações'}
        </Button>
      </div>
    </form>
  );
}
