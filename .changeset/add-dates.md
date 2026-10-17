---
'@qen/core': minor
---

Add `addDays()`, `addMonths()` and `addYears()`. Negative amounts subtract. Month and year arithmetic happens in the date's own calendar (13 months for Ethiopian) and clamps to the month's last day, e.g. Hamle 30 + 2 months → Pagume 5 (or 6 in a leap year).
