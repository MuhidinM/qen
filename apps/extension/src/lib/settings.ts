import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import type { CalendarId, HijriSettings, Locale } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { om } from '@qen/core/locales/om';
import { ti } from '@qen/core/locales/ti';
import { ethiopianHijriOverrides } from '@qen/core/overrides/ethiopia';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ (Amharic)' },
  { code: 'om', label: 'Afaan Oromoo (Oromo)' },
  { code: 'ti', label: 'ትግርኛ (Tigrinya)' },
  { code: 'ar', label: 'العربية (Arabic)' },
] as const;
export type Language = (typeof LANGUAGES)[number]['code'];

export const LOCALES: Readonly<Record<Language, Locale>> = { en, am, om, ti, ar };

/** The same choices and default as the website (owner, 2026-10-23). */
export const HIJRI_CHOICES = [
  { value: 'ethiopia', label: 'Umm al-Qura, with dates confirmed in Ethiopia' },
  { value: 'umalqura', label: 'Umm al-Qura only' },
  { value: 'tabular', label: 'Tabular (arithmetic)' },
] as const;
export type HijriChoice = (typeof HIJRI_CHOICES)[number]['value'];

export const CALENDARS: readonly { id: CalendarId; name: string }[] = [
  { id: 'gregorian', name: 'Gregorian' },
  { id: 'ethiopian', name: 'Ethiopian' },
  { id: 'hijri', name: 'Hijri' },
];

export interface Settings {
  /** Language for month, weekday and holiday names (the interface itself is English). */
  language: Language;
  geez: boolean;
  /** The calendar the converter starts in. */
  calendar: CalendarId;
  hijri: HijriChoice;
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  geez: false,
  calendar: 'ethiopian',
  hijri: 'ethiopia',
};

/** Stored settings are untrusted (older versions, other devices): keep only valid values. */
export function sanitize(raw: unknown): Settings {
  const r = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  return {
    language: LANGUAGES.find((l) => l.code === r.language)?.code ?? DEFAULT_SETTINGS.language,
    geez: typeof r.geez === 'boolean' ? r.geez : DEFAULT_SETTINGS.geez,
    calendar: CALENDARS.find((c) => c.id === r.calendar)?.id ?? DEFAULT_SETTINGS.calendar,
    hijri: HIJRI_CHOICES.find((c) => c.value === r.hijri)?.value ?? DEFAULT_SETTINGS.hijri,
  };
}

export function hijriSettings(choice: HijriChoice): HijriSettings {
  if (choice === 'tabular') return { method: 'tabular' };
  if (choice === 'ethiopia') return { overrides: ethiopianHijriOverrides };
  return {};
}

const KEY = 'settings';

export async function loadSettings(): Promise<Settings> {
  const stored = await browser.storage.sync.get(KEY);
  return sanitize(stored[KEY]);
}

/**
 * The settings, kept in sync with storage (so the popup, the tooltip and the overlay agree),
 * and a function to change some of them. Null until loaded.
 */
export function useSettings(): [Settings | null, (patch: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings | null>(null);
  useEffect(() => {
    let live = true;
    void loadSettings().then((s) => live && setSettings(s));
    const onChanged = (changes: Record<string, { newValue?: unknown }>, area: string) => {
      if (area === 'sync' && KEY in changes) setSettings(sanitize(changes[KEY]?.newValue));
    };
    browser.storage.onChanged.addListener(onChanged);
    return () => {
      live = false;
      browser.storage.onChanged.removeListener(onChanged);
    };
  }, []);
  const update = (patch: Partial<Settings>) => {
    if (!settings) return;
    const next = { ...settings, ...patch };
    setSettings(next);
    void browser.storage.sync.set({ [KEY]: next });
  };
  return [settings, update];
}
