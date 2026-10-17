import { convert, toJDN } from '../convert.js';
import type { CalendarDate, ConvertOptions } from '../types.js';
import { fixedHolidays } from './fixed.js';
import { islamicHolidays } from './islamic.js';
import { movableHolidays } from './movable.js';
import type { Holiday, HolidayCategory } from './types.js';

/**
 * Options for holiday queries.
 *
 * @example
 * ```ts
 * const opts: HolidayOptions = { categories: ['public', 'orthodox'] };
 * ```
 */
export interface HolidayOptions extends ConvertOptions {
  /** Which holidays to include; a holiday matches if any of its categories is listed. Default `['public']`. */
  readonly categories?: readonly HolidayCategory[];
}

const CATEGORIES: readonly HolidayCategory[] = ['public', 'orthodox', 'islamic', 'other'];

function categoriesOf(options: HolidayOptions): ReadonlySet<HolidayCategory> {
  const wanted = options.categories ?? ['public'];
  for (const c of wanted) {
    if (!CATEGORIES.includes(c)) {
      throw new RangeError(
        `Unknown holiday category "${String(c)}": expected public, orthodox, islamic or other`,
      );
    }
  }
  return new Set(wanted);
}

/** All holidays of a Gregorian year that match the options, sorted by date. */
function holidaysIn(year: number, options: HolidayOptions): Holiday[] {
  const wanted = categoriesOf(options);
  return [...fixedHolidays(year), ...movableHolidays(year), ...islamicHolidays(year, options)]
    .filter((h) => h.categories.some((c) => wanted.has(c)))
    .sort((a, b) => toJDN(a.gregorian) - toJDN(b.gregorian));
}

/**
 * Holidays in a Gregorian year, sorted by date. Public holidays only unless `categories`
 * says otherwise.
 *
 * @throws `RangeError` for a year below 1 or an unknown category.
 *
 * @example
 * ```ts
 * getHolidays(2026).map((h) => h.id);
 * // ['genna', 'timket', 'adwa', 'labour-day', 'patriots-victory', 'derg-downfall', 'enkutatash', 'meskel']
 * getHolidays(2026, { categories: ['orthodox'] }).map((h) => h.id); // ['genna', 'timket', 'meskel']
 * ```
 */
export function getHolidays(gregorianYear: number, options: HolidayOptions = {}): Holiday[] {
  if (!Number.isInteger(gregorianYear) || gregorianYear < 1) {
    throw new RangeError(`Year must be an integer of at least 1, got ${gregorianYear}`);
  }
  return holidaysIn(gregorianYear, options);
}

/**
 * Holidays from `start` to `end`, both included, sorted by date. The dates can be in any
 * calendar.
 *
 * @throws {@link InvalidDateError} if a date doesn't exist.
 * @throws `RangeError` if `end` is before `start`, or for an unknown category.
 *
 * @example
 * ```ts
 * getHolidaysInRange(date('ethiopian', 2018, 13, 1), date('ethiopian', 2019, 1, 17)).map((h) => h.id);
 * // ['enkutatash', 'meskel']
 * ```
 */
export function getHolidaysInRange(
  start: CalendarDate,
  end: CalendarDate,
  options: HolidayOptions = {},
): Holiday[] {
  const from = toJDN(start, options);
  const to = toJDN(end, options);
  if (to < from) throw new RangeError('The range ends before it starts');
  const first = convert(start, 'gregorian', options).year;
  const last = convert(end, 'gregorian', options).year;
  const out: Holiday[] = [];
  for (let year = first; year <= last; year++) {
    for (const h of holidaysIn(year, options)) {
      const jdn = toJDN(h.gregorian);
      if (jdn >= from && jdn <= to) out.push(h);
    }
  }
  return out;
}

/**
 * The first holiday on or after `from` (a holiday on that day counts), or `undefined` if
 * none matches the categories within the next two years.
 *
 * @throws {@link InvalidDateError} if the date doesn't exist.
 *
 * @example
 * ```ts
 * nextHoliday(date('gregorian', 2026, 9, 12))?.id; // 'meskel'
 * ```
 */
export function nextHoliday(from: CalendarDate, options: HolidayOptions = {}): Holiday | undefined {
  const start = toJDN(from, options);
  const year = convert(from, 'gregorian', options).year;
  for (let y = year; y <= year + 2; y++) {
    const found = holidaysIn(y, options).find((h) => toJDN(h.gregorian) >= start);
    if (found) return found;
  }
  return undefined;
}
