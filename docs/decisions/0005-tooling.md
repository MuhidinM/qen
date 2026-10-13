# ADR-0005 · Tooling: TypeScript 6, tsup, Vitest, ESLint + Prettier, Changesets

**Status:** accepted · 2026-10-13

## Context

The library needs dual ESM/CJS output, strict types, fast tests and per-package versioning.

## Decision

- TypeScript 6.0.x, pinned, because typescript-eslint 8 does not support TypeScript 7 yet. Strict, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`.
- tsup for builds; its d.ts step sets `ignoreDeprecations: '6.0'` for the `baseUrl` it injects.
- Vitest with v8 coverage, 95% line threshold for `core`.
- ESLint (typescript-eslint strict) + Prettier.
- Changesets, independent versions per package.

Alternatives considered:

- tsdown: newer and faster, less proven; revisit if tsup lags TypeScript.
- Biome: one tool for lint and format, but weaker type-aware linting.
- TypeScript 7: move when typescript-eslint supports it.

## Consequences

- Revisit the TypeScript pin when typescript-eslint supports 7; Dependabot will surface it.
