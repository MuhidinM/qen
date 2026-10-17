import { describe, expect, it } from 'vitest';
import { getHolidays, type HolidayId, type Locale } from '../src/index.js';
import { am } from '../src/locales/am.js';
import { ar } from '../src/locales/ar.js';
import { en } from '../src/locales/en.js';
import { om } from '../src/locales/om.js';
import { ti } from '../src/locales/ti.js';

const ALL_IDS: HolidayId[] = [
  'enkutatash',
  'meskel',
  'genna',
  'timket',
  'adwa',
  'labour-day',
  'patriots-victory',
  'derg-downfall',
  'siklet',
  'fasika',
  'eid-al-fitr',
  'eid-al-adha',
  'mawlid',
];

describe.each<[string, Locale]>([
  ['en', en],
  ['am', am],
  ['om', om],
  ['ti', ti],
  ['ar', ar],
])('%s holiday names (R-HOL-05)', (_, locale) => {
  it('names every holiday, with distinct non-empty names', () => {
    const names = ALL_IDS.map((id) => locale.holidays[id]);
    expect(names.every((n) => typeof n === 'string' && n.trim().length > 0)).toBe(true);
    expect(new Set(names).size).toBe(ALL_IDS.length);
    expect(Object.keys(locale.holidays).sort()).toEqual([...ALL_IDS].sort());
  });

  it('names every holiday that getHolidays returns', () => {
    for (const h of getHolidays(2026, { categories: ['public', 'orthodox', 'islamic', 'other'] })) {
      expect(locale.holidays[h.id]).toBeTruthy();
    }
  });
});

describe('names taken from Wikipedia, "Public holidays in Ethiopia"', () => {
  it('Amharic', () => {
    expect(am.holidays.adwa).toBe('የዓድዋ ድል በዓል');
    expect(am.holidays['labour-day']).toBe('ዓለም አቀፍ የሠራተኞች ቀን');
    expect(am.holidays['patriots-victory']).toBe('የአርበኞች ቀን');
    expect(am.holidays.meskel).toBe('መስቀል');
  });

  it('Afaan Oromo', () => {
    expect(om.holidays.genna).toBe('Ayaana Qillee');
    expect(om.holidays.timket).toBe('Ayaana Cuuphaa');
    expect(om.holidays.fasika).toBe('Ayyaana Faasiikaa');
    expect(om.holidays.meskel).toBe('Masqalaa');
  });
});
