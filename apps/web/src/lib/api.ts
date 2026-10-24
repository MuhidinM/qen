import model from '@/generated/api.json';

/** The API reference model built from the packages' type declarations (scripts/build-api.mjs). */
export interface ApiItem {
  name: string;
  entry: string;
  kind: 'function' | 'class' | 'interface' | 'type' | 'variable';
  summary: string;
  signatures: string[];
  params: { name: string; text: string }[];
  returns: string | null;
  throws: string[];
  examples: string[];
  deprecated: boolean;
}

export const API: Readonly<Record<'core' | 'react', { name: string; items: ApiItem[] }>> =
  model as Record<'core' | 'react', { name: string; items: ApiItem[] }>;

export type ApiPackage = keyof typeof API;

export const API_PACKAGES = Object.keys(API) as ApiPackage[];

export const KIND_TITLES: Readonly<Record<ApiItem['kind'], string>> = {
  function: 'Functions',
  class: 'Classes',
  interface: 'Interfaces',
  type: 'Types',
  variable: 'Values',
};

/** Where an export's entry lives: its package's reference page and its anchor. */
export function apiHref(name: string): string | null {
  for (const pkg of API_PACKAGES) {
    if (API[pkg].items.some((i) => i.name === name)) return `/docs/api/${pkg}#${name}`;
  }
  return null;
}
