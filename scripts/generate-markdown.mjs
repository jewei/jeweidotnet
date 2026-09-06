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

function hasClass(node, className) {
  return node.nodeType === 1 && node.classList.contains(className);
}

function hasParentClass(node, classNames) {
  return node.parentElement && classNames.some((className) => hasClass(node.parentElement, className));
}

function isHidden(node) {
  return node.nodeType === 1 && (
    node.hasAttribute('hidden') ||
    node.getAttribute('aria-hidden') === 'true' ||
    node.classList.contains('sr-only')
  );
}

function plainText(node) {
  return (node?.textContent ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapeLinkLabel(value) {
  return value.replace(/([\\\[\]])/g, '\\$1');
}

function markdownLink(content, node) {
  const label = content.trim();
  const href = node.getAttribute('href');
  const title = node.getAttribute('title');
  if (!href) return label;

  const suffix = title ? ` "${title.replace(/"/g, '\\"')}"` : '';
  return `[${label}](${href}${suffix})`;
}

function hasFollowingContent(node) {
  let sibling = node.nextSibling;
  while (sibling) {
    if (sibling.nodeType === 3 && plainText(sibling)) return true;
    if (sibling.nodeType === 1 && !isHidden(sibling) && plainText(sibling)) return true;
    sibling = sibling.nextSibling;
  }
  return false;
}

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

turndown.addRule('desktop-article-toc', {
  filter(node) {
    return node.nodeType === 1 && node.classList.contains('article-toc--rail');
  },
  replacement() {
    return '';
  },
});

turndown.addRule('definition-row', {
  filter(node) {
    if (node.nodeName !== 'DIV' || !node.parentElement) return false;
    return ['proof-strip', 'resume-facts', 'resume-role__meta'].some((className) =>
      hasClass(node.parentElement, className),
    );
  },
  replacement(_content, node) {
    const term = plainText(node.querySelector('dt'));
    const definition = plainText(node.querySelector('dd'));
    if (!term || !definition) return '';
    return `\n- **${term}:** ${definition}`;
  },
});

turndown.addRule('metadata-separator', {
  filter(node) {
    if (!['SPAN', 'TIME'].includes(node.nodeName) || isHidden(node)) return false;
    return hasParentClass(node, ['article-byline', 'project-card__meta']);
  },
  replacement(content, node) {
    const value = content.trim();
    if (!value) return '';
    return `${value}${hasFollowingContent(node) ? ' · ' : ''}`;
  },
});

turndown.addRule('topic-index-link', {
  filter(node) {
    return node.nodeName === 'A' && hasParentClass(node, ['topic-index']);
  },
  replacement(_content, node) {
    const labelNode = Array.from(node.children).find(
      (child) => !child.classList.contains('topic-index__count'),
    );
    const label = escapeLinkLabel(plainText(labelNode));
    const count = plainText(node.querySelector('.topic-index__count'));
    const link = markdownLink(label, node);
    return `${link}${count ? ` — ${count}` : ''}${hasFollowingContent(node) ? ' · ' : ''}`;
  },
});

turndown.addRule('link-row-separator', {
  filter(node) {
    if (node.nodeName !== 'A') return false;
    return hasParentClass(node, [
      'home-hero__actions',
      'not-found__actions',
      'project-card__links',
      'resume-actions',
      'topic-filter__links',
    ]);
  },
  replacement(content, node) {
    return `${markdownLink(content, node)}${hasFollowingContent(node) ? ' · ' : ''}`;
  },
});

turndown.addRule('related-writing-link', {
  filter(node) {
    return node.nodeName === 'A' && hasClass(node, 'related-writing__link');
  },
  replacement(_content, node) {
    const title = escapeLinkLabel(plainText(node.querySelector('.related-writing__title')));
    const date = plainText(node.querySelector('time'));
    const description = plainText(node.querySelector('.related-writing__description'));
    const link = markdownLink(title, node);
    const metadata = date ? ` — ${date}` : '';
    const summary = description ? `. ${description}` : '';
    return `${link}${metadata}${summary}`;
  },
});

turndown.addRule('article-pagination-link', {
  filter(node) {
    return node.nodeName === 'A' && hasClass(node, 'article-pagination__link');
  },
  replacement(_content, node) {
    const direction = hasClass(node, 'article-pagination__link--previous') ? 'Previous' : 'Next';
    const title = escapeLinkLabel(plainText(node.querySelector('.article-pagination__title')));
    return `\n\n**${direction}:** ${markdownLink(title, node)}\n\n`;
  },
});

turndown.addRule('code-block', {
  filter(node) {
    return node.nodeName === 'DIV' && hasClass(node, 'code-block');
  },
  replacement(_content, node) {
    const pre = node.querySelector('pre');
    const code = pre?.querySelector('code');
    if (!code) return '';

    const value = code.textContent.replace(/\n$/, '');
    const longestFence = Math.max(3, ...Array.from(value.matchAll(/`+/g), (match) => match[0].length + 1));
    const fence = '`'.repeat(longestFence);
    const language = node.getAttribute('data-code-language') || pre.getAttribute('data-language') || '';
    const filename = node.getAttribute('data-code-filename') || pre.getAttribute('data-filename') || '';
    const safeFilename = filename.replace(/"/g, '\\"');
    const info = `${language}${safeFilename ? ` title="${safeFilename}"` : ''}`;

    return `\n\n${fence}${info}\n${value}\n${fence}\n\n`;
  },
});

turndown.addRule('gfm-table', {
  filter: 'table',
  replacement(_content, node) {
    const rows = Array.from(node.querySelectorAll('tr')).filter((row) => {
      let parent = row.parentElement;
      while (parent && parent.nodeName !== 'TABLE') parent = parent.parentElement;
      return parent === node;
    });
    if (rows.length === 0) return '';

    const matrix = rows.map((row) =>
      Array.from(row.children)
        .filter((cell) => ['TH', 'TD'].includes(cell.nodeName))
        .map((cell) =>
          turndown
            .turndown(cell.innerHTML)
            .replace(/\s*\n+\s*/g, '<br>')
            .replace(/(?<!\\)\|/g, '\\|')
            .trim(),
        ),
    );
    const columnCount = Math.max(...matrix.map((row) => row.length));
    if (columnCount === 0) return '';

    const normalizedRows = matrix.map((row) => [
      ...row,
      ...Array.from({ length: columnCount - row.length }, () => ''),
    ]);
    const formatRow = (row) => `| ${row.join(' | ')} |`;
    const separator = formatRow(Array.from({ length: columnCount }, () => '---'));

    return `\n\n${formatRow(normalizedRows[0])}\n${separator}\n${normalizedRows
      .slice(1)
      .map(formatRow)
      .join('\n')}\n\n`;
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
    .replace(/[ \t]+\]\(/g, '](')
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
