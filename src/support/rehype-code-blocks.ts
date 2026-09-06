type HastProperties = Record<string, unknown>;

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: HastProperties;
  data?: unknown;
  children?: HastNode[];
}

const languageNames: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  js: 'JavaScript',
  javascript: 'JavaScript',
  json: 'JSON',
  php: 'PHP',
  sh: 'Shell',
  shell: 'Shell',
  sql: 'SQL',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  yaml: 'YAML',
  yml: 'YAML',
};

interface CodeFilenameTransformerContext {
  options: {
    meta?: {
      __raw?: string;
    };
  };
}

interface CodeFilenameTransformer {
  name: string;
  pre: (
    this: CodeFilenameTransformerContext,
    node: { properties: HastProperties },
  ) => void;
}

function filenameFromMeta(meta: string | undefined): string | undefined {
  if (!meta) return undefined;
  const match = meta.match(/(?:^|\s)(?:filename|title)=(?:"([^"]+)"|'([^']+)'|([^\s]+))/i);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

/** Preserve an optional Markdown fence filename on Shiki's `<pre>` output. */
export const codeFilenameTransformer: CodeFilenameTransformer = {
  name: 'jewei-code-filename',
  pre(node) {
    const filename = filenameFromMeta(this.options.meta?.__raw);
    if (filename) node.properties.dataFilename = filename;
  },
};

function isWhitespace(node: HastNode): boolean {
  return node.type === 'text' && (node.value?.trim() ?? '') === '';
}

function imageIn(node: HastNode): HastNode | undefined {
  if (node.type === 'element' && node.tagName === 'img') return node;
  if (node.type !== 'element' || node.tagName !== 'a') return undefined;

  const children = node.children?.filter((child) => !isWhitespace(child)) ?? [];
  return children.length === 1 && children[0].type === 'element' && children[0].tagName === 'img'
    ? children[0]
    : undefined;
}

/**
 * Turn a standalone Markdown image with a title into a semantic figure. The
 * Markdown title becomes the visible caption; alt text keeps its own purpose.
 */
export function rehypeFigures() {
  return (tree: HastNode) => {
    function transform(node: HastNode): void {
      if (!node.children) return;

      node.children = node.children.map((child) => {
        if (child.type !== 'element' || child.tagName !== 'p') {
          transform(child);
          return child;
        }

        const visibleChildren = child.children?.filter((candidate) => !isWhitespace(candidate)) ?? [];
        if (visibleChildren.length !== 1) return child;

        const image = imageIn(visibleChildren[0]);
        const caption = stringProperty(image, ['title']);
        if (!image || !caption) return child;

        if (image.properties) delete image.properties.title;

        return element('figure', { className: ['article-figure'] }, [
          visibleChildren[0],
          element('figcaption', { className: ['article-figure__caption'] }, [text(caption)]),
        ]);
      });
    }

    transform(tree);
  };
}

function text(value: string): HastNode {
  return { type: 'text', value };
}

function element(
  tagName: string,
  properties: HastProperties,
  children: HastNode[],
): HastNode {
  return { type: 'element', tagName, properties, children };
}

function stringProperty(node: HastNode | undefined, names: string[]): string | undefined {
  if (!node) return undefined;
  const data =
    typeof node.data === 'object' && node.data !== null
      ? (node.data as Record<string, unknown>)
      : undefined;

  for (const name of names) {
    const value = node.properties?.[name] ?? data?.[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  return undefined;
}

function codeLanguage(pre: HastNode, code: HastNode | undefined): string {
  const explicit = stringProperty(pre, ['dataLanguage', 'data-language']);
  if (explicit) return explicit.toLowerCase();

  const classes = code?.properties?.className;
  const classNames = Array.isArray(classes) ? classes : typeof classes === 'string' ? [classes] : [];
  const languageClass = classNames.find(
    (className): className is string =>
      typeof className === 'string' && className.startsWith('language-'),
  );

  return languageClass?.slice('language-'.length).toLowerCase() ?? 'text';
}

function codeFilename(pre: HastNode, code: HastNode | undefined): string | undefined {
  const direct =
    stringProperty(pre, ['dataFilename', 'data-filename', 'dataTitle', 'data-title']) ??
    stringProperty(code, ['dataFilename', 'data-filename', 'dataTitle', 'data-title']);
  if (direct) return direct;

  const meta =
    stringProperty(pre, ['meta', 'dataMeta', 'data-meta']) ??
    stringProperty(code, ['meta', 'dataMeta', 'data-meta']);
  return filenameFromMeta(meta);
}

/**
 * Add a compact toolbar and a copy control to fenced Markdown code blocks.
 * A fence can use `title="path/to/file"` or `filename="path/to/file"`.
 */
export default function rehypeCodeBlocks() {
  return (tree: HastNode) => {
    let index = 0;

    function transform(node: HastNode): void {
      if (!node.children) return;

      node.children = node.children.map((child) => {
        if (child.type !== 'element' || child.tagName !== 'pre') {
          transform(child);
          return child;
        }

        const code = child.children?.find(
          (candidate) => candidate.type === 'element' && candidate.tagName === 'code',
        );
        const language = codeLanguage(child, code);
        const filename = codeFilename(child, code);
        const label = filename ?? languageNames[language] ?? language.toUpperCase();
        const labelId = `code-block-label-${++index}`;

        child.properties = {
          ...child.properties,
          'aria-labelledby': labelId,
          tabindex: 0,
        };

        return element(
          'div',
          {
            className: ['code-block'],
            dataCodeBlock: '',
            dataCodeLanguage: language,
            ...(filename ? { dataCodeFilename: filename } : {}),
          },
          [
            element('div', { className: ['code-block__toolbar'] }, [
              element(
                'span',
                {
                  className: ['code-block__label'],
                  id: labelId,
                  dataCodeTitle: '',
                },
                [text(label)],
              ),
              element(
                'button',
                {
                  type: 'button',
                  className: ['code-copy'],
                  dataCodeCopy: '',
                  dataCopyState: 'idle',
                  ariaLabel: `Copy ${label} code`,
                  ariaLive: 'polite',
                  ariaAtomic: 'true',
                },
                [
                  element('span', { dataCopyLabel: '' }, [text('Copy')]),
                ],
              ),
            ]),
            child,
          ],
        );
      });
    }

    transform(tree);
  };
}
