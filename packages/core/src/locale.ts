import type { EthiopianTimePeriod } from './ethiopian-time.js';
import type { CalendarId } from './types.js';

/**
 * Names used to format and parse dates in one language. Import a locale from its own entry
 * point (for example `@qen/core/locales/am`) so apps only ship the languages they use.
 *
 * Numerals are not part of a locale: `format()` takes a separate `numerals` option.
 *
 * @example
 * ```ts
 * import { am } from '@qen/core/locales/am';
 * am.months.ethiopian[0]; // 'መስከረም'
 * ```
 */
export interface Locale {
  /** BCP 47 language code (N-024). */
  readonly code: string;
  readonly direction: 'ltr' | 'rtl';
  /** Month names per calendar, index 0 = month 1. */
  readonly months: Readonly<Record<CalendarId, readonly string[]>>;
  readonly monthsShort: Readonly<Record<CalendarId, readonly string[]>>;
  /** Weekday names, index 0 = Sunday. */
  readonly weekdays: readonly string[];
  readonly weekdaysShort: readonly string[];
  /** Era labels per calendar, e.g. "EC" / "ዓ.ም.". */
  readonly eras: Readonly<Record<CalendarId, { readonly short: string; readonly long: string }>>;
  /** Names of the Ethiopian time periods. */
  readonly periods: Readonly<Record<EthiopianTimePeriod, string>>;
  /** False until a native speaker has reviewed the names (N-018, T-068). */
  readonly reviewed: boolean;
}

/** Deep-freezes a locale so shared data can't be changed by accident. */
export function defineLocale(locale: Locale): Locale {
  const freeze = (value: unknown): void => {
    if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
      Object.freeze(value);
      for (const v of Object.values(value)) freeze(v);
    }
  };
  freeze(locale);
  return locale;
}
