import { describe, expect, it } from 'vitest';
import type { Locale } from '../src/index.js';
import { am } from '../src/locales/am.js';
import { en } from '../src/locales/en.js';

/** CLDR names through Intl, as an independent check against typos. */
function cldrMonths(locale: string, calendar: string, style: 'long' | 'short'): string[] {
  const names: string[] = [];
  const fmt = new Intl.DateTimeFormat(`${locale}-u-ca-${calendar}`, {
    month: style,
    timeZone: 'UTC',
  });
  const num = new Intl.DateTimeFormat(`en-u-ca-${calendar}`, {
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  });
  for (
    let t = Date.UTC(2026, 0, 1);
    names.length < 13 && t < Date.UTC(2028, 0, 1);
    t += 86_400_000
  ) {
    const parts = num.formatToParts(new Date(t));
    const month = Number(parts.find((p) => p.type === 'month')?.value);
    if (parts.find((p) => p.type === 'day')?.value === '3' && names[month - 1] === undefined) {
      names[month - 1] =
        fmt.formatToParts(new Date(t)).find((p) => p.type === 'month')?.value ?? '';
    }
  }
  return names.filter((n) => n !== undefined);
}
const cldrWeekdays = (locale: string, style: 'long' | 'short') =>
  Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' }).format(
      new Date(Date.UTC(2026, 9, 11 + i)),
    ),
  ); // 11 Oct 2026 is a Sunday

describe.each<[string, Locale]>([
  ['en', en],
  ['am', am],
])('%s locale shape', (code, locale) => {
  it('has the right code, direction and counts', () => {
    expect(locale.code).toBe(code);
    expect(locale.direction).toBe('ltr');
    expect(locale.months.gregorian).toHaveLength(12);
    expect(locale.months.ethiopian).toHaveLength(13);
    expect(locale.months.hijri).toHaveLength(12);
    for (const c of ['gregorian', 'ethiopian', 'hijri'] as const) {
      expect(locale.monthsShort[c]).toHaveLength(locale.months[c].length);
      expect(new Set(locale.months[c]).size, `${c} months are distinct`).toBe(
        locale.months[c].length,
      );
    }
    expect(locale.weekdays).toHaveLength(7);
    expect(locale.weekdaysShort).toHaveLength(7);
  });

  it('has no empty strings', () => {
    const all = [
      ...Object.values(locale.months).flat(),
      ...Object.values(locale.monthsShort).flat(),
      ...locale.weekdays,
      ...locale.weekdaysShort,
      ...Object.values(locale.eras).flatMap((e) => [e.short, e.long]),
      ...Object.values(locale.periods),
    ];
    expect(all.every((s) => s.trim().length > 0)).toBe(true);
  });

  it('is frozen', () => {
    expect(Object.isFrozen(locale)).toBe(true);
    expect(Object.isFrozen(locale.months.ethiopian)).toBe(true);
  });
});

describe('English (en)', () => {
  it('uses the PLAN.md §5 transliteration for Ethiopian and Hijri months', () => {
    expect(en.months.ethiopian).toEqual([
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
    ]);
    expect(en.months.hijri).toEqual([
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
    ]);
  });

  it('matches CLDR for Gregorian months and weekdays', () => {
    expect(en.months.gregorian).toEqual(cldrMonths('en', 'gregory', 'long'));
    expect(en.monthsShort.gregorian).toEqual(cldrMonths('en', 'gregory', 'short'));
    expect(en.weekdays).toEqual(cldrWeekdays('en', 'long'));
    expect(en.weekdaysShort).toEqual(cldrWeekdays('en', 'short'));
  });

  it('is marked reviewed', () => {
    expect(en.reviewed).toBe(true);
  });
});

describe('Amharic (am)', () => {
  it('uses PLAN.md §5 for Ethiopian months and weekdays', () => {
    expect(am.months.ethiopian).toEqual([
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
    ]);
    expect(am.weekdays).toEqual(['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ']);
  });

  it('matches CLDR for Gregorian and Hijri months and weekdays', () => {
    expect(am.months.gregorian).toEqual(cldrMonths('am', 'gregory', 'long'));
    expect(am.monthsShort.gregorian).toEqual(cldrMonths('am', 'gregory', 'short'));
    expect(am.months.hijri).toEqual(cldrMonths('am', 'islamic-umalqura', 'long'));
    expect(am.weekdays).toEqual(cldrWeekdays('am', 'long'));
    expect(am.weekdaysShort).toEqual(cldrWeekdays('am', 'short'));
  });

  it('is marked for native-speaker review before 1.0 (N-018, #55)', () => {
    expect(am.reviewed).toBe(false);
  });
});
