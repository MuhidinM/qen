import { describe, expect, it } from 'vitest';
import { addDays, bahireHasab, convert, date } from '../src/index.js';

describe('bahireHasab(ethiopianYear)', () => {
  it('computes every step for 2016 EC', () => {
    expect(bahireHasab(2016)).toEqual({
      year: 2016,
      ameteAlem: 7516,
      evangelist: 'john',
      wenber: 10,
      abekte: 20,
      metqe: 10,
      bealeMetqe: date('ethiopian', 2016, 2, 10), // Tikimt 10 (Metqe ≤ 14), a Saturday
      tewsak: 8,
      mebajaHamer: 18,
      nineveh: date('ethiopian', 2016, 6, 18), // Yekatit 18 = 26 Feb 2024
      newYearWeekday: 2, // Meskerem 1, 2016 = Tuesday 12 Sep 2023
    });
  });

  it('carries Mebaja Hamer above 30 into the next month (2017 EC: Tir 33 → Yekatit 3)', () => {
    const b = bahireHasab(2017);
    expect([b.wenber, b.metqe, b.abekte]).toEqual([11, 29, 1]);
    expect(b.bealeMetqe).toEqual(date('ethiopian', 2017, 1, 29)); // Meskerem (Metqe > 14), a Wednesday
    expect([b.tewsak, b.mebajaHamer]).toEqual([4, 33]);
    expect(b.nineveh).toEqual(date('ethiopian', 2017, 6, 3));
  });

  it('names the evangelist of the year (Amete Alem mod 4)', () => {
    expect([2015, 2016, 2017, 2018, 2019].map((y) => bahireHasab(y).evangelist)).toEqual([
      'luke',
      'john',
      'matthew',
      'mark',
      'luke',
    ]);
  });

  // PLAN.md §5: Fasika anchors. Fasika = Nineveh + 69 days (PLAN.md §3.4).
  it.each([
    [2016, [2024, 5, 5]],
    [2017, [2025, 4, 20]],
    [2018, [2026, 4, 12]],
    [2019, [2027, 5, 2]],
  ] as const)('%i EC: Nineveh + 69 days is Fasika on %j', (year, [gy, gm, gd]) => {
    const fasika = addDays(bahireHasab(year).nineveh, 69);
    expect(convert(fasika, 'gregorian')).toEqual(date('gregorian', gy, gm, gd));
  });

  it('keeps Abekte + Metqe = 30, and Nineveh in Tir or Yekatit, for 1850–2150 EC', () => {
    for (let y = 1850; y <= 2150; y++) {
      const b = bahireHasab(y);
      expect((b.abekte + b.metqe) % 30, `${y}`).toBe(0);
      expect([5, 6], `${y}`).toContain(b.nineveh.month);
      expect(b.nineveh.year).toBe(y);
    }
  });

  it('returns frozen results and rejects invalid years', () => {
    expect(Object.isFrozen(bahireHasab(2018))).toBe(true);
    expect(() => bahireHasab(0)).toThrow(RangeError);
    expect(() => bahireHasab(2018.5)).toThrow(
      'Ethiopian year must be an integer of at least 1, got 2018.5',
    );
  });
});
