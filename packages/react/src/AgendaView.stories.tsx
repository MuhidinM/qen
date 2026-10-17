import { date } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { AgendaView } from './AgendaView.js';

export const HolidaysAndFasts = () => (
  <AgendaView
    calendar="ethiopian"
    locale={en}
    start={date('ethiopian', 2019, 3, 1)}
    end={date('ethiopian', 2019, 8, 30)}
    holidays={['public', 'orthodox', 'islamic']}
  />
);
export const Empty = () => (
  <AgendaView
    calendar="ethiopian"
    locale={en}
    start={date('ethiopian', 2019, 2, 1)}
    end={date('ethiopian', 2019, 2, 30)}
  />
);
