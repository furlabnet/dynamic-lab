import React from 'react'

import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'glass' | 'panel'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'surface', children, ...props }, ref) => {
    const variantClass =
      variant === 'glass' ? 'glass-chrome' : variant === 'panel' ? 'ui-panel' : 'surface-card'

    return (
      <div ref={ref} className={cn(variantClass, 'p-6', className)} {...props}>
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>
export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  )
}

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>
export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg leading-snug font-bold', className)} {...props}>
      {children}
    </h3>
  )
}

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>
export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-[var(--muted-foreground)]', className)} {...props}>
      {children}
    </p>
  )
}

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>
export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)} {...props}>
      {children}
    </div>
  )
}

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>
export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-5 flex items-center justify-end gap-3 border-t border-[var(--border)] pt-3',
        className
      )}
      {...props}>
      {children}
    </div>
  )
}
