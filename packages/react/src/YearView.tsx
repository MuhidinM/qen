import {
  convert,
  date,
  dayOfWeek,
  daysInMonth,
  format,
  getHolidaysInRange,
  monthsInYear,
  toJDN,
  today as todayIn,
  type CalendarDate,
  type CalendarId,
  type HijriSettings,
  type HolidayCategory,
  type Locale,
  type NumeralSystem,
} from '@qen/core';
import { useId } from 'react';
import type { VisibleMonth } from './CalendarGrid.js';

/**
 * Props for {@link YearView}.
 *
 * @example
 * ```tsx
 * const props: YearViewProps = { calendar: 'ethiopian', locale: en, year: 2019 };
 * ```
 */
export interface YearViewProps {
  readonly calendar: CalendarId;
  readonly locale: Locale;
  readonly year: number;
  /** Called with the month whose button was pressed, e.g. to open it in a {@link CalendarGrid}. */
  readonly onSelectMonth?: (month: VisibleMonth) => void;
  /** Holiday categories to mark and count. Default: none. */
  readonly holidays?: readonly HolidayCategory[];
  /** 0 = Sunday (default), 1 = Monday. */
  readonly weekStartsOn?: 0 | 1;
  readonly numerals?: NumeralSystem;
  readonly hijri?: HijriSettings;
  /** Today, to mark the current month and day. Default: `today(calendar)`. */
  readonly today?: CalendarDate;
  /** UI strings, English by default. */
  readonly labels?: { readonly holidayCount?: (count: number) => string };
}

const holidayCount = (n: number) => (n === 1 ? '1 holiday' : `${n} holidays`);

/**
 * A year at a glance: one button per month (13 for Ethiopian, 12 otherwise) showing a small
 * month, named like "Meskerem 2019, 2 holidays". The small months are decoration for sighted
 * users; the button names carry the information.
 *
 * @example
 * ```tsx
 * <YearView calendar="ethiopian" locale={am} year={2019} onSelectMonth={setMonth} />
 * ```
 */
export function YearView(props: YearViewProps) {
  const { calendar, locale, year, weekStartsOn = 0, numerals, hijri, holidays = [] } = props;
  const options = hijri ? { hijri } : {};
  const formatOptions = { ...options, locale, ...(numerals ? { numerals } : {}) };
  const today = props.today ?? todayIn(calendar, options);
  const count = monthsInYear(calendar, year);
  const titleId = useId();

  // Holidays of the whole year, grouped by month and by day.
  const perMonth = new Map<number, Set<string>>();
  const holidayDays = new Set<number>();
  if (holidays.length > 0) {
    const first = date(calendar, year, 1, 1);
    const last = date(calendar, year, count, daysInMonth(calendar, year, count, options));
    for (const h of getHolidaysInRange(first, last, { ...options, categories: holidays })) {
      const local = convert(h.gregorian, calendar, options);
      perMonth.set(local.month, (perMonth.get(local.month) ?? new Set()).add(h.id));
      holidayDays.add(toJDN(h.gregorian));
    }
  }
  const todayJDN = toJDN(today, options);

  return (
    <section
      aria-labelledby={titleId}
      className="qen-year"
      lang={locale.code}
      dir={locale.direction}
    >
      <h2 id={titleId} className="qen-year__title">
        {format(date(calendar, year, 1, 1), 'y', formatOptions)}
      </h2>
      <ul className="qen-year__months">
        {Array.from({ length: count }, (_, i) => {
          const month = i + 1;
          const first = date(calendar, year, month, 1);
          const length = daysInMonth(calendar, year, month, options);
          const leading = (dayOfWeek(first, options) - weekStartsOn + 7) % 7;
          const n = perMonth.get(month)?.size ?? 0;
          const name = format(first, 'MMMM y', formatOptions);
          const firstJDN = toJDN(first, options);
          const current = todayJDN >= firstJDN && todayJDN < firstJDN + length;
          return (
            <li key={month}>
              <button
                type="button"
                className="qen-year__month"
                aria-label={
                  n > 0 ? `${name}, ${(props.labels?.holidayCount ?? holidayCount)(n)}` : name
                }
                aria-current={current ? 'date' : undefined}
                onClick={() => props.onSelectMonth?.({ year, month })}
              >
                <span className="qen-year__month-name" aria-hidden="true">
                  {format(first, 'MMMM', formatOptions)}
                </span>
                <span className="qen-year__days" aria-hidden="true">
                  {Array.from({ length: leading }, (_, k) => (
                    <span key={`e${k}`} />
                  ))}
                  {Array.from({ length }, (_, d) => {
                    const jdn = firstJDN + d;
                    return (
                      <span
                        key={d}
                        className="qen-year__day"
                        data-holiday={holidayDays.has(jdn) || undefined}
                        data-today={jdn === todayJDN || undefined}
                      >
                        {format(date(calendar, year, month, d + 1), 'd', formatOptions)}
                      </span>
                    );
                  })}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
