import { describe, expect, it } from 'vitest';
import {
  addDays,
  bahireHasab,
  date,
  dayOfWeek,
  diff,
  getObservances,
  InvalidDateError,
  toJDN,
  type ObservanceId,
} from '../src/index.js';

const year = (y: number) =>
  getObservances(date('gregorian', y, 1, 1), date('gregorian', y, 12, 31));
const find = (y: number, id: ObservanceId) => year(y).find((o) => o.id === id);
const span = (y: number, id: ObservanceId) => {
  const o = find(y, id);
  return o && [o.startGregorian, o.endGregorian];
};

describe('getObservances(start, end)', () => {
  it('gives the 2026 periods', () => {
    expect(span(2026, 'abiy-tsom')).toEqual([
      date('gregorian', 2026, 2, 16),
      date('gregorian', 2026, 4, 11),
    ]);
    expect(span(2026, 'ramadan')).toEqual([
      date('gregorian', 2026, 2, 18),
      date('gregorian', 2026, 3, 19),
    ]);
    expect(span(2026, 'tsome-hawariyat')).toEqual([
      date('gregorian', 2026, 6, 1),
      date('gregorian', 2026, 7, 11),
    ]);
    expect(span(2026, 'tsome-filseta')).toEqual([
      date('gregorian', 2026, 8, 7),
      date('gregorian', 2026, 8, 21),
    ]);
    expect(span(2026, 'tsome-nebiyat')).toEqual([
      date('gregorian', 2026, 11, 24),
      date('gregorian', 2027, 1, 6),
    ]);
  });

  it('gives each period in its own calendar', () => {
    expect(find(2026, 'tsome-filseta')).toMatchObject({
      calendar: 'ethiopian',
      start: date('ethiopian', 2018, 12, 1),
      end: date('ethiopian', 2018, 12, 15),
      categories: ['orthodox'],
    });
    expect(find(2026, 'ramadan')).toMatchObject({
      calendar: 'hijri',
      start: date('hijri', 1447, 9, 1),
      categories: ['islamic'],
      status: 'expected',
    });
  });

  it('keeps the rules for every year 1900–2100', () => {
    const bad: string[] = [];
    for (let y = 1900; y <= 2100; y++) {
      const os = year(y);
      const abiy = os.find((o) => o.id === 'abiy-tsom');
      const fasika = addDays(bahireHasab(y - 8).nineveh, 69);
      if (!abiy || diff(abiy.start, abiy.end, 'days') !== 54) bad.push(`${y} abiy length`);
      if (abiy && (dayOfWeek(abiy.start) !== 1 || toJDN(abiy.end) !== toJDN(fasika) - 1))
        bad.push(`${y} abiy bounds`);
      const filseta = os.find((o) => o.id === 'tsome-filseta');
      if (!filseta || filseta.start.day !== 1 || filseta.end.day !== 15) bad.push(`${y} filseta`);
      const nebiyat = os.find((o) => o.id === 'tsome-nebiyat' && o.startGregorian.year === y);
      if (!nebiyat || nebiyat.start.month !== 3 || nebiyat.start.day !== 15)
        bad.push(`${y} nebiyat start`);
      if (nebiyat && (nebiyat.endGregorian.month !== 1 || nebiyat.endGregorian.day !== 6))
        bad.push(`${y} nebiyat end`);
      for (const r of os.filter((o) => o.id === 'ramadan')) {
        const days = diff(r.start, r.end, 'days') + 1;
        if (r.start.day !== 1 || r.end.month !== 9 || (days !== 29 && days !== 30))
          bad.push(`${y} ramadan`);
      }
      for (const o of os) if (toJDN(o.end) < toJDN(o.start)) bad.push(`${y} ${o.id} reversed`);
    }
    expect(bad).toEqual([]);
  });

  it('returns periods that overlap the range, partly or fully, sorted by start', () => {
    const os = getObservances(date('gregorian', 2026, 3, 10), date('gregorian', 2026, 3, 10));
    expect(os.map((o) => o.id)).toEqual(['abiy-tsom', 'ramadan']);
    expect(
      getObservances(date('gregorian', 2026, 12, 31), date('gregorian', 2027, 1, 2)).map(
        (o) => o.id,
      ),
    ).toEqual(['tsome-nebiyat']);
    expect(getObservances(date('gregorian', 2026, 9, 1), date('gregorian', 2026, 9, 30))).toEqual(
      [],
    );
  });

  it('filters by category and follows the Hijri method', () => {
    const range = [date('gregorian', 2026, 1, 1), date('gregorian', 2026, 12, 31)] as const;
    expect(getObservances(...range, { categories: ['islamic'] }).map((o) => o.id)).toEqual([
      'ramadan',
    ]);
    expect(getObservances(...range, { categories: ['orthodox'] })).toHaveLength(5);
    const tabular = getObservances(...range, {
      categories: ['islamic'],
      hijri: { method: 'tabular' },
    })[0];
    expect(tabular?.start).toEqual(date('hijri', 1447, 9, 1));
  });

  it('returns frozen periods and rejects bad ranges', () => {
    expect(Object.isFrozen(find(2026, 'ramadan'))).toBe(true);
    expect(() =>
      getObservances(date('gregorian', 2026, 2, 1), date('gregorian', 2026, 1, 1)),
    ).toThrow(RangeError);
    expect(() =>
      getObservances(
        { calendar: 'ethiopian', year: 2018, month: 13, day: 6 },
        date('gregorian', 2026, 1, 1),
      ),
    ).toThrow(InvalidDateError);
  });
});
