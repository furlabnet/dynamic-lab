import React from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useControllableState } from '../../lib/hooks'

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'defaultChecked'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  description?: string
}

export function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  className,
  disabled,
  ...props
}: SwitchProps) {
  const [checked, setChecked] = useControllableState(checkedProp, defaultChecked, onCheckedChange)

  return (
    <label className={cn('inline-flex items-start gap-3 select-none cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => setChecked(!checked)}
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
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>}
          {description && <span className="text-xs text-[var(--muted-foreground)]">{description}</span>}
        </span>
      )}
    </label>
  )
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode
  description?: string
  /** Shows a dash, e.g. for a "select all" box when only some rows are selected. */
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}

/** Works controlled (`checked` + `onChange`/`onCheckedChange`) or uncontrolled (`defaultChecked`). */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, description, checked, onChange, onCheckedChange, indeterminate = false, disabled, id, ...props },
    ref
  ) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId
    const innerRef = React.useRef<HTMLInputElement>(null)
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate
    }, [indeterminate])

    return (
      <label
        htmlFor={checkboxId}
        className={cn('inline-flex items-start gap-2.5 select-none cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
        <span className="relative mt-px flex items-center justify-center">
          <input
            ref={innerRef}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              onChange?.(e)
              onCheckedChange?.(e.target.checked)
            }}
            disabled={disabled}
            data-indeterminate={indeterminate || undefined}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'ui-checkbox grid size-5 place-items-center rounded-[var(--radius-sm)] border border-[var(--input)] bg-[var(--card)] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-checked:bg-[var(--primary)] peer-checked:border-[var(--primary)] peer-data-[indeterminate]:bg-[var(--primary)] peer-data-[indeterminate]:border-[var(--primary)]',
              className
            )}>
            {indeterminate ? (
              <Minus className="size-3.5 text-[var(--primary-foreground)] stroke-[3]" />
            ) : (
              <Check className="ui-checkbox-check size-3.5 text-[var(--primary-foreground)] stroke-[3]" />
            )}
          </span>
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>}
            {description && <span className="text-xs text-[var(--muted-foreground)]">{description}</span>}
          </span>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: boolean | string
  options?: Array<{ value: string; label: string }>
  /** Classes for the wrapper around the label and control. */
  containerClassName?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, label, error, options, children, id, ...props }, ref) => {
    const generatedId = React.useId()
    const selectId = id || generatedId

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
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
