import { describe, expect, it } from 'vitest';
import {
  addDays,
  convert,
  date,
  daysInMonth,
  dayOfWeek,
  explainHijri,
  format,
  fromJDN,
  getHolidays,
  getObservances,
  isLeapYear,
  parse,
  toJDN,
  today,
  type HijriSettings,
} from '../src/index.js';
import { en } from '../src/locales/en.js';

const off = (offset: NonNullable<HijriSettings['offset']>) => ({ hijri: { offset } });

describe('Hijri offset (ADR-0006: method → overrides → offset)', () => {
  it('+1 means months start a day later locally, so a day shows the previous Hijri date', () => {
    // 18 Feb 2026 is 1 Ramadan 1447 under Umm al-Qura.
    const feb18 = date('gregorian', 2026, 2, 18);
    expect(convert(feb18, 'hijri', off(1))).toEqual(
      convert(date('gregorian', 2026, 2, 17), 'hijri'),
    );
    expect(convert(date('gregorian', 2026, 2, 19), 'hijri', off(1))).toEqual(
      date('hijri', 1447, 9, 1),
    );
    expect(convert(date('hijri', 1447, 9, 1), 'gregorian', off(1))).toEqual(
      date('gregorian', 2026, 2, 19),
    );
    expect(convert(date('hijri', 1447, 9, 1), 'gregorian', off(-1))).toEqual(
      date('gregorian', 2026, 2, 17),
    );
  });

  it('shifts every day by exactly the offset, for every offset and 3,000 days', () => {
    const start = toJDN(date('gregorian', 2024, 1, 1));
    for (const k of [-2, -1, 0, 1, 2] as const) {
      for (let jdn = start; jdn < start + 3000; jdn++) {
        const h = fromJDN(jdn, 'hijri', off(k));
        expect(h).toEqual(fromJDN(jdn - k, 'hijri'));
        expect(toJDN(h, off(k))).toBe(jdn);
      }
    }
  });

  it('leaves month lengths and leap years unchanged', () => {
    for (let m = 1; m <= 12; m++)
      expect(daysInMonth('hijri', 1447, m, off(2))).toBe(daysInMonth('hijri', 1447, m));
    expect(isLeapYear('hijri', 1447, off(-2))).toBe(isLeapYear('hijri', 1447));
  });

  it('is applied by format, parse, today, dayOfWeek, holidays and observances', () => {
    const ramadan1 = date('hijri', 1447, 9, 1);
    expect(dayOfWeek(ramadan1, off(1))).toBe((dayOfWeek(ramadan1) + 1) % 7);
    expect(format(ramadan1, 'EEEE', { locale: en, ...off(1) })).toBe('Thursday');
    expect(toJDN(parse('1 Ramadan 1447', { locales: [en], ...off(1) }), off(1))).toBe(
      toJDN(ramadan1) + 1,
    );
    expect(today('hijri', { now: new Date('2026-02-18T09:00:00Z'), utc: true, ...off(1) })).toEqual(
      convert(date('gregorian', 2026, 2, 17), 'hijri'),
    );
    const eid = (o = {}) =>
      getHolidays(2026, { ...o }).find((h) => h.id === 'eid-al-fitr')?.gregorian;
    expect(eid(off(1))).toEqual(convert(addDays(date('gregorian', 2026, 3, 20), 1), 'gregorian'));
    const ramadan = (o = {}) =>
      getObservances(date('gregorian', 2026, 1, 1), date('gregorian', 2026, 12, 31), {
        categories: ['islamic'],
        ...o,
      })[0];
    expect(ramadan(off(-1))?.startGregorian).toEqual(date('gregorian', 2026, 2, 17));
  });

  it('is reported by explainHijri', () => {
    expect(explainHijri(date('gregorian', 2026, 2, 19), off(1))).toEqual({
      date: date('hijri', 1447, 9, 1),
      method: 'umalqura',
      fallback: false,
      decidedBy: 'offset',
    });
    expect(explainHijri(date('gregorian', 2026, 2, 18)).decidedBy).toBe('method');
  });

  it('rejects offsets outside −2…+2 and non-integers', () => {
    const bad = (o: number) => ({ hijri: { offset: o as NonNullable<HijriSettings['offset']> } });
    expect(() => convert(date('gregorian', 2026, 1, 1), 'hijri', bad(3))).toThrow(
      'Hijri offset must be -2, -1, 0, 1 or 2, got 3',
    );
    expect(() => toJDN(date('hijri', 1447, 1, 1), bad(0.5))).toThrow(RangeError);
  });
});
