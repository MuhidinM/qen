# ADR-0003 · Dates are immutable plain objects; the API is functions

**Status:** accepted · 2026-10-13

## Context

`core` must tree-shake well, serialise to JSON (extension storage, feeds), and be easy to use in React state.

## Decision

A date is `{ calendar, year, month, day }` with 1-based months. The public API is standalone functions that return new objects; nothing is mutated. `date()` validates at construction; other functions validate their inputs cheaply.

Alternatives considered:

- A `QenDate` class with methods: not tree-shakable, not JSON-safe, clashes with React's immutability model.

## Consequences

- Bundlers drop unused functions.
- Dates survive `JSON.stringify` and `structuredClone` unchanged.
- The Hijri method is not part of the date; see N-010.
