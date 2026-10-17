import { calendarFor, isCalendarId } from './calendars/index.js';
import { ethiopianFromJDN, ethiopianToJDN } from './calendars/ethiopian.js';
import { gregorianFromJDN, gregorianToJDN } from './calendars/gregorian.js';
import { hijriTabularFromJDN, hijriTabularToJDN } from './calendars/hijri-tabular.js';
import { date } from './date.js';
import type { CalendarDate, CalendarId, ConvertOptions, HijriMethod } from './types.js';

type YMD = { year: number; month: number; day: number };

/** Hijri method implementations. Umm al-Qura joins and becomes the default with #41 (N-008). */
const HIJRI_METHODS: Readonly<
  Record<HijriMethod, { toJDN(y: number, m: number, d: number): number; fromJDN(jdn: number): YMD }>
> = {
  tabular: { toJDN: hijriTabularToJDN, fromJDN: hijriTabularFromJDN },
};

function hijriMethod(options: ConvertOptions) {
  return HIJRI_METHODS[options.hijri?.method ?? 'tabular'];
}

/** First JDN of year 1 in each calendar (N-002). */
const FIRST_JDN: Readonly<Record<CalendarId, number>> = {
  gregorian: gregorianToJDN(1, 1, 1),
  ethiopian: ethiopianToJDN(1, 1, 1),
  hijri: hijriTabularToJDN(1, 1, 1),
};

/**
 * The Julian Day Number of a date: a continuous count of days used as the pivot for all
 * conversions.
 *
 * @throws {@link InvalidDateError} if the date does not exist (including a Hijri 30th the
 * method does not have).
 *
 * @example
 * ```ts
 * toJDN(date('gregorian', 2000, 1, 1)); // 2451545
 * ```
 */
export function toJDN(d: CalendarDate, options: ConvertOptions = {}): number {
  const { calendar, year, month, day } = date(d.calendar, d.year, d.month, d.day);
  switch (calendar) {
    case 'gregorian':
      return gregorianToJDN(year, month, day);
    case 'ethiopian':
      return ethiopianToJDN(year, month, day);
    case 'hijri':
      return hijriMethod(options).toJDN(year, month, day);
  }
}

/**
 * The date in a calendar for a Julian Day Number.
 *
 * @throws `RangeError` if `jdn` is not an integer or falls before year 1 of the calendar.
 *
 * @example
 * ```ts
 * fromJDN(2451545, 'ethiopian'); // { calendar: 'ethiopian', year: 1992, month: 4, day: 22 }
 * ```
 */
export function fromJDN<C extends CalendarId>(
  jdn: number,
  calendar: C,
  options: ConvertOptions = {},
): CalendarDate<C> {
  if (!isCalendarId(calendar)) {
    throw new RangeError(
      `Unknown calendar "${String(calendar)}": expected gregorian, ethiopian or hijri`,
    );
  }
  if (!Number.isInteger(jdn)) {
    throw new RangeError(`Julian Day Number must be an integer, got ${jdn}`);
  }
  if (jdn < FIRST_JDN[calendar]) {
    throw new RangeError(
      `JDN ${jdn} is before year 1 of the ${calendarFor(calendar).name} calendar`,
    );
  }
  const { year, month, day } =
    calendar === 'gregorian'
      ? gregorianFromJDN(jdn)
      : calendar === 'ethiopian'
        ? ethiopianFromJDN(jdn)
        : hijriMethod(options).fromJDN(jdn);
  return Object.freeze({ calendar, year, month, day });
}

/**
 * Converts a date to another calendar, through the Julian Day Number.
 *
 * @throws {@link InvalidDateError} if the input date does not exist.
 * @throws `RangeError` if the day falls before year 1 of the target calendar.
 *
 * @example
 * ```ts
 * convert(date('ethiopian', 2019, 1, 1), 'gregorian'); // { calendar: 'gregorian', year: 2026, month: 9, day: 11 }
 * convert(date('gregorian', 2026, 2, 18), 'hijri');    // { calendar: 'hijri', year: 1447, month: 9, day: 1 }
 * ```
 */
export function convert<C extends CalendarId>(
  d: CalendarDate,
  target: C,
  options: ConvertOptions = {},
): CalendarDate<C> {
  return fromJDN(toJDN(d, options), target, options);
}
