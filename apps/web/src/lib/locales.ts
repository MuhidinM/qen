import type { CalendarId, Locale } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { om } from '@qen/core/locales/om';
import { ti } from '@qen/core/locales/ti';
import type { DateLanguage } from './settings';

export const LOCALES: Readonly<Record<DateLanguage, Locale>> = { en, am, om, ti, ar };

/** Every locale, so typed or pasted text may use month names in any of them. */
export const ALL_LOCALES: readonly Locale[] = [en, am, om, ti, ar];

export const CALENDARS: readonly { id: CalendarId; name: string }[] = [
  { id: 'gregorian', name: 'Gregorian' },
  { id: 'ethiopian', name: 'Ethiopian' },
  { id: 'hijri', name: 'Hijri' },
];
