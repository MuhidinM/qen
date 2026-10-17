import { convert } from '../convert.js';
import { date } from '../date.js';
import type { CalendarDate } from '../types.js';
import type { Holiday, HolidayCategory, HolidayId } from './types.js';

interface FixedRule {
  readonly id: HolidayId;
  readonly categories: readonly HolidayCategory[];
  /** Month and day in the Ethiopian or Gregorian calendar. */
  readonly on: readonly ['ethiopian' | 'gregorian', number, number];
  /** Genna: fixed on a Gregorian day, but reported in the Ethiopian calendar (N-016). */
  readonly reportIn?: 'ethiopian';
}

const PUBLIC: readonly HolidayCategory[] = ['public'];
const PUBLIC_ORTHODOX: readonly HolidayCategory[] = ['public', 'orthodox'];

/** Fixed-date public holidays (PLAN.md §3.4; N-016, N-017). */
const RULES: readonly FixedRule[] = [
  { id: 'enkutatash', categories: PUBLIC, on: ['ethiopian', 1, 1] },
  { id: 'meskel', categories: PUBLIC_ORTHODOX, on: ['ethiopian', 1, 17] },
  { id: 'genna', categories: PUBLIC_ORTHODOX, on: ['gregorian', 1, 7], reportIn: 'ethiopian' },
  { id: 'timket', categories: PUBLIC_ORTHODOX, on: ['ethiopian', 5, 11] },
  { id: 'adwa', categories: PUBLIC, on: ['ethiopian', 6, 23] },
  { id: 'labour-day', categories: PUBLIC, on: ['gregorian', 5, 1] },
  { id: 'patriots-victory', categories: PUBLIC, on: ['ethiopian', 8, 27] },
  { id: 'derg-downfall', categories: PUBLIC, on: ['ethiopian', 9, 20] },
];

function occurrence(rule: FixedRule, own: CalendarDate): Holiday {
  const gregorian = convert(own, 'gregorian');
  const reported = rule.reportIn ? convert(own, rule.reportIn) : own;
  return Object.freeze({
    id: rule.id,
    categories: Object.freeze([...rule.categories]),
    calendar: reported.calendar,
    rule: 'fixed' as const,
    date: reported,
    gregorian,
  });
}

/**
 * The fixed-date holidays that fall in a Gregorian year, sorted by date. Internal: the
 * public API is `getHolidays` and friends.
 */
export function fixedHolidays(gregorianYear: number): Holiday[] {
  const out: Holiday[] = [];
  for (const rule of RULES) {
    const [calendar, month, day] = rule.on;
    // An Ethiopian year starts in September, so years Y − 8 and Y − 7 both touch Gregorian Y.
    const years =
      calendar === 'gregorian' ? [gregorianYear] : [gregorianYear - 8, gregorianYear - 7];
    for (const year of years) {
      if (year < 1) continue;
      const h = occurrence(rule, date(calendar, year, month, day));
      if (h.gregorian.year === gregorianYear) out.push(h);
    }
  }
  return out.sort(
    (a, b) => a.gregorian.month - b.gregorian.month || a.gregorian.day - b.gregorian.day,
  );
}
