// Type tests for the public API (R-LIB-12): checked by `pnpm typecheck`, run by Vitest.
import { describe, expectTypeOf, it } from 'vitest';
import {
  addDays,
  addMonths,
  addYears,
  age,
  compare,
  convert,
  date,
  fromJDN,
  getHolidays,
  getObservances,
  nextHoliday,
  parse,
  toEthiopianTime,
  toJDN,
  type Age,
  type CalendarDate,
  type CalendarId,
  type ClockTime,
  type EthiopianTime,
  type Holiday,
  type HolidayCategory,
  type HolidayId,
  type HijriSettings,
  type Locale,
  type Observance,
} from '../src/index.js';
import { en } from '../src/locales/en.js';
import { ethiopianHijriOverrides } from '../src/overrides/ethiopia.js';

const meskel = date('ethiopian', 2019, 1, 17);

describe('public types', () => {
  it('keep the calendar in the type through conversion and arithmetic', () => {
    expectTypeOf(convert(meskel, 'gregorian')).toEqualTypeOf<CalendarDate<'gregorian'>>();
    expectTypeOf(fromJDN(2461311, 'hijri')).toEqualTypeOf<CalendarDate<'hijri'>>();
    expectTypeOf(addDays(meskel, 1)).toEqualTypeOf<CalendarDate<'ethiopian'>>();
    expectTypeOf(addMonths(meskel, 1)).toEqualTypeOf<CalendarDate<'ethiopian'>>();
    expectTypeOf(addYears(meskel, 1)).toEqualTypeOf<CalendarDate<'ethiopian'>>();
    expectTypeOf(toJDN(meskel)).toEqualTypeOf<number>();
    expectTypeOf<CalendarDate['calendar']>().toEqualTypeOf<CalendarId>();
  });

  it('reject wrong calendars and readonly writes (type-checked only, never called)', () => {
    const checks = [
      // @ts-expect-error: not a calendar
      () => convert(meskel, 'julian'),
      // @ts-expect-error: dates are readonly
      () => (meskel.day = 18),
      // @ts-expect-error: not a category
      () => getHolidays(2026, { categories: ['national'] }),
    ];
    expectTypeOf(checks).toBeArray();
  });

  it('type parse, compare and age', () => {
    expectTypeOf(parse('17 Meskerem 2019', { locales: [en] })).toEqualTypeOf<CalendarDate>();
    expectTypeOf(compare(meskel, meskel)).toEqualTypeOf<-1 | 0 | 1>();
    expectTypeOf(age(meskel, meskel)).toEqualTypeOf<Age>();
  });

  it('type holidays and observances', () => {
    expectTypeOf(getHolidays(2026)).toEqualTypeOf<Holiday[]>();
    expectTypeOf(nextHoliday(meskel)).toEqualTypeOf<Holiday | undefined>();
    expectTypeOf(getObservances(meskel, meskel)).toEqualTypeOf<Observance[]>();
    expectTypeOf<Holiday['gregorian']>().toEqualTypeOf<CalendarDate<'gregorian'>>();
    expectTypeOf<Holiday['id']>().toEqualTypeOf<HolidayId>();
    expectTypeOf<'public'>().toExtend<HolidayCategory>();
  });

  it('type locales, Hijri settings and Ethiopian time', () => {
    expectTypeOf(en).toExtend<Locale>();
    expectTypeOf(en.holidays.meskel).toEqualTypeOf<string>();
    expectTypeOf({ overrides: ethiopianHijriOverrides }).toExtend<HijriSettings>();
    expectTypeOf(toEthiopianTime({ hour: 7, minute: 0 })).toEqualTypeOf<EthiopianTime>();
    expectTypeOf<ClockTime>().toHaveProperty('hour');
  });
});
