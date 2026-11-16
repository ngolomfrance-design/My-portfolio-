import { ArrowUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AdminModal } from './components/AdminModal';
import { AgencySection } from './components/AgencySection';
import { ArticleModal } from './components/ArticleModal';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { ExpertiseSection } from './components/ExpertiseSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { JourneySection } from './components/JourneySection';
import { Navbar } from './components/Navbar';
import { ProjectModal } from './components/ProjectModal';
import { ProjectsSection } from './components/ProjectsSection';
import { QrCodeModal } from './components/QrCodeModal';
import type {
  ArticleItem,
  Language,
  PortfolioPayload,
  ProjectItem,
} from './types/portfolio';

const INITIAL_FALLBACK: PortfolioPayload = {
  experiences: [],
  projects: [],
  articles: [],
  config: {
    linkedinUrl: '',
    githubUrl: '',
    agencyWebsiteUrl: '',
    hackathonName: '',
    hackathonProblem: '',
    hackathonTech: '',
    hackathonOutcome: '',
    hackathonLink: '',
  },
};

export default function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [portfolio, setPortfolio] = useState<PortfolioPayload>(INITIAL_FALLBACK);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const loadPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = (await res.json()) as PortfolioPayload;
        setPortfolio(data);
      }
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
    }
  }, []);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === 'fr'
        ? 'Sophie Francette Ngolom — Développeuse Web & Mobile, Cheffe de Projets Digitaux'
        : 'Sophie Francette Ngolom — Web & Mobile Developer, Digital Project Manager';
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 520);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const agencyProject = portfolio.projects.find((p) => p.id === 'proj-data-work-agency');

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#101C35]">
      <Navbar lang={lang} onChangeLang={setLang} />

      <main className="flex-1">
        <HeroSection lang={lang} onChangeLang={setLang} />
        <AboutSection lang={lang} />
        <ExpertiseSection lang={lang} />
        <JourneySection lang={lang} experiences={portfolio.experiences} />
        <ProjectsSection
          lang={lang}
          projects={portfolio.projects}
          onSelectProject={setSelectedProject}
        />
        <AgencySection
          lang={lang}
          config={portfolio.config}
          agencyProject={agencyProject}
          onSelectProject={setSelectedProject}
        />
        <BlogSection
          lang={lang}
          articles={portfolio.articles}
          onSelectArticle={setSelectedArticle}
          onOpenAdmin={() => setAdminOpen(true)}
        />
        <ContactSection
          lang={lang}
          config={portfolio.config}
          onOpenAdmin={() => setAdminOpen(true)}
          onOpenQrCode={() => setQrOpen(true)}
        />
      </main>

      <Footer
        lang={lang}
        onChangeLang={setLang}
        config={portfolio.config}
        onOpenQrCode={() => setQrOpen(true)}
      />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        lang={lang}
        config={portfolio.config}
        onClose={() => setSelectedProject(null)}
      />
      <ArticleModal
        article={selectedArticle}
        lang={lang}
        onClose={() => setSelectedArticle(null)}
      />
      <AdminModal
        open={adminOpen}
        lang={lang}
        onClose={() => setAdminOpen(false)}
        onRefreshPortfolio={loadPortfolio}
      />
      <QrCodeModal
        open={qrOpen}
        lang={lang}
        onClose={() => setQrOpen(false)}
      />

      {/* Back to top button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={lang === 'fr' ? 'Retour en haut' : 'Back to top'}
          className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full bg-[#101C35] hover:bg-[#C5A46D] text-[#C5A46D] hover:text-[#101C35] border border-[#C5A46D]/40 shadow-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
