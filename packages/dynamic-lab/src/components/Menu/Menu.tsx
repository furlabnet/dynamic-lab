import React, { createContext, useContext } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { focusSibling } from '../../lib/hooks'
import { Popover } from '../Popover'

/** Lets items inside a DropdownMenu close it after they run. */
const MenuContext = createContext<{ close: () => void } | null>(null)

const ITEM_SELECTOR = '[role="menuitem"], [role="menuitemradio"]'

function handleMenuKeyDown(e: React.KeyboardEvent<HTMLElement>) {
  const container = e.currentTarget
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    focusSibling(container, ITEM_SELECTOR, 'next')
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    focusSibling(container, ITEM_SELECTOR, 'prev')
  } else if (e.key === 'Home') {
    e.preventDefault()
    focusSibling(container, ITEM_SELECTOR, 'first')
  } else if (e.key === 'End') {
    e.preventDefault()
    focusSibling(container, ITEM_SELECTOR, 'last')
  }
}

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

/** A static menu surface. Use DropdownMenu for one that opens from a trigger. */
export function Menu({ className, children, ...props }: MenuProps) {
  return (
    <div
      role="menu"
      onKeyDown={handleMenuKeyDown}
      className={cn('ui-menu flex flex-col w-60', className)}
      {...props}>
      {children}
    </div>
  )
}

type MenuItemBaseProps = {
  danger?: boolean
  icon?: React.ReactNode
  subtitle?: React.ReactNode
  /** Trailing content, e.g. a Kbd shortcut or a count. */
  trailing?: React.ReactNode
  /** Marks the item as the current choice (shows a check and aria-checked). */
  selected?: boolean
  /** Keep the parent DropdownMenu open after this item is chosen. */
  keepOpen?: boolean
}

export type MenuItemProps = MenuItemBaseProps &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  )

export function MenuItem({
  className,
  danger = false,
  icon,
  subtitle,
  trailing,
  selected,
  keepOpen = false,
  children,
  onClick,
  ...props
}: MenuItemProps) {
  const menu = useContext(MenuContext)
  const isRadio = selected !== undefined

  const classes = cn(
    'ui-menu-item',
    danger && 'ui-menu-item-danger',
    selected && 'font-semibold',
    className
  )

  const content = (
    <>
      {icon && <span className="ui-menu-item-icon">{icon}</span>}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{children}</span>
        {subtitle && (
          <span className="text-xs font-normal text-[var(--muted-foreground)]">{subtitle}</span>
        )}
      </span>
      {trailing}
      {selected && <Check className="size-4 shrink-0 text-[var(--primary)]" aria-hidden />}
    </>
  )

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    ;(onClick as React.MouseEventHandler<HTMLElement> | undefined)?.(e)
    if (!keepOpen && !e.defaultPrevented) menu?.close()
  }

  const a11y = {
    role: isRadio ? 'menuitemradio' : 'menuitem',
    'aria-checked': isRadio ? selected : undefined,
    tabIndex: -1,
  }

  if (props.href !== undefined) {
    return (
      <a
        {...a11y}
        className={classes}
        onClick={handleClick}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      {...a11y}
      className={classes}
      onClick={handleClick}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}

export function MenuSeparator({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-[var(--border)]', className)} role="separator" />
}

export function MenuLabel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]',
        className
      )}>
      {children}
    </div>
  )
}

export interface DropdownMenuProps {
  trigger: React.ReactElement<React.HTMLAttributes<HTMLElement>>
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom'
  'aria-label'?: string
  className?: string
  containerClassName?: string
}

/** A menu that opens from a trigger, with arrow-key navigation and Escape / outside-click to close. */
export function DropdownMenu({
  trigger,
  children,
  align = 'end',
  className,
  ...props
}: DropdownMenuProps) {
  return (
    <Popover
      trigger={trigger}
      role="menu"
      align={align}
      className={cn('ui-menu flex w-64 flex-col', className)}
      onKeyDown={handleMenuKeyDown}
      onOpenAutoFocus={(panel) => {
        const current = panel.querySelector<HTMLElement>('[aria-checked="true"]')
        if (current) current.focus()
        else focusSibling(panel, ITEM_SELECTOR, 'first')
      }}
      {...props}>
      {({ close }) => <MenuContext.Provider value={{ close }}>{children}</MenuContext.Provider>}
    </Popover>
  )
}
