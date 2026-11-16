import { X } from 'lucide-react';
import { useEffect } from 'react';
import { STATIC_CONTENT } from '../data/translations';
import type { ArticleItem, Language } from '../types/portfolio';
import { SafeImage } from './SafeImage';

interface ArticleModalProps {
  article: ArticleItem | null;
  lang: Language;
  onClose: () => void;
}

export function ArticleModal({ article, lang, onClose }: ArticleModalProps) {
  const t = STATIC_CONTENT[lang].blog;

  useEffect(() => {
    if (!article) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [article, onClose]);

  if (!article) return null;

  const formattedDate = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.date));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1426]/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-[#687386]">
            <span className="font-semibold text-[#C5A46D]">{article.category[lang]}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.date}>{formattedDate}</time>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.closeArticle}
            className="w-10 h-10 inline-flex items-center justify-center rounded-md text-[#101C35] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-[#101C35]">
            <SafeImage
              src={article.image}
              alt={article.title[lang]}
              fallbackLabel={article.title[lang]}
              className="w-full h-full object-cover"
            />
          </div>

          <h2
            id="article-modal-title"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#101C35] leading-snug"
          >
            {article.title[lang]}
          </h2>

          <p className="text-base font-medium text-[#687386] leading-relaxed border-b border-slate-200 pb-5">
            {article.summary[lang]}
          </p>

          <div className="space-y-4 text-[15px] text-[#1E293B] leading-[1.75] whitespace-pre-line">
            {article.content[lang]}
          </div>
        </div>
      </div>
    </div>
  );
}
