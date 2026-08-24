#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  console.error('generate-markdown: dist/ not found; run Astro first');
  process.exit(1);
}

const turndown = new TurndownService({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  headingStyle: 'atx',
});

turndown.remove(['button', 'script', 'style', 'svg', 'noscript']);
turndown.addRule('hidden-content', {
  filter(node) {
    return node.nodeType === 1 && (
      node.hasAttribute('hidden') ||
      node.getAttribute('aria-hidden') === 'true' ||
      node.classList.contains('sr-only')
    );
  },
  replacement() {
    return '';
  },
});

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(file);
    if (entry.name === '404.html' || entry.name !== 'index.html') return [];
    return [file];
  });
}

let generated = 0;
for (const htmlFile of htmlFiles(dist)) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1];
  if (!main) {
    console.error(`generate-markdown: no <main> in ${path.relative(dist, htmlFile)}`);
    process.exitCode = 1;
    continue;
  }

  const markdown = turndown
    .turndown(main)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!/^# /m.test(markdown)) {
    console.error(`generate-markdown: no H1 in ${path.relative(dist, htmlFile)}`);
    process.exitCode = 1;
    continue;
  }

  fs.writeFileSync(htmlFile.replace(/index\.html$/, 'index.md'), `${markdown}\n`);
  generated++;
}

if (!process.exitCode) console.log(`generate-markdown: wrote ${generated} Markdown pages`);
