// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from './settings';
import { readings, showTooltip, TOOLTIP_ID } from './tooltip';

const rect = { top: 100, left: 50, bottom: 120, right: 150, width: 100, height: 20 };
const host = () => document.getElementById(TOOLTIP_ID);
const text = () => host()?.shadowRoot?.textContent ?? '';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('readings', () => {
  it('reads a date in each calendar and gives all three', () => {
    const r = readings('1 Meskerem 2019', DEFAULT_SETTINGS);
    expect(r.kind).toBe('date');
    if (r.kind !== 'date') return;
    expect(r.rows.map((row) => row.text)).toEqual([
      'Friday, 11 September 2026 AD',
      'Friday, 1 Meskerem 2019 EC',
      'Friday, 29 Rabi al-Awwal 1448 AH',
    ]);
  });

  it('reads Gregorian and Hijri dates too', () => {
    const fromGregorian = readings('12 April 2026', DEFAULT_SETTINGS);
    const fromHijri = readings('24 Shawwal 1447', DEFAULT_SETTINGS);
    expect(fromHijri).toEqual(fromGregorian);
    if (fromHijri.kind !== 'date') return;
    expect(fromHijri.rows[1]?.text).toBe('Sunday, 4 Miyazia 2018 EC');
  });

  it('lists every reading of ambiguous text instead of guessing (ADR-0014)', () => {
    const r = readings('17/01/2019', DEFAULT_SETTINGS);
    expect(r.kind).toBe('ambiguous');
    if (r.kind !== 'ambiguous') return;
    expect(r.candidates.map((c) => c.label)).toEqual([
      '17 January 2019 AD',
      '17 Meskerem 2019 EC',
      '17 Muharram 2019 AH',
    ]);
  });

  it('says when the text is not a date, or a date that does not exist', () => {
    expect(readings('hello world', DEFAULT_SETTINGS).kind).toBe('none');
    const r = readings('6 Pagume 2018', DEFAULT_SETTINGS);
    expect(r).toEqual({ kind: 'none', message: 'Pagume 6 does not exist in 2018 EC' });
  });
});

describe('showTooltip', () => {
  it('shows the readings in an isolated, labelled dialog that takes focus', () => {
    showTooltip(document, '12 April 2026', DEFAULT_SETTINGS, rect);
    const dialog = host()?.shadowRoot?.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('aria-label')).toBe('Qen: converted date');
    expect(text()).toContain('Sunday, 4 Miyazia 2018 EC');
    expect(host()?.shadowRoot?.activeElement).toBe(dialog);
  });

  it('closes on Escape and on its button, and replaces an open one', () => {
    showTooltip(document, '12 April 2026', DEFAULT_SETTINGS, rect);
    showTooltip(document, '1 Meskerem 2019', DEFAULT_SETTINGS, rect);
    expect(document.querySelectorAll(`#${TOOLTIP_ID}`)).toHaveLength(1);
    expect(text()).toContain('11 September 2026');

    host()
      ?.shadowRoot?.querySelector('[role="dialog"]')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(host()).toBeNull();

    showTooltip(document, '1 Meskerem 2019', DEFAULT_SETTINGS, rect);
    host()?.shadowRoot?.querySelector<HTMLButtonElement>('button')?.click();
    expect(host()).toBeNull();
  });

  it('writes Arabic right to left, in the chosen language', () => {
    showTooltip(document, '1 Meskerem 2019', { ...DEFAULT_SETTINGS, language: 'ar' }, rect);
    const dates = host()?.shadowRoot?.querySelector('.qen-tooltip__dates');
    expect(dates?.getAttribute('dir')).toBe('rtl');
    expect(dates?.getAttribute('lang')).toBe('ar');
  });
});
