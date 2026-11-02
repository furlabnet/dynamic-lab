import React from 'react'

export interface AppItem {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  /** When set, choosing the app navigates here instead of only calling onValueChange. */
  href?: string
  onClick?: () => void
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
