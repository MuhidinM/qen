import type { CalendarId } from '../types.js';

/** What every calendar module provides. Internal: the public API wraps it. */
export interface Calendar {
  readonly id: CalendarId;
  /** Calendar name in error messages, e.g. "Ethiopian". */
  readonly name: string;
  /** Appended to the year in error messages, e.g. " EC". */
  readonly yearSuffix: string;
  /** English month names for error messages (not locale data). */
  readonly monthNames: readonly string[];
  monthsInYear(year: number): number;
  /** The largest day `date()` accepts for this month. */
  maxDay(year: number, month: number): number;
}
