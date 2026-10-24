import React from 'react'
import { Sun, Moon, Palette } from 'lucide-react'
import { useTheme } from '../../theme/ThemeProvider'
import { cn } from '../../lib/utils'

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showBrandToggle?: boolean
}

export function ThemeToggle({ className, showBrandToggle = false, ...props }: ThemeToggleProps) {
  const { mode, brand, toggleMode, toggleBrand } = useTheme()

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggleMode}
        title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
        aria-label="Toggle theme mode"
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-all cursor-pointer shadow-xs active:scale-95',
          className
        )}
        {...props}>
        {mode === 'light' ? (
          <Moon className="size-5 transition-transform" />
        ) : (
          <Sun className="size-5 transition-transform text-amber-400" />
        )}
      </button>

      {showBrandToggle && (
        <button
          type="button"
          onClick={toggleBrand}
          title={`Switch to ${brand === 'dynamic' ? 'backstage' : 'dynamic'} style`}
          aria-label="Toggle theme brand"
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-all cursor-pointer shadow-xs active:scale-95">
          <Palette className="size-5" />
        </button>
      )}
    </div>
  )
}
