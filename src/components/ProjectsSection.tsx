import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language, ProjectItem } from '../types/portfolio';
import { SafeImage } from './SafeImage';

interface ProjectsSectionProps {
  lang: Language;
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

type FilterKey = 'all' | 'software' | 'entrepreneurship' | 'hackathon';

export function ProjectsSection({
  lang,
  projects,
  onSelectProject,
}: ProjectsSectionProps) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const t = STATIC_CONTENT[lang].projects;

  const filtered = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter, projects]);

  const filterButtons: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t.filters.all },
    { key: 'software', label: t.filters.software },
    { key: 'entrepreneurship', label: t.filters.entrepreneurship },
    { key: 'hackathon', label: t.filters.hackathon },
  ];

  return (
    <section id="realisations" className="bg-[#F4F5F7] py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-14">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-[#C5A46D] mb-2">
              {t.sectionLabel}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#101C35] tracking-tight [text-wrap:balance] mb-3">
              {t.title}
            </h2>
            <p className="text-[15px] sm:text-base text-[#687386] leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div
            className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start lg:self-auto"
            role="group"
            aria-label={t.title}
          >
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => setFilter(btn.key)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  filter === btn.key
                    ? 'bg-[#101C35] text-white'
                    : 'text-[#687386] hover:text-[#101C35]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer bg-white border border-slate-200/90 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C5A46D]/60"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#101C35]">
                <SafeImage
                  src={project.image}
                  alt={project.name[lang]}
                  fallbackLabel={project.name[lang]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  {/* Zero-Pill unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#687386] mb-3">
                    <span className="font-semibold text-[#C5A46D] tabular-nums">
                      {lang === 'fr' ? 'Projet' : 'Project'} {project.index}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{project.status[lang]}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-[#101C35] mb-3 group-hover:text-[#C5A46D] transition-colors">
                    {project.name[lang]}
                  </h3>

                  <p className="text-sm sm:text-[15px] text-[#687386] leading-relaxed mb-6">
                    {project.shortDescription[lang]}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#101C35] group-hover:text-[#C5A46D] transition-colors">
                    {t.viewDetails}
                  </span>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#101C35] group-hover:text-[#C5A46D] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
