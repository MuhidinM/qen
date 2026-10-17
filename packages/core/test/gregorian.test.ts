import { describe, expect, it } from 'vitest';
import {
  gregorian,
  gregorianFromJDN,
  gregorianToJDN,
  isGregorianLeapYear,
} from '../src/calendars/gregorian.js';

/** Independent oracle: JS Date is proleptic Gregorian; JDN 2440588 is 1970-01-01. */
function jdnFromJSDate(year: number, month: number, day: number): number {
  const d = new Date(0);
  d.setUTCFullYear(year, month - 1, day);
  return Math.round(d.getTime() / 86_400_000) + 2_440_588;
}

describe('Gregorian ↔ JDN', () => {
  it.each([
    ['1 Jan 2000', 2000, 1, 1, 2_451_545],
    ['1 Jan 1970 (Unix epoch)', 1970, 1, 1, 2_440_588],
    ['15 Oct 1582 (first day of the Gregorian reform)', 1582, 10, 15, 2_299_161],
    ['19 Jul 622 (1 Muharram 1 AH, civil epoch)', 622, 7, 19, 1_948_440],
    ['1 Jan 1 (proleptic)', 1, 1, 1, 1_721_426],
    ['12 Sep 2023 (Meskerem 1, 2016 EC)', 2023, 9, 12, 2_460_200],
    ['11 Sep 2026 (Meskerem 1, 2019 EC)', 2026, 9, 11, 2_461_295],
  ])('%s', (_, y, m, d, jdn) => {
    expect(gregorianToJDN(y, m, d)).toBe(jdn);
    expect(gregorianFromJDN(jdn)).toEqual({ year: y, month: m, day: d });
  });

  it('matches JS Date for every day from 1900 to 2100', () => {
    const first = gregorianToJDN(1900, 1, 1);
    const last = gregorianToJDN(2100, 12, 31);
    let mismatches = 0;
    for (let jdn = first; jdn <= last; jdn++) {
      const { year, month, day } = gregorianFromJDN(jdn);
      if (jdnFromJSDate(year, month, day) !== jdn || gregorianToJDN(year, month, day) !== jdn) {
        mismatches++;
      }
    }
    expect(mismatches).toBe(0);
    expect(last - first + 1).toBe(73_414);
  });

  it('round-trips at the edges of the supported range', () => {
    for (const [y, m, d] of [
      [1, 1, 1],
      [1, 12, 31],
      [9999, 12, 31],
    ] as const) {
      expect(gregorianFromJDN(gregorianToJDN(y, m, d))).toEqual({ year: y, month: m, day: d });
    }
  });
});

describe('Gregorian leap years and month lengths', () => {
  it('follows the 4/100/400 rule', () => {
    expect(isGregorianLeapYear(2024)).toBe(true);
    expect(isGregorianLeapYear(2000)).toBe(true);
    expect(isGregorianLeapYear(1900)).toBe(false);
    expect(isGregorianLeapYear(2100)).toBe(false);
    expect(isGregorianLeapYear(2025)).toBe(false);
  });

  it('gives February 28 or 29 days and the rest their fixed lengths', () => {
    expect(gregorian.maxDay(2024, 2)).toBe(29);
    expect(gregorian.maxDay(1900, 2)).toBe(28);
    expect([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => gregorian.maxDay(2025, m))).toEqual([
      31, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ]);
  });
});
