/**
 * Calendars supported by `@qen/core`.
 *
 * @example
 * ```ts
 * const cal: CalendarId = 'ethiopian';
 * ```
 */
export type CalendarId = 'gregorian' | 'ethiopian' | 'hijri';

/**
 * A day in one calendar, as a plain immutable object. Months and days are 1-based.
 * Create one with {@link date}, which validates it.
 *
 * Ethiopian dates use the Amete Mihret era. Hijri dates carry no calculation method;
 * functions that map them to other calendars take Hijri settings instead.
 *
 * @example
 * ```ts
 * const meskel: CalendarDate<'ethiopian'> = { calendar: 'ethiopian', year: 2019, month: 1, day: 17 };
 * ```
 */
export interface CalendarDate<C extends CalendarId = CalendarId> {
  readonly calendar: C;
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

/**
 * How Hijri dates are calculated. `'tabular'` is the arithmetic 30-year cycle (civil epoch).
 * Umm al-Qura is added before the first release and becomes the default (N-008).
 *
 * @example
 * ```ts
 * const method: HijriMethod = 'tabular';
 * ```
 */
export type HijriMethod = 'tabular';

/**
 * Options for functions that map Hijri dates to days.
 *
 * @example
 * ```ts
 * convert(date('gregorian', 2026, 2, 18), 'hijri', { hijri: { method: 'tabular' } });
 * ```
 */
export interface ConvertOptions {
  readonly hijri?: { readonly method?: HijriMethod };
}
