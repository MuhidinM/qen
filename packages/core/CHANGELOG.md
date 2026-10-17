# @qen/core

## 0.1.0

### Minor Changes

- d164d66: Add `addDays()`, `addMonths()` and `addYears()`. Negative amounts subtract. Month and year arithmetic happens in the date's own calendar (13 months for Ethiopian) and clamps to the month's last day, e.g. Hamle 30 + 2 months → Pagume 5 (or 6 in a leap year).
- 58af1dd: Add `age(birth, on)` returning `{ years, months, days }`, counted in the birth date's calendar (13 months for Ethiopian). Pagume 6, 29 February and Hijri 30th birthdays are reached on the month's last day in years without them.
- 88dd771: Add `dayOfWeek()` (0 = Sunday), `daysInMonth()`, `monthsInYear()` and `isLeapYear()` for all three calendars. Hijri month lengths and leap years follow the chosen method (Umm al-Qura by default).
- 743bfaf: Add `compare()` (usable as a sort comparator), `isSame()` and `diff(from, to, unit)` for days, weeks, months and years. Dates in different calendars compare by the day they fall on; months and years are counted in the calendar of `from`, consistent with `addMonths`/`addYears`.
- 3116fc1: Add `convert()`, `toJDN()` and `fromJDN()` for Gregorian, Ethiopian (Amete Mihret) and Hijri dates, all through the Julian Day Number.
- 953dd39: Add `date()`, `isValid()`, `InvalidDateError` and the `CalendarDate` / `CalendarId` types. Dates are frozen plain objects with 1-based months; invalid dates throw with a clear message such as "Pagume 6 does not exist in 2018 EC".
- 1dbd894: Add `toEthiopianTime()` and `fromEthiopianTime()`. Ethiopian hours start at 06:00 (07:00 → 1, 18:00 → 12); a `period` (`morning`, `afternoon`, `evening`, `night`) tells apart the hours that repeat.
- 6615098: Add `format(date, pattern, { locale, numerals, hijri })` with LDML-style tokens (`y`, `yy`, `yyyy`, `M`…`MMMM`, `d`, `dd`, `E`…`EEEE`, `G`…`GGGG`, quoted literals). Names come from an imported locale; numerals can be Latin, Arabic-Indic or Ge'ez. Code that doesn't use Hijri dates no longer carries the Umm al-Qura table when bundled.
- 1a79155: Add `toGeezNumeral()` and `fromGeezNumeral()` for Ge'ez (Ethiopic) numerals, following the W3C CSS `ethiopic-numeric` algorithm (e.g. 2019 → ፳፻፲፱, 10,000 → ፼).
- 6e5086e: Add `fromJSDate()` and `toJSDate()`. `fromJSDate` reads the local (or UTC) wall-clock day and applies each calendar's day boundary: Ethiopian days start at 06:00 and Hijri days at sunset (computed from an optional `location`, otherwise 18:00); `boundary: 'midnight'` gives the civil rule. `toJSDate` returns 12:00 on the matching Gregorian day, so the two round-trip.
- 4b0b370: Add the `Locale` type and English and Amharic locales as separate entry points: `@qen/core/locales/en` and `@qen/core/locales/am`. Each has month names for all three calendars, weekday names, era labels and Ethiopian time period names. The Amharic locale is marked `reviewed: false` until a native speaker has checked it.
- 6a75d64: Add Afaan Oromo, Tigrinya and Arabic locales: `@qen/core/locales/om`, `@qen/core/locales/ti` and `@qen/core/locales/ar` (right-to-left). All three are marked `reviewed: false` until native speakers have checked them.
- 4f67256: Add `parse(text, { calendar, locales, hijri })` with calendar detection from era markers and month names, Ge'ez and Arabic-Indic numerals, and `AmbiguousDateError` (with every valid reading) instead of guessing when the calendar can't be decided.
- ea93ac0: Add `today(calendar, { now?, utc?, boundary?, location?, hijri? })`, the only function that reads the system clock (and only when `now` is omitted). It applies each calendar's day boundary: Ethiopian days start at 06:00, Hijri days at sunset.
- ed974f0: Add the Umm al-Qura Hijri method and make it the default (`hijri: { method: 'umalqura' }`), with a table covering 1300–1500 AH (1882–2077) and a seamless tabular fallback outside it. Add `explainHijri()`, which reports the method that decided a Hijri date and whether it fell back to tabular.
