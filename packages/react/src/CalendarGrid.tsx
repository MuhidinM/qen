import {
  addDays,
  addMonths,
  addYears,
  date,
  dayOfWeek,
  daysInMonth,
  format,
  today as todayIn,
  type CalendarDate,
  type CalendarId,
  type HijriSettings,
  type Locale,
  type NumeralSystem,
} from '@qen/core';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

/**
 * A month in some calendar, as shown by {@link CalendarGrid}.
 *
 * @example
 * ```ts
 * const meskerem: VisibleMonth = { year: 2019, month: 1 };
 * ```
 */
export interface VisibleMonth {
  readonly year: number;
  readonly month: number;
}

/**
 * Props for {@link CalendarGrid}.
 *
 * @example
 * ```tsx
 * const props: CalendarGridProps = { calendar: 'ethiopian', locale: am };
 * ```
 */
export interface CalendarGridProps {
  /** The calendar the grid is laid out in. */
  readonly calendar: CalendarId;
  /** Month, weekday and era names; also sets `lang` and `dir`. */
  readonly locale: Locale;
  /** The selected day (controlled). */
  readonly value?: CalendarDate | null;
  /** The initially selected day (uncontrolled). */
  readonly defaultValue?: CalendarDate;
  readonly onChange?: (value: CalendarDate) => void;
  /** The month shown (controlled). */
  readonly month?: VisibleMonth;
  /** The month shown first (uncontrolled). Default: the month of the value, else today. */
  readonly defaultMonth?: VisibleMonth;
  readonly onMonthChange?: (month: VisibleMonth) => void;
  /** 0 = Sunday (default), 1 = Monday. */
  readonly weekStartsOn?: 0 | 1;
  readonly numerals?: NumeralSystem;
  readonly hijri?: HijriSettings;
  /** Today, for the `aria-current` marker. Default: `today(calendar)`. */
  readonly today?: CalendarDate;
  readonly isDateDisabled?: (date: CalendarDate) => boolean;
  /** Button labels; locales don't carry UI strings yet. */
  readonly labels?: { readonly previousMonth?: string; readonly nextMonth?: string };
}

const key = (d: CalendarDate | null | undefined) => (d ? `${d.year}-${d.month}-${d.day}` : '');
const inMonth = (d: CalendarDate | null | undefined, m: VisibleMonth) =>
  !!d && d.year === m.year && d.month === m.month;

/**
 * A month of days in any calendar, following the WAI-ARIA date grid pattern: one tab stop,
 * arrow keys between days (reversed right to left), Home/End for the week, PageUp/PageDown
 * for the month and Shift+PageUp/PageDown for the year, Enter or Space to select.
 *
 * @example
 * ```tsx
 * <CalendarGrid calendar="ethiopian" locale={am} numerals="geez" onChange={setDate} />
 * ```
 */
