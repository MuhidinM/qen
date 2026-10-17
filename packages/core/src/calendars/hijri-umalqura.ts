import { InvalidDateError } from '../errors.js';
import { hijri } from './hijri.js';
import { hijriTabularFromJDN, hijriTabularToJDN } from './hijri-tabular.js';
import {
  UMALQURA_FIRST_YEAR,
  UMALQURA_LAST_YEAR,
  UMALQURA_MONTH_LENGTHS,
  UMALQURA_START_JDN,
} from './umalqura-table.js';

/** JDN of the 1st of every month in the table, plus 1 Muharram of the year after it. */
const MONTH_STARTS: readonly number[] = (() => {
  const starts = [UMALQURA_START_JDN];
  for (let y = 0; y <= UMALQURA_LAST_YEAR - UMALQURA_FIRST_YEAR; y++) {
    const bits = parseInt(UMALQURA_MONTH_LENGTHS.slice(y * 3, y * 3 + 3), 16);
    for (let m = 0; m < 12; m++) {
      starts.push((starts.at(-1) ?? 0) + (bits & (1 << m) ? 30 : 29));
    }
  }
  return starts;
})();

const startOf = (index: number): number => MONTH_STARTS[index] ?? Number.NaN;
const TABLE_END = startOf(MONTH_STARTS.length - 1);

/** Whether a Hijri year is inside the Umm al-Qura table; outside it, tabular is used. */
export function umalquraCovers(year: number): boolean {
  return year >= UMALQURA_FIRST_YEAR && year <= UMALQURA_LAST_YEAR;
}

/** Whether a JDN falls inside the Umm al-Qura table. */
export function umalquraCoversJDN(jdn: number): boolean {
  return jdn >= UMALQURA_START_JDN && jdn < TABLE_END;
}

/**
 * Julian Day Number of a Hijri date under Umm al-Qura, falling back to tabular outside
 * 1300–1500 AH (both methods start 1300 and 1501 AH on the same day, so there is no seam).
 *
 * @throws {@link InvalidDateError} for a 30th the month does not have.
 */
export function umalquraToJDN(year: number, month: number, day: number): number {
  if (!umalquraCovers(year)) return hijriTabularToJDN(year, month, day);
  const index = (year - UMALQURA_FIRST_YEAR) * 12 + month - 1;
  const start = startOf(index);
  if (day > startOf(index + 1) - start) {
    throw new InvalidDateError(
      `${hijri.monthNames[month - 1]} ${day} does not exist in ${year} AH (Umm al-Qura method)`,
      'hijri',
      year,
      month,
      day,
    );
  }
  return start + day - 1;
}

/** Hijri date of a Julian Day Number under Umm al-Qura, tabular outside the table. */
export function umalquraFromJDN(jdn: number): { year: number; month: number; day: number } {
  if (!umalquraCoversJDN(jdn)) return hijriTabularFromJDN(jdn);
  // Binary search for the month whose start is the last one <= jdn.
  let lo = 0;
  let hi = MONTH_STARTS.length - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (startOf(mid) <= jdn) lo = mid;
    else hi = mid - 1;
  }
  return {
    year: UMALQURA_FIRST_YEAR + Math.floor(lo / 12),
    month: (lo % 12) + 1,
    day: jdn - startOf(lo) + 1,
  };
}
