import React from 'react'

import type { Palette } from '../../theme/palettes'
import type { ThemeMode } from '../../theme/tokens'
import { cn } from '../../lib/utils'
import { paletteStyle } from '../../theme/palettes'

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
