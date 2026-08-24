#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');

const requiredFiles = [
  'index.html',
  '404.html',
  'llms.txt',
  'rss.xml',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'robots.txt',
  'about/index.html',
  'about/index.md',
  'contact/index.html',
  'contact/index.md',
  'privacy/index.html',
  'privacy/index.md',
  'blog/index.html',
  'blog/index.md',
  'introducing-typeid-php/index.html',
];

const requiredSitemapUrls = [
  'https://jewei.net/',
  'https://jewei.net/about/',
  'https://jewei.net/contact/',
  'https://jewei.net/privacy/',
  'https://jewei.net/blog/',
  'https://jewei.net/introducing-typeid-php/',
];

function fail(message) {
  console.error(`smoke-test: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(dist)) {
  fail('dist/ not found — run build first');
}

for (const file of requiredFiles) {
  const full = path.join(dist, file);
  if (!fs.existsSync(full)) {
    fail(`missing ${file}`);
  }
}

const llms = fs.readFileSync(path.join(dist, 'llms.txt'), 'utf8');
if (!llms.includes('# jewei.toString()') || !llms.includes('## When to use this site')) {
  fail('llms.txt missing agent guidance');
}

const rss = fs.readFileSync(path.join(dist, 'rss.xml'), 'utf8');
if (!rss.includes('<rss') || !rss.includes('introducing-typeid-php')) {
  fail('rss.xml missing expected content');
}

const sitemap = fs.readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8');
for (const url of requiredSitemapUrls) {
  if (!sitemap.includes(url)) {
    fail(`sitemap missing ${url}`);
  }
}

if (!sitemap.includes('<lastmod>')) {
  fail('sitemap missing lastmod dates');
}

console.log('smoke-test: all checks passed');
