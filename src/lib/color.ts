/**
 * Colours for the places that cannot use a CSS custom property: the web app
 * manifest and the social cards (Satori). Both read tokens.css, so the
 * tokens stay the one source.
 */

/**
 * A token's light-theme value (its first definition in tokens.css), as hex.
 * Comments are skipped, and the name must match whole: `--signal` is not
 * `--on-signal` or `--card--signal`.
 */
export function tokenHex(css: string, name: string): string {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const value = new RegExp(`(?:^|[\\s{;])--${name}\\s*:\\s*([^;]+);`).exec(source)?.[1];
  if (!value) throw new Error(`color.ts: no --${name} in tokens.css`);
  return oklchToHex(value);
}

/** OKLCH, as written in tokens.css, to an sRGB hex colour. */
export function oklchToHex(value: string): string {
  const match = /oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/.exec(value);
  if (!match) throw new Error(`color.ts: not an oklch() colour: ${value}`);
  const [, lightness = '', chroma = '', hue = ''] = match;
  const L = Number(lightness) / 100;
  const angle = (Number(hue) * Math.PI) / 180;
  const a = Number(chroma) * Math.cos(angle);
  const b = Number(chroma) * Math.sin(angle);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  const channel = (value: number) => {
    const c = Math.min(1, Math.max(0, value));
    const encoded = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(encoded * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${linear.map(channel).join('')}`;
}
