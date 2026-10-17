import type { Calendar } from './calendar.js';

/** Amete Mihret leap rule: Pagume has 6 days when `year % 4 === 3`. */
export function isEthiopianLeapYear(year: number): boolean {
  return year % 4 === 3;
}

/** JDN of Meskerem 1, 1 EC (Amete Mihret epoch). */
const EPOCH = 1_724_221;

/** Julian Day Number of an Ethiopian date (PLAN.md §3.1 formula). Expects a valid date. */
export function ethiopianToJDN(year: number, month: number, day: number): number {
  return EPOCH + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

/** Ethiopian date of a Julian Day Number (inverse of {@link ethiopianToJDN}). */
export function ethiopianFromJDN(jdn: number): { year: number; month: number; day: number } {
  // 1461-day cycles of four years, the third of which has Pagume 6.
  const year = Math.floor((4 * (jdn - EPOCH) + 1463) / 1461);
  const dayOfYear = jdn - ethiopianToJDN(year, 1, 1);
  return { year, month: Math.floor(dayOfYear / 30) + 1, day: (dayOfYear % 30) + 1 };
}

export const ethiopian: Calendar = {
  id: 'ethiopian',
  name: 'Ethiopian',
  yearSuffix: ' EC',
  // PLAN.md §5, Latin transliteration.
  monthNames: [
    'Meskerem',
    'Tikimt',
    'Hidar',
    'Tahsas',
    'Tir',
    'Yekatit',
    'Megabit',
    'Miyazia',
    'Ginbot',
    'Sene',
    'Hamle',
    'Nehase',
    'Pagume',
  ],
  monthsInYear: () => 13,
  maxDay: (year, month) => (month < 13 ? 30 : isEthiopianLeapYear(year) ? 6 : 5),
};
