import { describe, expect, it } from 'vitest';
import { fromEthiopianTime, toEthiopianTime, type EthiopianTimePeriod } from '../src/index.js';

describe('toEthiopianTime()', () => {
  // PLAN.md §5: ethHour = ((hour24 + 6) % 12) || 12
  it.each([
    [7, 0, 1, 'morning'],
    [6, 0, 12, 'morning'],
    [11, 59, 5, 'morning'],
    [12, 0, 6, 'afternoon'],
    [13, 0, 7, 'afternoon'],
    [17, 30, 11, 'afternoon'],
    [18, 0, 12, 'evening'],
    [23, 59, 5, 'evening'],
    [0, 0, 6, 'night'],
    [5, 45, 11, 'night'],
  ] as const)('%i:%i → %i (%s)', (hour, minute, ethHour, period) => {
    expect(toEthiopianTime({ hour, minute })).toEqual({ hour: ethHour, minute, period });
  });

  it('rejects impossible times', () => {
    expect(() => toEthiopianTime({ hour: 24, minute: 0 })).toThrow('Invalid time 24:00');
    expect(() => toEthiopianTime({ hour: 10, minute: 60 })).toThrow(RangeError);
    expect(() => toEthiopianTime({ hour: 1.5, minute: 0 })).toThrow(RangeError);
  });
});

describe('fromEthiopianTime()', () => {
  it('uses the period to tell 12 in the morning from 12 in the evening', () => {
    expect(fromEthiopianTime({ hour: 12, minute: 0, period: 'morning' })).toEqual({
      hour: 6,
      minute: 0,
    });
    expect(fromEthiopianTime({ hour: 12, minute: 0, period: 'evening' })).toEqual({
      hour: 18,
      minute: 0,
    });
    expect(fromEthiopianTime({ hour: 6, minute: 0, period: 'night' })).toEqual({
      hour: 0,
      minute: 0,
    });
    expect(fromEthiopianTime({ hour: 6, minute: 0, period: 'afternoon' })).toEqual({
      hour: 12,
      minute: 0,
    });
  });

  it('round-trips all 1,440 minutes of a day', () => {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute++) {
        expect(fromEthiopianTime(toEthiopianTime({ hour, minute }))).toEqual({ hour, minute });
      }
    }
  });

  it('rejects an hour that is not in the given period', () => {
    expect(() => fromEthiopianTime({ hour: 6, minute: 0, period: 'morning' })).toThrow(
      "6 o'clock Ethiopian time is not in the morning",
    );
    expect(() => fromEthiopianTime({ hour: 13, minute: 0, period: 'evening' })).toThrow(RangeError);
    expect(() =>
      fromEthiopianTime({ hour: 1, minute: 0, period: 'noon' as unknown as EthiopianTimePeriod }),
    ).toThrow(RangeError);
  });
});
