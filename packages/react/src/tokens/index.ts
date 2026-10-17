/**
 * The design system (CLAUDE.md, Refactoring UI): every spacing, size, colour, radius and
 * shadow the components use comes from here. Colours are HSL; light and dark themes map
 * semantic names onto the same palettes. Every text/background pair is checked for WCAG AA
 * in tests.
 */

const hsl = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

/** Cool greys: a little blue, more saturated at the light and dark ends. */
const grey = {
  50: hsl(210, 40, 98),
  100: hsl(210, 36, 96),
  200: hsl(212, 33, 89),
  300: hsl(210, 31, 80),
  400: hsl(211, 25, 65),
  500: hsl(211, 18, 49),
  600: hsl(209, 20, 38),
  700: hsl(209, 25, 29),
  800: hsl(210, 30, 20),
  900: hsl(212, 35, 12),
};

/** Primary blue; the hue rotates toward 240° as it darkens. */
const primary = {
  50: hsl(214, 100, 97),
  100: hsl(214, 95, 93),
  200: hsl(213, 94, 85),
  300: hsl(212, 92, 74),
  400: hsl(214, 88, 62),
  500: hsl(217, 85, 53),
  600: hsl(220, 80, 45),
  700: hsl(222, 75, 37),
  800: hsl(224, 70, 28),
  900: hsl(226, 70, 20),
};

/** Green: success, and Islamic holidays. */
const green = {
  50: hsl(145, 70, 96),
  100: hsl(145, 64, 90),
  300: hsl(145, 55, 65),
  500: hsl(152, 60, 38),
  700: hsl(155, 65, 26),
  900: hsl(158, 70, 15),
};

/** Amber: warnings, and Orthodox holidays; rotates toward orange as it darkens. */
const amber = {
  50: hsl(48, 100, 96),
  100: hsl(46, 96, 89),
  300: hsl(42, 92, 66),
  500: hsl(36, 92, 46),
  700: hsl(30, 85, 30),
  900: hsl(25, 80, 18),
};

/** Red: errors and destructive actions. */
const red = {
  50: hsl(0, 86, 97),
  100: hsl(0, 93, 94),
  300: hsl(0, 90, 76),
  500: hsl(0, 72, 51),
  700: hsl(356, 70, 36),
  900: hsl(352, 70, 22),
};

const white = hsl(0, 0, 100);

/**
 * Semantic colours for one theme. Components use only these names.
 *
 * @example
 * ```ts
 * const t: ThemeColors = tokens.theme.dark;
 * ```
 */
export interface ThemeColors {
  readonly background: string;
  readonly surface: string;
  readonly surfaceMuted: string;
  /** Decorative separators only; never the only cue. */
  readonly border: string;
  /** Borders that carry meaning (inputs, focusable outlines): 3:1 against the background. */
  readonly borderStrong: string;
  readonly text: string;
  readonly textMuted: string;
  readonly accent: string;
  readonly onAccent: string;
  readonly accentText: string;
  readonly accentTint: string;
  readonly focus: string;
  readonly dangerText: string;
  readonly holidayPublicText: string;
  readonly holidayPublicTint: string;
  readonly holidayOrthodoxText: string;
  readonly holidayOrthodoxTint: string;
  readonly holidayIslamicText: string;
  readonly holidayIslamicTint: string;
}

const light: ThemeColors = {
  background: white,
  surface: white,
  surfaceMuted: grey[50],
  border: grey[200],
  borderStrong: grey[500],
  text: grey[900],
  textMuted: grey[600],
  accent: primary[600],
  onAccent: white,
  accentText: primary[700],
  accentTint: primary[50],
  focus: primary[500],
  dangerText: red[700],
  holidayPublicText: primary[800],
  holidayPublicTint: primary[50],
  holidayOrthodoxText: amber[900],
  holidayOrthodoxTint: amber[50],
  holidayIslamicText: green[900],
  holidayIslamicTint: green[50],
};

