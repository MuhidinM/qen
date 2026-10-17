import { convert } from './convert.js';
import { dayOf, type InstantOptions } from './day-boundary.js';
import type { CalendarDate, CalendarId, ConvertOptions } from './types.js';

/**
 * Options for {@link toJSDate}.
 *
 * @example
 * ```ts
 * const opts: ToJSDateOptions = { utc: true };
 * ```
 */
export interface ToJSDateOptions extends ConvertOptions {
  /** Return 12:00 UTC instead of 12:00 in the runtime's local time zone. */
  readonly utc?: boolean;
}

/**
 * The calendar date a JavaScript `Date` falls on.
 *
 * The `Date`'s local wall-clock time is used unless `utc` is set (N-004). Each calendar's
 * day boundary applies (ADR-0012): Ethiopian days start at 06:00 and Hijri days at sunset
 * (18:00 unless a `location` is given). Pass `boundary: 'midnight'` for the civil rule.
 *
 * @throws `RangeError` for an invalid `Date`.
 *
 * @example
 * ```ts
 * fromJSDate(new Date(2026, 9, 17, 9, 30), 'ethiopian'); // { calendar: 'ethiopian', year: 2019, month: 2, day: 7 }
 * fromJSDate(new Date('2026-10-14T03:00:00Z'), 'ethiopian', { utc: true }); // Tikimt 3: before 06:00
 * ```
 */
export function fromJSDate<C extends CalendarId>(
  instant: Date,
  calendar: C,
  options: InstantOptions = {},
): CalendarDate<C> {
  if (Number.isNaN(instant.getTime())) {
    throw new RangeError('Invalid Date: it has no calendar day');
  }
  return dayOf(instant, calendar, options);
}

/**
 * A JavaScript `Date` at 12:00 on the Gregorian day that matches the date (local time, or
 * UTC with `utc: true`). Noon lies inside the day under every boundary rule, so
 * `fromJSDate(toJSDate(d), d.calendar)` gives back `d` (N-029).
 *
 * @throws {@link InvalidDateError} if the date does not exist.
 *
 * @example
 * ```ts
 * toJSDate(date('ethiopian', 2019, 1, 1), { utc: true }).toISOString(); // '2026-09-11T12:00:00.000Z'
 * ```
 */
export function toJSDate(d: CalendarDate, options: ToJSDateOptions = {}): Date {
  const { year, month, day } = convert(d, 'gregorian', options);
  const out = new Date(0);
  if (options.utc) {
    out.setUTCFullYear(year, month - 1, day);
    out.setUTCHours(12, 0, 0, 0);
  } else {
    out.setFullYear(year, month - 1, day);
    out.setHours(12, 0, 0, 0);
  }
  return out;
}
