import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { date, type CalendarDate } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { describe, expect, it, vi } from 'vitest';
import { CalendarGrid, type CalendarGridProps } from '../src/index.js';
import { expectNoAxeViolations } from './axe.js';

const today = date('ethiopian', 2019, 2, 7); // 17 Oct 2026

function setup(props: Partial<CalendarGridProps> = {}) {
  const onChange = vi.fn<(d: CalendarDate) => void>();
  const utils = render(
    <CalendarGrid
      calendar="ethiopian"
      locale={en}
      defaultMonth={{ year: 2019, month: 1 }}
      today={today}
      onChange={onChange}
      {...props}
    />,
  );
  return { ...utils, onChange, user: userEvent.setup() };
}
const cells = () => screen.getAllByRole('gridcell').filter((c) => c.textContent !== '');
const focused = () => document.activeElement?.getAttribute('aria-label');

describe('<CalendarGrid> structure', () => {
  it('shows the month as a labelled grid with weekday headers and one cell per day', () => {
    setup();
    const grid = screen.getByRole('grid', { name: 'Meskerem 2019' });
    expect(
      within(grid)
        .getAllByRole('columnheader')
        .map((h) => h.textContent),
    ).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    expect(cells()).toHaveLength(30);
    // Meskerem 1, 2019 is a Friday: five empty cells before it when weeks start on Sunday.
    const firstRow = within(grid).getAllByRole('row')[1];
    expect(
      within(firstRow as HTMLElement)
        .getAllByRole('gridcell')
        .map((c) => c.textContent),
    ).toEqual(['', '', '', '', '', '1', '2']);
  });

  it('starts weeks on Monday when asked', () => {
    setup({ weekStartsOn: 1 });
    expect(screen.getAllByRole('columnheader')[0]?.textContent).toBe('Mon');
  });

  it('shows Pagume with 5 or 6 days', () => {
    setup({ defaultMonth: { year: 2018, month: 13 } });
    expect(cells()).toHaveLength(5);
  });

  it('marks today, the selection, and keeps exactly one cell tabbable', () => {
    setup({ defaultMonth: { year: 2019, month: 2 }, value: date('ethiopian', 2019, 2, 10) });
    expect(
      screen
        .getByRole('gridcell', { name: 'Saturday, 7 Tikimt 2019' })
        .getAttribute('aria-current'),
    ).toBe('date');
    expect(
      screen
        .getByRole('gridcell', { name: 'Tuesday, 10 Tikimt 2019' })
        .getAttribute('aria-selected'),
    ).toBe('true');
    expect(screen.getAllByRole('gridcell').filter((c) => c.tabIndex === 0)).toHaveLength(1);
  });

  it('uses locale names, Ge’ez numerals and right-to-left layout', () => {
    const { unmount } = render(
      <CalendarGrid
        calendar="ethiopian"
        locale={am}
        numerals="geez"
        defaultMonth={{ year: 2019, month: 1 }}
        today={today}
      />,
    );
    expect(screen.getByRole('grid', { name: 'መስከረም ፳፻፲፱' })).toBeTruthy();
    expect(screen.getAllByRole('gridcell').some((c) => c.textContent === '፲፯')).toBe(true);
    unmount();
    const { container } = render(
      <CalendarGrid
        calendar="hijri"
        locale={ar}
        defaultMonth={{ year: 1447, month: 9 }}
        today={today}
      />,
    );
    expect(container.firstElementChild?.getAttribute('dir')).toBe('rtl');
  });

  it('follows the Hijri method for month length', () => {
    setup({ calendar: 'hijri', defaultMonth: { year: 1447, month: 9 } });
    expect(cells()).toHaveLength(30); // Ramadan 1447 under Umm al-Qura
  });

  it('has no accessibility violations', async () => {
    const { container } = setup({ value: date('ethiopian', 2019, 1, 17) });
    await expectNoAxeViolations(container);
  });
});

describe('<CalendarGrid> interaction', () => {
  it('selects a day with a click', async () => {
    const { user, onChange } = setup();
    await user.click(screen.getByRole('gridcell', { name: 'Sunday, 17 Meskerem 2019' }));
    expect(onChange).toHaveBeenCalledWith(date('ethiopian', 2019, 1, 17));
  });

  it('moves between months with the buttons, across the year end', async () => {
    const { user } = setup({ defaultMonth: { year: 2018, month: 13 } });
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'Meskerem 2019' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'Pagume 2018' })).toBeTruthy();
  });

  it('supports the arrow, Home/End and Enter keys', async () => {
    const { user, onChange } = setup({ value: date('ethiopian', 2019, 1, 17) });
    await user.tab(); // previous-month button
    await user.tab(); // next-month button
    await user.tab(); // the grid's one tabbable cell: the selected day
    expect(focused()).toBe('Sunday, 17 Meskerem 2019');
    await user.keyboard('{ArrowRight}');
    expect(focused()).toBe('Monday, 18 Meskerem 2019');
    await user.keyboard('{ArrowDown}');
    expect(focused()).toBe('Monday, 25 Meskerem 2019');
    await user.keyboard('{Home}');
    expect(focused()).toBe('Sunday, 24 Meskerem 2019');
    await user.keyboard('{End}');
    expect(focused()).toBe('Saturday, 30 Meskerem 2019');
    await user.keyboard('{ArrowUp}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(date('ethiopian', 2019, 1, 23));
  });

  it('changes month with PageUp/PageDown (clamping into Pagume) and year with Shift', async () => {
    const { user } = setup({
      defaultMonth: { year: 2018, month: 12 },
      value: date('ethiopian', 2018, 12, 30),
    });
    screen.getByRole('gridcell', { name: 'Saturday, 30 Nehase 2018' }).focus();
    await user.keyboard('{PageDown}');
    expect(focused()).toBe('Thursday, 5 Pagume 2018');
    expect(screen.getByRole('grid', { name: 'Pagume 2018' })).toBeTruthy();
    await user.keyboard('{Shift>}{PageDown}{/Shift}');
    expect(focused()).toMatch(/5 Pagume 2019$/);
    await user.keyboard('{PageUp}');
    expect(focused()).toMatch(/5 Nehase 2019$/);
  });

  it('moves across months with the arrows', async () => {
    const { user } = setup();
    screen.getByRole('gridcell', { name: 'Friday, 1 Meskerem 2019' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(focused()).toBe('Thursday, 5 Pagume 2018');
  });

  it('reverses left and right in right-to-left locales', async () => {
    const user = userEvent.setup();
    render(
      <CalendarGrid
        calendar="hijri"
        locale={ar}
        defaultMonth={{ year: 1447, month: 9 }}
        value={date('hijri', 1447, 9, 10)}
        today={today}
      />,
    );
    document.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement?.textContent).toBe('11');
  });

  it('does not select disabled days', async () => {
    const { user, onChange } = setup({ isDateDisabled: (d) => d.day === 17 });
    const cell = screen.getByRole('gridcell', { name: 'Sunday, 17 Meskerem 2019' });
    expect(cell.getAttribute('aria-disabled')).toBe('true');
    await user.click(cell);
    expect(onChange).not.toHaveBeenCalled();
  });
});
