import { convert, date, format, type CalendarDate } from '@qen/core';
import { hijriSettings, LOCALES, type Settings } from './settings';

/**
 * Google Calendar's markup, all in one place (R-EXT-03): when Google changes it, only this
 * changes. Google marks days with `data-datekey`. Month view: on each day number (`h2`).
 * Week view: on each column header's day number. Day view: not in the header, only in the
 * all-day row's list (`li`, one per column, in order), which week view has too.
 */
export const SELECTORS = {
  monthDay: 'h2[data-datekey]',
  /** A column header's heading: the weekday name, then the day number. */
  header: '[role="columnheader"] h2',
  key: '[data-datekey]',
  columnKeys: 'li[data-datekey]',
  attribute: 'data-datekey',
};

/** The class of the badges the overlay adds; styled by the content script's CSS. */
export const BADGE_CLASS = 'qen-gcal';

/** Google Calendar's day key, `(year − 1970) << 9 | month << 5 | day`, as a Gregorian date. */
export function decodeDateKey(key: string): CalendarDate | undefined {
  if (!/^\d+$/.test(key)) return undefined;
  const k = Number(key);
  try {
    return date('gregorian', (k >> 9) + 1970, (k >> 5) & 15, k & 31);
  } catch {
    return undefined;
  }
}

const OVERLAY_CALENDARS = {
  both: ['ethiopian', 'hijri'],
  ethiopian: ['ethiopian'],
  hijri: ['hijri'],
  off: [],
} as const;

const NAMES = { ethiopian: 'Ethiopian', hijri: 'Hijri' } as const;

/**
 * The badge for one day: day numbers, with the month named on the first day shown and on each
 * calendar's first of the month (as Google does for "1 Nov"), and the full dates as its title.
 */
function badge(day: CalendarDate, settings: Settings, first: boolean) {
  const locale = LOCALES[settings.language];
  const hijri = hijriSettings(settings.hijri);
  const options = { locale, hijri, ...(settings.geez ? { numerals: 'geez' as const } : {}) };
  const parts = OVERLAY_CALENDARS[settings.overlay].map((calendar) => {
    const d = convert(day, calendar, { hijri });
    return {
      short: format(d, first || d.day === 1 ? 'd MMMM' : 'd', options),
      full: `${NAMES[calendar]}: ${format(d, 'd MMMM y G', { locale: LOCALES.en, hijri })}`,
    };
  });
  return {
    text: parts.map((p) => p.short).join(' · '),
    title: parts.map((p) => p.full).join(' · '),
  };
}

/**
 * Where each day's badge goes, and that day's key. Month view cells have no free line (event
 * chips are positioned over them), so the badge sits beside the day number; week and day view
 * headers have a fixed height, so it sits after the weekday name.
 */
function targets(root: Document): { key: string; after?: Element; inside?: Element }[] {
  const month = [...root.querySelectorAll(SELECTORS.monthDay)].map((label) => ({
    key: label.getAttribute(SELECTORS.attribute) ?? '',
    after: label,
  }));
  const headers = [...root.querySelectorAll(SELECTORS.header)];
  const columns = [...root.querySelectorAll(SELECTORS.columnKeys)];
  const inHeaders = headers.flatMap((h2, i) => {
    const key =
      h2.querySelector(SELECTORS.key)?.getAttribute(SELECTORS.attribute) ??
      (columns.length === headers.length ? columns[i]?.getAttribute(SELECTORS.attribute) : null);
    const weekday = h2.firstElementChild;
    return key && weekday ? [{ key, inside: weekday }] : [];
  });
  return [...month, ...inHeaders];
}

/**
 * Adds a badge to each day Google Calendar shows, or updates it. Returns how many badges it
 * added or changed, so a run with nothing to do changes nothing and the content script's
 * MutationObserver settles. Unknown markup gives no badges and no errors.
 */
export function annotate(root: Document, settings: Settings): number {
  if (settings.overlay === 'off') {
    clear(root);
    return 0;
  }
  const locale = LOCALES[settings.language];
  const signature = `${settings.language}|${settings.geez}|${settings.hijri}|${settings.overlay}`;
  let changed = 0;
  targets(root).forEach(({ key, after, inside }, index) => {
    const day = decodeDateKey(key);
    if (!day) return;
    const found = after ? after.nextElementSibling : inside?.querySelector(`.${BADGE_CLASS}`);
    const existing =
      found instanceof HTMLElement && found.classList.contains(BADGE_CLASS) ? found : null;
    const id = `${key}|${index === 0}|${signature}`;
    if (existing?.dataset.qen === id) return;
    const { text, title } = badge(day, settings, index === 0);
    const el = existing ?? root.createElement('span');
    el.className = BADGE_CLASS;
    el.dataset.qen = id;
    el.textContent = text;
    el.title = title;
    el.lang = locale.code;
    el.dir = locale.direction;
    if (!existing) {
      if (after) after.after(el);
      else inside?.append(el);
    }
    changed++;
  });
  return changed;
}

/** Removes every badge (overlay turned off, or settings changed). */
export function clear(root: Document): void {
  for (const el of root.querySelectorAll(`.${BADGE_CLASS}`)) el.remove();
}
