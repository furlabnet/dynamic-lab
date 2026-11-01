import React from 'react'

import { cn } from '../../lib/utils'

export interface BackgroundGlow {
  /** Any CSS colour, including theme variables like 'var(--glow-a)'. */
  color: string
  /** Centre of the glow, as a CSS position: '100%', '20%', '50%'... */
  x: string
  y: string
  /** Size of the ellipse, e.g. '56rem 40rem' or '60vw'. */
  size?: string
  /** 0–1. Multiplied by the theme's glow strength, so transparency settings still apply. */
  opacity?: number
  /** Where the glow has faded out, as a percentage of its size. */
  fade?: number
}

export type BackgroundVariant = 'brand' | 'aurora' | 'mesh' | 'spotlight' | 'none'

/**
 * Ready-made layouts. 'brand' matches the classic `.dynamic-lab-glow-bg` look for each brand.
 * Colours come from the theme (`--glow-a`, `--glow-b`, `--primary`), so palettes recolour them.
 */
const PRESETS: Record<Exclude<BackgroundVariant, 'brand' | 'none'>, BackgroundGlow[]> = {
  aurora: [
    { color: 'var(--glow-a)', x: '15%', y: '-10%', size: '60rem 34rem', opacity: 1, fade: 70 },
    { color: 'var(--glow-b)', x: '70%', y: '-5%', size: '52rem 30rem', opacity: 0.9, fade: 70 },
    { color: 'var(--primary)', x: '45%', y: '10%', size: '40rem 22rem', opacity: 0.5, fade: 70 },
  ],
  mesh: [
    { color: 'var(--glow-a)', x: '0%', y: '0%', size: '50rem 40rem', opacity: 1 },
    { color: 'var(--glow-b)', x: '100%', y: '0%', size: '46rem 38rem', opacity: 0.85 },
    { color: 'var(--primary)', x: '100%', y: '100%', size: '50rem 40rem', opacity: 0.6 },
    { color: 'var(--glow-b)', x: '0%', y: '100%', size: '44rem 36rem', opacity: 0.6 },
  ],
  spotlight: [
    { color: 'var(--primary)', x: '50%', y: '-15%', size: '64rem 36rem', opacity: 1, fade: 65 },
  ],
}

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A preset arrangement of glows. Ignored when `glows` is set. */
  variant?: BackgroundVariant
  /** Your own glows, painted in order (first on top). */
  glows?: BackgroundGlow[]
  /** A pattern over the glows. */
  pattern?: 'none' | 'dots' | 'grid' | 'noise'
  /** Pattern colour. Defaults to a faint tint of the text colour. */
  patternColor?: string
  /** Distance between dots or grid lines. Any CSS length. */
  patternSize?: string
  /** Fade the pattern out towards the bottom, so it frames the top of the page. */
  patternFade?: boolean
  /** Multiplies glow strength: 0.5 is half as bright, 2 twice. */
  intensity?: number
  /** Slowly drift the glows. Turned off for people who prefer reduced motion. */
  animate?: boolean
  /** 'fixed' covers the viewport behind the page; 'absolute' fills the nearest positioned parent. */
  position?: 'fixed' | 'absolute'
  /** A solid colour under everything. Defaults to transparent, so the page background shows. */
  base?: string
}

function glowLayer({ color, x, y, size = '50rem 36rem', opacity = 1, fade = 68 }: BackgroundGlow) {
  const strength = `calc(var(--glow-strength) * var(--bg-intensity, 1) * ${opacity * 100}%)`
  return `radial-gradient(${size} at ${x} ${y}, color-mix(in srgb, ${color} ${strength}, transparent), transparent ${fade}%)`
}

/**
 * The ambient gradient behind a page or a section, built from theme colours. Put it first inside
 * the element it decorates: `fixed` (the default) sits behind the whole viewport, `absolute`
 * fills the nearest positioned parent (give that parent `relative isolate`). Glows fade away with
 * the transparency setting, like every other glass effect.
 */
export function Background({
  className,
  style,
  variant = 'brand',
  glows,
  pattern = 'none',
  patternColor,
  patternSize,
  patternFade = false,
  intensity = 1,
  animate = false,
  position = 'fixed',
  base,
  children,
  ...props
}: BackgroundProps) {
  const layers = glows ?? (variant === 'brand' || variant === 'none' ? undefined : PRESETS[variant])
  const useBrand = !glows && variant === 'brand'

  return (
    <div
      aria-hidden="true"
      data-position={position}
      className={cn('dl-background', className)}
      style={
        {
          backgroundColor: base,
          '--bg-intensity': String(intensity),
          '--bg-pattern-color': patternColor,
          '--bg-pattern-size': patternSize,
          ...style,
        } as React.CSSProperties
      }
      {...props}>
      {(layers || useBrand) && (
        <div
          className={cn('dl-background-glows', useBrand && 'dl-background-brand')}
          data-animate={animate || undefined}
          style={layers ? { background: layers.map(glowLayer).join(', ') } : undefined}
        />
      )}
      {pattern !== 'none' && (
        <div
          className="dl-background-pattern"
          data-pattern={pattern}
          data-fade={patternFade || undefined}
        />
      )}
      {children}
    </div>
  )
}
