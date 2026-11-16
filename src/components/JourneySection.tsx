import { useState } from 'react';
import { motion } from 'motion/react';
import { STATIC_CONTENT } from '../data/translations';
import type { ExperienceItem, Language } from '../types/portfolio';

interface JourneySectionProps {
  lang: Language;
  experiences: ExperienceItem[];
}

export function JourneySection({ lang, experiences }: JourneySectionProps) {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience');
  const t = STATIC_CONTENT[lang].journey;

  return (
    <section id="parcours" className="bg-white py-20 sm:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#C5A46D] mb-2">
              {t.sectionLabel}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101C35] tracking-tight [text-wrap:balance]">
              {t.title}
            </h2>
          </div>

          {/* Interactive Segmented Tab Control */}
          <div
            className="inline-flex items-center p-1 bg-[#F4F5F7] rounded-lg self-start md:self-auto"
            role="tablist"
            aria-label={t.title}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'experience'}
              onClick={() => setActiveTab('experience')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'experience'
                  ? 'bg-[#101C35] text-white'
                  : 'text-[#687386] hover:text-[#101C35]'
              }`}
            >
              {t.tabExperience}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'education'}
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'education'
                  ? 'bg-[#101C35] text-white'
                  : 'text-[#687386] hover:text-[#101C35]'
              }`}
            >
              {t.tabEducation}
            </button>
          </div>
        </div>

        {activeTab === 'experience' ? (
          <div className="relative pl-6 sm:pl-10 border-l border-slate-200 space-y-10 max-w-4xl">
            {experiences.map((exp, idx) => (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="relative"
              >
                {/* Timeline node */}
                <span
                  aria-hidden="true"
                  className="absolute -left-[29px] sm:-left-[45px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#C5A46D] ring-4 ring-white"
                />

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#687386] mb-2">
                  <span className="text-[#C5A46D] font-semibold tabular-nums">
                    {t.expPrefix} {exp.index}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{exp.period[lang]}</span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#101C35] mb-1">
                  {exp.organization[lang]}
                </h3>

                <p className="text-sm font-semibold text-[#101C35]/80 mb-3">
                  {exp.role[lang]}
                </p>

                <p className="text-sm sm:text-[15px] text-[#687386] leading-relaxed">
                  {exp.summary[lang]}
                </p>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="max-w-4xl">
            <p className="text-sm text-[#687386] mb-8">{t.educationNote}</p>
            <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
              {t.education.map((edu) => (
                <motion.div
                  key={`${edu.period}-${edu.title}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
                >
                  <div className="sm:col-span-3">
                    <span className="font-serif text-base font-semibold text-[#C5A46D] tabular-nums">
                      {edu.period}
                    </span>
                  </div>
                  <div className="sm:col-span-9">
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#101C35] mb-1">
                      {edu.title}
                    </h3>
                    <p className="text-sm text-[#687386]">{edu.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
