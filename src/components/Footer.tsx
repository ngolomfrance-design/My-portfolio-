import { ArrowUp, QrCode } from 'lucide-react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language, SiteConfig } from '../types/portfolio';

interface FooterProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  config: SiteConfig;
  onOpenQrCode: () => void;
}

export function Footer({ lang, onChangeLang, config, onOpenQrCode }: FooterProps) {
  const t = STATIC_CONTENT[lang].footer;
  const nav = STATIC_CONTENT[lang].nav;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#101C35] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Identity */}
          <div className="md:col-span-5 space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-white">
              SOPHIE FRANCETTE NGOLOM
            </h2>
            <p className="text-sm text-slate-300">{t.role}</p>
            <p className="text-sm text-[#C5A46D]">{t.location}</p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D]">
              {t.navTitle}
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm text-slate-300">
              <li>
                <a href="#apropos" className="hover:text-[#C5A46D] transition-colors">
                  {nav.about}
                </a>
              </li>
              <li>
                <a href="#expertises" className="hover:text-[#C5A46D] transition-colors">
                  {nav.expertise}
                </a>
              </li>
              <li>
                <a href="#parcours" className="hover:text-[#C5A46D] transition-colors">
                  {nav.journey}
                </a>
              </li>
              <li>
                <a href="#realisations" className="hover:text-[#C5A46D] transition-colors">
                  {nav.projects}
                </a>
              </li>
              <li>
                <a href="#actualites" className="hover:text-[#C5A46D] transition-colors">
                  {nav.blog}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#C5A46D] transition-colors">
                  {nav.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Professional Connect & Language */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D]">
              {t.connectTitle}
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="mailto:ngolomfrance@icloud.com"
                  className="hover:text-[#C5A46D] transition-colors"
                >
                  ngolomfrance@icloud.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:dataworkagency0@gmail.com"
                  className="hover:text-[#C5A46D] transition-colors"
                >
                  dataworkagency0@gmail.com
                </a>
              </li>
              {config.linkedinUrl && (
                <li>
                  <a
                    href={config.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#C5A46D] transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {config.githubUrl && (
                <li>
                  <a
                    href={config.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#C5A46D] transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={onOpenQrCode}
                  className="inline-flex items-center gap-1.5 hover:text-[#C5A46D] transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#C5A46D]" aria-hidden="true" />
                  <span>{lang === 'fr' ? 'QR Code du site' : 'Site QR Code'}</span>
                </button>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <div className="inline-flex items-center bg-white/10 rounded-md p-1">
                <button
                  type="button"
                  onClick={() => onChangeLang('fr')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                    lang === 'fr' ? 'bg-[#C5A46D] text-[#101C35]' : 'text-slate-300'
                  }`}
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => onChangeLang('en')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer ${
                    lang === 'en' ? 'bg-[#C5A46D] text-[#101C35]' : 'text-slate-300'
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#C5A46D] transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.backToTop}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>{t.copyright}</p>
          <p className="text-[#C5A46D] font-medium">{t.credits}</p>
        </div>
      </div>
    </footer>
  );
}
