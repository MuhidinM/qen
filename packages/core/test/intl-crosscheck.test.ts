import { describe, expect, it } from 'vitest';
import { date, fromJDN, toJDN, type CalendarId } from '../src/index.js';

// An independent implementation (ICU, through Intl) is the strongest evidence that our
// formulas are right (R-CAL-10). Runtime code never uses Intl calendars (ADR-0004, N-007).

const FIRST = toJDN(date('gregorian', 1900, 1, 1));
const LAST = toJDN(date('gregorian', 2100, 12, 31));
const UNIX_EPOCH_JDN = 2_440_588;

function formatter(icuCalendar: string): Intl.DateTimeFormat {
  const f = new Intl.DateTimeFormat(`en-u-ca-${icuCalendar}`, {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  if (f.resolvedOptions().calendar !== icuCalendar) {
    throw new Error(
      `This runtime lacks the ICU "${icuCalendar}" calendar (got "${f.resolvedOptions().calendar}"). ` +
        'Run the cross-check on Node with full ICU (N-007).',
    );
  }
  return f;
}

function icuDate(
  f: Intl.DateTimeFormat,
  jdn: number,
): { year: number; month: number; day: number } {
  const parts = f.formatToParts(new Date((jdn - UNIX_EPOCH_JDN) * 86_400_000));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

describe.each<[CalendarId, string]>([
  ['ethiopian', 'ethiopic'],
  ['hijri', 'islamic-civil'],
])('%s vs Intl %s', (calendar, icuCalendar) => {
  it('agrees on every day from 1900 to 2100', () => {
    const f = formatter(icuCalendar);
    const mismatches: string[] = [];
    for (let jdn = FIRST; jdn <= LAST; jdn++) {
      const ours = fromJDN(jdn, calendar);
      const icu = icuDate(f, jdn);
      if (ours.year !== icu.year || ours.month !== icu.month || ours.day !== icu.day) {
        mismatches.push(
          `JDN ${jdn}: ours ${ours.year}-${ours.month}-${ours.day}, ICU ${icu.year}-${icu.month}-${icu.day}`,
        );
      }
    }
    expect(mismatches.slice(0, 10)).toEqual([]);
    expect(mismatches.length).toBe(0);
  });
});
