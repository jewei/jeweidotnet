import { expect, test } from 'vite-plus/test';
import { oklchToHex } from '../../src/lib/color';

test('oklchToHex converts the tokens the manifest and social cards use', () => {
  expect(oklchToHex('oklch(90.6% 0.005 85)')).toBe('#e1e0dc'); // light --bg
  expect(oklchToHex('oklch(71% 0.185 48)')).toBe('#fa761b'); // --signal
  expect(oklchToHex('oklch(15% 0.01 50)')).toBe('#0f0a08'); // --on-signal
  expect(oklchToHex('oklch(100% 0 0)')).toBe('#ffffff');
});

test('oklchToHex rejects a colour that is not oklch()', () => {
  expect(() => oklchToHex('#ffffff')).toThrow(/not an oklch/);
});
