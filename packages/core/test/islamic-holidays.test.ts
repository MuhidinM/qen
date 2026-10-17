import { describe, expect, it } from 'vitest';
import { convert, date, getHolidays, type HolidayId } from '../src/index.js';
import { islamicHolidays } from '../src/holidays/islamic.js';

const RULES: [HolidayId, number, number][] = [
  ['islamic-new-year', 1, 1],
  ['ashura', 1, 10],
  ['mawlid', 3, 12],
  ['isra-miraj', 7, 27],
  ['ramadan-start', 9, 1],
  ['laylat-al-qadr', 9, 27],
  ['eid-al-fitr', 10, 1],
  ['arafah', 12, 9],
  ['eid-al-adha', 12, 10],
];

const g = (y: number, id: HolidayId) =>
  islamicHolidays(y)
    .filter((h) => h.id === id)
    .map((h) => h.gregorian);

describe('Islamic holidays and observances (PLAN.md §3.4)', () => {
  it('gives the 2026 dates under Umm al-Qura (Intl islamic-umalqura, ICU 77.1)', () => {
    expect(g(2026, 'isra-miraj')).toEqual([date('gregorian', 2026, 1, 16)]);
    expect(g(2026, 'ramadan-start')).toEqual([date('gregorian', 2026, 2, 18)]);
    expect(g(2026, 'laylat-al-qadr')).toEqual([date('gregorian', 2026, 3, 16)]);
    expect(g(2026, 'eid-al-fitr')).toEqual([date('gregorian', 2026, 3, 20)]);
    expect(g(2026, 'arafah')).toEqual([date('gregorian', 2026, 5, 26)]);
    expect(g(2026, 'eid-al-adha')).toEqual([date('gregorian', 2026, 5, 27)]);
    expect(g(2026, 'islamic-new-year')).toEqual([date('gregorian', 2026, 6, 16)]);
    expect(g(2026, 'ashura')).toEqual([date('gregorian', 2026, 6, 25)]);
    expect(g(2026, 'mawlid')).toEqual([date('gregorian', 2026, 8, 25)]);
  });

  it('lists a holiday twice when it falls twice in one Gregorian year (Eid al-Fitr 2000)', () => {
    expect(g(2000, 'eid-al-fitr')).toEqual([
      date('gregorian', 2000, 1, 8),
      date('gregorian', 2000, 12, 27),
    ]);
  });

  it('places every occurrence on its Hijri date, 1–2 times a year, 1900–2100', () => {
    const bad: string[] = [];
    for (let y = 1900; y <= 2100; y++) {
      const hs = islamicHolidays(y);
      for (const [id, month, day] of RULES) {
        const found = hs.filter((h) => h.id === id);
        if (found.length < 1 || found.length > 2) bad.push(`${y} ${id} ×${found.length}`);
        for (const h of found) {
          if (h.date.month !== month || h.date.day !== day)
            bad.push(`${y} ${id} ${JSON.stringify(h.date)}`);
          if (h.gregorian.year !== y) bad.push(`${y} ${id} in ${h.gregorian.year}`);
          if (JSON.stringify(convert(h.date, 'gregorian')) !== JSON.stringify(h.gregorian))
            bad.push(`${y} ${id} convert`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('follows the Hijri method', () => {
    expect(
      islamicHolidays(2026, { hijri: { method: 'tabular' } }).find((h) => h.id === 'mawlid')
        ?.gregorian,
    ).toEqual(convert(date('hijri', 1448, 3, 12), 'gregorian', { hijri: { method: 'tabular' } }));
  });

  it('marks all as expected, Laylat al-Qadr approximate, and the three Eids/Mawlid public', () => {
    const hs = islamicHolidays(2026);
    expect(
      hs.every((h) => h.status === 'expected' && h.calendar === 'hijri' && h.rule === 'fixed'),
    ).toBe(true);
    expect(hs.find((h) => h.id === 'laylat-al-qadr')?.approximate).toBe(true);
    expect(hs.find((h) => h.id === 'eid-al-fitr')?.approximate).toBeUndefined();
    expect(hs.filter((h) => h.categories.includes('public')).map((h) => h.id)).toEqual([
      'eid-al-fitr',
      'eid-al-adha',
      'mawlid',
    ]);
    expect(hs.find((h) => h.id === 'ashura')?.categories).toEqual(['islamic']);
  });

  it('appears in getHolidays: 13 public holidays in 2026', () => {
    expect(getHolidays(2026).map((h) => h.id)).toEqual([
      'genna',
      'timket',
      'adwa',
      'eid-al-fitr',
      'siklet',
      'fasika',
      'labour-day',
      'patriots-victory',
      'eid-al-adha',
      'derg-downfall',
      'mawlid',
      'enkutatash',
      'meskel',
    ]);
    expect(getHolidays(2026, { categories: ['islamic'] })).toHaveLength(9);
  });
});
