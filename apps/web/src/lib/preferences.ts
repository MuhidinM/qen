import { cookies } from 'next/headers';
import {
  COOKIES,
  parseCalendar,
  parseFlag,
  parseHijri,
  parseHolidays,
  parseLanguage,
} from './settings';

/** Server only: every date preference from the visitor's cookies, with defaults. */
export async function readPreferences() {
  const jar = await cookies();
  const get = (name: string) => jar.get(name)?.value;
  return {
    language: parseLanguage(get(COOKIES.language)),
    geez: parseFlag(get(COOKIES.geez)),
    calendar: parseCalendar(get(COOKIES.calendar)),
    holidays: parseHolidays(get(COOKIES.holidays)),
    otherCalendars: parseFlag(get(COOKIES.otherCalendars), true),
    hijri: parseHijri(get(COOKIES.hijri)),
  };
}

export type Preferences = Awaited<ReturnType<typeof readPreferences>>;
