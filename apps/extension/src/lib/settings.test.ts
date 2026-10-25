import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, hijriSettings, sanitize } from './settings';

describe('sanitize', () => {
  it('fills defaults when nothing is stored', () => {
    expect(sanitize(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(DEFAULT_SETTINGS).toEqual({
      language: 'en',
      geez: false,
      calendar: 'ethiopian',
      hijri: 'ethiopia',
    });
  });

  it('keeps valid values and drops anything unknown or malformed', () => {
    expect(
      sanitize({ language: 'am', geez: true, calendar: 'hijri', hijri: 'tabular', extra: 1 }),
    ).toEqual({ language: 'am', geez: true, calendar: 'hijri', hijri: 'tabular' });
    expect(sanitize({ language: 'xx', geez: 'yes', calendar: 3, hijri: null })).toEqual(
      DEFAULT_SETTINGS,
    );
    expect(sanitize('not an object')).toEqual(DEFAULT_SETTINGS);
  });
});

describe('hijriSettings', () => {
  it('maps the choice to @qen/core options, Ethiopia confirmations by default', () => {
    expect(hijriSettings('tabular')).toEqual({ method: 'tabular' });
    expect(hijriSettings('umalqura')).toEqual({});
    expect(hijriSettings('ethiopia').overrides?.length).toBeGreaterThan(0);
  });
});
