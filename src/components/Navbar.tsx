import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language } from '../types/portfolio';

interface NavbarProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export function Navbar({ lang, onChangeLang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = STATIC_CONTENT[lang].nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { href: '#apropos', label: t.about },
    { href: '#expertises', label: t.expertise },
    { href: '#parcours', label: t.journey },
    { href: '#realisations', label: t.projects },
    { href: '#actualites', label: t.blog },
  ];

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#101C35]/95 backdrop-blur-md border-b border-white/10 shadow-sm'
          : 'bg-[#101C35]/80 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#accueil"
          className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A46D]"
        >
          Sophie F. Ngolom
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative py-1 hover:text-[#C5A46D] transition-colors whitespace-nowrap shrink-0 after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-[#C5A46D] hover:after:w-full after:transition-all after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C5A46D]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action (+ Mobile Menu Trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#101C35] bg-[#C5A46D] hover:bg-[#B49158] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t.contact}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.menuClose : t.menuOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-md text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#C5A46D]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#101C35] border-t border-white/10 px-6 py-6 space-y-5">
          <nav className="flex flex-col space-y-3" aria-label="Menu mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className="py-2 text-base font-medium text-slate-100 hover:text-[#C5A46D] border-b border-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center justify-between pt-2">
            <div
              className="inline-flex items-center bg-white/10 rounded-md p-1"
              role="group"
              aria-label="Language switcher"
            >
              <button
                type="button"
                onClick={() => onChangeLang('fr')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  lang === 'fr' ? 'bg-[#C5A46D] text-[#101C35]' : 'text-slate-200 hover:text-white'
                }`}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => onChangeLang('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  lang === 'en' ? 'bg-[#C5A46D] text-[#101C35]' : 'text-slate-200 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <a
              href="#contact"
              onClick={handleLinkClick}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-[#101C35] bg-[#C5A46D] rounded-md"
            >
              {t.contact}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
