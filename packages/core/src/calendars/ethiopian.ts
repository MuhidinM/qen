import type { Calendar } from './calendar.js';

/** Amete Mihret leap rule: Pagume has 6 days when `year % 4 === 3`. */
export function isEthiopianLeapYear(year: number): boolean {
  return year % 4 === 3;
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
