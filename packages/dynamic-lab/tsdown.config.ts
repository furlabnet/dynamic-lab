import { defineConfig } from 'tsdown'

import pluginBabel from '@rolldown/plugin-babel'
import { reactCompilerPreset } from '@vitejs/plugin-react'

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
  outputOptions: {
    banner: "'use client';",
  },
  plugins: [
    pluginBabel({
      presets: [reactCompilerPreset()],
    }),
  ],
  hooks: {
    'build:done': async () => {
      const currentFilePath = import.meta.dirname

      console.log(currentFilePath)
      const { execSync } = await import('child_process')
      execSync('yarn build:css', { stdio: 'inherit' })
    },
  },
})
