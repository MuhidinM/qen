# Requirements

Every requirement has a stable ID, the task that delivers it, and the evidence that it works. The feature wording comes from [PLAN.md](../PLAN.md) §3; non-functional rows come from the library, web, backend and desktop best-practice checklists.

Status: ☐ not started · ◐ in progress or partly met · ☑ met, with evidence.

Tasks (T-xxx) are listed in [backlog.md](backlog.md). IDs never change once created.

## A. Calendar conversion (`@qen/core`)

| ID       | Requirement                                                                                                                                                                      | Priority | Task        | Evidence                                                                                                                                              | ✓   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| R-CAL-01 | Dates are plain immutable objects `{ calendar, year, month, day }`, months 1-based                                                                                               | must     | T-010       | `src/types.ts`; `test/date.test.ts` "returns a frozen object…" (#7)                                                                                   | ☑   |
| R-CAL-02 | `date()` constructor and `isValid()`; invalid dates throw a typed `InvalidDateError` with a clear message                                                                        | must     | T-010       | `src/date.ts`, `src/errors.ts`; `test/date.test.ts` (19 tests) (#7)                                                                                   | ☑   |
| R-CAL-03 | Proleptic Gregorian `toJDN` / `fromJDN` with validation                                                                                                                          | must     | T-011       | `src/calendars/gregorian.ts`; `test/gregorian.test.ts`: 7 anchors + all 73,414 days 1900–2100 match JS Date (#8)                                      | ☑   |
| R-CAL-04 | Ethiopian (Amete Mihret) `toJDN` / `fromJDN`: 13 months, Pagume 5 or 6, leap when `year % 4 === 3`                                                                               | must     | T-012       | `src/calendars/ethiopian.ts`; `test/ethiopian.test.ts`: PLAN.md + Intl anchors, epoch, new-year rule 1893–2092 EC, gap-free round trip 1900–2100 (#9) | ☑   |
| R-CAL-05 | Hijri tabular `toJDN` / `fromJDN`: 30-year cycle, leap years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29, civil epoch JDN 1948440                                                    | must     | T-013       | `src/calendars/hijri-tabular.ts`; `test/hijri-tabular.test.ts`: epoch + Intl islamic-civil anchors, leap list, gap-free round trip 1900–2100 (#10)    | ☑   |
| R-CAL-06 | `convert()` between every pair of calendars, always through the JDN                                                                                                              | must     | T-014       | `src/convert.ts`; `test/convert.test.ts`: 6 same-day triples in all six directions; smoke tests call `convert()` in every runtime (#11)               | ☑   |
| R-CAL-07 | `fromJSDate` / `toJSDate`                                                                                                                                                        | must     | T-015       |                                                                                                                                                       | ☐   |
| R-CAL-08 | All test anchors in PLAN.md §5 pass                                                                                                                                              | must     | T-011–T-013 | Gregorian (#8), Ethiopian (#9) and Hijri tabular (#10) anchors pass                                                                                   | ☑   |
| R-CAL-09 | Round trip `fromJDN(toJDN(d))` equals `d` for every day 1900–2100 in each calendar                                                                                               | must     | T-016       |                                                                                                                                                       | ☐   |
| R-CAL-10 | Ethiopian and Hijri tabular output equals `Intl.DateTimeFormat` (`ethiopic`, `islamic-civil`) for every day 1900–2100                                                            | must     | T-017       |                                                                                                                                                       | ☐   |
| R-CAL-12 | `fromJSDate` and `today` apply each calendar's day boundary: Gregorian midnight, Ethiopian 06:00, Hijri sunset (computed from a location, else 18:00); option for civil midnight | must     | T-018       |                                                                                                                                                       | ☐   |
| R-CAL-11 | Supported range is documented and enforced: year ≥ 1 in every calendar (see N-002)                                                                                               | must     | T-010       | `test/date.test.ts` "rejects year 0 and negative years"; range documented in TSDoc (#7)                                                               | ☑   |

## B. Everyday utilities

| ID        | Requirement                                                                                                  | Priority | Task  | Evidence | ✓   |
| --------- | ------------------------------------------------------------------------------------------------------------ | -------- | ----- | -------- | --- |
| R-UTIL-01 | `dayOfWeek` (0 = Sunday), `daysInMonth`, `monthsInYear`, `isLeapYear`                                        | must     | T-020 |          | ☐   |
| R-UTIL-02 | `addDays`, `addMonths`, `addYears`; month and year math clamps the day (Hamle 30 + 2 months → Pagume 5 or 6) | must     | T-021 |          | ☐   |
| R-UTIL-03 | `diff(a, b, unit)` for days, weeks, months, years                                                            | must     | T-022 |          | ☐   |
| R-UTIL-04 | `compare`, `isSame`                                                                                          | must     | T-022 |          | ☐   |
| R-UTIL-05 | `age(birth, on?)` → `{ years, months, days }`, including from an Ethiopian birth date                        | must     | T-023 |          | ☐   |
| R-UTIL-06 | `today(calendar, { now?, hijri? })`; no other function reads the clock                                       | must     | T-024 |          | ☐   |
| R-UTIL-07 | Ethiopian time: `toEthiopianTime`, `fromEthiopianTime` (07:00 → 1, 06:00 → 12 morning, 18:00 → 12 evening)   | must     | T-030 |          | ☐   |

## C. Formatting, parsing and locales

| ID       | Requirement                                                                                                                              | Priority | Task  | Evidence | ✓   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----- | -------- | --- |
| R-FMT-01 | Locale data for English and Amharic: month names, weekday names, era labels                                                              | must     | T-025 |          | ☐   |
| R-FMT-02 | Locale data for Afaan Oromo, Tigrinya and Arabic, each verified by a native speaker                                                      | must     | T-026 |          | ☐   |
| R-FMT-03 | Each locale is a separate import so unused locales add no bytes                                                                          | must     | T-025 |          | ☐   |
| R-FMT-04 | `format(d, pattern, { locale, numerals })` with numerals `latin`, `geez`, `arabic`                                                       | must     | T-028 |          | ☐   |
| R-FMT-05 | `toGeezNumeral` / `fromGeezNumeral`, tested up to 99,999                                                                                 | must     | T-027 |          | ☐   |
| R-FMT-06 | `parse(input, { calendar?, locale? })` detects the calendar for `17/01/2019 EC`, `Meskerem 17, 2019`, `መስከረም 17 2019`, `15 Ramadan 1447` | must     | T-029 |          | ☐   |
| R-FMT-07 | Ambiguous input (no calendar marker) is never silently guessed (see N-011)                                                               | must     | T-029 |          | ☐   |

## D. Holidays and observances

| ID       | Requirement                                                                                                                                               | Priority | Task  | Evidence | ✓   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----- | -------- | --- |
| R-HOL-01 | Holiday model: id, names per locale, category (`public`, `orthodox`, `islamic`, `other`), calendar of origin, rule (`fixed` / `computed`), Islamic status | must     | T-040 |          | ☐   |
| R-HOL-02 | Official public holiday list and leap-year rules confirmed from an official source, recorded with the source                                              | must     | T-041 |          | ☐   |
| R-HOL-03 | Fixed-date holidays from PLAN.md §3.4                                                                                                                     | must     | T-042 |          | ☐   |
| R-HOL-04 | `getHolidays`, `getHolidaysInRange`, `nextHoliday`, filtered by category; default is public holidays only                                                 | must     | T-043 |          | ☐   |
| R-HOL-05 | Holiday names in all five locales, verified                                                                                                               | must     | T-044 |          | ☐   |
| R-HOL-06 | `bahireHasab(ethiopianYear)` returns the full computus                                                                                                    | must     | T-050 |          | ☐   |
| R-HOL-07 | Orthodox movable feasts and fasts from the Nineveh offset table                                                                                           | must     | T-051 |          | ☐   |
| R-HOL-08 | Fasika equals Orthodox Easter (Meeus Julian computus, test-only) for every year 1900–2100, and matches the anchors                                        | must     | T-052 |          | ☐   |
| R-HOL-09 | Islamic holidays and observances from Hijri dates; Laylat al-Qadr flagged approximate                                                                     | must     | T-053 |          | ☐   |
| R-HOL-10 | `getObservances` for multi-day periods: Ramadan, Abiy Tsom, Tsome Hawariyat, Tsome Filseta, Tsome Nebiyat                                                 | must     | T-054 |          | ☐   |
| R-HOL-11 | Weekly Wednesday and Friday fasts as an optional flag, not shown as holidays                                                                              | should   | T-055 |          | ☐   |

## E. Hijri adjustment

| ID       | Requirement                                                                                                       | Priority | Task  | Evidence | ✓   |
| -------- | ----------------------------------------------------------------------------------------------------------------- | -------- | ----- | -------- | --- |
| R-HIJ-01 | Build script generates the Umm al-Qura month-start table (about 1300–1500 AH) from `Intl`; the table is committed | must     | T-060 |          | ☐   |
| R-HIJ-02 | Umm al-Qura `toJDN` / `fromJDN` from the table; outside the range, fall back to tabular and flag the result       | must     | T-061 |          | ☐   |
| R-HIJ-03 | `HijriSettings` (method, offset −2…+2, overrides) accepted by conversion, `today` and holidays                    | must     | T-062 |          | ☐   |
| R-HIJ-04 | Pipeline: base method → official overrides → user offset; the result records which step decided the date          | must     | T-063 |          | ☐   |
| R-HIJ-05 | Islamic holidays are `expected` until an override confirms the month start, then `confirmed` with the source      | must     | T-064 |          | ☐   |
| R-HIJ-06 | Bundled overrides seeded from recent confirmed Ethiopian Eid announcements, each with its source                  | must     | T-065 |          | ☐   |

## F. Library quality (`@qen/core`, `@qen/react`)

| ID       | Requirement                                                                                 | Priority | Task  | Evidence                                                                                                                                                                             | ✓   |
| -------- | ------------------------------------------------------------------------------------------- | -------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| R-LIB-01 | `core` has zero runtime dependencies                                                        | must     | T-001 | `packages/core/package.json` has no `dependencies`                                                                                                                                   | ☑   |
| R-LIB-02 | Ships ESM + CJS + type declarations, with an explicit `exports` map                         | must     | T-001 | `packages/core/dist`, commit 5acc559                                                                                                                                                 | ☑   |
| R-LIB-03 | Runs in Node (22, 24, 26), Deno, Bun, browsers and service workers; no DOM access in `core` | must     | T-003 | CI run 39012139411: packed tarball imported (ESM + CJS) on Node 22.23/24.21/26.12, Deno 2.9 (ESM), Bun 1.4; `tsconfig` lib has no DOM; browsers/service workers rely on ESM + no DOM | ◐   |
| R-LIB-04 | Tree-shakable: functions, no import side effects (`sideEffects: false`)                     | must     | T-003 | `sideEffects: false`; functions only (ADR-0003); per-entry size check added with locales (T-025)                                                                                     | ◐   |
| R-LIB-05 | Bundle size budget enforced in CI (size-limit)                                              | must     | T-003 | size-limit 5 kB budget in `packages/core/package.json`, run in CI job "lint, types, build, package" (CI run 39012139411)                                                             | ☑   |
| R-LIB-06 | Package correctness checked in CI (publint, Are the Types Wrong)                            | must     | T-003 | publint --strict + attw (node16 CJS/ESM, bundler all green), CI run 39012139411                                                                                                      | ☑   |
| R-LIB-07 | Every public function has TSDoc with at least one example; API reference generated          | must     | T-031 |                                                                                                                                                                                      | ☐   |
| R-LIB-08 | README examples compile and run in CI                                                       | should   | T-032 |                                                                                                                                                                                      | ☐   |
| R-LIB-09 | Semver and a written backward-compatibility and deprecation policy                          | must     | T-066 |                                                                                                                                                                                      | ☐   |
| R-LIB-10 | Public API surface checked for breaking changes against the last release (api-extractor)    | should   | T-066 |                                                                                                                                                                                      | ☐   |
| R-LIB-11 | Line coverage ≥ 95% for `core`, enforced in CI                                              | must     | T-001 | `packages/core/vitest.config.ts` threshold                                                                                                                                           | ◐   |
| R-LIB-12 | Type tests for the public types                                                             | should   | T-010 | `expectTypeOf` in `test/date.test.ts`, checked by `pnpm typecheck` (#7)                                                                                                              | ◐   |
| R-LIB-13 | Releases published from CI with npm provenance; every user-facing change has a changeset    | must     | T-033 |                                                                                                                                                                                      | ☐   |

## G. React components (`@qen/react`), outline

Refined into detailed rows when milestone M6 starts.

| ID      | Requirement                                                                                    | Priority | Task  | Evidence | ✓   |
| ------- | ---------------------------------------------------------------------------------------------- | -------- | ----- | -------- | --- |
| R-UI-01 | Design tokens in `packages/react/src/tokens` per CLAUDE.md (Refactoring UI scales, HSL colors) | must     | T-100 |          | ☐   |
| R-UI-02 | Month grid, date picker, range picker, Ethiopian time input                                    | must     | T-100 |          | ☐   |
| R-UI-03 | Secondary-calendar numbers in day cells; holiday markers with legend and filters               | must     | T-100 |          | ☐   |
| R-UI-04 | Week starts on Sunday or Monday                                                                | must     | T-100 |          | ☐   |
| R-UI-05 | Month, year and agenda views                                                                   | should   | T-100 |          | ☐   |
| R-UI-06 | Ge'ez and Arabic script render correctly; Arabic is right-to-left                              | must     | T-100 |          | ☐   |
| R-UI-07 | Light and dark mode through CSS variables                                                      | must     | T-100 |          | ☐   |

## H. Website (`apps/web`), outline

| ID       | Requirement                                              | Priority | Task  | Evidence | ✓   |
| -------- | -------------------------------------------------------- | -------- | ----- | -------- | --- |
| R-WEB-01 | Landing page with a live "today in three calendars" hero | must     | T-110 |          | ☐   |
| R-WEB-02 | Converter with paste-and-detect                          | must     | T-110 |          | ☐   |
| R-WEB-03 | Full calendar app, installable as a PWA, works offline   | must     | T-110 |          | ☐   |
| R-WEB-04 | Docs for `core` and `react` with live, editable examples | must     | T-110 |          | ☐   |
| R-WEB-05 | Static holiday pages per holiday per year                | should   | T-110 |          | ☐   |
| R-WEB-06 | Countdown to a date or holiday; age calculator           | should   | T-110 |          | ☐   |
| R-WEB-07 | Core Web Vitals budget: Lighthouse ≥ 90 on every page    | must     | T-110 |          | ☐   |
| R-WEB-08 | CSP and security headers                                 | must     | T-110 |          | ☐   |

## I. Browser extension (`apps/extension`), outline

| ID       | Requirement                                                                          | Priority | Task  | Evidence | ✓   |
| -------- | ------------------------------------------------------------------------------------ | -------- | ----- | -------- | --- |
| R-EXT-01 | Popup: today, converter, upcoming holidays, settings                                 | must     | T-120 |          | ☐   |
| R-EXT-02 | Select-to-convert tooltip                                                            | must     | T-120 |          | ☐   |
| R-EXT-03 | Google Calendar overlay; selectors isolated in one module; fails quietly             | should   | T-120 |          | ☐   |
| R-EXT-04 | Minimum permissions; no data leaves the browser except the Hijri override feed fetch | must     | T-120 |          | ☐   |
| R-EXT-05 | Published to Chrome Web Store and Firefox Add-ons                                    | must     | T-120 |          | ☐   |

## J. Hosted feeds (`apps/feeds`), outline

| ID        | Requirement                                                                               | Priority | Task  | Evidence | ✓   |
| --------- | ----------------------------------------------------------------------------------------- | -------- | ----- | -------- | --- |
| R-FEED-01 | Versioned, cached Hijri override JSON feed; bundled data is the offline fallback          | must     | T-130 |          | ☐   |
| R-FEED-02 | Owner-only admin flow to add a confirmed month start, with audit log                      | must     | T-130 |          | ☐   |
| R-FEED-03 | Holiday ICS feeds per category and locale                                                 | must     | T-130 |          | ☐   |
| R-FEED-04 | Personal recurring events in any calendar → ICS subscription URL, expanded 10 years ahead | should   | T-130 |          | ☐   |
| R-FEED-05 | Rate limiting, input validation, no personal data logged                                  | must     | T-130 |          | ☐   |

## K. Desktop app (`apps/desktop`), outline

| ID        | Requirement                                                       | Priority | Task  | Evidence | ✓   |
| --------- | ----------------------------------------------------------------- | -------- | ----- | -------- | --- |
| R-DESK-01 | Tauri tray app showing the Ethiopian date and time                | must     | T-140 |          | ☐   |
| R-DESK-02 | Panel with converter and upcoming holidays; holiday notifications | must     | T-140 |          | ☐   |
| R-DESK-03 | Signed installers for Windows, macOS, Linux; signed auto-update   | must     | T-140 |          | ☐   |

## L. Cross-cutting (all products)

| ID        | Requirement                                                                              | Priority | Task         | Evidence                                                                                                                                                   | ✓   |
| --------- | ---------------------------------------------------------------------------------------- | -------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| R-A11Y-01 | WCAG 2.2 AA: keyboard navigation, ARIA grid and dialog roles, visible focus, AA contrast | must     | T-100–T-140  |                                                                                                                                                            | ☐   |
| R-A11Y-02 | Responsive from 320 px; reduced motion respected                                         | must     | T-100–T-120  |                                                                                                                                                            | ☐   |
| R-I18N-01 | Locales: Amharic, Afaan Oromo, Tigrinya, English, Arabic; Ge'ez numerals optional        | must     | T-025, T-026 |                                                                                                                                                            | ☐   |
| R-SEC-01  | No secrets committed; `.env*` ignored except `.env.example`                              | must     | T-001        | `.gitignore`                                                                                                                                               | ◐   |
| R-SEC-02  | Dependency updates automated; lockfile with frozen install in CI                         | must     | T-005        | `.github/dependabot.yml`: weekly grouped npm + GitHub Actions updates, TypeScript 7 held back (ADR-0005); `pnpm install --frozen-lockfile` in every CI job | ☑   |
| R-CQ-01   | Strict TypeScript, no `any` in public APIs; lint with zero warnings; Prettier            | must     | T-001        | `tsconfig.base.json`, `eslint.config.js`                                                                                                                   | ☑   |
| R-CQ-02   | CI runs lint, typecheck, test and build on every push and PR, required on `main`         | must     | T-001, T-004 | CI run 38405098068 green; `main` protection requires `ci` (strict), no force push or deletion, admins included (#5)                                        | ☑   |
| R-CQ-03   | Pre-commit hook for format and lint; tests before push                                   | should   | T-002        | `package.json` → `simple-git-hooks` + `lint-staged`; tested: misformatted commit fixed, `any` commit rejected (#3)                                         | ☑   |
| R-CQ-04   | Apps contain no calendar logic; dependency direction enforced by a lint rule             | must     | T-003        | `eslint.config.js` no-restricted-imports: core/src relative-only; `@qen/*/src` banned; both verified to error on a test import                             | ☑   |
| R-CQ-05   | Tests are deterministic: no real network, fixed clock and time zone                      | must     | T-003        | Tests run under TZ=UTC and TZ=Africa/Addis_Ababa (CI run 39012139411); clock injection enforced per function from T-024                                    | ◐   |

## X. Extras (proposed, not in PLAN.md)

| ID   | Extra                                                                                   | Priority | Task  | Evidence | ✓   |
| ---- | --------------------------------------------------------------------------------------- | -------- | ----- | -------- | --- |
| X-01 | `addDays` etc. accept negative numbers (subtract) rather than separate `sub*` functions | should   | T-021 |          | ☐   |
| X-02 | Generated API reference (TypeDoc) published with the docs site                          | could    | T-031 |          | ☐   |

## Release checklist

Run top to bottom before each package release. Anything unticked goes into the README's known limitations.

- ☐ Every row for the release is ticked with evidence, or listed as a known limitation
- ☐ All CI checks green on the release commit, including the runtime matrix
- ☐ `publint` and Are the Types Wrong pass; size-limit within budget
- ☐ api-extractor report reviewed; breaking changes match the semver bump
- ☐ No secrets committed; `.env*` ignored except `.env.example`
- ☐ README setup works from a fresh clone
- ☐ Every ADR still matches the code
- ☐ Changesets applied, CHANGELOG written, version tagged
- ☐ Delegated facts reviewed (locale names, holiday rules, fasts; T-068), required for 1.0
- ☐ Install the published package in a fresh project (Node ESM, Node CJS, Deno, Bun) and run the quick-start (owner)
