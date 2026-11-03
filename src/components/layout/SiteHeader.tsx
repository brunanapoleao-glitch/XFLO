import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LinkButton } from '@/components/ui/Button';
import { XfloWordmark } from '@/components/ui/XfloLogo';

interface SiteHeaderProps {
  showTestimonials: boolean;
}

export default function SiteHeader({ showTestimonials }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const navItems = [
    { href: '#quem-somos', label: 'Quem somos' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#portfolio', label: 'Portfólio' },
    ...(showTestimonials ? [{ href: '#depoimentos', label: 'Depoimentos' }] : []),
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'border-b border-brand-deep/30 bg-ink/90 shadow-[0_12px_40px_-24px_rgba(168,85,247,0.6)] backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="/" aria-label="XFLO, página inicial" className="shrink-0 rounded-lg">
          <XfloWordmark />
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-2 text-sm font-semibold text-mist-muted transition-colors hover:text-mist"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brand-glow transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          <LinkButton href="#orcamento" className="min-h-11 px-5 py-2.5">
            Pedir orçamento
          </LinkButton>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-deep/40 text-mist transition hover:border-brand md:hidden"
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="menu-mobile"
          aria-label="Menu móvel"
          className="animate-fade-in border-t border-brand-deep/30 bg-night px-5 pb-6 pt-2 md:hidden"
        >
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={closeMenu}
                  className="flex min-h-11 items-center border-b border-brand-deep/20 py-3 text-base font-semibold text-mist transition hover:text-brand-glow"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <LinkButton href="#orcamento" onClick={closeMenu} className="mt-5 w-full">
            Pedir orçamento
          </LinkButton>
        </nav>
      )}
    </header>
  );
}
