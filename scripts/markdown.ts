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

type El = HTMLElement;
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
    const parent = node.parentNode as El;
    const index = Array.prototype.indexOf.call(parent.children, node);
    const marker =
      parent.nodeName === 'OL'
        ? `${Number(parent.getAttribute('start') ?? 1) + index}. `
        : `${options.bulletListMarker} `;
    const body = content
      .replace(/^\n+/, '')
      .replace(/\n+$/, '\n')
      .replace(/\n/gm, `\n${' '.repeat(marker.length)}`);
    return `${marker}${body.trimEnd()}${node.nextSibling ? '\n' : ''}`;
  },
});

td.remove(['script', 'style', 'svg', 'button', 'noscript'] as (keyof HTMLElementTagNameMap)[]);

td.addRule('skip', {
  filter: (node) =>
    node.nodeType === 1 &&
    ((node as El).hasAttribute('data-md-skip') ||
      (node as El).hasAttribute('hidden') ||
      (node as El).getAttribute('aria-hidden') === 'true' ||
      (node as El).classList.contains('sr-only')),
  replacement: () => '',
});

td.addRule('post-row', {
  filter: (node) => node.nodeName === 'LI' && (node as El).hasAttribute('data-md-post'),
  replacement: (_content, node) => {
    const el = node as El;
    const link = el.querySelector('h2 a, h3 a, h4 a');
    const date = text(el.querySelector('time'));
    const summary = text(Array.from(el.querySelectorAll('p')).at(-1));
    const label = escapeLabel(text(link));
    return `\n- [${label}](${link?.getAttribute('href')}) — ${date}. ${summary}`;
  },
});

td.addRule('code-frame', {
  filter: (node) => node.nodeName === 'DIV' && (node as El).hasAttribute('data-code'),
  replacement: (_content, node) => {
    const el = node as El;
    const code = el.querySelector('pre code')?.textContent?.replace(/\n$/, '') ?? '';
    const fence = '`'.repeat(Math.max(3, ...Array.from(code.matchAll(/`+/g), (m) => m[0].length + 1)));
    const language = el.getAttribute('data-language') ?? '';
    const title = el.getAttribute('data-filename');
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
    const figcaption = (node as El).querySelector('figcaption');
    const caption = figcaption ? td.turndown(figcaption.innerHTML).replace(/\s+/g, ' ').trim() : '';
    return `\n\n${content.trim()}${caption ? `\n\n_${caption}_` : ''}\n\n`;
  },
});

td.addRule('figcaption', { filter: 'figcaption', replacement: () => '' });

td.addRule('image', {
  filter: 'img',
  replacement: (_content, node) => {
    const el = node as El;
    const alt = (el.getAttribute('alt') ?? '').replace(/[[\]]/g, '');
    return alt ? `![${alt}](${el.getAttribute('src')})` : '';
  },
});

td.addRule('definition-list', {
  filter: 'dl',
  replacement: (_content, node) => {
    const rows = Array.from((node as El).querySelectorAll('dt')).map((dt) => {
      const dd = dt.nextElementSibling;
      const items = dd ? Array.from((dd as El).querySelectorAll('li')) : [];
      const value = items.length
        ? items.map((li) => td.turndown((li as El).innerHTML).trim()).join(', ')
        : dd
          ? td
              .turndown((dd as El).innerHTML)
              .replace(/\n+/g, ' ')
              .trim()
          : '';
      return `- **${text(dt)}:** ${value}`;
    });
    return `\n\n${rows.join('\n')}\n\n`;
  },
});

td.addRule('table', {
  filter: 'table',
  replacement: (_content, node) => {
    const rows = Array.from((node as El).querySelectorAll('tr')).map((row) =>
      Array.from(row.children).map((cell) =>
        td
          .turndown((cell as El).innerHTML)
          .replace(/\s*\n+\s*/g, '<br>')
          .replace(/\|/g, '\\|')
          .trim(),
      ),
    );
    if (!rows.length) return '';
    const width = Math.max(...rows.map((row) => row.length));
    const line = (cells: string[]) =>
      `| ${[...cells, ...Array(width - cells.length).fill('')].join(' | ')} |`;
    return `\n\n${line(rows[0])}\n${line(Array(width).fill('---'))}\n${rows.slice(1).map(line).join('\n')}\n\n`;
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
  if (!h1 || h1.index === 0) return markdown;
  const rest = (markdown.slice(0, h1.index) + markdown.slice(h1.index! + h1[0].length)).trim();
  return collapseBlankLines(`${h1[0]}\n\n${rest}`);
}
