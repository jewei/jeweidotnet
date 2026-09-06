import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { onRequest } from '../functions/_middleware.js';

const dist = path.resolve(import.meta.dir, '..', 'dist');

function builtHtmlFiles() {
  return fs
    .readdirSync(dist, { recursive: true })
    .filter((entry) => entry.endsWith('.html'))
    .map((entry) => path.join(dist, entry));
}

function jsonLdBlocks(html) {
  return Array.from(
    html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi),
    (match) => JSON.parse(match[1]),
  );
}

function assetResponse(body, status = 200, contentType = 'text/plain; charset=utf-8') {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': contentType,
      'Vary': 'Accept-Encoding',
    },
  });
}

function createContext({ accept, pathname = '/about/', markdownExists = true } = {}) {
  const headers = new Headers();
  if (accept !== undefined) headers.set('Accept', accept);

  const request = new Request(`https://jewei.net${pathname}`, { headers });
  const htmlStatus = pathname === '/missing/' ? 404 : 200;
  const html = htmlStatus === 404 ? '<h1>Page not found</h1>' : '<h1>About Jewei</h1>';

  return {
    request,
    next: async () => assetResponse(html, htmlStatus, 'text/html; charset=utf-8'),
    env: {
      ASSETS: {
        fetch: async (assetRequest) => {
          const assetPath = new URL(assetRequest.url).pathname;
          if (assetPath.endsWith('/index.md') && markdownExists) {
            return assetResponse('# About Jewei\n\nSoftware engineer.');
          }
          return assetResponse('not found', 404);
        },
      },
    },
  };
}

function expectSecurityHeaders(response) {
  expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  expect(response.headers.get('Strict-Transport-Security')).toBe(
    'max-age=31536000; includeSubDomains; preload',
  );
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  expect(response.headers.get('Permissions-Policy')).toBe(
    'camera=(), microphone=(), geolocation=()',
  );
  expect(response.headers.get('X-Frame-Options')).toBe('DENY');
}

