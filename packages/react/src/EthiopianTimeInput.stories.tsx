import type { ClockTime } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { en } from '@qen/core/locales/en';
import { useState } from 'react';
import { EthiopianTimeInput } from './EthiopianTimeInput.js';

export const English = () => {
  const [time, setTime] = useState<ClockTime>({ hour: 18, minute: 30 });
  return (
    <div>
      <EthiopianTimeInput label="Meeting time" locale={en} value={time} onChange={setTime} />
      <p>Value: {JSON.stringify(time)}</p>
    </div>
  );
};
export const Amharic = () => (
  <EthiopianTimeInput label="Meeting time" locale={am} defaultValue={{ hour: 7, minute: 0 }} />
);
