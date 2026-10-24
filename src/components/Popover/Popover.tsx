import React, { useId, useRef } from 'react'
import { cn } from '../../lib/utils'
import { useControllableState, useDismiss } from '../../lib/hooks'

export interface PopoverRenderApi {
  close: () => void
}

export interface PopoverProps {
  /** Element that toggles the popover. It receives onClick and the aria-expanded/controls props. */
  trigger: React.ReactElement<React.HTMLAttributes<HTMLElement>>
  children: React.ReactNode | ((api: PopoverRenderApi) => React.ReactNode)
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  /** ARIA role of the floating panel. */
  role?: 'dialog' | 'menu' | 'listbox'
  'aria-label'?: string
  className?: string
  containerClassName?: string
  /** Called once the panel is shown, with the panel element (useful to move focus). */
  onOpenAutoFocus?: (panel: HTMLDivElement) => void
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>
}

const sideClasses = {
  bottom: 'top-full mt-2',
  top: 'bottom-full mb-2',
}

const alignClasses = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
}

export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  role = 'dialog',
  className,
  containerClassName,
  onOpenAutoFocus,
  onKeyDown,
  ...props
}: PopoverProps) {
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  const close = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) {
      containerRef.current?.querySelector<HTMLElement>('[data-popover-trigger]')?.focus()
    }
  }

  useDismiss(containerRef, open, (reason) => close(reason === 'escape'))

  const triggerProps = trigger.props
  const clonedTrigger = React.cloneElement(trigger, {
    'aria-expanded': open,
    'aria-haspopup': role === 'dialog' ? 'dialog' : role,
    'aria-controls': open ? panelId : undefined,
    'data-popover-trigger': '',
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      triggerProps.onClick?.(e)
      if (!e.defaultPrevented) setOpen(!open)
    },
  } as React.HTMLAttributes<HTMLElement>)

  return (
    <div ref={containerRef} className={cn('relative inline-flex', containerClassName)}>
      {clonedTrigger}
      {open && (
        <div
          id={panelId}
          role={role}
          aria-label={props['aria-label']}
          ref={(el) => {
            if (el && onOpenAutoFocus && !el.dataset.focused) {
              el.dataset.focused = 'true'
              onOpenAutoFocus(el)
            }
          }}
          onKeyDown={onKeyDown}
          className={cn(
            'ui-popover dl-animate-pop absolute z-50',
            sideClasses[side],
            alignClasses[align],
            className
          )}>
          {typeof children === 'function' ? children({ close: () => close(true) }) : children}
        </div>
      )}
    </div>
  )
}
