'use client'

import React, { createContext, useContext, useId, useState } from 'react'

import { ChevronDown } from 'lucide-react'

import { useControllableState } from '../../lib/hooks'
import { cn } from '../../lib/utils'

interface AccordionContextValue {
  expandedItems: string[]
  toggleItem: (id: string) => void
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

export function Accordion({
  type = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
    if (defaultValue) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
    }
    return []
  })

  const isControlled = controlledValue !== undefined
  const currentExpanded = isControlled
    ? Array.isArray(controlledValue)
      ? controlledValue
      : [controlledValue]
    : internalExpanded

  const toggleItem = (id: string) => {
    let next: string[]
    if (type === 'single') {
      next = currentExpanded.includes(id) ? [] : [id]
    } else {
      next = currentExpanded.includes(id)
        ? currentExpanded.filter((item) => item !== id)
        : [...currentExpanded, id]
    }

    if (!isControlled) {
      setInternalExpanded(next)
    }

    onValueChange?.(type === 'single' ? next[0] || '' : next)
  }

  return (
    <AccordionContext.Provider value={{ expandedItems: currentExpanded, toggleItem }}>
      <div
        className={cn('divide-y divide-[var(--border)] border-y border-[var(--border)]', className)}
        {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextValue {
  id: string
}

const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined)

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ id: value }}>
      <div className={cn('py-1', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
}

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const accordionContext = useContext(AccordionContext)
  const itemContext = useContext(AccordionItemContext)

  if (!accordionContext || !itemContext) {
    throw new Error('AccordionTrigger must be used within AccordionItem and Accordion')
  }

  const isExpanded = accordionContext.expandedItems.includes(itemContext.id)

  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      onClick={() => accordionContext.toggleItem(itemContext.id)}
      className={cn(
        'flex w-full flex-1 cursor-pointer items-center justify-between px-2 py-3.5 text-left text-sm font-semibold transition-all select-none hover:text-[var(--primary)] [&[aria-expanded=true]>svg]:rotate-180',
        className
      )}
      {...props}>
      {children}
      <ChevronDown className="size-4 shrink-0 opacity-60 transition-transform duration-200" />
    </button>
  )
}

export type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>

export function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const accordionContext = useContext(AccordionContext)
  const itemContext = useContext(AccordionItemContext)

  if (!accordionContext || !itemContext) {
    throw new Error('AccordionContent must be used within AccordionItem and Accordion')
  }

  const isExpanded = accordionContext.expandedItems.includes(itemContext.id)

  if (!isExpanded) return null

  return (
    <div
      className={cn(
        'animate-in fade-in-50 px-2 pt-1 pb-4 text-sm leading-relaxed text-[var(--muted-foreground)] duration-150',
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * What toggles the content. A button element gets the toggle handler and aria-expanded added;
   * text or anything else is wrapped in a button, so it always works with the keyboard.
   */
  trigger: React.ReactNode
}

/** One section that shows and hides its content, with a trigger you supply. */
export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  children,
  className,
  ...props
}: CollapsibleProps) {
  const [isOpen, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange)
  const contentId = useId()

  const toggleProps = {
    'aria-expanded': isOpen,
    'aria-controls': contentId,
  }

  const isButton =
    React.isValidElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(trigger) &&
    trigger.type === 'button'

  const triggerNode = isButton ? (
    React.cloneElement(trigger, {
      ...toggleProps,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        trigger.props.onClick?.(e)
        if (!e.defaultPrevented) setOpen(!isOpen)
      },
    })
  ) : (
    <button
      type="button"
      {...toggleProps}
      onClick={() => setOpen(!isOpen)}
      className="inline-flex items-center gap-1.5 self-start rounded-[var(--radius-sm)] text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]">
      {trigger}
    </button>
  )

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      {triggerNode}
      <div id={contentId} hidden={!isOpen} className={cn(isOpen && 'dl-animate-fade')}>
        {children}
      </div>
    </div>
  )
}
