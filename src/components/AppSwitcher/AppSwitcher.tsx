import React, { useState, useRef, useEffect } from 'react'
import { LayoutGrid, Check, ExternalLink } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface AppItem {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  href?: string
  active?: boolean
  onClick?: () => void
}

export interface AppSwitcherProps {
  apps?: AppItem[]
  currentAppId?: string
  className?: string
}

export const defaultApps: AppItem[] = [
  {
    id: 'lab',
    name: 'Dynamic Lab',
    description: 'Component system & visual lab',
    active: true,
  },
  {
    id: 'backstage',
    name: 'Backstage',
    description: 'Management & orchestration console',
  },
  {
    id: 'stories',
    name: 'Stories Studio',
    description: 'Content editor and publisher',
  },
  {
    id: 'assets',
    name: 'Asset Vault',
    description: 'Media, tokens and SVG icons',
  },
]

export function AppSwitcher({ apps = defaultApps, currentAppId = 'lab', className }: AppSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="App switcher"
        className="grid size-11 place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-all cursor-pointer shadow-xs">
        <LayoutGrid className="size-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-[var(--radius-2xl)] border border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--card)_88%,transparent)] p-2 shadow-xl backdrop-blur-[var(--blur-chrome)] z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Apps & Workspaces
          </div>
          <div className="flex flex-col gap-1">
            {apps.map((app) => {
              const isActive = app.active || app.id === currentAppId
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    app.onClick?.()
                    setIsOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-between w-full p-2.5 rounded-[var(--radius-lg)] text-left transition-colors',
                    isActive
                      ? 'bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)] font-semibold'
                      : 'hover:bg-[var(--muted)] text-[var(--foreground)]'
                  )}>
                  <div className="flex flex-col">
                    <span className="text-sm">{app.name}</span>
                    {app.description && (
                      <span className="text-xs text-[var(--muted-foreground)] font-normal">
                        {app.description}
                      </span>
                    )}
                  </div>
                  {isActive ? (
                    <Check className="size-4 shrink-0 text-[var(--primary)]" />
                  ) : (
                    <ExternalLink className="size-3.5 shrink-0 opacity-40" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
