/// <reference types="bun" />
/**
 * Writes a Markdown copy next to every built page: dist/<path>/index.md.
 * Agents fetch these directly or through `Accept: text/markdown`
 * (functions/_middleware.js). The source is the page's <main>; the
 * conversion rules live in scripts/markdown.ts.
 *
 * Run by `vp run build` after `astro build`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { htmlToMarkdown } from './markdown';

const dist = path.resolve(import.meta.dir, '..', 'dist');
if (!fs.existsSync(dist)) {
  console.error('build-markdown: dist/ not found. Run astro build first.');
  process.exit(1);
}

function pages(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return pages(file);
    return entry.name === 'index.html' ? [file] : [];
  });
}

let written = 0;
let failed = 0;
for (const file of pages(dist)) {
  const relative = path.relative(dist, file);
  const html = fs.readFileSync(file, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!main) {
    console.error(`build-markdown: no <main> in ${relative}`);
    failed++;
    continue;
  }

  const markdown = htmlToMarkdown(main);

  if (!/^# /m.test(markdown)) {
    console.error(`build-markdown: no H1 in ${relative}`);
    failed++;
    continue;
  }

  const source = canonical ? `\n\n---\n\nCanonical: ${canonical}\n` : '\n';
  fs.writeFileSync(file.replace(/index\.html$/, 'index.md'), `${markdown}${source}`);
  written++;
}

if (failed) process.exit(1);
console.log(`build-markdown: wrote ${written} Markdown pages`);
