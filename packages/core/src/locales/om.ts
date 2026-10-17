import { defineLocale } from '../locale.js';

const GREGORIAN = [
  'Amajjii',
  'Guraandhala',
  'Bitootessa',
  'Eebila',
  'Caamsaa',
  'Waxabajjii',
  'Adoolessa',
  'Hagayya',
  'Fulbaana',
  'Onkoloolessa',
  'Sadaasa',
  'Mudde',
];
// Each Ethiopian month takes the name of the Gregorian month it mostly overlaps (N-030).
const ETHIOPIAN = [
  'Fulbaana',
  'Onkoloolessa',
  'Sadaasa',
  'Mudde',
  'Amajjii',
  'Guraandhala',
  'Bitootessa',
  'Eebila',
  'Caamsaa',
  'Waxabajjii',
  'Adoolessa',
  'Hagayya',
  'Qaam’ee',
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
 * Afaan Oromo. Not yet reviewed by a native speaker (N-018, #55).
 *
 * Sources: Gregorian months, weekdays and the Gregorian era from Unicode CLDR (ICU 77.1).
 * Ethiopian months follow CLDR's Oromo Gregorian names for the overlapping month, because
 * CLDR's own Oromo Ethiopian list is out of order (N-030); Pagume is CLDR's "Qaam’ee".
 * Hijri months use the English transliteration (CLDR has no Oromo names). The Ethiopian era
 * label (A.L.I., Akka Lakkoofsa Itoophiyaa) and the time periods are from general usage.
 *
 * @example
 * ```ts
 * import { om } from '@qen/core/locales/om';
 * om.months.ethiopian[0]; // 'Fulbaana'
 * ```
 */
export const om = defineLocale({
  code: 'om',
  direction: 'ltr',
  months: { gregorian: GREGORIAN, ethiopian: ETHIOPIAN, hijri: HIJRI },
  monthsShort: {
    gregorian: [
      'Ama',
      'Gur',
      'Bitootessa',
      'Elb',
      'Cam',
      'Wax',
      'Ado',
      'Hag',
      'Ful',
      'Onk',
      'Sadaasa',
      'Mud',
    ],
    ethiopian: ETHIOPIAN,
    hijri: HIJRI,
  },
  weekdays: ['Dilbata', 'Wiixata', 'Kibxata', 'Roobii', 'Kamisa', 'Jimaata', 'Sanbata'],
  weekdaysShort: ['Dil', 'Wix', 'Kib', 'Rob', 'Kam', 'Jim', 'San'],
  eras: {
    gregorian: { short: 'BA', long: 'Bara Araaraa' },
    ethiopian: { short: 'A.L.I.', long: 'Akka Lakkoofsa Itoophiyaa' },
    hijri: { short: 'AH', long: 'AH' },
  },
  periods: { morning: 'ganama', afternoon: 'waaree booda', evening: 'galgala', night: 'halkan' },
  // Holidays: Christian and Islamic names from Wikipedia, "Public holidays in Ethiopia";
  // the national days are best guesses (review #55).
  holidays: {
    enkutatash: 'Bara Haaraa',
    meskel: 'Masqalaa',
    genna: 'Ayaana Qillee',
    timket: 'Ayaana Cuuphaa',
    adwa: "Ayyaana Mo'icha Adwaa",
    'labour-day': 'Guyyaa Hojjettootaa Addunyaa',
    'patriots-victory': 'Guyyaa Injifannoo Gootota',
    'derg-downfall': 'Kufaatii Dergii',
    siklet: 'Ayyaana Faannoo',
    fasika: 'Ayyaana Faasiikaa',
    'eid-al-fitr': 'Iid al-Fitrii',
    'eid-al-adha': 'Iid al-Adhaa',
    mawlid: 'Mawliid',
    'tsome-nenewe': 'Soomii Nanawwee',
    'abiy-tsom': 'Soomii Guddaa',
    'debre-zeit': 'Dabra Zayit',
    hosanna: 'Hosaa’inaa',
    'rekebe-kahnat': 'Rikiba Kaahinaat',
    erget: "Ayyaana Ol-ba'iinsaa",
    peraklitos: 'Phaaraaqliixoos',
    'tsome-hawariyat': 'Soomii Hawaariyaa',
    'tsome-dihnet': 'Soomii Fayyinaa',
    'islamic-new-year': 'Bara Haaraa Islaamaa',
    ashura: 'Aashuuraa',
    'isra-miraj': "Israa'i fi Mi'iraaj",
    'ramadan-start': 'Jalqaba Ramadaanaa',
    'laylat-al-qadr': 'Laylatul Qadrii',
    arafah: 'Guyyaa Arafaa',
  },
  reviewed: false,
});
