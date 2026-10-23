'use client';

import { useState, useSyncExternalStore } from 'react';
import { format, today, toEthiopianTime, type CalendarId, type Locale } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { om } from '@qen/core/locales/om';
import { ti } from '@qen/core/locales/ti';
import { DateText } from '@qen/react';
import { COOKIES, DATE_LANGUAGES, savePreference, type DateLanguage } from '@/lib/settings';

const LOCALES: Readonly<Record<DateLanguage, Locale>> = { en, am, om, ti, ar };

const CALENDARS: readonly { id: CalendarId; name: string; dayStarts: string }[] = [
  { id: 'gregorian', name: 'Gregorian', dayStarts: 'The day starts at midnight.' },
  { id: 'ethiopian', name: 'Ethiopian', dayStarts: 'The day starts at dawn, 06:00.' },
  { id: 'hijri', name: 'Hijri', dayStarts: 'The day starts at sunset, about 18:00.' },
];

/**
 * The clock, read on each new minute and when the tab becomes visible again. The server
 * snapshot is null: the server can't know the visitor's time zone, so it renders a stable
 * placeholder and the client fills in today, with no hydration mismatch.
 */
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    timer = setTimeout(
      () => {
        onChange();
        schedule();
      },
      60_000 - (Date.now() % 60_000),
    );
  };
  schedule();
  document.addEventListener('visibilitychange', onChange);
  return () => {
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onChange);
  };
}
const minuteNow = () => Math.floor(Date.now() / 60_000) * 60_000;
const noClockOnServer = () => null;

export function TodayHero({
  initialLanguage,
  initialGeez,
}: {
  initialLanguage: DateLanguage;
  initialGeez: boolean;
}) {
  const now = useSyncExternalStore(subscribe, minuteNow, noClockOnServer);
  const [language, setLanguage] = useState(initialLanguage);
  const [geez, setGeez] = useState(initialGeez);
  const locale = LOCALES[language];
  const numerals = geez ? ({ numerals: 'geez' } as const) : {};

  return (
    <div className="today">
      <div className="today__controls">
        <label className="field">
          <span className="field__label">Show dates in</span>
          <select
            value={language}
            onChange={(e) => {
              const next = e.target.value as DateLanguage;
              setLanguage(next);
              savePreference(COOKIES.language, next);
            }}
          >
            {DATE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={geez}
            onChange={(e) => {
              setGeez(e.target.checked);
              savePreference(COOKIES.geez, e.target.checked ? '1' : '0');
            }}
          />
          Ge’ez numerals
        </label>
      </div>

      <div className="today__cards" aria-busy={now === null}>
        {CALENDARS.map((c) => {
          const date = now === null ? null : today(c.id, { now: new Date(now) });
          const headingId = `today-${c.id}`;
          return (
            <section key={c.id} className="today-card" aria-labelledby={headingId}>
              <h2 id={headingId} className="today-card__calendar">
                {c.name}
              </h2>
              {now === null || date === null ? (
                <p className="today-card__placeholder">Loading today…</p>
              ) : (
                // One direction for the whole date block, so Arabic lines up right to left.
                <div className="today-card__value" lang={locale.code} dir={locale.direction}>
                  <p className="today-card__weekday">{format(date, 'EEEE', { locale })}</p>
                  <p className="today-card__date">
                    <DateText date={date} locale={locale} pattern="d MMMM y G" {...numerals} />
                  </p>
                  {c.id === 'ethiopian' && <EthiopianClock now={now} locale={locale} />}
                </div>
              )}
              <p className="today-card__note">{c.dayStarts}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** Ethiopian time, counted from 06:00 and 18:00 (ADR-0012). Digits stay Latin, as clocks show. */
function EthiopianClock({ now, locale }: { now: number; locale: Locale }) {
  const d = new Date(now);
  const t = toEthiopianTime({ hour: d.getHours(), minute: d.getMinutes() });
  return (
    <p className="today-card__time">
      <span className="visually-hidden" lang="en">
        Ethiopian time:{' '}
      </span>
      {t.hour}:{String(t.minute).padStart(2, '0')} {locale.periods[t.period]}
    </p>
  );
}
