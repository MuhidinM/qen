# ADR-0014 · `parse()` detects the calendar from explicit signals and never guesses

**Status:** accepted · 2026-10-17

## Context

Paste-and-detect (PLAN.md §3.3) must read text like `17/01/2019 EC`, `Meskerem 17, 2019`, `መስከረም 17 2019` and `15 Ramadan 1447`. Purely numeric text such as `17/01/2019` is a valid date in all three calendars, so a wrong guess would silently shift a date by years (N-011).

## Decision

- `parse(input, { calendar?, locales?, hijri? })` returns a `CalendarDate`.
- The calendar comes from signals, narrowed in this order: `options.calendar`, era markers (built-in EC, E.C., ዓ.ም., AD, G.C., AH, هـ, plus each passed locale's era labels), then month names. Contradicting signals throw `RangeError`.
- If more than one calendar remains, it throws `AmbiguousDateError` with every valid reading in `candidates`, even if only one of them is valid. If none is valid, it throws the `InvalidDateError`.
- Numbers: with a month name, the other two numbers are day and year (the year is the one above 31). Without one, day/month/year as written in Ethiopia, or year-month-day when the first number has four digits. Month-first (US) order is not supported.
- Month names, weekday names and era labels come only from the `locales` passed in, plus CLDR spellings as aliases (Tekemt, Hedar, …, ጳጉሜን). Names shared by two calendars in one locale (Oromo, Tigrinya) count for both, so a marker must decide.
- Ge'ez numerals and Arabic-Indic digits are read as numbers; weekday names and ቀን are ignored.

Alternatives considered:

- Guess from the year's size (e.g. 1447 must be Hijri): wrong for Gregorian/Ethiopian dates in that range and silently wrong when it fails.
- Return a list of candidates instead of throwing: callers would have to handle a list for every parse; the error carries the list for the rare ambiguous case.

## Consequences

- `parse(format(d, pattern, { locale }), { locales: [locale] })` returns `d` whenever the pattern includes an era or a calendar-unique month name (tested for all five locales).
- UIs should show the candidates from `AmbiguousDateError` and let the user choose.
