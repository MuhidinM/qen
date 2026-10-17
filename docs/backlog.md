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

| ID    | Issue                                            | Task                                                                       | Reqs                          | Size | Status             |
| ----- | ------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------- | ---- | ------------------ |
| T-020 | [#15](https://github.com/MuhidinM/qen/issues/15) | Add dayOfWeek, daysInMonth, monthsInYear and isLeapYear                    | R-UTIL-01                     | S    | done               |
| T-021 | [#16](https://github.com/MuhidinM/qen/issues/16) | Add and subtract days, months and years with day clamping                  | R-UTIL-02, X-01               | M    | done               |
| T-022 | [#17](https://github.com/MuhidinM/qen/issues/17) | Compare dates and measure the difference between them                      | R-UTIL-03, R-UTIL-04          | M    | done               |
| T-023 | [#18](https://github.com/MuhidinM/qen/issues/18) | Calculate age from a birth date in any calendar                            | R-UTIL-05                     | S    | todo               |
| T-024 | [#19](https://github.com/MuhidinM/qen/issues/19) | Get today's date in any calendar without hidden clock reads                | R-UTIL-06                     | S    | todo               |
| T-025 | [#20](https://github.com/MuhidinM/qen/issues/20) | Add English and Amharic locale data as separate imports                    | R-FMT-01, R-FMT-03, R-I18N-01 | M    | todo               |
| T-026 | [#21](https://github.com/MuhidinM/qen/issues/21) | Add Afaan Oromo, Tigrinya and Arabic locale data                           | R-FMT-02, R-I18N-01           | M    | todo               |
| T-027 | [#22](https://github.com/MuhidinM/qen/issues/22) | Convert numbers to and from Ge'ez numerals                                 | R-FMT-05                      | M    | todo               |
| T-028 | [#23](https://github.com/MuhidinM/qen/issues/23) | Format dates with patterns, locales and numeral systems                    | R-FMT-04                      | L    | todo               |
| T-029 | [#24](https://github.com/MuhidinM/qen/issues/24) | Parse date strings and detect which calendar they are in                   | R-FMT-06, R-FMT-07            | L    | todo               |
| T-030 | [#25](https://github.com/MuhidinM/qen/issues/25) | Convert between international and Ethiopian time                           | R-UTIL-07                     | S    | todo               |
| T-031 | [#26](https://github.com/MuhidinM/qen/issues/26) | Document every public function and generate the API reference              | R-LIB-07, X-02                | S    | todo               |
| T-032 | [#27](https://github.com/MuhidinM/qen/issues/27) | Write the core README with install and quick-start examples that run in CI | R-LIB-08                      | S    | todo               |
| T-033 | [#28](https://github.com/MuhidinM/qen/issues/28) | Publish @qen/core 0.1.0 to npm                                             | R-LIB-13                      | S    | todo · needs-owner |

## M3 · Fixed-date holidays

PLAN.md Phase 3. Done when confirmed fixed-date holidays are queryable by year, range and category.

| ID    | Issue                                            | Task                                                         | Reqs     | Size | Status |
| ----- | ------------------------------------------------ | ------------------------------------------------------------ | -------- | ---- | ------ |
| T-040 | [#29](https://github.com/MuhidinM/qen/issues/29) | Define the holiday data model                                | R-HOL-01 | M    | todo   |
| T-041 | [#30](https://github.com/MuhidinM/qen/issues/30) | Confirm the official public holiday list and leap-year rules | R-HOL-02 | S    | todo   |
| T-042 | [#31](https://github.com/MuhidinM/qen/issues/31) | Implement the fixed-date holidays                            | R-HOL-03 | M    | todo   |
| T-043 | [#32](https://github.com/MuhidinM/qen/issues/32) | Query holidays by year, date range and category              | R-HOL-04 | M    | todo   |
| T-044 | [#33](https://github.com/MuhidinM/qen/issues/33) | Add holiday names in all five locales                        | R-HOL-05 | M    | todo   |

## M4 · Computed holidays

PLAN.md Phase 4. Done when Bahire Hasab, Orthodox movable feasts, Islamic holidays and observances are correct for 1900–2100.

| ID    | Issue                                            | Task                                                              | Reqs     | Size | Status |
| ----- | ------------------------------------------------ | ----------------------------------------------------------------- | -------- | ---- | ------ |
| T-050 | [#34](https://github.com/MuhidinM/qen/issues/34) | Compute Bahire Hasab for any Ethiopian year                       | R-HOL-06 | L    | todo   |
| T-051 | [#35](https://github.com/MuhidinM/qen/issues/35) | Derive the Orthodox movable feasts and fasts                      | R-HOL-07 | M    | todo   |
| T-052 | [#36](https://github.com/MuhidinM/qen/issues/36) | Cross-check Fasika against Julian Easter for 1900–2100            | R-HOL-08 | S    | todo   |
| T-053 | [#37](https://github.com/MuhidinM/qen/issues/37) | Add Islamic holidays and observances                              | R-HOL-09 | M    | todo   |
| T-054 | [#38](https://github.com/MuhidinM/qen/issues/38) | List multi-day observances such as Ramadan and the Orthodox fasts | R-HOL-10 | M    | todo   |
| T-055 | [#39](https://github.com/MuhidinM/qen/issues/39) | Flag the weekly Wednesday and Friday fasts                        | R-HOL-11 | S    | todo   |

## M5 · Hijri adjustment and core 1.0

PLAN.md Phase 5. Done when @qen/core@1.0.0 is published.

| ID    | Issue                                            | Task                                                                  | Reqs                         | Size | Status             |
| ----- | ------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------- | ---- | ------------------ |
| T-062 | [#42](https://github.com/MuhidinM/qen/issues/42) | Pass Hijri settings through conversion, today() and holidays          | R-HIJ-03                     | M    | todo               |
| T-063 | [#43](https://github.com/MuhidinM/qen/issues/43) | Apply official overrides and the user offset to Hijri dates           | R-HIJ-04                     | M    | todo               |
| T-064 | [#44](https://github.com/MuhidinM/qen/issues/44) | Mark Islamic holidays as expected or confirmed                        | R-HIJ-05                     | S    | todo               |
| T-065 | [#45](https://github.com/MuhidinM/qen/issues/45) | Seed overrides with recent confirmed Ethiopian Eid announcements      | R-HIJ-06                     | S    | todo               |
| T-066 | [#46](https://github.com/MuhidinM/qen/issues/46) | Review the public API and lock it for 1.0                             | R-LIB-09, R-LIB-10           | S    | todo               |
| T-068 | [#55](https://github.com/MuhidinM/qen/issues/55) | Get native-speaker and authority review of delegated facts before 1.0 | R-FMT-02, R-HOL-02, R-HOL-05 | S    | todo · needs-owner |
| T-067 | [#47](https://github.com/MuhidinM/qen/issues/47) | Publish @qen/core 1.0.0                                               | R-LIB-13                     | S    | todo · needs-owner |

## M6 · React components

PLAN.md Phase 6. Done when @qen/react@0.1.0 is published.

| ID    | Issue                                            | Task                                                        | Reqs                                                                                | Size | Status  |
| ----- | ------------------------------------------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---- | ------- |
| T-100 | [#48](https://github.com/MuhidinM/qen/issues/48) | Plan and split the React components milestone               | R-UI-01, R-UI-02, R-UI-03, R-UI-04, R-UI-05, R-UI-06, R-UI-07, R-A11Y-01, R-A11Y-02 | —    | outline |
| T-101 | [#59](https://github.com/MuhidinM/qen/issues/59) | Smoke-test @qen/core in a real browser and a service worker | R-LIB-03                                                                            | S    | todo    |

## M7 · Website

PLAN.md Phase 7. Done when the site, PWA and docs are deployed on the custom domain.

| ID    | Issue                                            | Task                                 | Reqs                                                                                                 | Size | Status  |
| ----- | ------------------------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------------------------------- | ---- | ------- |
| T-110 | [#49](https://github.com/MuhidinM/qen/issues/49) | Plan and split the website milestone | R-WEB-01, R-WEB-02, R-WEB-03, R-WEB-04, R-WEB-05, R-WEB-06, R-WEB-07, R-WEB-08, R-A11Y-01, R-A11Y-02 | —    | outline |

## M8 · Browser extension

PLAN.md Phase 8. Done when the extension is live on Chrome Web Store and Firefox Add-ons.

| ID    | Issue                                            | Task                                           | Reqs                                             | Size | Status  |
| ----- | ------------------------------------------------ | ---------------------------------------------- | ------------------------------------------------ | ---- | ------- |
| T-120 | [#50](https://github.com/MuhidinM/qen/issues/50) | Plan and split the browser extension milestone | R-EXT-01, R-EXT-02, R-EXT-03, R-EXT-04, R-EXT-05 | —    | outline |

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
