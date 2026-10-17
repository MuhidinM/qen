---
'@qen/core': minor
---

Add `compare()` (usable as a sort comparator), `isSame()` and `diff(from, to, unit)` for days, weeks, months and years. Dates in different calendars compare by the day they fall on; months and years are counted in the calendar of `from`, consistent with `addMonths`/`addYears`.
