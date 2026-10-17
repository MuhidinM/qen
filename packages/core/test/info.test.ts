import { describe, expect, it } from 'vitest';
import {
  date,
  dayOfWeek,
  daysInMonth,
  fromJDN,
  InvalidDateError,
  isLeapYear,
  monthsInYear,
  toJDN,
  type CalendarId,
} from '../src/index.js';

const TAB = { hijri: { method: 'tabular' } } as const;

describe('dayOfWeek() (0 = Sunday)', () => {
  it.each([
    ['Meskerem 1, 2019 EC (11 Sep 2026) is a Friday', date('ethiopian', 2019, 1, 1), 5],
    ['17 Oct 2026 is a Saturday', date('gregorian', 2026, 10, 17), 6],
    ['1 Jan 1900 is a Monday', date('gregorian', 1900, 1, 1), 1],
    ['1 Ramadan 1447 (18 Feb 2026) is a Wednesday', date('hijri', 1447, 9, 1), 3],
  ])('%s', (_, d, weekday) => {
    expect(dayOfWeek(d)).toBe(weekday);
  });

  it('matches Date.getUTCDay() for every day 1900–2100, in every calendar', () => {
    const first = toJDN(date('gregorian', 1900, 1, 1));
    const last = toJDN(date('gregorian', 2100, 12, 31));
    let bad = 0;
    for (let jdn = first; jdn <= last; jdn++) {
      const expected = new Date((jdn - 2_440_588) * 86_400_000).getUTCDay();
      for (const c of ['gregorian', 'ethiopian', 'hijri'] as CalendarId[]) {
        if (dayOfWeek(fromJDN(jdn, c)) !== expected) bad++;
      }
    }
    expect(bad).toBe(0);
  });

  it('depends on the Hijri method for the same Hijri date', () => {
    // 6 Jumada al-Ula 1448 is 17 Oct 2026 under Umm al-Qura and 18 Oct under tabular.
    expect(dayOfWeek(date('hijri', 1448, 5, 6))).toBe(6);
    expect(dayOfWeek(date('hijri', 1448, 5, 6), TAB)).toBe(0);
  });

  it('validates its input', () => {
    expect(() => dayOfWeek({ calendar: 'gregorian', year: 2025, month: 2, day: 29 })).toThrow(
      InvalidDateError,
    );
  });
});

describe('monthsInYear()', () => {
  it('is 12, 13 and 12', () => {
    expect(monthsInYear('gregorian', 2026)).toBe(12);
    expect(monthsInYear('ethiopian', 2019)).toBe(13);
    expect(monthsInYear('hijri', 1447)).toBe(12);
  });

  it('rejects invalid years', () => {
    expect(() => monthsInYear('ethiopian', 0)).toThrow(InvalidDateError);
    expect(() => monthsInYear('ethiopian', 1.5)).toThrow(InvalidDateError);
  });
});

describe('isLeapYear()', () => {
  it('Gregorian: 4/100/400 rule', () => {
    expect([1900, 2000, 2024, 2026].map((y) => isLeapYear('gregorian', y))).toEqual([
      false,
      true,
      true,
      false,
    ]);
  });

  it('Ethiopian: year % 4 === 3 (PLAN.md §5)', () => {
    expect([2015, 2016, 2018, 2019].map((y) => isLeapYear('ethiopian', y))).toEqual([
      true,
      false,
      false,
      true,
    ]);
  });

  it('Hijri: a 355-day year under the method in use', () => {
    // Tabular: 1447 is year 7 of its cycle (leap); 1446 is not.
    expect(isLeapYear('hijri', 1447, TAB)).toBe(true);
    expect(isLeapYear('hijri', 1446, TAB)).toBe(false);
    for (const y of [1440, 1445, 1446, 1447, 1448]) {
      const length = toJDN(date('hijri', y + 1, 1, 1)) - toJDN(date('hijri', y, 1, 1));
      expect(isLeapYear('hijri', y), `${y} AH has ${length} days`).toBe(length === 355);
    }
  });
});

describe('daysInMonth()', () => {
  it('Gregorian and Ethiopian month lengths', () => {
    expect(daysInMonth('gregorian', 2024, 2)).toBe(29);
    expect(daysInMonth('gregorian', 2026, 4)).toBe(30);
    expect(daysInMonth('ethiopian', 2019, 1)).toBe(30);
    expect(daysInMonth('ethiopian', 2015, 13)).toBe(6);
    expect(daysInMonth('ethiopian', 2018, 13)).toBe(5);
  });

  it('Hijri month lengths follow the method', () => {
    expect(daysInMonth('hijri', 1446, 12, TAB)).toBe(29);
    expect(daysInMonth('hijri', 1447, 12, TAB)).toBe(30);
    for (let m = 1; m <= 12; m++) {
      const next = m === 12 ? date('hijri', 1448, 1, 1) : date('hijri', 1447, m + 1, 1);
      expect(daysInMonth('hijri', 1447, m)).toBe(toJDN(next) - toJDN(date('hijri', 1447, m, 1)));
    }
  });

  it('agrees with date() for every day of 1900–2100 in each calendar', () => {
    for (const c of ['gregorian', 'ethiopian', 'hijri'] as CalendarId[]) {
      const first = fromJDN(toJDN(date('gregorian', 1900, 1, 1)), c).year;
      for (let y = first; y < first + 200; y++) {
        for (let m = 1; m <= monthsInYear(c, y); m++) {
          const n = daysInMonth(c, y, m);
          expect(() => toJDN(date(c, y, m, n))).not.toThrow();
          if (n < 30 || c === 'gregorian') expect(() => toJDN(date(c, y, m, n + 1))).toThrow();
        }
      }
    }
  });

  it('rejects invalid months', () => {
    expect(() => daysInMonth('ethiopian', 2019, 14)).toThrow(
      'Month 14 does not exist in the Ethiopian calendar',
    );
    expect(() => daysInMonth('gregorian', 2026, 0)).toThrow(InvalidDateError);
  });
});
