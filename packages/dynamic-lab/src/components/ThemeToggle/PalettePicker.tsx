import React, { useRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { focusSibling } from '../../lib/hooks'
import { useTheme } from '../../theme/ThemeProvider'
import { paletteStyle, type Palette } from '../../theme/palettes'
import type { ThemeMode } from '../../theme/tokens'

export interface PalettePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  palette: Palette
  mode: ThemeMode
  /** `mini` is a thumbnail; `full` is a small mock page with header, text, buttons and a card. */
  size?: 'mini' | 'full'
}

/**
 * A palette rendered in isolation: its tokens are scoped to this element, so many previews can
 * sit side by side regardless of the active theme.
 */
export function PalettePreview({
  palette,
  mode,
  size = 'mini',
  className,
  style,
  ...props
}: PalettePreviewProps) {
  return (
    <div
      data-mode={mode}
      className={cn('ui-palette-preview', size === 'full' && 'ui-palette-preview-full', className)}
      style={{ ...paletteStyle(palette, mode), ...style }}
      aria-hidden
      {...props}>
      <div className="ui-palette-preview-glow" />
      <div className="ui-palette-preview-bar">
        <span className="ui-palette-preview-dot" />
        <span className="ui-palette-preview-line w-10" />
        {size === 'full' && (
          <>
            <span className="ui-palette-preview-line ml-auto w-6" />
            <span className="ui-palette-preview-line w-6" />
          </>
        )}
      </div>
      <div className="ui-palette-preview-body">
        {size === 'full' && <span className="ui-palette-preview-eyebrow">{palette.species}</span>}
        <span className="ui-palette-preview-title" />
        {size === 'full' && <span className="ui-palette-preview-line w-3/4" />}
        <div className="flex items-center gap-1.5">
          <span className="ui-palette-preview-button" />
          <span className="ui-palette-preview-button ui-palette-preview-button-secondary" />
        </div>
        {size === 'full' && (
          <div className="ui-palette-preview-card">
            <span className="ui-palette-preview-chip" />
            <span className="ui-palette-preview-line w-2/3" />
            <span className="ui-palette-preview-line w-1/2 opacity-60" />
          </div>
        )}
      </div>
    </div>
  )
}

export interface PalettePickerProps {
  /** `cards` shows a preview, name and description; `compact` is a dense grid for menus. */
  variant?: 'cards' | 'compact'
  /** Preview both modes side by side (cards only). Defaults to the current mode. */
  showBothModes?: boolean
  className?: string
}

/** Choose a named colour theme. Reads and writes ThemeProvider's palette. */
export function PalettePicker({
  variant = 'cards',
  showBothModes = false,
  className,
}: PalettePickerProps) {
  const { palette, setPalette, palettes, mode, paletteActive } = useTheme()
  const ref = useRef<HTMLDivElement>(null)

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = ['ArrowRight', 'ArrowDown'].includes(e.key)
      ? 'next'
      : ['ArrowLeft', 'ArrowUp'].includes(e.key)
        ? 'prev'
        : null
    if (!dir) return
    e.preventDefault()
    focusSibling(ref.current, '[role="radio"]', dir)
    const id = (document.activeElement as HTMLElement | null)?.dataset.palette
    if (id) setPalette(id)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Colour theme"
        onKeyDown={onKeyDown}
        className={cn(
          'grid gap-2',
          variant === 'compact' ? 'grid-cols-4' : 'grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4'
        )}>
        {palettes.map((p) => {
          const selected = p.id === palette
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${p.name}: ${p.description}`}
              title={variant === 'compact' ? p.name : undefined}
              data-palette={p.id}
              tabIndex={selected ? 0 : -1}
              onClick={() => setPalette(p.id)}
              className={cn(
                'ui-palette-option',
                variant === 'compact' ? 'ui-palette-option-compact' : 'ui-palette-option-card'
              )}>
              {variant === 'compact' ? (
                <>
                  <PalettePreview palette={p} mode={mode} />
                  <span className="line-clamp-2 text-[11px] font-semibold leading-tight">
                    {p.name}
                  </span>
                </>
              ) : (
                <>
                  <div
                    className={cn('grid gap-1.5', showBothModes ? 'grid-cols-2' : 'grid-cols-1')}>
                    {showBothModes ? (
                      <>
                        <PalettePreview palette={p} mode="light" />
                        <PalettePreview palette={p} mode="dark" />
                      </>
                    ) : (
                      <PalettePreview palette={p} mode={mode} />
                    )}
                  </div>
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold">{p.name}</span>
                    {selected && <Check className="size-4 text-[var(--primary)]" aria-hidden />}
                  </span>
                  <span className="text-left text-xs text-[var(--muted-foreground)]">
                    {p.description}
                  </span>
                </>
              )}
            </button>
          )
        })}
      </div>
      {!paletteActive && (
        <p className="text-xs text-[var(--muted-foreground)]">
          Themes apply to the public site. This area keeps its own colours.
        </p>
      )}
    </div>
  )
}
