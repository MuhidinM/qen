import { describe, expect, it } from 'vitest';
import {
  date,
  getHolidays,
  getHolidaysInRange,
  InvalidDateError,
  nextHoliday,
} from '../src/index.js';

const ids = (hs: readonly { id: string }[]) => hs.map((h) => h.id);

describe('getHolidays(gregorianYear, options)', () => {
  it('lists public holidays by default, sorted by date', () => {
    expect(ids(getHolidays(2026))).toEqual([
      'genna',
      'timket',
      'adwa',
      'siklet',
      'fasika',
      'labour-day',
      'patriots-victory',
      'derg-downfall',
      'enkutatash',
      'meskel',
    ]);
  });

  it('filters by category: a holiday matches if any of its categories is requested', () => {
    const orthodox = ids(getHolidays(2026, { categories: ['orthodox'] }));
    expect(orthodox).toHaveLength(14);
    expect(orthodox).toContain('meskel');
    expect(orthodox).not.toContain('adwa');
    expect(ids(getHolidays(2026, { categories: ['other'] }))).toEqual([]);
    expect(getHolidays(2026, { categories: ['public', 'orthodox'] })).toHaveLength(18);
  });

  it('rejects invalid years and categories', () => {
    expect(() => getHolidays(0)).toThrow(RangeError);
    expect(() => getHolidays(2026.5)).toThrow('Year must be an integer of at least 1, got 2026.5');
    // @ts-expect-error: not a category
    expect(() => getHolidays(2026, { categories: ['national'] })).toThrow(
      'Unknown holiday category "national"',
    );
  });
});

describe('getHolidaysInRange(start, end, options)', () => {
  it('includes both ends and crosses the Gregorian new year', () => {
    const hs = getHolidaysInRange(date('gregorian', 2025, 12, 25), date('gregorian', 2026, 1, 19));
    expect(ids(hs)).toEqual(['genna', 'timket']);
    expect(hs[1]?.gregorian).toEqual(date('gregorian', 2026, 1, 19));
  });

  it('takes dates in any calendar and crosses the Ethiopian new year', () => {
    const hs = getHolidaysInRange(date('ethiopian', 2018, 13, 1), date('ethiopian', 2019, 1, 17));
    expect(ids(hs)).toEqual(['enkutatash', 'meskel']);
    expect(hs[0]?.date).toEqual(date('ethiopian', 2019, 1, 1));
  });

  it('spans several years', () => {
    expect(
      getHolidaysInRange(date('gregorian', 2024, 1, 1), date('gregorian', 2026, 12, 31)),
    ).toHaveLength(30);
  });

  it('returns nothing for a range without holidays, and one day works', () => {
    expect(
      getHolidaysInRange(date('gregorian', 2026, 6, 1), date('gregorian', 2026, 6, 30)),
    ).toEqual([]);
    expect(
      ids(getHolidaysInRange(date('gregorian', 2026, 9, 27), date('gregorian', 2026, 9, 27))),
    ).toEqual(['meskel']);
  });

  it('rejects an end before the start and invalid dates', () => {
    expect(() =>
      getHolidaysInRange(date('gregorian', 2026, 2, 1), date('gregorian', 2026, 1, 1)),
    ).toThrow('The range ends before it starts');
    expect(() =>
      getHolidaysInRange(
        { calendar: 'ethiopian', year: 2018, month: 13, day: 6 },
        date('gregorian', 2026, 1, 1),
      ),
    ).toThrow(InvalidDateError);
  });
});

describe('nextHoliday(from, options)', () => {
  it('finds the next holiday on or after the date', () => {
    expect(nextHoliday(date('gregorian', 2026, 9, 12))?.id).toBe('meskel');
    expect(nextHoliday(date('gregorian', 2026, 9, 27))?.id).toBe('meskel'); // the same day counts
    expect(nextHoliday(date('gregorian', 2026, 9, 28))?.gregorian).toEqual(
      date('gregorian', 2027, 1, 7),
    );
    expect(nextHoliday(date('ethiopian', 2019, 1, 18), { categories: ['orthodox'] })?.id).toBe(
      'genna',
    );
    expect(nextHoliday(date('gregorian', 2026, 4, 11))?.id).toBe('fasika');
  });

  it('returns undefined when nothing matches the categories', () => {
    expect(nextHoliday(date('gregorian', 2026, 1, 1), { categories: ['other'] })).toBeUndefined();
  });
});
