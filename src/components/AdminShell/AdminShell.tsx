import React, { createContext, useContext, useEffect, useState } from 'react'
import { Menu as MenuIcon, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useControllableState, useScrollLock } from '../../lib/hooks'

interface AdminShellContextValue {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null)

export function useAdminShell() {
  const ctx = useContext(AdminShellContext)
  if (!ctx) throw new Error('useAdminShell must be used within AdminShell')
  return ctx
}

export interface AdminShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Usually an AdminSidebar. */
  sidebar: React.ReactNode
  /** Bar above the page content (breadcrumbs, app switcher). */
  topbar?: React.ReactNode
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

/**
 * Backstage-style console layout: a full-height sidebar on the left and a scrolling main area.
 * Below lg the sidebar becomes an off-canvas panel opened from the topbar's menu button.
 */
export function AdminShell({
  sidebar,
  topbar,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
  children,
  ...props
}: AdminShellProps) {
  const [collapsed, setCollapsed] = useControllableState(collapsedProp, defaultCollapsed, onCollapsedChange)
  const [mobileOpen, setMobileOpen] = useState(false)
  useScrollLock(mobileOpen)

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <AdminShellContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      <div
        data-collapsed={collapsed || undefined}
        data-mobile-open={mobileOpen || undefined}
        className={cn('ui-admin-shell', className)}
        {...props}>
        {mobileOpen && (
          <div className="ui-overlay dl-animate-fade fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}
        {sidebar}
        <div className="ui-admin-main">
          <div className="ui-admin-topbar">
            <button
              type="button"
              className="icon-button lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}>
              <MenuIcon className="size-4" />
            </button>
            {topbar}
          </div>
          <main className="ui-admin-content">{children}</main>
        </div>
      </div>
    </AdminShellContext.Provider>
  )
}

export interface AdminSidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Brand lockup at the top. */
  header?: React.ReactNode
  /** Slot under the header, e.g. a CommandTrigger. */
  search?: React.ReactNode
  /** Pinned to the bottom, e.g. the signed-in user. */
  footer?: React.ReactNode
}

export function AdminSidebar({ header, search, footer, className, children, ...props }: AdminSidebarProps) {
  const { collapsed, setCollapsed, setMobileOpen } = useAdminShell()

  return (
    <aside
      className={cn('ui-admin-sidebar', className)}
      onClick={(e) => {
        // Close the off-canvas panel after navigating.
        if ((e.target as HTMLElement).closest('.ui-nav-link')) setMobileOpen(false)
      }}
      {...props}>
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <div className="ui-nav-text min-w-0 flex-1">{header}</div>
        <button
          type="button"
          className="ui-sidebar-toggle hidden lg:inline-flex"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-pressed={collapsed}
          onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
        <button
          type="button"
          className="ui-sidebar-toggle lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}>
          <X className="size-4" />
        </button>
      </div>
      {search && <div className="px-3 pb-2">{search}</div>}
      <div className="flex-1 overflow-y-auto px-3 pb-4">{children}</div>
      {footer && <div className="ui-admin-sidebar-footer">{footer}</div>}
    </aside>
  )
}
