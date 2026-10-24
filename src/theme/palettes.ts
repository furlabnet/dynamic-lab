import type { CSSProperties } from 'react'
import type { ThemeMode } from './tokens'

/**
 * Named colour themes. Each one sets the accent, the tint of the neutrals and the two background
 * glows, in a light and a dark version under the same name. Layout, radii, status colours and
 * glass opacity are not part of a palette, so every theme still looks like the same product.
 *
 * Names are puns on fursona species. Add your own with ThemeProvider's `palettes` prop.
 */
export interface PaletteModeColors {
  primary: string
  /** Text on primary. Defaults to white in light mode and near-black in dark mode. */
  primaryForeground?: string
  glowA: string
  glowB: string
}

export interface Palette {
  id: string
  name: string
  /** The species the name is a nod to. */
  species: string
  /** One line about the look. */
  description: string
  /** Hue of the neutrals (backgrounds, borders, muted text). A number, or one per mode. */
  neutralHue: number | { light: number; dark: number }
  /** 0–1. How much of the hue shows in the neutrals; 1 is the default blue-grey strength. */
  neutralTint?: number
  light: PaletteModeColors
  dark: PaletteModeColors
}

export const PALETTES: Palette[] = [
  {
    id: 'midnight-wolf',
    name: 'Midnight Wolf',
    species: 'Wolf',
    description: 'The default. Clear blue on cool blue-grey.',
    neutralHue: { light: 228, dark: 232 },
    light: { primary: 'hsl(225 80% 52%)', glowA: 'hsl(225 90% 60%)', glowB: 'hsl(262 80% 64%)' },
    dark: { primary: 'hsl(220 95% 68%)', glowA: 'hsl(225 90% 58%)', glowB: 'hsl(262 80% 60%)' },
  },
  {
    id: 'fiery-fox',
    name: 'Fiery Fox',
    species: 'Fox',
    description: 'Burnt orange with an ember-pink glow.',
    neutralHue: 24,
    neutralTint: 0.55,
    light: { primary: 'hsl(22 92% 40%)', glowA: 'hsl(24 95% 58%)', glowB: 'hsl(345 80% 62%)' },
    dark: { primary: 'hsl(26 95% 62%)', glowA: 'hsl(22 95% 52%)', glowB: 'hsl(345 75% 52%)' },
  },
  {
    id: 'blue-dog',
    name: 'Blue Dog',
    species: 'Dog',
    description: 'Friendly turquoise, like a good boy at the beach.',
    neutralHue: 200,
    light: { primary: 'hsl(192 90% 31%)', glowA: 'hsl(195 90% 55%)', glowB: 'hsl(165 70% 50%)' },
    dark: { primary: 'hsl(190 85% 60%)', glowA: 'hsl(192 85% 48%)', glowB: 'hsl(165 65% 42%)' },
  },
  {
    id: 'snow-leopard',
    name: 'Snow Leopard',
    species: 'Snow leopard',
    description: 'Quiet steel and frost. Almost monochrome.',
    neutralHue: 215,
    neutralTint: 0.35,
    light: { primary: 'hsl(212 24% 32%)', glowA: 'hsl(205 45% 72%)', glowB: 'hsl(230 25% 72%)' },
    dark: { primary: 'hsl(208 32% 82%)', glowA: 'hsl(205 35% 55%)', glowB: 'hsl(230 20% 55%)' },
  },
  {
    id: 'deer-delight',
    name: 'Deer Delight',
    species: 'Deer',
    description: 'Rose petals and peach, sweet as the candy.',
    neutralHue: 340,
    neutralTint: 0.5,
    light: { primary: 'hsl(338 68% 45%)', glowA: 'hsl(340 85% 66%)', glowB: 'hsl(28 90% 68%)' },
    dark: { primary: 'hsl(340 85% 76%)', glowA: 'hsl(338 70% 55%)', glowB: 'hsl(25 80% 55%)' },
  },
  {
    id: 'scalies',
    name: 'Scalies',
    species: 'Dragons and reptiles',
    description: 'Emerald scales with a lime shimmer.',
    neutralHue: 160,
    neutralTint: 0.5,
    light: { primary: 'hsl(156 72% 27%)', glowA: 'hsl(150 70% 45%)', glowB: 'hsl(80 70% 50%)' },
    dark: { primary: 'hsl(150 62% 58%)', glowA: 'hsl(152 65% 38%)', glowB: 'hsl(80 60% 40%)' },
  },
  {
    id: 'otter-space',
    name: 'Otter Space',
    species: 'Otter',
    description: 'Deep navy sky with golden starlight.',
    neutralHue: 222,
    light: { primary: 'hsl(36 90% 33%)', glowA: 'hsl(222 80% 58%)', glowB: 'hsl(44 95% 60%)' },
    dark: { primary: 'hsl(44 95% 62%)', glowA: 'hsl(224 80% 45%)', glowB: 'hsl(42 90% 48%)' },
  },
  {
    id: 'purrple-rain',
    name: 'Purrple Rain',
    species: 'Cat',
    description: 'Royal purple with a magenta storm.',
    neutralHue: 270,
    neutralTint: 0.6,
    light: { primary: 'hsl(275 60% 50%)', glowA: 'hsl(280 75% 64%)', glowB: 'hsl(320 75% 64%)' },
    dark: { primary: 'hsl(278 85% 78%)', glowA: 'hsl(278 65% 52%)', glowB: 'hsl(320 65% 50%)' },
  },
]

