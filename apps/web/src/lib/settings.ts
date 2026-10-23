import type { CalendarId, HolidayCategory } from '@qen/core';

/**
 * Visitor preferences, kept in cookies so the server renders the same controls and theme the
 * visitor chose (no flash, no inline script under the nonce CSP). Shared by server and client.
 */
export const THEMES = ['system', 'light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

/** Languages for calendar content (N-032: the interface itself is English for now). */
export const DATE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ (Amharic)' },
  { code: 'om', label: 'Afaan Oromoo (Oromo)' },
  { code: 'ti', label: 'ትግርኛ (Tigrinya)' },
  { code: 'ar', label: 'العربية (Arabic)' },
] as const;
export type DateLanguage = (typeof DATE_LANGUAGES)[number]['code'];

/**
 * How Hijri dates are worked out. The default adds the month starts confirmed in Ethiopia to
 * Umm al-Qura (owner's choice, 2026-10-23).
 */
export const HIJRI_CHOICES = [
  { value: 'ethiopia', label: 'Umm al-Qura, with dates confirmed in Ethiopia' },
  { value: 'umalqura', label: 'Umm al-Qura only' },
  { value: 'tabular', label: 'Tabular (arithmetic)' },
] as const;
export type HijriChoice = (typeof HIJRI_CHOICES)[number]['value'];

export const HOLIDAY_CATEGORIES: readonly HolidayCategory[] = [
  'public',
  'orthodox',
  'islamic',
  'other',
];

export const COOKIES = {
  theme: 'qen-theme',
  language: 'qen-lang',
  geez: 'qen-geez',
  calendar: 'qen-calendar',
  holidays: 'qen-holidays',
  otherCalendars: 'qen-others',
  hijri: 'qen-hijri',
} as const;

export function parseTheme(value: string | undefined): Theme {
  return THEMES.find((t) => t === value) ?? 'system';
}

export function parseLanguage(value: string | undefined): DateLanguage {
  return DATE_LANGUAGES.find((l) => l.code === value)?.code ?? 'en';
}

/** Flags default to off unless `fallback` says otherwise. */
export function parseFlag(value: string | undefined, fallback = false): boolean {
  return value === undefined ? fallback : value === '1';
}

export function parseCalendar(value: string | undefined): CalendarId {
  return value === 'gregorian' || value === 'ethiopian' || value === 'hijri' ? value : 'ethiopian';
}

/** A comma list of categories; all of them when the cookie is missing. */
export function parseHolidays(value: string | undefined): readonly HolidayCategory[] {
  if (value === undefined) return HOLIDAY_CATEGORIES;
  const chosen = value.split(',');
  return HOLIDAY_CATEGORIES.filter((c) => chosen.includes(c));
}

export function parseHijri(value: string | undefined): HijriChoice {
  return HIJRI_CHOICES.find((c) => c.value === value)?.value ?? 'ethiopia';
}

/** Client only: remember a preference for a year. */
export function savePreference(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
