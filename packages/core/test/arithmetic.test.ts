import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  addYears,
  date,
  fromJDN,
  InvalidDateError,
  toJDN,
  type CalendarId,
} from '../src/index.js';

const TAB = { hijri: { method: 'tabular' } } as const;

describe('addDays()', () => {
  it('moves through month and year ends in every calendar', () => {
    expect(addDays(date('ethiopian', 2018, 13, 5), 1)).toEqual(date('ethiopian', 2019, 1, 1));
    expect(addDays(date('ethiopian', 2015, 13, 5), 1)).toEqual(date('ethiopian', 2015, 13, 6));
    expect(addDays(date('gregorian', 2024, 2, 28), 1)).toEqual(date('gregorian', 2024, 2, 29));
    expect(addDays(date('hijri', 1447, 9, 1), 30)).toEqual(date('hijri', 1447, 10, 1)); // Ramadan 1447 has 30 days (Umm al-Qura)
  });

  it('subtracts with negative numbers (X-01)', () => {
    expect(addDays(date('ethiopian', 2019, 1, 1), -1)).toEqual(date('ethiopian', 2018, 13, 5));
    expect(addDays(date('gregorian', 2026, 1, 1), -365)).toEqual(date('gregorian', 2025, 1, 1));
  });

  it('is undone by the opposite number (property test)', () => {
    const start = toJDN(date('gregorian', 1990, 1, 1));
    for (const c of ['gregorian', 'ethiopian', 'hijri'] as CalendarId[]) {
      for (let i = 0; i < 2000; i++) {
        const d = fromJDN(start + i * 13, c);
        const n = ((i * 7919) % 2001) - 1000;
        expect(addDays(addDays(d, n), -n)).toEqual(d);
      }
    }
  });

  it('returns a frozen date in the same calendar', () => {
    const d = addDays(date('ethiopian', 2019, 1, 1), 3);
    expect(d.calendar).toBe('ethiopian');
    expect(Object.isFrozen(d)).toBe(true);
  });
});

describe('addMonths() clamps the day (N-013)', () => {
  it.each([
    [
      'Hamle 30 + 2 months → Pagume 5 in a common year',
      date('ethiopian', 2018, 11, 30),
      2,
      date('ethiopian', 2018, 13, 5),
    ],
    [
      'Hamle 30 + 2 months → Pagume 6 in a leap year',
      date('ethiopian', 2015, 11, 30),
      2,
      date('ethiopian', 2015, 13, 6),
    ],
    [
      'Nehase 15 + 2 months → Meskerem 15 next year (13 months)',
      date('ethiopian', 2018, 12, 15),
      2,
      date('ethiopian', 2019, 1, 15),
    ],
    [
      'Meskerem 10 − 1 month → Pagume 5',
      date('ethiopian', 2019, 1, 10),
      -1,
      date('ethiopian', 2018, 13, 5),
    ],
    [
      '31 Jan + 1 month → 29 Feb in a leap year',
      date('gregorian', 2024, 1, 31),
      1,
      date('gregorian', 2024, 2, 29),
    ],
    [
      '31 Jan + 1 month → 28 Feb otherwise',
      date('gregorian', 2025, 1, 31),
      1,
      date('gregorian', 2025, 2, 28),
    ],
    [
      '31 Dec + 14 months → 28 Feb two years on',
      date('gregorian', 2024, 12, 31),
      14,
      date('gregorian', 2026, 2, 28),
    ],
    [
      '15 Mar − 15 months → 15 Dec two years back',
      date('gregorian', 2026, 3, 15),
      -15,
      date('gregorian', 2024, 12, 15),
    ],
  ])('%s', (_, d, n, expected) => {
    expect(addMonths(d, n)).toEqual(expected);
  });

  it('clamps a Hijri 30th to 29 in a 29-day month, by method', () => {
    // Tabular: odd months 30 days, even months 29.
    expect(addMonths(date('hijri', 1446, 1, 30), 1, TAB)).toEqual(date('hijri', 1446, 2, 29));
    expect(addMonths(date('hijri', 1446, 11, 30), 1, TAB)).toEqual(date('hijri', 1446, 12, 29));
    expect(addMonths(date('hijri', 1447, 11, 30), 1, TAB)).toEqual(date('hijri', 1447, 12, 30));
  });
});

describe('addYears() clamps the day (N-013)', () => {
  it.each([
    [
      'Pagume 6, 2015 + 1 year → Pagume 5, 2016',
      date('ethiopian', 2015, 13, 6),
      1,
      date('ethiopian', 2016, 13, 5),
    ],
    [
      'Pagume 6, 2015 + 4 years → Pagume 6, 2019',
      date('ethiopian', 2015, 13, 6),
      4,
      date('ethiopian', 2019, 13, 6),
    ],
    [
      '29 Feb 2024 + 1 year → 28 Feb 2025',
      date('gregorian', 2024, 2, 29),
      1,
      date('gregorian', 2025, 2, 28),
    ],
    [
      '29 Feb 2024 − 4 years → 29 Feb 2020',
      date('gregorian', 2024, 2, 29),
      -4,
      date('gregorian', 2020, 2, 29),
    ],
    [
      'Meskerem 17, 2019 + 10 years',
      date('ethiopian', 2019, 1, 17),
      10,
      date('ethiopian', 2029, 1, 17),
    ],
  ])('%s', (_, d, n, expected) => {
    expect(addYears(d, n)).toEqual(expected);
  });

  it('clamps Dhu al-Hijjah 30 in a tabular leap year to 29 the next year', () => {
    expect(addYears(date('hijri', 1447, 12, 30), 1, TAB)).toEqual(date('hijri', 1448, 12, 29));
  });
});

describe('arithmetic input checks', () => {
  it('validates the date', () => {
    const bad = { calendar: 'ethiopian', year: 2018, month: 13, day: 6 } as const;
    expect(() => addDays(bad, 1)).toThrow(InvalidDateError);
    expect(() => addMonths(bad, 1)).toThrow(InvalidDateError);
    expect(() => addYears(bad, 1)).toThrow(InvalidDateError);
  });

  it('rejects non-integer amounts', () => {
    expect(() => addDays(date('gregorian', 2026, 1, 1), 1.5)).toThrow(RangeError);
    expect(() => addMonths(date('gregorian', 2026, 1, 1), Number.NaN)).toThrow(
      'Amount must be an integer, got NaN',
    );
    expect(() => addYears(date('gregorian', 2026, 1, 1), Infinity)).toThrow(RangeError);
  });

  it('rejects results before year 1', () => {
    expect(() => addYears(date('ethiopian', 5, 1, 1), -5)).toThrow(RangeError);
    expect(() => addMonths(date('gregorian', 1, 6, 1), -6)).toThrow('before year 1');
    expect(() => addDays(date('gregorian', 1, 1, 1), -1)).toThrow(RangeError);
  });
});
