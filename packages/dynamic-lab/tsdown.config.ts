import { existsSync, readFileSync } from 'node:fs'

import pluginBabel from '@rolldown/plugin-babel'
import { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'tsdown'

const clientModules = new Map<string, boolean>()

/** True for source files that start with a 'use client' directive. */
function isClientModule(filename: string) {
  let result = clientModules.get(filename)
  if (result === undefined) {
    // The declaration build passes virtual files (src/index.d.ts) that aren't on disk.
    result = existsSync(filename) && /^\s*['"]use client['"]/.test(readFileSync(filename, 'utf8'))
    clientModules.set(filename, result)
  }
  return result
}

/**
 * Library build: ESM + CJS bundles and type declarations in dist/.
 * The stylesheet is built separately by the Tailwind CLI (see `build:css`), because the
 * components rely on Tailwind utilities that only Tailwind can generate.
 */
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  platform: 'neutral',
  inputOptions: {
    resolve: {
      mainFields: ['module', 'main'],
    },
  },
  dts: true,
  sourcemap: true,
  treeshake: true,
  clean: true,
  unbundle: true,
  minify: false,
  shims: true,
  exports: {
    customExports: {
      '.': {
        '@furlab/source': './src/index.ts',
        import: './dist/index.js',
        require: './dist/index.cjs',
      },
      './styles.css': './dist/styles.css',
    },
  },
  // No global 'use client' banner: modules that need the browser start with their own directive,
  // which the unbundled output keeps, so everything else stays usable in React Server Components.
  plugins: [
    pluginBabel({
      // The compiler's output calls a hook (the memo cache), which Server Components can't run, so
      // only client modules are compiled.
      presets: [reactCompilerPreset({ sources: isClientModule })],
    }),
  ],
  hooks: {
    'build:done': async () => {
      const { execSync } = await import('child_process')
      execSync('yarn build:css', { stdio: 'inherit' })
    },
  },
})
