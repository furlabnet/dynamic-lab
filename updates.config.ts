import type { Config } from 'updates'

export default {
  pin: {
    typescript: '^7',
  },
  modes: ['npm'],
  allowDowngrade: true,
  overrides: [{ include: ['next-auth'], prerelease: true, allowDowngrade: false }],
  inherit: {
    renovate: { cooldown: true },
  },
} satisfies Config
