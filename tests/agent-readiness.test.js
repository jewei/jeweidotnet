import { describe, expect, test } from 'bun:test';
import fs from 'node:fs';
import path from 'node:path';
import { onRequest } from '../functions/_middleware.js';

const dist = path.resolve(import.meta.dir, '..', 'dist');

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
    const body = await response.text();
    expect(body).toContain('https://jewei.net/sitemap-index.xml');
    expect(body).toContain('https://jewei.net/llms.txt');
  });
});

describe('agent-readable build output', () => {
  test('the HTML 404 does not advertise a missing Markdown alternate', () => {
    const html = fs.readFileSync(path.join(dist, '404.html'), 'utf8');

    expect(html).not.toContain('rel="alternate" type="text/markdown"');
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
});