const dark: ThemeColors = {
  background: grey[900],
  surface: grey[800],
  surfaceMuted: grey[800],
  border: grey[700],
  borderStrong: grey[400],
  text: grey[50],
  textMuted: grey[300],
  accent: primary[400],
  onAccent: grey[900],
  accentText: primary[300],
  accentTint: primary[900],
  focus: primary[400],
  dangerText: red[300],
  holidayPublicText: primary[100],
  holidayPublicTint: primary[900],
  holidayOrthodoxText: amber[100],
  holidayOrthodoxTint: amber[900],
  holidayIslamicText: green[100],
  holidayIslamicTint: green[900],
};

/**
 * All design tokens. Pick from these; never use an off-system value.
 *
 * @example
 * ```ts
 * tokens.space[4]; // 16
 * tokens.theme.light.text; // 'hsl(212 35% 12%)'
 * ```
 */
export const tokens = {
  /** Spacing scale in px (CLAUDE.md): 4 8 12 16 24 32 48 64 96 128. */
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 96, 10: 128 },
  /** Type scale in px (CLAUDE.md): 12 14 16 18 20 24 30 36 48. */
  fontSize: { 12: 12, 14: 14, 16: 16, 18: 18, 20: 20, 24: 24, 30: 30, 36: 36, 48: 48 },
  /** Two weights; nothing under 400. */
  fontWeight: { regular: 400, semibold: 600 },
  lineHeight: { tight: 1.25, normal: 1.5 },
  /** System fonts first, then fonts that cover Ge'ez (Ethiopic) and Arabic script. */
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Ethiopic', Nyala, 'Abyssinica SIL', 'Noto Sans Arabic', 'Segoe UI Historic', sans-serif",
  radius: { sm: 4, md: 6, lg: 8, full: 9999 },
  /** Five elevations; light from above, so shadows fall down. */
  shadow: [
    '0 1px 3px hsla(0, 0%, 0%, 0.2)',
    '0 4px 6px hsla(0, 0%, 0%, 0.2)',
    '0 5px 15px hsla(0, 0%, 0%, 0.2)',
    '0 10px 24px hsla(0, 0%, 0%, 0.2)',
    '0 15px 35px hsla(0, 0%, 0%, 0.2)',
  ],
  color: { grey, primary, green, amber, red },
  theme: { light, dark },
} as const;

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function themeVariables(t: ThemeColors, indent: string): string {
  return Object.entries(t)
    .map(([name, value]) => `${indent}--qen-color-${kebab(name)}: ${value};`)
    .join('\n');
}

/**
 * The tokens as CSS custom properties: scales and the light theme on `:root`, the dark theme
 * for `prefers-color-scheme: dark` (unless `data-theme="light"`) and for `data-theme="dark"`.
 * `@qen/react/styles.css` includes this.
 *
 * @example
 * ```ts
 * tokensToCss().includes('--qen-space-4: 16px;'); // true
 * ```
 */
export function tokensToCss(): string {
  const scale = [
    ...Object.entries(tokens.space).map(([k, v]) => `  --qen-space-${k}: ${v}px;`),
    ...Object.values(tokens.fontSize).map((v) => `  --qen-font-size-${v}: ${v}px;`),
    ...Object.entries(tokens.fontWeight).map(([k, v]) => `  --qen-font-weight-${k}: ${v};`),
    ...Object.entries(tokens.lineHeight).map(([k, v]) => `  --qen-line-height-${k}: ${v};`),
    `  --qen-font-family: ${tokens.fontFamily};`,
    ...Object.entries(tokens.radius).map(([k, v]) => `  --qen-radius-${k}: ${v}px;`),
    ...tokens.shadow.map((v, i) => `  --qen-shadow-${i + 1}: ${v};`),
  ];
  return [
    '/* Generated from src/tokens/index.ts. Do not edit; run UPDATE_TOKENS=1 vitest run test/tokens.test.ts. */',
    ':root {',
    ...scale,
    themeVariables(tokens.theme.light, '  '),
    '  color-scheme: light;',
    '}',
    '@media (prefers-color-scheme: dark) {',
    "  :root:not([data-theme='light']) {",
    themeVariables(tokens.theme.dark, '    '),
    '    color-scheme: dark;',
    '  }',
    '}',
    ":root[data-theme='dark'] {",
    themeVariables(tokens.theme.dark, '  '),
    '  color-scheme: dark;',
    '}',
    '',
  ].join('\n');
}
