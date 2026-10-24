'use client';

import { useState } from 'react';
import {
  addDays,
  diff,
  format,
  getHolidaysInRange,
  today,
  type CalendarDate,
  type CalendarId,
  type Holiday,
  type HolidayId,
} from '@qen/core';
import { useMinuteClock } from '@/lib/clock';
import { plural, weeksAndDays } from '@/lib/count';
import { hijriSettings } from '@/lib/hijri';
import { datePath } from '@/lib/links';
import { LOCALES } from '@/lib/locales';
import type { DateLanguage, HijriChoice } from '@/lib/settings';
import { CalendarDateInput } from './CalendarDateInput';
import { DateCards } from './DateCards';
import { DatePreferences, useDatePreferences } from './DatePreferences';

type Mode = 'date' | 'holiday';

export function Countdown({
  initialMode,
  initialCalendar,
  initialValue,
  initialHoliday,
  initialLanguage,
  initialGeez,
  hijriChoice,
}: {
  initialMode: Mode;
  initialCalendar: CalendarId;
  initialValue: CalendarDate | null;
  initialHoliday: HolidayId | null;
  initialLanguage: DateLanguage;
  initialGeez: boolean;
  hijriChoice: HijriChoice;
}) {
  const hijri = hijriSettings(hijriChoice);
  const preferences = useDatePreferences(initialLanguage, initialGeez);
  const locale = LOCALES[preferences.language];
  const now = useMinuteClock();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [calendar, setCalendar] = useState(initialCalendar);
  const [value, setValue] = useState(initialValue);
  const [holiday, setHoliday] = useState(initialHoliday);

  // The address bar always holds a link to this countdown.
  const link = (m: Mode, v: CalendarDate | null, h: HolidayId | null) =>
    window.history.replaceState(
      null,
      '',
      m === 'holiday' ? (h ? `/countdown?holiday=${h}` : '/countdown') : datePath('/countdown', v),
    );

  // Today and the year ahead depend on the visitor's time zone: client only (lib/clock.ts).
  const start = now === null ? null : today('gregorian', { now: new Date(now), hijri });
  const upcoming: Holiday[] = [];
  if (start) {
    for (const h of getHolidaysInRange(start, addDays(start, 366), { hijri })) {
      if (!upcoming.some((u) => u.id === h.id)) upcoming.push(h);
    }
  }
  const target =
    mode === 'holiday' ? (upcoming.find((h) => h.id === holiday)?.gregorian ?? null) : value;
  const days = start && target ? diff(start, target, 'days', { hijri }) : null;

  return (
    <div className="countdown">
      <div className="converter__input">
        <fieldset className="segmented">
          <legend className="field__label">Count down</legend>
          {(
            [
              ['date', 'To a date'],
              ['holiday', 'To a holiday'],
            ] as const
          ).map(([m, name]) => (
            <label key={m} className="segmented__option">
              <input
                type="radio"
                name="mode"
                checked={mode === m}
                onChange={() => {
                  setMode(m);
                  link(m, value, holiday);
                }}
              />
              <span>{name}</span>
            </label>
          ))}
        </fieldset>

        {mode === 'date' ? (
          <CalendarDateInput
            label="Date"
            calendar={calendar}
            setCalendar={setCalendar}
            value={value}
            onChange={(next) => {
              setValue(next);
              link('date', next, holiday);
            }}
            locale={locale}
            hijri={hijri}
            geez={preferences.geez}
          />
        ) : (
          <label className="field">
            <span className="field__label">Holiday</span>
            <select
              value={holiday ?? ''}
              disabled={now === null}
              onChange={(e) => {
                const next = (e.target.value || null) as HolidayId | null;
                setHoliday(next);
                link('holiday', value, next);
              }}
            >
              <option value="">Choose a holiday</option>
              {upcoming.map((h) => (
                <option key={h.id} value={h.id}>
                  {locale.holidays[h.id]} ({format(h.gregorian, 'd MMM y', { locale })})
                </option>
              ))}
            </select>
          </label>
        )}
        <DatePreferences {...preferences} />
      </div>

      {target && (
        <section
          className="converter__result"
          aria-labelledby="result-title"
          aria-busy={days === null}
        >
          <h2 id="result-title" className="visually-hidden">
            Result
          </h2>
          {days !== null && (
            <div className="count">
              {days === 0 ? (
                <p className="count__big">That’s today.</p>
              ) : (
                <>
                  <p className="count__big">
                    {plural(Math.abs(days), 'day')}
                    {days < 0 && ' ago'}
                  </p>
                  {Math.abs(days) >= 7 && (
                    <p className="count__sub">{weeksAndDays(Math.abs(days))}</p>
                  )}
                </>
              )}
            </div>
          )}
          <DateCards
            date={target}
            idPrefix="target"
            locale={locale}
            hijri={hijri}
            geez={preferences.geez}
          />
        </section>
      )}
    </div>
  );
}
