import { useAsyncData } from '@/hooks/useAsyncData';
import { fetchPortfolio } from '@/lib/publicContent';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/home/SectionHeading';
import { Button } from '@/components/ui/Button';

export default function PortfolioSection() {
  const { data: items, status, reload } = useAsyncData(fetchPortfolio);

  return (
    <section id="portfolio" className="scroll-mt-24 border-t border-brand-deep/20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Portfólio"
            title="Projetos que já ganharam vida"
            description="Alguns trabalhos feitos sob medida para clientes que queriam se destacar."
          />
        </Reveal>

        {status === 'loading' && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Carregando portfólio">
            {[0, 1, 2].map((key) => (
              <div key={key} className="aspect-[4/5] animate-pulse rounded-3xl bg-night-2 sm:aspect-[4/3]" />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-brand-deep/30 bg-night p-8 text-center">
            <p className="text-mist-muted">Não foi possível carregar o portfólio agora.</p>
            <Button variant="secondary" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        )}

        {status === 'ready' && items && items.length === 0 && (
          <p className="text-center text-mist-muted">Os próximos projetos aparecerão aqui em breve.</p>
        )}

        {status === 'ready' && items && items.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={item.id} className="h-full">
                <Reveal delay={(index % 3) * 90} className="h-full">
                  <article className="group relative h-full overflow-hidden rounded-3xl border border-brand-deep/30 bg-night transition duration-500 hover:-translate-y-1.5 hover:border-brand/60 hover:shadow-glow">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.imagem_url}
                        alt={`Imagem do projeto ${item.titulo}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-ink via-ink/85 to-transparent p-6 pt-16">
                      <span className="w-fit rounded-full border border-brand-glow/40 bg-ink/60 px-3 py-1 text-xs font-semibold text-brand-glow">
                        {item.tipo}
                      </span>
                      <h3 className="text-lg font-semibold leading-snug text-mist">{item.titulo}</h3>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
