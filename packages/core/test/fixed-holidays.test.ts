import { describe, expect, it } from 'vitest';
import { date } from '../src/index.js';
import { fixedHolidays } from '../src/holidays/fixed.js';

const on = (year: number, id: string) => fixedHolidays(year).find((h) => h.id === id);
const greg = (year: number, id: string) => {
  const h = on(year, id);
  return h ? `${h.gregorian.month}-${h.gregorian.day}` : undefined;
};

describe('fixed-date holidays (N-016, N-017; Wikipedia "Public holidays in Ethiopia")', () => {
  it('Enkutatash is Meskerem 1: 11 September, or 12 after an Ethiopian leap year', () => {
    expect([2023, 2024, 2025, 2026, 2027].map((y) => greg(y, 'enkutatash'))).toEqual([
      '9-12',
      '9-11',
      '9-11',
      '9-11',
      '9-12',
    ]);
    expect(on(2026, 'enkutatash')?.date).toEqual(date('ethiopian', 2019, 1, 1));
  });

  it('Meskel is Meskerem 17: 27 September, or 28', () => {
    expect([2023, 2024, 2025, 2026, 2027].map((y) => greg(y, 'meskel'))).toEqual([
      '9-28',
      '9-27',
      '9-27',
      '9-27',
      '9-28',
    ]);
    expect(on(2026, 'meskel')?.date).toEqual(date('ethiopian', 2019, 1, 17));
  });

  it('Genna is always 7 January: Tahsas 29, or Tahsas 28 in years that start on 12 September', () => {
    for (const y of [2024, 2025, 2026, 2027, 2028]) expect(greg(y, 'genna')).toBe('1-7');
    expect(on(2024, 'genna')?.date).toEqual(date('ethiopian', 2016, 4, 28));
    expect(on(2025, 'genna')?.date).toEqual(date('ethiopian', 2017, 4, 29));
    expect(on(2028, 'genna')?.date).toEqual(date('ethiopian', 2020, 4, 28));
  });

  it('Timket is Tir 11: 19 January, or 20 in Gregorian leap years', () => {
    expect([2024, 2025, 2026, 2027, 2028].map((y) => greg(y, 'timket'))).toEqual([
      '1-20',
      '1-19',
      '1-19',
      '1-19',
      '1-20',
    ]);
    expect(on(2027, 'timket')?.date).toEqual(date('ethiopian', 2019, 5, 11));
  });

  it('Adwa (Yekatit 23), Patriots (Miyazia 27), Derg (Ginbot 20) and Labour Day keep their Gregorian days', () => {
    for (let y = 1900; y <= 2099; y++) {
      expect(greg(y, 'adwa'), `${y}`).toBe('3-2');
      expect(greg(y, 'patriots-victory'), `${y}`).toBe('5-5');
      expect(greg(y, 'derg-downfall'), `${y}`).toBe('5-28');
      expect(greg(y, 'labour-day'), `${y}`).toBe('5-1');
    }
    expect(on(2026, 'adwa')?.date).toEqual(date('ethiopian', 2018, 6, 23));
    expect(on(2026, 'labour-day')?.date).toEqual(date('gregorian', 2026, 5, 1));
  });

  it('gives each holiday its categories, calendar and rule', () => {
    expect(on(2026, 'meskel')).toMatchObject({
      categories: ['public', 'orthodox'],
      calendar: 'ethiopian',
      rule: 'fixed',
    });
    expect(on(2026, 'genna')).toMatchObject({
      categories: ['public', 'orthodox'],
      calendar: 'ethiopian',
      rule: 'fixed',
    });
    expect(on(2026, 'adwa')).toMatchObject({ categories: ['public'], calendar: 'ethiopian' });
    expect(on(2026, 'labour-day')).toMatchObject({ categories: ['public'], calendar: 'gregorian' });
  });

  it('lists each of the 8 fixed holidays exactly once per Gregorian year, sorted by date', () => {
    for (let y = 1900; y <= 2099; y++) {
      const hs = fixedHolidays(y);
      expect(hs.map((h) => h.id).sort(), `${y}`).toEqual([
        'adwa',
        'derg-downfall',
        'enkutatash',
        'genna',
        'labour-day',
        'meskel',
        'patriots-victory',
        'timket',
      ]);
      expect(hs.every((h) => h.gregorian.year === y)).toBe(true);
      const days = hs.map((h) => h.gregorian.month * 100 + h.gregorian.day);
      expect(days).toEqual([...days].sort((a, b) => a - b));
    }
  });

  it('returns frozen holidays', () => {
    const h = on(2026, 'meskel');
    expect(Object.isFrozen(h)).toBe(true);
    expect(Object.isFrozen(h?.categories)).toBe(true);
  });
});
