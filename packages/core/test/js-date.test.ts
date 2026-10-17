import { describe, expect, expectTypeOf, it } from 'vitest';
import { date, fromJSDate, toJSDate, type CalendarDate } from '../src/index.js';

const utc = (iso: string) => new Date(`${iso}Z`);

describe('fromJSDate()', () => {
  it('reads the local calendar day by default (N-004)', () => {
    // Constructed from local components, so the test holds in any runtime time zone.
    expect(fromJSDate(new Date(2026, 9, 17, 9, 30), 'gregorian')).toEqual(
      date('gregorian', 2026, 10, 17),
    );
    expect(fromJSDate(new Date(2026, 9, 17, 9, 30), 'ethiopian')).toEqual(
      date('ethiopian', 2019, 2, 7),
    );
    expect(fromJSDate(new Date(2026, 9, 17, 9, 30), 'hijri')).toEqual(date('hijri', 1448, 5, 6));
  });

  it('reads the UTC calendar day with utc: true, around midnight', () => {
    expect(fromJSDate(utc('2026-10-17T23:59:59'), 'gregorian', { utc: true })).toEqual(
      date('gregorian', 2026, 10, 17),
    );
    expect(fromJSDate(utc('2026-10-18T00:00:00'), 'gregorian', { utc: true })).toEqual(
      date('gregorian', 2026, 10, 18),
    );
  });

  it('applies the day boundaries of ADR-0012', () => {
    expect(fromJSDate(utc('2026-10-14T05:59'), 'ethiopian', { utc: true })).toEqual(
      date('ethiopian', 2019, 2, 3),
    );
    expect(
      fromJSDate(utc('2026-10-14T05:59'), 'ethiopian', { utc: true, boundary: 'midnight' }),
    ).toEqual(date('ethiopian', 2019, 2, 4));
    expect(fromJSDate(utc('2026-02-17T18:30'), 'hijri', { utc: true })).toEqual(
      date('hijri', 1447, 9, 1),
    );
  });

  it('honours the Hijri method', () => {
    expect(
      fromJSDate(utc('2026-10-17T09:00'), 'hijri', { utc: true, hijri: { method: 'tabular' } }),
    ).toEqual(date('hijri', 1448, 5, 5));
  });

  it('rejects an invalid Date', () => {
    expect(() => fromJSDate(new Date(Number.NaN), 'gregorian')).toThrow(RangeError);
    expect(() => fromJSDate(new Date(Number.NaN), 'gregorian')).toThrow('Invalid Date');
  });

  it('types the result by calendar', () => {
    expectTypeOf(fromJSDate(new Date(), 'ethiopian')).toEqualTypeOf<CalendarDate<'ethiopian'>>();
  });
});

describe('toJSDate()', () => {
  it('returns 12:00 local on the Gregorian day of the date (N-029)', () => {
    const d = toJSDate(date('ethiopian', 2019, 1, 1));
    expect([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes()]).toEqual([
      2026, 9, 11, 12, 0,
    ]);
  });

  it('returns 12:00 UTC with utc: true', () => {
    expect(toJSDate(date('hijri', 1447, 9, 1), { utc: true }).toISOString()).toBe(
      '2026-02-18T12:00:00.000Z',
    );
    expect(
      toJSDate(date('hijri', 1447, 9, 1), {
        utc: true,
        hijri: { method: 'tabular' },
      }).toISOString(),
    ).toBe('2026-02-18T12:00:00.000Z');
  });

  it('handles years before 100 without the two-digit-year trap', () => {
    expect(toJSDate(date('gregorian', 33, 4, 3), { utc: true }).toISOString()).toBe(
      '0033-04-03T12:00:00.000Z',
    );
  });

  it('round-trips with fromJSDate under every boundary rule, in local time and UTC', () => {
    for (const d of [
      date('gregorian', 2026, 10, 17),
      date('ethiopian', 2015, 13, 6),
      date('ethiopian', 2019, 1, 1),
      date('hijri', 1447, 9, 1),
    ]) {
      for (const utcOpt of [false, true]) {
        for (const boundary of ['traditional', 'midnight'] as const) {
          expect(
            fromJSDate(toJSDate(d, { utc: utcOpt }), d.calendar, { utc: utcOpt, boundary }),
          ).toEqual(d);
        }
      }
    }
  });

  it('validates its input', () => {
    expect(() => toJSDate({ calendar: 'ethiopian', year: 2018, month: 13, day: 6 })).toThrow(
      'Pagume 6 does not exist in 2018 EC',
    );
  });
});
