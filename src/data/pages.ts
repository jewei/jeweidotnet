/**
 * Titles and descriptions for the fixed pages. Pages, social cards
 * (/og/<key>.png), and llms.txt all read from here, so each page's
 * metadata exists in one place.
 *
 * Rules (enforced by tests/content): description 70–160 characters,
 * title under 60 characters.
 */
import { site } from '../site.config';

export const pages = {
  home: {
    path: '/',
    title: site.author,
    eyebrow: 'Software engineer',
    // The home page describes the site, so it uses the site description.
    description: site.description,
    card: 'Tastefully opinionated. I design and build software, from the systems behind it to the experience around it.',
  },
  blog: {
    path: '/blog/',
    title: 'Writing',
    eyebrow: 'Writing',
    description:
      'Technical writing by Jewei Mak on backend architecture, PHP and Laravel, developer tools, infrastructure, and AI-assisted engineering.',
    card: 'Notes on backend architecture, developer tools, infrastructure, and working with AI.',
  },
  projects: {
    path: '/projects/',
    title: 'Projects',
    eyebrow: 'Projects',
    description:
      'Software by Jewei Mak: native macOS tools, a browser extension, edge infrastructure on Cloudflare Workers, and open-source PHP libraries.',
    card: 'Small tools for problems in my own work: macOS apps, a browser extension, edge infrastructure, and PHP libraries.',
  },
  about: {
    path: '/about/',
    title: 'About',
    eyebrow: 'About',
    description:
      'About Jewei Mak, a senior software engineer: fifteen years of backend systems and payments, a few open-source tools, and notes on the work.',
    card: 'Fifteen years of backend systems, a few small tools, and notes on the work.',
  },
  resume: {
    path: '/resume/',
    title: 'Résumé',
    eyebrow: 'Résumé',
    description:
      'Résumé of Jewei Mak, senior software engineer: 15+ years in Laravel and PHP, backend architecture, APIs, payment integrations, and production systems.',
    card: 'Backend systems, APIs, and payments. Fifteen years of PHP and Laravel in production.',
  },
  collections: {
    path: '/collections/',
    title: 'Collections',
    eyebrow: 'Collections',
    description:
      'A small, growing index of notes, recurring ideas, books, and everyday inputs kept by software engineer Jewei Mak.',
    card: 'Principles I work by, and subjects I keep coming back to.',
  },
  contact: {
    path: '/contact/',
    title: 'Contact',
    eyebrow: 'Contact',
    description:
      'How to contact Jewei Mak about software work, technical writing, and open-source projects, and what to include in a first message.',
    card: 'Work enquiries, technical questions, and corrections.',
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
