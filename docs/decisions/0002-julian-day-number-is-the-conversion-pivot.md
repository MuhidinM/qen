# ADR-0002 · All conversion goes through the Julian Day Number

**Status:** accepted · 2026-10-13

## Context

Three calendars give six conversion directions, and more calendars may come. Direct pairwise formulas multiply code and bugs.

## Decision

Each calendar implements only `toJDN` and `fromJDN` (plus month lengths). `convert(a, target)` is `fromJDN(toJDN(a), target)`. Day arithmetic, `diff` in days and `dayOfWeek` work on the JDN.

Alternatives considered:

- Pairwise formulas: 6 conversions now, n(n−1) later.
- JavaScript `Date` as the pivot: time zones and DST leak into pure day arithmetic.

## Consequences

- Adding a calendar is two functions and their tests.
- One integer per day keeps comparisons and day arithmetic trivial.
