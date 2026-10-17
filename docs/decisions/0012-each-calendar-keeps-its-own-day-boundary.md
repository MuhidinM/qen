# ADR-0012 · Each calendar keeps its own day boundary: midnight, dawn, sunset

**Status:** accepted · 2026-10-17 (owner decided the rule)

## Context

Gregorian days start at midnight. The traditional Ethiopian day starts at dawn (06:00, which Ethiopian time calls 12 o'clock). The Islamic day starts at sunset. A date-only conversion ignores this, but "what is the date right now?" does not: at 03:00 on 14 October 2026 the Gregorian date has moved on, the Ethiopian date has not, and after sunset the Hijri date already shows tomorrow (N-005).

## Decision

- **Date-to-date conversion** (`convert`, `toJDN`, `fromJDN`) maps the daylight part of a day and ignores boundaries. Gregorian 13 Oct 2026 = Tikimt 3, 2019 EC, as `Intl` and every printed calendar show.
- **Instant-to-date functions** (`fromJSDate`, `today`) apply each calendar's boundary by default:
  - Gregorian: 00:00 local
  - Ethiopian: 06:00 local
  - Hijri: local sunset, computed with the NOAA solar algorithm (pure arithmetic, no dependencies) when `location: { latitude, longitude }` is given, otherwise 18:00 local
- Option `boundary: 'midnight'` switches every calendar to the civil midnight rule, which government systems and `Intl` use.

Alternatives considered:

- Midnight everywhere: simple and matches `Intl`, but shows the wrong Ethiopian date before dawn and the wrong Hijri date after sunset for people who follow the traditional day.
- Real sunrise for the Ethiopian boundary: Ethiopian time fixes the start at 06:00, and Ethiopia is close to the equator, so a fixed hour is the stated rule.

## Consequences

- `fromJSDate` and `today` take `boundary` and `location` options; their docs explain the rule with examples.
- Sunset calculation needs tests against published sunset times.
- Apps (web, extension, desktop) should ask for or infer a location once, to show the Hijri date change at real sunset.
