import { afterEach, describe, expect, it, vi } from 'vitest';
import { date, today } from '../src/index.js';

describe('today()', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses `now` when given, with day boundaries (ADR-0012)', () => {
    const now = new Date('2026-10-14T03:00:00Z');
    expect(today('gregorian', { now, utc: true })).toEqual(date('gregorian', 2026, 10, 14));
    expect(today('ethiopian', { now, utc: true })).toEqual(date('ethiopian', 2019, 2, 3)); // before 06:00
    expect(today('ethiopian', { now, utc: true, boundary: 'midnight' })).toEqual(
      date('ethiopian', 2019, 2, 4),
    );
    expect(today('hijri', { now: new Date('2026-02-17T18:30:00Z'), utc: true })).toEqual(
      date('hijri', 1447, 9, 1),
    );
  });

  it('reads the system clock only when `now` is omitted', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-11T09:00:00Z'));
    expect(today('ethiopian', { utc: true })).toEqual(date('ethiopian', 2019, 1, 1));
    expect(today('gregorian', { utc: true })).toEqual(date('gregorian', 2026, 9, 11));
  });

  it('honours the Hijri method', () => {
    const now = new Date('2026-10-17T09:00:00Z');
    expect(today('hijri', { now, utc: true })).toEqual(date('hijri', 1448, 5, 6));
    expect(today('hijri', { now, utc: true, hijri: { method: 'tabular' } })).toEqual(
      date('hijri', 1448, 5, 5),
    );
  });

  it('rejects an invalid `now`', () => {
    expect(() => today('gregorian', { now: new Date(Number.NaN) })).toThrow(RangeError);
  });
});
