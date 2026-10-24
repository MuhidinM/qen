import { getHolidays, type Holiday, type HolidayCategory, type HolidayId } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { hijriSettings } from './hijri';

/** Years with a page per holiday (spec note N-031). */
export const FIRST_YEAR = 2020;
export const LAST_YEAR = 2040;
export const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i);

/**
 * Holiday pages always use the site's default Hijri dates, not the visitor's setting, so a
 * page's URL always means the same dates (for links and search engines).
 */
export const PAGE_HIJRI = hijriSettings('ethiopia');

const ALL: readonly HolidayCategory[] = ['public', 'orthodox', 'islamic', 'other'];

/** Every holiday id @qen/core knows (the English locale names them all). */
export const HOLIDAY_IDS = Object.keys(en.holidays) as HolidayId[];

/** A year in range from a URL segment, or null. */
export function pageYear(segment: string): number | null {
  if (!/^\d{4}$/.test(segment)) return null;
  const year = Number(segment);
  return year >= FIRST_YEAR && year <= LAST_YEAR ? year : null;
}

export function holidayId(segment: string): HolidayId | null {
  return HOLIDAY_IDS.find((id) => id === segment) ?? null;
}

/** Every holiday in a Gregorian year, in date order. */
export function holidaysIn(year: number): Holiday[] {
  return getHolidays(year, { hijri: PAGE_HIJRI, categories: ALL });
}

/** The holiday's dates in a Gregorian year: usually one, two for some Islamic holidays. */
export function occurrences(id: HolidayId, year: number): Holiday[] {
  return holidaysIn(year).filter((h) => h.id === id);
}

export const CATEGORY_TEXT: Readonly<Record<HolidayCategory, string>> = {
  public: 'Public holiday in Ethiopia',
  orthodox: 'Ethiopian Orthodox',
  islamic: 'Islamic',
  other: 'Observance',
};

export const pad = (n: number, width: number) => String(n).padStart(width, '0');
