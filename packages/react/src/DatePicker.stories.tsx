import { date, type CalendarDate } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { useState } from 'react';
import { DatePicker } from './DatePicker.js';

export const Ethiopian = () => {
  const [value, setValue] = useState<CalendarDate | null>(date('ethiopian', 2019, 1, 17));
  return (
    <div>
      <DatePicker
        label="Start date"
        calendar="ethiopian"
        locale={en}
        value={value}
        onChange={setValue}
        secondary={['gregorian']}
      />
      <p>Value: {value ? JSON.stringify(value) : 'none'}</p>
    </div>
  );
};
export const AmharicGeez = () => (
  <DatePicker
    label="Start date"
    calendar="ethiopian"
    locale={am}
    locales={[am, en]}
    numerals="geez"
  />
);
export const HijriArabic = () => (
  <DatePicker label="Date" calendar="hijri" locale={ar} locales={[ar, en]} numerals="arabic" />
);
