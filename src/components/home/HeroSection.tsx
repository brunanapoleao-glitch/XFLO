import { CircleCheck, Lightbulb, MessageCircle } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { GENERAL_WHATSAPP_MESSAGE, getWhatsappHref } from '@/lib/whatsapp';

interface HeroSectionProps {
  whatsapp?: string;
  imageUrl?: string;
}

const DEFAULT_HERO_IMAGE_URL = '/Retrato_profissional_no_escritorio_com_foco_e_planos.png';

export default function HeroSection({ whatsapp, imageUrl }: HeroSectionProps) {
  const whatsappHref = getWhatsappHref(whatsapp, GENERAL_WHATSAPP_MESSAGE);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-32 sm:px-8">
      <div
        aria-hidden="true"
        className="animate-glow-pulse pointer-events-none absolute left-1/2 top-[42%] h-[520px] w-[520px] rounded-full bg-brand-deep/40 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <span
            className="animate-title-intro inline-flex items-center gap-2 rounded-full border border-brand/30 bg-night/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand-glow"
          >
            <Lightbulb size={14} aria-hidden="true" />
            Estúdio criativo digital
          </span>

          <h1
            className="animate-title-intro mt-6 text-balance text-3xl font-bold leading-[1.15] text-mist sm:text-5xl lg:text-[3.5rem]"
            style={{ animationDelay: '150ms' }}
          >
            Sites, catálogos e convites que deixam sua marca{' '}
            <span className="bg-gradient-to-r from-brand-glow to-brand bg-clip-text text-transparent">
              em destaque.
            </span>
          </h1>

          <p
            className="animate-title-intro mt-6 max-w-xl text-pretty text-base leading-relaxed text-mist-muted sm:text-lg"
            style={{ animationDelay: '300ms' }}
          >
            Criamos projetos digitais sob medida, com design elegante e atenção a cada detalhe, para
            o seu negócio ou para a sua celebração.
          </p>

          <div
            className="animate-title-intro mt-10 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: '450ms' }}
          >
            {whatsappHref ? (
              <LinkButton
                variant="whatsapp"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Falar no WhatsApp
              </LinkButton>
            ) : (
              <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-whatsapp/40 px-8 py-3 text-sm font-semibold text-ink">
                WhatsApp em configuração
              </span>
            )}
            <LinkButton variant="secondary" href="#servicos" className="px-8">
              Ver serviços
            </LinkButton>
          </div>
        </div>

        <div
          className="animate-fade-in relative mx-auto w-full max-w-md lg:max-w-none"
          style={{ animationDelay: '250ms' }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-brand/25 bg-night shadow-glow-lg">
            <img
              src={imageUrl || DEFAULT_HERO_IMAGE_URL}
              alt="Profissional sorridente trabalhando em um notebook no escritório"
              width={928}
              height={1237}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/5] h-auto w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent"
            />
          </div>

          <div className="animate-float-slow absolute -left-3 bottom-8 flex items-center gap-3 rounded-2xl border border-brand/25 bg-night/95 px-4 py-3 shadow-glow backdrop-blur sm:-left-8">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-whatsapp/20 text-whatsapp">
              <CircleCheck size={20} aria-hidden="true" />
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-mist">Projeto entregue</span>
              <span className="block text-xs text-mist-muted">Pronto para encantar</span>
            </span>
          </div>

          <div className="animate-float-delayed absolute -right-2 top-6 rounded-full border border-brand/30 bg-brand-deep px-4 py-2 text-xs font-semibold text-mist shadow-glow sm:-right-6">
            Design sob medida
          </div>
        </div>
      </div>
    </section>
  );
}
