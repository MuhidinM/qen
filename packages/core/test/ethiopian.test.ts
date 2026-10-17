import { describe, expect, it } from 'vitest';
import {
  ethiopian,
  ethiopianFromJDN,
  ethiopianToJDN,
  isEthiopianLeapYear,
} from '../src/calendars/ethiopian.js';
import {
  gregorianFromJDN,
  gregorianToJDN,
  isGregorianLeapYear,
} from '../src/calendars/gregorian.js';

const g = gregorianToJDN;

describe('Ethiopian ↔ JDN', () => {
  it.each([
    // PLAN.md §5
    ['Meskerem 1, 2016 EC = 12 Sep 2023 (year after a leap year)', 2016, 1, 1, g(2023, 9, 12)],
    ['Meskerem 1, 2019 EC = 11 Sep 2026', 2019, 1, 1, g(2026, 9, 11)],
    // Leap day: the day before Meskerem 1, 2016
    ['Pagume 6, 2015 EC = 11 Sep 2023', 2015, 13, 6, g(2023, 9, 11)],
    ['Pagume 5, 2018 EC = 10 Sep 2026', 2018, 13, 5, g(2026, 9, 10)],
    // Intl ethiopic, ICU 77.1
    ['Tikimt 7, 2019 EC = 17 Oct 2026', 2019, 2, 7, g(2026, 10, 17)],
    ['Tahsas 22, 1992 EC = 1 Jan 2000', 1992, 4, 22, g(2000, 1, 1)],
    ['Tahsas 23, 1892 EC = 1 Jan 1900', 1892, 4, 23, g(1900, 1, 1)],
    ['Tahsas 21, 2093 EC = 31 Dec 2100', 2093, 4, 21, g(2100, 12, 31)],
    // Amete Mihret epoch
    ['Meskerem 1, 1 EC = JDN 1724221', 1, 1, 1, 1_724_221],
  ])('%s', (_, y, m, d, jdn) => {
    expect(ethiopianToJDN(y, m, d)).toBe(jdn);
    expect(ethiopianFromJDN(jdn)).toEqual({ year: y, month: m, day: d });
  });

  it('starts every year 1893–2092 EC on 11 September, or 12 September before a Gregorian leap year', () => {
    // PLAN.md §3.1. Meskerem 1 of EC year y falls in Gregorian year y + 7.
    for (let y = 1893; y <= 2092; y++) {
      const start = gregorianFromJDN(ethiopianToJDN(y, 1, 1));
      const expectedDay = isGregorianLeapYear(y + 8) ? 12 : 11;
      expect(start, `Meskerem 1, ${y} EC`).toEqual({ year: y + 7, month: 9, day: expectedDay });
    }
  });

  it('round-trips every day from 1900 to 2100 with no gaps', () => {
    let previous = ethiopianFromJDN(g(1900, 1, 1) - 1);
    for (let jdn = g(1900, 1, 1); jdn <= g(2100, 12, 31); jdn++) {
      const e = ethiopianFromJDN(jdn);
      expect(ethiopianToJDN(e.year, e.month, e.day)).toBe(jdn);
      const nextOfPrevious =
        previous.day < ethiopian.maxDay(previous.year, previous.month)
          ? { ...previous, day: previous.day + 1 }
          : previous.month < 13
            ? { year: previous.year, month: previous.month + 1, day: 1 }
            : { year: previous.year + 1, month: 1, day: 1 };
      if (
        e.year !== nextOfPrevious.year ||
        e.month !== nextOfPrevious.month ||
        e.day !== nextOfPrevious.day
      ) {
        expect(e, `day after ${JSON.stringify(previous)}`).toEqual(nextOfPrevious);
      }
      previous = e;
    }
  });

  it('round-trips at the edges of the supported range', () => {
    for (const [y, m, d] of [
      [1, 1, 1],
      [3, 13, 6],
      [9999, 13, 5],
    ] as const) {
      expect(ethiopianFromJDN(ethiopianToJDN(y, m, d))).toEqual({ year: y, month: m, day: d });
    }
  });
});

describe('Ethiopian leap years', () => {
  it('is a leap year when year % 4 === 3 (PLAN.md §5: 2015 leap, 2018 not)', () => {
    expect(isEthiopianLeapYear(2015)).toBe(true);
    expect(isEthiopianLeapYear(2019)).toBe(true);
    expect(isEthiopianLeapYear(2016)).toBe(false);
    expect(isEthiopianLeapYear(2018)).toBe(false);
    expect(ethiopian.maxDay(2015, 13)).toBe(6);
    expect(ethiopian.maxDay(2018, 13)).toBe(5);
  });
});
