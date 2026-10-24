import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95 shadow-sm active:translate-y-0 hover:-translate-y-0.5 border border-[var(--primary)]',
        secondary:
          'bg-[color-mix(in_srgb,var(--card)_70%,transparent)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)] backdrop-blur-md active:translate-y-0',
        danger:
          'bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:opacity-95 shadow-sm active:translate-y-0 border border-[var(--destructive)]',
        'danger-outline':
          'bg-transparent text-[var(--destructive)] border border-[color-mix(in_srgb,var(--destructive)_40%,var(--border))] hover:bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)] hover:border-[var(--destructive)]',
        ghost:
          'bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]',
        outline:
          'bg-transparent border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]',
      },
      size: {
        sm: 'min-h-[34px] px-3 py-1 text-xs rounded-[var(--radius-md)] gap-1.5',
        md: 'min-h-[var(--touch-target)] px-5 py-2 text-sm rounded-[var(--radius-lg)] gap-2',
        lg: 'min-h-[48px] px-6 py-2.5 text-base rounded-[var(--radius-xl)] gap-2.5',
        icon: 'size-[var(--control-compact)] p-0 rounded-[var(--radius-md)]',
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
          <Loader2 className="size-4 animate-spin shrink-0" />
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
