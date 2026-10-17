import { convert, fromJDN, toJDN } from '../convert.js';
import { date } from '../date.js';
import type { ConvertOptions } from '../types.js';
import { hijriStatus } from './status.js';
import type { Holiday, HolidayCategory, HolidayId } from './types.js';

const ISLAMIC: readonly HolidayCategory[] = ['islamic'];
const PUBLIC_ISLAMIC: readonly HolidayCategory[] = ['public', 'islamic'];

/** Islamic holidays and observances by Hijri month and day (PLAN.md §3.4). */
const RULES: readonly (readonly [
  HolidayId,
  number,
  number,
  readonly HolidayCategory[],
  boolean?,
])[] = [
  ['islamic-new-year', 1, 1, ISLAMIC],
  ['ashura', 1, 10, ISLAMIC],
  ['mawlid', 3, 12, PUBLIC_ISLAMIC],
  ['isra-miraj', 7, 27, ISLAMIC],
  ['ramadan-start', 9, 1, ISLAMIC],
  ['laylat-al-qadr', 9, 27, ISLAMIC, true], // traditionally the 27th; the exact night is unknown
  ['eid-al-fitr', 10, 1, PUBLIC_ISLAMIC],
  ['arafah', 12, 9, ISLAMIC],
  ['eid-al-adha', 12, 10, PUBLIC_ISLAMIC],
];

/**
 * The Islamic holidays and observances that fall in a Gregorian year, under the Hijri method
 * in `options` (Umm al-Qura by default). A Hijri year is 11 days shorter than a Gregorian one,
 * so a holiday can fall twice in one Gregorian year. All are `expected` until official month
 * starts can confirm them (M5). Internal: the public API is `getHolidays` and friends.
 */
export function islamicHolidays(gregorianYear: number, options: ConvertOptions = {}): Holiday[] {
  const first = fromJDN(toJDN(date('gregorian', gregorianYear, 1, 1)), 'hijri', options).year;
  const last = fromJDN(toJDN(date('gregorian', gregorianYear, 12, 31)), 'hijri', options).year;
  const out: Holiday[] = [];
  for (let year = first; year <= last; year++) {
    for (const [id, month, day, categories, approximate] of RULES) {
      const own = date('hijri', year, month, day);
      const gregorian = convert(own, 'gregorian', options);
      if (gregorian.year !== gregorianYear) continue;
      out.push(
        Object.freeze({
          id,
          categories: Object.freeze([...categories]),
          calendar: 'hijri' as const,
          rule: 'fixed' as const,
          date: own,
          gregorian,
          ...hijriStatus(year, month, options),
          ...(approximate ? { approximate: true } : {}),
        }),
      );
    }
  }
  return out.sort((a, b) => toJDN(a.gregorian) - toJDN(b.gregorian));
}
