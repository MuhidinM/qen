import type { CalendarId } from '../types.js';
import type { Calendar } from './calendar.js';
import { ethiopian } from './ethiopian.js';
import { gregorian } from './gregorian.js';
import { hijri } from './hijri.js';

const calendars: Readonly<Record<CalendarId, Calendar>> = { gregorian, ethiopian, hijri };

export function isCalendarId(value: unknown): value is CalendarId {
  return typeof value === 'string' && Object.hasOwn(calendars, value);
}

/** The calendar module for an id; callers check the id with `isCalendarId` first. */
export function calendarFor(id: CalendarId): Calendar {
  return calendars[id];
}
