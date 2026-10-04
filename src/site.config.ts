/**
 * Site identity, navigation, and external services.
 *
 * This is the only place for names, URLs, handles, and nav items.
 * Pages and components import from here; do not hard-code these values.
 */
export const site = {
  url: 'https://jewei.net',
  name: 'jewei.toString()',
  /** Used as the title suffix and in structured data. */
  author: 'Jewei Mak',
  jobTitle: 'Senior Software Engineer',
  email: 'jewei@duck.com',
  locale: 'en_US',
  language: 'en',
  timeZone: 'Asia/Kuala_Lumpur',
  /** Default meta description. Keep it between 120 and 160 characters. */
  description:
    'Jewei Mak is a senior software engineer. He builds backend systems, payment infrastructure, and developer tools, and writes about software architecture and AI.',
  /** Home page <title>. Other pages use `${title} · ${author}`. */
  homeTitle: 'Jewei Mak — Senior Software Engineer and Backend Architect',
  firstYear: 2022,
  twitter: '@jewei',
  profiles: {
    github: 'https://github.com/jewei',
    x: 'https://x.com/jewei',
    sponsor: 'https://github.com/sponsors/jewei',
  },
  knowsAbout: [
    'Backend architecture',
    'Laravel',
    'PHP',
    'API design',
    'Payment infrastructure',
    'Distributed systems',
    'Cloudflare',
    'Amazon Web Services',
    'AI-assisted software engineering',
  ],
  analytics: {
    umamiSrc: 'https://cloud.umami.is/script.js',
    umamiId: '5262f0b3-3bd0-4b9f-8d21-aa555515a81d',
  },
} as const;

export const personId = `${site.url}/#person`;
export const websiteId = `${site.url}/#website`;

/** Primary navigation, in display order. `match` marks the active item. */
export const primaryNav = [
  { href: '/blog/', label: 'Writing', match: ['/blog/'] },
  { href: '/projects/', label: 'Projects', match: ['/projects/'] },
  { href: '/about/', label: 'About', match: ['/about/', '/collections/'] },
  { href: '/resume/', label: 'Résumé', match: ['/resume/'] },
] as const;

/** Footer link groups. */
export const footerNav = [
  {
    title: 'Site',
    links: [
      { href: '/blog/', label: 'Writing' },
      { href: '/projects/', label: 'Projects' },
      { href: '/collections/', label: 'Collections' },
      { href: '/about/', label: 'About' },
      { href: '/resume/', label: 'Résumé' },
    ],
  },
  {
    title: 'Elsewhere',
    links: [
      { href: site.profiles.github, label: 'GitHub' },
      { href: site.profiles.x, label: 'X' },
      { href: site.profiles.sponsor, label: 'Sponsor' },
      { href: `mailto:${site.email}`, label: 'Email' },
    ],
  },
  {
    title: 'Feeds',
    links: [
      { href: '/rss.xml', label: 'RSS' },
      { href: '/llms.txt', label: 'llms.txt' },
      { href: '/sitemap-index.xml', label: 'Sitemap' },
      { href: '/contact/', label: 'Contact' },
      { href: '/privacy/', label: 'Privacy' },
    ],
  },
] as const;
