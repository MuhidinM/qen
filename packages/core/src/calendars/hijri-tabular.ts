import { InvalidDateError } from '../errors.js';
import { hijri } from './hijri.js';

/** JDN of 1 Muharram 1 AH, civil (Friday) epoch, matching ICU `islamic-civil`. */
const EPOCH = 1_948_440;

/** Leap years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 of each 30-year cycle (N-006). */
export function isHijriTabularLeapYear(year: number): boolean {
  return (14 + 11 * year) % 30 < 11;
}

/** Odd months have 30 days, even months 29; Dhu al-Hijjah has 30 in leap years. */
export function hijriTabularDaysInMonth(year: number, month: number): number {
  return month % 2 === 1 || (month === 12 && isHijriTabularLeapYear(year)) ? 30 : 29;
}

/**
 * Julian Day Number of a Hijri date under the tabular method.
 * Expects a structurally valid date (see `date()`).
 *
 * @throws {@link InvalidDateError} for a 30th the tabular method does not have.
 */
export function hijriTabularToJDN(year: number, month: number, day: number): number {
  if (day > hijriTabularDaysInMonth(year, month)) {
    throw new InvalidDateError(
      `${hijri.monthNames[month - 1]} ${day} does not exist in ${year} AH (tabular method)`,
      'hijri',
      year,
      month,
      day,
    );
  }
  return (
    day +
    Math.ceil(29.5 * (month - 1)) +
    354 * (year - 1) +
    Math.floor((3 + 11 * year) / 30) +
    EPOCH -
    1
  );
}

/** Hijri date of a Julian Day Number under the tabular method. */
export function hijriTabularFromJDN(jdn: number): { year: number; month: number; day: number } {
  const year = Math.floor((30 * (jdn - EPOCH) + 10646) / 10631);
  const startOfYear = hijriTabularToJDN(year, 1, 1);
  const month = Math.min(12, Math.ceil((jdn - 29 - startOfYear) / 29.5) + 1);
  return { year, month, day: jdn - hijriTabularToJDN(year, month, 1) + 1 };
}
