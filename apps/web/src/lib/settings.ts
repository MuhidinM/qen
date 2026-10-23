/**
 * Visitor preferences, kept in cookies so the server renders the same controls and theme the
 * visitor chose (no flash, no inline script under the nonce CSP). Shared by server and client.
 */
export const THEMES = ['system', 'light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

/** Languages for calendar content (N-032: the interface itself is English for now). */
export const DATE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ (Amharic)' },
  { code: 'om', label: 'Afaan Oromoo (Oromo)' },
  { code: 'ti', label: 'ትግርኛ (Tigrinya)' },
  { code: 'ar', label: 'العربية (Arabic)' },
] as const;
export type DateLanguage = (typeof DATE_LANGUAGES)[number]['code'];

export const COOKIES = { theme: 'qen-theme', language: 'qen-lang', geez: 'qen-geez' } as const;

export function parseTheme(value: string | undefined): Theme {
  return THEMES.find((t) => t === value) ?? 'system';
}

export function parseLanguage(value: string | undefined): DateLanguage {
  return DATE_LANGUAGES.find((l) => l.code === value)?.code ?? 'en';
}

export function parseGeez(value: string | undefined): boolean {
  return value === '1';
}

/** Client only: remember a preference for a year. */
export function savePreference(name: string, value: string): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
