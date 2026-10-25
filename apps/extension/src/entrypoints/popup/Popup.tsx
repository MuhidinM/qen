import {
  format,
  today,
  toEthiopianTime,
  type CalendarId,
  type HijriSettings,
  type Locale,
} from '@qen/core';
import { en } from '@qen/core/locales/en';
import { ethiopianHijriOverrides } from '@qen/core/overrides/ethiopia';
import { DateText } from '@qen/react';
import { useMinuteClock } from '@/lib/clock';
import { upcomingHolidays } from '@/lib/upcoming';

const CALENDARS: readonly { id: CalendarId; name: string }[] = [
  { id: 'gregorian', name: 'Gregorian' },
  { id: 'ethiopian', name: 'Ethiopian' },
  { id: 'hijri', name: 'Hijri' },
];

// Until settings arrive (#167): English, and the website's default Hijri dates.
const locale: Locale = en;
const hijri: HijriSettings = { overrides: ethiopianHijriOverrides };

const daysAway = (days: number) =>
  days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;

export function Popup() {
  const now = useMinuteClock();
  const time = toEthiopianTime({ hour: now.getHours(), minute: now.getMinutes() });
  const upcoming = upcomingHolidays(today('gregorian', { now }), { count: 4, hijri });

  return (
    <main className="popup">
      <h1 className="popup__title">Qen</h1>

      <section aria-labelledby="today-title">
        <h2 id="today-title" className="popup__heading">
          Today
        </h2>
        <dl className="today-list">
          {CALENDARS.map((c) => {
            const d = today(c.id, { now, hijri });
            return (
              <div key={c.id} className="today-list__row">
                <dt>{c.name}</dt>
                <dd lang={locale.code} dir={locale.direction}>
                  <span className="today-list__date">
                    <DateText date={d} locale={locale} pattern="EEEE, d MMMM y G" hijri={hijri} />
                  </span>
                  {c.id === 'ethiopian' && (
                    <span className="today-list__time">
                      {time.hour}:{String(time.minute).padStart(2, '0')}{' '}
                      {locale.periods[time.period]}
                      <span className="visually-hidden"> (Ethiopian time)</span>
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="popup__heading">
          Coming up
        </h2>
        <ul className="upcoming">
          {upcoming.map(({ holiday, days }) => (
            <li key={`${holiday.id}-${holiday.gregorian.month}-${holiday.gregorian.day}`}>
              <span className="upcoming__name">{locale.holidays[holiday.id]}</span>
              <span className="upcoming__when">
                {format(holiday.gregorian, 'd MMM', { locale })} · {daysAway(days)}
                {holiday.status === 'expected' && ' · expected'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
