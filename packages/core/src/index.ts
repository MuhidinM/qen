/**
 * `@qen/core`: Gregorian, Ethiopian, and Hijri calendar engine.
 *
 * The public API is added in Phase 1 (see PLAN.md).
 *
 * @packageDocumentation
 */

/**
 * Calendars supported by `@qen/core`.
 *
 * @example
 * ```ts
 * const cal: CalendarId = 'ethiopian';
 * ```
 */
export type CalendarId = 'gregorian' | 'ethiopian' | 'hijri';
