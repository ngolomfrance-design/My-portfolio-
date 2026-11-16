import { Lock, Plus, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type {
  ArticleItem,
  ContactMessage,
  ExperienceItem,
  Language,
  ProjectItem,
  SiteConfig,
} from '../types/portfolio';

interface AdminModalProps {
  open: boolean;
  lang: Language;
  onClose: () => void;
  onRefreshPortfolio: () => Promise<void>;
}

type AdminTab = 'articles' | 'experiences' | 'projects' | 'config' | 'messages';

export function AdminModal({ open, lang, onClose, onRefreshPortfolio }: AdminModalProps) {
  const [token, setToken] = useState<string>(() => sessionStorage.getItem('sfn_admin_token') || '');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('articles');
  const [statusMessage, setStatusMessage] = useState('');

  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [config, setConfig] = useState<SiteConfig>({
    linkedinUrl: '',
    githubUrl: '',
    agencyWebsiteUrl: '',
    hackathonName: '',
    hackathonProblem: '',
    hackathonTech: '',
    hackathonOutcome: '',
    hackathonLink: '',
  });

  // New / Edit Article form
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitleFr, setArtTitleFr] = useState('');
  const [artTitleEn, setArtTitleEn] = useState('');
  const [artCategoryFr, setArtCategoryFr] = useState('Technologie');
  const [artSummaryFr, setArtSummaryFr] = useState('');
  const [artContentFr, setArtContentFr] = useState('');

  // New Experience form
  const [expOrg, setExpOrg] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expSummary, setExpSummary] = useState('');

  // New Project form
  const [projName, setProjName] = useState('');
  const [projShort, setProjShort] = useState('');
  const [projProblem, setProjProblem] = useState('');
  const [projSolution, setProjSolution] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projStatus, setProjStatus] = useState('En cours de conception');
  const [projLink, setProjLink] = useState('');

  const loadAdminData = async (authToken: string) => {
    const res = await fetch('/api/admin/data', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.status === 401) {
      sessionStorage.removeItem('sfn_admin_token');
      setToken('');
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles || []);
      setExperiences(data.experiences || []);
      setProjects(data.projects || []);
      setMessages(data.messages || []);
      setConfig(data.config || config);
    }
  };

  useEffect(() => {
    if (open && token) {
      loadAdminData(token);
    }
  }, [open, token]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'Authentification refusée.');
      return;
    }
    sessionStorage.setItem('sfn_admin_token', data.token);
    setToken(data.token);
    setPassword('');
  };

  const handleSaveArticle = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: editingArticleId || undefined,
        title: { fr: artTitleFr, en: artTitleEn || artTitleFr },
        category: { fr: artCategoryFr, en: artCategoryFr },
        summary: { fr: artSummaryFr, en: artSummaryFr },
        content: { fr: artContentFr, en: artContentFr },
        published: true,
      }),
    });
    if (res.ok) {
      setEditingArticleId(null);
      setArtTitleFr('');
      setArtTitleEn('');
      setArtSummaryFr('');
      setArtContentFr('');
      setStatusMessage(lang === 'fr' ? 'Article enregistré.' : 'Article saved.');
      await loadAdminData(token);
      await onRefreshPortfolio();
    }
  };

  const handleDeleteArticle = async (id: string) => {
    await fetch(`/api/admin/articles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadAdminData(token);
    await onRefreshPortfolio();
  };

  const handleAddExperience = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        organization: { fr: expOrg, en: expOrg },
        role: { fr: expRole, en: expRole },
        period: { fr: expPeriod, en: expPeriod },
        summary: { fr: expSummary, en: expSummary },
      }),
    });
    if (res.ok) {
      setExpOrg('');
      setExpRole('');
      setExpPeriod('');
      setExpSummary('');
      setStatusMessage(lang === 'fr' ? 'Expérience ajoutée.' : 'Experience added.');
      await loadAdminData(token);
      await onRefreshPortfolio();
    }
  };

  const handleDeleteExperience = async (id: string) => {
    await fetch(`/api/admin/experiences/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadAdminData(token);
    await onRefreshPortfolio();
  };

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: { fr: projName, en: projName },
        shortDescription: { fr: projShort, en: projShort },
        problem: { fr: projProblem, en: projProblem },
        solution: { fr: projSolution, en: projSolution },
        technologies: { fr: projTech, en: projTech },
        status: { fr: projStatus, en: projStatus },
        link: projLink,
      }),
    });
    if (res.ok) {
      setProjName('');
      setProjShort('');
      setProjProblem('');
      setProjSolution('');
      setProjTech('');
      setProjLink('');
      setStatusMessage(lang === 'fr' ? 'Projet enregistré.' : 'Project saved.');
      await loadAdminData(token);
      await onRefreshPortfolio();
    }
  };

  const handleDeleteProject = async (id: string) => {
    await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await loadAdminData(token);
    await onRefreshPortfolio();
  };

  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      setStatusMessage(lang === 'fr' ? 'Configuration mise à jour.' : 'Configuration updated.');
      await loadAdminData(token);
      await onRefreshPortfolio();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1426]/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#101C35] text-white">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
            <h2 id="admin-modal-title" className="font-serif text-lg font-semibold">
              {lang === 'fr' ? 'Administration du Portfolio' : 'Portfolio Admin Workspace'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {!token ? (
            <form onSubmit={handleLogin} className="max-w-sm mx-auto py-8 space-y-4">
              <p className="text-sm text-[#687386]">
                {lang === 'fr'
                  ? 'Connectez-vous pour publier des articles, ajouter des expériences ou configurer vos liens professionnels.'
                  : 'Sign in to publish articles, add experiences, or configure your external links.'}
              </p>
              <div>
                <label className="block text-xs font-semibold text-[#101C35] mb-1.5">
                  {lang === 'fr' ? 'Mot de passe administrateur' : 'Admin password'}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-[#C5A46D]"
                />
                <p className="text-[11px] text-[#687386] mt-1.5">
                  {lang === 'fr'
                    ? 'Configurable via ADMIN_PASSWORD dans .env (par défaut : SOPHIE-DWA-2026).'
                    : 'Configurable via ADMIN_PASSWORD in .env (default: SOPHIE-DWA-2026).'}
                </p>
              </div>
              {authError && <p className="text-xs text-red-600 font-medium">{authError}</p>}
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold bg-[#101C35] text-white rounded-md hover:bg-[#1A2B4D] cursor-pointer"
              >
                {lang === 'fr' ? 'Se connecter' : 'Sign In'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex flex-wrap gap-1 bg-[#F4F5F7] p-1 rounded-lg">
                  {(
                    [
                      ['articles', lang === 'fr' ? 'Articles' : 'Articles'],
                      ['experiences', lang === 'fr' ? 'Expériences' : 'Experiences'],
                      ['projects', lang === 'fr' ? 'Projets' : 'Projects'],
                      ['config', lang === 'fr' ? 'Liens & Hackathon' : 'Links & Hackathon'],
                      ['messages', `Messages (${messages.length})`],
                    ] as [AdminTab, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setActiveTab(key);
                        setStatusMessage('');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                        activeTab === key
                          ? 'bg-[#101C35] text-white'
                          : 'text-[#687386] hover:text-[#101C35]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {statusMessage && (
                  <span className="text-xs font-semibold text-[#C5A46D]">{statusMessage}</span>
                )}
              </div>

              {activeTab === 'articles' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveArticle} className="bg-[#F4F5F7] p-5 rounded-lg space-y-4">
                    <h3 className="font-serif text-base font-semibold text-[#101C35]">
                      {editingArticleId ? 'Modifier l’article' : 'Publier un nouvel article'}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Titre (FR)"
                        value={artTitleFr}
                        onChange={(e) => setArtTitleFr(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="Title (EN - optionnel)"
                        value={artTitleEn}
                        onChange={(e) => setArtTitleEn(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Catégorie (ex: Hackathon 2026, Technologie, Entrepreneuriat)"
                      value={artCategoryFr}
                      onChange={(e) => setArtCategoryFr(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Résumé court"
                      value={artSummaryFr}
                      onChange={(e) => setArtSummaryFr(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                    />
                    <textarea
                      rows={4}
                      required
                      placeholder="Contenu complet de l'article..."
                      value={artContentFr}
                      onChange={(e) => setArtContentFr(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#101C35] text-white rounded-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C5A46D]" />
                      <span>{editingArticleId ? 'Mettre à jour' : 'Publier l’article'}</span>
                    </button>
                  </form>

                  <div className="divide-y divide-slate-200">
                    {articles.map((art) => (
                      <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#101C35]">{art.title.fr}</p>
                          <p className="text-xs text-[#687386]">
                            {art.category.fr} · {art.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingArticleId(art.id);
                              setArtTitleFr(art.title.fr);
                              setArtTitleEn(art.title.en);
                              setArtCategoryFr(art.category.fr);
                              setArtSummaryFr(art.summary.fr);
                              setArtContentFr(art.content.fr);
                            }}
                            className="text-xs font-medium text-[#101C35] hover:text-[#C5A46D] px-2 py-1 cursor-pointer"
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteArticle(art.id)}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded cursor-pointer"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'experiences' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddExperience} className="bg-[#F4F5F7] p-5 rounded-lg space-y-4">
                    <h3 className="font-serif text-base font-semibold text-[#101C35]">
                      Ajouter une nouvelle expérience
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Organisation / Entreprise"
                        value={expOrg}
                        onChange={(e) => setExpOrg(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Poste occupé"
                        value={expRole}
                        onChange={(e) => setExpRole(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Période (ex: 2026)"
                        value={expPeriod}
                        onChange={(e) => setExpPeriod(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Description synthétique..."
                      value={expSummary}
                      onChange={(e) => setExpSummary(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#101C35] text-white rounded-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C5A46D]" />
                      <span>Ajouter à la timeline</span>
                    </button>
                  </form>

                  <div className="divide-y divide-slate-200">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#101C35]">
                            {exp.organization.fr} — {exp.role.fr}
                          </p>
                          <p className="text-xs text-[#687386]">{exp.period.fr}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded cursor-pointer"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddProject} className="bg-[#F4F5F7] p-5 rounded-lg space-y-4">
                    <h3 className="font-serif text-base font-semibold text-[#101C35]">
                      Intégrer un nouveau projet
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Nom du projet"
                        value={projName}
                        onChange={(e) => setProjName(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="État d'avancement"
                        value={projStatus}
                        onChange={(e) => setProjStatus(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Description courte"
                      value={projShort}
                      onChange={(e) => setProjShort(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Problématique"
                        value={projProblem}
                        onChange={(e) => setProjProblem(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                      <input
                        type="text"
                        placeholder="Solution proposée"
                        value={projSolution}
                        onChange={(e) => setProjSolution(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Technologies utilisées"
                        value={projTech}
                        onChange={(e) => setProjTech(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                      <input
                        type="url"
                        placeholder="Lien vers le projet (optionnel)"
                        value={projLink}
                        onChange={(e) => setProjLink(e.target.value)}
                        className="px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-md"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#101C35] text-white rounded-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C5A46D]" />
                      <span>Ajouter le projet</span>
                    </button>
                  </form>

                  <div className="divide-y divide-slate-200">
                    {projects.map((p) => (
                      <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[#101C35]">{p.name.fr}</p>
                          <p className="text-xs text-[#687386]">{p.status.fr}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(p.id)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded cursor-pointer"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#101C35] mb-1">
                        URL LinkedIn
                      </label>
                      <input
                        type="url"
                        value={config.linkedinUrl}
                        onChange={(e) => setConfig({ ...config, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#101C35] mb-1">
                        URL GitHub
                      </label>
                      <input
                        type="url"
                        value={config.githubUrl}
                        onChange={(e) => setConfig({ ...config, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#101C35] mb-1">
                        Site officiel DATA WORK AGENCY
                      </label>
                      <input
                        type="url"
                        value={config.agencyWebsiteUrl}
                        onChange={(e) => setConfig({ ...config, agencyWebsiteUrl: e.target.value })}
                        placeholder="https://dataworkagency.com"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <h3 className="font-serif text-base font-semibold text-[#101C35]">
                      Détails configurables — Hackathon 2026
                    </h3>
                    <input
                      type="text"
                      value={config.hackathonName}
                      onChange={(e) => setConfig({ ...config, hackathonName: e.target.value })}
                      placeholder="Nom officiel du hackathon (optionnel)"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={config.hackathonProblem}
                      onChange={(e) => setConfig({ ...config, hackathonProblem: e.target.value })}
                      placeholder="Problématique abordée"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={config.hackathonTech}
                        onChange={(e) => setConfig({ ...config, hackathonTech: e.target.value })}
                        placeholder="Technologies utilisées"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                      />
                      <input
                        type="text"
                        value={config.hackathonOutcome}
                        onChange={(e) => setConfig({ ...config, hackathonOutcome: e.target.value })}
                        placeholder="Résultat ou état d'avancement"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                      />
                    </div>
                    <input
                      type="url"
                      value={config.hackathonLink}
                      onChange={(e) => setConfig({ ...config, hackathonLink: e.target.value })}
                      placeholder="Lien vers le projet Hackathon (optionnel)"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#101C35] text-white rounded-md cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-[#C5A46D]" />
                    <span>Enregistrer la configuration</span>
                  </button>
                </form>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-sm text-[#687386] py-6 text-center">
                      Aucun message reçu pour le moment.
                    </p>
                  ) : (
                    messages.map((m) => (
                      <div key={m.id} className="p-4 bg-[#F4F5F7] rounded-lg space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-[#687386]">
                          <span className="font-semibold text-[#101C35]">
                            {m.fullName} · {m.email}
                          </span>
                          <span>{new Date(m.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-semibold text-[#101C35]">{m.subject}</p>
                        <p className="text-sm text-[#1E293B] whitespace-pre-line">{m.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
