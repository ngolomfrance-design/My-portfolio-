import { Check, ExternalLink, X } from 'lucide-react';
import { useEffect } from 'react';
import { STATIC_CONTENT } from '../data/translations';
import type { Language, ProjectItem, SiteConfig } from '../types/portfolio';
import { SafeImage } from './SafeImage';

interface ProjectModalProps {
  project: ProjectItem | null;
  lang: Language;
  config: SiteConfig;
  onClose: () => void;
}

export function ProjectModal({ project, lang, config, onClose }: ProjectModalProps) {
  const t = STATIC_CONTENT[lang].projects.modal;

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const isHackathon = Boolean(project.isHackathon);
  const resolvedLink =
    project.id === 'proj-data-work-agency'
      ? config.agencyWebsiteUrl || project.link
      : isHackathon
        ? config.hackathonLink || project.link
        : project.link;

  const hackathonProblem = isHackathon && config.hackathonProblem ? config.hackathonProblem : project.problem[lang];
  const hackathonTech = isHackathon && config.hackathonTech ? config.hackathonTech : project.technologies[lang];
  const hackathonOutcome = isHackathon && config.hackathonOutcome ? config.hackathonOutcome : project.outcome?.[lang];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1426]/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar inside modal */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-[#687386]">
            <span className="font-semibold text-[#C5A46D] tabular-nums">
              {lang === 'fr' ? 'Projet' : 'Project'} {project.index}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.status[lang]}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="w-10 h-10 inline-flex items-center justify-center rounded-md text-[#101C35] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Screenshot */}
          <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#101C35] border border-slate-200">
            <SafeImage
              src={project.image}
              alt={project.name[lang]}
              fallbackLabel={project.name[lang]}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2
              id="project-modal-title"
              className="font-serif text-2xl sm:text-3xl font-semibold text-[#101C35] mb-3"
            >
              {isHackathon && config.hackathonName ? config.hackathonName : project.name[lang]}
            </h2>
            <p className="text-[15px] text-[#1E293B] leading-relaxed">
              {project.description[lang]}
            </p>
          </div>

          {isHackathon ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                  {t.hackathonYearLabel}
                </h3>
                <p className="text-sm text-[#101C35] font-medium tabular-nums">
                  {project.year || '2026'}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                  {t.hackathonNameLabel}
                </h3>
                <p className="text-sm text-[#687386]">
                  {config.hackathonName || t.toBeSpecified}
                </p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                  {t.hackathonContextLabel}
                </h3>
                <p className="text-sm text-[#1E293B] leading-relaxed">
                  {project.context?.[lang]}
                </p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                  {t.hackathonContributionLabel}
                </h3>
                <p className="text-sm text-[#1E293B] leading-relaxed">
                  {project.contribution?.[lang]}
                </p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                  {t.problemLabel}
                </h3>
                <p className="text-sm text-[#687386] leading-relaxed">{hackathonProblem}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                  {t.techLabel}
                </h3>
                <p className="text-sm text-[#687386] leading-relaxed">{hackathonTech}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                  {t.hackathonOutcomeLabel}
                </h3>
                <p className="text-sm text-[#687386] leading-relaxed">
                  {hackathonOutcome || project.status[lang]}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#F4F5F7] rounded-lg p-5">
                  <h3 className="font-serif text-base font-semibold text-[#101C35] mb-2">
                    {t.problemLabel}
                  </h3>
                  <p className="text-sm text-[#687386] leading-relaxed">
                    {project.problem[lang]}
                  </p>
                </div>

                <div className="bg-[#F4F5F7] rounded-lg p-5">
                  <h3 className="font-serif text-base font-semibold text-[#101C35] mb-2">
                    {t.solutionLabel}
                  </h3>
                  <p className="text-sm text-[#687386] leading-relaxed">
                    {project.solution[lang]}
                  </p>
                </div>
              </div>

              {project.features && project.features[lang].length > 0 && (
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#101C35] mb-3">
                    {t.featuresLabel}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.features[lang].map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-sm text-[#1E293B]"
                      >
                        <Check
                          className="w-4 h-4 text-[#C5A46D] mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                    {t.techLabel}
                  </h3>
                  <p className="text-sm text-[#687386] leading-relaxed">
                    {project.technologies[lang]}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C5A46D] mb-1.5">
                    {t.statusLabel}
                  </h3>
                  <p className="text-sm font-medium text-[#101C35]">{project.status[lang]}</p>
                </div>
              </div>
            </div>
          )}

          {/* Project Link Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            {resolvedLink ? (
              <a
                href={resolvedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#101C35] text-white hover:bg-[#1A2B4D] rounded-md transition-colors"
              >
                <span>{t.visitLink}</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            ) : (
              <p className="text-xs text-[#687386]">{t.linkPending}</p>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#101C35] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
