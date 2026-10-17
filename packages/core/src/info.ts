import { ethiopian, isEthiopianLeapYear } from './calendars/ethiopian.js';
import { gregorian, isGregorianLeapYear } from './calendars/gregorian.js';
import { toJDN } from './convert.js';
import { date } from './date.js';
import { hijriMonthLength, resolve } from './hijri/pipeline.js';
import type { CalendarDate, CalendarId, ConvertOptions } from './types.js';

/**
 * Day of the week, 0 = Sunday … 6 = Saturday.
 *
 * @throws {@link InvalidDateError} if the date does not exist.
 *
 * @example
 * ```ts
 * dayOfWeek(date('ethiopian', 2019, 1, 1)); // 5 (Friday, 11 September 2026)
 * ```
 */
export function dayOfWeek(d: CalendarDate, options: ConvertOptions = {}): number {
  // JDN 0 was a Monday, so JDN + 1 counts from Sunday.
  return (toJDN(d, options) + 1) % 7;
}

/**
 * Number of months in a year: 12 Gregorian, 13 Ethiopian (including Pagume), 12 Hijri.
 *
 * @throws {@link InvalidDateError} for a year below 1 or not an integer.
 *
 * @example
 * ```ts
 * monthsInYear('ethiopian', 2019); // 13
 * ```
 */
export function monthsInYear(calendar: CalendarId, year: number): number {
  date(calendar, year, 1, 1);
  return calendar === 'ethiopian' ? 13 : 12;
}

/**
 * Number of days in a month. For Hijri it depends on the method (Umm al-Qura by default).
 *
 * @throws {@link InvalidDateError} for an invalid year or month.
 *
 * @example
 * ```ts
 * daysInMonth('ethiopian', 2015, 13); // 6 (Pagume in a leap year)
 * daysInMonth('hijri', 1447, 9);      // Ramadan 1447 under Umm al-Qura
 * ```
 */
export function daysInMonth(
  calendar: CalendarId,
  year: number,
  month: number,
  options: ConvertOptions = {},
): number {
  date(calendar, year, month, 1);
  switch (calendar) {
    case 'gregorian':
      return gregorian.maxDay(year, month);
    case 'ethiopian':
      return ethiopian.maxDay(year, month);
    case 'hijri':
      return hijriMonthLength(year, month, resolve(options));
  }
}

/**
 * Whether a year is a leap year: Gregorian by the 4/100/400 rule, Ethiopian when
 * `year % 4 === 3` (Pagume has 6 days), Hijri when the year has 355 days under the method.
 *
 * @throws {@link InvalidDateError} for a year below 1 or not an integer.
 *
 * @example
 * ```ts
 * isLeapYear('ethiopian', 2015); // true
 * isLeapYear('gregorian', 1900); // false
 * ```
 */
export function isLeapYear(
  calendar: CalendarId,
  year: number,
  options: ConvertOptions = {},
): boolean {
  date(calendar, year, 1, 1);
  switch (calendar) {
    case 'gregorian':
      return isGregorianLeapYear(year);
    case 'ethiopian':
      return isEthiopianLeapYear(year);
    case 'hijri': {
      let days = 0;
      for (let m = 1; m <= 12; m++) days += daysInMonth('hijri', year, m, options);
      return days === 355;
    }
  }
}
