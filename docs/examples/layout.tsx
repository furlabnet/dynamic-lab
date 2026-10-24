import React, { useState } from 'react'
import { FileText, LayoutGrid, Search, Settings, Users } from 'lucide-react'
import {
  AdminShell,
  AdminSidebar,
  AppSwitcher,
  AuthCard,
  BrandLockup,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CommandTrigger,
  EditorActionBar,
  FormSection,
  MaintenanceNotice,
  NotFoundState,
  PageHeader,
  PageHeading,
  Panel,
  Separator,
  SidebarNavGroup,
  SidebarNavItem,
  SiteHeader,
  SiteNav,
  SiteNavLink,
  TextField,
  ThemeToggle,
  Toolbar,
} from '@furlab/dynamic-lab'

export function Panels() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel
        title="Recent activity"
        description="Panels group dashboard sections."
        actions={
          <Button size="sm" variant="ghost">
            View all
          </Button>
        }>
        <p className="body-sm text-[var(--muted-foreground)]">Three edits this week.</p>
      </Panel>
      <Card>
        <CardHeader>
          <CardTitle>The lighthouse keeper</CardTitle>
          <CardDescription>Cards hold a single piece of content.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="body-sm">A keeper logs ships that never arrive.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Read</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export function Headers() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        eyebrow="Discover"
        title="Browse creations"
        description="Marketing-style heading for public pages."
      />
      <PageHeader
        title="Content"
        description="Dashboard heading with actions."
        actions={
          <>
            <Button variant="secondary">Export</Button>
            <Button>New story</Button>
          </>
        }
      />
    </div>
  )
}

export function ToolbarExample() {
  return (
    <Toolbar label="Filter">
      <TextField placeholder="Search titles" aria-label="Search titles" className="min-w-48" />
      <Button variant="secondary" leftIcon={<Search className="size-4" />}>
        Search
      </Button>
      <span className="body-sm text-[var(--muted-foreground)]">3 selected</span>
    </Toolbar>
  )
}

export function Separators() {
  return (
    <div className="flex max-w-sm flex-col gap-4">
      <Separator />
      <Separator label="or" />
      <div className="flex h-8 items-center gap-3 text-sm">
        Left <Separator orientation="vertical" /> Right
      </div>
    </div>
  )
}

export function Forms() {
  const [title, setTitle] = useState('The lighthouse keeper')
  return (
    <div className="flex flex-col">
      <FormSection title="Basics" description="What people see in Browse.">
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormSection>
      <EditorActionBar
        dirty={title !== 'The lighthouse keeper'}
        className="relative! mt-6 rounded-[var(--radius-xl)] border">
        <Button variant="ghost" onClick={() => setTitle('The lighthouse keeper')}>
          Cancel
        </Button>
        <Button>Publish</Button>
      </EditorActionBar>
    </div>
  )
}

export function Header() {
  const [page, setPage] = useState('browse')
  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)]">
      <SiteHeader
        sticky={false}
        brand={<BrandLockup name="Dynamic Lab" />}
        nav={
          <SiteNav>
            {['home', 'browse', 'library'].map((id) => (
              <SiteNavLink
                key={id}
                active={page === id}
                onClick={() => setPage(id)}
                className="capitalize">
                {id}
              </SiteNavLink>
            ))}
          </SiteNav>
        }
        actions={<ThemeToggle variant="ghost" />}
      />
    </div>
  )
}

export function Console() {
  const [page, setPage] = useState('content')
  return (
    <AdminShell
      sidebar={
        <AdminSidebar
          header={<BrandLockup name="Dynamic Lab" product="Backstage" size="sm" />}
          search={<CommandTrigger />}>
          <SidebarNavGroup>
            <SidebarNavItem
              icon={<LayoutGrid />}
              active={page === 'overview'}
              onClick={() => setPage('overview')}>
              Overview
            </SidebarNavItem>
          </SidebarNavGroup>
          <SidebarNavGroup label="Library">
            <SidebarNavItem
              icon={<FileText />}
              active={page === 'content'}
              onClick={() => setPage('content')}>
              Content
            </SidebarNavItem>
            <SidebarNavItem
              icon={<Users />}
              active={page === 'users'}
              onClick={() => setPage('users')}>
              Users
            </SidebarNavItem>
            <SidebarNavItem
              icon={<Settings />}
              active={page === 'settings'}
              onClick={() => setPage('settings')}>
              Settings
            </SidebarNavItem>
          </SidebarNavGroup>
        </AdminSidebar>
      }
      topbar={<AppSwitcher className="ml-auto" />}>
      <PageHeader title="All content" />
    </AdminShell>
  )
}

export function Auth() {
  return (
    <AuthCard
      logo={<BrandLockup name="Dynamic Lab" />}
      title="Sign in"
      subtitle="Use your Dynamic Lab account.">
      <TextField label="Email" type="email" placeholder="name@example.com" />
      <TextField label="Password" type="password" />
      <Button className="w-full">Sign in</Button>
    </AuthCard>
  )
}

export function NotFound() {
  return (
    <NotFoundState
      title="Lost in the Lab?"
      description="We couldn't find that page."
      onHomeClick={() => {}}
    />
  )
}

export function Maintenance() {
  return (
    <MaintenanceNotice
      title="We'll be right back"
      description="Dynamic Lab is updating."
      actionText="Check status"
      onAction={() => {}}
    />
  )
}

export function Brand() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <BrandLockup name="Dynamic Lab" />
      <BrandLockup name="Dynamic Lab" product="Backstage" size="sm" />
    </div>
  )
}
