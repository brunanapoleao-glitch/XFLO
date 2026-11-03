import { Heart } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/home/SectionHeading';

const PARAGRAPHS = [
  'Somos uma empresa especializada em soluções digitais e criativas, dedicada a transformar ideias em projetos únicos, funcionais e visualmente encantadores.',
  'Unimos criatividade, tecnologia e estratégia para desenvolver experiências que valorizam marcas, fortalecem negócios e tornam momentos especiais ainda mais memoráveis.',
  'Oferecemos soluções personalizadas, como criação de sites, identidade visual, convites interativos, catálogos digitais e outros materiais que conectam pessoas e marcas ao mundo digital.',
  'Acreditamos que cada projeto tem uma identidade própria e merece ser desenvolvido com atenção aos detalhes, inovação e dedicação.',
];

export default function AboutSection() {
  return (
    <section id="quem-somos" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <SectionHeading
            align="left"
            eyebrow="Quem somos"
            title="Transformamos ideias em experiências digitais."
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="flex flex-col gap-6">
            {PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="text-pretty text-base leading-relaxed text-mist-muted sm:text-lg">
                {paragraph}
              </p>
            ))}
            <p className="flex items-center gap-3 border-l-2 border-brand pl-5 text-pretty text-base font-semibold leading-relaxed text-mist">
              <Heart size={18} className="shrink-0 text-brand-glow" aria-hidden="true" />
              Mais do que criar designs, criamos experiências que comunicam, conectam e geram resultados.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
