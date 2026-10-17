import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { tokens, tokensToCss } from '../src/index.js';

/** WCAG relative luminance of an `hsl(h s% l%)` string. */
function luminance(hsl: string): number {
  const m = /hsl\((\d+(?:\.\d+)?) (\d+(?:\.\d+)?)% (\d+(?:\.\d+)?)%\)/.exec(hsl);
  if (!m) throw new Error(`Not an hsl() colour: ${hsl}`);
  const [h, s, l] = [Number(m[1]), Number(m[2]) / 100, Number(m[3]) / 100];
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
  };
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(f(0)) + 0.7152 * lin(f(8)) + 0.0722 * lin(f(4));
}
const contrast = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
};

describe('design tokens (CLAUDE.md, Refactoring UI)', () => {
  it('uses exactly the CLAUDE.md spacing and type scales', () => {
    expect(Object.values(tokens.space)).toEqual([4, 8, 12, 16, 24, 32, 48, 64, 96, 128]);
    expect(Object.values(tokens.fontSize)).toEqual([12, 14, 16, 18, 20, 24, 30, 36, 48]);
    expect(Object.values(tokens.fontWeight)).toEqual([400, 600]);
    expect(tokens.shadow).toHaveLength(5);
  });

  it('has 10 greys, 10 primary shades and at least 5 shades per semantic hue, all in HSL', () => {
    expect(Object.keys(tokens.color.grey)).toHaveLength(10);
    expect(Object.keys(tokens.color.primary)).toHaveLength(10);
    for (const hue of ['green', 'amber', 'red'] as const) {
      expect(Object.keys(tokens.color[hue]).length).toBeGreaterThanOrEqual(5);
    }
    for (const palette of Object.values(tokens.color)) {
      for (const value of Object.values(palette)) expect(value).toMatch(/^hsl\(\d+ \d+% \d+%\)$/);
    }
  });

  it('makes greys get lighter from 900 to 50', () => {
    const greys = Object.entries(tokens.color.grey).sort(([a], [b]) => Number(b) - Number(a));
    const l = greys.map(([, v]) => luminance(v));
    expect(l).toEqual([...l].sort((a, b) => a - b));
  });

  describe.each(['light', 'dark'] as const)('%s theme', (theme) => {
    const t = tokens.theme[theme];
    // Normal text needs 4.5:1; large text, focus rings and markers (non-text) need 3:1.
    it.each([
      ['text on background', t.text, t.background, 4.5],
      ['text on surface', t.text, t.surface, 4.5],
      ['muted text on background', t.textMuted, t.background, 4.5],
      ['muted text on surface', t.textMuted, t.surface, 4.5],
      ['muted text on muted surface', t.textMuted, t.surfaceMuted, 4.5],
      ['accent text on background', t.accentText, t.background, 4.5],
      ['text on accent (buttons, selected day)', t.onAccent, t.accent, 4.5],
      ['public holiday text on its tint', t.holidayPublicText, t.holidayPublicTint, 4.5],
      ['Orthodox holiday text on its tint', t.holidayOrthodoxText, t.holidayOrthodoxTint, 4.5],
      ['Islamic holiday text on its tint', t.holidayIslamicText, t.holidayIslamicTint, 4.5],
      ['danger text on background', t.dangerText, t.background, 4.5],
      ['focus ring against background', t.focus, t.background, 3],
      ['border of inputs against background', t.borderStrong, t.background, 3],
    ])('%s ≥ %3$s… meets WCAG AA', (_, fg, bg, min) => {
      expect(contrast(fg, bg)).toBeGreaterThanOrEqual(min);
    });
  });
});

describe('tokens.css', () => {
  it('is generated from the tokens (UPDATE_TOKENS=1 rewrites it)', () => {
    // jsdom replaces the global URL, so build a plain path for node:fs.
    const file = join(dirname(fileURLToPath(import.meta.url)), '../src/tokens.css');
    const css = tokensToCss();
    if (process.env.UPDATE_TOKENS === '1' || !existsSync(file)) writeFileSync(file, css);
    expect(readFileSync(file, 'utf8')).toBe(css);
  });

  it('defines light variables on :root and dark ones for prefers-color-scheme and data-theme', () => {
    const css = tokensToCss();
    expect(css).toContain(':root {');
    expect(css).toContain('--qen-space-4: 16px;');
    expect(css).toContain('--qen-font-size-16: 16px;');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(":root:not([data-theme='light'])");
    expect(css).toContain(":root[data-theme='dark']");
    expect(css).toMatch(/--qen-color-text: hsl\(/);
  });
});
