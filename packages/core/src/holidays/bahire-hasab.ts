import { date } from '../date.js';
import { dayOfWeek } from '../info.js';
import type { CalendarDate } from '../types.js';

/**
 * The evangelist a year is dedicated to, in the four-year cycle of Amete Alem.
 *
 * @example
 * ```ts
 * const e: Evangelist = 'john';
 * ```
 */
export type Evangelist = 'matthew' | 'mark' | 'luke' | 'john';

/**
 * The result of the Bahire Hasab computus for one Ethiopian year.
 *
 * @example
 * ```ts
 * const b: BahireHasab = bahireHasab(2018);
 * b.nineveh; // { calendar: 'ethiopian', year: 2018, month: 5, day: 25 }
 * ```
 */
export interface BahireHasab {
  /** The Ethiopian (Amete Mihret) year. */
  readonly year: number;
  /** Amete Alem, the year counted from creation: `year + 5500`. */
  readonly ameteAlem: number;
  /** The evangelist the year is dedicated to: Amete Alem mod 4 (1 Matthew … 0 John). */
  readonly evangelist: Evangelist;
  /** Position in the 19-year lunar cycle: `(ameteAlem − 1) mod 19`. */
  readonly wenber: number;
  /** Epact: `wenber × 11 mod 30`. */
  readonly abekte: number;
  /** `wenber × 19 mod 30`; Abekte + Metqe is always a multiple of 30. */
  readonly metqe: number;
  /** Meskerem Metqe when Metqe is above 14, otherwise Tikimt Metqe (Metqe 0 counts as 30). */
  readonly bealeMetqe: CalendarDate<'ethiopian'>;
  /** Days added for Beale Metqe's weekday: Sunday 7, Monday 6 … Friday 2, Saturday 8. */
  readonly tewsak: number;
  /** Day of Nineveh within Tir (Meskerem case) or Yekatit (Tikimt case), before carrying past 30. */
  readonly mebajaHamer: number;
  /** Tsome Nenewe, the Fast of Nineveh: the anchor of every movable feast (PLAN.md §3.4). */
  readonly nineveh: CalendarDate<'ethiopian'>;
  /** Weekday of Meskerem 1, 0 = Sunday. */
  readonly newYearWeekday: number;
}

const EVANGELISTS: readonly Evangelist[] = ['john', 'matthew', 'mark', 'luke'];
/** Tewsak by weekday, index 0 = Sunday. */
const TEWSAK = [7, 6, 5, 4, 3, 2, 8] as const;

/**
 * Bahire Hasab, the Ethiopian computus, for one Ethiopian year (ADR-0007). It finds the Fast
 * of Nineveh, from which Fasika (Nineveh + 69 days) and the other movable feasts follow.
 * Verified against Meeus' Julian Easter algorithm for 1900–2100 (#36).
 *
 * @throws `RangeError` for a year below 1 or not an integer.
 *
 * @example
 * ```ts
 * const b = bahireHasab(2016);
 * b.metqe;    // 10
 * b.nineveh;  // { calendar: 'ethiopian', year: 2016, month: 6, day: 18 } (26 February 2024)
 * ```
 */
export function bahireHasab(ethiopianYear: number): BahireHasab {
  if (!Number.isInteger(ethiopianYear) || ethiopianYear < 1) {
    throw new RangeError(`Ethiopian year must be an integer of at least 1, got ${ethiopianYear}`);
  }
  const ameteAlem = ethiopianYear + 5500;
  const wenber = (ameteAlem - 1) % 19;
  const abekte = (wenber * 11) % 30;
  const metqe = (wenber * 19) % 30;

  const metqeDay = metqe === 0 ? 30 : metqe;
  const inMeskerem = metqeDay > 14;
  const bealeMetqe = date('ethiopian', ethiopianYear, inMeskerem ? 1 : 2, metqeDay);
  const tewsak = TEWSAK[dayOfWeek(bealeMetqe)] ?? 0;
  const mebajaHamer = metqeDay + tewsak;

  const month = inMeskerem ? 5 : 6; // Tir or Yekatit
  const nineveh =
    mebajaHamer > 30
      ? date('ethiopian', ethiopianYear, month + 1, mebajaHamer - 30)
      : date('ethiopian', ethiopianYear, month, mebajaHamer);

  return Object.freeze({
    year: ethiopianYear,
    ameteAlem,
    evangelist: EVANGELISTS[ameteAlem % 4] ?? 'john',
    wenber,
    abekte,
    metqe,
    bealeMetqe,
    tewsak,
    mebajaHamer,
    nineveh,
    newYearWeekday: dayOfWeek(date('ethiopian', ethiopianYear, 1, 1)),
  });
}
