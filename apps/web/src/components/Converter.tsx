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
import { hijriSettings } from '@/lib/hijri';
import { datePath } from '@/lib/links';
import { CALENDARS, LOCALES } from '@/lib/locales';
import type { DateLanguage, HijriChoice } from '@/lib/settings';
import { CalendarDateInput } from './CalendarDateInput';
import { DateCards } from './DateCards';
import { DatePreferences, useDatePreferences } from './DatePreferences';

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
  const [calendar, setCalendar] = useState(initialCalendar);
  const [value, setValue] = useState(
    initialValue && convert(initialValue, initialCalendar, { hijri }),
  );
  const [status, setStatus] = useState('');

  // The address bar always holds a link to what is on screen.
  function show(next: CalendarDate | null) {
    setValue(next);
    setStatus('');
    window.history.replaceState(null, '', datePath('/convert', next));
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
        <CalendarDateInput
          label="Date"
          calendar={calendar}
          setCalendar={setCalendar}
          value={value}
          onChange={show}
          locale={locale}
          hijri={hijri}
          geez={preferences.geez}
        />
        <DatePreferences {...preferences} />
      </div>

      {value && (
        <section className="converter__result" aria-labelledby="result-title">
          <h2 id="result-title" className="visually-hidden">
            Result
          </h2>
          <DateCards
            date={value}
            idPrefix="result"
            locale={locale}
            hijri={hijri}
            geez={preferences.geez}
          />

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
