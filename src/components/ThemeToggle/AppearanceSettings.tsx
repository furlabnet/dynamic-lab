import React from 'react'
import { Moon, SlidersHorizontal, Sun } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTheme, type TransparencyPreference } from '../../theme/ThemeProvider'
import { Popover } from '../Popover'
import { SegmentedControl } from '../SegmentedControl'
import { PalettePicker } from './PalettePicker'

const TRANSPARENCY_HELP: Record<TransparencyPreference, string> = {
  system: 'Follows your device’s “reduce transparency” setting.',
  full: 'Frosted glass on menus, headers and cards.',
  reduced: 'Mostly solid surfaces with a light frost.',
  off: 'Solid surfaces, no blur and no background glow.',
}

export interface TransparencyControlProps {
  className?: string
  /** Show the explanation under the control. */
  showHelp?: boolean
  size?: 'sm' | 'md'
}

/** System / Full / Reduced / Off picker for glass transparency. */
export function TransparencyControl({
  className,
  showHelp = true,
  size = 'md',
}: TransparencyControlProps) {
  const { transparency, resolvedTransparency, setTransparency } = useTheme()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <SegmentedControl
        fullWidth
        size={size}
        aria-label="Transparency"
        value={transparency}
        onValueChange={(v) => setTransparency(v as TransparencyPreference)}
        options={[
          { value: 'system', label: 'System' },
          { value: 'full', label: 'Full' },
          { value: 'reduced', label: 'Reduced' },
          { value: 'off', label: 'Off' },
        ]}
      />
      {showHelp && (
        <p className="text-xs text-[var(--muted-foreground)]" aria-live="polite">
          {TRANSPARENCY_HELP[transparency]}
          {transparency === 'system' && ` Currently: ${resolvedTransparency}.`}
        </p>
      )}
    </div>
  )
}

export interface AppearanceSettingsProps {
  align?: 'start' | 'end'
  side?: 'top' | 'bottom'
  /** `icon` is a compact square trigger; `button` adds the "Appearance" label. */
  variant?: 'icon' | 'button'
  /** Link to a page with all the themes, shown under the picker. */
  themesHref?: string
  className?: string
}

/** Popover with colour mode and transparency, for headers and sidebars. */
export function AppearanceSettings({
  align = 'end',
  side = 'bottom',
  variant = 'icon',
  themesHref,
  className,
}: AppearanceSettingsProps) {
  const { mode, setMode, palette, palettes, paletteActive } = useTheme()
  return (
    <Popover
      align={align}
      side={side}
      aria-label="Appearance"
      containerClassName={className}
      className="ui-menu w-[22rem] max-w-[calc(100vw-1rem)] p-4!"
      trigger={
        <button
          type="button"
          aria-label="Appearance settings"
          title="Appearance"
          className={cn(
            'inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-lg)] text-[var(--muted-foreground)] transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)] hover:text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] aria-expanded:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]',
            variant === 'icon' ? 'size-9' : 'h-9 px-3 text-sm font-semibold'
          )}>
          <SlidersHorizontal className="size-[18px]" />
          {variant === 'button' && 'Appearance'}
        </button>
      }>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="flex items-baseline justify-between gap-2">
            <span className="button-sm">Colour theme</span>
            {paletteActive && (
              <span className="text-xs text-[var(--muted-foreground)]">
                {palettes.find((p) => p.id === palette)?.name}
              </span>
            )}
          </span>
          <PalettePicker variant="compact" />
          {themesHref && (
            <a
              href={themesHref}
              className="text-xs font-semibold text-[var(--primary)] hover:underline">
              See all themes →
            </a>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Mode</span>
          <SegmentedControl
            fullWidth
            aria-label="Mode"
            value={mode}
            onValueChange={(v) => setMode(v as 'light' | 'dark')}
            options={[
              { value: 'light', label: 'Light', icon: <Sun /> },
              { value: 'dark', label: 'Dark', icon: <Moon /> },
            ]}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="button-sm">Transparency</span>
          <TransparencyControl size="sm" />
        </div>
      </div>
    </Popover>
  )
}
