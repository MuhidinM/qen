import { describe, expect, it } from 'vitest';
import {
  addDays,
  convert,
  date,
  daysInMonth,
  explainHijri,
  fromJDN,
  getHolidays,
  toJDN,
  type HijriOverride,
} from '../src/index.js';

// Under Umm al-Qura, find a 29-day month in 1447 and the 30-day month that follows a 30-day one.
const lengths = Array.from({ length: 12 }, (_, i) => daysInMonth('hijri', 1447, i + 1));
const short = lengths.findIndex((n, i) => n === 29 && i < 11) + 1; // a 29-day month (not Dhu al-Hijjah)
const long = lengths.findIndex((n, i) => n === 30 && i < 11) + 1; // a 30-day month

const startOf = (y: number, m: number) => convert(date('hijri', y, m, 1), 'gregorian');
const ovr = (
  y: number,
  m: number,
  startsOn: { year: number; month: number; day: number },
): HijriOverride => ({
  hijriYear: y,
  hijriMonth: m,
  startsOn,
  source: 'Test announcement',
});
const later = (y: number, m: number, days: number) => {
  const g = addDays(startOf(y, m), days);
  return ovr(y, m, { year: g.year, month: g.month, day: g.day });
};

describe('official Hijri overrides (ADR-0006)', () => {
  it('moves the overridden month start and lengthens or shortens the month before it', () => {
    const settings = { hijri: { overrides: [later(1447, short + 1, 1)] } };
    expect(daysInMonth('hijri', 1447, short, settings)).toBe(30);
    expect(convert(date('hijri', 1447, short + 1, 1), 'gregorian', settings)).toEqual(
      addDays(startOf(1447, short + 1), 1),
    );
    const early = { hijri: { overrides: [later(1447, long + 1, -1)] } };
    expect(daysInMonth('hijri', 1447, long, early)).toBe(29);
    expect(() => toJDN(date('hijri', 1447, long, 30), early)).toThrow('does not exist in 1447 AH');
  });

  it('round-trips every day around the overrides (fromJDN steps between months)', () => {
    // One override starts a month a day later (fromJDN steps back a month), one a day earlier
    // (it steps forward). They sit in different years so their neighbours stay 29–30 days.
    const lengths1448 = Array.from({ length: 12 }, (_, i) => daysInMonth('hijri', 1448, i + 1));
    const long1448 = lengths1448.findIndex((n, i) => n === 30 && lengths1448[i + 1] === 29) + 1;
    const settings = {
      hijri: { overrides: [later(1447, short + 1, 1), later(1448, long1448 + 1, -1)] },
    };
    const first = toJDN(date('hijri', 1446, 12, 1));
    const last = toJDN(date('hijri', 1449, 2, 1));
    let prev = fromJDN(first - 1, 'hijri', settings);
    for (let jdn = first; jdn <= last; jdn++) {
      const h = fromJDN(jdn, 'hijri', settings);
      expect(toJDN(h, settings)).toBe(jdn);
      const step =
        h.day === prev.day + 1 ||
        (h.day === 1 && (h.month === prev.month + 1 || (h.month === 1 && prev.month === 12)));
      expect(step, `${JSON.stringify(prev)} → ${JSON.stringify(h)}`).toBe(true);
      prev = h;
    }
  });

  it('wins over the offset for its own month; other months keep the offset', () => {
    const base = startOf(1447, 10); // 1 Shawwal 1447
    const settings = {
      hijri: {
        offset: 1 as const,
        overrides: [ovr(1447, 10, { year: base.year, month: base.month, day: base.day + 1 })],
      },
    };
    expect(convert(date('hijri', 1447, 10, 1), 'gregorian', settings)).toEqual(addDays(base, 1));
    expect(convert(date('hijri', 1447, 11, 1), 'gregorian', settings)).toEqual(
      addDays(startOf(1447, 11), 1),
    );
    expect(explainHijri(addDays(base, 1), settings)).toMatchObject({
      date: date('hijri', 1447, 10, 1),
      decidedBy: 'override',
      source: 'Test announcement',
    });
    expect(explainHijri(addDays(startOf(1447, 11), 1), settings).decidedBy).toBe('offset');
  });

  it('moves the holidays in that month', () => {
    // Ramadan 1447 has 30 days under Umm al-Qura, so the announced Shawwal can only be earlier.
    const settings = { hijri: { overrides: [later(1447, 10, -1)] } };
    const eid = getHolidays(2026, settings).find((h) => h.id === 'eid-al-fitr');
    expect(eid?.gregorian).toEqual(date('gregorian', 2026, 3, 19));
  });

  it('rejects overrides that cannot be right', () => {
    const at = (o: HijriOverride) => () =>
      convert(date('gregorian', 2026, 3, 1), 'hijri', { hijri: { overrides: [o] } });
    expect(at({ ...later(1447, 10, 0), hijriMonth: 13 })).toThrow('Hijri override: month 13');
    expect(at({ ...later(1447, 10, 0), hijriYear: 0 })).toThrow('Hijri override: year 0');
    expect(at({ ...later(1447, 10, 0), startsOn: { year: 2026, month: 2, day: 30 } })).toThrow(
      'Hijri override for 10/1447',
    );
    expect(at({ ...later(1447, 10, 0), source: ' ' })).toThrow('needs a source');
    expect(at(later(1447, 10, 5))).toThrow('would give 9/1447 35 days');
    expect(() =>
      convert(date('gregorian', 2026, 3, 1), 'hijri', {
        hijri: { overrides: [later(1447, 10, 0), later(1447, 10, 1)] },
      }),
    ).toThrow('two overrides for 10/1447');
  });
});
