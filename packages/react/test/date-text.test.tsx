import { render, screen } from '@testing-library/react';
import { date } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { describe, expect, it } from 'vitest';
import { DateText } from '../src/index.js';
import { expectNoAxeViolations } from './axe.js';

const meskel = date('ethiopian', 2019, 1, 17); // 27 September 2026

describe('<DateText>', () => {
  it('renders a <time> with the Gregorian ISO date as dateTime', () => {
    const { container } = render(<DateText date={meskel} />);
    const time = container.querySelector('time');
    expect(time?.getAttribute('datetime')).toBe('2026-09-27');
    expect(time?.textContent).toBe('17/1/2019');
  });

  it('formats with a locale, a pattern and numerals, and sets lang', () => {
    render(<DateText date={meskel} locale={en} />);
    expect(screen.getByText('17 Meskerem 2019 EC')).toHaveProperty('lang', 'en');
    render(<DateText date={meskel} locale={am} pattern="MMMM d y" numerals="geez" />);
    expect(screen.getByText('መስከረም ፲፯ ፳፻፲፱')).toHaveProperty('lang', 'am');
  });

  it('sets dir="rtl" for Arabic', () => {
    render(<DateText date={date('hijri', 1447, 9, 1)} locale={ar} numerals="arabic" />);
    const el = screen.getByText('١ رمضان ١٤٤٧ هـ');
    expect(el.getAttribute('dir')).toBe('rtl');
  });

  it('passes Hijri settings through', () => {
    const { container } = render(
      <DateText date={date('hijri', 1447, 9, 1)} hijri={{ offset: 1 }} />,
    );
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe('2026-02-19');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DateText date={meskel} locale={am} />);
    await expectNoAxeViolations(container);
  });
});
