import {
  addDays,
  addMonths,
  addYears,
  convert,
  date,
  dayOfWeek,
  daysInMonth,
  format,
  getHolidaysInRange,
  toJDN,
  today as todayIn,
  type CalendarDate,
  type CalendarId,
  type Holiday,
  type HolidayCategory,
  type HijriSettings,
  type Locale,
  type NumeralSystem,
} from '@qen/core';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { CATEGORY_NAMES, CATEGORY_ORDER } from './shared.js';

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
  /**
   * Marks a range as selected instead of `value` (used by {@link DateRangePicker}); the grid
   * becomes multi-selectable. `end` is null while only the start is chosen; null selects nothing.
   */
  readonly selectedRange?: {
    readonly start: CalendarDate;
    readonly end: CalendarDate | null;
  } | null;
  /** Other calendars whose day numbers appear in each cell, in this order. */
  readonly secondary?: readonly CalendarId[];
  /**
   * Holiday categories offered in the legend, all shown at first; the legend's checkboxes
   * filter them. Default: none, and no legend.
   */
  readonly holidays?: readonly HolidayCategory[];
  /**
   * Show the legend with its filter checkboxes. Default: `true`. Set `false` when the app
   * filters `holidays` itself (for example, one filter shared by several views).
   */
  readonly legend?: boolean;
  /** UI strings, English by default; locales don't carry UI strings yet. */
  readonly labels?: CalendarGridLabels;
}

/**
 * UI strings for {@link CalendarGrid}. Holiday, month and weekday names come from the locale.
 *
 * @example
 * ```ts
 * const labels: CalendarGridLabels = { holidays: 'Holidays', expected: 'expected' };
 * ```
 */
