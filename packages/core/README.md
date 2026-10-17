# @qen/core

Gregorian, Ethiopian and Hijri dates in one small, dependency-free library: conversion, arithmetic, formatting, parsing, Ge'ez numerals and Ethiopian time. Runs in Node, Deno, Bun, browsers and service workers.

> Pre-release (0.x). The API may change before 1.0. Locale names other than English are awaiting native-speaker review.

## Install

```sh
npm install @qen/core
```

## Quick start

```ts
import { addMonths, convert, date, diff, format, parse, toEthiopianTime } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { en } from '@qen/core/locales/en';

const meskel = date('ethiopian', 2019, 1, 17);

convert(meskel, 'gregorian'); // => { calendar: 'gregorian', year: 2026, month: 9, day: 27 }
convert(meskel, 'hijri'); // => { calendar: 'hijri', year: 1448, month: 4, day: 16 }

format(meskel, 'EEEE, MMMM d, y G', { locale: en }); // => 'Sunday, Meskerem 17, 2019 EC'
format(meskel, 'MMMM d ቀን y G', { locale: am }); // => 'መስከረም 17 ቀን 2019 ዓ.ም.'
format(meskel, 'MMMM d y', { locale: am, numerals: 'geez' }); // => 'መስከረም ፲፯ ፳፻፲፱'

parse('Meskerem 17, 2019', { locales: [en] }); // => { calendar: 'ethiopian', year: 2019, month: 1, day: 17 }
parse('17/01/2019 EC'); // => { calendar: 'ethiopian', year: 2019, month: 1, day: 17 }

addMonths(date('ethiopian', 2018, 11, 30), 2); // => { calendar: 'ethiopian', year: 2018, month: 13, day: 5 }
diff(date('ethiopian', 2019, 1, 1), date('ethiopian', 2019, 4, 29), 'days'); // => 118

toEthiopianTime({ hour: 7, minute: 30 }); // => { hour: 1, minute: 30, period: 'morning' }
```

Dates are plain, frozen objects with 1-based months: `{ calendar, year, month, day }`. They survive `JSON.stringify` and `structuredClone`. Every conversion goes through the Julian Day Number.

## Calendars

**Ethiopian** (Amete Mihret era): 12 months of 30 days, then Pagume with 5 days, or 6 when `year % 4 === 3`. Meskerem 1 falls on 11 September, or 12 September after a leap year (1900–2099).

```ts
import { date, isLeapYear, daysInMonth } from '@qen/core';

isLeapYear('ethiopian', 2015); // => true
daysInMonth('ethiopian', 2018, 13); // => 5
date('ethiopian', 2015, 13, 6); // => { calendar: 'ethiopian', year: 2015, month: 13, day: 6 }
```

`date('ethiopian', 2018, 13, 6)` throws `InvalidDateError: Pagume 6 does not exist in 2018 EC`.

**Hijri**: two methods.

