import { describe, expect, it } from 'vitest';
import {
  addDays,
  bahireHasab,
  date,
  dayOfWeek,
  fromJDN,
  isWeeklyFast,
  toJDN,
} from '../src/index.js';

const g = (y: number, m: number, d: number) => date('gregorian', y, m, d);

describe('isWeeklyFast(d): Wednesday and Friday fasts (N-019)', () => {
  it('is true on ordinary Wednesdays and Fridays, false on other days', () => {
    expect(isWeeklyFast(g(2026, 10, 14))).toBe(true); // Wednesday
    expect(isWeeklyFast(g(2026, 10, 16))).toBe(true); // Friday
    expect(isWeeklyFast(g(2026, 10, 15))).toBe(false); // Thursday
    expect(isWeeklyFast(date('ethiopian', 2019, 2, 4))).toBe(true); // 14 Oct 2026, given in Ethiopian
  });

  it('is lifted from Fasika to Peraklitos (the 50 days)', () => {
    expect(isWeeklyFast(g(2026, 4, 15))).toBe(false); // Wednesday after Fasika (12 Apr)
    expect(isWeeklyFast(g(2026, 5, 29))).toBe(false); // Friday before Peraklitos (31 May)
    expect(isWeeklyFast(g(2026, 6, 3))).toBe(true); // Wednesday after: Tsome Dihnet
  });

  it('is lifted when Genna or Timket falls on a Wednesday or Friday', () => {
    expect(isWeeklyFast(g(2026, 1, 7))).toBe(false); // Genna, a Wednesday
    expect(isWeeklyFast(g(2029, 1, 19))).toBe(false); // Timket, a Friday
  });

  it('follows these rules for every day 1900–2100', () => {
    const bad: string[] = [];
    for (let jdn = toJDN(g(1900, 1, 1)); jdn <= toJDN(g(2100, 12, 31)); jdn++) {
      const d = fromJDN(jdn, 'gregorian');
      const weekday = dayOfWeek(d);
      const fasika = toJDN(addDays(bahireHasab(d.year - 8).nineveh, 69));
      const easterSeason = jdn >= fasika && jdn <= fasika + 49;
      const genna = d.month === 1 && d.day === 7;
      const timket = toJDN(date('ethiopian', d.year - 8, 5, 11)) === jdn;
      const expected = (weekday === 3 || weekday === 5) && !easterSeason && !genna && !timket;
      if (isWeeklyFast(d) !== expected) bad.push(`${d.year}-${d.month}-${d.day}`);
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it('validates the date', () => {
    expect(() => isWeeklyFast({ calendar: 'gregorian', year: 2025, month: 2, day: 29 })).toThrow();
  });
});
