/**
 * HTML to Markdown for the Markdown copy of each page (scripts/build-markdown.ts).
 *
 * Rules are attribute-based, not class-based:
 *   [data-md-skip]   drop the element (permalinks, copy buttons, TOC)
 *   [data-md-post]   one ledger row → "- [Title](url) — date. Summary"
 *   [data-code]      code frame → fenced block with language and title
 *   aria-hidden, .sr-only, svg, button, script, style → dropped
 */
import TurndownService from 'turndown';

const text = (node: Element | null | undefined) =>
  (node?.textContent ?? '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const escapeLabel = (value: string) => value.replace(/([\\[\]])/g, '\\$1');

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
  strongDelimiter: '**',
});

// "- item", not turndown's default "-   item".
td.addRule('list-item', {
  filter: 'li',
  replacement: (content, node, options) => {
    const parent = node.parentElement;
    const index = parent ? Array.from(parent.children).indexOf(node) : 0;
    const marker =
      parent?.nodeName === 'OL'
        ? `${Number(parent.getAttribute('start') ?? 1) + index}. `
        : `${options.bulletListMarker} `;
    const body = content
      .replace(/^\n+/, '')
      .replace(/\n+$/, '\n')
      .replace(/\n/gm, `\n${' '.repeat(marker.length)}`);
    return `${marker}${body.trimEnd()}${node.nextSibling ? '\n' : ''}`;
  },
});

// A filter, not a tag list: svg is not an HTML tag name, so a list would need a cast.
const dropped = new Set(['script', 'style', 'svg', 'button', 'noscript']);
td.remove((node) => dropped.has(node.nodeName.toLowerCase()));

td.addRule('skip', {
  filter: (node) =>
    node.nodeType === 1 &&
    (node.hasAttribute('data-md-skip') ||
      node.hasAttribute('hidden') ||
      node.getAttribute('aria-hidden') === 'true' ||
      node.classList.contains('sr-only')),
  replacement: () => '',
});

td.addRule('post-row', {
  filter: (node) => node.nodeName === 'LI' && node.hasAttribute('data-md-post'),
  replacement: (_content, node) => {
    const link = node.querySelector('h2 a, h3 a, h4 a');
    const date = text(node.querySelector('time'));
    const summary = text(Array.from(node.querySelectorAll('p')).at(-1));
    const label = escapeLabel(text(link));
    return `\n- [${label}](${link?.getAttribute('href')}) — ${date}. ${summary}`;
  },
});

td.addRule('code-frame', {
  filter: (node) => node.nodeName === 'DIV' && node.hasAttribute('data-code'),
  replacement: (_content, node) => {
    const code = node.querySelector('pre code')?.textContent?.replace(/\n$/, '') ?? '';
    const fence = '`'.repeat(Math.max(3, ...Array.from(code.matchAll(/`+/g), (m) => m[0].length + 1)));
    const language = node.getAttribute('data-language') ?? '';
    const title = node.getAttribute('data-filename');
    const info = `${language === 'text' ? '' : language}${title ? ` title="${title.replace(/"/g, '\\"')}"` : ''}`;
    return `\n\n${fence}${info}\n${code}\n${fence}\n\n`;
  },
});

// The figure renders its caption after the media, so figcaption itself adds
// nothing. The caption is converted, not copied as text: Turndown escapes
// Markdown characters, and inline code in a caption must stay code.
td.addRule('figure', {
  filter: 'figure',
  replacement: (content, node) => {
    const figcaption = node.querySelector('figcaption');
    const caption = figcaption ? td.turndown(figcaption.innerHTML).replace(/\s+/g, ' ').trim() : '';
    return `\n\n${content.trim()}${caption ? `\n\n_${caption}_` : ''}\n\n`;
  },
});

td.addRule('figcaption', { filter: 'figcaption', replacement: () => '' });

td.addRule('image', {
  filter: 'img',
  replacement: (_content, node) => {
    const alt = (node.getAttribute('alt') ?? '').replace(/[[\]]/g, '');
    return alt ? `![${alt}](${node.getAttribute('src')})` : '';
  },
});

td.addRule('definition-list', {
  filter: 'dl',
  replacement: (_content, node) => {
    const rows = Array.from(node.querySelectorAll('dt')).map((dt) => {
      const dd = dt.nextElementSibling;
      const items = dd ? Array.from(dd.querySelectorAll('li')) : [];
      const value = items.length
        ? items.map((li) => td.turndown(li.innerHTML).trim()).join(', ')
        : dd
          ? td.turndown(dd.innerHTML).replace(/\n+/g, ' ').trim()
          : '';
      return `- **${text(dt)}:** ${value}`;
    });
    return `\n\n${rows.join('\n')}\n\n`;
  },
});

td.addRule('table', {
  filter: 'table',
  replacement: (_content, node) => {
    const rows = Array.from(node.querySelectorAll('tr')).map((row) =>
      Array.from(row.children).map((cell) =>
        td
          .turndown(cell.innerHTML)
          .replace(/\s*\n+\s*/g, '<br>')
          .replace(/\|/g, '\\|')
          .trim(),
      ),
    );
    const [head, ...body] = rows;
    if (!head) return '';
    const width = Math.max(...rows.map((row) => row.length));
    const line = (cells: string[]) =>
      `| ${[...cells, ...Array<string>(width - cells.length).fill('')].join(' | ')} |`;
    return `\n\n${line(head)}\n${line(Array<string>(width).fill('---'))}\n${body.map(line).join('\n')}\n\n`;
  },
});

/** One blank line between blocks. Fenced code keeps its blank lines. */
const collapseBlankLines = (markdown: string) =>
  markdown.replace(/^([ \t]*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\1\2[ \t]*$|\n{3,}/gm, (match, indent) =>
    indent === undefined ? '\n\n' : match,
  );

/** The Markdown for a page's <main> HTML, with the H1 first. */
export function htmlToMarkdown(main: string): string {
  const markdown = collapseBlankLines(td.turndown(main).replace(/[ \t]+\]\(/g, '](')).trim();

  // Eyebrow labels sit above the H1 visually; agents get the H1 first.
  const h1 = markdown.match(/^# .*$/m);
  if (!h1?.index) return markdown;
  const rest = (markdown.slice(0, h1.index) + markdown.slice(h1.index + h1[0].length)).trim();
  return collapseBlankLines(`${h1[0]}\n\n${rest}`);
}
