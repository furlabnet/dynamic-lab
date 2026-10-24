import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    components: './src/index.ts',
  },

  dts: true,
  // Fail on warnings in CI (opt-in)
  unbundle: false,
  exports: true,
  shims: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  platform: 'node',
})
