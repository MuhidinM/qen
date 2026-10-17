import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { date, type CalendarDate } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { describe, expect, it, vi } from 'vitest';
import { DatePicker, type DatePickerProps } from '../src/index.js';
import { expectNoAxeViolations } from './axe.js';

const today = date('ethiopian', 2019, 2, 7);
const meskel = date('ethiopian', 2019, 1, 17);

function setup(props: Partial<DatePickerProps> = {}) {
  const onChange = vi.fn<(d: CalendarDate | null) => void>();
  const utils = render(
    <div>
      <DatePicker
        label="Start date"
        calendar="ethiopian"
        locale={en}
        today={today}
        onChange={onChange}
        {...props}
      />
      <button type="button">Outside</button>
    </div>,
  );
  const input = () => screen.getByRole('textbox', { name: 'Start date' }) as HTMLInputElement;
  const opener = () => screen.getByRole('button', { name: 'Choose date' });
  return { ...utils, onChange, input, opener, user: userEvent.setup() };
}
const focused = () => document.activeElement;

describe('<DatePicker> text entry', () => {
  it('reads typed text with parse() and shows it formatted', async () => {
    const { user, input, onChange } = setup();
    await user.type(input(), 'Meskerem 17, 2019{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(meskel);
    expect(input().value).toBe('17 Meskerem 2019');
  });

  it('converts a date typed in another calendar', async () => {
    const { user, input, onChange } = setup();
    await user.type(input(), '27 September 2026');
    await user.tab(); // commits on blur too
    expect(onChange).toHaveBeenLastCalledWith(meskel);
    expect(input().value).toBe('17 Meskerem 2019');
  });

  it('asks which date was meant when the calendar is ambiguous', async () => {
    const { user, input, onChange } = setup();
    await user.type(input(), '17/1/2019{Enter}');
    expect(onChange).not.toHaveBeenCalled();
    const choices = screen.getByRole('group', { name: 'Which date did you mean?' });
    const buttons = [...choices.querySelectorAll('button')].map((b) => b.textContent);
    expect(buttons).toEqual(['17 January 2019 AD', '17 Meskerem 2019 EC', '17 Muharram 2019 AH']);
    await user.click(screen.getByRole('button', { name: '17 Meskerem 2019 EC' }));
    expect(onChange).toHaveBeenLastCalledWith(meskel);
    expect(screen.queryByRole('group')).toBeNull();
    expect(input().value).toBe('17 Meskerem 2019');
  });

  it('flags unreadable text without changing the value', async () => {
    const { user, input, onChange } = setup({ defaultValue: meskel });
    await user.clear(input());
    await user.type(input(), 'hello{Enter}');
    expect(onChange).not.toHaveBeenCalled();
    expect(input().getAttribute('aria-invalid')).toBe('true');
    const errorId = input().getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(errorId)?.textContent).toBe(
      'Could not read a date from "hello"',
    );
  });

  it('clears the value when the text is emptied', async () => {
    const { user, input, onChange } = setup({ defaultValue: meskel });
    await user.clear(input());
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  it('follows a controlled value', () => {
    const { rerender, input } = setup({ value: meskel });
    expect(input().value).toBe('17 Meskerem 2019');
    rerender(
      <DatePicker
        label="Start date"
        calendar="ethiopian"
        locale={en}
        value={date('ethiopian', 2019, 1, 1)}
      />,
    );
    expect(input().value).toBe('1 Meskerem 2019');
  });
});

describe('<DatePicker> calendar dialog', () => {
  it('opens a modal dialog focused on the selected day; Escape closes it', async () => {
    const { user, opener, onChange } = setup({ defaultValue: meskel });
    await user.click(opener());
    const dialog = screen.getByRole('dialog', { name: 'Start date' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(opener().getAttribute('aria-expanded')).toBe('true');
    expect(focused()?.getAttribute('aria-label')).toBe('Sunday, 17 Meskerem 2019');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(focused()).toBe(opener());
    expect(onChange).not.toHaveBeenCalled();
  });

  it('picks a day with the keyboard, closes, and returns focus', async () => {
    const { user, opener, input, onChange } = setup();
    opener().focus();
    await user.keyboard('{Enter}');
    expect(focused()?.getAttribute('aria-label')).toBe('Saturday, 7 Tikimt 2019'); // today
    await user.keyboard('{ArrowRight}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(date('ethiopian', 2019, 2, 8));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(focused()).toBe(opener());
    expect(input().value).toBe('8 Tikimt 2019');
  });

  it('keeps Tab inside the dialog', async () => {
    const { user, opener } = setup();
    await user.click(opener());
    await user.tab(); // from the day: wraps to the first control
    expect(focused()).toBe(screen.getByRole('button', { name: 'Previous month' }));
    await user.tab({ shift: true }); // and back around to the day
    expect(focused()?.getAttribute('aria-label')).toBe('Saturday, 7 Tikimt 2019');
  });

  it('closes when clicking outside', async () => {
    const { user, opener } = setup();
    await user.click(opener());
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('has no accessibility violations, closed or open', async () => {
    const { user, container, opener } = setup({ defaultValue: meskel });
    await expectNoAxeViolations(container);
    await user.click(opener());
    await expectNoAxeViolations(container);
  });
});
