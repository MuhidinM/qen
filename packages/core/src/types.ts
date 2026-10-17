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
 * How Hijri dates are calculated.
 *
 * - `'umalqura'` (default): the Umm al-Qura calendar of Saudi Arabia, from a table covering
 *   1300–1500 AH (1882–2077). Outside the table it falls back to tabular; see
 *   {@link explainHijri}. Most certain for 1420–1449 AH (N-027).
 * - `'tabular'`: the arithmetic 30-year cycle, civil epoch (matches `Intl` `islamic-civil`).
 *
 * Either may differ by a day from local moon-sighting announcements.
 *
 * @example
 * ```ts
 * const method: HijriMethod = 'umalqura';
 * ```
 */
export type HijriMethod = 'umalqura' | 'tabular';

/**
 * Options for functions that map Hijri dates to days. The Hijri method defaults to
 * `'umalqura'`.
 *
 * @example
 * ```ts
 * convert(date('gregorian', 2026, 2, 18), 'hijri', { hijri: { method: 'tabular' } });
 * ```
 */
export interface ConvertOptions {
  /** How Hijri dates are calculated and adjusted (ADR-0006). */
  readonly hijri?: HijriSettings;
}

/**
 * How Hijri dates are calculated and adjusted. Steps run in order (ADR-0006): the base
 * `method`, then official overrides, then the user's `offset`.
 *
 * @example
 * ```ts
 * const settings: HijriSettings = { method: 'umalqura', offset: 1 };
 * ```
 */
export interface HijriSettings {
  /** Base calculation; Umm al-Qura by default. */
  readonly method?: HijriMethod;
  /**
   * Whole days to move every month start, −2 to +2, to match local moon sighting. +1 means
   * months start a day later, so a given day shows the previous Hijri date.
   */
  readonly offset?: -2 | -1 | 0 | 1 | 2;
  /** Officially announced month starts. Each wins for its own month, before the offset. */
  readonly overrides?: readonly HijriOverride[];
}

/**
 * An officially announced start of a Hijri month, such as an Eid confirmation.
 *
 * @example
 * ```ts
 * const shawwal: HijriOverride = {
 *   hijriYear: 1447,
 *   hijriMonth: 10,
 *   startsOn: { year: 2026, month: 3, day: 20 },
 *   source: 'Ethiopian Islamic Affairs Supreme Council',
 * };
 * ```
 */
export interface HijriOverride {
  readonly hijriYear: number;
  readonly hijriMonth: number;
  /** The Gregorian day the month starts on. */
  readonly startsOn: { readonly year: number; readonly month: number; readonly day: number };
  /** Who announced it. Required. */
  readonly source: string;
}

/**
 * How a Hijri date was decided: the method actually used, and whether Umm al-Qura fell back
 * to tabular because the date is outside its table.
 *
 * @example
 * ```ts
 * const e: HijriExplanation = explainHijri(date('gregorian', 2026, 10, 17));
 * // { date: { calendar: 'hijri', year: 1448, month: 5, day: 6 }, method: 'umalqura', fallback: false }
 * ```
 */
export interface HijriExplanation {
  readonly date: CalendarDate<'hijri'>;
  readonly method: HijriMethod;
  readonly fallback: boolean;
  /** The pipeline step that decided this month: the base method, an official override, or the user offset. */
  readonly decidedBy: 'method' | 'override' | 'offset';
  /** The override's source, when `decidedBy` is `'override'`. */
  readonly source?: string;
}
