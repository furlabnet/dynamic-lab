import babelParser from '@babel/eslint-parser'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import onlyWarn from 'eslint-plugin-only-warn'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from 'typescript-eslint'

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  // Flat config only lints .js/.mjs/.cjs by default; include TypeScript and JSX too.
  { files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}'] },
  js.configs.recommended,
  {
    // JavaScript keeps the Babel parser this config started with.
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-typescript'],
        },
      },
    },
  },
  // TypeScript is parsed by typescript-eslint, whose recommended set also turns off the core rules
  // that misfire on types (no-undef, no-unused-vars). Scoped to TS files so JS keeps Babel.
  ...tseslint.configs.recommended.map((c) => ({ ...c, files: ['**/*.{ts,tsx,mts,cts}'] })),
  eslintConfigPrettier,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  {
    plugins: {
      onlyWarn: /** @type {import('eslint').Linter} */ (/** @type {unknown} */ (onlyWarn)),
    },
  },
  {
    ignores: ['dist/**', 'scripts/**', 'tools/**', 'node_modules/**', '.next/**', '.next-**'],
  },
]
