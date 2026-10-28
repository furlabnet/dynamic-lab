import type { Config } from 'updates'

export default {
  pin: {
    typescript: '^6',
    next: '^16.0.0',
    react: '^19.0.0',
    'react-dom': '^19.0.0',
  },
  modes: ['npm'],
  allowDowngrade: true,
  overrides: [{ include: ['next-auth'], prerelease: true, allowDowngrade: false }],
  inherit: {
    renovate: { cooldown: true },
  },
} satisfies Config
