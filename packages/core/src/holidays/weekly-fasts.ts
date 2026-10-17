import { addDays } from '../arithmetic.js';
import { convert, toJDN } from '../convert.js';
import { date } from '../date.js';
import type { CalendarDate, ConvertOptions } from '../types.js';
import { bahireHasab } from './bahire-hasab.js';

/**
 * Whether a day is one of the weekly Orthodox fasts: Wednesday and Friday, except from
 * Fasika to Peraklitos (the 50 days after Easter) and when Genna or Timket falls on that day
 * (N-019). A flag for calendars, not a holiday.
 *
 * @throws {@link InvalidDateError} if the date does not exist.
 *
 * @example
 * ```ts
 * isWeeklyFast(date('gregorian', 2026, 10, 14)); // true: a Wednesday
 * isWeeklyFast(date('gregorian', 2026, 1, 7));   // false: Genna, though a Wednesday
 * ```
 */
export function isWeeklyFast(d: CalendarDate, options: ConvertOptions = {}): boolean {
  const jdn = toJDN(d, options);
  const weekday = (jdn + 1) % 7;
  if (weekday !== 3 && weekday !== 5) return false;

  const { year, month, day } = convert(d, 'gregorian', options);
  if (month === 1 && day === 7) return false; // Genna
  const ethiopianYear = year - 8; // Timket and Fasika of Gregorian year Y fall in EC year Y − 8
  if (toJDN(date('ethiopian', ethiopianYear, 5, 11)) === jdn) return false; // Timket
  const fasika = toJDN(addDays(bahireHasab(ethiopianYear).nineveh, 69));
  return jdn < fasika || jdn > fasika + 49;
}
