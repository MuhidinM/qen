import { format, toJDN, type CalendarDate } from '@qen/core';
import { useId, useState } from 'react';
import { CalendarGrid, type CalendarGridLabels, type CalendarGridProps } from './CalendarGrid.js';

/**
 * A range of days, both ends included, `start` never after `end`.
 *
 * @example
 * ```ts
 * const r: DateRange = { start: date('ethiopian', 2019, 1, 13), end: date('ethiopian', 2019, 1, 17) };
 * ```
 */
export interface DateRange {
  readonly start: CalendarDate;
  readonly end: CalendarDate;
}

/**
 * UI strings for {@link DateRangePicker}, English by default, plus the grid's.
 *
 * @example
 * ```ts
 * const labels: DateRangePickerLabels = { chooseStart: 'Choose the first day' };
 * ```
 */
export interface DateRangePickerLabels extends CalendarGridLabels {
  /** Shown before anything is chosen. */
  readonly chooseStart?: string;
  /** Shown after the start, e.g. "17 Meskerem 2019 – choose the last day". */
  readonly chooseEnd?: string;
}

/**
 * Props for {@link DateRangePicker}. Grid props (week start, numerals, holidays…) pass through.
 *
 * @example
 * ```tsx
 * const props: DateRangePickerProps = { label: 'Trip', calendar: 'ethiopian', locale: en };
 * ```
 */
export interface DateRangePickerProps extends Omit<
  CalendarGridProps,
  'value' | 'defaultValue' | 'onChange' | 'selectedRange' | 'labels'
> {
  /** Names the group. */
  readonly label: string;
  readonly value?: DateRange | null;
  readonly defaultValue?: DateRange;
  /** Called once both ends are chosen. */
  readonly onChange?: (range: DateRange) => void;
  readonly labels?: DateRangePickerLabels;
}

/**
 * Picks a range on a {@link CalendarGrid}: the first day chosen (click, Enter or Space) is one
 * end, the second is the other, in either order; a third starts again. A live status line
 * reads back the range.
 *
 * @example
 * ```tsx
 * <DateRangePicker label="Trip" calendar="ethiopian" locale={am} onChange={(range) => console.log(range)} />
 * ```
 */
export function DateRangePicker(props: DateRangePickerProps) {
  const { label, value: valueProp, defaultValue, onChange, labels, ...gridProps } = props;
  const { locale, hijri } = gridProps;
  const options = hijri ? { hijri } : {};

  const [ownValue, setOwnValue] = useState<DateRange | null>(defaultValue ?? null);
  const value = valueProp !== undefined ? valueProp : ownValue;
  // The first end, while the second is not yet chosen.
  const [pending, setPending] = useState<CalendarDate | null>(null);
  const labelId = useId();

  const pick = (d: CalendarDate) => {
    if (!pending) return setPending(d);
    const [start, end] = toJDN(d, options) < toJDN(pending, options) ? [d, pending] : [pending, d];
    setPending(null);
    setOwnValue({ start, end });
    onChange?.({ start, end });
  };

  const show = (d: CalendarDate) => format(d, 'd MMMM y', { ...options, locale });
  const status = pending
    ? `${show(pending)} – ${labels?.chooseEnd ?? 'choose the last day'}`
    : value
      ? `${show(value.start)} – ${show(value.end)}`
      : (labels?.chooseStart ?? 'Choose the first day');

  return (
    <div role="group" aria-labelledby={labelId} className="qen-range-picker">
      <p id={labelId} className="qen-range-picker__label">
        {label}
      </p>
      <CalendarGrid
        {...gridProps}
        {...(labels ? { labels } : {})}
        selectedRange={pending ? { start: pending, end: null } : value}
        onChange={pick}
      />
      <p role="status" className="qen-range-picker__status">
        {status}
      </p>
    </div>
  );
}
