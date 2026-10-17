# ADR-0006 · Hijri: Umm al-Qura table with tabular fallback, then overrides, then user offset

**Status:** accepted · 2026-10-13

## Context

Hijri months start on moon sighting, so any calculated date can be a day off from what Ethiopian Muslims observe. Users need a predictable default and a way to match local announcements.

## Decision

- Base methods: Umm al-Qura, from a committed table (about 1300–1500 AH) generated from `Intl` `islamic-umalqura` and cross-checked with a published calendar; and tabular (arithmetic, civil epoch).
- Outside the table, Umm al-Qura falls back to tabular and the result is flagged.
- Then official overrides (confirmed month starts, each with a source), then the user offset (−2…+2).
- Results record which step decided the date. Islamic holidays are `expected` until an override confirms them.
- Umm al-Qura is the default from the first release. (Amended 2026-10-17: the table and method moved into M1 so 0.1 ships with the final default; N-008.)

Alternatives considered:

- Astronomical crescent-visibility calculation: complex, and still not what authorities announce.
- Local announcements only: no dates for future years.

## Consequences

- The table needs a regeneration script and a CI check that the committed copy matches it.
- Each override entry needs a trustworthy source (N-017).