describe('HTTP content negotiation', () => {
  test('serves Markdown from the canonical page URL and varies caches on Accept', async () => {
    const response = await onRequest(
      createContext({ accept: 'text/markdown, text/html;q=0.8' }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept');
    expect(await response.text()).toStartWith('# About Jewei');
  });

  test('honors q-values and advertises the Markdown alternate on HTML', async () => {
    const response = await onRequest(
      createContext({ accept: 'text/markdown;q=0.5, text/html;q=1' }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/html');
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept');
    expect(response.headers.get('Link')).toContain(
      '</about/index.md>; rel="alternate"; type="text/markdown"',
    );
    expect(response.headers.get('Link')).toContain('</llms.txt>; rel="describedby"');
  });

  test.each([
    [undefined, 'text/html'],
    ['*/*', 'text/html'],
    ['text/markdown;q=0, text/html', 'text/html'],
    ['text/html;q=0, */*;q=1', 'text/markdown'],
  ])('chooses the correct default, wildcard, and q=0 representation', async (accept, expectedType) => {
    const response = await onRequest(createContext({ accept }));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain(expectedType);
  });

  test('returns 406 when no available representation is acceptable', async () => {
    const response = await onRequest(createContext({ accept: 'application/json' }));

    expect(response.status).toBe(406);
    expect(response.headers.get('Vary')).toBe('Accept');
    expectSecurityHeaders(response);
  });

  test('preserves the real HTML 404 status for browsers', async () => {
    const response = await onRequest(createContext({ pathname: '/missing/' }));

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toContain('text/html');
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept');
  });

  test('returns a recoverable Markdown 404 for an unknown page', async () => {
    const response = await onRequest(
      createContext({ accept: 'text/markdown', pathname: '/missing/', markdownExists: false }),
    );

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Vary')).toBe('Accept');
    expectSecurityHeaders(response);
    const body = await response.text();
    expect(body).toContain('https://jewei.net/sitemap-index.xml');
    expect(body).toContain('https://jewei.net/llms.txt');
  });
});

describe('footer navigation', () => {
  test('offers clear utility routes and accessible social links', () => {
    const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
    const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] ?? '';

    expect(footer).toContain('aria-label="Site information"');
    expect(footer).toContain('aria-label="Elsewhere"');
    for (const route of ['/projects/', '/blog/', '/contact/', '/privacy/']) {
      expect(footer).toContain(`href="${route}"`);
    }

    const socialLinks = footer.match(
      /<nav class="social-links social-links--compact" aria-label="Elsewhere">([\s\S]*?)<\/nav>/i,
    )?.[1] ?? '';

    expect(socialLinks).toContain('href="/rss.xml"');
    for (const label of ['RSS', 'X', 'GitHub']) {
      expect(socialLinks).toContain(`aria-label="${label}`);
    }
    expect(socialLinks).not.toMatch(/>\s*(RSS|X|GitHub)\s*</);
  });
});

describe('responsive navigation', () => {
  test('hides the menu toggle at the desktop breakpoint', () => {
    const css = fs
      .readdirSync(path.join(dist, '_astro'))
      .filter((file) => file.endsWith('.css'))
      .map((file) => fs.readFileSync(path.join(dist, '_astro', file), 'utf8'))
      .join('\n');

    expect(css).toMatch(
      /@media\s*\((?:min-width:\s*48rem|width\s*>=\s*48rem)\)[^{]*\{[\s\S]*?\.menu-toggle\{display:none\}/,
    );
  });
});

describe('renamed article redirects', () => {
  test.each([
    ['/full-page', '/full-page-browser-screenshot/'],
    ['/full-page/', '/full-page-browser-screenshot/'],
    ['/full-page/index.md', '/full-page-browser-screenshot/index.md'],
  ])('redirects %s and preserves query parameters', async (from, to) => {
    const context = createContext({ pathname: `${from}?ref=old-link`, accept: 'text/markdown' });
    context.next = async () => { throw new Error('Redirect must run before asset lookup'); };
    context.env.ASSETS.fetch = context.next;

    const response = await onRequest(context);

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe(`https://jewei.net${to}?ref=old-link`);
    expectSecurityHeaders(response);
  });
});

describe('agent-readable build output', () => {
  test('preserves intentional spaces around inline homepage links', () => {
    const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

    expect(html).toMatch(
      /New posts land in the\s+<a[^>]*href="\/rss\.xml"[^>]*>RSS feed<\/a>\s+first\. You can also\s+<a[^>]*href="\/contact\/"[^>]*>say hello<\/a>/,
    );
  });

  test('the HTML 404 does not advertise a missing Markdown alternate', () => {
    const html = fs.readFileSync(path.join(dist, '404.html'), 'utf8');

    expect(html).not.toContain('rel="alternate" type="text/markdown"');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('property="og:url"');
    expect(html).toContain('rel="describedby" href="/llms.txt"');
  });

  test('publishes the agent index with specific when-to-use guidance', () => {
    const llms = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8');

    expect(llms).toContain('# jewei.toString()');
    expect(llms).toContain('## When to use this site');
    expect(llms).toContain('Accept: text/markdown');
  });

  test.each(['about', 'contact', 'privacy'])(
    '%s is a substantial trust page with a Markdown representation',
    (page) => {
      const html = fs.readFileSync(path.join(dist, page, 'index.html'), 'utf8');
      const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
      const visibleText = main
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      expect(visibleText.length).toBeGreaterThanOrEqual(500);
      expect(fs.readFileSync(path.join(dist, page, 'index.md'), 'utf8')).toStartWith('# ');
    },
  );

  test('uses Person schema for About and WebPage schema for policy pages', () => {
    const about = fs.readFileSync(path.join(dist, 'about', 'index.html'), 'utf8');
    const contact = fs.readFileSync(path.join(dist, 'contact', 'index.html'), 'utf8');
    const privacy = fs.readFileSync(path.join(dist, 'privacy', 'index.html'), 'utf8');

    expect(about).toContain('"@type":"Person"');
    expect(contact).toContain('"@type":"ContactPage"');
    expect(privacy).toContain('"@type":"WebPage"');
  });

  test('generates a Markdown representation for every HTML page', () => {
    const htmlFiles = [];
    for (const entry of fs.readdirSync(dist, { recursive: true })) {
      if (entry === '404.html' || !entry.endsWith('.html')) continue;
      htmlFiles.push(entry);
    }

    for (const htmlFile of htmlFiles) {
      const markdownFile = htmlFile.replace(/index\.html$/, 'index.md');
      expect(fs.existsSync(path.join(dist, markdownFile)), markdownFile).toBeTrue();
    }
  });

  test('keeps generated metadata, action links, related posts, and pagination readable', () => {
    const home = fs.readFileSync(path.join(dist, 'index.md'), 'utf8');
    const projects = fs.readFileSync(path.join(dist, 'projects', 'index.md'), 'utf8');
    const article = fs.readFileSync(
      path.join(dist, 'the-spectrum-of-software-makers', 'index.md'),
      'utf8',
    );

    expect(home).toContain(
      '[Explore my work](/projects/) · [Read my writing](/blog/) · [Résumé](/resume/)',
    );
    expect(projects).toContain('macOS utility · Free and open source');
    expect(projects).toContain(
      '[Read the story](/claude-meter-v2/) · [Source](https://github.com/jewei/claude-meter)',
    );
    expect(article).toMatch(/By \[Jewei Mak\]\(\/about\/\) · October 28, 2023 · 6 min read/);
    expect(article).toMatch(
      /1\.\s+\[Claude Code Tips\]\(\/claude-code-tips\/\) — Jun 26, 2026\. A growing list/,
    );
    expect(article).toContain('**Previous:** [Laravel Skeleton](/laravel-skeleton/)');
    expect(article).toContain('**Next:** [Introducing TypeID PHP](/introducing-typeid-php/)');
    expect(home).not.toMatch(/\]\([^\n)]+\)\[/);
    expect(article).not.toMatch(/[ \t]+\]\(/);
  });

  test('converts article tables to GFM Markdown tables', () => {
    const markdown = fs.readFileSync(
      path.join(dist, 'database-primary-key', 'index.md'),
      'utf8',
    );

    expect(markdown).toContain('| Feature | Big Integers | Ordered UUIDv4 | nanoid |');
    expect(markdown).toContain('| --- | --- | --- | --- |');
    expect(markdown).not.toContain('<table');
  });

  test('keeps code languages, filenames, and image descriptions in Markdown', () => {
    const article = fs.readFileSync(
      path.join(dist, 'database-primary-key', 'index.md'),
      'utf8',
    );
    const home = fs.readFileSync(path.join(dist, 'index.md'), 'utf8');

    expect(article).toContain('```sql title="schema.sql"');
    expect(home).toContain(
      '![Claude Meter menu bar app showing separate energy levels for personal, team, and family accounts.]',
    );
    expect(home).not.toMatch(/\[!\[\]\(/);
  });
});

describe('page quality contracts', () => {
  test('publishes the project index and software schema', () => {
    const html = fs.readFileSync(path.join(dist, 'projects', 'index.html'), 'utf8');
    const itemList = jsonLdBlocks(html).find((block) => block['@type'] === 'ItemList');

    expect(itemList).toBeDefined();
    expect(itemList.numberOfItems).toBe(5);
    expect(JSON.stringify(itemList)).toContain('SoftwareApplication');
    expect(JSON.stringify(itemList)).toContain('SoftwareSourceCode');
    for (const name of ['Claude Meter', 'Bopop', 'Uppa', 'TypeID PHP', 'Full Page']) {
      expect(html).toContain(name);
    }
    const fullPage = itemList.itemListElement.find((entry) => entry.item.name === 'Full Page');
    expect(fullPage.item.mainEntityOfPage).toBe('https://jewei.net/full-page-browser-screenshot/');
    expect(fullPage.item.url).toBe('https://github.com/jewei/browser-screenshot');
  });

  test('adds publication metadata, a table of contents, and code controls to technical articles', () => {
    const html = fs.readFileSync(path.join(dist, 'claude-code-tips', 'index.html'), 'utf8');

    expect(html).toContain('<meta property="article:published_time"');
    expect(html).toContain('<meta name="twitter:image:alt"');
    expect(html).toContain('"@type":"BlogPosting"');
    expect(html).toContain('class="article-toc"');
    expect(html).toContain('data-code-block');
    expect(html).toContain('data-code-copy');
    expect(html).toContain('aria-label="Copy JSON code"');
    expect(html).toContain('src="/article.js"');
  });

  test('gives every HTML page one H1 and complete sharing metadata', () => {
    for (const file of builtHtmlFiles()) {
      const html = fs.readFileSync(file, 'utf8');
      const relative = path.relative(dist, file);

      expect(html.match(/<h1\b/gi)?.length ?? 0, `${relative}: H1 count`).toBe(1);
      expect(html, `${relative}: title`).toContain('<title>');
      expect(html, `${relative}: description`).toContain('<meta name="description"');
      if (relative === '404.html') {
        expect(html, `${relative}: canonical`).not.toContain('<link rel="canonical"');
      } else {
        expect(html, `${relative}: canonical`).toContain('<link rel="canonical"');
      }
      expect(html, `${relative}: Open Graph image alt`).toContain(
        '<meta property="og:image:alt"',
      );
      expect(html, `${relative}: Twitter image alt`).toContain(
        '<meta name="twitter:image:alt"',
      );
    }
  });

  test('reports the real dimensions of every social image', async () => {
    const checkedImages = new Set();

    for (const file of builtHtmlFiles()) {
      const html = fs.readFileSync(file, 'utf8');
      const url = html.match(/<meta property="og:image" content="[^"]+\/(?:_astro\/)?([^"]+)"/)?.[1];
      const width = Number(html.match(/<meta property="og:image:width" content="(\d+)"/)?.[1]);
      const height = Number(html.match(/<meta property="og:image:height" content="(\d+)"/)?.[1]);
      if (!url || checkedImages.has(url)) continue;

      checkedImages.add(url);
      const imagePath = path.join(dist, '_astro', path.basename(url));
      const metadata = await sharp(imagePath).metadata();
      expect(metadata.width, `${url}: width`).toBe(width);
      expect(metadata.height, `${url}: height`).toBe(height);
    }

    expect(checkedImages.size).toBeGreaterThan(0);
  });

  test('uses readable topic names in archive metadata and headings', () => {
    const ai = fs.readFileSync(path.join(dist, 'blog', 'ai', 'index.html'), 'utf8');
    const macos = fs.readFileSync(path.join(dist, 'blog', 'macos', 'index.html'), 'utf8');

    expect(ai).toContain('<title>Writing about AI');
    expect(ai).toContain('<h1>AI</h1>');
    expect(macos).toContain('<title>Writing about macOS');
    expect(macos).toContain('<h1>macOS</h1>');
  });

  test('does not emit double-slash paths in structured data', () => {
    let schemaCount = 0;
    for (const file of builtHtmlFiles()) {
      const blocks = jsonLdBlocks(fs.readFileSync(file, 'utf8'));
      schemaCount += blocks.length;
      for (const block of blocks) {
        expect(JSON.stringify(block), path.relative(dist, file)).not.toContain(
          'https://jewei.net//',
        );
      }
    }
    expect(schemaCount).toBeGreaterThan(0);
  });

  test('includes a dedicated résumé print layout', () => {
    const css = fs
      .readdirSync(path.join(dist, '_astro'))
      .filter((file) => file.endsWith('.css'))
      .map((file) => fs.readFileSync(path.join(dist, '_astro', file), 'utf8'))
      .join('\n');

    expect(css).toContain('@media print');
    expect(css).toMatch(/@page\{size:A4;margin:8mm 10mm\}/);
    expect(css).toMatch(/\.site-header[^}]*\.site-footer[^}]*display:none!important/);
  });

  test('links to a versioned résumé PDF that exists in the build', () => {
    const html = fs.readFileSync(path.join(dist, 'resume', 'index.html'), 'utf8');
    const pdfPath = html.match(/href="(\/content\/files\/[^"?]+\.pdf)"/)?.[1];

    expect(pdfPath).toBe('/content/files/2026/09/jewei-mak-resume-2026.pdf');
    expect(fs.existsSync(path.join(dist, pdfPath.slice(1)))).toBe(true);
  });
});
