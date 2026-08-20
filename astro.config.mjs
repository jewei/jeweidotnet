// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { parse } from 'yaml';
import rehypeExternalLinks from 'rehype-external-links';

/**
 * Build a map of `/{slug}/` → ISO `lastmod` for the sitemap.
 *
 * The sitemap integration's `serialize` hook runs in the config context, where
 * `astro:content` (and therefore the blog collection) is unavailable. Reading
 * and parsing the frontmatter from disk here attaches accurate `lastmod`
 * dates without duplicating YAML parsing rules. Draft handling is kept in sync
 * with `getPublishedPosts()` in
 * `src/support/blog.ts` so the sitemap never lists an unpublished post.
 *
 * @returns {Record<string, string>}
 */
function loadSitemapDates() {
  /** @type {Record<string, string>} */
  const dates = {};
  const blogDir = path.join(process.cwd(), 'src/content/blog');

  if (!fs.existsSync(blogDir)) return dates;

  for (const file of fs.readdirSync(blogDir)) {
    if (!/\.mdx?$/.test(file)) continue;

    const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;

    const frontmatter = parse(match[1]);
    if (!frontmatter || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) continue;
    if (frontmatter.draft === true) continue;

    const updated = frontmatter.updatedDate;
    const published = frontmatter.pubDate;
    const lastmod = updated ?? published;
    if (typeof lastmod !== 'string' && !(lastmod instanceof Date)) continue;

    const date = new Date(lastmod);
    if (Number.isNaN(date.getTime())) continue;

    const slug = file.replace(/\.mdx?$/, '');
    dates[`/${slug}/`] = date.toISOString();
  }

  const postDates = Object.values(dates).sort();
  if (postDates.length > 0) {
    const latest = postDates[postDates.length - 1];
    dates['/'] = latest;
    dates['/blog/'] = latest;
  }

  return dates;
}

const sitemapDates = loadSitemapDates();

/**
 * Wrap Markdown tables in a scroll container so wide tables scroll within the
 * 672px article column instead of being clipped by the body's
 * `overflow-x-hidden` (see `.table-scroll` in global.css).
 */
function rehypeTableScroll() {
  /** @param {any} node */
  function walk(node) {
    if (!node.children) return;
    node.children = node.children.map((/** @type {any} */ child) => {
      if (child.type === 'element' && child.tagName === 'table') {
        return {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
          children: [child],
        };
      }
      walk(child);
      return child;
    });
  }
  return (/** @type {any} */ tree) => walk(tree);
}

export default defineConfig({
  site: 'https://jewei.net',
  output: 'static',
  markdown: {
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer'],
            content: { type: 'text', value: ' (opens in new tab)' },
            contentProperties: { className: ['sr-only'] },
          },
        ],
        rehypeTableScroll,
      ],
    }),
  },
  // Make Markdown `![]()` images responsive (auto srcset + sizes). Hand-tuned
  // component images opt out with `layout="none"` to keep their explicit
  // `widths`/`densities`, which are incompatible with a layout.
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        const lastmod = sitemapDates[pathname];
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-bricolage',
      weights: [700, 800],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Lexend',
      cssVariable: '--font-lexend',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400],
      styles: ['normal'],
      fallbacks: ['monospace'],
    },
  ],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