export interface CalendarGridLabels {
  readonly previousMonth?: string;
  readonly nextMonth?: string;
  /** The legend's heading. */
  readonly holidays?: string;
  readonly categories?: Readonly<Partial<Record<HolidayCategory, string>>>;
  /** Added to the name of an Islamic holiday whose month start is not yet confirmed. */
  readonly expected?: string;
  /** Added to the name of a holiday whose date is traditional, not exact. */
  readonly approximate?: string;
  /** Explains the outline marker in the legend. */
  readonly expectedLegend?: string;
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
 * <CalendarGrid calendar="ethiopian" locale={am} numerals="geez" onChange={(d) => console.log(d)} />
 * ```
 */
export function CalendarGrid(props: CalendarGridProps) {
  const { calendar, locale, weekStartsOn = 0, numerals, hijri, isDateDisabled, labels } = props;
  const { secondary = [], holidays: offered = [], legend = true } = props;
  const options = hijri ? { hijri } : {};
  const formatOptions = { ...options, locale, ...(numerals ? { numerals } : {}) };
  const today = props.today ?? todayIn(calendar, options);

  const [ownValue, setOwnValue] = useState<CalendarDate | null>(props.defaultValue ?? null);
  const value = props.value !== undefined ? props.value : ownValue;
  const start = props.selectedRange?.start ?? value ?? today;
  const [ownMonth, setOwnMonth] = useState<VisibleMonth>(
    props.defaultMonth ?? { year: start.year, month: start.month },
  );
  const month = props.month ?? ownMonth;
  const [focusDate, setFocusDate] = useState<CalendarDate | null>(null);
  const shouldFocus = useRef(false);
  const gridRef = useRef<HTMLTableElement>(null);
  const titleId = useId();
  const [filtered, setShown] = useState<readonly HolidayCategory[]>(offered);
  // Without a legend the app filters, so follow `holidays` as it changes.
  const shown = legend ? filtered : offered;

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
  const last = date(calendar, month.year, month.month, length);

  const byDay = new Map<number, Holiday[]>();
  if (shown.length > 0) {
    for (const h of getHolidaysInRange(first, last, { ...options, categories: shown })) {
      const day = toJDN(h.gregorian);
      byDay.set(day, [...(byDay.get(day) ?? []), h]);
    }
  }
  const holidayName = (h: Holiday) => {
    const notes = [
      h.status === 'expected' ? (labels?.expected ?? 'expected') : null,
      h.approximate ? (labels?.approximate ?? 'approximate') : null,
    ].filter(Boolean);
    const name = locale.holidays[h.id];
    return notes.length > 0 ? `${name} (${notes.join(', ')})` : name;
  };
  // A holiday in several categories shows the first one that is switched on.
  const markerCategory = (h: Holiday) =>
    CATEGORY_ORDER.find((c) => h.categories.includes(c) && shown.includes(c)) ?? 'other';

  // Under the title: the span of each other calendar, e.g. "September – October 2026".
  const spans = secondary.map((other) => {
    const a = convert(first, other, options);
    const b = convert(last, other, options);
    if (a.year !== b.year) {
      return `${format(a, 'MMMM y', formatOptions)} – ${format(b, 'MMMM y', formatOptions)}`;
    }
    if (a.month !== b.month) {
      return `${format(a, 'MMMM', formatOptions)} – ${format(b, 'MMMM y', formatOptions)}`;
    }
    return format(a, 'MMMM y', formatOptions);
  });

  // The one tabbable day: the focused day, else the selection, else today, else the 1st.
  const multi = props.selectedRange !== undefined;
  const range = props.selectedRange ?? null;
  const rangeFrom = range ? toJDN(range.start, options) : 0;
  const rangeTo = range ? toJDN(range.end ?? range.start, options) : 0;
  const isSelected = (d: CalendarDate) => {
    if (!multi) return key(d) === key(value);
    if (!range) return false;
    const day = toJDN(d, options);
    return day >= rangeFrom && day <= rangeTo;
  };
  const anchor = multi ? (range?.end ?? range?.start) : value;
  const tabbable = [focusDate, anchor, today].find((d) => inMonth(d, month)) ?? first;

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

  // Extra lines under each day number: one per other calendar, one for holiday markers.
  const extraLines = secondary.length + (offered.length > 0 ? 1 : 0);
  const className = [
    'qen-calendar',
    ...(extraLines > 0 ? ['qen-calendar--rich'] : []),
    ...(extraLines > 1 ? ['qen-calendar--tall'] : []),
  ].join(' ');

  return (
    <div className={className} lang={locale.code} dir={locale.direction}>
      <div className="qen-calendar__header">
        <button
          type="button"
          className="qen-calendar__nav"
          aria-label={labels?.previousMonth ?? 'Previous month'}
          onClick={() => stepMonth(-1)}
        >
          <span aria-hidden="true">{locale.direction === 'rtl' ? '›' : '‹'}</span>
        </button>
        <div className="qen-calendar__heading">
          <h2 id={titleId} className="qen-calendar__title" aria-live="polite">
            {format(first, 'MMMM y', formatOptions)}
          </h2>
          {spans.map((span, i) => (
            <p key={i} className="qen-calendar__span">
              {span}
            </p>
          ))}
        </div>
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
        aria-multiselectable={multi || undefined}
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
                const selected = isSelected(d);
                const others = secondary.map((c) => convert(d, c, options));
                const dayHolidays = byDay.get(toJDN(d, options)) ?? [];
                const names = dayHolidays.map(holidayName);
                const label = [
                  format(d, 'EEEE, d MMMM y', formatOptions),
                  ...others.map((o) => format(o, 'd MMMM y', formatOptions)),
                  ...names,
                ].join(', ');
                return (
                  <td
                    key={i}
                    role="gridcell"
                    tabIndex={key(d) === key(tabbable) ? 0 : -1}
                    aria-label={label}
                    title={names.length > 0 ? names.join(', ') : undefined}
                    aria-selected={selected}
                    aria-current={key(d) === key(today) ? 'date' : undefined}
                    aria-disabled={disabled || undefined}
                    className="qen-calendar__day"
                    data-range-edge={
                      range && (key(d) === key(range.start) || key(d) === key(range.end))
                        ? true
                        : undefined
                    }
                    onClick={() => select(d)}
                    onFocus={() => setFocusDate(d)}
                  >
                    <span className="qen-calendar__number">{format(d, 'd', formatOptions)}</span>
                    {others.map((o) => (
                      <span key={o.calendar} className="qen-calendar__secondary">
                        {format(o, 'd', formatOptions)}
                      </span>
                    ))}
                    {dayHolidays.length > 0 && (
                      <span className="qen-calendar__markers" aria-hidden="true">
                        {dayHolidays.map((h) => (
                          <span
                            key={h.id}
                            className="qen-calendar__marker"
                            data-category={markerCategory(h)}
                            data-expected={h.status === 'expected' || h.approximate === true}
                          />
                        ))}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {legend && offered.length > 0 && (
        <fieldset className="qen-calendar__legend">
          <legend className="qen-calendar__legend-title">{labels?.holidays ?? 'Holidays'}</legend>
          {offered.map((c) => (
            <label key={c} className="qen-calendar__filter">
              <input
                type="checkbox"
                checked={shown.includes(c)}
                onChange={(e) =>
                  setShown(
                    e.target.checked
                      ? CATEGORY_ORDER.filter((x) => x === c || shown.includes(x))
                      : shown.filter((x) => x !== c),
                  )
                }
              />
              <span className="qen-calendar__marker" data-category={c} aria-hidden="true" />
              {labels?.categories?.[c] ?? CATEGORY_NAMES[c]}
            </label>
          ))}
          {offered.includes('islamic') && (
            <span className="qen-calendar__filter">
              <span
                className="qen-calendar__marker"
                data-category="islamic"
                data-expected="true"
                aria-hidden="true"
              />
              {labels?.expectedLegend ?? 'Outline: date not yet confirmed'}
            </span>
          )}
        </fieldset>
      )}
    </div>
  );
}
