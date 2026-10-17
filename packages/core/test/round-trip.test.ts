import { describe, expect, it } from 'vitest';
import { date, fromJDN, isValid, toJDN, type CalendarId } from '../src/index.js';

const FIRST = toJDN(date('gregorian', 1900, 1, 1));
const LAST = toJDN(date('gregorian', 2100, 12, 31));
const CALENDARS: CalendarId[] = ['gregorian', 'ethiopian', 'hijri'];

describe.each(CALENDARS)('%s: every day 1900–2100', (calendar) => {
  it('round-trips through the public API: toJDN(fromJDN(jdn)) === jdn', () => {
    let failures = 0;
    for (let jdn = FIRST; jdn <= LAST; jdn++) {
      const d = fromJDN(jdn, calendar);
      if (!isValid(d) || toJDN(d) !== jdn) failures++;
    }
    expect(failures).toBe(0);
  });

  it('gives consecutive days strictly increasing (year, month, day), with no repeats', () => {
    const bad: string[] = [];
    let prev = fromJDN(FIRST, calendar);
    for (let jdn = FIRST + 1; jdn <= LAST; jdn++) {
      const d = fromJDN(jdn, calendar);
      const nextDay = d.year === prev.year && d.month === prev.month && d.day === prev.day + 1;
      const nextMonth = d.year === prev.year && d.month === prev.month + 1 && d.day === 1;
      const nextYear = d.year === prev.year + 1 && d.month === 1 && d.day === 1;
      if (!nextDay && !nextMonth && !nextYear)
        bad.push(`${JSON.stringify(prev)} → ${JSON.stringify(d)}`);
      prev = d;
    }
    expect(bad).toEqual([]);
  });

  it('round-trips year 1 and year 9999', () => {
    for (const d of [date(calendar, 1, 1, 1), date(calendar, 9999, 1, 1)]) {
      expect(fromJDN(toJDN(d), calendar)).toEqual(d);
    }
  });
});

describe('every date in 1900–2100 has a unique JDN', () => {
  it('maps 73,414 days to 73,414 distinct dates in each calendar', () => {
    for (const calendar of CALENDARS) {
      const seen = new Set<string>();
      for (let jdn = FIRST; jdn <= LAST; jdn++) {
        const { year, month, day } = fromJDN(jdn, calendar);
        seen.add(`${year}-${month}-${day}`);
      }
      expect(seen.size, calendar).toBe(LAST - FIRST + 1);
    }
  });
});
