import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vite-plus/test';
import { oklchToHex, tokenHex } from '../../src/lib/color';

const tokens = fs.readFileSync(path.resolve(__dirname, '../../src/styles/tokens.css'), 'utf8');

test('oklchToHex converts OKLCH to sRGB hex', () => {
  expect(oklchToHex('oklch(90.6% 0.005 85)')).toBe('#e1e0dc');
  expect(oklchToHex('oklch(71% 0.185 48)')).toBe('#fa761b');
  expect(oklchToHex('oklch(15% 0.01 50)')).toBe('#0f0a08');
  expect(oklchToHex('oklch(100% 0 0)')).toBe('#ffffff');
  expect(() => oklchToHex('#ffffff')).toThrow(/not an oklch/);
});

test('tokenHex reads the light-theme token the manifest and social cards use', () => {
  expect(tokenHex(tokens, 'bg')).toMatch(/^#[0-9a-f]{6}$/);
  expect(tokenHex(tokens, 'signal')).toMatch(/^#[0-9a-f]{6}$/);
  expect(tokenHex(tokens, 'on-signal')).toMatch(/^#[0-9a-f]{6}$/);
  expect(() => tokenHex(tokens, 'no-such-token')).toThrow(/no --no-such-token/);
});
