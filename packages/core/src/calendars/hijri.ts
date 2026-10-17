import type { Calendar } from './calendar.js';

export const hijri: Calendar = {
  id: 'hijri',
  name: 'Hijri',
  yearSuffix: ' AH',
  // PLAN.md §5.
  monthNames: [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Ula',
    'Jumada al-Akhirah',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhu al-Qa'dah",
    'Dhu al-Hijjah',
  ],
  monthsInYear: () => 12,
  // Whether a month has 29 or 30 days depends on the method, so date() accepts 30
  // and conversion rejects a 30th the method doesn't have (N-025).
  maxDay: () => 30,
};
