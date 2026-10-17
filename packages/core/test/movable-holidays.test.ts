import { describe, expect, it } from 'vitest';
import {
  addDays,
  bahireHasab,
  date,
  dayOfWeek,
  getHolidays,
  toJDN,
  type HolidayId,
} from '../src/index.js';
import { movableHolidays } from '../src/holidays/movable.js';

// PLAN.md §3.4 offsets from Nineveh, with the weekday each must fall on and the distance
// from Fasika in the Christian liturgical year.
const RULES: [HolidayId, number, number, number][] = [
  // id, offset from Nineveh, weekday (0 = Sunday), days from Fasika
  ['tsome-nenewe', 0, 1, -69],
  ['abiy-tsom', 14, 1, -55], // Great Lent: 55 days
  ['debre-zeit', 41, 0, -28], // mid-Lent Sunday
  ['hosanna', 62, 0, -7], // Palm Sunday
  ['siklet', 67, 5, -2], // Good Friday
  ['fasika', 69, 0, 0],
  ['rekebe-kahnat', 93, 3, 24],
  ['erget', 108, 4, 39], // Ascension: Thursday, 40th day
  ['peraklitos', 118, 0, 49], // Pentecost: 50th day
  ['tsome-hawariyat', 119, 1, 50], // Apostles' fast starts the day after Pentecost
  ['tsome-dihnet', 121, 3, 52],
];

describe('Orthodox movable feasts and fasts (PLAN.md §3.4)', () => {
  it('falls on the right weekday and distance from Fasika, every year 1900–2100', () => {
    const bad: string[] = [];
    for (let y = 1900; y <= 2100; y++) {
      const hs = movableHolidays(y);
      const fasika = hs.find((h) => h.id === 'fasika');
      for (const [id, offset, weekday, fromFasika] of RULES) {
        const h = hs.find((x) => x.id === id);
        if (!h || !fasika) {
          bad.push(`${y} ${id} missing`);
          continue;
        }
        const nineveh = bahireHasab(y - 8).nineveh;
        if (toJDN(h.date) !== toJDN(addDays(nineveh, offset))) bad.push(`${y} ${id} offset`);
        if (dayOfWeek(h.date) !== weekday) bad.push(`${y} ${id} weekday ${dayOfWeek(h.date)}`);
        if (toJDN(h.date) - toJDN(fasika.date) !== fromFasika) bad.push(`${y} ${id} from Fasika`);
        if (h.gregorian.year !== y) bad.push(`${y} ${id} lands in ${h.gregorian.year}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('gives the 2026 dates', () => {
    const g = (id: HolidayId) => movableHolidays(2026).find((h) => h.id === id)?.gregorian;
    expect(g('tsome-nenewe')).toEqual(date('gregorian', 2026, 2, 2));
    expect(g('abiy-tsom')).toEqual(date('gregorian', 2026, 2, 16));
    expect(g('hosanna')).toEqual(date('gregorian', 2026, 4, 5));
    expect(g('siklet')).toEqual(date('gregorian', 2026, 4, 10));
    expect(g('fasika')).toEqual(date('gregorian', 2026, 4, 12));
    expect(g('erget')).toEqual(date('gregorian', 2026, 5, 21));
    expect(g('peraklitos')).toEqual(date('gregorian', 2026, 5, 31));
  });

  it('marks Siklet and Fasika public, the rest Orthodox only, all computed Ethiopian dates', () => {
    const hs = movableHolidays(2026);
    expect(hs.find((h) => h.id === 'fasika')).toMatchObject({
      categories: ['public', 'orthodox'],
      calendar: 'ethiopian',
      rule: 'computed',
      date: date('ethiopian', 2018, 8, 4),
    });
    expect(hs.find((h) => h.id === 'siklet')?.categories).toEqual(['public', 'orthodox']);
    expect(hs.find((h) => h.id === 'hosanna')?.categories).toEqual(['orthodox']);
  });

  it('appears in getHolidays: public by default, all with the Orthodox filter', () => {
    const publicIds = getHolidays(2026).map((h) => h.id);
    expect(publicIds).toContain('siklet');
    expect(publicIds).toContain('fasika');
    expect(publicIds).not.toContain('hosanna');
    expect(getHolidays(2026, { categories: ['orthodox'] })).toHaveLength(14);
  });
});
