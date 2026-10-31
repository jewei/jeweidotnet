import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vite-plus/test';
import { oklchToHex, tokenHex } from '../../src/lib/color';

const tokens = fs.readFileSync(path.resolve(__dirname, '../../src/styles/tokens.css'), 'utf8');

/** WCAG contrast of two hex colours. */
function contrast(a: string, b: string): number {
  const lum = (hex: string) =>
    [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test('oklchToHex converts OKLCH to sRGB hex', () => {
  expect(oklchToHex('oklch(90.6% 0.005 85)')).toBe('#e1e0dc');
  expect(oklchToHex('oklch(71% 0.185 48)')).toBe('#fa761b');
  expect(oklchToHex('oklch(15% 0.01 50)')).toBe('#0f0a08');
  expect(oklchToHex('oklch(100% 0 0)')).toBe('#ffffff');
  expect(() => oklchToHex('#ffffff')).toThrow(/not an oklch/);
});

test('tokenHex reads the token itself: not a comment, not a longer name', () => {
  const css = `/* --signal: oklch(10% 0 0); */
    :root { --card--signal: oklch(20% 0 0); --on-signal: oklch(30% 0 0); --signal: oklch(71% 0.185 48); }`;
  expect(tokenHex(css, 'signal')).toBe('#fa761b');
  expect(tokenHex(css, 'on-signal')).toBe(oklchToHex('oklch(30% 0 0)'));
  expect(() => tokenHex(css, 'no-such-token')).toThrow(/no --no-such-token/);
});

test('the signal and its ink reach 7:1, as the social cards need', () => {
  expect(contrast(tokenHex(tokens, 'signal'), tokenHex(tokens, 'on-signal'))).toBeGreaterThanOrEqual(7);
});
