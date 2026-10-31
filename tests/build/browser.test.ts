/**
 * Real-browser checks (Playwright Chromium) against the built site:
 * interactions, console errors, and layout overflow. Needs a build.
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';
import { afterAll, beforeAll, describe, expect, test } from 'vite-plus/test';
import { findOverflow } from '../../scripts/overflow';
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
  const address = server.address();
  if (address === null || typeof address === 'string') throw new Error('The test server has no TCP port.');
  origin = `http://localhost:${address.port}`;
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

const routes = [
  '/',
  '/blog/',
  '/blog/ai/',
  '/projects/',
  '/about/',
  '/resume/',
  '/collections/',
  '/claude-code-tips/',
  '/contact/',
];
const widths = [320, 768, 1024, 1440];

describe('pages render without errors or overflow', () => {
  test.each(routes)('%s at 320, 768, 1024, and 1440px', async (route) => {
    const { page, errors, context } = await open(route, widths[0]);
    await page.evaluate(() => document.fonts.ready);
    const overflow: Record<number, string[]> = {};
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const found = await findOverflow(page);
      if (found.length) overflow[width] = found;
    }
    expect(overflow).toEqual({});
    expect(errors).toEqual([]);
    await context.close();
  });
});

describe('font preloads', () => {
  // A preload is a high-priority download. One the page never renders with
  // only competes with the fonts it does use (Source Serif once cost 40 KB on
  // pages without serif text).
  test.each(routes)('%s uses every font it preloads', async (route) => {
    const { page, context } = await open(route);
    await page.evaluate(() => document.fonts.ready);
    const unused = await page.evaluate(() => {
      const family = (value: string) => value.replace(/["']/g, '').trim();
      const faces: { family: string; src: string }[] = [];
      for (const sheet of Array.from(document.styleSheets)) {
        for (const rule of Array.from(sheet.cssRules)) {
          if (rule instanceof CSSFontFaceRule) {
            faces.push({
              family: family(rule.style.getPropertyValue('font-family')),
              src: rule.style.getPropertyValue('src'),
            });
          }
        }
      }
      const used = new Set(
        Array.from(document.fonts)
          .filter((face) => face.status === 'loaded')
          .map((face) => family(face.family)),
      );
      return Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="preload"][as="font"]'))
        .map((link) => new URL(link.href).pathname)
        .filter((href) => {
          const face = faces.find((candidate) => candidate.src.includes(href));
          return !face || !used.has(face.family);
        });
    });
    expect(unused).toEqual([]);
    await context.close();
  });
});

describe('theme toggle', () => {
  test('switches theme, updates its label, and persists across pages', async () => {
    const { page, context } = await open('/', 1280, 'light');
    const toggle = page.locator('[data-theme-toggle]');
    await expect.poll(() => toggle.getAttribute('aria-pressed')).toBe('false');
    await toggle.click();
    // The theme changes inside a view transition, a frame after the click.
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
    expect(await toggle.getAttribute('aria-pressed')).toBe('true');
    expect(await toggle.getAttribute('aria-label')).toBe('Switch to light theme');
    await page.goto(`${origin}/blog/`);
    expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
    await context.close();
  });
});

describe('home portrait', () => {
  /** The home page with the irises painted in, and helpers that read what is on screen. */
  async function portrait(options: { width?: number; scale?: number } = {}) {
    const context = await browser.newContext({
      viewport: { width: options.width ?? 1280, height: 900 },
      deviceScaleFactor: options.scale ?? 1,
    });
    await context.route(/umami|cloudflareinsights/, (route) =>
      route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }),
    );
    const page = await context.newPage();
    await page.goto(`${origin}/`, { waitUntil: 'networkidle' });
    const eyes = page.locator('[data-eyes]');
    // The irises appear once site.js has painted the portrait into them.
    await expect.poll(() => eyes.getAttribute('data-on'), { timeout: 5000 }).toBe('');
    const box = await eyes.boundingBox();
    if (!box) throw new Error('The eyes have no box');
    const row = box.y + box.height * 0.43;
    // The rendered sideways shift of the first iris, in portrait pixels.
    const shift = () =>
      page
        .locator('.eyes__iris')
        .first()
        .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).e);
    const gaze = () => eyes.evaluate((el) => getComputedStyle(el).getPropertyValue('--x'));
    const sources = () =>
      page.evaluate(() => [
        document.querySelector('[data-eyes] image')?.getAttribute('href'),
        document.querySelector<HTMLImageElement>('.portrait__frame img')?.currentSrc,
      ]);
    return { page, context, eyes, row, shift, gaze, sources };
  }

  test('the eyes turn toward the pointer, drawn from the portrait itself', async () => {
    const { page, context, row, shift, sources } = await portrait();
    const [href, current] = await sources();
    expect(href).toBe(current);
    await page.mouse.move(0, row);
    await expect.poll(shift).toBeLessThan(-4);
    await page.mouse.move(1279, row);
    await expect.poll(shift).toBeGreaterThan(4);
    await context.close();
  });

  test('the eyes look ahead again when the pointer leaves the page', async () => {
    const { page, context, row, shift } = await portrait();
    // A plain leave, frames after the last move.
    await page.mouse.move(0, row);
    await expect.poll(shift).toBeLessThan(-4);
    await page.waitForTimeout(300);
    await page.evaluate(() =>
      document.documentElement.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' })),
    );
    await expect.poll(shift).toBe(0);
    // A last move and the leave in the same frame: the queued move must not win.
    await page.mouse.move(0, row);
    await expect.poll(shift).toBeLessThan(-4);
    await page.evaluate((y) => {
      dispatchEvent(new PointerEvent('pointermove', { clientX: 1, clientY: y, pointerType: 'mouse' }));
      document.documentElement.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }));
    }, row);
    await expect.poll(shift).toBe(0);
    await context.close();
  });

  // A press aims the eyes. Only a mouse can hover, so only a mouse leave resets
  // them; a finger or a pen "leaves" after every tap and keeps the gaze.
  test.each([
    ['touch', 'keeps'],
    ['pen', 'keeps'],
    ['mouse', 'resets'],
  ] as const)('a %s press turns the eyes, and its leave %s the gaze', async (pointerType, after) => {
    const { page, context, row, gaze } = await portrait();
    await page.evaluate(
      ([y, type]) => {
        dispatchEvent(new PointerEvent('pointerdown', { clientX: 1, clientY: y, pointerType: type }));
      },
      [row, pointerType] as const,
    );
    await expect.poll(gaze).toMatch(/^-0\.[5-9]/);
    await page.evaluate(
      (type) =>
        document.documentElement.dispatchEvent(new PointerEvent('pointerleave', { pointerType: type })),
      pointerType,
    );
    if (after === 'keeps') {
      await page.waitForTimeout(300);
      expect(await gaze()).toMatch(/^-0\.[5-9]/);
    } else {
      await expect.poll(gaze).toBe('0.000');
    }
    await context.close();
  });

  test('reduced motion, switched on mid-visit, hides and stops the eyes; off, they follow again', async () => {
    const { page, context, eyes, row, shift, gaze } = await portrait();
    await page.mouse.move(0, row);
    await expect.poll(shift).toBeLessThan(-4);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect.poll(() => eyes.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
    await expect.poll(gaze).toBe('0.000');
    await page.mouse.move(1, row);
    await page.waitForTimeout(200);
    expect(await gaze()).toBe('0.000');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await expect.poll(shift).toBeLessThan(-4);
    await context.close();
  });

  test('the irises follow a srcset swap', async () => {
    const { page, context, sources } = await portrait({ width: 375, scale: 2 });
    const [, before] = await sources();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect.poll(async () => (await sources())[1]).not.toBe(before);
    await expect.poll(async () => new Set(await sources()).size).toBe(1);
    await context.close();
  });

  test('nothing runs while the portrait is off screen', async () => {
    const { page, context, eyes, row, shift } = await portrait();
    await page.mouse.move(0, row);
    await expect.poll(shift).toBeLessThan(-4);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const writes = await eyes.evaluate(async (el) => {
      let count = 0;
      new MutationObserver((records) => (count += records.length)).observe(el, {
        attributeFilter: ['style'],
      });
      for (let i = 0; i < 10; i++) {
        dispatchEvent(
          new PointerEvent('pointermove', { clientX: i * 10, clientY: 100, pointerType: 'mouse' }),
        );
        dispatchEvent(new Event('scroll'));
        await new Promise(requestAnimationFrame);
      }
      return count;
    });
    expect(writes).toBe(0);
    await context.close();
  });

  // A late observer callback can deliver "out" and "in" together. The last
  // entry is the state now; the first would leave the eyes asleep on screen.
  test('the eyes wake when the portrait leaves and returns before the observer runs', async () => {
    const { page, context, row, gaze } = await portrait();
    // In one frame: scroll away, queue a long task, and scroll back in the
    // next frame. The long task holds the observer callback until both
    // entries are in (Chromium delivers "out,in" together every time).
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => {
            scrollTo(0, document.body.scrollHeight);
            setTimeout(() => {
              const end = performance.now() + 150;
              while (performance.now() < end);
            }, 0);
            requestAnimationFrame(() => {
              scrollTo(0, 0);
              resolve();
            });
          }),
        ),
    );
    await page.waitForTimeout(300);
    await page.mouse.move(0, row);
    await expect.poll(gaze).toMatch(/^-0\.[5-9]/);
    await context.close();
  });
});

