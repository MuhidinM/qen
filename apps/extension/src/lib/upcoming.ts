import {
  addDays,
  convert,
  diff,
  getHolidaysInRange,
  type CalendarDate,
  type HijriSettings,
  type Holiday,
  type HolidayCategory,
} from '@qen/core';

export interface Upcoming {
  holiday: Holiday;
  /** Days from today: 0 is today. */
  days: number;
}

/**
 * The next holidays from `today` (in any calendar), soonest first. Looks a year ahead, which
 * covers every holiday at least once.
 */
export function upcomingHolidays(
  today: CalendarDate,
  options: { count: number; hijri: HijriSettings; categories?: readonly HolidayCategory[] },
): Upcoming[] {
  const start = convert(today, 'gregorian', { hijri: options.hijri });
  return getHolidaysInRange(start, addDays(start, 366), {
    hijri: options.hijri,
    ...(options.categories ? { categories: options.categories } : {}),
  })
    .slice(0, options.count)
    .map((holiday) => ({
      holiday,
      days: diff(start, holiday.gregorian, 'days', { hijri: options.hijri }),
    }));
}
