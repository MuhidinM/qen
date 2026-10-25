import { useState } from 'react';
import { Tabs } from '@/components/Tabs';
import { useSettings } from '@/lib/use-settings';
import { ConvertPanel } from './ConvertPanel';
import { SettingsPanel } from './SettingsPanel';
import { TodayPanel } from './TodayPanel';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'convert', label: 'Convert' },
  { id: 'settings', label: 'Settings' },
] as const;
type Tab = (typeof TABS)[number]['id'];

/** The toolbar popup: today and upcoming holidays, a converter, and settings. */
export function Popup() {
  const [tab, setTab] = useState<Tab>('today');
  const [settings, update] = useSettings();

  return (
    <main className="popup">
      <h1 className="popup__title">Qen</h1>
      {settings === null ? (
        <p className="popup__loading">Loading…</p>
      ) : (
        <Tabs label="Qen" tabs={TABS} selected={tab} onSelect={setTab}>
          {tab === 'today' && <TodayPanel settings={settings} />}
          {tab === 'convert' && <ConvertPanel settings={settings} />}
          {tab === 'settings' && <SettingsPanel settings={settings} update={update} />}
        </Tabs>
      )}
    </main>
  );
}
