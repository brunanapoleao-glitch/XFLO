import { useState, type FormEvent } from 'react';
import { MessageCircle } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/home/SectionHeading';
import FieldError from '@/components/ui/FieldError';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS, fieldBorder } from '@/components/ui/fieldStyles';
import { useSiteSettings } from '@/contexts/siteSettingsContext';
import {
  EMPTY_QUOTE_FORM,
  INVITE_TYPES,
  OTHER_SERVICE,
  buildQuoteMessage,
  validateQuoteForm,
  type QuoteFormErrors,
  type QuoteFormValues,
} from '@/lib/quote';
import { buildWhatsappUrl, normalizeWhatsappNumber } from '@/lib/whatsapp';
import type { Service } from '@/types/site';

type Feedback = { type: 'success' | 'error'; message: string } | null;

interface QuoteSectionProps {
  services: Service[];
}

export default function QuoteSection({ services }: QuoteSectionProps) {
  const { settings } = useSiteSettings();
  const [values, setValues] = useState<QuoteFormValues>(EMPTY_QUOTE_FORM);
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [feedback, setFeedback] = useState<Feedback>(null);

  const serviceTitles = [...services.map((service) => service.titulo), OTHER_SERVICE];
  const isInvite = services.some(
    (service) => service.titulo === values.servico && service.tipo_preco === 'invite',
  );

  const updateField = (field: keyof QuoteFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateQuoteForm(values, isInvite);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setFeedback({ type: 'error', message: 'Revise os campos destacados e tente novamente.' });
      return;
    }

    const number = settings?.whatsapp ? normalizeWhatsappNumber(settings.whatsapp) : null;
    if (!number) {
      setFeedback({
        type: 'error',
        message: 'O WhatsApp de atendimento ainda não está configurado. Tente novamente em instantes.',
      });
      return;
    }

    window.open(buildWhatsappUrl(number, buildQuoteMessage(values, isInvite)), '_blank', 'noopener,noreferrer');
    setValues(EMPTY_QUOTE_FORM);
    setFeedback({ type: 'success', message: 'Pronto! Abrimos o WhatsApp com o seu pedido de orçamento.' });
  };

  return (
    <section id="orcamento" className="scroll-mt-24 border-t border-brand-deep/20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
        <Reveal className="lg:sticky lg:top-32">
          <SectionHeading
            align="left"
            eyebrow="Orçamento"
            title="Conte um pouco sobre o seu projeto"
            description="Preencha o formulário e envie o pedido direto pelo WhatsApp. Respondemos com uma proposta personalizada."
          />
        </Reveal>

        <Reveal delay={120}>
          <form
            noValidate
            onSubmit={handleSubmit}
            aria-label="Formulário de orçamento"
            className="flex flex-col gap-6 rounded-3xl border border-brand-deep/30 bg-night p-6 sm:p-8"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="quote-servico" className="text-sm font-semibold text-mist">
                Qual serviço você quer? <span className="text-brand-glow">*</span>
              </label>
              <select
                id="quote-servico"
                value={values.servico}
                onChange={(event) => updateField('servico', event.target.value)}
                aria-invalid={Boolean(errors.servico)}
                aria-describedby={errors.servico ? 'quote-servico-error' : undefined}
                className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.servico))} appearance-none`}
              >
                <option value="">Selecione um serviço</option>
                {serviceTitles.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <FieldError id="quote-servico-error" message={errors.servico} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="quote-nome" className="text-sm font-semibold text-mist">
                Seu nome ou empresa <span className="text-brand-glow">*</span>
              </label>
              <input
                id="quote-nome"
                type="text"
                autoComplete="name"
                value={values.nome}
                onChange={(event) => updateField('nome', event.target.value)}
                aria-invalid={Boolean(errors.nome)}
                aria-describedby={errors.nome ? 'quote-nome-error' : undefined}
                className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.nome))}`}
                placeholder="Como devemos te chamar?"
              />
              <FieldError id="quote-nome-error" message={errors.nome} />
            </div>

            {isInvite && (
              <div className="animate-field-reveal flex flex-col gap-6 rounded-2xl border border-brand/30 bg-night-2 p-5">
                <p className="text-sm font-semibold text-brand-glow">Detalhes do convite</p>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="quote-idade" className="text-sm font-semibold text-mist">
                      Idade de quem será homenageado
                    </label>
                    <input
                      id="quote-idade"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={120}
                      value={values.idade}
                      onChange={(event) => updateField('idade', event.target.value)}
                      aria-invalid={Boolean(errors.idade)}
                      aria-describedby={errors.idade ? 'quote-idade-error' : undefined}
                      className={`${FIELD_CLASS} ${fieldBorder(Boolean(errors.idade))}`}
                      placeholder="Ex.: 15"
                    />
                    <FieldError id="quote-idade-error" message={errors.idade} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="quote-tema" className="text-sm font-semibold text-mist">
                      Tema
                    </label>
                    <input
                      id="quote-tema"
                      type="text"
                      value={values.tema}
                      onChange={(event) => updateField('tema', event.target.value)}
                      className={`${FIELD_CLASS} ${fieldBorder(false)}`}
                      placeholder="Ex.: Jardim encantado"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="quote-tipo-convite" className="text-sm font-semibold text-mist">
                    Tipo de convite
                  </label>
                  <select
                    id="quote-tipo-convite"
                    value={values.tipoConvite}
                    onChange={(event) => updateField('tipoConvite', event.target.value)}
                    className={`${FIELD_CLASS} ${fieldBorder(false)} appearance-none`}
                  >
                    <option value="">Selecione o tipo</option>
                    {INVITE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="quote-observacoes" className="text-sm font-semibold text-mist">
                Observações <span className="font-normal text-mist-muted">(opcional)</span>
              </label>
              <textarea
                id="quote-observacoes"
                rows={4}
                value={values.observacoes}
                onChange={(event) => updateField('observacoes', event.target.value)}
                className={`${FIELD_CLASS} ${fieldBorder(false)} min-h-28 resize-y`}
                placeholder="Prazo, referências, cores preferidas ou qualquer detalhe importante"
              />
            </div>

            {feedback && (
              <p
                role={feedback.type === 'error' ? 'alert' : 'status'}
                className={`animate-fade-in rounded-2xl border px-4 py-3 text-sm ${
                  feedback.type === 'error'
                    ? 'border-red-400/40 bg-red-500/10 text-red-100'
                    : 'border-whatsapp/40 bg-whatsapp/10 text-mist'
                }`}
              >
                {feedback.message}
              </p>
            )}

            <Button type="submit" variant="whatsapp" className="w-full">
              <MessageCircle size={18} aria-hidden="true" />
              Enviar pedido pelo WhatsApp
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
