import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { date } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { describe, expect, it } from 'vitest';
import { CalendarGrid, type CalendarGridProps } from '../src/index.js';
import { expectNoAxeViolations } from './axe.js';

const today = date('ethiopian', 2019, 2, 7);
const meskel = 'Meskel (Finding of the True Cross)';
const enkutatash = 'Enkutatash (Ethiopian New Year)';

function setup(props: Partial<CalendarGridProps> = {}) {
  const utils = render(
    <CalendarGrid
      calendar="ethiopian"
      locale={en}
      defaultMonth={{ year: 2019, month: 1 }}
      today={today}
      {...props}
    />,
  );
  return { ...utils, user: userEvent.setup() };
}
const cell = (day: number) =>
  screen
    .getAllByRole('gridcell')
    .find((c) => c.getAttribute('aria-label')?.includes(` ${day} `)) as HTMLElement;
const markers = (el: HTMLElement) =>
  [...el.querySelectorAll<HTMLElement>('[data-category]')].map((m) => ({
    category: m.dataset.category,
    expected: m.dataset.expected === 'true',
  }));

describe('<CalendarGrid> secondary calendars', () => {
  it('shows the other calendar’s day number and names it in the cell label', () => {
    setup({ secondary: ['gregorian'] });
    const meskelCell = screen.getByRole('gridcell', {
      name: 'Sunday, 17 Meskerem 2019, 27 September 2026',
    });
    expect(within(meskelCell).getByText('27')).toBeTruthy();
    // Meskerem 2019 runs from 11 September to 10 October 2026.
    expect(screen.getByText('September – October 2026')).toBeTruthy();
  });

  it('shows two other calendars in order', () => {
    setup({ secondary: ['gregorian', 'hijri'] });
    expect(
      screen.getByRole('gridcell', {
        name: 'Sunday, 17 Meskerem 2019, 27 September 2026, 16 Rabi al-Thani 1448',
      }),
    ).toBeTruthy();
  });
});

describe('<CalendarGrid> holidays', () => {
  it('names holidays in the cell label and tooltip, after the other calendars', () => {
    setup({ secondary: ['gregorian'], holidays: ['public', 'orthodox'] });
    const c = screen.getByRole('gridcell', {
      name: `Sunday, 17 Meskerem 2019, 27 September 2026, ${meskel}`,
    });
    expect(c.getAttribute('title')).toBe(meskel);
    expect(markers(c)).toEqual([{ category: 'public', expected: false }]);
  });

  it('filters by category from the legend', async () => {
    const { user } = setup({ holidays: ['public', 'orthodox'] });
    const legend = screen.getByRole('group', { name: 'Holidays' });
    const publicBox = within(legend).getByRole('checkbox', { name: 'Public' });
    const orthodoxBox = within(legend).getByRole('checkbox', { name: 'Orthodox' });
    expect([publicBox, orthodoxBox].map((b) => (b as HTMLInputElement).checked)).toEqual([
      true,
      true,
    ]);
    expect(cell(1).getAttribute('aria-label')).toContain(enkutatash);

    await user.click(publicBox);
    expect(cell(1).getAttribute('aria-label')).not.toContain(enkutatash);
    expect(cell(17).getAttribute('aria-label')).toContain(meskel); // Meskel is also Orthodox
    expect(markers(cell(17))).toEqual([{ category: 'orthodox', expected: false }]);

    await user.click(orthodoxBox);
    expect(cell(17).getAttribute('aria-label')).toBe('Sunday, 17 Meskerem 2019');
    expect(cell(17).hasAttribute('title')).toBe(false);
  });

  it('marks expected and approximate Islamic dates in words and with an outline marker', () => {
    const { unmount } = setup({
      calendar: 'hijri',
      defaultMonth: { year: 1447, month: 10 },
      holidays: ['public', 'islamic'],
    });
    const eid = cell(1);
    expect(eid.getAttribute('aria-label')).toBe('Friday, 1 Shawwal 1447, Eid al-Fitr (expected)');
    expect(markers(eid)).toEqual([{ category: 'public', expected: true }]);
    expect(screen.getByText('Outline: date not yet confirmed')).toBeTruthy();
    unmount();

    setup({ calendar: 'hijri', defaultMonth: { year: 1447, month: 9 }, holidays: ['islamic'] });
    expect(cell(27).getAttribute('aria-label')).toMatch(
      /, Laylat al-Qadr \(expected, approximate\)$/,
    );
  });

  it('shows no legend without holiday categories', () => {
    setup();
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('has no accessibility violations with other calendars and holidays', async () => {
    const { container } = setup({
      secondary: ['gregorian', 'hijri'],
      holidays: ['public', 'orthodox', 'islamic'],
      value: date('ethiopian', 2019, 1, 17),
    });
    await expectNoAxeViolations(container);
  });
});
