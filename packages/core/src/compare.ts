import { addMonths, addYears } from './arithmetic.js';
import { convert, toJDN } from './convert.js';
import type { CalendarDate, ConvertOptions } from './types.js';

/**
 * Orders two dates by the day they fall on, in any calendars: -1 if `a` is earlier, 1 if
 * later, 0 if the same day. Usable directly as an `Array.prototype.sort` comparator.
 *
 * @throws {@link InvalidDateError} if either date does not exist.
 *
 * @example
 * ```ts
 * compare(date('ethiopian', 2019, 1, 1), date('gregorian', 2026, 9, 11)); // 0
 * dates.sort(compare);
 * ```
 */
export function compare(
  a: CalendarDate,
  b: CalendarDate,
  options: ConvertOptions = {},
): -1 | 0 | 1 {
  const d = toJDN(a, options) - toJDN(b, options);
  return d < 0 ? -1 : d > 0 ? 1 : 0;
}

/**
 * Whether two dates are the same day, in any calendars.
 *
 * @example
 * ```ts
 * isSame(date('ethiopian', 2019, 2, 7), date('gregorian', 2026, 10, 17)); // true
 * ```
 */
export function isSame(a: CalendarDate, b: CalendarDate, options: ConvertOptions = {}): boolean {
  return compare(a, b, options) === 0;
}

/** Units for {@link diff}. */
export type DiffUnit = 'days' | 'weeks' | 'months' | 'years';

/**
 * The difference `to − from`, in whole units (truncated toward zero).
 *
 * Months and years are counted in the calendar of `from` (`to` is converted into it; N-014),
 * the same way {@link addMonths} and {@link addYears} move: `addMonths(from, n)` is never past
 * `to`, and `addMonths(from, n + 1)` is. The Ethiopian year has 13 months.
 *
 * @throws {@link InvalidDateError} if either date does not exist.
 *
 * @example
 * ```ts
 * diff(date('ethiopian', 2018, 11, 30), date('ethiopian', 2019, 1, 1), 'months'); // 2 (through Pagume)
 * diff(date('gregorian', 2026, 1, 1), date('gregorian', 2026, 12, 31), 'days');  // 364
 * ```
 */
export function diff(
  from: CalendarDate,
  to: CalendarDate,
  unit: DiffUnit,
  options: ConvertOptions = {},
): number {
  switch (unit) {
    case 'days':
      return toJDN(to, options) - toJDN(from, options);
    case 'weeks':
      return Math.trunc((toJDN(to, options) - toJDN(from, options)) / 7);
    case 'months':
    case 'years': {
      const target = convert(to, from.calendar, options);
      const perYear = from.calendar === 'ethiopian' ? 13 : 12;
      const add = unit === 'months' ? addMonths : addYears;
      let n =
        unit === 'months'
          ? target.year * perYear + target.month - (from.year * perYear + from.month)
          : target.year - from.year;
      if (n > 0 && compare(add(from, n, options), target, options) > 0) n--;
      if (n < 0 && compare(add(from, n, options), target, options) < 0) n++;
      return n;
    }
    default:
      throw new RangeError(`Unknown unit "${String(unit)}": expected days, weeks, months or years`);
  }
}

/**
 * A person's age, or the time elapsed between two dates, as years, months and days.
 *
 * Counted in the calendar of `birth` (`on` is converted into it): Ethiopian years have 13
 * months. A birthday that doesn't exist in a year (Pagume 6, 29 February, a Hijri 30th) is
 * reached on the month's last day. `on` is required because `@qen/core` never reads the
 * clock; pass `today(calendar)` for the current age.
 *
 * @throws {@link InvalidDateError} if either date does not exist.
 * @throws `RangeError` if `on` is before `birth`.
 *
 * @example
 * ```ts
 * age(date('ethiopian', 1990, 1, 17), date('ethiopian', 2019, 2, 7)); // { years: 29, months: 0, days: 20 }
 * ```
 */
export function age(
  birth: CalendarDate,
  on: CalendarDate,
  options: ConvertOptions = {},
): { years: number; months: number; days: number } {
  if (compare(on, birth, options) < 0) {
    throw new RangeError('The "on" date is before the birth date');
  }
  const perYear = birth.calendar === 'ethiopian' ? 13 : 12;
  const totalMonths = diff(birth, on, 'months', options);
  const days = diff(addMonths(birth, totalMonths, options), on, 'days', options);
  return { years: Math.floor(totalMonths / perYear), months: totalMonths % perYear, days };
}
