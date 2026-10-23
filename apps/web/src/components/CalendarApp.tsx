'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  convert,
  date,
  daysInMonth,
  format,
  isValid,
  monthsInYear,
  today,
  type CalendarId,
  type HolidayCategory,
} from '@qen/core';
import { AgendaView, CalendarGrid, YearView, type VisibleMonth } from '@qen/react';
import { useMinuteClock } from '@/lib/clock';
import { hijriSettings } from '@/lib/hijri';
import { CALENDARS, LOCALES } from '@/lib/locales';
import type { Preferences } from '@/lib/preferences';
import {
  COOKIES,
  HIJRI_CHOICES,
  HOLIDAY_CATEGORIES,
  parseCalendar,
  savePreference,
  type HijriChoice,
} from '@/lib/settings';
import { DatePreferences, useDatePreferences } from './DatePreferences';

const VIEWS = [
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'agenda', label: 'Agenda' },
] as const;
type View = (typeof VIEWS)[number]['id'];

const CATEGORY_LABELS: Readonly<Record<HolidayCategory, string>> = {
  public: 'Public',
  orthodox: 'Orthodox',
  islamic: 'Islamic',
  other: 'Other',
};

/** `/calendar?view=…&calendar=…&year=…&month=…`: what is on screen, so links and back/forward work. */
function calendarPath(view: View, calendar: CalendarId, m: VisibleMonth): string {
  return `/calendar?view=${view}&calendar=${calendar}&year=${m.year}&month=${m.month}`;
}

