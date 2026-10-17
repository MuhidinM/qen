import { describe, expect, it } from 'vitest';
import {
  addMonths,
  addYears,
  compare,
  convert,
  date,
  diff,
  fromJDN,
  InvalidDateError,
  isSame,
  toJDN,
  type CalendarId,
  type DiffUnit,
} from '../src/index.js';

describe('compare() and isSame()', () => {
  it('orders dates by day, across calendars', () => {
    const meskerem1 = date('ethiopian', 2019, 1, 1); // 11 Sep 2026
    expect(compare(meskerem1, date('gregorian', 2026, 9, 11))).toBe(0);
    expect(compare(meskerem1, date('gregorian', 2026, 9, 12))).toBe(-1);
    expect(compare(meskerem1, date('hijri', 1448, 3, 27))).toBe(1);
    expect(
      [date('gregorian', 2026, 1, 1), meskerem1, date('ethiopian', 2018, 1, 1)].sort(compare),
    ).toEqual([date('ethiopian', 2018, 1, 1), date('gregorian', 2026, 1, 1), meskerem1]);
  });

  it('isSame is true for the same day in different calendars', () => {
    expect(isSame(date('ethiopian', 2019, 2, 7), date('gregorian', 2026, 10, 17))).toBe(true);
    expect(isSame(date('ethiopian', 2019, 2, 7), date('gregorian', 2026, 10, 18))).toBe(false);
    expect(isSame(date('hijri', 1448, 5, 6), date('gregorian', 2026, 10, 17))).toBe(true);
    expect(
      isSame(date('hijri', 1448, 5, 6), date('gregorian', 2026, 10, 17), {
        hijri: { method: 'tabular' },
      }),
    ).toBe(false);
  });
});

describe('diff(from, to, unit) = to − from', () => {
  it('counts days and whole weeks', () => {
    expect(diff(date('gregorian', 2026, 1, 1), date('gregorian', 2026, 12, 31), 'days')).toBe(364);
    expect(diff(date('ethiopian', 2019, 1, 1), date('ethiopian', 2018, 13, 5), 'days')).toBe(-1);
    expect(diff(date('gregorian', 2026, 10, 1), date('gregorian', 2026, 10, 14), 'weeks')).toBe(1);
    expect(diff(date('gregorian', 2026, 10, 14), date('gregorian', 2026, 10, 1), 'weeks')).toBe(-1);
    expect(diff(date('gregorian', 2026, 10, 1), date('gregorian', 2026, 10, 15), 'weeks')).toBe(2);
  });

  it('counts whole months in the calendar of `from` (N-014)', () => {
    expect(diff(date('ethiopian', 2018, 11, 30), date('ethiopian', 2019, 1, 1), 'months')).toBe(2); // via Pagume
    expect(diff(date('ethiopian', 2018, 1, 15), date('ethiopian', 2019, 1, 14), 'months')).toBe(12);
    expect(diff(date('ethiopian', 2018, 1, 15), date('ethiopian', 2019, 1, 15), 'months')).toBe(13);
    expect(diff(date('gregorian', 2026, 1, 31), date('gregorian', 2026, 2, 28), 'months')).toBe(1); // clamped, as addMonths
    expect(diff(date('gregorian', 2026, 3, 15), date('gregorian', 2026, 1, 16), 'months')).toBe(-1);
    // `to` in another calendar is converted into the calendar of `from`.
    expect(diff(date('ethiopian', 2018, 1, 1), date('gregorian', 2026, 9, 11), 'months')).toBe(13);
  });

  it('counts whole years', () => {
    expect(diff(date('ethiopian', 2015, 13, 6), date('ethiopian', 2016, 13, 5), 'years')).toBe(1);
    expect(diff(date('gregorian', 2024, 2, 29), date('gregorian', 2025, 2, 27), 'years')).toBe(0);
    expect(diff(date('gregorian', 2024, 2, 29), date('gregorian', 2025, 2, 28), 'years')).toBe(1);
    expect(diff(date('gregorian', 2026, 10, 17), date('gregorian', 2016, 10, 18), 'years')).toBe(
      -9,
    );
  });

  it('is consistent with addMonths/addYears (property test)', () => {
    const base = toJDN(date('gregorian', 2000, 1, 1));
    for (const c of ['gregorian', 'ethiopian', 'hijri'] as CalendarId[]) {
      for (let i = 0; i < 400; i++) {
        const a = fromJDN(base + i * 37, c);
        const b = fromJDN(base + ((i * 7919) % 15000), c);
        const months = diff(a, b, 'months');
        const years = diff(a, b, 'years');
        if (compare(a, b) <= 0) {
          expect(compare(addMonths(a, months), b)).toBeLessThanOrEqual(0);
          expect(compare(addMonths(a, months + 1), b)).toBe(1);
          expect(compare(addYears(a, years), b)).toBeLessThanOrEqual(0);
          expect(compare(addYears(a, years + 1), b)).toBe(1);
        } else {
          expect(compare(addMonths(a, months), b)).toBeGreaterThanOrEqual(0);
          expect(compare(addMonths(a, months - 1), b)).toBe(-1);
        }
      }
    }
  });

  it('is antisymmetric in days and weeks', () => {
    const a = date('ethiopian', 2019, 1, 17);
    const b = convert(date('gregorian', 2027, 1, 7), 'ethiopian');
    expect(diff(a, b, 'days')).toBe(-diff(b, a, 'days'));
    expect(diff(a, b, 'weeks')).toBe(-diff(b, a, 'weeks'));
  });

  it('validates input', () => {
    const bad = { calendar: 'gregorian', year: 2025, month: 2, day: 29 } as const;
    expect(() => diff(bad, date('gregorian', 2026, 1, 1), 'days')).toThrow(InvalidDateError);
    expect(() => compare(date('gregorian', 2026, 1, 1), bad)).toThrow(InvalidDateError);
    const hours = 'hours' as unknown as DiffUnit;
    expect(() => diff(date('gregorian', 2026, 1, 1), date('gregorian', 2026, 1, 2), hours)).toThrow(
      'Unknown unit "hours": expected days, weeks, months or years',
    );
  });
});
