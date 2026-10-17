import { describe, expect, expectTypeOf, it } from 'vitest';
import { date, InvalidDateError, isValid, type CalendarDate } from '../src/index.js';

function errorOf(fn: () => unknown): InvalidDateError {
  try {
    fn();
  } catch (e) {
    if (e instanceof InvalidDateError) return e;
    throw e;
  }
  throw new Error('expected InvalidDateError, nothing was thrown');
}

describe('date()', () => {
  it('returns a plain date object with 1-based months', () => {
    expect(date('ethiopian', 2019, 1, 17)).toEqual({
      calendar: 'ethiopian',
      year: 2019,
      month: 1,
      day: 17,
    });
  });

  it('returns a frozen object that survives JSON and structuredClone', () => {
    const d = date('gregorian', 2026, 10, 17);
    expect(Object.isFrozen(d)).toBe(true);
    expect(JSON.parse(JSON.stringify(d))).toEqual(d);
    // structuredClone exists in every supported runtime but not in the ES2022 type library.
    const { structuredClone } = globalThis as unknown as { structuredClone: <T>(v: T) => T };
    expect(structuredClone(d)).toEqual(d);
  });

  it('narrows the calendar type', () => {
    expectTypeOf(date('ethiopian', 2019, 1, 1)).toEqualTypeOf<CalendarDate<'ethiopian'>>();
    expectTypeOf(date('hijri', 1447, 9, 1).calendar).toEqualTypeOf<'hijri'>();
    expectTypeOf<CalendarDate['year']>().toEqualTypeOf<number>();
  });

  describe('Gregorian', () => {
    it('accepts 29 February in leap years only', () => {
      expect(date('gregorian', 2024, 2, 29).day).toBe(29);
      expect(date('gregorian', 2000, 2, 29).day).toBe(29);
      expect(errorOf(() => date('gregorian', 1900, 2, 29)).message).toBe(
        'February 29 does not exist in 1900',
      );
      expect(() => date('gregorian', 2025, 2, 29)).toThrow(InvalidDateError);
    });

    it('rejects day 31 in 30-day months', () => {
      expect(errorOf(() => date('gregorian', 2025, 4, 31)).message).toBe(
        'April 31 does not exist in 2025',
      );
      expect(date('gregorian', 2025, 12, 31).day).toBe(31);
    });

    it('rejects month 13', () => {
      expect(errorOf(() => date('gregorian', 2025, 13, 1)).message).toBe(
        'Month 13 does not exist in the Gregorian calendar (months 1–12)',
      );
    });
  });

  describe('Ethiopian', () => {
    it('has 13 months: 12 of 30 days and Pagume', () => {
      expect(date('ethiopian', 2018, 12, 30).day).toBe(30);
      expect(date('ethiopian', 2018, 13, 5).day).toBe(5);
      expect(errorOf(() => date('ethiopian', 2018, 1, 31)).message).toBe(
        'Meskerem 31 does not exist in 2018 EC',
      );
    });

    it('allows Pagume 6 only in leap years (year % 4 === 3)', () => {
      // PLAN.md §5: 2015 EC is a leap year, 2018 EC is not.
      expect(date('ethiopian', 2015, 13, 6).day).toBe(6);
      expect(date('ethiopian', 2011, 13, 6).day).toBe(6);
      expect(errorOf(() => date('ethiopian', 2018, 13, 6)).message).toBe(
        'Pagume 6 does not exist in 2018 EC',
      );
      expect(() => date('ethiopian', 2016, 13, 6)).toThrow(InvalidDateError);
      expect(() => date('ethiopian', 2015, 13, 7)).toThrow(InvalidDateError);
    });

    it('rejects month 14', () => {
      expect(errorOf(() => date('ethiopian', 2018, 14, 1)).message).toBe(
        'Month 14 does not exist in the Ethiopian calendar (months 1–13)',
      );
    });
  });

  describe('Hijri', () => {
    // Month lengths depend on the method (Umm al-Qura or tabular), so date() checks
    // structure only; conversion rejects a 30th that the method doesn't have (N-025).
    it('accepts days 1–30 in months 1–12', () => {
      expect(date('hijri', 1447, 9, 30).day).toBe(30);
      expect(date('hijri', 1447, 12, 1).month).toBe(12);
    });

    it('rejects day 31 and month 13', () => {
      expect(errorOf(() => date('hijri', 1447, 9, 31)).message).toBe(
        'Ramadan 31 does not exist in 1447 AH',
      );
      expect(errorOf(() => date('hijri', 1447, 13, 1)).message).toBe(
        'Month 13 does not exist in the Hijri calendar (months 1–12)',
      );
    });
  });

  describe('all calendars', () => {
    it('rejects year 0 and negative years (N-002)', () => {
      expect(errorOf(() => date('ethiopian', 0, 1, 1)).message).toBe(
        'Year 0 is out of range: years start at 1',
      );
      expect(() => date('gregorian', -1, 1, 1)).toThrow(InvalidDateError);
      expect(date('hijri', 1, 1, 1).year).toBe(1);
    });

    it('rejects day 0 and month 0', () => {
      expect(errorOf(() => date('gregorian', 2025, 1, 0)).message).toBe(
        'January 0 does not exist in 2025',
      );
      expect(errorOf(() => date('gregorian', 2025, 0, 1)).message).toBe(
        'Month 0 does not exist in the Gregorian calendar (months 1–12)',
      );
    });

    it('rejects non-integers, NaN and Infinity', () => {
      expect(errorOf(() => date('ethiopian', 2019.5, 1, 1)).message).toBe(
        'year must be an integer, got 2019.5',
      );
      expect(errorOf(() => date('ethiopian', 2019, 1.5, 1)).message).toBe(
        'month must be an integer, got 1.5',
      );
      expect(() => date('ethiopian', 2019, 1, Number.NaN)).toThrow(InvalidDateError);
      expect(() => date('ethiopian', Number.POSITIVE_INFINITY, 1, 1)).toThrow(InvalidDateError);
    });

    it('rejects an unknown calendar', () => {
      // @ts-expect-error: not a CalendarId
      expect(errorOf(() => date('julian', 2025, 1, 1)).message).toBe(
        'Unknown calendar "julian": expected gregorian, ethiopian or hijri',
      );
    });

    it('puts the offending date on the error', () => {
      const e = errorOf(() => date('ethiopian', 2018, 13, 6));
      expect(e).toBeInstanceOf(Error);
      expect(e.name).toBe('InvalidDateError');
      expect({ calendar: e.calendar, year: e.year, month: e.month, day: e.day }).toEqual({
        calendar: 'ethiopian',
        year: 2018,
        month: 13,
        day: 6,
      });
    });
  });
});

describe('isValid()', () => {
  it('returns true for valid dates and false for invalid ones, never throwing', () => {
    expect(isValid({ calendar: 'ethiopian', year: 2015, month: 13, day: 6 })).toBe(true);
    expect(isValid({ calendar: 'ethiopian', year: 2018, month: 13, day: 6 })).toBe(false);
    expect(isValid({ calendar: 'gregorian', year: 2025, month: 2, day: 29 })).toBe(false);
  });

  it('rejects values that are not date objects', () => {
    expect(isValid(null)).toBe(false);
    expect(isValid('2025-01-01')).toBe(false);
    expect(isValid({ calendar: 'gregorian', year: '2025', month: 1, day: 1 })).toBe(false);
    expect(isValid({ calendar: 'julian', year: 2025, month: 1, day: 1 })).toBe(false);
    expect(isValid({ year: 2025, month: 1, day: 1 })).toBe(false);
  });

  it('narrows unknown input to CalendarDate', () => {
    const input: unknown = JSON.parse('{"calendar":"hijri","year":1447,"month":9,"day":1}');
    if (isValid(input)) expectTypeOf(input).toEqualTypeOf<CalendarDate>();
    expect(isValid(input)).toBe(true);
  });
});
