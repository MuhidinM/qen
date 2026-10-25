import { fileURLToPath } from 'node:url';
import { defineConfig } from 'wxt';

// ADR-0017: the minimum permissions. A test (e2e/manifest.spec.ts) fails if the built
// manifests ask for anything more.
export const PERMISSIONS = ['storage', 'activeTab', 'contextMenus', 'scripting'];
export const HOST_PERMISSIONS = ['https://calendar.google.com/*'];

/** The keyboard command that converts the selection; users can change the keys. */
export const COMMANDS = {
  'convert-selection': {
    suggested_key: { default: 'Alt+Shift+Q' },
    description: 'Convert the selected date',
  },
};

// e2e builds (`wxt build --mode e2e`, in .output/*-e2e) may also script the test page's host,
// which stands in for the activeTab grant a real click gives. Store builds never include it.
const E2E_HOSTS = ['http://qen.test/*'];

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  // Firefox reviewers rebuild from the sources zip, which needs the workspace packages, so it is
  // rooted at the monorepo. notes/ (private, gitignored) and anything not needed to build stay out.
  zip: {
    sourcesRoot: fileURLToPath(new URL('../..', import.meta.url)),
    includeSources: ['**/*', '.nvmrc'],
    excludeSources: [
      'notes/**',
      'apps/web/**',
      'docs/**',
      '.github/**',
      '.changeset/**',
      '**/dist/**',
      '**/coverage/**',
      '**/test-results/**',
      '**/.turbo/**',
      '**/.wxt/**',
      '**/e2e/**',
      '**/test/**',
      '**/store/**',
      '**/__fixtures__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
    ],
  },
  manifest: ({ mode }) => ({
    name: 'Qen: Ethiopian, Hijri and Gregorian dates',
    short_name: 'Qen',
    description:
      'Today in the Ethiopian, Hijri and Gregorian calendars, a converter, upcoming holidays, and dates converted on request.',
    permissions: PERMISSIONS,
    host_permissions: mode === 'e2e' ? [...HOST_PERMISSIONS, ...E2E_HOSTS] : HOST_PERMISSIONS,
    commands: COMMANDS,
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
  }),
});
