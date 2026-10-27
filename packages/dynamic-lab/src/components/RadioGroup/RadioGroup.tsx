import React, { createContext, useContext, useId } from 'react'
import { cn } from '../../lib/utils'
import { useControllableState } from '../../lib/hooks'

interface RadioGroupContextValue {
  name: string
  value: string
  setValue: (value: string) => void
  disabled?: boolean
  variant: 'default' | 'card'
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange' | 'defaultValue'
> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  label?: string
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
  /** `card` draws each option as a selectable tile. */
  variant?: 'default' | 'card'
}

export function RadioGroup({
  value,
  defaultValue = '',
  onValueChange,
  name,
  label,
  disabled,
  orientation = 'vertical',
  variant = 'default',
  className,
  children,
  ...props
}: RadioGroupProps) {
  const generatedName = useId()
  const [current, setCurrent] = useControllableState(value, defaultValue, onValueChange)

  return (
    <RadioGroupContext.Provider
      value={{
        name: name ?? generatedName,
        value: current,
        setValue: setCurrent,
        disabled,
        variant,
      }}>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn('flex flex-col gap-2', className)}
        {...props}>
        {label && <span className="button-sm text-[var(--foreground)]">{label}</span>}
        <div
          className={cn(
            'flex gap-2.5',
            orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
            variant === 'card' && orientation === 'horizontal' && '[&>*]:flex-1'
          )}>
          {children}
        </div>
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps {
  value: string
  label: React.ReactNode
  description?: React.ReactNode
  disabled?: boolean
  className?: string
}

export function RadioGroupItem({
  value,
  label,
  description,
  disabled,
  className,
}: RadioGroupItemProps) {
  const group = useContext(RadioGroupContext)
  if (!group) throw new Error('RadioGroupItem must be used within RadioGroup')

  const id = useId()
  const checked = group.value === value
  const isDisabled = disabled || group.disabled

  return (
    <label
      htmlFor={id}
      data-checked={checked || undefined}
      className={cn(
        'group flex cursor-pointer items-start gap-2.5 select-none',
        group.variant === 'card' && 'ui-radio-card',
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}>
      <input
        id={id}
        type="radio"
        name={group.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={() => group.setValue(value)}
        className="peer sr-only"
      />
      <span className="ui-radio mt-0.5" aria-hidden />
      <span className="flex flex-col">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        {description && (
          <span className="text-xs text-[var(--muted-foreground)]">{description}</span>
        )}
      </span>
    </label>
  )
}
