import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useControllableState } from '../../lib/hooks'
import { DropdownMenu, MenuItem, MenuLabel } from '../Menu'

export interface AppItem {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  /** When set, choosing the app navigates here instead of only calling onValueChange. */
  href?: string
  onClick?: () => void
}

export interface AppSwitcherProps {
  apps?: AppItem[]
  /** Id of the current app (controlled). */
  value?: string
  defaultValue?: string
  onValueChange?: (appId: string) => void
  /** @deprecated use `value` / `defaultValue` */
  currentAppId?: string
  align?: 'start' | 'end'
  className?: string
}

export const defaultApps: AppItem[] = [
  {
    id: 'lab',
    name: 'Dynamic Lab',
    description: 'Public site and your dashboards',
  },
  {
    id: 'backstage',
    name: 'Backstage',
    description: 'Staff administration',
  },
]

function GridIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  )
}

export function AppSwitcher({
  apps = defaultApps,
  value,
  defaultValue,
  onValueChange,
  currentAppId,
  align = 'end',
  className,
}: AppSwitcherProps) {
  const [current, setCurrent] = useControllableState(
    value ?? currentAppId,
    defaultValue ?? apps[0]?.id ?? '',
    onValueChange
  )
  const currentApp = apps.find((app) => app.id === current) ?? apps[0]

  return (
    <DropdownMenu
      align={align}
      aria-label="Switch app"
      containerClassName={className}
      trigger={
        <button type="button" className="ui-app-switcher-trigger" aria-label={`Switch app, current: ${currentApp?.name}`}>
          <GridIcon />
          <span className="hidden sm:inline">{currentApp?.name}</span>
          <ChevronDown className="size-3.5 opacity-70" aria-hidden />
        </button>
      }>
      <MenuLabel>Switch app</MenuLabel>
      {apps.map((app) => {
        const isCurrent = app.id === currentApp?.id
        return (
          <MenuItem
            key={app.id}
            href={app.href as string}
            icon={app.icon}
            selected={isCurrent}
            aria-current={isCurrent ? 'page' : undefined}
            subtitle={app.description}
            onClick={() => {
              app.onClick?.()
              if (!isCurrent) setCurrent(app.id)
            }}>
            {app.name}
            {isCurrent && <span className="font-normal text-[var(--muted-foreground)]"> · current</span>}
          </MenuItem>
        )
      })}
    </DropdownMenu>
  )
}
