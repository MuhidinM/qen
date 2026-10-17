import { gregorianToJDN } from './calendars/gregorian.js';
import { fromJDN } from './convert.js';
import type { CalendarDate, CalendarId, ConvertOptions } from './types.js';

/**
 * A place on Earth, in decimal degrees (north and east positive).
 *
 * @example
 * ```ts
 * const addis: GeoLocation = { latitude: 9.03, longitude: 38.74 };
 * ```
 */
export interface GeoLocation {
  /** Degrees north (negative for south), −90 to 90. */
  readonly latitude: number;
  /** Degrees east (negative for west), −180 to 180. */
  readonly longitude: number;
}

/**
 * When a calendar day starts, for functions that turn an instant into a date (ADR-0012).
 *
 * - `'traditional'` (default): Gregorian at 00:00, Ethiopian at 06:00, Hijri at sunset.
 * - `'midnight'`: every calendar at 00:00, the civil rule used by government systems and `Intl`.
 *
 * @example
 * ```ts
 * const boundary: DayBoundary = 'midnight';
 * ```
 */
export type DayBoundary = 'traditional' | 'midnight';

/**
 * Options for turning an instant into a calendar date.
 *
 * @example
 * ```ts
 * const opts: InstantOptions = { location: { latitude: 9.03, longitude: 38.74 } };
 * ```
 */
export interface InstantOptions extends ConvertOptions {
  /** Read the instant's wall-clock time in UTC instead of the runtime's local time zone. */
  readonly utc?: boolean;
  /** When each calendar's day starts; `'traditional'` by default (ADR-0012). */
  readonly boundary?: DayBoundary;
  /** Where to compute sunset for the Hijri boundary. Without it, sunset is taken as 18:00. */
  readonly location?: GeoLocation;
}

const ETHIOPIAN_DAY_START = 6 * 60; // 06:00, Ethiopian hour 12
const DEFAULT_SUNSET = 18 * 60;

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * Sunset on a civil date, in minutes after 00:00 UTC of that date, using the NOAA solar
 * calculator equations (sun's upper limb at the horizon with standard refraction, 90.833°).
 * Returns `NaN` where the sun does not set that day (polar summer or winter).
 *
 * @throws `RangeError` for latitudes outside ±90° or longitudes outside ±180°.
 */
export function sunsetUTCMinutes(jdn: number, location: GeoLocation): number {
  const { latitude, longitude } = location;
  if (!(Math.abs(latitude) <= 90) || !(Math.abs(longitude) <= 180)) {
    throw new RangeError(`Invalid location: latitude ${latitude}, longitude ${longitude}`);
  }
  // First estimate with the sun's position at noon UTC, then refine it at the estimated
  // sunset time (the declination moves enough during the day to matter at high latitudes).
  let minutes = sunsetAt(jdn, 720, latitude, longitude);
  for (let i = 0; i < 2 && !Number.isNaN(minutes); i++) {
    minutes = sunsetAt(jdn, minutes, latitude, longitude);
  }
  return minutes;
}

/** NOAA sunset, with the sun's position taken at `utcMinutes` after 00:00 UTC. */
function sunsetAt(jdn: number, utcMinutes: number, latitude: number, longitude: number): number {
  const jd = jdn - 0.5 + utcMinutes / 1440;
  const t = (jd - 2_451_545) / 36_525; // Julian centuries since J2000
  const l0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const c =
    Math.sin(rad(m)) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(rad(2 * m)) * (0.019993 - 0.000101 * t) +
    Math.sin(rad(3 * m)) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const lambda = l0 + c - 0.00569 - 0.00478 * Math.sin(rad(omega));
  const eps0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(rad(omega));
  const decl = Math.asin(Math.sin(rad(eps)) * Math.sin(rad(lambda)));
  const y = Math.tan(rad(eps / 2)) ** 2;
  const eqTime =
    4 *
    deg(
      y * Math.sin(2 * rad(l0)) -
        2 * e * Math.sin(rad(m)) +
        4 * e * y * Math.sin(rad(m)) * Math.cos(2 * rad(l0)) -
        0.5 * y * y * Math.sin(4 * rad(l0)) -
        1.25 * e * e * Math.sin(2 * rad(m)),
    );
  const cosHourAngle =
    Math.cos(rad(90.833)) / (Math.cos(rad(latitude)) * Math.cos(decl)) -
    Math.tan(rad(latitude)) * Math.tan(decl);
  if (Math.abs(cosHourAngle) > 1) return Number.NaN;
  return 720 - 4 * longitude - eqTime + 4 * deg(Math.acos(cosHourAngle));
}

/**
 * The calendar date an instant falls on, applying each calendar's day boundary (ADR-0012).
 * Internal: exposed publicly as `fromJSDate` and `today`.
 */
export function dayOf<C extends CalendarId>(
  instant: Date,
  calendar: C,
  options: InstantOptions = {},
): CalendarDate<C> {
  const { utc = false, boundary = 'traditional', location } = options;
  const [y, mo, d, h, mi, s] = utc
    ? [
        instant.getUTCFullYear(),
        instant.getUTCMonth() + 1,
        instant.getUTCDate(),
        instant.getUTCHours(),
        instant.getUTCMinutes(),
        instant.getUTCSeconds(),
      ]
    : [
        instant.getFullYear(),
        instant.getMonth() + 1,
        instant.getDate(),
        instant.getHours(),
        instant.getMinutes(),
        instant.getSeconds(),
      ];
  const jdn = gregorianToJDN(y, mo, d);
  const minutes = h * 60 + mi + s / 60;
  let shift = 0;
  if (boundary === 'traditional') {
    if (calendar === 'ethiopian' && minutes < ETHIOPIAN_DAY_START) shift = -1;
    if (calendar === 'hijri' && minutes >= sunsetLocalMinutes(jdn, instant, utc, location))
      shift = 1;
  }
  return fromJDN(jdn + shift, calendar, options);
}

/** Sunset in local wall-clock minutes, or 18:00 without a location or a sunset. */
function sunsetLocalMinutes(
  jdn: number,
  instant: Date,
  utc: boolean,
  location: GeoLocation | undefined,
): number {
  if (location === undefined) return DEFAULT_SUNSET;
  const sunset = sunsetUTCMinutes(jdn, location);
  if (Number.isNaN(sunset)) return DEFAULT_SUNSET;
  return sunset + (utc ? 0 : -instant.getTimezoneOffset());
}
