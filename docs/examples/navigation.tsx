import React, { useState } from 'react'
import {
  BookOpen,
  Grid3x3,
  Home,
  Layers,
  LayoutDashboard,
  List,
  LogOut,
  Settings,
  User,
} from 'lucide-react'
import {
  AppSwitcher,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  MenuItem,
  MenuSeparator,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PillNav,
  PillNavLink,
  SegmentedControl,
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  UserMenu,
} from '@furlab/dynamic-lab'

export function AppSwitcherExample() {
  const [app, setApp] = useState('lab')
  return (
    <div className="flex items-center gap-4">
      <AppSwitcher
        value={app}
        onValueChange={setApp}
        align="start"
        apps={[
          { id: 'lab', name: 'Dynamic Lab', description: 'Public site and your dashboards' },
          { id: 'backstage', name: 'Backstage', description: 'Staff administration' },
        ]}
      />
      <span className="body-sm text-[var(--muted-foreground)]">Current: {app}</span>
    </div>
  )
}

export function UserMenuExample() {
  return (
    <UserMenu
      name="Maya Lin"
      email="maya@example.com"
      meta={<Badge size="sm">Creator</Badge>}
      align="start">
      <MenuItem icon={<LayoutDashboard />}>Dashboard</MenuItem>
      <MenuItem icon={<User />}>Profile</MenuItem>
      <MenuSeparator />
      <MenuItem icon={<LogOut />}>Sign out</MenuItem>
    </UserMenu>
  )
}

export function SidebarExample() {
  const [page, setPage] = useState('content')
  const labels: Record<string, string> = {
    overview: 'Overview',
    content: 'Content',
    library: 'Library',
    settings: 'Settings',
  }
  return (
    <SidebarNav
      title="Creator Lab"
      collapsible
      currentLabel={labels[page]}
      aria-label="Creator Lab">
      <SidebarNavGroup label="Your space">
        <SidebarNavItem
          icon={<Home />}
          active={page === 'overview'}
          onClick={() => setPage('overview')}>
          Overview
        </SidebarNavItem>
        <SidebarNavItem
          icon={<BookOpen />}
          active={page === 'content'}
          badge={12}
          onClick={() => setPage('content')}>
          Content
        </SidebarNavItem>
        <SidebarNavItem
          icon={<Layers />}
          active={page === 'library'}
          onClick={() => setPage('library')}>
          Library
        </SidebarNavItem>
      </SidebarNavGroup>
      <SidebarNavGroup label="Account">
        <SidebarNavItem
          icon={<Settings />}
          active={page === 'settings'}
          onClick={() => setPage('settings')}>
          Settings
        </SidebarNavItem>
      </SidebarNavGroup>
    </SidebarNav>
  )
}

export function PillNavExample() {
  const [active, setActive] = useState('overview')
  return (
    <PillNav aria-label="Lab sections">
      {['overview', 'content', 'members', 'settings'].map((id) => (
        <PillNavLink
          key={id}
          active={active === id}
          onClick={() => setActive(id)}
          className="capitalize">
          {id}
        </PillNavLink>
      ))}
    </PillNav>
  )
}

export function TabsExample() {
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="body-sm">
          Pill tabs switch views inside a panel.
        </TabsContent>
        <TabsContent value="history" className="body-sm">
          Three edits this week.
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="works" variant="line">
        <TabsList>
          <TabsTrigger value="works">Creations</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="works" className="body-sm">
          Line tabs are for top-level sections of a page.
        </TabsContent>
        <TabsContent value="about" className="body-sm">
          About this creator.
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function BreadcrumbExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Browse</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Comics</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Moth &amp; Lantern</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function PaginationExample() {
  const [page, setPage] = useState(1)
  const total = 5
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious disabled={page === 1} onClick={() => setPage(page - 1)} />
        </PaginationItem>
        {[1, 2, 3].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink isActive={page === n} onClick={() => setPage(n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={page === total} onClick={() => setPage(total)}>
            {total}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext disabled={page === total} onClick={() => setPage(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function SegmentedExample() {
  const [view, setView] = useState('grid')
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SegmentedControl
        aria-label="View"
        value={view}
        onValueChange={setView}
        options={[
          { value: 'grid', label: 'Grid', icon: <Grid3x3 /> },
          { value: 'list', label: 'List', icon: <List /> },
        ]}
      />
      <SegmentedControl
        size="sm"
        aria-label="Range"
        defaultValue="7d"
        options={[
          { value: '24h', label: '24h' },
          { value: '7d', label: '7 days' },
          { value: '30d', label: '30 days' },
        ]}
      />
    </div>
  )
}
