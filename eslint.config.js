import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/.turbo/**'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  prettier,
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
    files: ['**/smoke/*.{mjs,cjs}', '**/scripts/*.mjs'],
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
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs', globals: { require: 'readonly' } },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
