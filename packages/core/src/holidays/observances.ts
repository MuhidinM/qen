import { addDays } from '../arithmetic.js';
import { convert, toJDN } from '../convert.js';
import { date } from '../date.js';
import type { CalendarDate, CalendarId, ConvertOptions } from '../types.js';
import { bahireHasab } from './bahire-hasab.js';
import { hijriStatus } from './status.js';
import type { HolidayCategory, HolidayStatus } from './types.js';

/**
 * Ids of multi-day observances: the Orthodox fasts and Ramadan (PLAN.md §3.4).
 *
 * @example
 * ```ts
 * const id: ObservanceId = 'ramadan';
 * ```
 */
export type ObservanceId =
  'abiy-tsom' | 'tsome-hawariyat' | 'tsome-filseta' | 'tsome-nebiyat' | 'ramadan';

/**
 * A period of several days, such as Ramadan or Abiy Tsom. Both ends are included.
 *
 * @example
 * ```ts
 * const filseta: Observance = getObservances(date('gregorian', 2026, 8, 1), date('gregorian', 2026, 8, 31))[0]!;
 * filseta.start; // { calendar: 'ethiopian', year: 2018, month: 12, day: 1 }
 * ```
 */
export interface Observance {
  readonly id: ObservanceId;
  readonly categories: readonly HolidayCategory[];
  /** The calendar the period is defined in. */
  readonly calendar: CalendarId;
  /** First day, in the observance's own calendar. */
  readonly start: CalendarDate;
  /** Last day (included), in the observance's own calendar. */
  readonly end: CalendarDate;
  readonly startGregorian: CalendarDate<'gregorian'>;
  readonly endGregorian: CalendarDate<'gregorian'>;
  /** Ramadan only: `expected` until its month start is officially confirmed. */
  readonly status?: HolidayStatus;
  /** Who confirmed the start, when `status` is `confirmed`. */
  readonly source?: string;
}

/**
 * Options for {@link getObservances}.
 *
 * @example
 * ```ts
 * const opts: ObservanceOptions = { categories: ['orthodox'] };
 * ```
 */
export interface ObservanceOptions extends ConvertOptions {
  /** Which observances to include. Default: all (`orthodox` and `islamic`). */
  readonly categories?: readonly HolidayCategory[];
}

const ORTHODOX: readonly HolidayCategory[] = ['orthodox'];

function period(
  id: ObservanceId,
  categories: readonly HolidayCategory[],
  start: CalendarDate,
  end: CalendarDate,
  options: ConvertOptions,
  confirmation?: { status: HolidayStatus; source?: string },
): Observance {
  return Object.freeze({
    id,
    categories: Object.freeze([...categories]),
    calendar: start.calendar,
    start,
    end,
    startGregorian: convert(start, 'gregorian', options),
    endGregorian: convert(end, 'gregorian', options),
    ...confirmation,
  });
}

/** The Orthodox fasts that belong to one Ethiopian year. */
function orthodoxFasts(year: number, options: ConvertOptions): Observance[] {
  const nineveh = bahireHasab(year).nineveh;
  // Genna is always 7 January (N-016); Tsome Nebiyat ends on its eve.
  const genna = convert(date('gregorian', year + 8, 1, 7), 'ethiopian');
  return [
    period('abiy-tsom', ORTHODOX, addDays(nineveh, 14), addDays(nineveh, 68), options),
    // From the day after Peraklitos to the eve of Peter and Paul (Hamle 5).
    period(
      'tsome-hawariyat',
      ORTHODOX,
      addDays(nineveh, 119),
      date('ethiopian', year, 11, 4),
      options,
    ),
    period(
      'tsome-filseta',
      ORTHODOX,
      date('ethiopian', year, 12, 1),
      date('ethiopian', year, 12, 15),
      options,
    ),
    period('tsome-nebiyat', ORTHODOX, date('ethiopian', year, 3, 15), addDays(genna, -1), options),
  ];
}

/** Ramadan of one Hijri year, under the method in `options`. */
function ramadan(year: number, options: ConvertOptions): Observance {
  const end = addDays(date('hijri', year, 10, 1), -1, options);
  const start = date('hijri', year, 9, 1);
  return period('ramadan', ['islamic'], start, end, options, hijriStatus(year, 9, options));
}

/**
 * Multi-day observances that overlap `start`–`end` (both included, any calendars), sorted by
 * their first day: Abiy Tsom, Tsome Hawariyat, Tsome Filseta (Nehase 1–15), Tsome Nebiyat
 * (Hidar 15 to the eve of Genna) and Ramadan.
 *
 * @throws {@link InvalidDateError} if a date doesn't exist.
 * @throws `RangeError` if `end` is before `start`, or for an unknown category.
 *
 * @example
 * ```ts
 * getObservances(date('gregorian', 2026, 3, 10), date('gregorian', 2026, 3, 10)).map((o) => o.id);
 * // ['abiy-tsom', 'ramadan']
 * ```
 */
export function getObservances(
  start: CalendarDate,
  end: CalendarDate,
  options: ObservanceOptions = {},
): Observance[] {
  const from = toJDN(start, options);
  const to = toJDN(end, options);
  if (to < from) throw new RangeError('The range ends before it starts');
  const wanted = new Set(options.categories ?? ['orthodox', 'islamic']);
  for (const c of wanted) {
    if (!['public', 'orthodox', 'islamic', 'other'].includes(c)) {
      throw new RangeError(`Unknown holiday category "${String(c)}"`);
    }
  }

  const all: Observance[] = [];
  const ecFirst = convert(start, 'ethiopian', options).year;
  const ecLast = convert(end, 'ethiopian', options).year;
  for (let y = Math.max(1, ecFirst - 1); y <= ecLast + 1; y++) {
    all.push(...orthodoxFasts(y, options));
  }
  const ahFirst = convert(start, 'hijri', options).year;
  const ahLast = convert(end, 'hijri', options).year;
  for (let y = Math.max(1, ahFirst - 1); y <= ahLast + 1; y++) all.push(ramadan(y, options));

  return all
    .filter((o) => o.categories.some((c) => wanted.has(c)))
    .filter((o) => toJDN(o.start, options) <= to && toJDN(o.end, options) >= from)
    .sort((a, b) => toJDN(a.start, options) - toJDN(b.start, options));
}
