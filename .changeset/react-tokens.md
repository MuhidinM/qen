---
'@qen/react': minor
---

Add the design tokens (`tokens`, `tokensToCss`): the CLAUDE.md spacing and type scales, two weights, radii, five shadows, HSL palettes (10 greys, 10 blues, green, amber, red) and light/dark semantic colours checked for WCAG AA. `@qen/react/styles.css` now includes them as CSS variables; dark mode follows `prefers-color-scheme` or `data-theme`.
