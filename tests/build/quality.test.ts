/**
 * Accessibility, links, agent output, and security headers. Needs a build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vite-plus/test';
import { dist, exists, htmlPages, read, resolveLocal, root } from './helpers';

describe.each(htmlPages)('%s', (_route, doc) => {
  test('has lang, a skip link, and one main landmark', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    expect(doc.querySelector('a.skip[href="#main"]')).not.toBeNull();
    expect(doc.querySelectorAll('main#main').length).toBe(1);
  });

  test('every image has an alt attribute and dimensions', () => {
    for (const img of Array.from(doc.querySelectorAll('img'))) {
      expect(img.hasAttribute('alt'), img.outerHTML.slice(0, 120)).toBe(true);
      expect(img.getAttribute('width'), img.outerHTML.slice(0, 120)).toBeTruthy();
      expect(img.getAttribute('height'), img.outerHTML.slice(0, 120)).toBeTruthy();
    }
  });

  test('ids are unique', () => {
    const ids = Array.from(doc.querySelectorAll('[id]'), (el) => el.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
  });

  test('headings do not skip levels', () => {
    const levels = Array.from(doc.querySelectorAll('main h1, main h2, main h3, main h4'), (h) =>
      Number(h.tagName[1]),
    );
    for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
  });

  test('every internal link and asset resolves', () => {
    const refs = [
      ...Array.from(doc.querySelectorAll('a[href^="/"]'), (a) => a.getAttribute('href')!),
      ...Array.from(
        doc.querySelectorAll('img[src^="/"], link[href^="/"], script[src^="/"]'),
        (el) => (el.getAttribute('src') ?? el.getAttribute('href'))!,
      ),
    ];
    for (const ref of refs) expect(resolveLocal(ref), ref).toBeDefined();
  });

  test('in-page anchors point at existing ids', () => {
    for (const a of Array.from(doc.querySelectorAll('a[href^="#"]'))) {
      const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
      expect(doc.getElementById(id), `#${id}`).not.toBeNull();
    }
  });

  test('has no inline executable scripts (CSP)', () => {
    for (const script of Array.from(doc.querySelectorAll('script'))) {
      const type = script.getAttribute('type') ?? '';
      if (['application/ld+json', 'speculationrules'].includes(type)) continue;
      expect(script.getAttribute('src'), script.outerHTML.slice(0, 80)).toBeTruthy();
    }
  });
});

describe('agent-readable output', () => {
  test('every HTML page except 404 has a Markdown copy that starts with an H1', () => {
    for (const [route] of htmlPages) {
      if (route === '/404') continue;
      const markdown = read(`${route}index.md`);
      expect(markdown, route).toMatch(/^# /);
    }
  });

  test('article Markdown keeps code fences with language and filename, and GFM tables', () => {
    const markdown = read('database-primary-key/index.md');
    expect(markdown).toContain('```sql title="schema.sql"');
    expect(markdown).toMatch(/\| Feature \| Big Integers \| Ordered UUIDv4 \| nanoid \|\n\| --- \|/);
    expect(markdown).not.toContain('<table');
    expect(markdown).not.toMatch(/Copy\b.*code/);
  });

  test('index Markdown lists posts as one-line links', () => {
    const markdown = read('blog/index.md');
    expect(markdown).toMatch(/^- \[Database Primary Key\]\(\/database-primary-key\/\) — Sep 1, 2022\. /m);
  });

  test('llms.txt guides agents and every link resolves', () => {
    const llms = read('llms.txt');
    expect(llms).toMatch(/^# jewei\.toString\(\)/);
    expect(llms).toContain('## When to use this site');
    expect(llms).toContain('Accept: text/markdown');
    for (const [, url] of llms.matchAll(/\]\((https:\/\/jewei\.net[^)]+)\)/g)) {
      expect(exists(new URL(url).pathname), url).toBe(true);
    }
  });
});

describe('security headers', () => {
  test('_headers and the middleware send the same CSP', () => {
    const headers = read('_headers');
    const middleware = fs.readFileSync(path.join(root, 'functions/_middleware.js'), 'utf8');
    const fromHeaders = headers.match(/Content-Security-Policy: (.+)/)?.[1].trim();
    const fromMiddleware = middleware.match(/'Content-Security-Policy':\s*"([^"]+)"/)?.[1];
    expect(fromHeaders).toBeTruthy();
    expect(fromHeaders).toBe(fromMiddleware);
    expect(fromHeaders).toContain("'inline-speculation-rules'");
  });
});

test('client JavaScript stays under 8 KB', () => {
  const size = ['site.js', 'theme.js'].reduce(
    (total, file) => total + fs.statSync(path.join(dist, file)).size,
    0,
  );
  expect(size).toBeLessThan(8 * 1024);
});
