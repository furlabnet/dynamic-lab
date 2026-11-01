import React from 'react'

import { cn } from '../../lib/utils'

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
      <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
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
