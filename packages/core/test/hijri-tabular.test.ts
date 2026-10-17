import { describe, expect, it } from 'vitest';
import { InvalidDateError } from '../src/errors.js';
import { gregorianToJDN as g } from '../src/calendars/gregorian.js';
import {
  hijriTabularDaysInMonth,
  hijriTabularFromJDN,
  hijriTabularToJDN,
  isHijriTabularLeapYear,
} from '../src/calendars/hijri-tabular.js';

describe('Hijri (tabular) ↔ JDN', () => {
  it.each([
    // Civil epoch: Friday 16 July 622 Julian = 19 July 622 proleptic Gregorian
    ['1 Muharram 1 AH = JDN 1948440', 1, 1, 1, 1_948_440],
    // Intl islamic-civil, ICU 77.1 (also recorded in PLAN.md §5)
    ['1 Ramadan 1447 = 18 Feb 2026', 1447, 9, 1, g(2026, 2, 18)],
    ['1 Shawwal 1447 = 20 Mar 2026', 1447, 10, 1, g(2026, 3, 20)],
    ['5 Jumada al-Ula 1448 = 17 Oct 2026', 1448, 5, 5, g(2026, 10, 17)],
    ['24 Ramadan 1420 = 1 Jan 2000', 1420, 9, 24, g(2000, 1, 1)],
    ["28 Sha'ban 1317 = 1 Jan 1900", 1317, 8, 28, g(1900, 1, 1)],
    ['29 Shawwal 1524 = 31 Dec 2100', 1524, 10, 29, g(2100, 12, 31)],
  ])('%s', (_, y, m, d, jdn) => {
    expect(hijriTabularToJDN(y, m, d)).toBe(jdn);
    expect(hijriTabularFromJDN(jdn)).toEqual({ year: y, month: m, day: d });
  });

  it('round-trips every day from 1900 to 2100 with no gaps', () => {
    let previous = hijriTabularFromJDN(g(1900, 1, 1) - 1);
    for (let jdn = g(1900, 1, 1); jdn <= g(2100, 12, 31); jdn++) {
      const h = hijriTabularFromJDN(jdn);
      expect(hijriTabularToJDN(h.year, h.month, h.day)).toBe(jdn);
      const expected =
        previous.day < hijriTabularDaysInMonth(previous.year, previous.month)
          ? { ...previous, day: previous.day + 1 }
          : previous.month < 12
            ? { year: previous.year, month: previous.month + 1, day: 1 }
            : { year: previous.year + 1, month: 1, day: 1 };
      if (h.year !== expected.year || h.month !== expected.month || h.day !== expected.day) {
        expect(h, `day after ${JSON.stringify(previous)}`).toEqual(expected);
      }
      previous = h;
    }
  });

  it('round-trips at the edges of the supported range', () => {
    for (const [y, m, d] of [
      [1, 1, 1],
      [2, 12, 30],
      [9999, 12, 29],
    ] as const) {
      expect(hijriTabularFromJDN(hijriTabularToJDN(y, m, d))).toEqual({
        year: y,
        month: m,
        day: d,
      });
    }
  });
});

describe('Hijri tabular month lengths and leap years', () => {
  it('has leap years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 of each 30-year cycle (N-006)', () => {
    const leap = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    for (const cycleStart of [0, 1410, 1440]) {
      const found = Array.from({ length: 30 }, (_, i) => i + 1).filter((n) =>
        isHijriTabularLeapYear(cycleStart + n),
      );
      expect(found).toEqual(leap);
    }
  });

  it('alternates 30- and 29-day months, with a 30-day Dhu al-Hijjah in leap years', () => {
    expect(Array.from({ length: 12 }, (_, i) => hijriTabularDaysInMonth(1446, i + 1))).toEqual([
      30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29,
    ]);
    expect(hijriTabularDaysInMonth(1447, 12)).toBe(30);
    expect(hijriTabularToJDN(1448, 1, 1) - hijriTabularToJDN(1447, 1, 1)).toBe(355);
    expect(hijriTabularToJDN(1447, 1, 1) - hijriTabularToJDN(1446, 1, 1)).toBe(354);
  });

  it('rejects a 30th that the tabular method does not have (N-025)', () => {
    expect(() => hijriTabularToJDN(1446, 12, 30)).toThrow(InvalidDateError);
    expect(() => hijriTabularToJDN(1446, 12, 30)).toThrow(
      'Dhu al-Hijjah 30 does not exist in 1446 AH (tabular method)',
    );
    expect(() => hijriTabularToJDN(1447, 2, 30)).toThrow('Safar 30 does not exist in 1447 AH');
    expect(hijriTabularToJDN(1447, 12, 30)).toBe(hijriTabularToJDN(1448, 1, 1) - 1);
  });
});
