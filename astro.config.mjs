// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Build a map of `/{slug}/` → ISO `lastmod` for the sitemap.
 *
 * The sitemap integration's `serialize` hook runs in the config context, where
 * `astro:content` (and therefore the blog collection) is unavailable. Reading
 * the frontmatter from disk here is the only way to attach accurate `lastmod`
 * dates. Draft handling is kept in sync with `getPublishedPosts()` in
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

    const frontmatter = match[1];
    if (/^draft:\s*true\b/m.test(frontmatter)) continue;

    const updated = frontmatter.match(/^updatedDate:\s*["']?([^"'\n]+)["']?/m)?.[1];
    const published = frontmatter.match(/^pubDate:\s*["']?([^"'\n]+)["']?/m)?.[1];
    const lastmod = updated ?? published;
    if (!lastmod) continue;

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

export default defineConfig({
  site: 'https://jewei.net',
  output: 'static',
  // Make Markdown `![]()` images responsive (auto srcset + sizes). Hand-tuned
  // component images opt out with `layout="none"` to keep their explicit
  // `widths`/`densities`, which are incompatible with a layout.
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  integrations: [
    mdx(),
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
