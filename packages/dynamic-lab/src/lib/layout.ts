import type React from 'react'

/**
 * Shared helpers for the layout primitives (Stack, Grid, Columns, ...).
 *
 * Tailwind only sees class names written out in the source, so responsive props can't build
 * classes like `md:grid-cols-${n}` at runtime. Instead each component writes CSS variables inline
 * (`--stack-gap`, `--stack-gap-md`, ...) and styles/layout.css reads them inside media queries.
 * Breakpoints match Tailwind's: sm 640px, md 768px, lg 1024px, xl 1280px.
 */
export const BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const

export type Breakpoint = (typeof BREAKPOINTS)[number]

/** A value, or one per breakpoint (mobile first): `{ base: 1, md: 2, lg: 3 }`. */
export type Responsive<T> = T | ({ base?: T } & Partial<Record<Breakpoint, T>>)

/** A number is a step on Tailwind's 4px scale (4 = 1rem); a string is any CSS length. */
export type Space = number | string

export function toSpace(value: Space): string {
  return typeof value === 'number' ? `${value * 0.25}rem` : value
}

function isResponsiveObject<T>(
  value: Responsive<T>
): value is { base?: T } & Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Turns a responsive prop into CSS variables: `--name` for the base value and `--name-md` etc. for
 * each breakpoint that is set. Breakpoints left out fall back to the next smaller one in the CSS.
 */
export function responsiveVars<T>(
  name: string,
  value: Responsive<T> | undefined,
  format: (value: T) => string
): Record<string, string> {
  if (value === undefined) return {}
  if (!isResponsiveObject(value)) return { [`--${name}`]: format(value) }

  const vars: Record<string, string> = {}
  if (value.base !== undefined) vars[`--${name}`] = format(value.base)
  for (const bp of BREAKPOINTS) {
    const v = value[bp]
    if (v !== undefined) vars[`--${name}-${bp}`] = format(v)
  }
  return vars
}

/** Merges layout variables into a user `style`, letting the user's own values win. */
export function withVars(
  vars: Record<string, string | undefined>,
  style: React.CSSProperties | undefined
): React.CSSProperties {
  const defined = Object.fromEntries(Object.entries(vars).filter(([, v]) => v !== undefined))
  return { ...defined, ...style } as React.CSSProperties
}

export const ALIGN = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
} as const

export const JUSTIFY = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
} as const

export type AlignValue = keyof typeof ALIGN
export type JustifyValue = keyof typeof JUSTIFY

/** Props shared by every layout primitive: render as another element with `as`. */
export interface LayoutBaseProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render, e.g. 'section', 'ul', 'nav'. Defaults to 'div'. */
  as?: React.ElementType
}
