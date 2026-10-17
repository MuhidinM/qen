import { addDays } from '../arithmetic.js';
import { convert } from '../convert.js';
import { bahireHasab } from './bahire-hasab.js';
import type { Holiday, HolidayCategory, HolidayId } from './types.js';

const ORTHODOX: readonly HolidayCategory[] = ['orthodox'];
const PUBLIC_ORTHODOX: readonly HolidayCategory[] = ['public', 'orthodox'];

/**
 * Days from the Fast of Nineveh (PLAN.md §3.4). Fasika is verified against Julian Easter
 * (#36); the others are checked against their fixed weekdays and liturgical distance from
 * Fasika (#35).
 */
const OFFSETS: readonly (readonly [HolidayId, number, readonly HolidayCategory[]])[] = [
  ['tsome-nenewe', 0, ORTHODOX],
  ['abiy-tsom', 14, ORTHODOX],
  ['debre-zeit', 41, ORTHODOX],
  ['hosanna', 62, ORTHODOX],
  ['siklet', 67, PUBLIC_ORTHODOX],
  ['fasika', 69, PUBLIC_ORTHODOX],
  ['rekebe-kahnat', 93, ORTHODOX],
  ['erget', 108, ORTHODOX],
  ['peraklitos', 118, ORTHODOX],
  ['tsome-hawariyat', 119, ORTHODOX],
  ['tsome-dihnet', 121, ORTHODOX],
];

/**
 * The Orthodox movable feasts and fast starts of a Gregorian year, sorted by date. They all
 * fall between late January and July, inside Ethiopian year `gregorianYear − 8`. Internal:
 * the public API is `getHolidays` and friends.
 */
export function movableHolidays(gregorianYear: number): Holiday[] {
  const ethiopianYear = gregorianYear - 8;
  if (ethiopianYear < 1) return [];
  const nineveh = bahireHasab(ethiopianYear).nineveh;
  return OFFSETS.map(([id, offset, categories]) => {
    const own = addDays(nineveh, offset);
    return Object.freeze({
      id,
      categories: Object.freeze([...categories]),
      calendar: 'ethiopian' as const,
      rule: 'computed' as const,
      date: own,
      gregorian: convert(own, 'gregorian'),
    });
  });
}
