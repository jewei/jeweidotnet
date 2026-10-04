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

/** A Pages URL pattern (`*` splat, `:name` placeholder) as a RegExp. */
const pagesPattern = (pattern: string) =>
  new RegExp(
    `^${pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace('*', '.*')
      .replace(/:[A-Za-z]\w*/g, '[^/]+')}$`,
  );

/** Every URL the build serves: each file, plus `/dir/` for each `dir/index.html`. */
const builtUrls = fs
  .readdirSync(dist, { recursive: true, encoding: 'utf8' })
  .filter((file) => fs.statSync(path.join(dist, file)).isFile())
  .flatMap((file) => {
    const url = `/${file.split(path.sep).join('/')}`;
    return url.endsWith('/index.html') ? [url, url.replace(/index\.html$/, '')] : [url];
  });

describe('security headers', () => {
  test('no two _headers rules set the same header for one URL', () => {
    // Pages applies every matching rule and joins a repeated header with a comma.
    const rules: { source: string; pattern: RegExp; names: string[] }[] = [];
    for (const line of read('_headers').split('\n')) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      if (/^\s/.test(line)) rules.at(-1)?.names.push(line.split(':')[0].trim().toLowerCase());
      else rules.push({ source: line.trim(), pattern: pagesPattern(line.trim()), names: [] });
    }
    const clashes: string[] = [];
    for (const url of builtUrls) {
      const setBy = new Map<string, string>();
      for (const rule of rules.filter(({ pattern }) => pattern.test(url))) {
        for (const name of rule.names) {
          if (setBy.has(name)) clashes.push(`${url}: ${name} from ${setBy.get(name)} and ${rule.source}`);
          else setBy.set(name, rule.source);
        }
      }
    }
    expect(clashes).toEqual([]);
  });

  test('_routes.json keeps static files out of the Function and pages in it', () => {
    const routes: { include: string[]; exclude: string[] } = JSON.parse(read('_routes.json'));
    expect(routes.include).toEqual(['/*']);
    expect(routes.include.length + routes.exclude.length).toBeLessThanOrEqual(100);
    const excluded = (url: string) => routes.exclude.some((rule) => pagesPattern(rule).test(url));
    for (const rule of routes.exclude) {
      expect(rule.length, rule).toBeLessThanOrEqual(100);
      expect(
        builtUrls.some((url) => pagesPattern(rule).test(url)),
        `${rule} matches no file`,
      ).toBe(true);
    }
    // Pages and Markdown copies need the middleware for negotiation and headers.
    const negotiated = builtUrls.filter((url) => url.endsWith('/') || url.endsWith('.md'));
    expect(negotiated.filter(excluded)).toEqual([]);
    expect(excluded('/full-page/')).toBe(false);
  });

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

test('catalogue numbers follow publication date, then slug', () => {
  const blogDir = path.join(root, 'src/content/blog');
  const posts = fs
    .readdirSync(blogDir)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => {
      const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const pubDate = raw.match(/^pubDate:\s*["']?([^"'\n]+)/m)?.[1] ?? '';
      return { slug: file.replace(/\.mdx?$/, ''), date: Date.parse(pubDate), draft: /^draft:\s*true/m.test(raw) };
    })
    .filter((post) => !post.draft)
    .sort((a, b) => a.date - b.date || a.slug.localeCompare(b.slug));
  posts.forEach((post, index) => {
    const shown = read(`${post.slug}/index.html`).match(/<dd[^>]*>No\.\s(\d+)<\/dd>/)?.[1];
    expect(shown, post.slug).toBe(String(index + 1).padStart(3, '0'));
  });
});
