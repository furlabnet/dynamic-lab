export const TOKENS = {
  themes: ['dynamic', 'backstage'] as const,
  modes: ['light', 'dark'] as const,
  variants: ['dynamic-light', 'dynamic-dark', 'backstage-light', 'backstage-dark'] as const,
  radii: {
    sm: '6px',
    md: '8px',
    lg: '10px',
    xl: '14px',
    '2xl': '16px',
    '3xl': '20px',
    full: '9999px',
  },
  spacing: {
    2: '2px',
    4: '4px',
    6: '6px',
    8: '8px',
    10: '10px',
    12: '12px',
    16: '16px',
    20: '20px',
    24: '24px',
    28: '28px',
    32: '32px',
    40: '40px',
  },
  colors: {
    dynamic: {
      light: {
        primary: '#2148ca',
        primaryForeground: '#ffffff',
        glowA: '#476deb',
        glowB: '#639fe3',
      },
      dark: {
        primary: '#84aaf5',
        primaryForeground: '#0c0e17',
        glowA: '#2f5dda',
        glowB: '#337acc',
      },
    },
    backstage: {
      light: {
        primary: '#6442b3',
        primaryForeground: '#ffffff',
        glowA: '#8b6ecf',
        glowB: '#ab8bd0',
      },
      dark: {
        primary: '#b9a5e9',
        primaryForeground: '#0c0e17',
        glowA: '#6f4ebc',
        glowB: '#774ca9',
      },
    },
  },
} as const

export type ThemeBrand = (typeof TOKENS.themes)[number]
export type ThemeMode = (typeof TOKENS.modes)[number]
export type FullTheme = `${ThemeBrand}-${ThemeMode}`
