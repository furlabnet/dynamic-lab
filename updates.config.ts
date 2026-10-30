import type { Config } from 'updates'

export default {
  pin: {
    typescript: '^6',
    next: '^16.0.0',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
    '@rolldown/plugin-babel': '~0.2.0',
  },
  modes: ['npm'],
  allowDowngrade: true,
  overrides: [{ prerelease: false, allowDowngrade: true }],
  inherit: {
    renovate: { cooldown: true },
  },
} satisfies Config
