# PLAN.md: Qen multi-calendar toolkit

Name: **Qen** (ቀን), npm scope `@qen` (confirmed 2026-10-13).

This file has five parts:

1. Vision
2. Architecture
3. Feature spec (what everything does)
4. Roadmap (phase scope; status lives in GitHub and docs/backlog.md)
5. Reference data, test anchors, open questions, decisions log

---

## 1. Vision

Ethiopian apps, websites, and people constantly deal with three calendars at once: Gregorian for international work, Ethiopian for daily life and government, and Hijri for Islamic observances. Most developers hand-roll fragile conversions, and most users switch between separate apps or do mental math.

Qen solves this with **one reliable engine** and several products on top of it:

- **For developers:** an npm library (`@qen/core`) for conversion, arithmetic, formatting, parsing, and holidays, plus ready-made React components (`@qen/react`).
- **For everyone:** a website with converter and holiday pages, a browser extension, calendar subscriptions (ICS), and later a desktop tray app.

What makes it different from existing tools:

- All three calendars in one place, usable alone or combined.
- Correct movable Orthodox holidays via **Bahire Hasab**.
- **Honest Hijri dates:** configurable calculation method, a user offset, and an official override feed, with Islamic holidays marked _expected_ until confirmed.
- **Recurring events in any calendar** exported to Google/Outlook/Apple Calendar, which they cannot do natively.

---

## 2. Architecture

```
qen/
├── packages/
│   ├── core/        @qen/core   zero-dependency TS engine
│   ├── locales/     @qen/locales (optional split if locale data gets large)
│   └── react/       @qen/react  UI components + design tokens
├── apps/
│   ├── web/         Next.js: landing, converter, docs, holiday pages
│   ├── extension/   Chrome + Firefox (Manifest V3)
│   ├── feeds/       serverless: Hijri override feed + ICS subscriptions
│   └── desktop/     Tauri tray app (last)
├── CLAUDE.md
└── PLAN.md
```

**Rule:** apps never contain calendar logic. If an app needs a calculation, it goes into `core` first, with tests.

### Core data model

```ts
type CalendarId = 'gregorian' | 'ethiopian' | 'hijri';

interface CalendarDate {
  calendar: CalendarId;
  year: number;
  month: number; // 1-based
  day: number;
}

interface HijriSettings {
  method: 'umalqura' | 'tabular';
  offset: -2 | -1 | 0 | 1 | 2; // user adjustment in days
  overrides?: HijriOverride[]; // confirmed month starts
}

interface HijriOverride {
  hijriYear: number;
  hijriMonth: number;
  startsOn: { year: number; month: number; day: number }; // Gregorian
  source: string; // who announced it
}
```

Every conversion goes `CalendarDate → JDN → CalendarDate`. Each calendar implements only `toJDN` and `fromJDN`.

### Core API (target shape, refine in Phase 1)

```ts
// creation & validation
date('ethiopian', 2019, 1, 17)          // throws InvalidDateError if invalid
isValid(d)
today(calendar, { now?: Date, hijri?: HijriSettings })

// conversion
convert(d, 'gregorian', { hijri? })
toJDN(d) / fromJDN(jdn, calendar)
fromJSDate(jsDate, calendar) / toJSDate(d)

// info
dayOfWeek(d)                // 0 = Sunday
daysInMonth(calendar, year, month)
monthsInYear(calendar, year)
isLeapYear(calendar, year)

// arithmetic
addDays(d, n) / addMonths(d, n) / addYears(d, n)   // month/year math clamps the day
diff(a, b, unit)            // 'days' | 'weeks' | 'months' | 'years'
age(birth, on?)             // { years, months, days }
compare(a, b) / isSame(a, b)

// formatting & parsing
format(d, pattern, { locale, numerals })   // numerals: 'latin' | 'geez' | 'arabic'
parse(input, { calendar?, locale? })       // detects calendar if not given
toGeezNumeral(n) / fromGeezNumeral(s)

// Ethiopian time
toEthiopianTime({ hour, minute })   // → { hour, minute, period }
fromEthiopianTime(...)

// holidays
getHolidays(gregorianYear, { categories?, hijri? })
getHolidaysInRange(start, end, opts)
nextHoliday(from, opts)
getObservances(...)   // multi-day periods: fasts, Ramadan
bahireHasab(ethiopianYear)   // full computus output
```

