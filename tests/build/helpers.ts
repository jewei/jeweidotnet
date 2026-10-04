import fs from 'node:fs';
import path from 'node:path';
import { parseHTML } from 'linkedom';

export const root = path.resolve(__dirname, '../..');
export const dist = path.join(root, 'dist');

if (!fs.existsSync(path.join(dist, 'index.html'))) {
  throw new Error('dist/ is missing. Run `vp run build` first (or `vp run test:build`).');
}

export const read = (file: string) => fs.readFileSync(path.join(dist, file), 'utf8');
export const exists = (file: string) => fs.existsSync(path.join(dist, file));

/** Every built HTML page as [route, document]. */
export const htmlPages: [string, Document][] = fs
  .readdirSync(dist, { recursive: true, encoding: 'utf8' })
  .filter((file) => file.endsWith('.html'))
  .sort()
  .map((file) => {
    const route = file === '404.html' ? '/404' : `/${file.replace(/index\.html$/, '')}`;
    return [route, parseHTML(read(file)).document as unknown as Document];
  });

export const indexable = htmlPages.filter(([route]) => route !== '/404');

export function jsonLd(doc: Document): Record<string, unknown>[] {
  return Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map((script) =>
    JSON.parse(script.textContent ?? ''),
  );
}

/** Resolve a root-relative URL to a file in dist/, or undefined. */
export function resolveLocal(href: string): string | undefined {
  const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
  const candidates = pathname.endsWith('/')
    ? [`${pathname}index.html`]
    : [pathname, `${pathname}/index.html`];
  return candidates.find((candidate) => exists(candidate));
}
