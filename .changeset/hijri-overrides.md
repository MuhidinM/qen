---
'@qen/core': minor
---

Add official Hijri month overrides (`hijri: { overrides: [{ hijriYear, hijriMonth, startsOn, source }] }`). An announced month start wins for its month, before the user offset; impossible overrides are rejected. `explainHijri` reports `decidedBy: 'override'` with the source.
