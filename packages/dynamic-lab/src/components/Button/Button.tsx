import React from 'react'

import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'focus-visible:ring-ring inline-flex items-center justify-center font-medium transition-all select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'dl-btn-solid border text-[var(--primary-foreground)]',
        secondary:
          'border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_70%,transparent)] text-[var(--foreground)] backdrop-blur-md hover:bg-[var(--muted)]',
        danger: 'dl-btn-solid dl-btn-danger border text-[var(--destructive-foreground)]',
        'danger-outline':
          'border border-[color-mix(in_srgb,var(--destructive)_40%,var(--border))] bg-transparent text-[var(--destructive)] hover:border-[var(--destructive)] hover:bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)]',
        ghost:
          'bg-transparent text-[var(--muted-foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:text-[var(--foreground)]',
        outline:
          'border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)]',
        glass: 'dl-btn-glass text-[var(--foreground)]',
      },
      size: {
        sm: 'min-h-[34px] gap-1.5 rounded-[var(--radius-control)] px-3.5 py-1 text-xs',
        md: 'min-h-[var(--touch-target)] gap-2 rounded-[var(--radius-control)] px-5 py-2 text-sm',
        lg: 'min-h-[48px] gap-2.5 rounded-[var(--radius-control)] px-7 py-2.5 text-base',
        icon: 'size-[var(--control-compact)] rounded-[var(--radius-control)] p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}>
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0 items-center">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  'aria-label': string
  icon: React.ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, variant = 'secondary', size = 'icon', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(buttonVariants({ variant, size }), 'icon-button', className)}
        {...props}>
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
