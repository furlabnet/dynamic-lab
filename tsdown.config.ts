import { defineConfig } from 'tsdown'

/**
 * Library build: ESM + CJS bundles and type declarations in dist/.
 * The stylesheet is built separately by the Tailwind CLI (see `build:css`), because the
 * components rely on Tailwind utilities that only Tailwind can generate.
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'browser',
  target: 'es2022',
  // Declarations come from `tsc -p tsconfig.lib.json` (see build:types). tsdown's own dts
  // generation needs the TypeScript 7.1 declaration API; switch to `dts: { generator: 'tsgo' }`
  // once that's stable.
  dts: false,
  sourcemap: true,
  clean: true,
  // Dependencies and peer dependencies (react, lucide-react, clsx…) stay external.
  // Every component uses hooks or event handlers, so mark the bundle as client code for RSC frameworks.
  outputOptions: {
    banner: "'use client';",
  },
})
