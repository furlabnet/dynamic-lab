import React from 'react'

import { cn } from '../../lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, startIcon, endIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex w-full items-center">
        {startIcon && (
          <span className="pointer-events-none absolute left-3.5 flex items-center text-[var(--muted-foreground)]">
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            'form-input',
            startIcon && 'pl-10',
            endIcon && 'pr-10',
            error && 'border-[var(--destructive)] focus:ring-[var(--destructive)]',
            disabled && 'cursor-not-allowed bg-[var(--muted)] opacity-50',
            className
          )}
          {...props}
        />
        {endIcon && (
          <span className="pointer-events-none absolute right-3.5 flex items-center text-[var(--muted-foreground)]">
            {endIcon}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, rows = 3, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn(
          'form-textarea',
          error && 'border-[var(--destructive)] focus:ring-[var(--destructive)]',
          disabled && 'cursor-not-allowed bg-[var(--muted)] opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export interface TextFieldProps extends Omit<InputProps, 'error'> {
  label?: string
  helperText?: string
  error?: string
  isTextarea?: boolean
  rows?: number
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, error, isTextarea = false, rows, id, className, ...props }, ref) => {
    const generatedId = React.useId()
    const inputId = id || generatedId

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="button-sm text-[var(--foreground)] select-none">
            {label}
          </label>
        )}
        {isTextarea ? (
          <Textarea
            id={inputId}
            error={Boolean(error)}
            rows={rows}
            className={className}
            {...(props as TextareaProps)}
          />
        ) : (
          <Input ref={ref} id={inputId} error={Boolean(error)} className={className} {...props} />
        )}
        {error ? (
          <p className="text-xs font-medium text-[var(--destructive)]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--muted-foreground)]">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
