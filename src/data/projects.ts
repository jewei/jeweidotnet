import type { ImageMetadata } from 'astro';

import bopopImage from '../assets/projects/bopop.webp';
import claudeMeterImage from '../assets/content/claude-meter-v2.jpg';
import fullPageImage from '../assets/content/full-page-cover.webp';
import typeIdImage from '../assets/projects/typeid-php.webp';
import uppaImage from '../assets/projects/uppa.webp';

export interface ProjectLink {
  href: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  image: ImageMetadata;
  imageAlt: string;
  stack: readonly string[];
  status: string;
  articleHref: string;
  links: readonly ProjectLink[];
  schemaType: 'SoftwareApplication' | 'SoftwareSourceCode';
  programmingLanguage: readonly string[];
  operatingSystem?: string;
}

export const projects = [
  {
    id: 'claude-meter',
    name: 'Claude Meter',
    category: 'macOS utility',
    description:
      'A local-first menu bar app that shows how much Claude usage remains across each account.',
    image: claudeMeterImage,
    imageAlt:
      'Claude Meter menu bar app showing separate energy levels for personal, team, and family accounts.',
    stack: ['Swift', 'macOS', 'Claude Code'],
    status: 'Free and open source',
    articleHref: '/claude-meter-v2/',
    links: [
      { href: 'https://github.com/jewei/claude-meter', label: 'Source' },
      { href: 'https://github.com/jewei/claude-meter/releases/latest', label: 'Download' },
    ],
    schemaType: 'SoftwareApplication',
    programmingLanguage: ['Swift'],
    operatingSystem: 'macOS 14 or later',
  },
  {
    id: 'bopop',
    name: 'Bopop',
    category: 'macOS launcher',
    description:
      'A keyboard-first launcher for apps, files, clipboard history, calculations, and small answers.',
    image: bopopImage,
    imageAlt:
      'Bopop cover with the launcher showing Finder, Safari, and Ghostty.',
    stack: ['Swift', 'AppKit', 'macOS'],
    status: 'Open source · MIT',
    articleHref: '/bopop-press-type-go/',
    links: [
      { href: 'https://github.com/jewei/bopop', label: 'Source' },
      { href: 'https://github.com/jewei/bopop/releases', label: 'Releases' },
    ],
    schemaType: 'SoftwareApplication',
    programmingLanguage: ['Swift'],
    operatingSystem: 'macOS 15 or later on Apple silicon',
  },
  {
    id: 'uppa',
    name: 'Uppa',
    category: 'Edge infrastructure',
    description:
      'A self-hosted uptime monitor and public status page that runs on Cloudflare Workers.',
    image: uppaImage,
    imageAlt:
      'Uppa cover with a green uptime chart, monitor results, and recent incidents.',
    stack: ['Cloudflare Workers', 'D1', 'Bun CLI'],
    status: 'Open source · Self-hosted',
    articleHref: '/uppa/',
    links: [
      { href: 'https://github.com/jewei/uppa', label: 'Source' },
      { href: 'https://edge-uptime.jewei-mak.workers.dev/', label: 'Live demo' },
    ],
    schemaType: 'SoftwareSourceCode',
    programmingLanguage: ['TypeScript'],
  },
  {
    id: 'typeid-php',
    name: 'TypeID PHP',
    category: 'PHP library',
    description:
      'Type-safe, sortable identifiers for PHP applications, with readable prefixes built on UUIDv7.',
    image: typeIdImage,
    imageAlt:
      'TypeID for PHP cover with UserId and OrderId classes and identifier generation code.',
    stack: ['PHP 8.4+', 'Composer', 'UUIDv7'],
    status: 'Open source',
    articleHref: '/introducing-typeid-php/',
    links: [{ href: 'https://github.com/jewei/typeid-php', label: 'Source' }],
    schemaType: 'SoftwareSourceCode',
    programmingLanguage: ['PHP'],
  },
  {
    id: 'full-page-browser-screenshot',
    name: 'Full Page',
    category: 'Browser extension',
    description:
      'A Brave extension that captures a complete web page as one PNG, with a local preview and no image uploads.',
    image: fullPageImage,
    imageAlt:
      'Full Page cover with a screenshot preview of a complete sample page and a Download PNG button.',
    stack: ['JavaScript', 'Manifest V3', 'Brave'],
    status: 'Source available',
    articleHref: '/full-page-browser-screenshot/',
    links: [
      { href: 'https://github.com/jewei/browser-screenshot', label: 'Source' },
      { href: 'https://github.com/jewei/browser-screenshot#install-locally-for-development', label: 'Install locally' },
    ],
    schemaType: 'SoftwareApplication',
    programmingLanguage: ['JavaScript'],
    operatingSystem: 'macOS, Windows, Linux with Brave',
  },
] as const satisfies readonly Project[];
