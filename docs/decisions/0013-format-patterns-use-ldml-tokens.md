# ADR-0013 · `format()` uses LDML-style pattern tokens; names come from an imported locale

**Status:** accepted · 2026-10-17

## Context

`format()` must cover three calendars, five locales and three numeral systems (N-012), while keeping locale data out of apps that don't use it (R-FMT-03).

## Decision

- Patterns use a subset of Unicode LDML tokens: `y`, `yy`, `yyyy`, `M`, `MM`, `MMM`, `MMMM`, `d`, `dd`, `E`…`EEEE`, `G`…`GGGG`. Text in single quotes is literal; `''` is an apostrophe; other non-letters pass through. Any other letter run throws `RangeError`.
- Name tokens (`MMM`, `MMMM`, `E…`, `G…`) need `options.locale`, imported from `@qen/core/locales/*`. Numeric-only patterns need no locale. There is no default locale, so nothing pulls locale data into the main bundle.
- `numerals: 'latin' | 'arabic' | 'geez'`. Arabic-Indic keeps padding; Ge'ez writes each number with `toGeezNumeral` and never pads (`yy` = 00 throws, since Ge'ez has no zero).
- Weekdays use the Hijri method in `options` (the same Hijri date can fall on different weekdays).

Alternatives considered:

- `Intl.DateTimeFormat` options objects: no Afaan Oromo or Tigrinya data for Ethiopian months, no Ge'ez numerals (ADR-0004).
- A custom token set (e.g. `{month}`): unfamiliar; LDML is what `Intl`, date-fns and ICU users already know.
- A default English locale: would put English names into every bundle.

## Consequences

- `parse()` (#24) reuses the locale names and accepts the same numeral systems.
- Bundle budgets are now per import (size-limit `import`), with the main entry at 6 kB for everything; module-level tables are written so bundlers can drop them.
