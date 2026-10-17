import { describe, expect, it } from 'vitest';
import { addDays, bahireHasab, date, toJDN } from '../src/index.js';

// Independent oracle, test-only (ADR-0007): Meeus, "Astronomical Algorithms", Julian
// (Orthodox) Easter, converted from the Julian calendar to a Julian Day Number.
function julianEaster(year: number): { month: number; day: number } {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  return { month: Math.floor((d + e + 114) / 31), day: ((d + e + 114) % 31) + 1 };
}

function julianCalendarToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
}

const fasikaJDN = (gregorianYear: number) =>
  // Easter in Gregorian year Y falls in Ethiopian year Y − 8.
  toJDN(addDays(bahireHasab(gregorianYear - 8).nineveh, 69));

describe('Fasika = Orthodox Easter (Meeus Julian computus), R-HOL-08', () => {
  it('the oracle reproduces the PLAN.md §5 anchors', () => {
    const oracle = (y: number) => {
      const { month, day } = julianEaster(y);
      return julianCalendarToJDN(y, month, day);
    };
    expect(oracle(2024)).toBe(toJDN(date('gregorian', 2024, 5, 5)));
    expect(oracle(2025)).toBe(toJDN(date('gregorian', 2025, 4, 20)));
    expect(oracle(2026)).toBe(toJDN(date('gregorian', 2026, 4, 12)));
    expect(oracle(2027)).toBe(toJDN(date('gregorian', 2027, 5, 2)));
  });

  it('agrees with Bahire Hasab for every year 1900–2100', () => {
    const mismatches: number[] = [];
    for (let y = 1900; y <= 2100; y++) {
      const { month, day } = julianEaster(y);
      if (fasikaJDN(y) !== julianCalendarToJDN(y, month, day)) mismatches.push(y);
    }
    expect(mismatches).toEqual([]);
  });

  it('Fasika is always a Sunday', () => {
    for (let y = 1900; y <= 2100; y++) expect((fasikaJDN(y) + 1) % 7, `${y}`).toBe(0);
  });
});
