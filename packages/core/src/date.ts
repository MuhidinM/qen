import { calendarFor, isCalendarId } from './calendars/index.js';
import { InvalidDateError } from './errors.js';
import type { CalendarDate, CalendarId } from './types.js';

/** Returns why the date is invalid, or `undefined` when it is valid. */
function problem(calendar: unknown, year: number, month: number, day: number): string | undefined {
  if (!isCalendarId(calendar)) {
    return `Unknown calendar "${String(calendar)}": expected gregorian, ethiopian or hijri`;
  }
  for (const [label, value] of [
    ['year', year],
    ['month', month],
    ['day', day],
  ] as const) {
    if (!Number.isInteger(value)) return `${label} must be an integer, got ${value}`;
  }
  if (year < 1) return `Year ${year} is out of range: years start at 1`;

  const cal = calendarFor(calendar);
  const months = cal.monthsInYear(year);
  if (month < 1 || month > months) {
    return `Month ${month} does not exist in the ${cal.name} calendar (months 1–${months})`;
  }
  if (day < 1 || day > cal.maxDay(year, month)) {
    return `${cal.monthNames[month - 1]} ${day} does not exist in ${year}${cal.yearSuffix}`;
  }
  return undefined;
}

/**
 * Creates a validated date. Months and days are 1-based; years start at 1.
 * Ethiopian years use the Amete Mihret era.
 *
 * Hijri dates are checked for structure only (months 1–12, days 1–30), because whether a
 * month has 29 or 30 days depends on the calculation method. Converting a Hijri 30th that
 * the method does not have throws at conversion time.
 *
 * @throws {@link InvalidDateError} if the date does not exist.
 *
 * @example
 * ```ts
 * date('ethiopian', 2019, 1, 17); // { calendar: 'ethiopian', year: 2019, month: 1, day: 17 }
 * date('ethiopian', 2018, 13, 6); // throws "Pagume 6 does not exist in 2018 EC"
 * ```
 */
export function date<C extends CalendarId>(
  calendar: C,
  year: number,
  month: number,
  day: number,
): CalendarDate<C> {
  const reason = problem(calendar, year, month, day);
  if (reason !== undefined) throw new InvalidDateError(reason, calendar, year, month, day);
  return Object.freeze({ calendar, year, month, day });
}

/**
 * Checks whether a value is a valid {@link CalendarDate}. Never throws, so it is safe on
 * untrusted input such as parsed JSON.
 *
 * @example
 * ```ts
 * isValid({ calendar: 'ethiopian', year: 2015, month: 13, day: 6 }); // true (2015 EC is a leap year)
 * isValid({ calendar: 'ethiopian', year: 2018, month: 13, day: 6 }); // false
 * ```
 */
export function isValid(value: unknown): value is CalendarDate {
  if (typeof value !== 'object' || value === null) return false;
  const { calendar, year, month, day } = value as Record<string, unknown>;
  if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
    return false;
  }
  return problem(calendar, year, month, day) === undefined;
}
