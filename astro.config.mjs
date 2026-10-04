// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rehypeHeadingIds, unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';
import { parse } from 'yaml';
import {
  codeFilename,
  rehypeCodeBlocks,
  rehypeFigures,
  rehypeHeadingAnchors,
  rehypeImageSizes,
  rehypeTables,
} from './src/lib/markdown.ts';

const SITE = 'https://jewei.net';

/**
 * Sitemap `lastmod` per post URL. The sitemap hook runs outside Astro's
 * content layer, so this reads post frontmatter directly. Drafts are skipped.
 */
function postLastModified() {
  /** @type {Record<string, string>} */
  const dates = {};
  const dir = path.resolve('src/content/blog');
  for (const file of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const frontmatter = fs
      .readFileSync(path.join(dir, file), 'utf8')
      .match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    const data = frontmatter ? parse(frontmatter) : null;
    if (!data || data.draft === true) continue;
    const date = new Date(data.updatedDate ?? data.pubDate);
    if (!Number.isNaN(date.getTime())) dates[`${SITE}/${file.replace(/\.mdx?$/, '')}/`] = date.toISOString();
  }
  const latest = Object.values(dates).sort().at(-1);
  if (latest) for (const page of ['/', '/blog/']) dates[`${SITE}${page}`] = latest;
  return dates;
}

const lastModified = postLastModified();

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'always',
  // Compression drops newline whitespace next to tags ("also<a>"). Brotli
  // at the edge makes the saving negligible, so keep the source spacing.
  compressHTML: false,
  // Inline CSS: it is small, and inlining removes a render-blocking request.
  build: { format: 'directory', inlineStylesheets: 'always' },
  image: { layout: 'constrained', responsiveStyles: true },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-high-contrast', dark: 'github-dark-high-contrast' },
      defaultColor: false,
      transformers: [codeFilename],
      wrap: false,
    },
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        rehypeHeadingAnchors,
        rehypeFigures,
        rehypeImageSizes,
        [rehypeExternalLinks, { target: false, rel: ['noopener'], properties: { dataExternal: '' } }],
        rehypeTables,
        rehypeCodeBlocks,
      ],
    }),
  },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      serialize(item) {
        const lastmod = lastModified[item.url];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: ['400 600'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
    {
      provider: fontProviders.google(),
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['ui-serif', 'Georgia', 'serif'],
    },
  ],
});
