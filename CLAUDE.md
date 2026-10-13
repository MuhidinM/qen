# CLAUDE.md

Instructions for Claude Code working in this repository. Read this file and `PLAN.md` at the start of every session.

## What this project is

A multi-calendar toolkit for **Gregorian, Ethiopian, and Hijri** dates: conversion, arithmetic, formatting, holidays, and Hijri moon-sighting adjustment. It ships as developer packages on npm (`core`, `react`) and as user products built on those packages (website, browser extension, later a desktop app and hosted feeds).

`PLAN.md` holds the full feature spec, the phased roadmap, and the task tracker. It is the source of truth.

**Working name:** `qen` (ቀን, "day"). This is a placeholder. Package names are `@qen/core`, `@qen/react`, etc. If the owner picks a different name, rename everywhere in one commit.

## How to work

1. **One phase at a time, in order.** Phases go from easiest to hardest and each depends on the previous one. Don't start a phase until the previous phase's "Done when" is met, unless the owner says otherwise.
2. **Find the next unchecked task** in `PLAN.md` → Tracker. Work on that one task. Keep commits small and scoped to it.
3. **Update the tracker as you go.** Tick `[x]` when a task is complete and tested. Add a short dated entry to the Decisions Log in `PLAN.md` whenever you make a choice that isn't already written there.
4. **Tests first for all calendar logic.** Write the test cases (including the anchor dates in `PLAN.md`) before the implementation. Calendar bugs are silent and off-by-one; tests are the only defense.
5. **Ask before guessing on facts.** Never invent holiday dates, month names in a language, or religious rules. If `PLAN.md` marks something **VERIFY**, or you are not certain, stop and ask the owner. Record the answer and its source in the Decisions Log.
6. **Stop at the end of each phase** and summarize what was built, what's tested, and anything left open, before moving on.

## Engineering conventions

- **Language:** TypeScript, `strict: true`. No `any` in public APIs.
- **Monorepo:** pnpm workspaces + Turborepo. Packages live in `packages/`, apps in `apps/`.
- **Build:** tsup, output ESM + CJS + type declarations.
- **Tests:** Vitest. Coverage target for `core`: 95%+ lines.
- **Versioning:** Changesets. Every user-facing change to a package gets a changeset.
- **CI:** GitHub Actions runs lint, typecheck, test, and build on every push and PR.
- **`core` has zero runtime dependencies.** It must run in browsers, Node, Deno, Bun, and service workers. No DOM access, no `Date.now()` hidden inside functions (accept "today" as an input or provide a separate `today()` helper).
- **Dates are plain objects**, never mutated: `{ calendar: 'ethiopian', year: 2019, month: 1, day: 17 }`. Months are 1-based. All conversion goes through the Julian Day Number (JDN).
- **Tree-shakable exports.** Functions, not one big class. Locale data and the Hijri Umm al-Qura table must be importable separately so apps that don't need them don't pay for them.
- **Errors:** invalid dates throw a typed `InvalidDateError` with a clear message (e.g., "Pagume 6 does not exist in 2018 EC").
- **Docs:** every public function gets a TSDoc comment with at least one example.

## UI and design rules

All UI work (React components, website, extension, desktop) follows **Refactoring UI** (Adam Wathan & Steve Schoger). In practice:

- Define the design system once, in `packages/react/src/tokens` (spacing, type scale, colors in HSL, shadows, radii) and pick only from it. Never use an off-system value.
- Spacing scale: `4 8 12 16 24 32 48 64 96 128`. Type scale: `12 14 16 18 20 24 30 36 48`.
- 8–10 greys, 5–10 shades for the primary color and each semantic color.
- Every element is clearly primary, secondary, or tertiary. Create hierarchy with weight and color before size.
- Design in grayscale first; add color as reinforcement.
- Light and dark mode both supported via CSS variables.
- Accessible by default: full keyboard navigation, ARIA roles for grids and dialogs, visible focus states, WCAG AA contrast.
- Components must render Ge'ez script and Arabic script correctly, including right-to-left layout for Arabic.

## Commands (set these up in Phase 0)

```
pnpm install
pnpm build        # build all packages
pnpm test         # run all tests
pnpm test:watch
pnpm lint
pnpm typecheck
pnpm changeset    # record a version change
```
