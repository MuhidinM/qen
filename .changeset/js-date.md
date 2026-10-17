---
'@qen/core': minor
---

Add `fromJSDate()` and `toJSDate()`. `fromJSDate` reads the local (or UTC) wall-clock day and applies each calendar's day boundary: Ethiopian days start at 06:00 and Hijri days at sunset (computed from an optional `location`, otherwise 18:00); `boundary: 'midnight'` gives the civil rule. `toJSDate` returns 12:00 on the matching Gregorian day, so the two round-trip.