describe('article contents', () => {
  test('marks the section in view', async () => {
    const { page, context } = await open('/claude-code-tips/', 1440);
    const links = page.locator('.toc a');
    const current = (index: number) => links.nth(index).evaluate((link) => link.matches(':target-current'));
    const target = (await links.nth(2).getAttribute('href'))?.slice(1) ?? '';
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start' }), target);
    await expect.poll(() => current(2)).toBe(true);
    expect(await current(0)).toBe(false);
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
    expect(box?.y).toBeGreaterThanOrEqual(0);
    await page.keyboard.press('Enter');
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main');
    await context.close();
  });

  test('focused links show a visible outline', async () => {
    const { page, context } = await open('/');
    await page.locator('.header__nav a').first().focus();
    const outline = await page.evaluate(
      () => document.activeElement && getComputedStyle(document.activeElement).outlineStyle,
    );
    expect(outline).toBe('solid');
    await context.close();
  });
});

async function contrastOf(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) throw new Error(`No element matches ${sel}`);
    const canvas = document.createElement('canvas').getContext('2d');
    if (!canvas) throw new Error('The browser has no 2D canvas');
    const rgba = (color: string) => {
      canvas.clearRect(0, 0, 1, 1);
      canvas.fillStyle = color;
      canvas.fillRect(0, 0, 1, 1);
      return Array.from(canvas.getImageData(0, 0, 1, 1).data);
    };
    const rgb = (color: string) => rgba(color).slice(0, 3);
    // Text sits on the nearest opaque background: a plate, a signal plate, or the page.
    let surface: Element | null = el;
    while (surface && rgba(getComputedStyle(surface).backgroundColor)[3] < 255)
      surface = surface.parentElement;
    const background = getComputedStyle(surface ?? document.documentElement).backgroundColor;
    const lum = ([r, g, b]: number[]) =>
      [r, g, b]
        .map((v) => v / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const fg = lum(rgb(getComputedStyle(el).color));
    const bg = lum(rgb(background));
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