- `umalqura` (default): the Umm al-Qura calendar of Saudi Arabia, from a table covering 1300–1500 AH (1882–2077). It matches `Intl`'s `islamic-umalqura` on every day of that range. Month starts for 1420–1449 AH (1999–2028) also match R. H. van Gent's published tables; outside those years, published reconstructions differ by a day in some months. Outside the table it falls back to `tabular` (where `Intl` uses ICU's own extrapolation up to 1600 AH).
- `tabular`: the arithmetic 30-year cycle with the civil epoch, the same as `Intl`'s `islamic-civil`.

Either may differ by a day from the month start announced locally after moon sighting. To follow local practice, pass `hijri: { offset }` (−2 to +2 days): +1 starts every month a day later. Officially announced month starts go in `hijri: { overrides: [{ hijriYear, hijriMonth, startsOn, source }] }`; each one wins for its month, and `explainHijri` tells you which step decided a date. Month starts observed in Ethiopia since 2024, each with a dated source, ship as `@qen/core/overrides/ethiopia`; with them, those Eid holidays come out `confirmed`.

```ts
import { convert, date, explainHijri } from '@qen/core';

const oct17 = date('gregorian', 2026, 10, 17);
convert(oct17, 'hijri'); // => { calendar: 'hijri', year: 1448, month: 5, day: 6 }
convert(oct17, 'hijri', { hijri: { method: 'tabular' } }); // => { calendar: 'hijri', year: 1448, month: 5, day: 5 }
explainHijri(date('gregorian', 2100, 1, 1)).fallback; // => true
convert(oct17, 'hijri', { hijri: { offset: 1 } }); // => { calendar: 'hijri', year: 1448, month: 5, day: 5 }
```

**Gregorian**: proleptic Gregorian. Years start at 1 in every calendar.

## Today, and when a day starts

`@qen/core` never reads the clock except in `today()` (pass `now` to control it). Turning an instant into a date respects each calendar's day boundary:

- Gregorian days start at midnight.
- Ethiopian days start at 06:00, the first hour of Ethiopian time.
- Hijri days start at sunset: computed when you pass a `location`, otherwise 18:00.

Pass `boundary: 'midnight'` for the civil rule that government systems and `Intl` use. Converting one date to another (`convert`) is not affected.

```ts
import { today, fromJSDate, toJSDate, date } from '@qen/core';

const now = new Date('2026-10-14T03:00:00Z');
today('ethiopian', { now, utc: true }); // => { calendar: 'ethiopian', year: 2019, month: 2, day: 3 }
today('ethiopian', { now, utc: true, boundary: 'midnight' }); // => { calendar: 'ethiopian', year: 2019, month: 2, day: 4 }
fromJSDate(new Date('2026-02-17T18:30:00Z'), 'hijri', { utc: true }); // => { calendar: 'hijri', year: 1447, month: 9, day: 1 }

toJSDate(date('ethiopian', 2019, 1, 1), { utc: true }).toISOString(); // => '2026-09-11T12:00:00.000Z'
```

`toJSDate` returns 12:00 on the matching day, so it round-trips under every boundary rule.

## Arithmetic and comparison

```ts
import { addDays, addMonths, addYears, age, compare, date, diff, isSame } from '@qen/core';

addDays(date('ethiopian', 2018, 13, 5), 1); // => { calendar: 'ethiopian', year: 2019, month: 1, day: 1 }
addYears(date('ethiopian', 2015, 13, 6), 1); // => { calendar: 'ethiopian', year: 2016, month: 13, day: 5 }
addMonths(date('gregorian', 2025, 1, 31), 1); // => { calendar: 'gregorian', year: 2025, month: 2, day: 28 }

diff(date('ethiopian', 2018, 11, 30), date('ethiopian', 2019, 1, 1), 'months'); // => 2
age(date('ethiopian', 1990, 1, 17), date('ethiopian', 2019, 2, 7)); // => { years: 29, months: 0, days: 20 }

isSame(date('ethiopian', 2019, 2, 7), date('gregorian', 2026, 10, 17)); // => true
compare(date('ethiopian', 2019, 1, 1), date('gregorian', 2026, 9, 12)); // => -1
```

Month and year arithmetic happens in the date's own calendar (13 months per Ethiopian year) and clamps to the last day of the month. `diff` counts months and years the same way, in the calendar of its first argument.

## Formatting

`format(date, pattern, options)` uses LDML-style tokens:

| Token             | Meaning                   | Meskerem 17, 2019 EC (en) |
| ----------------- | ------------------------- | ------------------------- |
| `y`, `yy`, `yyyy` | year                      | 2019, 19, 2019            |
| `M`, `MM`         | month number              | 1, 01                     |
| `MMM`, `MMMM`     | short / long month name   | Meskerem                  |
| `d`, `dd`         | day                       | 17                        |
| `E`…`EEE`, `EEEE` | short / long weekday      | Sun, Sunday               |
| `G`…`GGG`, `GGGG` | short / long era          | EC, Ethiopian Calendar    |
| `'text'`          | literal text (`''` = `'`) |                           |

Name tokens need a locale. Numerals can be `latin` (default), `arabic` (٠–٩) or `geez`.

```ts
import { date, format } from '@qen/core';
import { ar } from '@qen/core/locales/ar';

format(date('hijri', 1447, 9, 1), 'EEEE d MMMM y G', { locale: ar, numerals: 'arabic' }); // => 'الأربعاء ١ رمضان ١٤٤٧ هـ'
format(date('ethiopian', 2019, 1, 17), 'dd/MM/yyyy'); // => '17/01/2019'
```

### Locales

Each locale is its own import, so apps only ship the languages they use (about 0.6 kB each).

| Import                 | Language    | Reviewed by a native speaker |
| ---------------------- | ----------- | ---------------------------- |
| `@qen/core/locales/en` | English     | yes                          |
| `@qen/core/locales/am` | Amharic     | not yet                      |
| `@qen/core/locales/om` | Afaan Oromo | not yet                      |
| `@qen/core/locales/ti` | Tigrinya    | not yet                      |
| `@qen/core/locales/ar` | Arabic      | not yet (right-to-left)      |

## Parsing

`parse(text, options)` reads dates written by people and detects the calendar from an era marker (EC, ዓ.ም., AD, G.C., AH, هـ, or a locale's era label), a month name, or `options.calendar`. It reads Ge'ez numerals and Arabic-Indic digits.

```ts
import { parse } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { en } from '@qen/core/locales/en';

parse('15 Ramadan 1447', { locales: [en] }); // => { calendar: 'hijri', year: 1447, month: 9, day: 15 }
parse('መስከረም ፲፯ ፳፻፲፱', { locales: [am] }); // => { calendar: 'ethiopian', year: 2019, month: 1, day: 17 }
parse('17/01/2019', { calendar: 'gregorian' }); // => { calendar: 'gregorian', year: 2019, month: 1, day: 17 }
```

It never guesses: `parse('17/01/2019')` is a valid date in all three calendars, so it throws an `AmbiguousDateError` whose `candidates` list every reading. Numeric dates are read day/month/year, or year-month-day when the first number has four digits.

## Holidays

Ethiopian public holidays and religious observances, filterable by category (`public` by default, plus `orthodox`, `islamic`, `other`). A holiday's `date` is in its own calendar and `gregorian` gives the same day.

```ts
import { date, getHolidays, getHolidaysInRange, nextHoliday } from '@qen/core';

const holidays2026 = getHolidays(2026).map((h) => h.id);
holidays2026.slice(0, 6); // => ['genna', 'timket', 'adwa', 'eid-al-fitr', 'siklet', 'fasika']
getHolidays(2027).find((h) => h.id === 'fasika')?.gregorian; // => { calendar: 'gregorian', year: 2027, month: 5, day: 2 }
getHolidays(2026, { categories: ['orthodox'] }).length; // => 14
nextHoliday(date('gregorian', 2026, 9, 12))?.date; // => { calendar: 'ethiopian', year: 2019, month: 1, day: 17 }
getHolidaysInRange(date('ethiopian', 2018, 13, 1), date('ethiopian', 2019, 1, 17)).map((h) => h.id); // => ['enkutatash', 'meskel']
```

Public: Enkutatash, Meskel, Genna (always 7 January), Timket, Adwa, Siklet, Fasika, Labour Day, Patriots' Victory and the Downfall of the Derg. Public also includes Eid al-Fitr, Eid al-Adha and Mawlid. Orthodox: also the Fast of Nineveh, Abiy Tsom, Debre Zeit, Hosanna, Rekebe Kahnat, Erget, Peraklitos, Tsome Hawariyat and Tsome Dihnet, computed with `bahireHasab()` and checked against the Julian Easter date for 1900–2100. Islamic: also the Islamic New Year, Ashura, Isra and Mi'raj, the start of Ramadan, Laylat al-Qadr (marked `approximate`) and the Day of Arafah.

Islamic holidays follow the Hijri method you pass (`hijri: { method }`), can fall twice in one Gregorian year, and have `status: 'expected'`: the calculated date may differ by a day from the locally announced one.

### Fasts and Ramadan

`getObservances(start, end)` returns the periods that overlap a range, with both ends included: Abiy Tsom, Tsome Hawariyat, Tsome Filseta (Nehase 1–15), Tsome Nebiyat (Hidar 15 to the eve of Genna) and Ramadan.

```ts
import { date, getObservances } from '@qen/core';

const march10 = getObservances(date('gregorian', 2026, 3, 10), date('gregorian', 2026, 3, 10));
march10.map((o) => o.id); // => ['abiy-tsom', 'ramadan']
march10[1]?.endGregorian; // => { calendar: 'gregorian', year: 2026, month: 3, day: 19 }
```

`isWeeklyFast(date)` flags the Wednesday and Friday fasts, which are lifted from Fasika to Peraklitos and when Genna or Timket falls on them.

## Ge'ez numerals and Ethiopian time

```ts
import { fromEthiopianTime, fromGeezNumeral, toEthiopianTime, toGeezNumeral } from '@qen/core';

toGeezNumeral(2019); // => '፳፻፲፱'
fromGeezNumeral('፼'); // => 10000

toEthiopianTime({ hour: 18, minute: 0 }); // => { hour: 12, minute: 0, period: 'evening' }
fromEthiopianTime({ hour: 12, minute: 0, period: 'morning' }); // => { hour: 6, minute: 0 }
```

Ge'ez numerals follow the W3C CSS `ethiopic-numeric` algorithm.

## Errors

- `InvalidDateError`: the date doesn't exist (Pagume 6 in a common year, 31 April, a Hijri 30th the method doesn't have). Has `calendar`, `year`, `month`, `day` fields.
- `AmbiguousDateError`: `parse` couldn't decide the calendar; see `candidates`.
- `RangeError`: numbers out of range, such as `toGeezNumeral(0)` or `addDays(d, 1.5)`.

## Runtimes and size

- Node 22, 24, 26; Deno 2; Bun; modern browsers and service workers (ES2022). ESM and CommonJS, with TypeScript types.
- Zero dependencies. Tree-shakable: `toGeezNumeral` alone is about 0.3 kB, `date` + `convert` about 2 kB (including the Umm al-Qura table), the whole API about 6 kB (minified, brotli).

## Known limitations

- Amharic, Afaan Oromo, Tigrinya and Arabic names haven't been reviewed by native speakers yet.
- Browsers and service workers are supported by design (ES2022, no DOM or Node APIs) but not yet covered by an automated browser test.
- Official Hijri month confirmations (so Islamic dates can be marked `confirmed`) are planned for a later release.

## License

MIT
