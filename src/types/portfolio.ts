export type Language = 'fr' | 'en';

export interface BilingualText {
  fr: string;
  en: string;
}

export interface BilingualList {
  fr: string[];
  en: string[];
}

export interface ExperienceItem {
  id: string;
  index: string;
  organization: BilingualText;
  role: BilingualText;
  period: BilingualText;
  summary: BilingualText;
  order: number;
}

export interface ProjectItem {
  id: string;
  index: string;
  category: 'software' | 'entrepreneurship' | 'hackathon';
  name: BilingualText;
  shortDescription: BilingualText;
  description: BilingualText;
  problem: BilingualText;
  solution: BilingualText;
  technologies: BilingualText;
  status: BilingualText;
  image: string;
  link: string;
  features?: BilingualList;
  isHackathon?: boolean;
  year?: string;
  context?: BilingualText;
  contribution?: BilingualText;
  outcome?: BilingualText;
}

export interface ArticleItem {
  id: string;
  slug: string;
  category: BilingualText;
  date: string;
  image: string;
  title: BilingualText;
  summary: BilingualText;
  content: BilingualText;
  published: boolean;
}

export interface SiteConfig {
  linkedinUrl: string;
  githubUrl: string;
  agencyWebsiteUrl: string;
  hackathonName: string;
  hackathonProblem: string;
  hackathonTech: string;
  hackathonOutcome: string;
  hackathonLink: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface PortfolioPayload {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  articles: ArticleItem[];
  config: SiteConfig;
}
