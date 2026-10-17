import type { InstantOptions } from './day-boundary.js';
import { fromJSDate } from './js-date.js';
import type { CalendarDate, CalendarId } from './types.js';

/**
 * Options for {@link today}.
 *
 * @example
 * ```ts
 * const opts: TodayOptions = { now: new Date('2026-09-11T09:00:00Z'), utc: true };
 * ```
 */
export interface TodayOptions extends InstantOptions {
  /** The instant to use instead of the system clock (handy in tests and on servers). */
  readonly now?: Date;
}

/**
 * Today's date in a calendar. This is the only function in `@qen/core` that reads the
 * system clock, and only when `now` is not given.
 *
 * Each calendar's day boundary applies (ADR-0012): before 06:00 it is still the previous
 * Ethiopian day; after sunset (18:00 unless a `location` is given) it is already the next
 * Hijri day. Pass `boundary: 'midnight'` for the civil rule.
 *
 * @throws `RangeError` if `now` is an invalid `Date`.
 *
 * @example
 * ```ts
 * today('ethiopian');                                     // e.g. { calendar: 'ethiopian', year: 2019, month: 2, day: 7 }
 * today('hijri', { location: { latitude: 9.03, longitude: 38.74 } });
 * ```
 */
export function today<C extends CalendarId>(
  calendar: C,
  options: TodayOptions = {},
): CalendarDate<C> {
  const { now = new Date(), ...rest } = options;
  return fromJSDate(now, calendar, rest);
}
