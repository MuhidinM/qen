---
'@qen/core': minor
---

Add `HijriSettings` with an `offset` of −2 to +2 days (`hijri: { method, offset }`) to match local moon sighting. Every function that handles Hijri dates applies it, including formatting, parsing, `today`, holidays and observances. `explainHijri` now reports `decidedBy`.
