import {
  fromEthiopianTime,
  toEthiopianTime,
  type ClockTime,
  type EthiopianTimePeriod,
  type Locale,
} from '@qen/core';
import { useId, useState } from 'react';

/**
 * Props for {@link EthiopianTimeInput}.
 *
 * @example
 * ```tsx
 * const props: EthiopianTimeInputProps = { label: 'Meeting time', locale: am };
 * ```
 */
export interface EthiopianTimeInputProps {
  /** Names the group. */
  readonly label: string;
  /** Period names; also sets `lang` and `dir`. */
  readonly locale: Locale;
  /** The time as an international clock time (controlled). */
  readonly value?: ClockTime | null;
  readonly defaultValue?: ClockTime;
  /** Called with the international clock time whenever the fields make a valid time. */
  readonly onChange?: (time: ClockTime) => void;
  /** Field labels, English by default; locales don't carry UI strings yet. */
  readonly labels?: { readonly hour?: string; readonly minute?: string; readonly period?: string };
}

const PERIODS: readonly EthiopianTimePeriod[] = ['morning', 'afternoon', 'evening', 'night'];

interface Fields {
  readonly hour: string;
  readonly minute: string;
  readonly period: EthiopianTimePeriod;
}

function fieldsOf(time: ClockTime | null | undefined): Fields {
  if (!time) return { hour: '', minute: '', period: 'morning' };
  const t = toEthiopianTime(time);
  return { hour: String(t.hour), minute: String(t.minute), period: t.period };
}

/** The clock time the fields make, or the reason they don't make one; null when incomplete. */
function read(f: Fields): ClockTime | string | null {
  if (f.hour === '' || f.minute === '') return null;
  try {
    return fromEthiopianTime({ hour: Number(f.hour), minute: Number(f.minute), period: f.period });
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Time in the Ethiopian 12-hour day (1 o'clock is an hour after sunrise, 07:00), entered as
 * hour, minute and period, and reported as an international clock time. Shows the 24-hour
 * equivalent, and explains an hour that is not in the chosen period.
 *
 * @example
 * ```tsx
 * <EthiopianTimeInput label="Meeting time" locale={am} onChange={setTime} />
 * ```
 */
export function EthiopianTimeInput(props: EthiopianTimeInputProps) {
  const { label, locale, value, defaultValue, onChange, labels } = props;
  const [fields, setFields] = useState<Fields>(() => fieldsOf(value ?? defaultValue));
  const id = useId();

  // Follow a controlled value that changes from outside, unless the fields already show it
  // (adjusting state while rendering, as React recommends over an effect).
  const outside = value ? `${value.hour}:${value.minute}` : '';
  const [seen, setSeen] = useState(outside);
  if (outside !== seen) {
    setSeen(outside);
    const shown = read(fields);
    const same =
      shown !== null && typeof shown === 'object' && `${shown.hour}:${shown.minute}` === outside;
    if (value && !same) setFields(fieldsOf(value));
  }

  const result = read(fields);
  const valid = typeof result === 'object' ? result : null;
  const error = typeof result === 'string' ? result : null;

  const update = (change: Partial<Fields>) => {
    const next = { ...fields, ...change };
    setFields(next);
    const time = read(next);
    if (time !== null && typeof time === 'object') onChange?.(time);
  };

  return (
    <fieldset className="qen-time-input" lang={locale.code} dir={locale.direction}>
      <legend className="qen-time-input__legend">{label}</legend>
      <div className="qen-time-input__fields">
        <label className="qen-time-input__field">
          <span className="qen-time-input__label">{labels?.hour ?? 'Hour'}</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            className="qen-time-input__number"
            value={fields.hour}
            aria-invalid={error !== null || undefined}
            aria-describedby={error !== null ? `${id}-error` : undefined}
            onChange={(e) => update({ hour: e.target.value })}
          />
        </label>
        <label className="qen-time-input__field">
          <span className="qen-time-input__label">{labels?.minute ?? 'Minute'}</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            className="qen-time-input__number"
            value={fields.minute}
            onChange={(e) => update({ minute: e.target.value })}
          />
        </label>
        <label className="qen-time-input__field">
          <span className="qen-time-input__label">{labels?.period ?? 'Period'}</span>
          <select
            className="qen-time-input__period"
            value={fields.period}
            onChange={(e) => update({ period: e.target.value as EthiopianTimePeriod })}
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {locale.periods[p]}
              </option>
            ))}
          </select>
        </label>
        {valid && (
          <output className="qen-time-input__clock" aria-live="polite" dir="ltr">
            {`${pad(valid.hour)}:${pad(valid.minute)}`}
          </output>
        )}
      </div>
      {error !== null && (
        <p id={`${id}-error`} className="qen-time-input__error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
