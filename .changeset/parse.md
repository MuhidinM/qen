---
'@qen/core': minor
---

Add `parse(text, { calendar, locales, hijri })` with calendar detection from era markers and month names, Ge'ez and Arabic-Indic numerals, and `AmbiguousDateError` (with every valid reading) instead of guessing when the calendar can't be decided.
