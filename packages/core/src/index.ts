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
