import {
  AmbiguousDateError,
  convert,
  format,
  parse,
  type CalendarDate,
  type Locale,
} from '@qen/core';
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { CalendarGrid, type CalendarGridLabels, type CalendarGridProps } from './CalendarGrid.js';

/**
 * UI strings for {@link DatePicker}, English by default, plus the grid's.
 *
 * @example
 * ```ts
 * const labels: DatePickerLabels = { openCalendar: 'Choose date' };
 * ```
 */
export interface DatePickerLabels extends CalendarGridLabels {
  /** The button that opens the calendar. */
  readonly openCalendar?: string;
  /** Heads the choices shown when typed text fits more than one calendar. */
  readonly candidates?: string;
}

/**
 * Props for {@link DatePicker}. Grid props (week start, numerals, holidays…) pass through.
 *
 * @example
 * ```tsx
 * const props: DatePickerProps = { label: 'Start date', calendar: 'ethiopian', locale: en };
 * ```
 */
export interface DatePickerProps extends Omit<
  CalendarGridProps,
  'value' | 'defaultValue' | 'onChange' | 'month' | 'defaultMonth' | 'onMonthChange' | 'labels'
> {
  /** Visible label; also names the dialog. */
  readonly label: string;
  /** The chosen day, always in `calendar` (controlled). */
  readonly value?: CalendarDate | null;
  /** The initial day (uncontrolled). */
  readonly defaultValue?: CalendarDate;
  /** Called with the new day, or `null` when the text is cleared. */
  readonly onChange?: (value: CalendarDate | null) => void;
  /** Locales whose month names typed text may use. Default: `[locale]`. */
  readonly locales?: readonly Locale[];
  readonly labels?: DatePickerLabels;
}

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), [tabindex="0"]';

/**
 * A date field: type or paste a date in any calendar (read with `parse()`, never guessed),
 * or pick one from a {@link CalendarGrid} in a modal dialog (focus trapped, Escape closes).
 *
 * @example
 * ```tsx
 * <DatePicker label="Start date" calendar="ethiopian" locale={am} onChange={(d) => console.log(d)} />
 * ```
 */
export function DatePicker(props: DatePickerProps) {
  const { label, value: valueProp, defaultValue, onChange, locales, labels, ...gridProps } = props;
  const { calendar, locale, hijri } = gridProps;
  const options = hijri ? { hijri } : {};

  const [ownValue, setOwnValue] = useState<CalendarDate | null>(defaultValue ?? null);
  const value = valueProp !== undefined ? valueProp : ownValue;
  // Text being edited; null shows the value formatted.
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<readonly CalendarDate[]>([]);
  const [open, setOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const inputId = useId();
  const errorId = useId();

  const show = (d: CalendarDate) => format(d, 'd MMMM y', { ...options, locale });
  const choose = (d: CalendarDate | null) => {
    const next = d && convert(d, calendar, options);
    setDraft(null);
    setError(null);
    setCandidates([]);
    setOwnValue(next);
    onChange?.(next);
  };

  const commit = () => {
    if (draft === null) return;
    const text = draft.trim();
    if (text === '') return choose(null);
    try {
      choose(parse(text, { ...options, locales: locales ?? [locale] }));
    } catch (e) {
      if (e instanceof AmbiguousDateError) setCandidates(e.candidates);
      else setError(e instanceof Error ? e.message : String(e));
    }
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) openerRef.current?.focus();
  };

  // On open, slide the dialog back into the viewport if it sticks out (it is anchored to the
  // field's start edge, which in right-to-left layouts can push it off the left side), then
  // focus the grid's one tabbable day.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const { left, right } = dialog.getBoundingClientRect();
    const viewport = document.documentElement.clientWidth;
    const shift = left < 0 ? -left : right > viewport ? Math.max(viewport - right, -left) : 0;
    if (shift !== 0) dialog.style.translate = `${shift}px 0`;
    dialog.querySelector<HTMLElement>('[role="grid"] [tabindex="0"]')?.focus();
  }, [open]);

  // A press outside closes the dialog without moving focus.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const onDialogKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close(true);
    } else if (event.key === 'Tab') {
      const items = [...(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  return (
    <div ref={rootRef} className="qen-date-picker" lang={locale.code} dir={locale.direction}>
      <label htmlFor={inputId} className="qen-date-picker__label">
        {label}
      </label>
      <div className="qen-date-picker__field">
        <input
          id={inputId}
          type="text"
          className="qen-date-picker__input"
          value={draft ?? (value ? show(value) : '')}
          aria-invalid={error !== null || undefined}
          aria-describedby={error !== null ? errorId : undefined}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
            setCandidates([]);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
        />
        <button
          ref={openerRef}
          type="button"
          className="qen-date-picker__opener"
          aria-label={labels?.openCalendar ?? 'Choose date'}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <rect x="2" y="3" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" />
            <path d="M2 6.5h12M5 1.5v3M11 1.5v3" stroke="currentColor" />
          </svg>
        </button>
      </div>
      {error !== null && (
        <p id={errorId} className="qen-date-picker__error">
          {error}
        </p>
      )}
      {candidates.length > 0 && (
        <div
          role="group"
          aria-label={labels?.candidates ?? 'Which date did you mean?'}
          className="qen-date-picker__candidates"
        >
          <p className="qen-date-picker__candidates-title" aria-hidden="true">
            {labels?.candidates ?? 'Which date did you mean?'}
          </p>
          {candidates.map((c) => (
            <button
              key={c.calendar}
              type="button"
              className="qen-date-picker__candidate"
              onClick={() => choose(c)}
            >
              {format(c, 'd MMMM y G', { ...options, locale })}
            </button>
          ))}
        </div>
      )}
      {open && (
        // The dialog only routes Escape and Tab; its controls handle their own keys.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="qen-date-picker__dialog"
          onKeyDown={onDialogKeyDown}
        >
          <CalendarGrid
            {...gridProps}
            {...(labels ? { labels } : {})}
            value={value}
            onChange={(d) => {
              choose(d);
              close(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