---

## 3. Feature spec

### 3.1 Calendars

**Gregorian.** Proleptic Gregorian calendar via JDN.

**Ethiopian (Amete Mihret era).**

- 13 months: 12 × 30 days, then Pagume with 5 days (6 in leap years).
- Leap year when `year % 4 === 3` (Pagume has 6 days).
- New year (Meskerem 1) falls on 11 September, or 12 September in a year that follows an Ethiopian leap year (Pagume 6), for new years from 1900 to 2099. The shortcut "12 September when the following Gregorian year is a leap year" fails in 2099 (Meskerem 1, 2092 EC = 12 Sep 2099, but 2100 is not a leap year); corrected 2026-10-17, N-026.
- JDN formula: `JDN = 1724221 + 365*(y-1) + floor(y/4) + 30*(m-1) + d - 1`. Confirm against test anchors before trusting.

**Hijri.**

- 12 lunar months of 29 or 30 days.
- **Tabular method:** arithmetic 30-year cycle; leap years are 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 of each cycle. Civil epoch JDN 1948440.
- **Umm al-Qura method (default):** a lookup table of month starts. Generate it with a build script using `Intl.DateTimeFormat` with `calendar: 'islamic-umalqura'` in Node, covering roughly 1300–1500 AH, and commit the generated table. Outside the table range, fall back to tabular and flag the result.
- **Adjustment pipeline:** base method → apply official overrides for any month that has one → apply user offset. The output records which step decided the date.

### 3.2 Viewing (React components + all apps)

- Today's date in all three calendars.
- Primary calendar choice; one or both other calendars shown as secondary numbers inside each day cell.
- Month view, year view, agenda (list) view.
- Week can start on Sunday or Monday.
- Holiday markers on days, with a legend and filters.
- Locales: Amharic, Afaan Oromo, Tigrinya, English, Arabic. Ge'ez numerals optional. Arabic renders right-to-left.

### 3.3 Converting and calculating

