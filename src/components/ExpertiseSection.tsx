import { motion } from 'motion/react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language } from '../types/portfolio';

interface ExpertiseSectionProps {
  lang: Language;
}

export function ExpertiseSection({ lang }: ExpertiseSectionProps) {
  const t = STATIC_CONTENT[lang].expertise;

  return (
    <section id="expertises" className="bg-[#F4F5F7] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <p className="text-xs font-semibold tracking-wider text-[#C5A46D] mb-2">
            {t.sectionLabel}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101C35] tracking-tight [text-wrap:balance] mb-4">
            {t.title}
          </h2>
          <p className="text-[15px] sm:text-base text-[#687386] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.items.map((item, idx) => (
            <motion.article
              key={item.index}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.35,
                delay: (idx % 3) * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group bg-white border border-slate-200/90 rounded-xl p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C5A46D]/60"
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <span className="font-serif text-2xl font-semibold text-[#C5A46D] tabular-nums">
                  {item.index}
                </span>
                <span className="h-[1px] w-8 bg-slate-200 group-hover:w-12 group-hover:bg-[#C5A46D] transition-all duration-200" />
              </div>

              <h3 className="font-serif text-xl font-semibold text-[#101C35] mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-[#687386] leading-relaxed">
                {item.description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
