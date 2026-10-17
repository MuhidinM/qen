import { describe, expect, it } from 'vitest';
import { date } from '../src/index.js';
import { gregorianToJDN as g } from '../src/calendars/gregorian.js';
import { dayOf, sunsetUTCMinutes } from '../src/day-boundary.js';

const ADDIS = { latitude: 9.03, longitude: 38.74 };
const MECCA = { latitude: 21.4225, longitude: 39.8262 };
const LONDON = { latitude: 51.5072, longitude: -0.1276 };
const utc = (iso: string) => new Date(`${iso}Z`);

describe('Ethiopian days start at 06:00 (ADR-0012)', () => {
  it('keeps the previous Ethiopian date before dawn', () => {
    // 13 Oct 2026 = Tikimt 3, 2019 EC; 14 Oct = Tikimt 4.
    expect(dayOf(utc('2026-10-14T03:00'), 'ethiopian', { utc: true })).toEqual(
      date('ethiopian', 2019, 2, 3),
    );
    expect(dayOf(utc('2026-10-14T05:59'), 'ethiopian', { utc: true })).toEqual(
      date('ethiopian', 2019, 2, 3),
    );
    expect(dayOf(utc('2026-10-14T06:00'), 'ethiopian', { utc: true })).toEqual(
      date('ethiopian', 2019, 2, 4),
    );
    expect(dayOf(utc('2026-10-14T23:59'), 'ethiopian', { utc: true })).toEqual(
      date('ethiopian', 2019, 2, 4),
    );
  });

  it('crosses the Ethiopian new year at 06:00 on 11 September', () => {
    expect(dayOf(utc('2026-09-11T05:00'), 'ethiopian', { utc: true })).toEqual(
      date('ethiopian', 2018, 13, 5),
    );
    expect(dayOf(utc('2026-09-11T07:00'), 'ethiopian', { utc: true })).toEqual(
      date('ethiopian', 2019, 1, 1),
    );
  });

  it('uses local wall-clock time unless utc is set', () => {
    const local = new Date(2026, 9, 14, 3, 0); // 03:00 local, whatever the runtime's zone
    expect(dayOf(local, 'ethiopian')).toEqual(date('ethiopian', 2019, 2, 3));
    expect(dayOf(new Date(2026, 9, 14, 6, 0), 'ethiopian')).toEqual(date('ethiopian', 2019, 2, 4));
  });
});

describe('Hijri days start at sunset (ADR-0012)', () => {
  // 17 Feb 2026 is the last day of Sha'ban 1447; 18 Feb = 1 Ramadan 1447 (Umm al-Qura).
  const ramadan1 = date('hijri', 1447, 9, 1);

  it('uses 18:00 local when no location is given', () => {
    expect(dayOf(utc('2026-02-17T17:59'), 'hijri', { utc: true })).not.toEqual(ramadan1);
    expect(dayOf(utc('2026-02-17T18:00'), 'hijri', { utc: true })).toEqual(ramadan1);
  });

  it('uses the computed sunset when a location is given', () => {
    // With utc: true the wall clock is UTC, so compare against the UTC sunset minute.
    const opts = { utc: true, location: ADDIS } as const;
    const sunset = sunsetUTCMinutes(g(2026, 2, 17), ADDIS);
    const before = new Date(Date.UTC(2026, 1, 17, 0, Math.floor(sunset) - 1));
    const after = new Date(Date.UTC(2026, 1, 17, 0, Math.ceil(sunset) + 1));
    expect(dayOf(before, 'hijri', opts)).not.toEqual(ramadan1);
    expect(dayOf(after, 'hijri', opts)).toEqual(ramadan1);
  });

  it('falls back to 18:00 where the sun does not set (polar summer)', () => {
    const tromso = { latitude: 69.65, longitude: 18.96 };
    expect(sunsetUTCMinutes(g(2026, 6, 21), tromso)).toBeNaN();
    expect(dayOf(utc('2026-06-21T17:59'), 'hijri', { utc: true, location: tromso })).toEqual(
      dayOf(utc('2026-06-21T12:00'), 'hijri', { utc: true }),
    );
  });
});

