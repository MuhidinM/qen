---
'@qen/core': minor
---

Add `date()`, `isValid()`, `InvalidDateError` and the `CalendarDate` / `CalendarId` types. Dates are frozen plain objects with 1-based months; invalid dates throw with a clear message such as "Pagume 6 does not exist in 2018 EC".
