import { date, InvalidDateError, type CalendarDate } from '@qen/core';
import { CALENDARS } from './locales';

type Param = string | string[] | undefined;

/** The first value of a search parameter. */
export const one = (v: Param) => (Array.isArray(v) ? v[0] : v);

const pad = (n: number, width: number) => String(n).padStart(width, '0');

/** `<base>?calendar=…&date=YYYY-MM-DD`, the date written in its own calendar. */
export function datePath(base: string, d: CalendarDate | null): string {
  if (!d) return base;
  return `${base}?calendar=${d.calendar}&date=${pad(d.year, 4)}-${pad(d.month, 2)}-${pad(d.day, 2)}`;
}

/** Reads `?calendar=…&date=YYYY-MM-DD`; a date that doesn't exist says why. */
export function fromDateLink(
  calendar: string | undefined,
  iso: string | undefined,
): { value: CalendarDate | null; error: string | null } {
  if (calendar === undefined && iso === undefined) return { value: null, error: null };
  const match = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(iso ?? '');
  const id = CALENDARS.find((c) => c.id === calendar)?.id;
  if (!match || !id) return { value: null, error: 'This link has no date we can read.' };
  try {
    return { value: date(id, Number(match[1]), Number(match[2]), Number(match[3])), error: null };
  } catch (e) {
    if (e instanceof InvalidDateError) return { value: null, error: e.message };
    throw e;
  }
}
