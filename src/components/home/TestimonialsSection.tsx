import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionHeading from '@/components/home/SectionHeading';
import type { Testimonial } from '@/types/site';

const AUTOPLAY_INTERVAL_MS = 6000;

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function scrollToSlide(track: HTMLElement | null, index: number) {
  const slide = track?.children[index] as HTMLElement | undefined;
  if (!track || !slide) return;
  track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
}

function isAtEnd(track: HTMLElement) {
  return track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
}

function advanceSlide(track: HTMLElement | null, activeIndex: number, count: number) {
  if (!track) return;
  if (isAtEnd(track)) {
    track.scrollTo({ left: 0, behavior: 'smooth' });
    return;
  }
  scrollToSlide(track, Math.min(activeIndex + 1, count - 1));
}

function retreatSlide(track: HTMLElement | null, activeIndex: number) {
  if (!track) return;
  if (activeIndex === 0) {
    track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    return;
  }
  scrollToSlide(track, activeIndex - 1);
}

function findNearestSlide(track: HTMLElement) {
  let nearest = 0;
  let best = Infinity;
  Array.from(track.children).forEach((child, index) => {
    const distance = Math.abs((child as HTMLElement).offsetLeft - track.scrollLeft);
    if (distance < best) {
      best = distance;
      nearest = index;
    }
  });
  return nearest;
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const count = testimonials.length;
  const showControls = count > 1;

  useEffect(() => {
    if (!showControls || paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setInterval(() => {
      advanceSlide(trackRef.current, activeIndex, count);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [activeIndex, count, paused, showControls]);

  const handleSetPaused = (value: boolean) => {
    setPaused(value);
    if (!value) setCycle((current) => current + 1);
  };

  const handleScroll = () => {
    if (trackRef.current) setActiveIndex(findNearestSlide(trackRef.current));
  };

  return (
    <section id="depoimentos" className="scroll-mt-24 border-t border-brand-deep/20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <Reveal>
          <SectionHeading eyebrow="Depoimentos" title="O que nossos clientes dizem sobre nós" />
        </Reveal>

        <Reveal delay={120}>
          <div
            className="flex flex-col gap-8"
            onPointerEnter={() => handleSetPaused(true)}
            onPointerLeave={() => handleSetPaused(false)}
            onFocus={() => handleSetPaused(true)}
            onBlur={() => handleSetPaused(false)}
          >
            <ul
              ref={trackRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {testimonials.map((testimonial) => (
                <li
                  key={testimonial.id}
                  className="shrink-0 snap-start basis-full md:basis-[calc((100%-1.5rem)/2)] xl:basis-[calc((100%-3rem)/3)]"
                >
                  <figure className="flex h-full flex-col gap-6 rounded-3xl border border-brand-deep/30 bg-night p-8 transition duration-500 hover:-translate-y-1.5 hover:border-brand/60 hover:shadow-glow">
                    <div className="flex gap-1" role="img" aria-label={`Nota ${testimonial.nota} de 5`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          aria-hidden="true"
                          className={
                            star <= testimonial.nota ? 'fill-brand-glow text-brand-glow' : 'text-brand-deep/50'
                          }
                        />
                      ))}
                    </div>
                    <blockquote className="flex-1 text-pretty text-base leading-relaxed text-mist">
                      &ldquo;{testimonial.texto}&rdquo;
                    </blockquote>
                    <figcaption className="border-t border-brand-deep/30 pt-5 text-sm font-semibold text-brand-glow">
                      {testimonial.nome}
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>

            {showControls && (
              <div className="flex flex-col gap-5">
                <div aria-hidden="true" className="h-0.5 w-full overflow-hidden rounded-full bg-brand-deep/30 motion-reduce:hidden">
                  <div
                    key={`${activeIndex}-${cycle}`}
                    className="animate-progress-fill h-full origin-left bg-brand-glow"
                    style={{
                      animationDuration: `${AUTOPLAY_INTERVAL_MS}ms`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      type="button"
                      aria-label={`Ir para o depoimento ${index + 1}`}
                      aria-current={index === activeIndex}
                      onClick={() => scrollToSlide(trackRef.current, index)}
                      className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow ${
                        index === activeIndex ? 'w-8 bg-brand-glow' : 'w-2.5 bg-brand-deep/60 hover:bg-brand'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    aria-label="Depoimento anterior"
                    onClick={() => retreatSlide(trackRef.current, activeIndex)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 text-brand-glow transition hover:bg-brand-deep/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Próximo depoimento"
                    onClick={() => advanceSlide(trackRef.current, activeIndex, count)}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/40 text-brand-glow transition hover:bg-brand-deep/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-glow"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
