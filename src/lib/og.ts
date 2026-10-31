/**
 * Build-time social cards (1200×630 PNG) for pages and posts that have no
 * custom image. Rendered with Satori (JSX-like tree → SVG) and Sharp (→ PNG).
 * The card design follows docs/DESIGN.md: a signal-orange plate with ink text,
 * like the head of an article. The eyebrow and title are in the wide display
 * face (Zalando Sans Expanded); the wordmark and subtitle are in Geist.
 * Colours are hex copies of --signal and --on-signal (Satori cannot read CSS
 * custom properties); ink on signal is 7.2:1.
 */
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { displayUrl, site } from '../site.config';

export interface Card {
  /** Small label at the top, for example "No. 012 · Writing". Satori cannot draw "№". */
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
    {
      name: 'Display',
      data: font('zalando-sans-expanded', 'zalando-sans-expanded-latin-700-normal.woff'),
      weight: 700,
      style: 'normal',
    },
    {
      name: 'Display',
      data: font('zalando-sans-expanded', 'zalando-sans-expanded-latin-800-normal.woff'),
      weight: 800,
      style: 'normal',
    },
  ];
  return fonts;
}

const color = {
  bg: '#fa761b',
  fg: '#0f0a08',
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

/** The wide face takes about a third more width than Geist, so the steps are smaller. */
function titleSize(title: string): number {
  if (title.length <= 20) return 80;
  if (title.length <= 36) return 64;
  if (title.length <= 54) return 54;
  return 46;
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
      boxSizing: 'border-box',
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
          h('span', {}, '.toString'),
          h('span', { fontWeight: 600 }, '()'),
        ]),
        h(
          'div',
          {
            display: 'flex',
            fontFamily: 'Display',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2.4,
            textTransform: 'uppercase',
          },
          card.eyebrow.replace('№', 'No.'),
        ),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 28 }, [
        h(
          'div',
          {
            display: 'flex',
            fontFamily: 'Display',
            fontSize: titleSize(card.title),
            fontWeight: 800,
            lineHeight: 1.04,
            // --tracking-display: -0.045em
            letterSpacing: titleSize(card.title) * -0.045,
            maxWidth: 1056,
          },
          card.title,
        ),
        ...(card.subtitle
          ? [
              h(
                'div',
                {
                  display: 'flex',
                  fontSize: 30,
                  lineHeight: 1.4,
                  maxWidth: 960,
                  maxHeight: 84,
                  overflow: 'hidden',
                },
                clamp(card.subtitle),
              ),
            ]
          : []),
      ]),
      h(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 24,
        },
        [
          h('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
            h('div', { width: 56, height: 8, background: color.fg, borderRadius: 4 }),
            h('span', {}, site.author),
          ]),
          h('span', {}, displayUrl(site.url)),
        ],
      ),
    ],
  );

  const svg = await satori(tree, {
    width: 1200,
    height: 630,
    fonts: loadFonts(),
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}
