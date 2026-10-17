import { defineLocale } from '../locale.js';

const GREGORIAN = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];
const ETHIOPIAN = [
  'مسكريم',
  'تكمت',
  'هدار',
  'تهساس',
  'تر',
  'يكتت',
  'مجابيت',
  'ميازيا',
  'جنبت',
  'سين',
  'هامل',
  'نهاس',
  'باجمن',
];
const HIJRI = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];
const WEEKDAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

/**
 * Arabic (العربية), right-to-left. Not yet reviewed by a native speaker (N-018, #55).
 *
 * Sources: month names for all three calendars, weekdays and the Gregorian and Hijri era
 * abbreviations from Unicode CLDR (ICU 77.1). The Ethiopian era label, the long Hijri era
 * and the "night" period are from general usage.
 *
 * @example
 * ```ts
 * import { ar } from '@qen/core/locales/ar';
 * ar.months.hijri[8]; // 'رمضان'
 * ```
 */
export const ar = defineLocale({
  code: 'ar',
  direction: 'rtl',
  months: { gregorian: GREGORIAN, ethiopian: ETHIOPIAN, hijri: HIJRI },
  monthsShort: { gregorian: GREGORIAN, ethiopian: ETHIOPIAN, hijri: HIJRI },
  weekdays: WEEKDAYS,
  weekdaysShort: WEEKDAYS,
  eras: {
    gregorian: { short: 'م', long: 'ميلادي' },
    ethiopian: { short: 'إثيوبي', long: 'التقويم الإثيوبي' },
    hijri: { short: 'هـ', long: 'هجري' },
  },
  periods: { morning: 'صباحًا', afternoon: 'بعد الظهر', evening: 'مساءً', night: 'ليلًا' },
  reviewed: false,
});
