import { date } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { DateText } from './DateText.js';

const meskel = date('ethiopian', 2019, 1, 17);

export const Numeric = () => <DateText date={meskel} />;
export const English = () => <DateText date={meskel} locale={en} />;
export const AmharicGeez = () => <DateText date={meskel} locale={am} numerals="geez" />;
export const ArabicHijri = () => (
  <DateText date={date('hijri', 1447, 9, 1)} locale={ar} numerals="arabic" />
);
