import React from 'react'

import { cn } from '../../lib/utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded'
}

export function Skeleton({ className, variant = 'rounded', ...props }: SkeletonProps) {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'rectangular'
        ? 'rounded-none'
        : 'rounded-[var(--radius-lg)]'

  return (
    <div
      className={cn(
        'animate-pulse border border-[color-mix(in_srgb,var(--border)_40%,transparent)] bg-[color-mix(in_srgb,var(--foreground)_10%,transparent)]',
        variantClass,
        className
      )}
      {...props}
    />
  )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-4', i === lines - 1 ? 'w-3/5' : 'w-full')} />
      ))}
    </div>
  )
}

export function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'size-7',
    md: 'size-9',
    lg: 'size-12',
  }

  return <Skeleton variant="circular" className={cn(sizeClasses[size], className)} />
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('surface-card flex flex-col gap-4 rounded-[var(--radius-3xl)] p-6', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="size-10" />
        <div className="flex flex-1 flex-col gap-1.5">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="mt-2 flex justify-end gap-2">
        <Skeleton className="h-9 w-20 rounded-[var(--radius-md)]" />
        <Skeleton className="h-9 w-24 rounded-[var(--radius-md)]" />
      </div>
    </div>
  )
}
