/**
 * SEO and sharing contract for every built page. Needs `vp run build`.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, test } from 'vite-plus/test';
import { dist, exists, htmlPages, indexable, jsonLd, read, root } from './helpers';

const meta = (doc: Document, selector: string) => doc.querySelector(selector)?.getAttribute('content') ?? '';

describe.each(indexable)('%s', (route, doc) => {
  test('has one H1, a title, and a description in range', () => {
    expect(doc.querySelectorAll('h1').length).toBe(1);
    const title = doc.querySelector('title')?.textContent ?? '';
    expect(title.length).toBeGreaterThan(5);
    expect(title.length).toBeLessThanOrEqual(70);
    const description = meta(doc, 'meta[name="description"]');
    expect(description.length).toBeGreaterThanOrEqual(40);
    expect(description.length).toBeLessThanOrEqual(200);
  });

  test('has an absolute canonical URL with a trailing slash', () => {
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
    expect(canonical).toBe(`https://jewei.net${route}`);
    expect(meta(doc, 'meta[property="og:url"]')).toBe(canonical);
  });

  test('has complete Open Graph and Twitter tags', () => {
    for (const property of [
      'og:title',
      'og:description',
      'og:image',
      'og:image:alt',
      'og:type',
      'og:site_name',
    ]) {
      expect(meta(doc, `meta[property="${property}"]`), property).not.toBe('');
    }
    for (const name of ['twitter:card', 'twitter:image', 'twitter:image:alt']) {
      expect(meta(doc, `meta[name="${name}"]`), name).not.toBe('');
    }
  });

  test('has valid JSON-LD with WebSite and Person', () => {
    const blocks = jsonLd(doc);
    expect(blocks.length).toBe(1);
    const types = (blocks[0]['@graph'] as { '@type': string }[]).map((node) => node['@type']);
    expect(types).toContain('WebSite');
    expect(types).toContain('Person');
    expect(JSON.stringify(blocks)).not.toContain('jewei.net//');
  });

  test('declares the Markdown alternate, and it exists', () => {
    const href = doc.querySelector('link[rel="alternate"][type="text/markdown"]')?.getAttribute('href') ?? '';
    expect(href).toMatch(/index\.md$/);
    expect(exists(href)).toBe(true);
  });
});

test('the 404 page is noindex and has no canonical or Markdown alternate', () => {
  const [, doc] = htmlPages.find(([route]) => route === '/404')!;
  expect(meta(doc, 'meta[name="robots"]')).toContain('noindex');
  expect(doc.querySelector('link[rel="canonical"]')).toBeNull();
  expect(doc.querySelector('link[rel="alternate"][type="text/markdown"]')).toBeNull();
});

test('titles and descriptions are unique across pages', () => {
  const titles = indexable.map(([, doc]) => doc.querySelector('title')?.textContent);
  const descriptions = indexable.map(([, doc]) => meta(doc, 'meta[name="description"]'));
  expect(new Set(titles).size).toBe(titles.length);
  expect(new Set(descriptions).size).toBe(descriptions.length);
});

test('every social image exists and reports its real size', async () => {
  const seen = new Set<string>();
  for (const [, doc] of indexable) {
    const url = meta(doc, 'meta[property="og:image"]');
    if (seen.has(url)) continue;
    seen.add(url);
    const file = path.join(dist, new URL(url).pathname);
    const info = await sharp(file).metadata();
    expect(info.width, url).toBe(Number(meta(doc, 'meta[property="og:image:width"]')));
    expect(info.height, url).toBe(Number(meta(doc, 'meta[property="og:image:height"]')));
  }
});

test('articles publish BlogPosting and BreadcrumbList data', () => {
  const doc = htmlPages.find(([route]) => route === '/database-primary-key/')![1];
  const graph = jsonLd(doc)[0]['@graph'] as Record<string, unknown>[];
  const article = graph.find((node) => node['@type'] === 'BlogPosting')!;
  expect(article.headline).toBe('Database Primary Key');
  expect(article.datePublished).toBeTruthy();
  expect(article.dateModified).toBeTruthy();
  expect(graph.some((node) => node['@type'] === 'BreadcrumbList')).toBe(true);
  expect(meta(doc, 'meta[property="article:published_time"]')).not.toBe('');
});

test('the sitemap lists every indexable page with lastmod for posts, and no 404', () => {
  const sitemap = read('sitemap-0.xml');
  for (const [route] of indexable) expect(sitemap, route).toContain(`<loc>https://jewei.net${route}</loc>`);
  expect(sitemap).not.toContain('404');
  expect(sitemap).toMatch(/<url><loc>https:\/\/jewei\.net\/uppa\/<\/loc><lastmod>/);
});

test('every legacy URL still resolves', () => {
  const legacy = fs.readFileSync(path.join(root, 'tests/build/legacy-urls.txt'), 'utf8').trim().split('\n');
  for (const route of legacy) expect(exists(`${route}index.html`), route).toBe(true);
});

test('robots.txt allows crawling and points at the sitemap', () => {
  const robots = read('robots.txt');
  expect(robots).toContain('Allow: /');
  expect(robots).toContain('Sitemap: https://jewei.net/sitemap-index.xml');
});

test('RSS lists every published post with categories and a self link', () => {
  const rss = read('rss.xml');
  const posts = fs.readdirSync(path.join(root, 'src/content/blog')).filter((file) => {
    const raw = fs.readFileSync(path.join(root, 'src/content/blog', file), 'utf8');
    return /\.mdx?$/.test(file) && !/^draft:\s*true/m.test(raw);
  });
  expect(rss.match(/<item>/g)?.length).toBe(posts.length);
  expect(rss).toContain('rel="self"');
  expect(rss).toContain('<category>');
  expect(rss).toContain('<language>en</language>');
});
