/**
 * Build-time social cards (1200×630 PNG) for pages and posts that have no
 * custom image. Rendered with Satori (JSX-like tree → SVG) and Sharp (→ PNG).
 * The card design follows docs/DESIGN.md: paper, ink, one green signal.
 */
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

export interface Card {
  /** Small label at the top, for example "№ 012 · Writing". */
  eyebrow: string;
  title: string;
  /** One or two lines under the title. */
  subtitle?: string;
}

const fontDir = (pkg: string) => path.resolve('node_modules', '@fontsource', pkg, 'files');
const font = (pkg: string, file: string) => fs.readFileSync(path.join(fontDir(pkg), file));

let fonts: Parameters<typeof satori>[1]['fonts'] | undefined;
function loadFonts() {
  fonts ??= [
    { name: 'Geist', data: font('geist', 'geist-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Geist', data: font('geist', 'geist-latin-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'Serif', data: font('source-serif-4', 'source-serif-4-latin-400-normal.woff'), weight: 400, style: 'normal' },
  ];
  return fonts;
}

const color = {
  bg: '#fbfaf7',
  fg: '#16181d',
  fg2: '#3f434b',
  fg3: '#5b5f67',
  line: '#e2e0da',
  accent: '#1f7a45',
  mark: '#2fa25e',
};

type Child = string | VNode;
interface VNode {
  type: string;
  props: { style?: Record<string, unknown>; children?: Child | Child[] };
}
const h = (type: string, style: Record<string, unknown>, children?: Child | Child[]): VNode => ({
  type,
  props: { style, children },
});

function titleSize(title: string): number {
  if (title.length <= 28) return 84;
  if (title.length <= 48) return 72;
  if (title.length <= 70) return 60;
  return 52;
}

/** Shorten at a word boundary so the subtitle never stops mid-sentence. */
function clamp(text: string, max = 118): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\s—-]+$/, '')}…`;
}

export async function renderCard(card: Card): Promise<Buffer> {
  const tree = h(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '64px 72px',
      background: color.bg,
      fontFamily: 'Geist',
      color: color.fg,
    },
    [
      h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 26 }, [
        h('div', { display: 'flex' }, [
          h('span', { fontWeight: 600 }, 'jewei'),
          h('span', { color: color.fg3 }, '.toString'),
          h('span', { color: color.accent }, '()'),
        ]),
        h('div', { display: 'flex', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: color.fg3 }, card.eyebrow.replace('№', 'No.')),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 28 }, [
        h(
          'div',
          {
            display: 'flex',
            fontSize: titleSize(card.title),
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: -2.4,
            maxWidth: 1000,
          },
          card.title,
        ),
        ...(card.subtitle
          ? [
              h(
                'div',
                {
                  display: 'flex',
                  fontFamily: 'Serif',
                  fontSize: 32,
                  lineHeight: 1.35,
                  color: color.fg2,
                  maxWidth: 960,
                  maxHeight: 88,
                  overflow: 'hidden',
                },
                clamp(card.subtitle),
              ),
            ]
          : []),
      ]),
      h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, color: color.fg3 }, [
        h('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
          h('div', { width: 56, height: 8, background: color.mark, borderRadius: 4 }),
          h('span', {}, 'Jewei Mak'),
        ]),
        h('span', {}, 'jewei.net'),
      ]),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: loadFonts(),
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}
