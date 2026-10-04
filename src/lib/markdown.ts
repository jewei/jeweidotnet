/**
 * Rehype plugins for article Markdown. Wired up in astro.config.mjs.
 *
 * - codeFilename: keeps `title="file.ts"` from a code fence on Shiki's <pre>.
 * - rehypeFigures: a standalone image with a Markdown title becomes <figure>.
 * - rehypeTables: wraps tables in a focusable horizontal scroll region.
 * - rehypeCodeBlocks: wraps <pre> in a frame with a label and a copy button.
 * - rehypeHeadingAnchors: adds a "#" permalink to h2 and h3 headings.
 *
 * Elements marked `data-md-skip` are dropped from the Markdown copies
 * that scripts/build-markdown.ts writes for agents.
 */

interface Node {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
}

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

const text = (value: string): Node => ({ type: 'text', value });
const el = (tagName: string, properties: Record<string, unknown>, children: Node[] = []): Node => ({
  type: 'element',
  tagName,
  properties,
  children,
});
const isBlank = (node: Node) => node.type === 'text' && !(node.value ?? '').trim();

function textContent(node: Node): string {
  if (node.type === 'text') return node.value ?? '';
  return (node.children ?? []).map(textContent).join('');
}

/** Depth-first map over element children. Return a node to replace the child. */
function mapChildren(tree: Node, visit: (child: Node, parent: Node) => Node | undefined): void {
  const walk = (node: Node) => {
    if (!node.children) return;
    node.children = node.children.map((child) => {
      const replaced = visit(child, node);
      if (replaced) return replaced;
      walk(child);
      return child;
    });
  };
  walk(tree);
}

function fenceFilename(meta: unknown): string | undefined {
  if (typeof meta !== 'string') return undefined;
  const match = meta.match(/(?:^|\s)(?:filename|title)=(?:"([^"]+)"|'([^']+)'|(\S+))/i);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

/** Shiki transformer: copy the fence filename onto <pre data-filename>. */
export const codeFilename = {
  name: 'jewei:code-filename',
  pre(this: { options: { meta?: { __raw?: string } } }, node: { properties: Record<string, unknown> }) {
    const filename = fenceFilename(this.options.meta?.__raw);
    if (filename) node.properties['data-filename'] = filename;
  },
};

export function rehypeFigures() {
  return (tree: Node) =>
    mapChildren(tree, (child) => {
      if (child.tagName !== 'p') return undefined;
      const visible = (child.children ?? []).filter((node) => !isBlank(node));
      if (visible.length !== 1) return undefined;
      const only = visible[0];
      const img =
        only.tagName === 'img'
          ? only
          : only.tagName === 'a' && only.children?.filter((n) => !isBlank(n)).length === 1
            ? only.children.find((n) => n.tagName === 'img')
            : undefined;
      const caption = img?.properties?.title;
      if (!img || typeof caption !== 'string' || !caption.trim()) return undefined;
      delete img.properties!.title;
      return el('figure', {}, [only, el('figcaption', {}, [text(caption.trim())])]);
    });
}

export function rehypeTables() {
  return (tree: Node) =>
    mapChildren(tree, (child) =>
      child.tagName === 'table'
        ? el('div', { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: 'Table' }, [child])
        : undefined,
    );
}

export function rehypeCodeBlocks() {
  return (tree: Node) => {
    let index = 0;
    mapChildren(tree, (child) => {
      if (child.tagName !== 'pre') return undefined;
      const props = child.properties ?? {};
      const code = child.children?.find((node) => node.tagName === 'code');
      const classes = ([] as unknown[]).concat(code?.properties?.className ?? []);
      const fromClass = classes.find((c): c is string => typeof c === 'string' && c.startsWith('language-'));
      const language = String(props.dataLanguage ?? props['data-language'] ?? fromClass?.slice(9) ?? 'text').toLowerCase();
      const filename = (props['data-filename'] ?? props.dataFilename) as string | undefined;
      const label = filename ?? languageNames[language] ?? language.toUpperCase();
      const id = `code-${++index}`;

      child.properties = { ...props, tabIndex: 0, ariaLabelledby: id };
      return el('div', { className: ['code'], dataCode: '', dataLanguage: language, ...(filename ? { dataFilename: filename } : {}) }, [
        el('div', { className: ['code__bar'], dataMdSkip: '' }, [
          el('span', { className: ['code__label'], id }, [text(label)]),
          el('button', { type: 'button', className: ['code__copy'], dataCopy: '' }, [
            el('span', { dataCopyLabel: '', ariaLive: 'polite' }, [text('Copy')]),
            el('span', { className: ['sr-only'] }, [text(` ${label} code`)]),
          ]),
        ]),
        child,
      ]);
    });
  };
}

export function rehypeHeadingAnchors() {
  return (tree: Node) =>
    mapChildren(tree, (child) => {
      if ((child.tagName !== 'h2' && child.tagName !== 'h3') || typeof child.properties?.id !== 'string') return undefined;
      const id = child.properties.id;
      const label = textContent(child).trim();
      child.children = [
        ...(child.children ?? []),
        el('a', { className: ['anchor'], href: `#${id}`, ariaLabel: `Link to section: ${label}`, dataMdSkip: '' }, [text('#')]),
      ];
      return child;
    });
}
