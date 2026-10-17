import { describe, expect, expectTypeOf, it } from 'vitest';
import {
  convert,
  date,
  fromJDN,
  InvalidDateError,
  toJDN,
  type CalendarDate,
  type CalendarId,
} from '../src/index.js';

const TABULAR = { hijri: { method: 'tabular' } } as const;

// The same day in all three calendars (Hijri: tabular). Sources: PLAN.md §5 and
// Intl ethiopic / islamic-civil, ICU 77.1.
const SAME_DAY: [gregorian: number[], ethiopian: number[], hijri: number[]][] = [
  [
    [2026, 10, 17],
    [2019, 2, 7],
    [1448, 5, 5],
  ],
  [
    [2023, 9, 12],
    [2016, 1, 1],
    [1445, 2, 26],
  ],
  [
    [2026, 9, 11],
    [2019, 1, 1],
    [1448, 3, 28],
  ],
  [
    [2000, 1, 1],
    [1992, 4, 22],
    [1420, 9, 24],
  ],
  [
    [1900, 1, 1],
    [1892, 4, 23],
    [1317, 8, 28],
  ],
  [
    [2100, 12, 31],
    [2093, 4, 21],
    [1524, 10, 29],
  ],
];

const CALENDARS: CalendarId[] = ['gregorian', 'ethiopian', 'hijri'];

describe('convert()', () => {
  it.each(SAME_DAY)('converts %j in all six directions', (...row) => {
    const dates = CALENDARS.map((c, i) => {
      const [y, m, d] = row[i] as [number, number, number];
      return date(c, y, m, d);
    });
    for (const from of dates) {
      for (const to of dates) {
        expect(
          convert(from, to.calendar, TABULAR),
          `${JSON.stringify(from)} → ${to.calendar}`,
        ).toEqual(to);
      }
    }
  });

  it('returns an equal, frozen, new object when the calendar is the same', () => {
    const d = date('ethiopian', 2019, 1, 17);
    const same = convert(d, 'ethiopian');
    expect(same).toEqual(d);
    expect(Object.isFrozen(same)).toBe(true);
  });

  it('types the result by target calendar', () => {
    expectTypeOf(convert(date('ethiopian', 2019, 1, 1), 'gregorian')).toEqualTypeOf<
      CalendarDate<'gregorian'>
    >();
  });

  it('validates its input', () => {
    const pagume6 = { calendar: 'ethiopian', year: 2018, month: 13, day: 6 } as const;
    expect(() => convert(pagume6, 'gregorian')).toThrow('Pagume 6 does not exist in 2018 EC');
    expect(() => convert(date('hijri', 1446, 12, 30), 'gregorian', TABULAR)).toThrow(
      InvalidDateError,
    );
  });

  it('accepts the tabular Hijri method explicitly', () => {
    expect(
      convert(date('gregorian', 2026, 2, 18), 'hijri', { hijri: { method: 'tabular' } }),
    ).toEqual(date('hijri', 1447, 9, 1));
  });
});

describe('toJDN() / fromJDN()', () => {
  it('maps dates to Julian Day Numbers and back', () => {
    expect(toJDN(date('gregorian', 2000, 1, 1))).toBe(2_451_545);
    expect(toJDN(date('ethiopian', 1, 1, 1))).toBe(1_724_221);
    expect(toJDN(date('hijri', 1, 1, 1))).toBe(1_948_440); // before the table: tabular
    expect(fromJDN(2_451_545, 'ethiopian')).toEqual(date('ethiopian', 1992, 4, 22));
    expect(Object.isFrozen(fromJDN(2_451_545, 'gregorian'))).toBe(true);
    expectTypeOf(fromJDN(1_948_440, 'hijri')).toEqualTypeOf<CalendarDate<'hijri'>>();
  });

  it('rejects non-integer Julian Day Numbers', () => {
    expect(() => fromJDN(2_451_545.5, 'gregorian')).toThrow(RangeError);
    expect(() => fromJDN(Number.NaN, 'gregorian')).toThrow(
      'Julian Day Number must be an integer, got NaN',
    );
  });

  it('rejects days before year 1 of the target calendar (N-002)', () => {
    expect(fromJDN(1_724_221, 'ethiopian')).toEqual(date('ethiopian', 1, 1, 1));
    expect(() => fromJDN(1_724_220, 'ethiopian')).toThrow(
      'JDN 1724220 is before year 1 of the Ethiopian calendar',
    );
    expect(() => fromJDN(1_948_439, 'hijri')).toThrow(RangeError);
    expect(() => fromJDN(1_721_425, 'gregorian')).toThrow(RangeError);
    expect(() => convert(date('gregorian', 600, 1, 1), 'hijri')).toThrow(RangeError);
  });

  it('rejects an unknown calendar', () => {
    // @ts-expect-error: not a CalendarId
    expect(() => fromJDN(2_451_545, 'julian')).toThrow('Unknown calendar "julian"');
  });
});
