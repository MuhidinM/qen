import { defineLocale } from '../locale.js';

const ETHIOPIAN = [
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታኅሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜ',
];
const HIJRI = [
  'ሙሀረም',
  'ሳፈር',
  'ረቢዑል አወል',
  'ረቢዑል አኺር',
  'ጀማደል አወል',
  'ጀማደል አኺር',
  'ረጀብ',
  'ሻእባን',
  'ረመዳን',
  'ሸዋል',
  'ዙልቂዳህ',
  'ዙልሂጃህ',
];

/**
 * Amharic (አማርኛ). Not yet reviewed by a native speaker (N-018, #55).
 *
 * Sources: Ethiopian months and weekdays from PLAN.md §5 (which writes ጳጉሜ where CLDR has
 * ጳጉሜን); Gregorian and Hijri months, short weekdays and day periods from Unicode CLDR
 * (ICU 77.1). Era labels are from general usage (ዓ.ም. = ዓመተ ምሕረት; እ.ኤ.አ. = እንደ
 * ኤውሮጳውያን አቆጣጠር) and the Hijri label is a best guess; all need review.
 *
 * @example
 * ```ts
 * import { am } from '@qen/core/locales/am';
 * am.months.ethiopian[0]; // 'መስከረም'
 * ```
 */
export const am = defineLocale({
  code: 'am',
  direction: 'ltr',
  months: {
    gregorian: [
      'ጃንዋሪ',
      'ፌብሩዋሪ',
      'ማርች',
      'ኤፕሪል',
      'ሜይ',
      'ጁን',
      'ጁላይ',
      'ኦገስት',
      'ሴፕቴምበር',
      'ኦክቶበር',
      'ኖቬምበር',
      'ዲሴምበር',
    ],
    ethiopian: ETHIOPIAN,
    hijri: HIJRI,
  },
  monthsShort: {
    gregorian: ['ጃን', 'ፌብ', 'ማርች', 'ኤፕሪ', 'ሜይ', 'ጁን', 'ጁላይ', 'ኦገስ', 'ሴፕቴ', 'ኦክቶ', 'ኖቬም', 'ዲሴም'],
    ethiopian: ETHIOPIAN,
    hijri: HIJRI,
  },
  weekdays: ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
  weekdaysShort: ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
  eras: {
    gregorian: { short: 'እ.ኤ.አ.', long: 'እንደ ኤውሮጳውያን አቆጣጠር' },
    ethiopian: { short: 'ዓ.ም.', long: 'ዓመተ ምሕረት' },
    hijri: { short: 'ዓ.ሂ.', long: 'ዓመተ ሂጅራ' },
  },
  periods: {
    morning: 'ጥዋት',
    afternoon: 'ከሰዓት',
    evening: 'በምሽት',
    night: 'በሌሊት',
  },
  // Holidays: Adwa, Labour Day, Patriots and Meskel from Wikipedia, "Public holidays in
  // Ethiopia"; ግንቦት 20 is the common name for the Downfall of the Derg; the rest general usage.
  holidays: {
    enkutatash: 'እንቁጣጣሽ',
    meskel: 'መስቀል',
    genna: 'ገና',
    timket: 'ጥምቀት',
    adwa: 'የዓድዋ ድል በዓል',
    'labour-day': 'ዓለም አቀፍ የሠራተኞች ቀን',
    'patriots-victory': 'የአርበኞች ቀን',
    'derg-downfall': 'ግንቦት 20',
    siklet: 'ስቅለት',
    fasika: 'ፋሲካ',
    'eid-al-fitr': 'ዒድ አል ፈጥር',
    'eid-al-adha': 'ዒድ አል አድሐ',
    mawlid: 'መውሊድ',
    'tsome-nenewe': 'ጾመ ነነዌ',
    'abiy-tsom': 'ዐቢይ ጾም',
    'debre-zeit': 'ደብረ ዘይት',
    hosanna: 'ሆሣዕና',
    'rekebe-kahnat': 'ርክበ ካህናት',
    erget: 'ዕርገት',
    peraklitos: 'ጰራቅሊጦስ',
    'tsome-hawariyat': 'ጾመ ሐዋርያት',
    'tsome-dihnet': 'ጾመ ድኅነት',
  },
  reviewed: false,
});
