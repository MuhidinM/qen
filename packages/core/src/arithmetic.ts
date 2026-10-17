import { fromJDN, toJDN } from './convert.js';
import { date } from './date.js';
import { daysInMonth, monthsInYear } from './info.js';
import type { CalendarDate, CalendarId, ConvertOptions } from './types.js';

function checkAmount(n: number): void {
  if (!Number.isInteger(n)) throw new RangeError(`Amount must be an integer, got ${n}`);
}

/** Builds year/month with the day clamped to the month's length (N-013). */
function clamped<C extends CalendarId>(
  calendar: C,
  year: number,
  month: number,
  day: number,
  options: ConvertOptions,
): CalendarDate<C> {
  if (year < 1) throw new RangeError(`The result is before year 1 (year ${year})`);
  return date(calendar, year, month, Math.min(day, daysInMonth(calendar, year, month, options)));
}

/**
 * Adds days (negative to subtract). Works on the Julian Day Number, so it never needs
 * clamping.
 *
 * @throws {@link InvalidDateError} if the date does not exist.
 * @throws `RangeError` if `days` is not an integer or the result is before year 1.
 *
 * @example
 * ```ts
 * addDays(date('ethiopian', 2018, 13, 5), 1); // Meskerem 1, 2019
 * ```
 */
export function addDays<C extends CalendarId>(
  d: CalendarDate<C>,
  days: number,
  options: ConvertOptions = {},
): CalendarDate<C> {
  checkAmount(days);
  return fromJDN(toJDN(d, options) + days, d.calendar, options);
}

/**
 * Adds months (negative to subtract) in the date's own calendar. The Ethiopian year has
 * 13 months. If the day doesn't exist in the target month, it becomes the month's last day.
 *
 * @throws {@link InvalidDateError} if the date does not exist.
 * @throws `RangeError` if `months` is not an integer or the result is before year 1.
 *
 * @example
 * ```ts
 * addMonths(date('ethiopian', 2018, 11, 30), 2); // Pagume 5, 2018 (Hamle 30 + 2 months)
 * addMonths(date('gregorian', 2025, 1, 31), 1);  // 28 February 2025
 * ```
 */
export function addMonths<C extends CalendarId>(
  d: CalendarDate<C>,
  months: number,
  options: ConvertOptions = {},
): CalendarDate<C> {
  checkAmount(months);
  toJDN(d, options); // validates, including a Hijri 30th under the method
  const perYear = monthsInYear(d.calendar, d.year);
  const index = d.year * perYear + (d.month - 1) + months;
  const year = Math.floor(index / perYear);
  return clamped(d.calendar, year, index - year * perYear + 1, d.day, options);
}

/**
 * Adds years (negative to subtract). If the day doesn't exist in the target year (Pagume 6,
 * 29 February, a Hijri 30th), it becomes the month's last day.
 *
 * @throws {@link InvalidDateError} if the date does not exist.
 * @throws `RangeError` if `years` is not an integer or the result is before year 1.
 *
 * @example
 * ```ts
 * addYears(date('ethiopian', 2015, 13, 6), 1); // Pagume 5, 2016
 * ```
 */
export function addYears<C extends CalendarId>(
  d: CalendarDate<C>,
  years: number,
  options: ConvertOptions = {},
): CalendarDate<C> {
  checkAmount(years);
  toJDN(d, options);
  return clamped(d.calendar, d.year + years, d.month, d.day, options);
}
