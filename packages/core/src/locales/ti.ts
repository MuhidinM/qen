import { defineLocale } from '../locale.js';

const ETHIOPIAN = [
  'መስከረም',
  'ጥቅምቲ',
  'ሕዳር',
  'ታሕሳስ',
  'ጥሪ',
  'ለካቲት',
  'መጋቢት',
  'ሚያዚያ',
  'ጉንበት',
  'ሰነ',
  'ሓምለ',
  'ነሓሰ',
  'ጷጉሜ',
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
 * Tigrinya (ትግርኛ). Not yet reviewed by a native speaker (N-018, #55).
 *
 * Sources: Ethiopian and Gregorian months, weekdays and the Gregorian era from Unicode CLDR
 * (ICU 77.1); CLDR names Gregorian months with the Ethiopic month names, as used in Eritrea.
 * Hijri months use the English transliteration (CLDR has no Tigrinya names). The Ethiopian
 * era label and the time periods are from general usage.
 *
 * @example
 * ```ts
 * import { ti } from '@qen/core/locales/ti';
 * ti.months.ethiopian[1]; // 'ጥቅምቲ'
 * ```
 */
export const ti = defineLocale({
  code: 'ti',
  direction: 'ltr',
  months: {
    gregorian: [
      'ጥሪ',
      'ለካቲት',
      'መጋቢት',
      'ሚያዝያ',
      'ጉንበት',
      'ሰነ',
      'ሓምለ',
      'ነሓሰ',
      'መስከረም',
      'ጥቅምቲ',
      'ሕዳር',
      'ታሕሳስ',
    ],
    ethiopian: ETHIOPIAN,
    hijri: HIJRI,
  },
  monthsShort: {
    gregorian: ['ጥሪ', 'ለካ', 'መጋ', 'ሚያ', 'ግን', 'ሰነ', 'ሓም', 'ነሓ', 'መስ', 'ጥቅ', 'ሕዳ', 'ታሕ'],
    ethiopian: ETHIOPIAN,
    hijri: HIJRI,
  },
  weekdays: ['ሰንበት', 'ሰኑይ', 'ሰሉስ', 'ረቡዕ', 'ሓሙስ', 'ዓርቢ', 'ቀዳም'],
  weekdaysShort: ['ሰን', 'ሰኑ', 'ሰሉ', 'ረቡ', 'ሓሙ', 'ዓር', 'ቀዳ'],
  eras: {
    gregorian: { short: 'ዓ/ም', long: 'ዓመተ ምሕረት' },
    ethiopian: { short: 'ዓ.ም.', long: 'ዓመተ ምሕረት (ኢትዮጵያ)' },
    hijri: { short: 'AH', long: 'AH' },
  },
  periods: { morning: 'ንግሆ', afternoon: 'ድሕሪ ቀትሪ', evening: 'ምሸት', night: 'ለይቲ' },
  // Holidays: general usage, not yet reviewed (#55).
  holidays: {
    enkutatash: 'ሓድሽ ዓመት',
    meskel: 'መስቀል',
    genna: 'ልደት',
    timket: 'ጥምቀት',
    adwa: 'ዓወት ዓድዋ',
    'labour-day': 'መዓልቲ ሰራሕተኛታት',
    'patriots-victory': 'መዓልቲ ዓወት ኣርበኛታት',
    'derg-downfall': 'ውድቀት ደርግ',
    siklet: 'ስቅለት',
    fasika: 'ፋሲካ',
    'eid-al-fitr': 'ዒድ ኣል ፈጥር',
    'eid-al-adha': 'ዒድ ኣል ኣድሓ',
    mawlid: 'መውሊድ',
    'tsome-nenewe': 'ጾመ ነነዌ',
    'abiy-tsom': 'ዓቢይ ጾም',
    'debre-zeit': 'ደብረ ዘይት',
    hosanna: 'ሆሳዕና',
    'rekebe-kahnat': 'ርክበ ካህናት',
    erget: 'ዕርገት',
    peraklitos: 'ጰራቅሊጦስ',
    'tsome-hawariyat': 'ጾመ ሓዋርያት',
    'tsome-dihnet': 'ጾመ ድሕነት',
    'islamic-new-year': 'ሓድሽ ዓመት ሂጅራ',
    ashura: 'ዓሹራ',
    'isra-miraj': 'ኢስራእን ሚዕራጅን',
    'ramadan-start': 'መጀመርታ ረመዳን',
    'laylat-al-qadr': 'ለይለት ኣል-ቀድር',
    arafah: 'መዓልቲ ዓረፋ',
  },
  observances: {
    'abiy-tsom': 'ዓቢይ ጾም',
    'tsome-hawariyat': 'ጾመ ሓዋርያት',
    'tsome-filseta': 'ጾመ ፍልሰታ',
    'tsome-nebiyat': 'ጾመ ነብያት',
    ramadan: 'ረመዳን',
  },
  reviewed: false,
});