- Convert any date between any two calendars.
- Day of the week for any date.
- Add or subtract days, months, or years in any calendar.
- Difference between two dates in days/weeks/months/years.
- Countdown to a date or holiday.
- Age calculator, including from an Ethiopian birth date.
- Ethiopian time clock and converter (7:00 international = 1:00 Ethiopian; the day starts at 6:00 = 12 o'clock).
- Paste-and-detect: parse strings like `17/01/2019 EC`, `Meskerem 17, 2019`, `መስከረም 17 2019`, `15 Ramadan 1447` and detect the calendar.

### 3.4 Holidays and observances

Each holiday has an id, names per locale, category (`public`, `orthodox`, `islamic`, `other`), calendar of origin, rule type (`fixed` or `computed`), and for Islamic holidays a status (`expected` or `confirmed`).

**Fixed-date (Phase 3):**

- Enkutatash: Meskerem 1
- Meskel: Meskerem 17 (VERIFY whether it shifts after leap years)
- Genna: Tahsas 29, aligned with 7 January (VERIFY the leap-year rule; some years it is Tahsas 28)
- Timket: Tir 11 (VERIFY leap-year shift)
- Adwa Victory Day: Yekatit 23
- International Labour Day: 1 May (Gregorian)
- Patriots' Victory Day: Miyazia 27
- Downfall of the Derg: Ginbot 20

The list of official public holidays must be confirmed against an official Ethiopian government source before release (VERIFY).

**Orthodox computed (Phase 4), via Bahire Hasab.**
Compute the date of Tsome Nenewe (Fast of Nineveh), then derive the others by offset in days from it:

| Event                         | Offset from Nineveh |
| ----------------------------- | ------------------- |
| Tsome Nenewe (Nineveh)        | 0                   |
| Abiy Tsom (Great Lent) begins | +14                 |
| Debre Zeit                    | +41                 |
| Hosanna                       | +62                 |
| Siklet (Good Friday)          | +67                 |
| Fasika (Easter)               | +69                 |
| Rekebe Kahnat                 | +93                 |
| Erget (Ascension)             | +108                |
| Peraklitos (Pentecost)        | +118                |
| Tsome Hawariyat begins        | +119                |
| Tsome Dihnet                  | +121                |

Fasika (Nineveh + 69) is verified: it matches the section 5 anchors and equals Meeus' Julian Easter for every year 1900–2100 (2026-10-17, #36). All other offsets are verified too: each falls on its fixed weekday and at its liturgical distance from Fasika (Hosanna −7, Siklet −2, Erget +39, Peraklitos +49, …) for every year 1900–2100 (#35).

**Islamic computed (Phase 4), from Hijri dates:**

- Public in Ethiopia: Eid al-Fitr (1 Shawwal), Eid al-Adha (10 Dhu al-Hijjah), Mawlid (12 Rabi al-Awwal).
- Observances: Islamic New Year (1 Muharram), Ashura (10 Muharram), Isra and Mi'raj (27 Rajab), start of Ramadan, Laylat al-Qadr (27 Ramadan, approximate), Day of Arafah (9 Dhu al-Hijjah).
- Multi-day period: Ramadan (whole month).

**Orthodox fasting periods (Phase 4, observances):** Abiy Tsom, Tsome Hawariyat, Tsome Filseta (Nehase 1–15), Tsome Nebiyat (VERIFY start date), plus weekly Wednesday and Friday fasts (as an optional flag, not shown as holidays).

**Filtering:** users and developers choose categories. Default view shows public holidays only.

### 3.5 Hijri adjustment (user-facing)

- Settings: calculation method, offset (−2 to +2), and "use official confirmations" on/off.
- Islamic holidays show an _Expected_ badge until an override confirms the month start, then _Confirmed_, with the source shown on hover.
- Phase 5: overrides bundled in the package. Phase 9: fetched from the hosted feed, with the bundled data as the offline fallback.

### 3.6 Personal events and calendar export (Phase 9)

- Create an event that recurs yearly or monthly by a chosen calendar (e.g., Meskerem 1 every Ethiopian year, or 15 Shawwal every Hijri year).
- Export as a one-time `.ics` file or subscribe via a URL that Google Calendar, Outlook, and Apple Calendar refresh automatically.
- Holiday subscription feeds per category (public, Orthodox, Islamic) and locale.
- Because external calendars can't express these recurrences, the feed expands each event into explicit dates for the next 10 years.

### 3.7 Website (`apps/web`)

- Landing page explaining both products (library + user tools) with a live "today in three calendars" hero.
- Converter tool with paste-and-detect.
- Full calendar app (installable as a PWA).
- Docs for `@qen/core` and `@qen/react` with live, editable examples.
- Holiday pages generated statically per holiday per year ("When is Meskel 2027?") for search traffic.
- Links to npm, GitHub, Chrome Web Store, Firefox Add-ons.

### 3.8 Browser extension (`apps/extension`)

1. **Popup:** today in three calendars, converter, upcoming holidays, settings (locale, primary calendar, Hijri settings).
2. **Select-to-convert:** select a date on any page and see it in the other calendars in a small tooltip.
3. **Google Calendar overlay:** show Ethiopian and/or Hijri dates next to Gregorian ones in Google Calendar. The hardest part: Google's DOM changes without notice, so isolate selectors in one file and fail quietly if they break.

Permissions: request the minimum; no data leaves the browser except fetching the Hijri override feed.

### 3.9 Desktop app (`apps/desktop`, last)

Tauri tray app showing the Ethiopian date and time in the tray, with a click-open panel (converter + upcoming holidays) and holiday notifications.

---

## 4. Roadmap

Scope per phase. Status lives in GitHub milestones and issues, mirrored in [docs/backlog.md](docs/backlog.md) (ADR-0010). Phase N = milestone MN.

### Stage 1: Core library

#### Phase 0: Project setup

- Confirm project name with owner (VERIFY)
- Init monorepo: pnpm workspaces, Turborepo, root tsconfig (strict)
- Create `packages/core` with tsup build (ESM + CJS + d.ts)
- Vitest configured with coverage
- ESLint + Prettier
- Changesets configured
- GitHub Actions: lint, typecheck, test, build on push/PR
- README stub and LICENSE (MIT unless owner says otherwise)

**Done when:** an empty `core` package builds, tests pass in CI, and it could be published.

#### Phase 1: Calendar conversion

- `CalendarDate` type, `date()` constructor, `InvalidDateError`
- Gregorian `toJDN` / `fromJDN` + validation
- Ethiopian `toJDN` / `fromJDN` + validation (Pagume 5/6, leap years)
- Hijri tabular `toJDN` / `fromJDN` + validation
- Umm al-Qura table + `toJDN` / `fromJDN` (moved from Phase 5, 2026-10-17)
- Day boundaries for instants: Gregorian midnight, Ethiopian dawn, Hijri sunset
- `convert()` between all pairs
- `fromJSDate` / `toJSDate`
- Test anchors from section 5 all pass
- Property tests: round-trip `fromJDN(toJDN(d)) === d` for every day 1900–2100 in each calendar
- Cross-check Ethiopian and Hijri output against `Intl.DateTimeFormat` (`ethiopic`, `islamic-civil`) for every day 1900–2100

**Done when:** every date converts correctly in all directions, with round-trip and Intl cross-checks green.

#### Phase 2: Everyday utilities → first npm release

- `dayOfWeek`, `daysInMonth`, `monthsInYear`, `isLeapYear`
- `addDays`, `addMonths`, `addYears` with day clamping (e.g., Hamle 30 + 2 months → Pagume 5 or 6)
- `diff`, `compare`, `isSame`, `age`
- Locale data: English + Amharic (month names, weekday names, era labels)
- Locale data: Afaan Oromo, Tigrinya, Arabic (VERIFY all names with native speakers)
- `format()` with patterns and numeral systems
- Ge'ez numerals: `toGeezNumeral`, `fromGeezNumeral` (tests up to 99,999)
- `parse()` with calendar detection
- Ethiopian time conversion
- TSDoc on all public functions
- README with install + quick-start examples
- Publish `@qen/core@0.1.0`

**Done when:** v0.1 is live on npm. First portfolio milestone.

#### Phase 3: Fixed-date holidays

- Holiday data model (id, names, category, rule, status)
- Confirm official public holiday list and leap-year rules (VERIFY)
- Implement fixed-date holidays from section 3.4
- `getHolidays`, `getHolidaysInRange`, `nextHoliday`, category filters
- Holiday names in all five locales (VERIFY)

#### Phase 4: Computed holidays

- `bahireHasab(year)` computus
- Orthodox movable feasts and fasts from the offset table
- Fasika matches anchors and the Julian-Easter cross-check for 1900–2100
- Islamic holidays and observances from Hijri dates
- Multi-day observances (`getObservances`): Ramadan, Abiy Tsom, Tsome Filseta, etc.

#### Phase 5: Hijri adjustment → core v1.0

- `HijriSettings` threaded through conversion, `today`, and holidays
- Override table + pipeline (method → overrides → offset)
- Holiday `expected` / `confirmed` status
- Seed overrides with recent confirmed Ethiopian Eid announcements (VERIFY each with source)
- Publish `@qen/core@1.0.0`

**Done when:** core v1.0 is published. The engine is complete.

### Stage 2: Visible products

#### Phase 6: React components

- Create `packages/react`; design tokens per CLAUDE.md (Refactoring UI)
- `<CalendarGrid>` month view, keyboard accessible
- `<DatePicker>` (single date, any primary calendar)
- Secondary-calendar overlay in day cells
- Holiday markers + legend
- `<DateRangePicker>`
- `<EthiopianTimeInput>`
- RTL support for Arabic; Ge'ez numeral display
- Light/dark mode
- Storybook (or Ladle) with every component and state
- Publish `@qen/react@0.1.0`

#### Phase 7: Website

- Next.js app in `apps/web`, using `@qen/react`
- Landing page + "today in three calendars" hero
- Converter with paste-and-detect
- Full calendar view + PWA install
- Docs site for core + react with live examples
- Static holiday pages per holiday per year
- Deploy (Vercel or similar), custom domain

#### Phase 8: Browser extension

- Manifest V3 scaffold (Vite-based build) in `apps/extension`
- Popup: today, converter, upcoming holidays, settings
- Select-to-convert tooltip
- Google Calendar overlay (selectors isolated in one module)
- Publish to Chrome Web Store
- Publish to Firefox Add-ons

### Stage 3: Services and extras

#### Phase 9: Hosted feeds

- Serverless app in `apps/feeds`
- Hijri override JSON feed (versioned, cached, with fallback in core)
- Simple admin flow for the owner to add a confirmed month start
- Holiday ICS feeds per category and locale
- Personal recurring events → ICS subscription URL
- Hook website + extension up to the live feed

#### Phase 10: Desktop app

- Tauri app in `apps/desktop`
- Tray shows Ethiopian date and time
- Panel: converter + upcoming holidays
- Holiday notifications
- Installers for Windows, macOS, Linux

---

## 5. Reference data

### Month names

| #   | Ethiopian (Amharic) | Ethiopian (Latin) | Hijri             |
| --- | ------------------- | ----------------- | ----------------- |
| 1   | መስከረም               | Meskerem          | Muharram          |
| 2   | ጥቅምት                | Tikimt            | Safar             |
| 3   | ኅዳር                 | Hidar             | Rabi al-Awwal     |
| 4   | ታኅሣሥ                | Tahsas            | Rabi al-Thani     |
| 5   | ጥር                  | Tir               | Jumada al-Ula     |
| 6   | የካቲት                | Yekatit           | Jumada al-Akhirah |
| 7   | መጋቢት                | Megabit           | Rajab             |
| 8   | ሚያዝያ                | Miyazia           | Sha'ban           |
| 9   | ግንቦት                | Ginbot            | Ramadan           |
| 10  | ሰኔ                  | Sene              | Shawwal           |
| 11  | ሐምሌ                 | Hamle             | Dhu al-Qa'dah     |
| 12  | ነሐሴ                 | Nehase            | Dhu al-Hijjah     |
| 13  | ጳጉሜ                 | Pagume            | —                 |

Amharic weekdays (Sunday first): እሑድ, ሰኞ, ማክሰኞ, ረቡዕ, ሐሙስ, ዓርብ, ቅዳሜ.

Afaan Oromo, Tigrinya, and Arabic-script names: to be supplied and verified by the owner or native speakers (VERIFY).

### Ge'ez numerals

Ones ፩–፱ (1–9), tens ፲–፺ (10–90), ፻ = 100, ፼ = 10,000. There is no zero.

### Ethiopian time

`ethHour = ((hour24 + 6) % 12) || 12`. Examples: 07:00 → 1, 06:00 → 12 (morning), 18:00 → 12 (evening), 13:00 → 7.

### Test anchors (must pass)

| Check                                  | Expected                                        |
| -------------------------------------- | ----------------------------------------------- |
| Meskerem 1, 2016 EC                    | 12 September 2023 (year after leap)             |
| Meskerem 1, 2019 EC                    | 11 September 2026                               |
| 2015 EC is a leap year                 | Pagume has 6 days                               |
| 2018 EC is not a leap year             | Pagume has 5 days                               |
| Fasika 2024                            | 5 May 2024                                      |
| Fasika 2025                            | 20 April 2025                                   |
| Fasika 2026                            | 12 April 2026                                   |
| Fasika 2027                            | 2 May 2027                                      |
| 1 Muharram 1 AH (tabular, civil epoch) | JDN 1948440 = 19 July 622 (proleptic Gregorian) |
| 1 Ramadan 1447 (tabular)               | 18 February 2026                                |
| 1 Shawwal 1447 (tabular)               | 20 March 2026                                   |
| 5 Jumada al-Ula 1448 (tabular)         | 17 October 2026                                 |
| 1447 AH is a tabular leap year         | Dhu al-Hijjah has 30 days                       |

Tabular Hijri anchors come from `Intl` `islamic-civil` (ICU 77.1). Umm al-Qura anchors are added with #41, from `Intl` and cross-checked with at least one published Umm al-Qura calendar.

---

## 6. Open questions

Detailed gaps and conflicts, with defaults, are in [docs/spec-notes.md](docs/spec-notes.md).

- [x] Final project name and npm scope: `qen`, `@qen` org owned by the owner
- [x] License: MIT
- [ ] Default Hijri method for Ethiopian users (Umm al-Qura vs. following local announcements only)
- [ ] Official source for Ethiopian public holidays and Eid confirmations
- [ ] Leap-year behavior of Genna, Timket, and Meskel
- [ ] Locale names for Afaan Oromo, Tigrinya, Arabic
- [ ] Monetization: free library + paid extras (premium extension features? hosted API tier?)
- [ ] Vue/Svelte component packages later? (only after React proves itself)

---

## 7. Decisions log

Add entries as `YYYY-MM-DD: decision (reason)`.

- 2026-10-13: Build order is easiest to hardest: core → react → web → extension → feeds → desktop.
- 2026-10-13: All calendar logic lives in `@qen/core`; apps contain none.
- 2026-10-13: Conversion goes through the Julian Day Number.
- 2026-10-13: Hijri uses method → overrides → user offset, with expected/confirmed holiday status.
- 2026-10-13: UI follows Refactoring UI.
- 2026-10-13: Desktop app deferred to last; the website PWA covers desktop use until then.
- 2026-10-13: Name stays `qen`; owner created the `@qen` npm org. The unrelated `qen.js` package (Ethiopian dates) exists; accepted the overlap since our packages are scoped.
- 2026-10-13: License MIT. Repo is public at github.com/MuhidinM/qen.
- 2026-10-13: TypeScript pinned to 6.0.x because typescript-eslint 8 does not support TS 7 yet. tsup's d.ts step sets `ignoreDeprecations: '6.0'` for the `baseUrl` it injects.
- 2026-10-13: Root tsconfig adds `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` on top of `strict` (calendar math indexes month tables; this catches off-by-one lookups).
- 2026-10-13: CI runs on Node 22; local dev uses Node 24.
- 2026-10-13: Adopted the project-flow process: requirements, ADRs, spec notes and backlog in `docs/`; work tracked as GitHub issues under milestones M0–M10 and the "Qen roadmap" board (ADR-0010).
- 2026-10-13: One monorepo for every package and app (ADR-0001). Desktop stays Tauri, confirmed by owner (ADR-0008). No native mobile app; the PWA covers phones (ADR-0009).
- 2026-10-13: Owner allows creating issues/labels/milestones/board, pushing branches, opening PRs and merging on green CI without asking. npm publishing, store submissions, deploys and repo settings still need the owner.
- 2026-10-17: Umm al-Qura table and method move into Phase 1 so `@qen/core@0.1.0` ships with the final Hijri default (owner: "the best one"; N-008, ADR-0006 amended).
- 2026-10-17: Day boundaries differ per calendar (owner): Gregorian at midnight, Ethiopian in the morning (06:00), Hijri at sunset. Applied when turning an instant into a date; date-to-date conversion is unchanged (ADR-0012, N-005).
- 2026-10-17: Owner delegated the open facts (holiday list and leap-year shifts, locale names, Tsome Nebiyat, weekly fasts) to Claude's best knowledge plus CLDR. Recorded in N-016 to N-019, marked "review before 1.0", tracked in T-068 (#55).
- 2026-10-17: Supported Node versions are 22, 24 and 26 (`engines: >=22`). Node 20 reached end of life in April 2026. CI smoke-tests the packed tarball in each, plus Deno 2 and Bun.
- 2026-10-17: Corrected PLAN.md §3.1 new-year rule: 12 September follows an Ethiopian leap year; the "following Gregorian leap year" shortcut fails in 2099. Found by the Ethiopian tests (#9), confirmed with Intl ethiopic (ICU 77.1). N-026.
- 2026-10-17: `age(birth, on)` takes `on` as a required argument (PLAN.md §2 had `on?`), because core never reads the clock (CLAUDE.md); callers pass `today(calendar)`.
- 2026-10-17: Ge'ez numerals follow the W3C CSS Counter Styles Level 3 `ethiopic-numeric` algorithm (a group's ፩ is dropped only when the group is the most significant or sits before ፻), checked against Wikipedia's worked examples (475, 1889, 83,692). (#22)
- 2026-10-17: Ethiopian time periods are morning 06–12, afternoon 12–18, evening 18–24, night 00–06 (international time); they disambiguate repeated hours in `fromEthiopianTime`. Owner-delegated, review before 1.0 with the locale names (T-068). (#25)
- 2026-10-17: Holiday list and leap-year rules (N-016, N-017) checked against Wikipedia, "Public holidays in Ethiopia" (https://en.wikipedia.org/wiki/Public_holidays_in_Ethiopia): same 13 holidays; Genna fixed on 7 January; Timket 19/20 January; Meskel 27/28 September. The proclamation text itself was not found online; confirming it moves to #55. (#30)
- 2026-10-18: Bundled Ethiopian Hijri overrides (#45) come from dated news reports of each Eid celebration (Fana, Ethiopian News Agency via AllAfrica), not the Supreme Council's own announcements, which were not found online. Eid al-Adha 2024 is omitted (only a calendar site gave it). All five months so far match Umm al-Qura. They are opt-in, as `@qen/core/overrides/ethiopia`, matching the "use official confirmations" setting in §3.5.
- 2026-10-18: Owner approved starting M6 (React components) while the M5 reviews (#46 API report, #55 native-speaker/proclamation review) and 1.0 (#47) are pending (CLAUDE.md rule 1 exception). M6 split into #111–#118; personality: neutral, professional Refactoring UI defaults (system fonts, blue primary, cool greys, small radii).
- 2026-10-17: Owner reviewed the API report (#46) and kept `toJSDate` at noon, `InvalidDateError.calendar` as `string` and kebab-case English holiday ids; the API is locked for 1.0.
- 2026-10-17: Owner confirmed the delegated facts reviewed (#55): am/om/ti/ar locale names, holiday list and leap-year rules (N-016, N-017), Tsome Nebiyat and the Nineveh table (N-019), Ethiopian time periods. Locale files flipped to `reviewed: true`. Reviewer names not recorded.
- 2026-10-18: Published `@qen/core` 1.0.0 and `@qen/react` 0.1.0 (#131, merged by the owner), both with SLSA provenance; release checklist complete. M5 and M6 closed. R-A11Y-01/02 stay open across the apps (M7+).