export function CalendarApp({ preferences }: { preferences: Preferences }) {
  const params = useSearchParams();
  const now = useMinuteClock();
  const dates = useDatePreferences(preferences.language, preferences.geez);
  const [rememberedCalendar, setRememberedCalendar] = useState(preferences.calendar);
  const [categories, setCategories] = useState(preferences.holidays);
  const [otherCalendars, setOtherCalendars] = useState(preferences.otherCalendars);
  const [hijriChoice, setHijriChoice] = useState(preferences.hijri);

  const locale = LOCALES[dates.language];
  const numerals = dates.geez ? ({ numerals: 'geez' } as const) : {};
  const hijri = hijriSettings(hijriChoice);
  const options = { hijri };

  // The URL decides the view and month; the remembered calendar and today fill the gaps.
  const view: View = VIEWS.find((v) => v.id === params.get('view'))?.id ?? 'month';
  const calendar = params.has('calendar')
    ? parseCalendar(params.get('calendar') ?? undefined)
    : rememberedCalendar;
  const linked = { year: Number(params.get('year')), month: Number(params.get('month')) };
  const linkedOk =
    Number.isInteger(linked.year) &&
    Number.isInteger(linked.month) &&
    isValid({ calendar, year: linked.year, month: linked.month, day: 1 });

  // Today depends on the visitor's time zone, so the views appear once the client knows it.
  if (now === null) {
    return (
      <div className="calendar-app" aria-busy="true">
        <p className="calendar-app__loading">Loading the calendar…</p>
      </div>
    );
  }
  const todayDate = today(calendar, { now: new Date(now), hijri });
  const visible: VisibleMonth = linkedOk ? linked : todayDate;

  const go = (nextView: View, nextCalendar: CalendarId, m: VisibleMonth) =>
    window.history.pushState(null, '', calendarPath(nextView, nextCalendar, m));
  const step = (months: number): VisibleMonth => {
    const count = monthsInYear(calendar, visible.year);
    const index = visible.month - 1 + months;
    if (index < 0)
      return { year: visible.year - 1, month: monthsInYear(calendar, visible.year - 1) };
    if (index >= count) return { year: visible.year + 1, month: 1 };
    return { year: visible.year, month: index + 1 };
  };

  const first = date(calendar, visible.year, visible.month, 1);
  const last = date(
    calendar,
    visible.year,
    visible.month,
    daysInMonth(calendar, visible.year, visible.month, options),
  );
  const others = otherCalendars ? CALENDARS.map((c) => c.id).filter((c) => c !== calendar) : [];

  return (
    <div className="calendar-app">
      <div className="calendar-app__toolbar">
        <fieldset className="segmented">
          <legend className="field__label">View</legend>
          {VIEWS.map((v) => (
            <label key={v.id} className="segmented__option">
              <input
                type="radio"
                name="view"
                checked={view === v.id}
                onChange={() => go(v.id, calendar, visible)}
              />
              <span>{v.label}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="segmented">
          <legend className="field__label">Calendar</legend>
          {CALENDARS.map((c) => (
            <label key={c.id} className="segmented__option">
              <input
                type="radio"
                name="calendar"
                checked={calendar === c.id}
                onChange={() => {
                  setRememberedCalendar(c.id);
                  savePreference(COOKIES.calendar, c.id);
                  // Keep the same days in view: the month holding this month's first day.
                  go(view, c.id, convert(first, c.id, options));
                }}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </fieldset>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => go(view, calendar, todayDate)}
        >
          Today
        </button>
      </div>

      <div className="calendar-app__body">
        <div className="calendar-app__view">
          {view === 'month' && (
            <CalendarGrid
              calendar={calendar}
              locale={locale}
              month={visible}
              onMonthChange={(m) => go('month', calendar, m)}
              today={todayDate}
              secondary={others}
              holidays={categories}
              legend={false}
              hijri={hijri}
              {...numerals}
            />
          )}
          {view === 'year' && (
            <>
              <div className="calendar-app__pager">
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => go('year', calendar, { year: visible.year - 1, month: 1 })}
                >
                  Previous year
                </button>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => go('year', calendar, { year: visible.year + 1, month: 1 })}
                >
                  Next year
                </button>
              </div>
              <YearView
                calendar={calendar}
                locale={locale}
                year={visible.year}
                onSelectMonth={(m) => go('month', calendar, m)}
                holidays={categories}
                today={todayDate}
                hijri={hijri}
                {...numerals}
              />
            </>
          )}
          {view === 'agenda' && (
            <>
              <h2 className="calendar-app__period" lang={locale.code} dir={locale.direction}>
                {format(first, 'MMMM y', { locale, hijri, ...numerals })}
              </h2>
              <div className="calendar-app__pager">
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => go('agenda', calendar, step(-1))}
                >
                  Previous month
                </button>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => go('agenda', calendar, step(1))}
                >
                  Next month
                </button>
              </div>
              <AgendaView
                calendar={calendar}
                locale={locale}
                start={first}
                end={last}
                holidays={categories}
                observances
                hijri={hijri}
                {...numerals}
              />
            </>
          )}
        </div>

        <aside className="calendar-app__settings" aria-labelledby="settings-title">
          <h2 id="settings-title" className="calendar-app__settings-title">
            Settings
          </h2>
          <fieldset className="filter">
            <legend className="field__label">Holidays</legend>
            {HOLIDAY_CATEGORIES.map((c) => (
              <label key={c} className="checkbox">
                <input
                  type="checkbox"
                  checked={categories.includes(c)}
                  onChange={(e) => {
                    const next = HOLIDAY_CATEGORIES.filter((x) =>
                      x === c ? e.target.checked : categories.includes(x),
                    );
                    setCategories(next);
                    savePreference(COOKIES.holidays, next.join(','));
                  }}
                />
                {/* The same shapes as in the month view's day cells. */}
                <span className="qen-calendar__marker" data-category={c} aria-hidden="true" />
                {CATEGORY_LABELS[c]}
              </label>
            ))}
          </fieldset>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={otherCalendars}
              onChange={(e) => {
                setOtherCalendars(e.target.checked);
                savePreference(COOKIES.otherCalendars, e.target.checked ? '1' : '0');
              }}
            />
            Show other calendars in each day
          </label>
          <label className="field">
            <span className="field__label">Hijri dates</span>
            <select
              value={hijriChoice}
              onChange={(e) => {
                const next = e.target.value as HijriChoice;
                setHijriChoice(next);
                savePreference(COOKIES.hijri, next);
              }}
            >
              {HIJRI_CHOICES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <DatePreferences {...dates} />
        </aside>
      </div>
    </div>
  );
}
