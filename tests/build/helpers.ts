import fs from 'node:fs';
import path from 'node:path';
import { z } from 'astro/zod';
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
    return [route, parseHTML(read(file)).document];
  });

export const indexable = htmlPages.filter(([route]) => route !== '/404');

/** The built page at a route. Throws when dist/ has no such page. */
export function page(route: string): Document {
  const found = htmlPages.find(([candidate]) => candidate === route);
  if (!found) throw new Error(`dist/ has no page for ${route}`);
  return found[1];
}

/** An attribute that the element's selector guarantees. Throws when it is missing. */
export function attr(el: Element, name: string): string {
  const value = el.getAttribute(name);
  if (value === null) throw new Error(`<${el.tagName.toLowerCase()}> has no ${name} attribute`);
  return value;
}

/** One JSON-LD block, as src/lib/seo.ts writes it: a @graph of typed nodes. */
const jsonLdBlock = z.object({
  '@context': z.literal('https://schema.org'),
  '@graph': z.array(z.looseObject({ '@type': z.string() })),
});

/** Every JSON-LD block on the page, parsed. Throws when a block has another shape. */
export function jsonLd(doc: Document): z.infer<typeof jsonLdBlock>[] {
  return Array.from(doc.querySelectorAll('script[type="application/ld+json"]'), (script) =>
    jsonLdBlock.parse(JSON.parse(script.textContent ?? '')),
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
