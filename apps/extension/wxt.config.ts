import { defineConfig } from 'wxt';

// ADR-0017: the minimum permissions. A test (e2e/manifest.spec.ts) fails if the built
// manifests ask for anything more.
export const PERMISSIONS = ['storage', 'activeTab', 'contextMenus', 'scripting'];
export const HOST_PERMISSIONS = ['https://calendar.google.com/*'];

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Qen: Ethiopian, Hijri and Gregorian dates',
    short_name: 'Qen',
    description:
      'Today in the Ethiopian, Hijri and Gregorian calendars, a converter, upcoming holidays, and dates converted on request.',
    permissions: PERMISSIONS,
    host_permissions: HOST_PERMISSIONS,
    browser_specific_settings: {
      gecko: {
        id: 'qen@muhidinm.github.io',
        // Firefox asks new extensions to declare data collection; Qen collects none (R-EXT-04).
        // The key needs Firefox 140.
        strict_min_version: '140.0',
        data_collection_permissions: { required: ['none'] },
      },
      // Firefox for Android added the data-collection key in 142.
      gecko_android: { strict_min_version: '142.0' },
    },
  },
});
