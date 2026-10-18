import { convert, type CalendarDate, type ConvertOptions, type HolidayCategory } from '@qen/core';

/** Display order of holiday categories; a holiday in several shows the first. */
export const CATEGORY_ORDER: readonly HolidayCategory[] = [
  'public',
  'orthodox',
  'islamic',
  'other',
];

/** English category names; components take overrides through their `labels`. */
export const CATEGORY_NAMES: Readonly<Record<HolidayCategory, string>> = {
  public: 'Public',
  orthodox: 'Orthodox',
  islamic: 'Islamic',
  other: 'Other',
};

const pad = (n: number, width: number) => String(n).padStart(width, '0');

/** The Gregorian ISO date (YYYY-MM-DD) of a day in any calendar, for `<time dateTime>`. */
export function isoDate(d: CalendarDate, options: ConvertOptions = {}): string {
  const g = convert(d, 'gregorian', options);
  return `${pad(g.year, 4)}-${pad(g.month, 2)}-${pad(g.day, 2)}`;
}