export const DEFAULT_PALETTE_ID = 'midnight-wolf'

/** The CSS custom properties a palette sets, for one mode. */
export function paletteTokens(palette: Palette, mode: ThemeMode): Record<string, string> {
  const hue = typeof palette.neutralHue === 'number' ? palette.neutralHue : palette.neutralHue[mode]
  const k = palette.neutralTint ?? 1
  const s = (base: number) => `${Math.round(base * k * 10) / 10}%`
  const n = (sat: number, light: number, alpha?: number) =>
    `hsl(${hue} ${s(sat)} ${light}%${alpha !== undefined ? ` / ${alpha}` : ''})`
  const colors = palette[mode]

  if (mode === 'light') {
    const fg = n(32, 12)
    return {
      '--background': n(33, 97),
      '--foreground': fg,
      '--card': 'hsl(0 0% 100%)',
      '--card-foreground': fg,
      '--popover': 'hsl(0 0% 100%)',
      '--popover-foreground': fg,
      '--muted': n(26, 93.5),
      '--muted-foreground': n(13, 40),
      '--secondary': n(26, 93.5),
      '--secondary-foreground': n(22, 24),
      '--accent': n(26, 93.5),
      '--accent-foreground': fg,
      '--border': n(22, 87),
      '--input': n(20, 83),
      '--glass': 'hsl(0 0% 100%)',
      '--glass-border': n(30, 40, 0.14),
      '--sidebar-border': n(22, 87),
      '--sidebar-accent': `color-mix(in srgb, ${colors.primary} 10%, white)`,
      '--primary': colors.primary,
      '--primary-foreground': colors.primaryForeground ?? 'hsl(0 0% 100%)',
      '--ring': colors.primary,
      '--glow-a': colors.glowA,
      '--glow-b': colors.glowB,
    }
  }

  const fg = n(33, 96)
  return {
    '--background': n(30, 7),
    '--foreground': fg,
    '--card': n(25, 11),
    '--card-foreground': fg,
    '--popover': n(25, 11),
    '--popover-foreground': fg,
    '--muted': n(22, 15),
    '--muted-foreground': n(15, 69),
    '--secondary': n(22, 17),
    '--secondary-foreground': fg,
    '--accent': n(22, 16),
    '--accent-foreground': fg,
    '--border': n(20, 20),
    '--input': n(20, 25),
    '--glass': n(25, 12),
    '--glass-border': n(40, 92, 0.09),
    '--sidebar-border': n(20, 20),
    '--sidebar-accent': `color-mix(in srgb, ${colors.primary} 14%, ${n(25, 11)})`,
    '--primary': colors.primary,
    '--primary-foreground': colors.primaryForeground ?? n(30, 7),
    '--ring': colors.primary,
    '--glow-a': colors.glowA,
    '--glow-b': colors.glowB,
  }
}

/** Inline style that scopes a palette to one element, e.g. for a preview card. */
export function paletteStyle(palette: Palette, mode: ThemeMode): CSSProperties {
  return paletteTokens(palette, mode) as CSSProperties
}
