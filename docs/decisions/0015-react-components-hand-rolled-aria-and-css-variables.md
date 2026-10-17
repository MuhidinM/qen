# ADR-0015 · React components: hand-rolled ARIA patterns, CSS variables, Ladle

**Status:** accepted · 2026-10-18

## Context

`@qen/react` (M6) provides a month grid, date pickers and time inputs for three calendars, five locales, Ge'ez numerals and right-to-left Arabic. All calendar logic must stay in `@qen/core` (architecture rule). The components must be accessible by default (WCAG 2.2 AA, full keyboard use) and follow one design system (CLAUDE.md, Refactoring UI).

## Decision

- **Behaviour:** hand-rolled, following the WAI-ARIA Authoring Practices patterns (grid for the calendar, dialog for the picker, spinbutton/group for the time input). Runtime dependencies are only `@qen/core` and React 19 as a peer.
- **Styling:** plain CSS with the design tokens as CSS variables (#112), class names prefixed `qen-`, shipped as `@qen/react/styles.css`. No CSS-in-JS runtime. Apps theme by overriding variables.
- **Tests:** Vitest + jsdom + Testing Library (by role) + `@testing-library/user-event` for keyboard paths; axe-core run on every rendered state through a small helper (no wrapper package).
- **Explorer:** Ladle, with a story per component and state; `ladle build` runs in CI.
- **Lint:** `eslint-plugin-react-hooks` and `eslint-plugin-jsx-a11y` for `.tsx`.

Alternatives considered:

- React Aria Components: excellent accessibility, but its calendar runs on `@internationalized/date`, a second date engine beside `@qen/core`, and it adds a large dependency tree. Its patterns are still the reference for ours.
- Radix: no calendar/grid primitive; we would hand-roll the grid anyway.
- Tailwind or CSS modules: need consumer build setup; CSS variables work everywhere.
- Storybook: heavier and slower than Ladle for a small component set.

## Consequences

- We own keyboard and focus behaviour, so each component needs keyboard tests and axe checks in light and dark mode.
- Consumers import one CSS file; the components stay unstyled in function but styled in appearance.
