import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  age,
  compare,
  date,
  fromJDN,
  toJDN,
  type CalendarId,
} from '../src/index.js';

describe('age(birth, on)', () => {
  it('counts in the birth date’s calendar', () => {
    // Born Meskerem 17, 1990 EC; on Tikimt 7, 2019 EC (17 Oct 2026).
    expect(age(date('ethiopian', 1990, 1, 17), date('ethiopian', 2019, 2, 7))).toEqual({
      years: 29,
      months: 0,
      days: 20,
    });
    // Same birth, `on` given in Gregorian: converted into Ethiopian first.
    expect(age(date('ethiopian', 1990, 1, 17), date('gregorian', 2026, 10, 17))).toEqual({
      years: 29,
      months: 0,
      days: 20,
    });
  });

  it('uses 13 Ethiopian months, with Pagume as a month', () => {
    expect(age(date('ethiopian', 2018, 12, 10), date('ethiopian', 2019, 1, 10))).toEqual({
      years: 0,
      months: 2,
      days: 0,
    });
    expect(age(date('ethiopian', 2018, 1, 1), date('ethiopian', 2018, 13, 5))).toEqual({
      years: 0,
      months: 12,
      days: 4,
    });
  });

  it('treats a Pagume 6 birthday as reached on Pagume 5 in common years', () => {
    expect(age(date('ethiopian', 2015, 13, 6), date('ethiopian', 2016, 13, 5))).toEqual({
      years: 1,
      months: 0,
      days: 0,
    });
    expect(age(date('ethiopian', 2015, 13, 6), date('ethiopian', 2016, 13, 4))).toEqual({
      years: 0,
      months: 12,
      days: 28,
    });
    expect(age(date('ethiopian', 2015, 13, 6), date('ethiopian', 2019, 13, 6))).toEqual({
      years: 4,
      months: 0,
      days: 0,
    });
  });

  it('treats a 29 February birthday as reached on 28 February in common years', () => {
    expect(age(date('gregorian', 2024, 2, 29), date('gregorian', 2025, 2, 28))).toEqual({
      years: 1,
      months: 0,
      days: 0,
    });
    expect(age(date('gregorian', 2024, 2, 29), date('gregorian', 2025, 3, 29))).toEqual({
      years: 1,
      months: 1,
      days: 0,
    });
  });

  it('works for Hijri birth dates', () => {
    expect(age(date('hijri', 1420, 9, 1), date('hijri', 1447, 9, 1))).toEqual({
      years: 27,
      months: 0,
      days: 0,
    });
    expect(age(date('hijri', 1420, 9, 1), date('hijri', 1447, 8, 29))).toEqual({
      years: 26,
      months: 11,
      days: 28,
    });
  });

  it('is zero on the birth date', () => {
    expect(age(date('ethiopian', 2019, 1, 1), date('gregorian', 2026, 9, 11))).toEqual({
      years: 0,
      months: 0,
      days: 0,
    });
  });

  it('adds back up to `on` (property test)', () => {
    const base = toJDN(date('gregorian', 1950, 1, 1));
    for (const c of ['gregorian', 'ethiopian', 'hijri'] as CalendarId[]) {
      const perYear = c === 'ethiopian' ? 13 : 12;
      for (let i = 0; i < 300; i++) {
        const birth = fromJDN(base + i * 61, c);
        const on = fromJDN(base + i * 61 + ((i * 7919) % 30000), c);
        const { years, months, days } = age(birth, on);
        expect(months).toBeLessThan(perYear);
        expect(compare(addDays(addMonths(birth, years * perYear + months), days), on)).toBe(0);
      }
    }
  });

  it('rejects `on` before the birth date', () => {
    expect(() => age(date('gregorian', 2026, 1, 2), date('gregorian', 2026, 1, 1))).toThrow(
      'The "on" date is before the birth date',
    );
  });
});
