/// <reference types="bun" />
/**
 * Screenshots for design review: `vp run shots` (after `vp run build`).
 *
 * Serves dist/ on a local port, then captures each route at each width in
 * light and dark themes into .shots/. Pass routes or widths to narrow it:
 *   vp run shots -- / /blog/ --widths=375,1440 --theme=dark --full
 *
 * Also reports horizontal overflow, which is always a bug.
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { findOverflow } from './overflow';

const root = path.resolve(import.meta.dir, '..');
const dist = path.join(root, 'dist');
const out = path.join(root, '.shots');

const args = process.argv.slice(2);
const flag = (name: string) => args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1];
const routes = args.filter((arg) => arg.startsWith('/'));
const widths = (flag('widths') ?? '375,768,1440').split(',').map(Number);
const themes = (flag('theme') ?? 'light,dark').split(',') as ('light' | 'dark')[];
const fullPage = args.includes('--full');

const defaultRoutes = [
  '/',
  '/blog/',
  '/blog/ai/',
  '/projects/',
  '/about/',
  '/resume/',
  '/collections/',
  '/contact/',
  '/database-primary-key/',
  '/claude-code-tips/',
  '/404.html',
];

const server = Bun.serve({
  port: 0,
  async fetch(request) {
    const { pathname } = new URL(request.url);
    const candidates = [pathname, path.join(pathname, 'index.html')];
    for (const candidate of candidates) {
      const file = Bun.file(path.join(dist, decodeURIComponent(candidate)));
      if ((await file.exists()) && !candidate.endsWith('/')) return new Response(file);
    }
    return new Response(Bun.file(path.join(dist, '404.html')), { status: 404 });
  },
});

fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
let overflow = 0;

for (const theme of themes) {
  const context = await browser.newContext({ colorScheme: theme, deviceScaleFactor: 1 });
  // Block third-party analytics in screenshots.
  await context.route(/umami|cloudflareinsights/, (route) => route.abort());
  const page = await context.newPage();
  for (const route of routes.length ? routes : defaultRoutes) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: width < 600 ? 812 : 900 });
      await page.goto(`http://localhost:${server.port}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const offender of await findOverflow(page)) {
        overflow++;
        console.warn(`overflow: ${route} @${width} (${theme}) ${offender}`);
      }
      const name = `${route.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home'}-${width}-${theme}.png`;
      await page.screenshot({ path: path.join(out, name), fullPage });
    }
  }
  await context.close();
}

await browser.close();
await server.stop();
console.log(`shots: wrote to ${path.relative(root, out)}/ (${overflow} overflow issues)`);
if (overflow) process.exitCode = 1;
