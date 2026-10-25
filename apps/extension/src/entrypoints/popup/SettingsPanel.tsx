import {
  CALENDARS,
  HIJRI_CHOICES,
  LANGUAGES,
  type HijriChoice,
  type Language,
  type Settings,
} from '@/lib/settings';

/** Settings, saved in the browser's synced storage and applied everywhere in the extension. */
export function SettingsPanel({
  settings,
  update,
}: {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}) {
  return (
    <section aria-labelledby="settings-title" className="settings">
      <h2 id="settings-title" className="visually-hidden">
        Settings
      </h2>
      <label className="field">
        <span className="field__label">Show dates in</span>
        <select
          value={settings.language}
          onChange={(e) => update({ language: e.target.value as Language })}
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={settings.geez}
          onChange={(e) => update({ geez: e.target.checked })}
        />
        Ge’ez numerals
      </label>
      <label className="field">
        <span className="field__label">Convert from</span>
        <select
          value={settings.calendar}
          onChange={(e) =>
            update({ calendar: CALENDARS.find((c) => c.id === e.target.value)?.id ?? 'ethiopian' })
          }
        >
          {CALENDARS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field__label">Hijri dates</span>
        <select
          value={settings.hijri}
          onChange={(e) => update({ hijri: e.target.value as HijriChoice })}
        >
          {HIJRI_CHOICES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      <p className="settings__note">
        Saved in your browser and synced with your browser account. Nothing is sent anywhere else.
      </p>
    </section>
  );
}
