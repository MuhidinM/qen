# ADR-0006 · Hijri: Umm al-Qura table with tabular fallback, then overrides, then user offset

**Status:** accepted · 2026-10-13

## Context

Hijri months start on moon sighting, so any calculated date can be a day off from what Ethiopian Muslims observe. Users need a predictable default and a way to match local announcements.

## Decision

- Base methods: Umm al-Qura, from a committed table (about 1300–1500 AH) generated from `Intl` `islamic-umalqura` and cross-checked with a published calendar; and tabular (arithmetic, civil epoch).
- Outside the table, Umm al-Qura falls back to tabular and the result is flagged. (Amended 2026-10-17: `explainHijri()` reports the method used and the fallback; both methods start 1300 and 1501 AH on the same day, so the fallback has no seam.)
- Then official overrides (confirmed month starts, each with a source), then the user offset (−2…+2).
- Results record which step decided the date. Islamic holidays are `expected` until an override confirms them.
- Umm al-Qura is the default from the first release. (Amended 2026-10-17: the table and method moved into M1 so 0.1 ships with the final default; N-008.)

Alternatives considered:

- Astronomical crescent-visibility calculation: complex, and still not what authorities announce.
- Local announcements only: no dates for future years.

(Amended 2026-10-17, #42 and #43: an override decides its own month and is not shifted by the user offset, since an announced date is already local; the offset applies to every month without an override. Each override needs a source, and one that would give a neighbouring month fewer than 29 or more than 30 days is rejected as bad data. `explainHijri` reports `decidedBy` ('method' | 'override' | 'offset') and the override's source.)

## Consequences

- The table needs a regeneration script and a CI check that the committed copy matches it.
- Each override entry needs a trustworthy source (N-017).
