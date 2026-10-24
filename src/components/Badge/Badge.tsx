import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const badgeVariants = cva('ui-badge', {
  variants: {
    variant: {
      primary: 'ui-badge-primary',
      neutral: 'ui-badge-neutral',
      outline: 'ui-badge-outline',
      success: 'ui-badge-success',
      warning: 'ui-badge-warning',
      danger: 'ui-badge-danger',
      solid: 'ui-badge-solid',
    },
    size: {
      sm: 'ui-badge-sm',
      md: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

/** A compact label for roles, product names, counts and categories. For workflow states use StatusBadge. */
export function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="inline-flex shrink-0 [&>svg]:size-3">{icon}</span>}
      {children}
    </span>
  )
}
