# Architecture

## Overview

One monorepo (ADR-0001) holds a calendar engine and every product built on it.

```
packages/core      @qen/core    pure TypeScript, zero dependencies, published to npm
packages/react     @qen/react   React components + design tokens, published to npm
apps/web           Next.js site + PWA                      (private, deployed)
apps/extension     Chrome + Firefox, Manifest V3           (private, store releases)
apps/feeds         serverless Hijri override + ICS feeds   (private, deployed)
apps/desktop       Tauri tray app                          (private, signed installers)
```

Dependency direction, one way only:

```
core  ◄──  react  ◄──  web, extension, desktop
core  ◄──  feeds
```

- `core` imports nothing (no runtime dependencies, no DOM, no clock).
- `react` imports `core` only through its public entry points.
- Apps import `core` and `react` only through their public entry points, never `src/` paths. An ESLint `no-restricted-imports` rule enforces this (R-CQ-04).
- Apps contain no calendar logic. A calculation an app needs is added to `core` first, with tests.

## Runtime model

| Part      | Runs in                                                   | Ships as                             |
| --------- | --------------------------------------------------------- | ------------------------------------ |
| core      | Browsers, Node ≥ 22, Deno, Bun, service workers           | ESM + CJS + `.d.ts`, subpath exports |
| react     | Browsers (React 19), server rendering                     | ESM + CJS + `.d.ts` + CSS variables  |
| web       | Static pages + client islands; service worker for offline | Deployed site                        |
| extension | MV3 service worker, popup page, content scripts           | Zipped bundles per store             |
| feeds     | Serverless functions + edge cache                         | Deployed API                         |
| desktop   | Tauri (Rust shell + system webview running the React UI)  | Signed installers, signed updates    |

## Data model and data flow

Dates are plain immutable objects (ADR-0003):

```ts
{ calendar: 'ethiopian', year: 2019, month: 1, day: 17 }
```

Every conversion goes through the Julian Day Number (ADR-0002):

```
CalendarDate ──toJDN──► JDN (integer) ──fromJDN──► CalendarDate
```

Each calendar module implements only `toJDN`, `fromJDN` and `daysInMonth`/`monthsInYear`. Everything else (arithmetic, diff, holidays) is written once on top of those.

Hijri dates go through the adjustment pipeline (ADR-0006):

```
base method (Umm al-Qura table | tabular)
   └─► official overrides (bundled; later fetched from apps/feeds)
         └─► user offset (−2…+2)
               └─► result + which step decided it
```

Holidays (ADR-0007):

```
fixed rules  (calendar, month, day)        ─┐
Bahire Hasab (Nineveh date + offsets)       ├─► Holiday[] for a Gregorian year, filtered by category
Hijri rules  (month, day) + pipeline status ─┘
```

## Day boundaries

Date-to-date conversion maps the daylight part of a day. Turning an instant into a date applies each calendar's own boundary (ADR-0012):

```
instant ──► Gregorian: day changes at 00:00 local
        ──► Ethiopian: day changes at 06:00 local
        ──► Hijri:     day changes at sunset (NOAA formula from a location, else 18:00)
        (option boundary: 'midnight' → civil rule for all three)
```

## State

- `core` is stateless. No caches with global effect, no module-level mutable state, no reading the clock. "Now" is an argument; `today()` is the only helper that defaults it.
- `react` components are controlled by default (value + onChange), with an uncontrolled option.
- Apps keep user settings (locale, primary calendar, Hijri settings) in the platform's storage: `localStorage` (web), `chrome.storage.sync` (extension), the OS config folder (desktop).

## Errors

