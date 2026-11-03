interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}

export default function SectionHeading({ eyebrow, title, description, align = 'center' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-glow">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-bold leading-[1.2] text-mist sm:text-4xl">{title}</h2>
      {description && <p className="text-pretty text-base leading-relaxed text-mist-muted">{description}</p>}
    </div>
  );
}
