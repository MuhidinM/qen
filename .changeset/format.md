---
'@qen/core': minor
---

Add `format(date, pattern, { locale, numerals, hijri })` with LDML-style tokens (`y`, `yy`, `yyyy`, `M`…`MMMM`, `d`, `dd`, `E`…`EEEE`, `G`…`GGGG`, quoted literals). Names come from an imported locale; numerals can be Latin, Arabic-Indic or Ge'ez. Code that doesn't use Hijri dates no longer carries the Umm al-Qura table when bundled.
