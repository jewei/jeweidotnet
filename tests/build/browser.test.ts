/**
 * Real-browser checks (Playwright Chromium) against the built site:
 * interactions, console errors, and layout overflow. Needs a build.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import type { AddressInfo } from 'node:net';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vite-plus/test';
import { dist } from './helpers';

let server: http.Server;
let browser: Browser;
let origin: string;

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

beforeAll(async () => {
  server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname);
    let file = path.join(dist, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
    let status = 200;
    if (!fs.existsSync(file)) {
      file = path.join(dist, '404.html');
      status = 404;
    }
    response.writeHead(status, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  origin = `http://localhost:${(server.address() as AddressInfo).port}`;
  browser = await chromium.launch();
});

afterAll(async () => {
  await browser?.close();
  server?.close();
});

async function open(route: string, width = 1280, colorScheme: 'light' | 'dark' = 'light') {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
  await context.route(/umami|cloudflareinsights/, (route) =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
  );
  const page = await context.newPage();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  await page.goto(`${origin}${route}`, { waitUntil: 'networkidle' });
  return { page, errors, context };
}

const routes = ['/', '/blog/', '/projects/', '/about/', '/resume/', '/claude-code-tips/', '/contact/'];

describe('pages render without errors or overflow', () => {
  test.each(routes)('%s at 320px', async (route) => {
    const { page, errors, context } = await open(route, 320);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
    await context.close();
  });
});

describe('theme toggle', () => {
  test('switches theme, updates its label, and persists across pages', async () => {
    const { page, context } = await open('/', 1280, 'light');
    const toggle = page.locator('[data-theme-toggle]');
    await expect.poll(() => toggle.getAttribute('aria-pressed')).toBe('false');
    await toggle.click();
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
    expect(await toggle.getAttribute('aria-pressed')).toBe('true');
    expect(await toggle.getAttribute('aria-label')).toBe('Switch to light theme');
    await page.goto(`${origin}/blog/`);
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
    await context.close();
  });
});

describe('code blocks', () => {
  test('copy button copies the code and confirms', async () => {
    const { page, context } = await open('/claude-code-tips/');
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
    const button = page.locator('[data-copy]').first();
    await button.click();
    await expect.poll(() => button.locator('[data-copy-label]').textContent()).toBe('Copied');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain('"attribution"');
    await context.close();
  });
});

describe('keyboard', () => {
  test('the first Tab reveals the skip link, and it moves focus to main', async () => {
    const { page, context } = await open('/blog/');
    await page.keyboard.press('Tab');
    const skip = page.locator('a.skip');
    await expect.poll(() => skip.evaluate((el) => el === document.activeElement)).toBe(true);
    const box = await skip.boundingBox();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main');
    await context.close();
  });

  test('focused links show a visible outline', async () => {
    const { page, context } = await open('/');
    await page.locator('.header__nav a').first().focus();
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(outline).toBe('solid');
    await context.close();
  });
});

async function contrastOf(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)!;
    const canvas = document.createElement('canvas').getContext('2d')!;
    const rgb = (color: string) => {
      canvas.fillStyle = color;
      canvas.fillRect(0, 0, 1, 1);
      return Array.from(canvas.getImageData(0, 0, 1, 1).data.slice(0, 3));
    };
    const lum = ([r, g, b]: number[]) =>
      [r, g, b]
        .map((v) => v / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const fg = lum(rgb(getComputedStyle(el).color));
    const bg = lum(rgb(getComputedStyle(document.documentElement).backgroundColor));
    const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg];
    return (hi + 0.05) / (lo + 0.05);
  }, selector);
}

describe('contrast (WCAG AAA for text)', () => {
  test.each(['light', 'dark'] as const)(
    '%s theme: body, secondary, and meta text reach 7:1',
    async (scheme) => {
      const { page, context } = await open('/blog/', 1280, scheme);
      for (const selector of ['.ledger__title a', '.ledger__summary', '.ledger__meta time', '.label']) {
        expect(await contrastOf(page, selector), selector).toBeGreaterThanOrEqual(7);
      }
      await context.close();
    },
  );
});

describe('résumé print', () => {
  test('prints on at most two A4 pages without site chrome', async () => {
    const { page, context } = await open('/resume/');
    await page.emulateMedia({ media: 'print' });
    expect(await page.locator('.header').isVisible()).toBe(false);
    expect(await page.locator('.footer').isVisible()).toBe(false);
    const pdf = await page.pdf({ format: 'A4' });
    const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;
    expect(pages).toBeGreaterThan(0);
    expect(pages).toBeLessThanOrEqual(2);
    await context.close();
  });
});
