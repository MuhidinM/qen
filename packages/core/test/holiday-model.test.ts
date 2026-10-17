import { describe, expectTypeOf, it } from 'vitest';
import type {
  CalendarDate,
  CalendarId,
  Holiday,
  HolidayCategory,
  HolidayId,
  HolidayRule,
  HolidayStatus,
} from '../src/index.js';

describe('holiday model types (R-HOL-01)', () => {
  it('has the PLAN.md §3.4 categories, rules and statuses', () => {
    expectTypeOf<HolidayCategory>().toEqualTypeOf<'public' | 'orthodox' | 'islamic' | 'other'>();
    expectTypeOf<HolidayRule>().toEqualTypeOf<'fixed' | 'computed'>();
    expectTypeOf<HolidayStatus>().toEqualTypeOf<'expected' | 'confirmed'>();
  });

  it('names the 13 public holidays confirmed in N-017', () => {
    expectTypeOf<
      | 'enkutatash'
      | 'meskel'
      | 'genna'
      | 'timket'
      | 'adwa'
      | 'labour-day'
      | 'patriots-victory'
      | 'derg-downfall'
      | 'siklet'
      | 'fasika'
      | 'eid-al-fitr'
      | 'eid-al-adha'
      | 'mawlid'
    >().toExtend<HolidayId>();
  });

  it('describes one occurrence of a holiday', () => {
    expectTypeOf<Holiday['id']>().toEqualTypeOf<HolidayId>();
    expectTypeOf<Holiday['categories']>().toEqualTypeOf<readonly HolidayCategory[]>();
    expectTypeOf<Holiday['calendar']>().toEqualTypeOf<CalendarId>();
    expectTypeOf<Holiday['rule']>().toEqualTypeOf<HolidayRule>();
    expectTypeOf<Holiday['date']>().toEqualTypeOf<CalendarDate>();
    expectTypeOf<Holiday['gregorian']>().toEqualTypeOf<CalendarDate<'gregorian'>>();
    expectTypeOf<Holiday['status']>().toEqualTypeOf<HolidayStatus | undefined>();
    expectTypeOf<Holiday['source']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Holiday['approximate']>().toEqualTypeOf<boolean | undefined>();
  });

  it('is read-only', () => {
    expectTypeOf<Holiday>().toEqualTypeOf<Readonly<Holiday>>();
  });
});
