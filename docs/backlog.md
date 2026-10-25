# Backlog

Generated from the GitHub issues at plan time; keep the Status column in step with the issues. Milestones match PLAN.md phases (ADR-0010).

Status: `todo`, `doing`, `done`, `moved` (with the issue it moved to). Sizes: S < half a day, M ≈ a day, L = several days. `needs-owner` = waiting on facts or approval from the owner.

## M0 · Project setup

Monorepo, tooling, CI and project docs. Done when an empty core package builds, tests pass in CI, and it could be published.

| ID    | Issue                                          | Task                                                                                           | Reqs                                                     | Size | Status |
| ----- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ---- | ------ |
| T-001 | [#1](https://github.com/MuhidinM/qen/issues/1) | Set up the monorepo, core package, tooling and CI                                              | R-LIB-01, R-LIB-02, R-LIB-11, R-CQ-01, R-CQ-02, R-SEC-01 | M    | done   |
| T-006 | [#2](https://github.com/MuhidinM/qen/issues/2) | Write the project plan: requirements, architecture, decisions and backlog                      | —                                                        | M    | done   |
| T-002 | [#3](https://github.com/MuhidinM/qen/issues/3) | Run format and lint before each commit, and tests before each push                             | R-CQ-03                                                  | S    | done   |
| T-003 | [#4](https://github.com/MuhidinM/qen/issues/4) | Check the published package in every supported runtime and enforce size and import rules in CI | R-LIB-03, R-LIB-04, R-LIB-05, R-LIB-06, R-CQ-04, R-CQ-05 | M    | done   |
| T-004 | [#5](https://github.com/MuhidinM/qen/issues/5) | Require green CI before merging to main                                                        | R-CQ-02                                                  | S    | done   |
| T-005 | [#6](https://github.com/MuhidinM/qen/issues/6) | Keep dependencies up to date automatically                                                     | R-SEC-02                                                 | S    | done   |

## M1 · Calendar conversion

PLAN.md Phase 1. Done when every date converts correctly in all directions, with round-trip and Intl cross-checks green.

| ID    | Issue                                            | Task                                                                    | Reqs                                   | Size | Status |
| ----- | ------------------------------------------------ | ----------------------------------------------------------------------- | -------------------------------------- | ---- | ------ |
| T-010 | [#7](https://github.com/MuhidinM/qen/issues/7)   | Define the date type, the date() constructor and InvalidDateError       | R-CAL-01, R-CAL-02, R-CAL-11, R-LIB-12 | M    | done   |
| T-011 | [#8](https://github.com/MuhidinM/qen/issues/8)   | Convert Gregorian dates to and from Julian Day Numbers                  | R-CAL-03, R-CAL-08                     | S    | done   |
| T-012 | [#9](https://github.com/MuhidinM/qen/issues/9)   | Convert Ethiopian dates to and from Julian Day Numbers                  | R-CAL-04, R-CAL-08                     | M    | done   |
| T-013 | [#10](https://github.com/MuhidinM/qen/issues/10) | Convert Hijri dates (tabular method) to and from Julian Day Numbers     | R-CAL-05, R-CAL-08                     | M    | done   |
| T-014 | [#11](https://github.com/MuhidinM/qen/issues/11) | Convert any date to any calendar with convert()                         | R-CAL-06                               | S    | done   |
| T-018 | [#54](https://github.com/MuhidinM/qen/issues/54) | Decide which calendar day an instant falls on: midnight, dawn or sunset | R-CAL-12                               | M    | done   |
| T-015 | [#12](https://github.com/MuhidinM/qen/issues/12) | Convert between calendar dates and JavaScript Date objects              | R-CAL-07                               | S    | done   |
| T-016 | [#13](https://github.com/MuhidinM/qen/issues/13) | Prove every day from 1900 to 2100 round-trips in every calendar         | R-CAL-09                               | S    | done   |
| T-017 | [#14](https://github.com/MuhidinM/qen/issues/14) | Cross-check Ethiopian and Hijri results against Intl for 1900–2100      | R-CAL-10                               | M    | done   |
| T-060 | [#40](https://github.com/MuhidinM/qen/issues/40) | Generate and commit the Umm al-Qura month-start table                   | R-HIJ-01                               | M    | done   |
| T-061 | [#41](https://github.com/MuhidinM/qen/issues/41) | Convert Hijri dates with the Umm al-Qura method                         | R-HIJ-02                               | M    | done   |

## M2 · Everyday utilities and core 0.1

PLAN.md Phase 2. Done when @qen/core@0.1.0 is live on npm.

| ID    | Issue                                            | Task                                                                       | Reqs                          | Size | Status |
| ----- | ------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------- | ---- | ------ |
| T-020 | [#15](https://github.com/MuhidinM/qen/issues/15) | Add dayOfWeek, daysInMonth, monthsInYear and isLeapYear                    | R-UTIL-01                     | S    | done   |
| T-021 | [#16](https://github.com/MuhidinM/qen/issues/16) | Add and subtract days, months and years with day clamping                  | R-UTIL-02, X-01               | M    | done   |
| T-022 | [#17](https://github.com/MuhidinM/qen/issues/17) | Compare dates and measure the difference between them                      | R-UTIL-03, R-UTIL-04          | M    | done   |
| T-023 | [#18](https://github.com/MuhidinM/qen/issues/18) | Calculate age from a birth date in any calendar                            | R-UTIL-05                     | S    | done   |
| T-024 | [#19](https://github.com/MuhidinM/qen/issues/19) | Get today's date in any calendar without hidden clock reads                | R-UTIL-06                     | S    | done   |
| T-025 | [#20](https://github.com/MuhidinM/qen/issues/20) | Add English and Amharic locale data as separate imports                    | R-FMT-01, R-FMT-03, R-I18N-01 | M    | done   |
| T-026 | [#21](https://github.com/MuhidinM/qen/issues/21) | Add Afaan Oromo, Tigrinya and Arabic locale data                           | R-FMT-02, R-I18N-01           | M    | done   |
| T-027 | [#22](https://github.com/MuhidinM/qen/issues/22) | Convert numbers to and from Ge'ez numerals                                 | R-FMT-05                      | M    | done   |
| T-028 | [#23](https://github.com/MuhidinM/qen/issues/23) | Format dates with patterns, locales and numeral systems                    | R-FMT-04                      | L    | done   |
| T-029 | [#24](https://github.com/MuhidinM/qen/issues/24) | Parse date strings and detect which calendar they are in                   | R-FMT-06, R-FMT-07            | L    | done   |
| T-030 | [#25](https://github.com/MuhidinM/qen/issues/25) | Convert between international and Ethiopian time                           | R-UTIL-07                     | S    | done   |
| T-031 | [#26](https://github.com/MuhidinM/qen/issues/26) | Document every public function and generate the API reference              | R-LIB-07, X-02                | S    | done   |
| T-032 | [#27](https://github.com/MuhidinM/qen/issues/27) | Write the core README with install and quick-start examples that run in CI | R-LIB-08                      | S    | done   |
| T-033 | [#28](https://github.com/MuhidinM/qen/issues/28) | Publish @qen/core 0.1.0 to npm                                             | R-LIB-13                      | S    | done   |

## M3 · Fixed-date holidays

PLAN.md Phase 3. Done when confirmed fixed-date holidays are queryable by year, range and category.

| ID    | Issue                                            | Task                                                         | Reqs     | Size | Status |
| ----- | ------------------------------------------------ | ------------------------------------------------------------ | -------- | ---- | ------ |
| T-034 | [#89](https://github.com/MuhidinM/qen/issues/89) | Publish with npm provenance attestations                     | R-LIB-13 | S    | done   |
| T-040 | [#29](https://github.com/MuhidinM/qen/issues/29) | Define the holiday data model                                | R-HOL-01 | M    | done   |
| T-041 | [#30](https://github.com/MuhidinM/qen/issues/30) | Confirm the official public holiday list and leap-year rules | R-HOL-02 | S    | done   |
| T-042 | [#31](https://github.com/MuhidinM/qen/issues/31) | Implement the fixed-date holidays                            | R-HOL-03 | M    | done   |
| T-043 | [#32](https://github.com/MuhidinM/qen/issues/32) | Query holidays by year, date range and category              | R-HOL-04 | M    | done   |
| T-044 | [#33](https://github.com/MuhidinM/qen/issues/33) | Add holiday names in all five locales                        | R-HOL-05 | M    | done   |

## M4 · Computed holidays

PLAN.md Phase 4. Done when Bahire Hasab, Orthodox movable feasts, Islamic holidays and observances are correct for 1900–2100.

| ID    | Issue                                            | Task                                                              | Reqs     | Size | Status |
| ----- | ------------------------------------------------ | ----------------------------------------------------------------- | -------- | ---- | ------ |
| T-050 | [#34](https://github.com/MuhidinM/qen/issues/34) | Compute Bahire Hasab for any Ethiopian year                       | R-HOL-06 | L    | done   |
| T-051 | [#35](https://github.com/MuhidinM/qen/issues/35) | Derive the Orthodox movable feasts and fasts                      | R-HOL-07 | M    | done   |
| T-052 | [#36](https://github.com/MuhidinM/qen/issues/36) | Cross-check Fasika against Julian Easter for 1900–2100            | R-HOL-08 | S    | done   |
| T-053 | [#37](https://github.com/MuhidinM/qen/issues/37) | Add Islamic holidays and observances                              | R-HOL-09 | M    | done   |
| T-054 | [#38](https://github.com/MuhidinM/qen/issues/38) | List multi-day observances such as Ramadan and the Orthodox fasts | R-HOL-10 | M    | done   |
| T-055 | [#39](https://github.com/MuhidinM/qen/issues/39) | Flag the weekly Wednesday and Friday fasts                        | R-HOL-11 | S    | done   |

## M5 · Hijri adjustment and core 1.0

PLAN.md Phase 5. Done when @qen/core@1.0.0 is published.

| ID    | Issue                                            | Task                                                                  | Reqs                         | Size | Status |
| ----- | ------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------- | ---- | ------ |
| T-062 | [#42](https://github.com/MuhidinM/qen/issues/42) | Pass Hijri settings through conversion, today() and holidays          | R-HIJ-03                     | M    | done   |
| T-063 | [#43](https://github.com/MuhidinM/qen/issues/43) | Apply official overrides and the user offset to Hijri dates           | R-HIJ-04                     | M    | done   |
| T-064 | [#44](https://github.com/MuhidinM/qen/issues/44) | Mark Islamic holidays as expected or confirmed                        | R-HIJ-05                     | S    | done   |
| T-065 | [#45](https://github.com/MuhidinM/qen/issues/45) | Seed overrides with recent confirmed Ethiopian Eid announcements      | R-HIJ-06                     | S    | done   |
| T-066 | [#46](https://github.com/MuhidinM/qen/issues/46) | Review the public API and lock it for 1.0                             | R-LIB-09, R-LIB-10           | S    | done   |
| T-068 | [#55](https://github.com/MuhidinM/qen/issues/55) | Get native-speaker and authority review of delegated facts before 1.0 | R-FMT-02, R-HOL-02, R-HOL-05 | S    | done   |
| T-067 | [#47](https://github.com/MuhidinM/qen/issues/47) | Publish @qen/core 1.0.0                                               | R-LIB-13                     | S    | done   |

## M6 · React components

PLAN.md Phase 6. Done when @qen/react@0.1.0 is published.

| ID    | Issue                                              | Task                                                                               | Reqs                                                                                | Size | Status                      |
| ----- | -------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---- | --------------------------- |
| T-100 | [#48](https://github.com/MuhidinM/qen/issues/48)   | Plan and split the React components milestone                                      | R-UI-01, R-UI-02, R-UI-03, R-UI-04, R-UI-05, R-UI-06, R-UI-07, R-A11Y-01, R-A11Y-02 | —    | done (split into #111–#118) |
| T-101 | [#59](https://github.com/MuhidinM/qen/issues/59)   | Smoke-test @qen/core in a real browser and a service worker                        | R-LIB-03                                                                            | S    | done                        |
| T-102 | [#111](https://github.com/MuhidinM/qen/issues/111) | Create @qen/react with build, tests, accessibility checks and a component explorer | R-CQ-01, R-A11Y-01                                                                  | M    | done                        |
| T-103 | [#112](https://github.com/MuhidinM/qen/issues/112) | Define the design tokens, with light and dark mode                                 | R-UI-01, R-UI-07, R-A11Y-01                                                         | M    | done                        |
| T-104 | [#113](https://github.com/MuhidinM/qen/issues/113) | Build the month calendar grid with keyboard navigation                             | R-UI-02, R-UI-04, R-UI-06, R-A11Y-01, R-A11Y-02                                     | L    | done                        |
| T-105 | [#114](https://github.com/MuhidinM/qen/issues/114) | Show other calendars and holidays in day cells, with a legend and filters          | R-UI-03                                                                             | M    | done                        |
| T-106 | [#115](https://github.com/MuhidinM/qen/issues/115) | Build the date picker                                                              | R-UI-02, R-A11Y-01                                                                  | L    | done                        |
| T-107 | [#116](https://github.com/MuhidinM/qen/issues/116) | Build the date range picker and the Ethiopian time input                           | R-UI-02, R-A11Y-01                                                                  | M    | done                        |
| T-108 | [#117](https://github.com/MuhidinM/qen/issues/117) | Add year and agenda views                                                          | R-UI-05                                                                             | M    | done                        |
| T-109 | [#118](https://github.com/MuhidinM/qen/issues/118) | Publish @qen/react 0.1.0                                                           | R-LIB-13                                                                            | S    | done                        |

## M7 · Website

PLAN.md Phase 7. Done when the site, PWA and docs are live in production (owner, 2026-10-25: the custom domain follows once the site gains traction, #163). Decisions: ADR-0016; spec notes N-031–N-033.

| ID    | Issue                                              | Task                                                                                     | Reqs                                     | Size | Status                             |
| ----- | -------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------- | ---- | ---------------------------------- |
| T-110 | [#49](https://github.com/MuhidinM/qen/issues/49)   | Plan and split the website milestone                                                     | R-WEB-01–R-WEB-08, R-A11Y-01, R-A11Y-02  | —    | done (split into #133–#141)        |
| T-111 | [#133](https://github.com/MuhidinM/qen/issues/133) | Create the website app with security headers, accessibility and performance checks in CI | R-WEB-07, R-WEB-08, R-A11Y-01, R-A11Y-02 | L    | done                               |
| T-112 | [#134](https://github.com/MuhidinM/qen/issues/134) | Build the site layout and the landing page with today in three calendars                 | R-WEB-01, R-A11Y-01, R-A11Y-02           | M    | done                               |
| T-113 | [#135](https://github.com/MuhidinM/qen/issues/135) | Build the converter with paste-and-detect                                                | R-WEB-02, R-A11Y-01                      | M    | done                               |
| T-114 | [#136](https://github.com/MuhidinM/qen/issues/136) | Build the full calendar page with month, year and agenda views                           | R-WEB-03, R-A11Y-01, R-A11Y-02           | M    | done                               |
| T-115 | [#137](https://github.com/MuhidinM/qen/issues/137) | Make the site installable and usable offline (PWA)                                       | R-WEB-03                                 | M    | done                               |
| T-116 | [#138](https://github.com/MuhidinM/qen/issues/138) | Add the countdown and age calculator pages                                               | R-WEB-06                                 | M    | done                               |
| T-117 | [#139](https://github.com/MuhidinM/qen/issues/139) | Generate static holiday pages for each holiday and year                                  | R-WEB-05                                 | M    | done                               |
| T-118 | [#140](https://github.com/MuhidinM/qen/issues/140) | Write the docs for core and react with live, editable examples                           | R-WEB-04                                 | L    | done                               |
| T-119 | [#141](https://github.com/MuhidinM/qen/issues/141) | Launch the website (in production at qen-3.vercel.app)                                   | R-WEB-01–R-WEB-08, R-A11Y-01, R-A11Y-02  | S    | done (custom domain moved to #163) |

## M8 · Browser extension

PLAN.md Phase 8. Done when the extension is live on the Chrome Web Store and Firefox Add-ons. Decisions: ADR-0017; spec note N-035.

| ID    | Issue                                              | Task                                                                      | Reqs                          | Size | Status                             |
| ----- | -------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------- | ---- | ---------------------------------- |
| T-120 | [#50](https://github.com/MuhidinM/qen/issues/50)   | Plan and split the browser extension milestone                            | R-EXT-01–R-EXT-05             | —    | done (split into #165–#171)        |
| T-121 | [#165](https://github.com/MuhidinM/qen/issues/165) | Create the browser extension with Chrome and Firefox builds and CI checks | R-EXT-04, R-A11Y-01           | L    | done                               |
| T-122 | [#166](https://github.com/MuhidinM/qen/issues/166) | Show today and upcoming holidays in the extension popup                   | R-EXT-01, R-A11Y-01           | M    | todo                               |
| T-123 | [#167](https://github.com/MuhidinM/qen/issues/167) | Add the converter and settings to the extension popup                     | R-EXT-01                      | M    | todo                               |
| T-124 | [#168](https://github.com/MuhidinM/qen/issues/168) | Convert a selected date on any page, on request                           | R-EXT-02, R-EXT-04, R-A11Y-01 | M    | todo                               |
| T-125 | [#169](https://github.com/MuhidinM/qen/issues/169) | Show Ethiopian and Hijri dates in Google Calendar                         | R-EXT-03                      | L    | todo                               |
| T-126 | [#170](https://github.com/MuhidinM/qen/issues/170) | Publish the extension's privacy policy and store listing material         | R-EXT-04, R-EXT-05            | S    | todo                               |
| T-127 | [#171](https://github.com/MuhidinM/qen/issues/171) | Publish the extension to the Chrome Web Store and Firefox Add-ons         | R-EXT-05                      | S    | todo (needs-owner: store accounts) |

## M9 · Hosted feeds

PLAN.md Phase 9. Done when the Hijri override feed and ICS feeds are live and used by the website and extension.

| ID    | Issue                                            | Task                                      | Reqs                                                  | Size | Status  |
| ----- | ------------------------------------------------ | ----------------------------------------- | ----------------------------------------------------- | ---- | ------- |
| T-130 | [#51](https://github.com/MuhidinM/qen/issues/51) | Plan and split the hosted feeds milestone | R-FEED-01, R-FEED-02, R-FEED-03, R-FEED-04, R-FEED-05 | —    | outline |

## M10 · Desktop app

PLAN.md Phase 10. Done when signed installers ship for Windows, macOS and Linux.

| ID    | Issue                                            | Task                                     | Reqs                            | Size | Status  |
| ----- | ------------------------------------------------ | ---------------------------------------- | ------------------------------- | ---- | ------- |
| T-140 | [#52](https://github.com/MuhidinM/qen/issues/52) | Plan and split the desktop app milestone | R-DESK-01, R-DESK-02, R-DESK-03 | —    | outline |

## Later (no milestone)

Work that waits on an owner decision rather than a phase.

| ID    | Issue                                              | Task                                | Reqs              | Size | Status                                           |
| ----- | -------------------------------------------------- | ----------------------------------- | ----------------- | ---- | ------------------------------------------------ |
| T-150 | [#163](https://github.com/MuhidinM/qen/issues/163) | Move the website to a custom domain | R-WEB-01–R-WEB-08 | S    | todo (needs-owner: domain, once it has traction) |
