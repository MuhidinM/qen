import {
  convert,
  format,
  type CalendarDate,
  type HijriSettings,
  type Locale,
  type NumeralSystem,
} from '@qen/core';

/**
 * Props for {@link DateText}.
 *
 * @example
 * ```tsx
 * const props: DateTextProps = { date: date('ethiopian', 2019, 1, 17), locale: am };
 * ```
 */
export interface DateTextProps {
  /** The date to show, in any calendar. */
  readonly date: CalendarDate;
  /** Names for month, weekday and era tokens; also sets `lang` and `dir`. */
  readonly locale?: Locale;
  /** A `format()` pattern. Default: `'d MMMM y G'` with a locale, `'d/M/y'` without. */
  readonly pattern?: string;
  readonly numerals?: NumeralSystem;
  readonly hijri?: HijriSettings;
  readonly className?: string;
}

const pad = (n: number, width: number) => String(n).padStart(width, '0');

/**
 * Shows a date in any calendar as a semantic `<time>` element whose `dateTime` is the
 * Gregorian ISO date, so browsers, search engines and assistive tech get a machine-readable
 * value whatever calendar is displayed.
 *
 * @example
 * ```tsx
 * <DateText date={date('ethiopian', 2019, 1, 17)} locale={am} /> // <time dateTime="2026-09-27">17 መስከረም 2019 ዓ.ም.</time>
 * ```
 */
export function DateText({ date, locale, pattern, numerals, hijri, className }: DateTextProps) {
  const options = { ...(hijri ? { hijri } : {}) };
  const g = convert(date, 'gregorian', options);
  const text = format(date, pattern ?? (locale ? 'd MMMM y G' : 'd/M/y'), {
    ...options,
    ...(locale ? { locale } : {}),
    ...(numerals ? { numerals } : {}),
  });
  return (
    <time
      dateTime={`${pad(g.year, 4)}-${pad(g.month, 2)}-${pad(g.day, 2)}`}
      lang={locale?.code}
      dir={locale?.direction === 'rtl' ? 'rtl' : undefined}
      className={className ? `qen-date-text ${className}` : 'qen-date-text'}
    >
      {text}
    </time>
  );
}
