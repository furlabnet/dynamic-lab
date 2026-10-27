import React, { useState } from 'react'
import { Bookmark, Plus, Settings, Share2, Sparkles, Trash2 } from 'lucide-react'
import {
  AppearanceSettings,
  Button,
  IconButton,
  PalettePicker,
  ThemeToggle,
  Tooltip,
  TransparencyControl,
} from '@furlab/dynamic-lab'

export function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Publish</Button>
      <Button variant="secondary">Save draft</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="danger">Delete for good</Button>
      <Button variant="danger-outline">Move to trash</Button>
    </div>
  )
}

export function ButtonStates() {
  const [loading, setLoading] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="lg" leftIcon={<Sparkles className="size-4" />}>
        Large with icon
      </Button>
      <Button
        loading={loading}
        onClick={() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 1500)
        }}>
        {loading ? 'Saving…' : 'Click to load'}
      </Button>
      <Button variant="secondary" disabled>
        Disabled
      </Button>
    </div>
  )
}

export function IconButtons() {
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tooltip content="Settings">
        <IconButton aria-label="Settings" icon={<Settings className="size-4" />} />
      </Tooltip>
      <Tooltip content="Add">
        <IconButton aria-label="Add" variant="primary" icon={<Plus className="size-4" />} />
      </Tooltip>
      <Tooltip content={saved ? 'Saved' : 'Save'} side="bottom">
        <IconButton
          aria-label="Save"
          aria-pressed={saved}
          variant="outline"
          icon={<Bookmark className={saved ? 'size-4 fill-current' : 'size-4'} />}
          onClick={() => setSaved(!saved)}
        />
      </Tooltip>
      <IconButton aria-label="Share" variant="ghost" icon={<Share2 className="size-4" />} />
      <IconButton
        aria-label="Delete"
        variant="danger-outline"
        icon={<Trash2 className="size-4" />}
      />
    </div>
  )
}

export function TooltipSides() {
  return (
    <div className="flex flex-wrap gap-3 py-6">
      {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
        <Tooltip key={side} content={`On the ${side}`} side={side}>
          <Button variant="secondary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  )
}

export function ThemeToggles() {
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <ThemeToggle variant="ghost" />
      <AppearanceSettings align="start" />
    </div>
  )
}

export function Palettes() {
  return <PalettePicker showBothModes />
}

export function PalettesCompact() {
  return (
    <div className="max-w-xs">
      <PalettePicker variant="compact" />
    </div>
  )
}

export function Transparency() {
  return (
    <div className="max-w-md">
      <TransparencyControl />
    </div>
  )
}
