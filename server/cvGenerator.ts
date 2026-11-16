import PDFDocument from 'pdfkit';
import type { Language } from '../src/types/portfolio.ts';
import { getPublicPortfolio } from './dataStore.ts';

const NAVY = '#101C35';
const GOLD = '#C5A46D';
const MUTED = '#687386';
const TEXT = '#1E293B';
const BORDER = '#E2E8F0';

export function buildCvPdf(lang: Language): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 48, bottom: 48, left: 50, right: 50 },
      info: {
        Title:
          lang === 'fr'
            ? 'CV — Sophie Francette Ngolom'
            : 'Resume — Sophie Francette Ngolom',
        Author: 'Sophie Francette Ngolom',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const portfolio = getPublicPortfolio();
    const isFr = lang === 'fr';
    const pageWidth = doc.page.width - 100;

    // Header Band
    doc.rect(0, 0, doc.page.width, 132).fill(NAVY);

    doc
      .fillColor(GOLD)
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .text('YAOUNDÉ, CAMEROUN  ·  DATA WORK AGENCY', 50, 34, {
        characterSpacing: 1.2,
      });

    doc
      .fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .fontSize(22)
      .text('SOPHIE FRANCETTE NGOLOM', 50, 52);

    doc
      .fillColor('#E2E8F0')
      .font('Helvetica')
      .fontSize(10.5)
      .text(
        isFr
          ? 'Développeuse Web & Mobile  |  Gestionnaire de projets digitaux  |  CEO & Fondatrice de DATA WORK AGENCY'
          : 'Web & Mobile Developer  |  Digital Project Manager  |  CEO & Founder of DATA WORK AGENCY',
        50,
        82,
        { width: pageWidth }
      );

    doc
      .fillColor(GOLD)
      .font('Helvetica')
      .fontSize(9)
      .text(
        'ngolomfrance@icloud.com   ·   +237 652 19 81 78   ·   DATA WORK AGENCY : dataworkagency0@gmail.com  |  +237 690 37 04 54',
        50,
        104,
        { width: pageWidth }
      );

    let y = 152;

    const sectionHeading = (title: string) => {
      if (y > 720) {
        doc.addPage();
        y = 48;
      }
      doc
        .fillColor(NAVY)
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(title.toUpperCase(), 50, y, { characterSpacing: 0.8 });
      y += 16;
      doc.moveTo(50, y).lineTo(50 + pageWidth, y).lineWidth(1).strokeColor(GOLD).stroke();
      y += 10;
    };

    // Profile
    sectionHeading(isFr ? 'Profil Professionnel' : 'Professional Profile');
    doc
      .fillColor(TEXT)
      .font('Helvetica')
      .fontSize(9.5)
      .lineGap(2)
      .text(
        isFr
          ? 'Passionnée par les technologies et l’innovation numérique, je conçois des solutions informatiques, développe des applications et pilote des projets digitaux. Fondatrice de DATA WORK AGENCY et participante au Hackathon 2026, j’associe technologie, créativité et vision stratégique au service des entreprises et organisations.'
          : 'Passionate about technology and digital innovation, I design software solutions, build applications, and lead digital projects. Founder of DATA WORK AGENCY and 2026 Hackathon participant, I combine technology, creativity, and strategic vision for businesses and organizations.',
        50,
        y,
        { width: pageWidth }
      );
    y = doc.y + 14;

    // Experiences
    sectionHeading(isFr ? 'Expériences Professionnelles' : 'Professional Experience');
    for (const exp of portfolio.experiences) {
      if (y > 720) {
        doc.addPage();
        y = 48;
      }
      doc
        .fillColor(NAVY)
        .font('Helvetica-Bold')
        .fontSize(10)
        .text(`${exp.organization[lang]} — ${exp.role[lang]}`, 50, y, {
          width: pageWidth - 135,
        });
      const titleBottom = doc.y;
      doc
        .fillColor(GOLD)
        .font('Helvetica-Bold')
        .fontSize(8.5)
        .text(exp.period[lang], 50 + pageWidth - 130, y + 1, {
          width: 130,
          align: 'right',
        });
      y = Math.max(titleBottom, doc.y) + 3;
      doc
        .fillColor(MUTED)
        .font('Helvetica')
        .fontSize(9)
        .text(exp.summary[lang], 50, y, { width: pageWidth });
      y = doc.y + 10;
    }

    // Education
    sectionHeading(isFr ? 'Formation Académique' : 'Academic Background');
    const education = isFr
      ? [
          ['2024 – 2026', 'Formation en Génie Informatique, option Gestion des Systèmes d’Information'],
          ['2025 – 2026', 'Formation en programmation informatique'],
          ['2020', 'Baccalauréat A4 Espagnol – Lycée de Mballa 2'],
          ['2019', 'Probatoire A4 Espagnol – Lycée de Mballa 2'],
          ['2017', 'BEPC – Lycée de Nylon'],
          ['2013', 'CEP – École Publique d’Application'],
        ]
      : [
          ['2024 – 2026', 'Computer Engineering Training, Information Systems Management Track'],
          ['2025 – 2026', 'Computer Programming Training'],
          ['2020', 'Baccalauréat A4 Spanish – Lycée de Mballa 2'],
          ['2019', 'Probatoire A4 Spanish – Lycée de Mballa 2'],
          ['2017', 'BEPC – Lycée de Nylon'],
          ['2013', 'CEP – École Publique d’Application'],
        ];

    for (const [years, label] of education) {
      if (y > 735) {
        doc.addPage();
        y = 48;
      }
      doc.fillColor(GOLD).font('Helvetica-Bold').fontSize(9).text(years, 50, y, { width: 80 });
      doc.fillColor(TEXT).font('Helvetica').fontSize(9.5).text(label, 132, y, { width: pageWidth - 82 });
      y = doc.y + 5;
    }
    y += 8;

    // Expertise
    sectionHeading(isFr ? 'Domaines d’Expertise' : 'Areas of Expertise');
    const expertises = isFr
      ? [
          'Développement Web & Applications',
          'Gestion de projets digitaux',
          'Gestion des systèmes d’information',
          'Transformation numérique',
          'Marketing digital & Communication',
          'Exploration & intégration de l’Intelligence Artificielle',
          'Administration informatique & Infrastructures',
          'Participation à des hackathons (Hackathon 2026)',
        ]
      : [
          'Web & Application Development',
          'Digital Project Management',
          'Information Systems Management',
          'Digital Transformation',
          'Digital Marketing & Communications',
          'Artificial Intelligence Exploration & Integration',
          'IT Administration & Technical Infrastructure',
          'Hackathon Participation (Hackathon 2026)',
        ];

    const colWidth = (pageWidth - 20) / 2;
    expertises.forEach((item, idx) => {
      const col = idx % 2;
      const rowY = y + Math.floor(idx / 2) * 15;
      doc
        .fillColor(TEXT)
        .font('Helvetica')
        .fontSize(9)
        .text(`•  ${item}`, 50 + col * (colWidth + 20), rowY, { width: colWidth });
    });
    y += Math.ceil(expertises.length / 2) * 15 + 10;

    // Projects
    sectionHeading(isFr ? 'Projets & Entrepreneuriat' : 'Projects & Entrepreneurship');
    for (const proj of portfolio.projects) {
      if (y > 720) {
        doc.addPage();
        y = 48;
      }
      doc
        .fillColor(NAVY)
        .font('Helvetica-Bold')
        .fontSize(9.5)
        .text(`${proj.name[lang]}  ·  ${proj.status[lang]}`, 50, y);
      y = doc.y + 2;
      doc
        .fillColor(MUTED)
        .font('Helvetica')
        .fontSize(9)
        .text(proj.shortDescription[lang], 50, y, { width: pageWidth });
      y = doc.y + 8;
    }

    // Footer rule
    doc
      .moveTo(50, doc.page.height - 42)
      .lineTo(50 + pageWidth, doc.page.height - 42)
      .lineWidth(0.5)
      .strokeColor(BORDER)
      .stroke();
    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(8)
      .text(
        'Sophie Francette Ngolom · DATA WORK AGENCY · Yaoundé, Cameroun',
        50,
        doc.page.height - 34,
        { align: 'center', width: pageWidth }
      );

    doc.end();
  });
}
