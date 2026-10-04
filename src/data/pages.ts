/**
 * Titles and descriptions for the fixed pages. Pages, social cards
 * (/og/<key>.png), and llms.txt all read from here, so each page's
 * metadata exists in one place.
 *
 * Rules (enforced by tests/content): description 70–160 characters,
 * title under 60 characters.
 */
export const pages = {
  home: {
    path: '/',
    title: 'Jewei Mak',
    eyebrow: 'Software engineer',
    description:
      'Jewei Mak is a senior software engineer. He builds backend systems, payment infrastructure, and developer tools, and writes about software architecture and AI.',
    card: 'I build reliable software and useful tools, and write about what I learn.',
  },
  blog: {
    path: '/blog/',
    title: 'Writing',
    eyebrow: 'Writing',
    description:
      'Technical writing by Jewei Mak on backend architecture, PHP and Laravel, developer tools, infrastructure, and AI-assisted engineering.',
    card: 'Field notes on backend architecture, developer tools, infrastructure, and learning in public.',
  },
  projects: {
    path: '/projects/',
    title: 'Projects',
    eyebrow: 'Projects',
    description:
      'Software by Jewei Mak: native macOS tools, a browser extension, edge infrastructure on Cloudflare Workers, and open-source PHP libraries.',
    card: 'Native tools, browser extensions, edge infrastructure, and PHP libraries.',
  },
  about: {
    path: '/about/',
    title: 'About',
    eyebrow: 'About',
    description:
      'Jewei Mak is a senior software engineer with 15+ years in backend systems, and a builder, writer, reader, photographer, and occasional kitchen experimenter.',
    card: 'I build durable software, useful tools, and clear notes for people who care how systems work.',
  },
  resume: {
    path: '/resume/',
    title: 'Résumé',
    eyebrow: 'Résumé',
    description:
      'Résumé of Jewei Mak, senior software engineer: 15+ years in Laravel and PHP, backend architecture, APIs, payment integrations, and production systems.',
    card: 'Senior backend engineer. Laravel specialist. Scale-tested.',
  },
  collections: {
    path: '/collections/',
    title: 'Collections',
    eyebrow: 'Collections',
    description:
      'A small, growing index of notes, recurring ideas, books, and everyday inputs kept by software engineer Jewei Mak.',
    card: 'Lines and subjects worth keeping in public view.',
  },
  contact: {
    path: '/contact/',
    title: 'Contact',
    eyebrow: 'Contact',
    description:
      'How to contact Jewei Mak about software work, technical writing, and open-source projects, and what to include in a first message.',
    card: 'Email is the best way to reach me. I read every message myself.',
  },
  privacy: {
    path: '/privacy/',
    title: 'Privacy',
    eyebrow: 'Privacy',
    description:
      'What data jewei.net processes, why it is processed, which services are involved, and how to ask Jewei Mak a privacy question.',
    card: 'No accounts, no cookies, no ads. What this site processes, and why.',
  },
} as const;

export type PageKey = keyof typeof pages;

export const ogPath = (key: string) => `/og/${key}.png`;
