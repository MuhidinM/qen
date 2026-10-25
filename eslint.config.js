import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/.turbo/**',
      '**/docs-api/**',
      '**/build/**',
      '**/.next/**',
      '**/next-env.d.ts',
      '**/.lighthouseci/**',
      '**/public/sandbox/**',
      '**/.output/**',
      '**/.wxt/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  prettier,
  {
    // React components (ADR-0015): rules of hooks and accessibility checks.
    files: ['packages/react/**/*.tsx', 'apps/web/**/*.tsx', 'apps/extension/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: { ...reactHooks.configs.recommended.rules, ...jsxA11y.configs.strict.rules },
  },
  {
    // Website (ADR-0016): Next.js rules, including Core Web Vitals.
    files: ['apps/web/**/*.{ts,tsx}'],
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
    settings: { next: { rootDir: 'apps/web' } },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      // Packages are used only through their public entry points (docs/architecture.md).
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@qen/*/src', '@qen/*/src/**'],
              message: 'Import the package entry point, not its src/.',
            },
          ],
        },
      ],
    },
  },
  {
    // core has zero dependencies and no environment access (ADR-0004).
    files: ['packages/core/src/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?!\\.)',
              message: '@qen/core has zero dependencies: only relative imports are allowed.',
            },
          ],
        },
      ],
    },
  },
  {
    // Locales are separate entry points, so the main entry must never import them (R-FMT-03).
    files: ['packages/core/src/**/*.ts'],
    ignores: ['packages/core/src/locales/**', 'packages/core/src/overrides/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^(?!\\.)',
              message: '@qen/core has zero dependencies: only relative imports are allowed.',
            },
            {
              group: ['**/locales/*', '**/overrides/*'],
              message:
                'Locales and override data are separate entry points; the main entry must not import them.',
            },
          ],
        },
      ],
    },
  },
  {
    // No hidden clock reads in core: "now" is an argument; today() is the only exception.
    files: ['packages/core/src/**/*.ts'],
    ignores: ['packages/core/src/today.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
          message: 'Core never reads the clock; take "now" as an argument (see today.ts).',
        },
        {
          selector: "NewExpression[callee.name='Date'][arguments.length=0]",
          message: 'Core never reads the clock; take "now" as an argument (see today.ts).',
        },
      ],
    },
  },
  {
    files: ['**/smoke/*.{mjs,cjs}', '**/smoke/browser/run.mjs', '**/scripts/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        Intl: 'readonly',
        Deno: 'readonly',
        Bun: 'readonly',
      },
    },
  },
  {
    // Browser smoke test: the page and the service worker.
    files: ['**/smoke/browser/*.js'],
    languageOptions: {
      globals: { window: 'readonly', navigator: 'readonly', self: 'readonly' },
    },
  },
  {
    // The website's service worker (plain JS, served as is).
    files: ['apps/web/public/sw.js'],
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
      },
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable' },
    },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
