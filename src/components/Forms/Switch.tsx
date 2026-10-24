import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onCheckedChange, label, className, disabled, ...props }: SwitchProps) {
  return (
    <label className={cn('inline-flex items-center gap-3 select-none cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
          checked ? 'bg-[var(--primary)]' : 'bg-[var(--input)]',
          className
        )}
        {...props}>
        <span
          className={cn(
            'inline-block size-4.5 rounded-full bg-[var(--card)] shadow-md transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5.5' : 'translate-x-1'
          )}
        />
      </button>
      {label && <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>}
    </label>
  )
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, disabled, id, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId

    return (
      <label
        htmlFor={checkboxId}
        className={cn('inline-flex items-center gap-2.5 select-none cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
        <span className="relative flex items-center justify-center">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'grid size-5 place-items-center rounded-md border border-[var(--input)] bg-[var(--card)] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-checked:bg-[var(--primary)] peer-checked:border-[var(--primary)]',
              className
            )}>
            {checked && <Check className="size-3.5 text-[var(--primary-foreground)] stroke-[3]" />}
          </span>
        </span>
        {label && <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: boolean | string
  options?: Array<{ value: string; label: string }>
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, id, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = id || generatedId

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="button-sm text-[var(--foreground)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'form-input cursor-pointer',
            error && 'border-[var(--destructive)]',
            className
          )}
          {...props}>
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      </div>
    )
  }
)

Select.displayName = 'Select'
