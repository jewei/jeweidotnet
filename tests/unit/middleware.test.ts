/**
 * Cloudflare Pages middleware: content negotiation, redirects, headers.
 * Runs without a build: `vp test tests/unit`.
 */
import { describe, expect, test } from 'vite-plus/test';
import { onRequest } from '../../functions/_middleware.js';

function assetResponse(body: string, status = 200, contentType = 'text/plain; charset=utf-8') {
  return new Response(body, { status, headers: { 'Content-Type': contentType, Vary: 'Accept-Encoding' } });
}

const MARKDOWN_ETAG = '"md-about"';

/**
 * A Pages context that serves only files that exist: the HTML page and its
 * Markdown copy at /about/index.md. Pages redirects /about/index.html to
 * /about/, and answers a matching If-None-Match with 304.
 */
function createContext({
  accept,
  pathname = '/about/',
  markdownExists = true,
  ifNoneMatch,
}: { accept?: string; pathname?: string; markdownExists?: boolean; ifNoneMatch?: string } = {}) {
  const headers = new Headers();
  if (accept !== undefined) headers.set('Accept', accept);
  if (ifNoneMatch !== undefined) headers.set('If-None-Match', ifNoneMatch);
  const request = new Request(`https://jewei.net${pathname}`, { headers });
  const markdownFiles = markdownExists ? ['/about/index.md'] : [];
  const serve = (assetRequest: Request): Response => {
    const assetPath = new URL(assetRequest.url).pathname;
    if (markdownFiles.includes(assetPath)) {
      if (assetRequest.headers.get('If-None-Match') === MARKDOWN_ETAG)
        return new Response(null, { status: 304, headers: { ETag: MARKDOWN_ETAG } });
      const response = assetResponse('# About Jewei\n\nSoftware engineer.');
      response.headers.set('ETag', MARKDOWN_ETAG);
      return response;
    }
    if (assetPath === '/about/index.html')
      return new Response(null, { status: 308, headers: { Location: '/about/' } });
    if (assetPath === '/about/') return assetResponse('<h1>About Jewei</h1>', 200, 'text/html; charset=utf-8');
    return assetResponse('<h1>Page not found</h1>', 404, 'text/html; charset=utf-8');
  };
  return {
    request,
    next: async (): Promise<Response> => serve(request),
    env: { ASSETS: { fetch: async (assetRequest: Request): Promise<Response> => serve(assetRequest) } },
  };
}

function expectSecurityHeaders(response: Response) {
  expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
  expect(response.headers.get('Strict-Transport-Security')).toBe(
    'max-age=31536000; includeSubDomains; preload',
  );
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
  expect(response.headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
  expect(response.headers.get('X-Frame-Options')).toBe('DENY');
}

describe('HTTP content negotiation', () => {
  test('serves Markdown from the canonical page URL and varies caches on Accept', async () => {
    const response = await onRequest(createContext({ accept: 'text/markdown, text/html;q=0.8' }));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept');
    expect(await response.text()).toMatch(/^# About Jewei/);
  });

  test('honors q-values and advertises the Markdown alternate on HTML', async () => {
    const response = await onRequest(createContext({ accept: 'text/markdown;q=0.5, text/html;q=1' }));

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
  ])(
    'chooses the correct default, wildcard, and q=0 representation',
    async (accept: string | undefined, expectedType: string) => {
      const response = await onRequest(createContext({ accept }));

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toContain(expectedType);
    },
  );

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

  test('serves a direct /index.md request to a Markdown-only client', async () => {
    const response = await onRequest(createContext({ accept: 'text/markdown', pathname: '/about/index.md' }));

    expect(response.status).toBe(200);
    expect(await response.text()).toMatch(/^# About Jewei/);
  });

  test('passes a 304 for the Markdown copy through', async () => {
    const response = await onRequest(createContext({ accept: 'text/markdown', ifNoneMatch: MARKDOWN_ETAG }));

    expect(response.status).toBe(304);
    expect(response.headers.get('ETag')).toBe(MARKDOWN_ETAG);
    expect(response.headers.get('Vary')).toBe('Accept');
  });

  test('passes a redirect through to a Markdown-only client instead of 406', async () => {
    const response = await onRequest(createContext({ accept: 'text/markdown', pathname: '/about/index.html' }));

    expect(response.status).toBe(308);
    expect(response.headers.get('Location')).toBe('/about/');
  });

  test('returns 406 when the Markdown copy is missing and HTML is not acceptable', async () => {
    const response = await onRequest(createContext({ accept: 'text/markdown', markdownExists: false }));

    expect(response.status).toBe(406);
    expectSecurityHeaders(response);
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
describe('renamed article redirects', () => {
  test.each([
    ['/full-page', '/full-page-browser-screenshot/'],
    ['/full-page/', '/full-page-browser-screenshot/'],
    ['/full-page/index.md', '/full-page-browser-screenshot/index.md'],
  ])('redirects %s and preserves query parameters', async (from: string, to: string) => {
    const context = createContext({ pathname: `${from}?ref=old-link`, accept: 'text/markdown' });
    context.next = async (): Promise<Response> => {
      throw new Error('Redirect must run before asset lookup');
    };
    context.env.ASSETS.fetch = context.next;

    const response = await onRequest(context);

    expect(response.status).toBe(301);
    expect(response.headers.get('Location')).toBe(`https://jewei.net${to}?ref=old-link`);
    expectSecurityHeaders(response);
  });
});
test('static files bypass negotiation', async () => {
  const response = await onRequest(createContext({ pathname: '/site.webmanifest', accept: 'text/markdown' }));
  expect(response.headers.get('Content-Type')).toContain('text/html');
});
