import { motion } from 'motion/react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language } from '../types/portfolio';

interface AboutSectionProps {
  lang: Language;
}

export function AboutSection({ lang }: AboutSectionProps) {
  const t = STATIC_CONTENT[lang].about;

  return (
    <section id="apropos" className="bg-white py-20 sm:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Editorial Biography */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="text-xs font-semibold tracking-wider text-[#C5A46D] mb-2">
              {t.sectionLabel}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101C35] tracking-tight [text-wrap:balance] mb-8">
              {t.title}
            </h2>

            <div className="space-y-4 text-[15px] sm:text-base text-[#1E293B] leading-[1.75] max-w-[68ch]">
              {t.paragraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Three Core Values separated by subtle hairline dividers */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-[#F4F5F7] rounded-xl p-8 sm:p-10"
          >
            <h3 className="font-serif text-xl font-semibold text-[#101C35] mb-6">
              {t.valuesTitle}
            </h3>

            <div className="divide-y divide-slate-200">
              {t.values.map((val) => (
                <div key={val.index} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-serif text-lg font-semibold text-[#C5A46D] tabular-nums">
                      {val.index}.
                    </span>
                    <h4 className="font-serif text-lg font-semibold text-[#101C35]">
                      {val.title}
                    </h4>
                  </div>
                  <p className="text-sm text-[#687386] leading-relaxed pl-8">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
