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
        primary: '#2354e7',
        primaryForeground: '#ffffff',
        glowA: '#3d6bf5',
        glowB: '#905aed',
      },
      dark: {
        primary: '#6094fb',
        primaryForeground: '#0c0e17',
        glowA: '#3464f4',
        glowB: '#8347eb',
      },
    },
    backstage: {
      light: {
        primary: '#773eda',
        primaryForeground: '#ffffff',
        glowA: '#905aed',
        glowB: '#3d6bf5',
      },
      dark: {
        primary: '#b890f9',
        primaryForeground: '#0c0e17',
        glowA: '#8347eb',
        glowB: '#3464f4',
      },
    },
  },
} as const

export type ThemeBrand = (typeof TOKENS.themes)[number]
export type ThemeMode = (typeof TOKENS.modes)[number]
export type FullTheme = `${ThemeBrand}-${ThemeMode}`
