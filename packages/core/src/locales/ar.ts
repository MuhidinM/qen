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
  // Holidays: general usage, not yet reviewed (#55).
  holidays: {
    enkutatash: 'رأس السنة الإثيوبية',
    meskel: 'عيد الصليب',
    genna: 'عيد الميلاد الإثيوبي',
    timket: 'عيد الغطاس',
    adwa: 'يوم النصر في عدوة',
    'labour-day': 'عيد العمال',
    'patriots-victory': 'يوم انتصار الوطنيين',
    'derg-downfall': 'يوم سقوط الدرغ',
    siklet: 'الجمعة العظيمة',
    fasika: 'عيد الفصح',
    'eid-al-fitr': 'عيد الفطر',
    'eid-al-adha': 'عيد الأضحى',
    mawlid: 'المولد النبوي',
    'tsome-nenewe': 'صوم نينوى',
    'abiy-tsom': 'بداية الصوم الكبير',
    'debre-zeit': 'منتصف الصوم الكبير',
    hosanna: 'أحد الشعانين',
    'rekebe-kahnat': 'ركبي كاهنات',
    erget: 'عيد الصعود',
    peraklitos: 'عيد العنصرة',
    'tsome-hawariyat': 'بداية صوم الرسل',
    'tsome-dihnet': 'صوم الخلاص',
    'islamic-new-year': 'رأس السنة الهجرية',
    ashura: 'عاشوراء',
    'isra-miraj': 'الإسراء والمعراج',
    'ramadan-start': 'بداية رمضان',
    'laylat-al-qadr': 'ليلة القدر',
    arafah: 'يوم عرفة',
  },
  reviewed: false,
});
