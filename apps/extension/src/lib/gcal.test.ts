// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { annotate, BADGE_CLASS, clear, decodeDateKey } from './gcal';
import { DEFAULT_SETTINGS, type Settings } from './settings';

const fixture = (name: string) =>
  readFileSync(join(__dirname, '__fixtures__', `gcal-${name}.html`), 'utf8');
const load = (name: string) => {
  document.documentElement.innerHTML = new DOMParser().parseFromString(
    fixture(name),
    'text/html',
  ).documentElement.innerHTML;
};
const badges = () => [...document.querySelectorAll<HTMLElement>(`.${BADGE_CLASS}`)];
// Umm al-Qura alone, so the Hijri anchors below don't depend on Ethiopia's confirmations.
const settings: Settings = { ...DEFAULT_SETTINGS, hijri: 'umalqura' };

describe('decodeDateKey', () => {
  it("reads Google Calendar's day keys: (year − 1970) << 9 | month << 5 | day", () => {
    expect(decodeDateKey('29017')).toEqual({
      calendar: 'gregorian',
      year: 2026,
      month: 10,
      day: 25,
    });
    expect(decodeDateKey('28987')).toMatchObject({ year: 2026, month: 9, day: 27 });
  });

  it('gives nothing for keys that are not a real day', () => {
    for (const key of ['', 'abc', '0', '-5', '1.5', String((56 << 9) | (2 << 5) | 30)]) {
      expect(decodeDateKey(key)).toBeUndefined();
    }
  });
});

describe('annotate', () => {
  beforeEach(() => load('month'));

  it('adds Ethiopian and Hijri days under every day of the month view', () => {
    expect(annotate(document, settings)).toBe(35);
    const all = badges();
    expect(all).toHaveLength(35);
    // The first day shown, and each calendar's first of the month, name the month.
    expect(all[0]?.textContent).toBe('17 Meskerem · 16 Rabi al-Thani');
    expect(all[14]?.textContent).toBe('1 Tikimt · 30'); // 11 October
    expect(all[15]?.textContent).toBe('2 · 1 Jumada al-Ula'); // 12 October
    expect(all[28]?.textContent).toBe('15 · 14'); // 25 October
    expect(all[28]?.title).toBe('Ethiopian: 15 Tikimt 2019 EC · Hijri: 14 Jumada al-Ula 1448 AH');
    // Each badge sits right after the day number it belongs to.
    expect(all[28]?.previousElementSibling?.getAttribute('data-datekey')).toBe('29017');
  });

  it('changes nothing when run again, so it can follow every page change', () => {
    annotate(document, settings);
    expect(annotate(document, settings)).toBe(0);
    expect(badges()).toHaveLength(35);
  });

  it('shows one calendar, or none, as chosen in settings', () => {
    annotate(document, { ...settings, overlay: 'ethiopian' });
    expect(badges()[28]?.textContent).toBe('15');
    expect(badges()[28]?.title).toBe('Ethiopian: 15 Tikimt 2019 EC');

    annotate(document, { ...settings, overlay: 'hijri' });
    expect(badges()[0]?.textContent).toBe('16 Rabi al-Thani');

    annotate(document, { ...settings, overlay: 'off' });
    expect(badges()).toHaveLength(0);
  });

  it('uses the language and numerals from settings, right to left for Arabic', () => {
    annotate(document, { ...settings, language: 'am', geez: true });
    expect(badges()[28]?.textContent).toBe('፲፭ · ፲፬');
    expect(badges()[28]?.lang).toBe('am');

    annotate(document, { ...settings, language: 'ar' });
    expect(badges()[28]?.dir).toBe('rtl');
  });

  it('adds them after the weekday name in the week view, not to the grid cells below', () => {
    load('week');
    expect(annotate(document, settings)).toBe(7);
    expect(badges()[0]?.textContent).toBe('15 Tikimt · 14 Jumada al-Ula');
    expect(badges()[0]?.parentElement?.textContent).toMatch(/^Sun/);
    expect(badges()[0]?.closest('[role="columnheader"]')).not.toBeNull();
  });

  it("takes the day view's date from the all-day row, as its header has none", () => {
    load('day');
    expect(annotate(document, settings)).toBe(1);
    expect(badges()[0]?.textContent).toBe('15 Tikimt · 14 Jumada al-Ula');
    expect(badges()[0]?.closest('[role="columnheader"]')).not.toBeNull();
  });

  it('skips headers it cannot match to a day', () => {
    load('day');
    document.querySelector('li[data-datekey]')?.remove();
    expect(annotate(document, settings)).toBe(0);
  });

  it('updates a badge when Google reuses a day label for another day', () => {
    annotate(document, settings);
    const label = document.querySelector('[data-datekey="29017"]');
    label?.setAttribute('data-datekey', '29018');
    expect(annotate(document, settings)).toBe(1);
    expect(badges()[28]?.textContent).toBe('16 · 15');
  });

  it('fails quietly on markup it does not know', () => {
    document.body.innerHTML =
      '<main><h2 data-datekey="nonsense">?</h2><p>Changed layout</p></main>';
    expect(annotate(document, settings)).toBe(0);
    expect(badges()).toHaveLength(0);
  });

  it('clear() removes every badge', () => {
    annotate(document, settings);
    clear(document);
    expect(badges()).toHaveLength(0);
  });
});
