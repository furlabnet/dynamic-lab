import React, { createContext, useContext, useState } from 'react'
import { cn } from '../../lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (val: string) => void
  variant: 'pill' | 'line'
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: 'pill' | 'line'
}

export function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = 'pill',
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || '')
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = (newVal: string) => {
    if (!isControlled) {
      setUncontrolledValue(newVal)
    }
    onValueChange?.(newVal)
  }

  return (
    <TabsContext.Provider
      value={{ value: currentValue, onValueChange: handleValueChange, variant }}>
      <div className={cn('flex flex-col gap-3 w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const context = useContext(TabsContext)
  const variant = context?.variant || 'pill'

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center',
        variant === 'pill'
          ? 'p-1 gap-1 rounded-[var(--radius-full)] bg-[color-mix(in_srgb,var(--card)_70%,transparent)] border border-[var(--border)] surface-card'
          : 'gap-6 border-b border-[var(--border)]',
        className
      )}
      {...props}>
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  icon?: React.ReactNode
}

export function TabsTrigger({ className, value, icon, children, ...props }: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const isSelected = context.value === value
  const variant = context.variant

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center gap-2 text-sm font-semibold transition-all select-none cursor-pointer',
        variant === 'pill' && [
          'px-4 py-1.5 rounded-[var(--radius-full)]',
          isSelected
            ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]',
        ],
        variant === 'line' && [
          'pb-3 pt-1 border-b-2 -mb-px px-1 font-medium',
          isSelected
            ? 'border-[var(--primary)] text-[var(--primary)] font-bold'
            : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]',
        ],
        className
      )}
      {...props}>
      {icon && <span className="inline-flex shrink-0 size-4">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  if (context.value !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn(
        'pt-2 focus-visible:outline-none animate-in fade-in-50 duration-150',
        className
      )}
      {...props}>
      {children}
    </div>
  )
}
