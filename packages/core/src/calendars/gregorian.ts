import type { Calendar } from './calendar.js';

const MONTH_LENGTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const;

/** Proleptic Gregorian leap rule. */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export const gregorian: Calendar = {
  id: 'gregorian',
  name: 'Gregorian',
  yearSuffix: '',
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthsInYear: () => 12,
  maxDay: (year, month) =>
    month === 2 && isGregorianLeapYear(year) ? 29 : (MONTH_LENGTHS[month - 1] ?? 0),
};
