import type { CalendarDate, CalendarId } from '../types.js';

/**
 * Holiday categories (PLAN.md §3.4). A holiday can be in several: Genna is both `public`
 * and `orthodox`. Holiday queries show `public` holidays unless asked for others.
 *
 * @example
 * ```ts
 * const categories: HolidayCategory[] = ['public', 'islamic'];
 * ```
 */
export type HolidayCategory = 'public' | 'orthodox' | 'islamic' | 'other';

/**
 * Whether a holiday falls on a fixed day of its calendar (Meskel: Meskerem 17) or is
 * computed each year (Fasika from Bahire Hasab).
 *
 * @example
 * ```ts
 * const rule: HolidayRule = 'fixed';
 * ```
 */
export type HolidayRule = 'fixed' | 'computed';

/**
 * For Islamic holidays: `expected` until an official announcement confirms the month start,
 * then `confirmed` (ADR-0006).
 *
 * @example
 * ```ts
 * const status: HolidayStatus = 'expected';
 * ```
 */
export type HolidayStatus = 'expected' | 'confirmed';

/**
 * Stable ids for holidays. Ethiopian public holidays as confirmed in N-017; more ids are
 * added as observances arrive. Holiday names live in the locales, keyed by these ids.
 *
 * @example
 * ```ts
 * const id: HolidayId = 'meskel';
 * ```
 */
export type HolidayId =
  | 'enkutatash'
  | 'meskel'
  | 'genna'
  | 'timket'
  | 'adwa'
  | 'labour-day'
  | 'patriots-victory'
  | 'derg-downfall'
  | 'siklet'
  | 'fasika'
  | 'eid-al-fitr'
  | 'eid-al-adha'
  | 'mawlid'
  | 'tsome-nenewe'
  | 'abiy-tsom'
  | 'debre-zeit'
  | 'hosanna'
  | 'rekebe-kahnat'
  | 'erget'
  | 'peraklitos'
  | 'tsome-hawariyat'
  | 'tsome-dihnet';

/**
 * One occurrence of a holiday.
 *
 * @example
 * ```ts
 * const meskel: Holiday = {
 *   id: 'meskel',
 *   categories: ['public', 'orthodox'],
 *   calendar: 'ethiopian',
 *   rule: 'fixed',
 *   date: { calendar: 'ethiopian', year: 2019, month: 1, day: 17 },
 *   gregorian: { calendar: 'gregorian', year: 2026, month: 9, day: 27 },
 * };
 * ```
 */
export interface Holiday {
  readonly id: HolidayId;
  readonly categories: readonly HolidayCategory[];
  /** The calendar the holiday's rule is defined in. */
  readonly calendar: CalendarId;
  readonly rule: HolidayRule;
  /** The date in the holiday's own calendar. */
  readonly date: CalendarDate;
  /** The same day in the Gregorian calendar. */
  readonly gregorian: CalendarDate<'gregorian'>;
  /** Islamic holidays only: whether the month start is officially confirmed. */
  readonly status?: HolidayStatus;
  /** Who confirmed the date, when `status` is `confirmed`. */
  readonly source?: string;
  /** True when the date is traditional but not exact (e.g. Laylat al-Qadr). */
  readonly approximate?: boolean;
}
