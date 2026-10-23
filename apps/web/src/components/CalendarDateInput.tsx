'use client';

import {
  convert,
  type CalendarDate,
  type CalendarId,
  type HijriSettings,
  type Locale,
} from '@qen/core';
import { DatePicker } from '@qen/react';
import { ALL_LOCALES, CALENDARS } from '@/lib/locales';

/**
 * A date in any calendar: choose the calendar, then type, paste or pick. Text is read with
 * `parse()` inside `<DatePicker>` (ambiguous text asks, ADR-0014). Switching the calendar keeps
 * the same day.
 */
export function CalendarDateInput({
  label,
  calendar,
  setCalendar,
  value,
  onChange,
  locale,
  hijri,
  geez,
}: {
  label: string;
  calendar: CalendarId;
  setCalendar: (calendar: CalendarId) => void;
  value: CalendarDate | null;
  onChange: (value: CalendarDate | null) => void;
  locale: Locale;
  hijri: HijriSettings;
  geez: boolean;
}) {
  return (
    <>
      <fieldset className="segmented">
        <legend className="field__label">Enter the date in</legend>
        {CALENDARS.map((c) => (
          <label key={c.id} className="segmented__option">
            <input
              type="radio"
              name="calendar"
              value={c.id}
              checked={calendar === c.id}
              onChange={() => {
                setCalendar(c.id);
                if (value) onChange(convert(value, c.id, { hijri }));
              }}
            />
            <span>{c.name}</span>
          </label>
        ))}
      </fieldset>

      <DatePicker
        label={label}
        calendar={calendar}
        locale={locale}
        locales={ALL_LOCALES}
        value={value}
        onChange={onChange}
        hijri={hijri}
        {...(geez ? { numerals: 'geez' } : {})}
      />
      <p className="input-hint">
        Type or paste a date in any calendar, such as “17 Meskerem 2019 EC” or “12 April 2026”, then
        press Enter.
      </p>
    </>
  );
}