- `InvalidDateError` (typed, with `calendar`, `year`, `month`, `day` fields) for impossible dates, e.g. "Pagume 6 does not exist in 2018 EC".
- `AmbiguousDateError` from `parse` when the calendar cannot be decided (N-011).
- `RangeError` for numeric input out of range (Ge'ez numeral 0, offset outside −2…+2).
- Results outside the Umm al-Qura table are not errors; they come back flagged as tabular fallback.
- Apps never show raw error text from the feeds API; they map error codes to messages.

## Security model

- `core` and `react`: no network, no `eval`, no dynamic code. Supply-chain risk is limited to dev dependencies, kept current by Dependabot.
- npm releases are published from CI with provenance, never from a laptop.
- Extension: minimum permissions; the only network call is the Hijri override feed.
- Feeds: the public endpoints are read-only and cached. The admin endpoint is owner-only, authenticated, validated and audit-logged. ICS subscription URLs contain an unguessable ID, no personal data.
- Desktop: Tauri capability allow-list; signed updates.

## Folder structure (`packages/core`)

Proposed; folders are created when the first file needs them (rule: no abstraction without a second use).

```
src/
  index.ts              public entry: re-exports only
  types.ts              CalendarDate, CalendarId, HijriSettings…
  errors.ts             InvalidDateError, AmbiguousDateError
  calendars/
    gregorian.ts        toJDN, fromJDN, daysInMonth…
    ethiopian.ts
    hijri-tabular.ts
    hijri-umalqura.ts   + generated umalqura-table.ts (own entry point)
  convert.ts            convert, fromJSDate, toJSDate
  info.ts               dayOfWeek, isLeapYear…
  arithmetic.ts         addDays, addMonths, addYears, diff, age, compare
  geez.ts               Ge'ez numerals
  ethiopian-time.ts
  format.ts, parse.ts
  locales/              en.ts, am.ts, om.ts, ti.ts, ar.ts (one entry point each)
  holidays/             model, fixed rules, bahire-hasab.ts, islamic.ts, observances.ts
  hijri/                pipeline, overrides data
test/
  anchors.test.ts, round-trip.test.ts, intl-crosscheck.test.ts, …
scripts/
  generate-umalqura.ts  build-time only
```

Subpath exports: `@qen/core`, `@qen/core/locales/<id>`, `@qen/core/hijri/umalqura`.

## Tech stack

| Concern            | Choice                                                  | Runner-up           |
| ------------------ | ------------------------------------------------------- | ------------------- |
| Language           | TypeScript 6.0, strict                                  | —                   |
| Monorepo           | pnpm workspaces + Turborepo                             | Nx                  |
| Library build      | tsup (ESM + CJS + d.ts)                                 | tsdown              |
| Tests              | Vitest + v8 coverage                                    | Jest                |
| Lint / format      | ESLint (typescript-eslint strict) + Prettier            | Biome               |
| Versioning         | Changesets                                              | release-please      |
| Package checks     | publint, Are the Types Wrong, size-limit, api-extractor | —                   |
| Components         | React 19 + CSS variables, React Aria primitives         | Radix               |
| Component explorer | Ladle                                                   | Storybook           |
| Website            | Next.js (static export where possible)                  | Astro               |
| Extension build    | Vite-based MV3 (WXT)                                    | CRXJS               |
| Feeds              | Serverless functions (platform chosen at M9)            | Cloudflare Workers  |
| Desktop            | Tauri 2                                                 | Electron (ADR-0008) |
| End-to-end tests   | Playwright                                              | Cypress             |

Choices for M6–M10 (components onward) are proposed and get their own ADRs when those milestones start.

## Test strategy

| Layer                 | Where                   | What                                                                                        |
| --------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| Unit                  | core, react             | Every public function; error and edge paths (Pagume 6, 30th of a 29-day month, year 1)      |
| Anchors               | core                    | PLAN.md §5 table, plus Hijri anchors from a published Umm al-Qura calendar                  |
| Exhaustive / property | core                    | Round trip for every day 1900–2100; ordering and arithmetic invariants                      |
| Oracle cross-checks   | core (test-only code)   | `Intl` `ethiopic` / `islamic-civil` for every day 1900–2100; Meeus Julian Easter for Fasika |
| Type tests            | core, react             | `expectTypeOf` for public types                                                             |
| Runtime matrix        | core                    | Built package imported and smoke-tested in Node 22/24/26, Deno, Bun                         |
| Component             | react                   | Testing Library by role; axe in light and dark; keyboard paths; RTL snapshot                |
| End-to-end            | web, extension          | Playwright on production builds; extension loaded unpacked                                  |
| Integration           | feeds                   | Handlers against a local instance; JSON schema contract for the override feed               |
| Manual                | desktop, store releases | Each OS before release, by the owner                                                        |

Shared fakes, one per external dependency:

- **Clock:** `now` is always an argument; tests pass fixed instants and run with `TZ=UTC` plus one non-UTC zone.
- **Hijri override feed:** a fixture JSON file in `core` used by unit tests, the feeds tests and the apps' offline mode.
- **Google Calendar DOM:** saved HTML fixtures for the extension overlay tests.
