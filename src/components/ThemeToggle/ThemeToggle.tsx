import React from 'react'
import { Sun, Moon, Palette } from 'lucide-react'
import { useTheme } from '../../theme/ThemeProvider'
import { cn } from '../../lib/utils'

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showBrandToggle?: boolean
  /** `outline` is a bordered 44px tile; `ghost` is a borderless icon for headers and sidebars. */
  variant?: 'outline' | 'ghost'
}

const variantClasses = {
  outline:
    'size-11 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xs hover:bg-[var(--muted)]',
  ghost:
    'size-9 rounded-[var(--radius-lg)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]',
}

export function ThemeToggle({ className, showBrandToggle = false, variant = 'outline', ...props }: ThemeToggleProps) {
  const { mode, brand, toggleMode, toggleBrand } = useTheme()
  const iconSize = variant === 'ghost' ? 'size-[18px]' : 'size-5'

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggleMode}
        title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        className={cn(
          'grid shrink-0 place-items-center text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] transition-all cursor-pointer active:scale-95',
          variantClasses[variant],
          className
        )}
        {...props}>
        {mode === 'light' ? (
          <Moon className={cn(iconSize, 'transition-transform')} />
        ) : (
          <Sun className={cn(iconSize, 'transition-transform', variant === 'outline' && 'text-amber-400')} />
        )}
      </button>

      {showBrandToggle && (
        <button
          type="button"
          onClick={toggleBrand}
          title={`Switch to ${brand === 'dynamic' ? 'backstage' : 'dynamic'} style`}
          aria-label="Toggle theme brand"
          className={cn(
            'grid shrink-0 place-items-center text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] transition-all cursor-pointer active:scale-95',
            variantClasses[variant]
          )}>
          <Palette className={iconSize} />
        </button>
      )}
    </div>
  )
}
