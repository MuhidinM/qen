/**
 * Part of the day in Ethiopian time. The clock restarts at 12 at 06:00 and at 18:00, so the
 * period tells, for example, 12 in the morning (06:00) from 12 in the evening (18:00).
 *
 * - `morning`: 06:00–11:59 (12, 1 … 5)
 * - `afternoon`: 12:00–17:59 (6 … 11)
 * - `evening`: 18:00–23:59 (12, 1 … 5)
 * - `night`: 00:00–05:59 (6 … 11)
 *
 * @example
 * ```ts
 * const p: EthiopianTimePeriod = 'evening';
 * ```
 */
export type EthiopianTimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

/** First international hour of each period. */
const PERIOD_START: Readonly<Record<EthiopianTimePeriod, number>> = {
  night: 0,
  morning: 6,
  afternoon: 12,
  evening: 18,
};

function checkTime(hour: number, minute: number, maxHour: number, minHour: number): void {
  if (
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    hour < minHour ||
    hour > maxHour ||
    minute < 0 ||
    minute > 59
  ) {
    throw new RangeError(`Invalid time ${hour}:${String(minute).padStart(2, '0')}`);
  }
}

/**
 * Converts international (24-hour) time to Ethiopian time, where the day's first hour
 * starts at 06:00: `ethiopianHour = ((hour + 6) % 12) || 12`.
 *
 * @throws `RangeError` for an impossible time.
 *
 * @example
 * ```ts
 * toEthiopianTime({ hour: 7, minute: 30 });  // { hour: 1, minute: 30, period: 'morning' }
 * toEthiopianTime({ hour: 18, minute: 0 });  // { hour: 12, minute: 0, period: 'evening' }
 * ```
 */
export function toEthiopianTime(time: { hour: number; minute: number }): {
  hour: number;
  minute: number;
  period: EthiopianTimePeriod;
} {
  const { hour, minute } = time;
  checkTime(hour, minute, 23, 0);
  const period: EthiopianTimePeriod =
    hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  return { hour: (hour + 6) % 12 || 12, minute, period };
}

/**
 * Converts Ethiopian time back to international (24-hour) time.
 *
 * @throws `RangeError` for an impossible time, an unknown period, or an hour that isn't in
 * the period (e.g. 6 o'clock in the morning: that is 12:00, in the afternoon).
 *
 * @example
 * ```ts
 * fromEthiopianTime({ hour: 12, minute: 0, period: 'evening' }); // { hour: 18, minute: 0 }
 * ```
 */
export function fromEthiopianTime(time: {
  hour: number;
  minute: number;
  period: EthiopianTimePeriod;
}): { hour: number; minute: number } {
  const { hour, minute, period } = time;
  checkTime(hour, minute, 12, 1);
  if (!Object.hasOwn(PERIOD_START, period)) {
    throw new RangeError(`Unknown period "${String(period)}"`);
  }
  const start = PERIOD_START[period];
  const hour12 = ((hour % 12) + 6) % 12; // international hour, modulo 12
  const hour24 = hour12 + (start >= 12 ? 12 : 0);
  if (hour24 < start || hour24 >= start + 6) {
    throw new RangeError(`${hour} o'clock Ethiopian time is not in the ${period}`);
  }
  return { hour: hour24, minute };
}
