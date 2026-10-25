import { date } from '@qen/core';
import { ethiopianHijriOverrides } from '@qen/core/overrides/ethiopia';
import { describe, expect, it } from 'vitest';
import { upcomingHolidays } from './upcoming';

const hijri = { overrides: ethiopianHijriOverrides };

describe('upcomingHolidays', () => {
  it('lists the next public holidays from today, with how many days away', () => {
    // 23 October 2026: next are Genna (7 Jan 2027, 76 days) and Timket (19 Jan 2027, since
    // 2019 EC began on 11 September; N-016).
    const next = upcomingHolidays(date('gregorian', 2026, 10, 23), { count: 2, hijri });
    expect(next.map((u) => [u.holiday.id, u.days])).toEqual([
      ['genna', 76],
      ['timket', 88],
    ]);
  });

  it('includes a holiday that is today, at 0 days', () => {
    const next = upcomingHolidays(date('gregorian', 2026, 9, 11), { count: 1, hijri });
    expect(next[0]?.holiday.id).toBe('enkutatash');
    expect(next[0]?.days).toBe(0);
  });

  it('can include Orthodox and Islamic observances', () => {
    const next = upcomingHolidays(date('gregorian', 2026, 10, 23), {
      count: 3,
      hijri,
      categories: ['public', 'orthodox', 'islamic'],
    });
    expect(next.map((u) => u.holiday.id)).toEqual(['isra-miraj', 'genna', 'timket']);
  });

  it('accepts today in any calendar', () => {
    const fromEthiopian = upcomingHolidays(date('ethiopian', 2019, 2, 13), { count: 1, hijri });
    expect(fromEthiopian[0]?.holiday.id).toBe('genna');
  });
});
