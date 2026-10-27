import React, { createContext, useContext, useState } from 'react'
import { ChevronDown } from 'lucide-react'
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

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

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
        'flex flex-1 items-center justify-between py-3.5 px-2 text-left font-semibold text-sm transition-all hover:text-[var(--primary)] [&[aria-expanded=true]>svg]:rotate-180 w-full cursor-pointer select-none',
        className
      )}
      {...props}>
      {children}
      <ChevronDown className="size-4 shrink-0 transition-transform duration-200 opacity-60" />
    </button>
  )
}

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

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
        'px-2 pb-4 pt-1 text-sm text-[var(--muted-foreground)] leading-relaxed animate-in fade-in-50 duration-150',
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
  trigger: React.ReactNode
}

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  trigger,
  children,
  className,
  ...props
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const handleToggle = () => {
    const next = !isOpen
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-150">{children}</div>
      )}
    </div>
  )
}
