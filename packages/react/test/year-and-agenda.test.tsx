import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { date } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { describe, expect, it, vi } from 'vitest';
import { AgendaView, YearView } from '../src/index.js';
import { expectNoAxeViolations } from './axe.js';

const today = date('ethiopian', 2019, 2, 7);

describe('<YearView>', () => {
  it('shows 13 Ethiopian months or 12 Hijri months as buttons', () => {
    const { unmount } = render(
      <YearView calendar="ethiopian" locale={en} year={2019} today={today} />,
    );
    const months = within(screen.getByRole('region', { name: '2019' })).getAllByRole('button');
    expect(months).toHaveLength(13);
    expect(months[0]?.getAttribute('aria-label')).toBe('Meskerem 2019');
    expect(months[12]?.getAttribute('aria-label')).toBe('Pagume 2019');
    unmount();
    render(<YearView calendar="hijri" locale={en} year={1447} today={today} />);
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });

  it('marks the current month and reports the chosen month', async () => {
    const onSelectMonth = vi.fn();
    render(
      <YearView
        calendar="ethiopian"
        locale={en}
        year={2019}
        today={today}
        onSelectMonth={onSelectMonth}
      />,
    );
    const tikimt = screen.getByRole('button', { name: 'Tikimt 2019' });
    expect(tikimt.getAttribute('aria-current')).toBe('date');
    await userEvent.setup().click(tikimt);
    expect(onSelectMonth).toHaveBeenCalledWith({ year: 2019, month: 2 });
  });

  it('counts holidays per month in the month’s name', () => {
    render(
      <YearView calendar="ethiopian" locale={en} year={2019} today={today} holidays={['public']} />,
    );
    expect(screen.getByRole('button', { name: 'Meskerem 2019, 2 holidays' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Tahsas 2019, 1 holiday' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Pagume 2019' })).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <YearView calendar="ethiopian" locale={en} year={2019} today={today} holidays={['public']} />,
    );
    await expectNoAxeViolations(container);
  });
});

describe('<AgendaView>', () => {
  const props = {
    calendar: 'ethiopian' as const,
    locale: en,
    start: date('ethiopian', 2019, 3, 1),
    end: date('ethiopian', 2019, 4, 30),
  };

  it('lists holidays and observances in order, with category and status in words', () => {
    render(<AgendaView {...props} holidays={['public', 'orthodox', 'islamic']} />);
    const items = within(screen.getByRole('list', { name: 'Holidays and observances' }))
      .getAllByRole('listitem')
      .map((li) => li.textContent);
    expect(items).toEqual([
      "Tue 15 Hidar 2019 – Wed 28 Tahsas 2019Tsome Nebiyat (Prophets' Fast)Orthodox",
      "Tue 27 Tahsas 2019Isra and Mi'rajIslamic · expected",
      'Thu 29 Tahsas 2019Genna (Ethiopian Christmas)Public',
    ]);
  });

  it('shows dates in the chosen calendar', () => {
    render(
      <AgendaView {...props} calendar="gregorian" holidays={['public']} observances={false} />,
    );
    expect(screen.getByRole('listitem').textContent).toBe(
      'Thu 7 January 2027Genna (Ethiopian Christmas)Public',
    );
  });

  it('says so when nothing falls in the range', () => {
    render(
      <AgendaView
        {...props}
        start={date('ethiopian', 2019, 2, 1)}
        end={date('ethiopian', 2019, 2, 30)}
      />,
    );
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByText('No holidays between 1 Tikimt 2019 and 30 Tikimt 2019.')).toBeTruthy();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <AgendaView {...props} holidays={['public', 'orthodox', 'islamic']} />,
    );
    await expectNoAxeViolations(container);
  });
});
