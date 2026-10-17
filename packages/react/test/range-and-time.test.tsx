import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { date, type ClockTime } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { describe, expect, it, vi } from 'vitest';
import {
  DateRangePicker,
  EthiopianTimeInput,
  type DateRange,
  type DateRangePickerProps,
} from '../src/index.js';
import { expectNoAxeViolations } from './axe.js';

const today = date('ethiopian', 2019, 2, 7);
const day = (d: number) => date('ethiopian', 2019, 1, d);

function setupRange(props: Partial<DateRangePickerProps> = {}) {
  const onChange = vi.fn<(r: DateRange) => void>();
  const utils = render(
    <DateRangePicker
      label="Trip"
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
const cell = (name: string) => screen.getByRole('gridcell', { name });
const selectedDays = () =>
  screen
    .getAllByRole('gridcell')
    .filter((c) => c.getAttribute('aria-selected') === 'true')
    .map((c) => c.textContent);

describe('<DateRangePicker>', () => {
  it('is a labelled group with a multi-select grid and a live summary', () => {
    setupRange();
    const group = screen.getByRole('group', { name: 'Trip' });
    expect(within(group).getByRole('grid').getAttribute('aria-multiselectable')).toBe('true');
    expect(within(group).getByRole('status').textContent).toBe('Choose the first day');
  });

  it('selects a start then an end with clicks, in either order', async () => {
    const { user, onChange } = setupRange();
    await user.click(cell('Sunday, 17 Meskerem 2019'));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe('17 Meskerem 2019 – choose the last day');
    await user.click(cell('Wednesday, 13 Meskerem 2019')); // before the start: swapped
    expect(onChange).toHaveBeenLastCalledWith({ start: day(13), end: day(17) });
    expect(selectedDays()).toEqual(['13', '14', '15', '16', '17']);
    expect(screen.getByRole('status').textContent).toBe('13 Meskerem 2019 – 17 Meskerem 2019');
    // A third pick starts a new range.
    await user.click(cell('Saturday, 23 Meskerem 2019'));
    expect(selectedDays()).toEqual(['23']);
  });

  it('works from the keyboard, across a month boundary', async () => {
    const { user, onChange } = setupRange({ defaultValue: { start: day(28), end: day(28) } });
    cell('Tuesday, 28 Meskerem 2019').focus();
    await user.keyboard('{Enter}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith({
      start: day(28),
      end: date('ethiopian', 2019, 2, 5),
    });
  });

  it('follows a controlled value', () => {
    const { rerender } = setupRange({ value: { start: day(1), end: day(3) } });
    expect(selectedDays()).toEqual(['1', '2', '3']);
    rerender(
      <DateRangePicker
        label="Trip"
        calendar="ethiopian"
        locale={en}
        defaultMonth={{ year: 2019, month: 1 }}
        value={{ start: day(5), end: day(6) }}
      />,
    );
    expect(selectedDays()).toEqual(['5', '6']);
  });

  it('has no accessibility violations', async () => {
    const { container } = setupRange({ defaultValue: { start: day(13), end: day(17) } });
    await expectNoAxeViolations(container);
  });
});

describe('<EthiopianTimeInput>', () => {
  function setupTime(value?: ClockTime) {
    const onChange = vi.fn<(t: ClockTime) => void>();
    const utils = render(
      <EthiopianTimeInput
        label="Meeting time"
        locale={en}
        onChange={onChange}
        {...(value ? { defaultValue: value } : {})}
      />,
    );
    const group = screen.getByRole('group', { name: 'Meeting time' });
    return {
      ...utils,
      onChange,
      user: userEvent.setup(),
      hour: within(group).getByRole('spinbutton', { name: 'Hour' }) as HTMLInputElement,
      minute: within(group).getByRole('spinbutton', { name: 'Minute' }) as HTMLInputElement,
      period: within(group).getByRole('combobox', { name: 'Period' }) as HTMLSelectElement,
    };
  }

  it('shows a clock time in Ethiopian time with the period and the 24-hour equivalent', () => {
    const { hour, minute, period } = setupTime({ hour: 18, minute: 30 });
    expect([hour.value, minute.value, period.value]).toEqual(['12', '30', 'evening']);
    expect([...period.options].map((o) => o.textContent)).toEqual([
      'in the morning',
      'in the afternoon',
      'in the evening',
      'at night',
    ]);
    expect(screen.getByText('18:30')).toBeTruthy();
  });

  it('reports the clock time as the fields change', async () => {
    const { user, hour, minute, period, onChange } = setupTime({ hour: 7, minute: 0 });
    await user.selectOptions(period, 'afternoon');
    expect(onChange).not.toHaveBeenCalled(); // 1 o'clock is not in the afternoon
    await user.clear(hour);
    await user.type(hour, '6');
    expect(onChange).toHaveBeenLastCalledWith({ hour: 12, minute: 0 });
    await user.clear(minute);
    await user.type(minute, '45');
    expect(onChange).toHaveBeenLastCalledWith({ hour: 12, minute: 45 });
    expect(screen.getByText('12:45')).toBeTruthy();
  });

  it('explains an hour that is not in the period', async () => {
    const { user, period, hour } = setupTime({ hour: 7, minute: 0 });
    await user.selectOptions(period, 'afternoon');
    expect(hour.getAttribute('aria-invalid')).toBe('true');
    const id = hour.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(id)?.textContent).toBe(
      "1 o'clock Ethiopian time is not in the afternoon",
    );
  });

  it('limits the hour to 1–12 and the minute to 0–59', () => {
    const { hour, minute } = setupTime({ hour: 7, minute: 0 });
    expect([hour.min, hour.max, minute.min, minute.max]).toEqual(['1', '12', '0', '59']);
  });

  it('has no accessibility violations', async () => {
    const { container } = setupTime({ hour: 18, minute: 30 });
    await expectNoAxeViolations(container);
  });
});
