'use client';

import { useState } from 'react';
import {
  convert,
  format,
  getHolidaysInRange,
  type CalendarDate,
  type CalendarId,
  type HijriSettings,
  type Locale,
} from '@qen/core';
import { DatePicker, DateText } from '@qen/react';
import { hijriSettings } from '@/lib/hijri';
import { ALL_LOCALES, CALENDARS, LOCALES } from '@/lib/locales';
import type { DateLanguage, HijriChoice } from '@/lib/settings';
import { DatePreferences, useDatePreferences } from './DatePreferences';

const pad = (n: number, width: number) => String(n).padStart(width, '0');

/** `/convert?calendar=…&date=YYYY-MM-DD`, the date written in its own calendar. */
export function converterPath(d: CalendarDate | null): string {
  if (!d) return '/convert';
  return `/convert?calendar=${d.calendar}&date=${pad(d.year, 4)}-${pad(d.month, 2)}-${pad(d.day, 2)}`;
}

/** One line per calendar, for pasting into a message. */
function resultText(d: CalendarDate, locale: Locale, hijri: HijriSettings): string {
  return CALENDARS.map((c) => {
    const text = format(convert(d, c.id, { hijri }), 'EEEE, d MMMM y G', { locale, hijri });
    return `${c.name}: ${text}`;
  }).join('\n');
}

export function Converter({
  initialCalendar,
  initialValue,
  initialLanguage,
  initialGeez,
  hijriChoice,
}: {
  initialCalendar: CalendarId;
  initialValue: CalendarDate | null;
  initialLanguage: DateLanguage;
  initialGeez: boolean;
  hijriChoice: HijriChoice;
}) {
  const hijri = hijriSettings(hijriChoice);
  const preferences = useDatePreferences(initialLanguage, initialGeez);
  const locale = LOCALES[preferences.language];
  const numerals = preferences.geez ? ({ numerals: 'geez' } as const) : {};
  const [calendar, setCalendar] = useState(initialCalendar);
  const [value, setValue] = useState(
    initialValue && convert(initialValue, initialCalendar, { hijri }),
  );
  const [status, setStatus] = useState('');

  // The address bar always holds a link to what is on screen.
  function show(next: CalendarDate | null) {
    setValue(next);
    setStatus('');
    window.history.replaceState(null, '', converterPath(next));
  }

  async function copy(text: string, done: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(done);
    } catch {
      setStatus('Copying is blocked in this browser. Select the text and copy it instead.');
    }
  }

  const holidays = value ? getHolidaysInRange(value, value, { hijri }) : [];

  return (
    <div className="converter">
      <div className="converter__input">
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
                  if (value) show(convert(value, c.id, { hijri }));
                }}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </fieldset>

        <DatePicker
          label="Date"
          calendar={calendar}
          locale={locale}
          locales={ALL_LOCALES}
          value={value}
          onChange={show}
          hijri={hijri}
          {...numerals}
        />
        <p className="converter__hint">
          Type or paste a date in any calendar, such as “17 Meskerem 2019 EC” or “12 April 2026”,
          then press Enter.
        </p>

        <DatePreferences {...preferences} />
      </div>

      {value && (
        <section className="converter__result" aria-labelledby="result-title">
          <h2 id="result-title" className="visually-hidden">
            Result
          </h2>
          <div className="date-cards">
            {CALENDARS.map((c) => {
              const d = convert(value, c.id, { hijri });
              const headingId = `result-${c.id}`;
              return (
                <section key={c.id} className="date-card" aria-labelledby={headingId}>
                  <h3 id={headingId} className="date-card__calendar">
                    {c.name}
                  </h3>
                  <div className="date-card__value" lang={locale.code} dir={locale.direction}>
                    <p className="date-card__weekday">{format(d, 'EEEE', { locale, hijri })}</p>
                    <p className="date-card__date">
                      <DateText
                        date={d}
                        locale={locale}
                        pattern="d MMMM y G"
                        hijri={hijri}
                        {...numerals}
                      />
                    </p>
                  </div>
                </section>
              );
            })}
          </div>

          <h3 id="holidays-title" className="converter__subtitle">
            Holidays on this day
          </h3>
          {holidays.length === 0 ? (
            <p className="converter__empty">No holidays on this day.</p>
          ) : (
            <ul className="holiday-list" aria-labelledby="holidays-title">
              {holidays.map((h) => (
                <li key={h.id}>
                  <span lang={locale.code} dir={locale.direction}>
                    {locale.holidays[h.id]}
                  </span>
                  {h.status === 'expected' && (
                    <span className="badge">expected date, not yet confirmed</span>
                  )}
                  {h.status === 'confirmed' && <span className="badge">confirmed</span>}
                </li>
              ))}
            </ul>
          )}

          <div className="converter__actions">
            <button
              type="button"
              className="button"
              onClick={() => copy(resultText(value, locale, hijri), 'Result copied.')}
            >
              Copy result
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={() => copy(window.location.href, 'Link copied.')}
            >
              Copy link
            </button>
          </div>
        </section>
      )}
      <p role="status" className="converter__status">
        {status}
      </p>
    </div>
  );
}
