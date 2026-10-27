import React, { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SidebarNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  children: React.ReactNode
  /** `card` is the floating glass panel used in dashboards; `plain` sits inside an AdminSidebar. */
  variant?: 'card' | 'plain'
  /** Heading at the top of the nav, e.g. "Your Dynamic Lab". */
  title?: React.ReactNode
  /**
   * Below lg, fold the links behind a button showing `title` and `currentLabel`. From lg up the
   * nav is always open. The menu closes after a link is chosen.
   */
  collapsible?: boolean
  /** The active page, shown on the collapsed button so people know where they are. */
  currentLabel?: React.ReactNode
  defaultOpen?: boolean
}

export function SidebarNav({
  className,
  children,
  variant = 'card',
  title,
  collapsible = false,
  currentLabel,
  defaultOpen = false,
  ...props
}: SidebarNavProps) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyId = useId()

  return (
    <nav
      data-collapsible={collapsible || undefined}
      data-open={open || undefined}
      className={cn(
        'ui-nav flex flex-col gap-1',
        variant === 'card' &&
          'glass-chrome w-64 rounded-[var(--radius-2xl)] border border-[var(--glass-border)] p-3',
        className
      )}
      {...props}>
      {collapsible ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
          className="ui-nav-toggle">
          <span className="flex min-w-0 flex-col text-left">
            {title && <span className="text-base font-bold">{title}</span>}
            {currentLabel && (
              <span className="truncate text-xs font-medium text-[var(--muted-foreground)] lg:hidden">
                {currentLabel}
              </span>
            )}
          </span>
          <ChevronDown className="ui-nav-toggle-icon size-4 shrink-0 lg:hidden" aria-hidden />
        </button>
      ) : (
        title && <div className="px-2.5 pb-1 pt-1 text-base font-bold">{title}</div>
      )}
      <div
        id={bodyId}
        className={cn('ui-nav-body', collapsible && 'ui-nav-body-collapsible')}
        onClick={(e) => {
          if (collapsible && (e.target as HTMLElement).closest('.ui-nav-link')) setOpen(false)
        }}>
        {children}
      </div>
    </nav>
  )
}

export interface SidebarNavGroupProps {
  label?: string
  children: React.ReactNode
  className?: string
}

export function SidebarNavGroup({ label, children, className }: SidebarNavGroupProps) {
  return (
    <div className={cn('ui-nav-group mb-2 flex flex-col gap-0.5', className)}>
      {label && <span className="ui-nav-label">{label}</span>}
      {children}
    </div>
  )
}

export type SidebarNavItemProps = {
  active?: boolean
  icon?: React.ReactNode
  badge?: string | number
} & (
  | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
)

/** A sidebar link. Renders an anchor with `href`, otherwise a button (for client-side routing). */
export function SidebarNavItem({
  className,
  active,
  icon,
  badge,
  children,
  ...props
}: SidebarNavItemProps) {
  const classes = cn('ui-nav-link w-full text-left cursor-pointer', className)
  const label = typeof children === 'string' ? children : undefined
  const inner = (
    <>
      {icon && (
        <span className="inline-flex size-[18px] shrink-0 items-center [&>svg]:size-[18px]">
          {icon}
        </span>
      )}
      <span className="ui-nav-text flex-1 truncate">{children}</span>
      {badge !== undefined && <span className="ui-nav-badge ui-nav-text">{badge}</span>}
    </>
  )

  if (props.href !== undefined) {
    return (
      <a
        aria-current={active ? 'page' : undefined}
        title={label}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {inner}
      </a>
    )
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      title={label}
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  )
}
