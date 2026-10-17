# Architecture decisions

One record per choice between real alternatives. Amend in place, with a date, when the code changes the decision.

| ADR                                                                 | Decision                                                                      | Status   |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------- | -------- |
| [0001](0001-one-monorepo-for-all-packages-and-apps.md)              | One monorepo holds every package and app                                      | accepted |
| [0002](0002-julian-day-number-is-the-conversion-pivot.md)           | All conversion goes through the Julian Day Number                             | accepted |
| [0003](0003-dates-are-immutable-plain-objects.md)                   | Dates are immutable plain objects; the API is functions                       | accepted |
| [0004](0004-core-has-zero-runtime-dependencies.md)                  | `core` has zero runtime dependencies and no environment access                | accepted |
| [0005](0005-tooling.md)                                             | Tooling: TypeScript 6, tsup, Vitest, ESLint + Prettier, Changesets            | accepted |
| [0006](0006-hijri-umm-al-qura-with-override-pipeline.md)            | Hijri: Umm al-Qura + tabular fallback, overrides, user offset                 | accepted |
| [0007](0007-orthodox-holidays-via-bahire-hasab.md)                  | Orthodox holidays from Bahire Hasab, verified by Julian Easter                | accepted |
| [0008](0008-desktop-app-uses-tauri.md)                              | The desktop app uses Tauri, not Electron                                      | accepted |
| [0009](0009-no-native-mobile-app-pwa-covers-phones.md)              | No native mobile app for now; the PWA covers phones                           | accepted |
| [0010](0010-plan-is-the-spec-github-is-the-tracker.md)              | PLAN.md is the spec; GitHub issues and docs/ are the tracker                  | accepted |
| [0011](0011-release-from-ci-with-changesets.md)                     | Packages released from CI with Changesets and npm provenance                  | accepted |
| [0012](0012-each-calendar-keeps-its-own-day-boundary.md)            | Each calendar keeps its own day boundary: midnight, dawn, sunset              | accepted |
| [0013](0013-format-patterns-use-ldml-tokens.md)                     | `format()` uses LDML-style pattern tokens; names come from an imported locale | accepted |
| [0014](0014-parse-detects-the-calendar-but-never-guesses.md)        | `parse()` detects the calendar from explicit signals and never guesses        | accepted |
| [0015](0015-react-components-hand-rolled-aria-and-css-variables.md) | React components: hand-rolled ARIA patterns, CSS variables, Ladle             | accepted |
