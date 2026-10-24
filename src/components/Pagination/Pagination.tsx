import React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { buttonVariants } from '../Button'
import { cn } from '../../lib/utils'

export const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

export const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1.5', className)}
    {...props}
  />
))
PaginationContent.displayName = 'PaginationContent'

export const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />)
PaginationItem.displayName = 'PaginationItem'

export type PaginationLinkProps = {
  isActive?: boolean
  disabled?: boolean
} & React.ComponentProps<'button'>

export const PaginationLink = ({
  className,
  isActive,
  disabled,
  ...props
}: PaginationLinkProps) => (
  <button
    type="button"
    aria-current={isActive ? 'page' : undefined}
    disabled={disabled}
    className={cn(
      buttonVariants({
        variant: isActive ? 'primary' : 'secondary',
        size: 'sm',
      }),
      'size-9 p-0 font-semibold cursor-pointer',
      disabled && 'opacity-40 cursor-not-allowed',
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

export const PaginationPrevious = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    disabled={disabled}
    className={cn('gap-1 w-auto px-3', className)}
    {...props}>
    <ChevronLeft className="size-4" />
    <span className="hidden sm:inline">Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

export const PaginationNext = ({
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    disabled={disabled}
    className={cn('gap-1 w-auto px-3', className)}
    {...props}>
    <span className="hidden sm:inline">Next</span>
    <ChevronRight className="size-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

export const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex size-9 items-center justify-center text-[var(--muted-foreground)]', className)}
    {...props}>
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'