export function CalendarGrid(props: CalendarGridProps) {
  const { calendar, locale, weekStartsOn = 0, numerals, hijri, isDateDisabled, labels } = props;
  const options = hijri ? { hijri } : {};
  const formatOptions = { ...options, locale, ...(numerals ? { numerals } : {}) };
  const today = props.today ?? todayIn(calendar, options);

  const [ownValue, setOwnValue] = useState<CalendarDate | null>(props.defaultValue ?? null);
  const value = props.value !== undefined ? props.value : ownValue;
  const start = value ?? today;
  const [ownMonth, setOwnMonth] = useState<VisibleMonth>(
    props.defaultMonth ?? { year: start.year, month: start.month },
  );
  const month = props.month ?? ownMonth;
  const [focusDate, setFocusDate] = useState<CalendarDate | null>(null);
  const shouldFocus = useRef(false);
  const gridRef = useRef<HTMLTableElement>(null);
  const titleId = useId();

  const showMonth = (m: VisibleMonth) => {
    setOwnMonth(m);
    props.onMonthChange?.(m);
  };
  const select = (d: CalendarDate) => {
    if (isDateDisabled?.(d)) return;
    setOwnValue(d);
    props.onChange?.(d);
  };

  const first = date(calendar, month.year, month.month, 1);
  const length = daysInMonth(calendar, month.year, month.month, options);
  const leading = (dayOfWeek(first, options) - weekStartsOn + 7) % 7;

  // The one tabbable day: the focused day, else the selection, else today, else the 1st.
  const tabbable = [focusDate, value, today].find((d) => inMonth(d, month)) ?? first;

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
  });

  const moveTo = (d: CalendarDate) => {
    shouldFocus.current = true;
    setFocusDate(d);
    if (!inMonth(d, month)) showMonth({ year: d.year, month: d.month });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const current = focusDate && inMonth(focusDate, month) ? focusDate : tabbable;
    const rtl = locale.direction === 'rtl';
    const weekday = (dayOfWeek(current, options) - weekStartsOn + 7) % 7;
    const moves: Record<string, () => CalendarDate> = {
      ArrowRight: () => addDays(current, rtl ? -1 : 1, options),
      ArrowLeft: () => addDays(current, rtl ? 1 : -1, options),
      ArrowDown: () => addDays(current, 7, options),
      ArrowUp: () => addDays(current, -7, options),
      Home: () => addDays(current, -weekday, options),
      End: () => addDays(current, 6 - weekday, options),
      PageDown: () =>
        event.shiftKey ? addYears(current, 1, options) : addMonths(current, 1, options),
      PageUp: () =>
        event.shiftKey ? addYears(current, -1, options) : addMonths(current, -1, options),
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      moveTo(move());
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(current);
    }
  };

  const stepMonth = (n: number) => {
    const target = addMonths(first, n, options);
    showMonth({ year: target.year, month: target.month });
  };

  const weekdays = Array.from({ length: 7 }, (_, i) => (i + weekStartsOn) % 7);
  const slots: (CalendarDate | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length }, (_, i) => date(calendar, month.year, month.month, i + 1)),
  ];
  while (slots.length % 7 !== 0) slots.push(null);
  const weeks = Array.from({ length: slots.length / 7 }, (_, w) => slots.slice(w * 7, w * 7 + 7));

  return (
    <div className="qen-calendar" lang={locale.code} dir={locale.direction}>
      <div className="qen-calendar__header">
        <button
          type="button"
          className="qen-calendar__nav"
          aria-label={labels?.previousMonth ?? 'Previous month'}
          onClick={() => stepMonth(-1)}
        >
          <span aria-hidden="true">{locale.direction === 'rtl' ? '›' : '‹'}</span>
        </button>
        <h2 id={titleId} className="qen-calendar__title" aria-live="polite">
          {format(first, 'MMMM y', formatOptions)}
        </h2>
        <button
          type="button"
          className="qen-calendar__nav"
          aria-label={labels?.nextMonth ?? 'Next month'}
          onClick={() => stepMonth(1)}
        >
          <span aria-hidden="true">{locale.direction === 'rtl' ? '‹' : '›'}</span>
        </button>
      </div>
      {/* The WAI-ARIA date picker pattern: a table with the grid role. */}
      <table
        ref={gridRef}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
        role="grid"
        aria-labelledby={titleId}
        className="qen-calendar__grid"
        onKeyDown={onKeyDown}
      >
        <thead>
          <tr>
            {weekdays.map((w) => (
              <th key={w} scope="col" abbr={locale.weekdays[w]} className="qen-calendar__weekday">
                {locale.weekdaysShort[w]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, w) => (
            <tr key={w}>
              {week.map((d, i) => {
                if (!d) return <td key={i} role="gridcell" className="qen-calendar__empty" />;
                const disabled = isDateDisabled?.(d) ?? false;
                const selected = key(d) === key(value);
                return (
                  <td
                    key={i}
                    role="gridcell"
                    tabIndex={key(d) === key(tabbable) ? 0 : -1}
                    aria-label={format(d, 'EEEE, d MMMM y', formatOptions)}
                    aria-selected={selected}
                    aria-current={key(d) === key(today) ? 'date' : undefined}
                    aria-disabled={disabled || undefined}
                    className="qen-calendar__day"
                    onClick={() => select(d)}
                    onFocus={() => setFocusDate(d)}
                  >
                    {format(d, 'd', formatOptions)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
