import { ArrowDownRight, Download, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_IMAGE, STATIC_CONTENT } from '../data/translations';
import type { Language } from '../types/portfolio';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
}

export function HeroSection({ lang, onChangeLang }: HeroSectionProps) {
  const t = STATIC_CONTENT[lang].hero;

  return (
    <section
      id="accueil"
      className="relative bg-[#101C35] text-white pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden"
    >
      {/* Subtle architectural radial lighting without neon or ghost watermarks */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(197,164,109,0.12),transparent_50%)]"
      />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
        {/* Clean Utility Strip: Location & FR/EN Switcher */}
        <div className="flex items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10 text-xs sm:text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C5A46D] shrink-0" aria-hidden="true" />
            <span>{t.portraitLocation}</span>
          </div>

          <div
            className="inline-flex items-center bg-white/10 rounded-md p-1"
            role="group"
            aria-label={lang === 'fr' ? 'Sélecteur de langue' : 'Language selector'}
          >
            <button
              type="button"
              onClick={() => onChangeLang('fr')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'fr'
                  ? 'bg-[#C5A46D] text-[#101C35]'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                lang === 'en'
                  ? 'bg-[#C5A46D] text-[#101C35]'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Balanced 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Presentation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <p className="text-sm font-semibold tracking-wider text-[#C5A46D] mb-3">
              {t.kicker}
            </p>

            <h1 className="font-serif text-4xl sm:text-5xl xl:text-[3.5rem] font-semibold leading-[1.12] tracking-tight text-white [text-wrap:balance] mb-4">
              {t.name}
            </h1>

            <p className="text-base sm:text-lg font-medium text-slate-200 mb-6">
              {t.positioning}
            </p>

            <blockquote className="font-serif italic text-lg sm:text-xl text-[#C5A46D] leading-relaxed mb-6 max-w-2xl">
              {t.quote}
            </blockquote>

            <div className="space-y-3 text-[15px] sm:text-base text-slate-200/90 leading-relaxed max-w-2xl mb-8">
              <p>{t.bio1}</p>
              <p>{t.bio2}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <a
                href="#parcours"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold bg-[#C5A46D] hover:bg-[#B49158] text-[#101C35] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>{t.ctaJourney}</span>
                <ArrowDownRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <a
                href={`/api/cv?lang=${lang}`}
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold border border-white/25 hover:border-[#C5A46D] text-white hover:text-[#C5A46D] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A46D]"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>{t.ctaCv}</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-slate-200 hover:text-[#C5A46D] underline underline-offset-4 decoration-[#C5A46D]/60 transition-colors whitespace-nowrap shrink-0"
              >
                {t.ctaContact}
              </a>
            </div>

            <p className="text-xs sm:text-sm text-slate-300/90 max-w-xl">
              {t.availability}
            </p>
          </motion.div>

          {/* Right Column: Editorial Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex"
          >
            <div className="relative w-full min-h-[380px] lg:h-full rounded-xl overflow-hidden border border-white/15 bg-[#0B1426]">
              <SafeImage
                src={HERO_IMAGE}
                alt="Sophie Francette Ngolom — Développeuse Web & Mobile, CEO de DATA WORK AGENCY"
                fallbackLabel="Sophie Francette Ngolom"
                className="w-full h-full object-cover object-[50%_22%]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1426]/95 via-[#0B1426]/60 to-transparent p-6 pt-14">
                <p className="font-serif text-base font-medium text-white">
                  {t.portraitCaption}
                </p>
                <p className="text-xs text-[#C5A46D] mt-0.5">{t.portraitLocation}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Executive Strip Below Hero Split */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {t.highlights.map((item) => (
            <div key={item.value} className="space-y-1">
              <p className="text-xs font-medium text-[#C5A46D]">{item.label}</p>
              <p className="font-serif text-lg font-semibold text-white">{item.value}</p>
              <p className="text-xs text-slate-300">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
