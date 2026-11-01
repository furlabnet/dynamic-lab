import React from 'react'

import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { ExternalLink } from 'lucide-react'

import { cn } from '../../lib/utils'

const tone = {
  default: 'text-[var(--foreground)]',
  muted: 'text-[var(--muted-foreground)]',
  primary: 'text-[var(--primary)]',
  success: 'text-[var(--status-success-ink)]',
  warning: 'text-[var(--status-warning-ink)]',
  danger: 'text-[var(--status-danger-ink)]',
  inherit: '',
}

export const headingVariants = cva('font-[family-name:var(--font-display)] text-balance', {
  variants: {
    size: {
      display: 'text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] font-[750] tracking-[-0.035em]',
      '2xl': 'text-[clamp(1.75rem,3.5vw,2.25rem)] leading-tight font-bold tracking-[-0.025em]',
      xl: 'text-[clamp(1.375rem,2.4vw,1.625rem)] leading-snug font-bold tracking-[-0.02em]',
      lg: 'text-lg leading-snug font-[650] tracking-[-0.015em]',
      md: 'text-base leading-snug font-[650] tracking-[-0.01em]',
      sm: 'text-sm leading-snug font-semibold',
    },
    tone,
  },
  defaultVariants: { tone: 'default' },
})

const DEFAULT_SIZE = { 1: '2xl', 2: 'xl', 3: 'lg', 4: 'md', 5: 'sm', 6: 'sm' } as const

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  /** Heading level, for the document outline. The size follows it unless you set `size`. */
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

/** A heading whose look (`size`) is separate from its place in the outline (`level`). */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, size, tone, ...props }, ref) => {
    const Tag = `h${level}` as const
    return (
      <Tag
        ref={ref}
        className={cn(headingVariants({ size: size ?? DEFAULT_SIZE[level], tone }), className)}
        {...props}
      />
    )
  }
)

Heading.displayName = 'Heading'

export const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs leading-snug',
      sm: 'text-sm leading-normal',
      md: 'text-base leading-relaxed',
      lg: 'text-lg leading-relaxed',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    tone,
    truncate: {
      true: 'truncate',
      false: '',
    },
  },
  defaultVariants: { size: 'md', tone: 'inherit', truncate: false },
})

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  /** Element to render. Defaults to 'p'. */
  as?: 'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em'
  /** Cut off after this many lines with an ellipsis. */
  lines?: number
  /** Monospaced, for IDs and code-like values. */
  mono?: boolean
}

/** Body text in four sizes and the theme's tones. */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    { as: Comp = 'p', className, style, size, weight, tone, truncate, lines, mono, ...props },
    ref
  ) => (
    <Comp
      ref={ref as React.Ref<never>}
      className={cn(
        textVariants({ size, weight, tone, truncate }),
        lines && '[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical]',
        mono && 'font-mono text-[0.92em]',
        className
      )}
      style={lines ? { WebkitLineClamp: lines, ...style } : style}
      {...props}
    />
  )
)

Text.displayName = 'Text'

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** `subtle` keeps the surrounding colour and only underlines on hover. */
  variant?: 'default' | 'subtle'
  /** Open in a new tab with rel="noopener noreferrer" and an icon. Detected from http(s) hrefs when not set. */
  external?: boolean
}

/** A text link in the primary colour, with an external-link icon for other sites. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = 'default', external, href, children, ...props }, ref) => {
    const isExternal = external ?? /^https?:\/\//.test(href ?? '')
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          'dl-link',
          variant === 'subtle' && 'dl-link-subtle',
          isExternal && 'inline-flex items-center gap-1',
          className
        )}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}>
        {children}
        {isExternal && (
          <>
            <ExternalLink aria-hidden="true" className="size-[0.85em] shrink-0 opacity-70" />
            <span className="sr-only">(opens in a new tab)</span>
          </>
        )}
      </a>
    )
  }
)

Link.displayName = 'Link'
