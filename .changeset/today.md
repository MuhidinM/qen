---
'@qen/core': minor
---

Add `today(calendar, { now?, utc?, boundary?, location?, hijri? })`, the only function that reads the system clock (and only when `now` is omitted). It applies each calendar's day boundary: Ethiopian days start at 06:00, Hijri days at sunset.