describe("boundary: 'midnight'", () => {
  it('uses the civil midnight rule for every calendar', () => {
    const opts = { utc: true, boundary: 'midnight' } as const;
    expect(dayOf(utc('2026-10-14T03:00'), 'ethiopian', opts)).toEqual(
      date('ethiopian', 2019, 2, 4),
    );
    expect(dayOf(utc('2026-02-17T23:00'), 'hijri', opts)).not.toEqual(date('hijri', 1447, 9, 1));
    expect(dayOf(utc('2026-02-18T00:00'), 'hijri', opts)).toEqual(date('hijri', 1447, 9, 1));
  });

  it('never changes the Gregorian rule', () => {
    expect(dayOf(utc('2026-10-14T03:00'), 'gregorian', { utc: true })).toEqual(
      date('gregorian', 2026, 10, 14),
    );
    expect(dayOf(utc('2026-10-13T23:59'), 'gregorian', { utc: true })).toEqual(
      date('gregorian', 2026, 10, 13),
    );
  });
});

describe('sunsetUTCMinutes() (NOAA solar algorithm)', () => {
  const minutesOf = (hms: string) => {
    const [h = 0, m = 0, sec = 0] = hms.split(':').map(Number);
    return h * 60 + m + sec / 60;
  };

  // Primary reference: Open-Meteo forecast API (api.open-meteo.com, daily=sunset, GMT, read
  // 2026-10-17). It truncates to the minute, so ours must fall inside that minute (±0.5 min slack).
  it.each([
    ['Addis Ababa', ADDIS, [2026, 10, 17], '15:07'],
    ['Addis Ababa', ADDIS, [2026, 10, 24], '15:04'],
    ['Addis Ababa', ADDIS, [2026, 10, 30], '15:03'],
    ['Mecca', MECCA, [2026, 10, 17], '14:54'],
    ['Mecca', MECCA, [2026, 10, 24], '14:49'],
    ['Mecca', MECCA, [2026, 10, 30], '14:45'],
    ['London', LONDON, [2026, 10, 17], '17:03'],
    ['London', LONDON, [2026, 10, 24], '16:48'],
    ['London', LONDON, [2026, 10, 30], '16:37'],
  ] as const)('%s %j: sunset in the minute %s UTC (Open-Meteo)', (_, loc, [y, m, d], hm) => {
    const ours = sunsetUTCMinutes(g(y, m, d), loc);
    expect(ours).toBeGreaterThanOrEqual(minutesOf(hm) - 0.5);
    expect(ours).toBeLessThan(minutesOf(hm) + 1.5);
  });

  // Second reference across the seasons: sunrise-sunset.org (api.sunrise-sunset.org, read
  // 2026-10-17). It runs 1–2.3 minutes later than Open-Meteo and NOAA's equations, so the
  // tolerance is 2.5 minutes (N-028).
  it.each([
    ['Addis Ababa', ADDIS, [2026, 1, 15], '15:25:09'],
    ['Addis Ababa', ADDIS, [2026, 3, 20], '15:36:55'],
    ['Addis Ababa', ADDIS, [2026, 6, 21], '15:47:29'],
    ['Addis Ababa', ADDIS, [2026, 12, 21], '15:12:08'],
    ['Mecca', MECCA, [2026, 1, 15], '15:00:23'],
    ['Mecca', MECCA, [2026, 3, 20], '15:32:46'],
    ['Mecca', MECCA, [2026, 6, 21], '16:06:53'],
    ['Mecca', MECCA, [2026, 12, 21], '14:44:46'],
    ['London', LONDON, [2026, 1, 15], '16:22:38'],
    ['London', LONDON, [2026, 3, 20], '18:14:49'],
    ['London', LONDON, [2026, 6, 21], '20:23:44'],
    ['London', LONDON, [2026, 12, 21], '15:55:33'],
  ] as const)(
    '%s %j: sunset %s UTC within 2.5 minutes (sunrise-sunset.org)',
    (_, loc, [y, m, d], hms) => {
      expect(Math.abs(sunsetUTCMinutes(g(y, m, d), loc) - minutesOf(hms))).toBeLessThanOrEqual(2.5);
    },
  );

  it('rejects impossible coordinates', () => {
    expect(() => sunsetUTCMinutes(g(2026, 1, 1), { latitude: 91, longitude: 0 })).toThrow(
      RangeError,
    );
    expect(() => sunsetUTCMinutes(g(2026, 1, 1), { latitude: 0, longitude: 181 })).toThrow(
      RangeError,
    );
  });
});
