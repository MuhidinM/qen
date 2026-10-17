/**
 * `@qen/core`: Gregorian, Ethiopian, and Hijri calendar engine.
 *
 * @packageDocumentation
 */

export type {
  CalendarDate,
  CalendarId,
  ConvertOptions,
  HijriExplanation,
  HijriMethod,
} from './types.js';
export { InvalidDateError } from './errors.js';
export { date, isValid } from './date.js';
export { convert, explainHijri, fromJDN, toJDN } from './convert.js';
export type { DayBoundary, GeoLocation, InstantOptions } from './day-boundary.js';
export { fromJSDate, toJSDate, type ToJSDateOptions } from './js-date.js';
export { today, type TodayOptions } from './today.js';
export { fromGeezNumeral, toGeezNumeral } from './geez.js';
export { fromEthiopianTime, toEthiopianTime, type EthiopianTimePeriod } from './ethiopian-time.js';
export type { Locale } from './locale.js';
export { format, type FormatOptions, type NumeralSystem } from './format.js';
export { AmbiguousDateError, parse, type ParseOptions } from './parse.js';
export type {
  Holiday,
  HolidayCategory,
  HolidayId,
  HolidayRule,
  HolidayStatus,
} from './holidays/types.js';
export {
  getHolidays,
  getHolidaysInRange,
  nextHoliday,
  type HolidayOptions,
} from './holidays/queries.js';
export { bahireHasab, type BahireHasab, type Evangelist } from './holidays/bahire-hasab.js';
export {
  getObservances,
  type Observance,
  type ObservanceId,
  type ObservanceOptions,
} from './holidays/observances.js';
export { dayOfWeek, daysInMonth, isLeapYear, monthsInYear } from './info.js';
export { addDays, addMonths, addYears } from './arithmetic.js';
export { age, compare, diff, isSame, type DiffUnit } from './compare.js';
