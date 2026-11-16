import crypto from 'crypto';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { buildCvPdf } from './server/cvGenerator.ts';
import {
  addContactMessage,
  addExperience,
  deleteArticle,
  deleteExperience,
  deleteProject,
  getAllAdminData,
  getPublicPortfolio,
  updateConfig,
  upsertArticle,
  upsertProject,
} from './server/dataStore.ts';
import type { ArticleItem, ExperienceItem, ProjectItem } from './src/types/portfolio.ts';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SOPHIE-DWA-2026';
const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

function signToken(payload: string): string {
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const issuedAt = Number(payload);
  if (Number.isNaN(issuedAt)) return false;
  return Date.now() - issuedAt < 1000 * 60 * 60 * 12;
}

function sanitizeText(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

const contactRateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const existing = contactRateMap.get(ip);
  if (!existing || existing.resetAt < now) {
    contactRateMap.set(ip, { count: 1, resetAt: now + 1000 * 60 * 15 });
    return true;
  }
  if (existing.count >= 8) {
    return false;
  }
  existing.count += 1;
  return true;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/portfolio', (_req, res) => {
    res.json(getPublicPortfolio());
  });

  app.get('/api/cv', async (req, res) => {
    try {
      const lang = req.query.lang === 'en' ? 'en' : 'fr';
      const pdfBuffer = await buildCvPdf(lang);
      const filename =
        lang === 'en'
          ? 'Sophie_Francette_Ngolom_Resume.pdf'
          : 'Sophie_Francette_Ngolom_CV.pdf';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('PDF CV generation error:', error);
      res.status(500).json({ error: 'Unable to generate PDF CV.' });
    }
  });

  app.post('/api/contact', (req, res) => {
    const ip = req.ip || 'unknown';
    if (!checkRateLimit(ip)) {
      res.status(429).json({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' });
      return;
    }

    const fullName = sanitizeText(req.body?.fullName, 120);
    const email = sanitizeText(req.body?.email, 160);
    const subject = sanitizeText(req.body?.subject, 180);
    const message = sanitizeText(req.body?.message, 3000);

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Veuillez renseigner votre nom complet.' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Adresse email invalide.' });
      return;
    }
    if (subject.length < 2) {
      res.status(400).json({ error: 'Veuillez préciser un objet.' });
      return;
    }
    if (message.length < 10) {
      res.status(400).json({ error: 'Votre message doit contenir au moins 10 caractères.' });
      return;
    }

    const saved = addContactMessage({ fullName, email, subject, message });
    res.status(201).json({
      success: true,
      id: saved.id,
      createdAt: saved.createdAt,
    });
  });

  app.post('/api/admin/login', (req, res) => {
    const password = sanitizeText(req.body?.password, 128);
    if (!password || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Mot de passe incorrect.' });
      return;
    }
    const token = signToken(String(Date.now()));
    res.json({ token });
  });

  const requireAdmin: express.RequestHandler = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    if (!verifyToken(token)) {
      res.status(401).json({ error: 'Session administrateur invalide ou expirée.' });
      return;
    }
    next();
  };

  app.get('/api/admin/data', requireAdmin, (_req, res) => {
    res.json(getAllAdminData());
  });

  app.post('/api/admin/articles', requireAdmin, (req, res) => {
    const body = req.body as Partial<ArticleItem>;
    if (!body?.title?.fr || !body?.summary?.fr || !body?.content?.fr) {
      res.status(400).json({ error: 'Titre, résumé et contenu requis.' });
      return;
    }
    const id = body.id || `art-${Date.now()}`;
    const slug =
      body.slug ||
      body.title.fr
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    const saved = upsertArticle({
      id,
      slug,
      date: body.date || new Date().toISOString().slice(0, 10),
      image: body.image || '/src/assets/images/blog_digital_systems_1794819706730.jpg',
      category: {
        fr: body.category?.fr || 'Technologie',
        en: body.category?.en || body.category?.fr || 'Technology',
      },
      title: {
        fr: body.title.fr,
        en: body.title.en || body.title.fr,
      },
      summary: {
        fr: body.summary.fr,
        en: body.summary.en || body.summary.fr,
      },
      content: {
        fr: body.content.fr,
        en: body.content.en || body.content.fr,
      },
      published: body.published ?? true,
    });
    res.json(saved);
  });

  app.delete('/api/admin/articles/:id', requireAdmin, (req, res) => {
    const deleted = deleteArticle(req.params.id);
    res.json({ deleted });
  });

  app.post('/api/admin/experiences', requireAdmin, (req, res) => {
    const body = req.body as Partial<ExperienceItem>;
    if (!body?.organization?.fr || !body?.role?.fr || !body?.period?.fr) {
      res.status(400).json({ error: 'Organisation, poste et période requis.' });
      return;
    }
    const store = getAllAdminData();
    const nextOrder = store.experiences.length + 1;
    const saved = addExperience({
      id: `exp-${Date.now()}`,
      index: String(nextOrder).padStart(2, '0'),
      order: nextOrder,
      organization: {
        fr: body.organization.fr,
        en: body.organization.en || body.organization.fr,
      },
      role: {
        fr: body.role.fr,
        en: body.role.en || body.role.fr,
      },
      period: {
        fr: body.period.fr,
        en: body.period.en || body.period.fr,
      },
      summary: {
        fr: body.summary?.fr || '',
        en: body.summary?.en || body.summary?.fr || '',
      },
    });
    res.json(saved);
  });

  app.delete('/api/admin/experiences/:id', requireAdmin, (req, res) => {
    res.json({ deleted: deleteExperience(req.params.id) });
  });

  app.post('/api/admin/projects', requireAdmin, (req, res) => {
    const body = req.body as Partial<ProjectItem>;
    if (!body?.name?.fr || !body?.shortDescription?.fr) {
      res.status(400).json({ error: 'Nom et description requis.' });
      return;
    }
    const store = getAllAdminData();
    const saved = upsertProject({
      id: body.id || `proj-${Date.now()}`,
      index: body.index || String(store.projects.length + 1).padStart(2, '0'),
      category: body.category || 'software',
      name: {
        fr: body.name.fr,
        en: body.name.en || body.name.fr,
      },
      shortDescription: {
        fr: body.shortDescription.fr,
        en: body.shortDescription.en || body.shortDescription.fr,
      },
      description: {
        fr: body.description?.fr || body.shortDescription.fr,
        en: body.description?.en || body.shortDescription.en || body.shortDescription.fr,
      },
      problem: {
        fr: body.problem?.fr || 'À préciser.',
        en: body.problem?.en || body.problem?.fr || 'To be specified.',
      },
      solution: {
        fr: body.solution?.fr || 'À préciser.',
        en: body.solution?.en || body.solution?.fr || 'To be specified.',
      },
      technologies: {
        fr: body.technologies?.fr || 'À renseigner.',
        en: body.technologies?.en || body.technologies?.fr || 'To be specified.',
      },
      status: {
        fr: body.status?.fr || 'En cours de conception',
        en: body.status?.en || body.status?.fr || 'In Development',
      },
      image: body.image || '/src/assets/images/blog_digital_systems_1794819706730.jpg',
      link: body.link || '',
      features: body.features,
    });
    res.json(saved);
  });

  app.delete('/api/admin/projects/:id', requireAdmin, (req, res) => {
    res.json({ deleted: deleteProject(req.params.id) });
  });

  app.put('/api/admin/config', requireAdmin, (req, res) => {
    const updated = updateConfig({
      linkedinUrl: sanitizeText(req.body?.linkedinUrl, 300),
      githubUrl: sanitizeText(req.body?.githubUrl, 300),
      agencyWebsiteUrl: sanitizeText(req.body?.agencyWebsiteUrl, 300),
      hackathonName: sanitizeText(req.body?.hackathonName, 200),
      hackathonProblem: sanitizeText(req.body?.hackathonProblem, 1000),
      hackathonTech: sanitizeText(req.body?.hackathonTech, 400),
      hackathonOutcome: sanitizeText(req.body?.hackathonOutcome, 400),
      hackathonLink: sanitizeText(req.body?.hackathonLink, 300),
    });
    res.json(updated);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
