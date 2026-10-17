import { defineLocale } from '../locale.js';

const ETHIOPIAN = [
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
];
const HIJRI = [
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
];

/**
 * English.
 *
 * Sources: Gregorian months, weekdays and day periods from Unicode CLDR (ICU 77.1);
 * Ethiopian and Hijri months from PLAN.md §5; era labels by project convention
 * ("EC" as in error messages).
 *
 * @example
 * ```ts
 * import { en } from '@qen/core/locales/en';
 * en.months.ethiopian[12]; // 'Pagume'
 * ```
 */
export const en = defineLocale({
  code: 'en',
  direction: 'ltr',
  months: {
    gregorian: [
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
    ethiopian: ETHIOPIAN,
    hijri: HIJRI,
  },
  monthsShort: {
    gregorian: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ethiopian: ETHIOPIAN,
    hijri: HIJRI,
  },
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  eras: {
    gregorian: { short: 'AD', long: 'Anno Domini' },
    ethiopian: { short: 'EC', long: 'Ethiopian Calendar' },
    hijri: { short: 'AH', long: 'Anno Hegirae' },
  },
  periods: {
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night',
  },
  holidays: {
    enkutatash: 'Enkutatash (Ethiopian New Year)',
    meskel: 'Meskel (Finding of the True Cross)',
    genna: 'Genna (Ethiopian Christmas)',
    timket: 'Timket (Epiphany)',
    adwa: 'Adwa Victory Day',
    'labour-day': 'International Labour Day',
    'patriots-victory': "Patriots' Victory Day",
    'derg-downfall': 'Downfall of the Derg',
    siklet: 'Siklet (Good Friday)',
    fasika: 'Fasika (Easter)',
    'eid-al-fitr': 'Eid al-Fitr',
    'eid-al-adha': 'Eid al-Adha',
    mawlid: 'Mawlid (Birth of the Prophet)',
    'tsome-nenewe': 'Tsome Nenewe (Fast of Nineveh)',
    'abiy-tsom': 'Abiy Tsom begins (Great Lent)',
    'debre-zeit': 'Debre Zeit (Mid-Lent)',
    hosanna: 'Hosanna (Palm Sunday)',
    'rekebe-kahnat': 'Rekebe Kahnat',
    erget: 'Erget (Ascension)',
    peraklitos: 'Peraklitos (Pentecost)',
    'tsome-hawariyat': "Tsome Hawariyat begins (Apostles' Fast)",
    'tsome-dihnet': 'Tsome Dihnet (Fast of Salvation)',
    'islamic-new-year': 'Islamic New Year',
    ashura: 'Ashura',
    'isra-miraj': "Isra and Mi'raj",
    'ramadan-start': 'Ramadan begins',
    'laylat-al-qadr': 'Laylat al-Qadr',
    arafah: 'Day of Arafah',
  },
  reviewed: true,
});
