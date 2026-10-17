import { describe, expect, it } from 'vitest';
import type { Locale } from '../src/index.js';
import { ar } from '../src/locales/ar.js';
import { om } from '../src/locales/om.js';
import { ti } from '../src/locales/ti.js';

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
  for (let t = Date.UTC(2026, 0, 1); t < Date.UTC(2028, 0, 1); t += 86_400_000) {
    const parts = num.formatToParts(new Date(t));
    const month = Number(parts.find((p) => p.type === 'month')?.value);
    if (parts.find((p) => p.type === 'day')?.value === '3' && names[month - 1] === undefined) {
      names[month - 1] =
        fmt.formatToParts(new Date(t)).find((p) => p.type === 'month')?.value ?? '';
    }
  }
  return names;
}
const cldrWeekdays = (locale: string, style: 'long' | 'short') =>
  Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: style, timeZone: 'UTC' }).format(
      new Date(Date.UTC(2026, 9, 11 + i)),
    ),
  );

describe.each<[string, Locale, 'ltr' | 'rtl']>([
  ['om', om, 'ltr'],
  ['ti', ti, 'ltr'],
  ['ar', ar, 'rtl'],
])('%s locale shape', (code, locale, direction) => {
  it('has the right code, direction and counts, with distinct non-empty names', () => {
    expect(locale.code).toBe(code);
    expect(locale.direction).toBe(direction);
    for (const [c, n] of [
      ['gregorian', 12],
      ['ethiopian', 13],
      ['hijri', 12],
    ] as const) {
      expect(locale.months[c]).toHaveLength(n);
      expect(locale.monthsShort[c]).toHaveLength(n);
      expect(new Set(locale.months[c]).size).toBe(n);
    }
    expect(locale.weekdays).toHaveLength(7);
    expect(locale.weekdaysShort).toHaveLength(7);
    const all = [
      ...Object.values(locale.months).flat(),
      ...Object.values(locale.monthsShort).flat(),
      ...locale.weekdays,
      ...locale.weekdaysShort,
      ...Object.values(locale.eras).flatMap((e) => [e.short, e.long]),
      ...Object.values(locale.periods),
    ];
    expect(all.every((s) => s.trim().length > 0)).toBe(true);
    expect(Object.isFrozen(locale.months)).toBe(true);
  });

  it('is marked reviewed (owner confirmed, #55)', () => {
    expect(locale.reviewed).toBe(true);
  });
});

describe('Afaan Oromo (om)', () => {
  it('matches CLDR for Gregorian months and weekdays', () => {
    expect(om.months.gregorian).toEqual(cldrMonths('om', 'gregory', 'long'));
    expect(om.weekdays).toEqual(cldrWeekdays('om', 'long'));
    expect(om.weekdaysShort).toEqual(cldrWeekdays('om', 'short'));
  });

  it('names each Ethiopian month like the Gregorian month it mostly overlaps (N-030)', () => {
    // Meskerem starts on 11/12 September, so Ethiopian month i ↔ Gregorian month (i + 8) mod 12.
    for (let i = 1; i <= 12; i++) {
      expect(om.months.ethiopian[i - 1], `Ethiopian month ${i}`).toBe(
        om.months.gregorian[(i + 7) % 12],
      );
    }
    expect(om.months.ethiopian[12]).toBe('Qaam’ee');
  });
});

describe('Tigrinya (ti)', () => {
  it('matches CLDR for Ethiopian and Gregorian months and weekdays', () => {
    expect(ti.months.ethiopian).toEqual(cldrMonths('ti', 'ethiopic', 'long'));
    expect(ti.months.gregorian).toEqual(cldrMonths('ti', 'gregory', 'long'));
    expect(ti.monthsShort.gregorian).toEqual(cldrMonths('ti', 'gregory', 'short'));
    expect(ti.weekdays).toEqual(cldrWeekdays('ti', 'long'));
    expect(ti.weekdaysShort).toEqual(cldrWeekdays('ti', 'short'));
  });
});

describe('Arabic (ar)', () => {
  it('matches CLDR for all three calendars and weekdays', () => {
    expect(ar.months.gregorian).toEqual(cldrMonths('ar', 'gregory', 'long'));
    expect(ar.months.ethiopian).toEqual(cldrMonths('ar', 'ethiopic', 'long'));
    expect(ar.months.hijri).toEqual(cldrMonths('ar', 'islamic-umalqura', 'long'));
    expect(ar.weekdays).toEqual(cldrWeekdays('ar', 'long'));
  });
});
