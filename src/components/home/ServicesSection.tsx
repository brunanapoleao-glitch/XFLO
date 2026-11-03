import { Heart } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/home/SectionHeading';
import { useSiteSettings } from '@/contexts/siteSettingsContext';
import { formatPreco } from '@/lib/format';
import { getServiceIcon } from '@/lib/serviceIcons';
import type { Service, ServicePricing, SiteSettings } from '@/types/site';

interface ServicesSectionProps {
  services: Service[];
}

function getPriceText(pricing: ServicePricing, settings: SiteSettings | null, failed: boolean): string | null {
  if (pricing === 'quote') return 'Sob orçamento';
  if (!settings) return failed ? 'Consulte-nos' : null;

  const value = pricing === 'site' ? settings.preco_site : settings.preco_convite;
  return `A partir de ${formatPreco(value)}`;
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const { settings, status } = useSiteSettings();

  return (
    <section id="servicos" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Serviços"
            title="Soluções digitais feitas para a sua necessidade"
            description="Cada projeto nasce de uma conversa: entendemos o seu objetivo e criamos algo único para você."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = getServiceIcon(service.icone);
            const priceText = getPriceText(service.tipo_preco, settings, status === 'error');

            return (
              <Reveal key={service.id} delay={index * 90}>
                <article className="group flex h-full flex-col gap-6 rounded-3xl border border-brand-deep/30 bg-night p-8 transition duration-500 hover:-translate-y-1.5 hover:border-brand/60 hover:bg-night-2 hover:shadow-glow">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-deep/25 text-brand-glow transition duration-500 group-hover:scale-110 group-hover:bg-brand-deep/40">
                    <Icon size={26} aria-hidden="true" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3">
                    <h3 className="text-xl font-semibold text-mist">{service.titulo}</h3>
                    <p className="text-sm leading-relaxed text-mist-muted">{service.descricao}</p>
                  </div>
                  <div className="border-t border-brand-deep/30 pt-5">
                    {priceText ? (
                      <p className="text-sm font-semibold text-brand-glow">{priceText}</p>
                    ) : (
                      <div className="h-5 w-40 animate-pulse rounded bg-night-2" aria-label="Carregando preço" />
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="flex flex-col gap-4 rounded-3xl border border-brand/40 bg-gradient-to-br from-brand-deep/20 via-night-2 to-night p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/20 text-brand-glow">
              <Heart size={22} aria-hidden="true" />
            </div>
            <p className="text-pretty text-sm leading-relaxed text-mist sm:text-base">
              Os valores são personalizados de acordo com a necessidade de cada cliente. Os preços acima são o
              ponto de partida.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
