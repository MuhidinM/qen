# ADR-0004 · `core` has zero runtime dependencies and no environment access

**Status:** accepted · 2026-10-13

## Context

`core` must run in browsers, Node, Deno, Bun and service workers, and be trusted by other projects.

## Decision

No `dependencies` in `packages/core/package.json`. No DOM, no `Date.now()` inside functions (time is an argument; `today()` is the one helper that defaults it), and no reliance on `Intl` calendars at runtime. Locale data is written per locale and verified, because `Intl` lacks Afaan Oromo and Tigrinya calendar names and Ge'ez numerals. `Intl` is used only at build time (Umm al-Qura table) and in tests (cross-checks).

Alternatives considered:

- Formatting through `Intl.DateTimeFormat`: inconsistent across ICU builds and missing locales.

## Consequences

- Locale files must be maintained and verified by native speakers.
- Output is the same in every runtime.
