import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language, ProjectItem, SiteConfig } from '../types/portfolio';

interface AgencySectionProps {
  lang: Language;
  config: SiteConfig;
  agencyProject?: ProjectItem;
  onSelectProject: (project: ProjectItem) => void;
}

export function AgencySection({
  lang,
  config,
  agencyProject,
  onSelectProject,
}: AgencySectionProps) {
  const t = STATIC_CONTENT[lang].agency;

  const handleCtaClick = () => {
    if (config.agencyWebsiteUrl) {
      window.location.assign(config.agencyWebsiteUrl);
      return;
    }
    if (agencyProject) {
      onSelectProject(agencyProject);
      return;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="agence" className="bg-[#101C35] text-white py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Agency Identity & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-5"
          >
            <p className="text-xs font-semibold tracking-wider text-[#C5A46D] mb-2">
              {t.sectionLabel}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-3">
              {t.name}
            </h2>
            <p className="text-sm font-medium text-[#C5A46D] mb-6">{t.role}</p>

            <p className="text-[15px] sm:text-base text-slate-200/90 leading-relaxed mb-8">
              {t.description}
            </p>

            <div className="space-y-4">
              {config.agencyWebsiteUrl ? (
                <a
                  href={config.agencyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#C5A46D] hover:bg-[#B49158] text-[#101C35] rounded-md transition-colors whitespace-nowrap"
                >
                  <span>{t.cta}</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold bg-[#C5A46D] hover:bg-[#B49158] text-[#101C35] rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{t.cta}</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <p className="text-xs text-slate-300/80 leading-relaxed">{t.ctaNote}</p>
              <p className="text-xs font-medium text-[#C5A46D] pt-1">{t.contactQuick}</p>
            </div>
          </motion.div>

          {/* Right Column: 8 Services with clean architectural dividers */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-7 bg-white/[0.04] border border-white/10 rounded-xl p-7 sm:p-10"
          >
            <h3 className="font-serif text-xl font-semibold text-white mb-6">
              {t.servicesTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-white/10">
              {t.services.map((service, idx) => (
                <div
                  key={service}
                  className="py-4 sm:border-b sm:border-white/10 flex items-baseline gap-3.5"
                >
                  <span className="font-serif text-sm font-semibold text-[#C5A46D] tabular-nums shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm sm:text-[15px] text-slate-100 leading-snug">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
