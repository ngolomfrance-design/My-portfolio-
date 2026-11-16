import { ArrowRight, PenSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { STATIC_CONTENT } from '../data/translations';
import type { ArticleItem, Language } from '../types/portfolio';
import { SafeImage } from './SafeImage';

interface BlogSectionProps {
  lang: Language;
  articles: ArticleItem[];
  onSelectArticle: (article: ArticleItem) => void;
  onOpenAdmin: () => void;
}

export function BlogSection({
  lang,
  articles,
  onSelectArticle,
  onOpenAdmin,
}: BlogSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const t = STATIC_CONTENT[lang].blog;

  const categories = useMemo(() => {
    const unique = new Set<string>();
    articles.forEach((a) => unique.add(a.category[lang]));
    return Array.from(unique);
  }, [articles, lang]);

  const visibleArticles = useMemo(() => {
    if (selectedCategory === 'all') return articles;
    return articles.filter((a) => a.category[lang] === selectedCategory);
  }, [articles, selectedCategory, lang]);

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <section id="actualites" className="bg-white py-20 sm:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
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

          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#101C35] border border-slate-300 hover:border-[#C5A46D] hover:text-[#C5A46D] rounded-md transition-colors cursor-pointer self-start md:self-auto whitespace-nowrap shrink-0"
          >
            <PenSquare className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.adminButton}</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#F4F5F7] rounded-lg mb-10 w-fit max-w-full">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#101C35] text-white'
                : 'text-[#687386] hover:text-[#101C35]'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#101C35] text-white'
                  : 'text-[#687386] hover:text-[#101C35]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleArticles.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col sm:flex-row transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C5A46D]/60"
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto bg-[#101C35] overflow-hidden shrink-0">
                <SafeImage
                  src={article.image}
                  alt={article.title[lang]}
                  fallbackLabel={article.category[lang]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#687386] mb-2.5">
                    <span className="font-semibold text-[#C5A46D]">
                      {article.category[lang]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-[#101C35] mb-2.5 group-hover:text-[#C5A46D] transition-colors leading-snug">
                    {article.title[lang]}
                  </h3>

                  <p className="text-sm text-[#687386] leading-relaxed line-clamp-3 mb-4">
                    {article.summary[lang]}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#101C35] group-hover:text-[#C5A46D] transition-colors">
                  <span>{t.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
