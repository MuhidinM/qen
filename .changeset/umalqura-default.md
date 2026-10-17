---
'@qen/core': minor
---

Add the Umm al-Qura Hijri method and make it the default (`hijri: { method: 'umalqura' }`), with a table covering 1300–1500 AH (1882–2077) and a seamless tabular fallback outside it. Add `explainHijri()`, which reports the method that decided a Hijri date and whether it fell back to tabular.
