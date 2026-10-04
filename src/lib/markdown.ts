/**
 * Rehype plugins for article Markdown. Wired up in astro.config.mjs.
 *
 * - codeFilename: keeps `title="file.ts"` from a code fence on Shiki's <pre>.
 * - rehypeFigures: a standalone image with a Markdown title becomes <figure>.
 * - rehypeTables: wraps tables in a focusable horizontal scroll region.
 * - rehypeCodeBlocks: wraps <pre> in a frame with a label and a copy button.
 * - rehypeHeadingAnchors: adds a "#" permalink to h2 and h3 headings.
 * - rehypeImageSizes: sizes Markdown images for the prose column.
 *
 * Elements marked `data-md-skip` are dropped from the Markdown copies
 * that scripts/build-markdown.ts writes for agents.
 */
import type { ShikiConfig } from '@astrojs/markdown-remark';
import type { Element, ElementContent, Properties, Root, Text } from 'hast';

type ShikiTransformer = NonNullable<ShikiConfig['transformers']>[number];

const languageNames: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  javascript: 'JavaScript',
  json: 'JSON',
  jsonc: 'JSON',
  md: 'Markdown',
  php: 'PHP',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  swift: 'Swift',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  yaml: 'YAML',
  yml: 'YAML',
  text: 'Text',
  plaintext: 'Text',
};

const text = (value: string): Text => ({ type: 'text', value });
const el = (tagName: string, properties: Properties, children: ElementContent[] = []): Element => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const isBlank = (node: ElementContent) => node.type === 'text' && !node.value.trim();

function textContent(node: ElementContent): string {
  if (node.type === 'text') return node.value;
  if (node.type === 'element') return node.children.map(textContent).join('');
  return '';
}

/** Depth-first map over elements. Return an element to replace the child. */
function mapElements(tree: Root, visit: (child: Element) => Element | undefined): void {
  const walk = (node: Root | Element) => {
    node.children.forEach((child, index) => {
      if (child.type !== 'element') return;
      const replaced = visit(child);
      if (replaced) node.children[index] = replaced;
      else walk(child);
    });
  };
  walk(tree);
}

function fenceFilename(meta: string | undefined): string | undefined {
  const match = meta?.match(/(?:^|\s)(?:filename|title)=(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

/** Shiki transformer: copy the fence filename onto <pre data-filename>. */
export const codeFilename = {
  name: 'jewei:code-filename',
  pre(node) {
    const filename = fenceFilename(this.options.meta?.__raw);
    if (filename) node.properties['data-filename'] = filename;
  },
} satisfies ShikiTransformer;

/**
 * Prose is at most --measure (40rem) wide, and at 45rem the page gutters leave
 * that much room. Without this, Astro sizes a Markdown image by its source
 * width, so a 1600px screenshot loads in full for a 640px column. Runs before
 * Astro's own image step, which keeps a `sizes` that is already set.
 */
const PROSE_IMAGE_SIZES = '(min-width: 45rem) 40rem, calc(100vw - 2.5rem)';

export function rehypeImageSizes() {
  return (tree: Root) =>
    mapElements(tree, (child) => {
      if (child.tagName === 'img' && !child.properties.sizes) child.properties.sizes = PROSE_IMAGE_SIZES;
      return undefined;
    });
}

/** The only child that is not blank text, or undefined when there are more or none. */
function soleChild(node: Element): ElementContent | undefined {
  const visible = node.children.filter((child) => !isBlank(child));
  return visible.length === 1 ? visible[0] : undefined;
}

export function rehypeFigures() {
  return (tree: Root) =>
    mapElements(tree, (child) => {
      if (child.tagName !== 'p') return undefined;
      const only = soleChild(child);
      if (only?.type !== 'element') return undefined;
      const inner = only.tagName === 'a' ? soleChild(only) : only;
      const img = inner?.type === 'element' && inner.tagName === 'img' ? inner : undefined;
      const caption = img?.properties.title;
      if (!img || typeof caption !== 'string' || !caption.trim()) return undefined;
      delete img.properties.title;
      return el('figure', {}, [only, el('figcaption', {}, [text(caption.trim())])]);
    });
}

export function rehypeTables() {
  return (tree: Root) =>
    mapElements(tree, (child) =>
      child.tagName === 'table'
        ? el('div', { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Table' }, [child])
        : undefined,
    );
}

/**
 * Light-theme token colours that fall below 7:1 on --bg-sunken, mapped to
 * darker values of the same hue. Applied to Shiki's inline style variables.
 */
const contrastFixes: Record<string, string> = {
  '--shiki-light:#66707B': '--shiki-light:#4B535D',
};

function fixTokenContrast(node: Element): void {
  const { style } = node.properties;
  if (typeof style === 'string') {
    let next = style;
    for (const [from, to] of Object.entries(contrastFixes)) next = next.split(from).join(to);
    node.properties.style = next;
  }
  for (const child of node.children) if (child.type === 'element') fixTokenContrast(child);
}

export function rehypeCodeBlocks() {
  return (tree: Root) => {
    let index = 0;
    mapElements(tree, (child) => {
      if (child.tagName !== 'pre') return undefined;
      const props = child.properties;
      const code = child.children.find((node) => node.type === 'element' && node.tagName === 'code');
      const className = code?.type === 'element' ? code.properties.className : undefined;
      const classes = (Array.isArray(className) ? className : [className]).filter(
        (c) => typeof c === 'string',
      );
      const fromClass = classes.find((c) => c.startsWith('language-'));
      const declared = props.dataLanguage ?? props['data-language'];
      const language = (
        typeof declared === 'string' ? declared : (fromClass?.slice(9) ?? 'text')
      ).toLowerCase();
      const fenced = props['data-filename'] ?? props.dataFilename;
      const filename = typeof fenced === 'string' ? fenced : undefined;
      const label = filename ?? languageNames[language] ?? language.toUpperCase();
      const id = `code-${++index}`;

      child.properties = { ...props, tabIndex: 0, ariaLabelledby: id };
      fixTokenContrast(child);
      return el(
        'div',
        {
          className: ['code'],
          dataCode: '',
          dataLanguage: language,
          ...(filename ? { dataFilename: filename } : {}),
        },
        [
          el('div', { className: ['code__bar'], dataMdSkip: '' }, [
            el('span', { className: ['code__label'], id }, [text(label)]),
            el('button', { type: 'button', className: ['code__copy'], dataCopy: '' }, [
              el('span', { dataCopyLabel: '', ariaLive: 'polite' }, [text('Copy')]),
              el('span', { className: ['sr-only'] }, [text(` ${label} code`)]),
            ]),
          ]),
          child,
        ],
      );
    });
  };
}

export function rehypeHeadingAnchors() {
  return (tree: Root) =>
    mapElements(tree, (child) => {
      const { id } = child.properties;
      if ((child.tagName !== 'h2' && child.tagName !== 'h3') || typeof id !== 'string') return undefined;
      const label = textContent(child).trim();
      child.children = [
        ...child.children,
        el(
          'a',
          { className: ['anchor'], href: `#${id}`, ariaLabel: `Link to section: ${label}`, dataMdSkip: '' },
          [text('#')],
        ),
      ];
      return child;
    });
}
