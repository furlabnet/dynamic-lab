import autoprefixer from 'autoprefixer'
import { defineConfig } from 'tsdown'

import { buildCSS } from './src/hooks/buildCSS'

export default defineConfig({
  format: ['esm', 'cjs'],
  entry: ['src/index.ts', 'src/next.ts'],
  dts: true,
  unbundle: false,
  copy: ['fonts'],
  shims: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  platform: 'neutral',
  exports: {
    customExports: {
      '.': {
        '@furlab/source': './src/index.ts',
        import: './dist/index.js',
        require: './dist/index.cjs',
      },
      './otf/*': './src/fonts/*',
      './fonts/*': './dist/fonts/*',
    },
  },
  css: {
    fileName: 'the-lab-sans.css',
    splitting: false,
    transformer: 'postcss',
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  hooks: {
    'build:prepare': async () => {
      await buildCSS()
    },
  },
})
