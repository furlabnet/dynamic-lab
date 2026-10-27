import React, { useEffect, useState } from 'react'

import {
  Bell,
  Bookmark,
  BookOpen,
  Copy,
  FileCode,
  Filter,
  Grid3x3,
  Home,
  Layers,
  LayoutDashboard,
  List,
  LogOut,
  Palette,
  Pencil,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Trash2,
  User,
  Wrench,
} from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AppearanceSettings,
  AppSwitcher,
  AuthCard,
  Badge,
  BrandLockup,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Checkbox,
  type CommandItem,
  CommandPalette,
  CommandTrigger,
  ContentCard,
  Dialog,
  Drawer,
  DropdownMenu,
  EmptyState,
  FileInput,
  FilterChip,
  IconButton,
  Kbd,
  LocalDateTime,
  MaintenanceNotice,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MetricCard,
  NotFoundState,
  NoticePanel,
  PageHeader,
  PageHeading,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PalettePicker,
  Panel,
  PillNav,
  PillNavLink,
  Popover,
  ProfileAvatar,
  Progress,
  RadioGroup,
  RadioGroupItem,
  SegmentedControl,
  Select,
  Separator,
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
  SiteBanner,
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  Spinner,
  StatusBadge,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
  ThemeToggle,
  Toolbar,
  Tooltip,
  UserMenu,
  useTheme,
  useToast,
  WorkflowTimeline,
  WorkflowTimelineItem,
} from '@furlab/dynamic-lab'
import { APPS, useShowcase } from '../state'

const SECTIONS = [
  { id: 'themes', label: 'Themes' },
  { id: 'actions', label: 'Actions' },
  { id: 'menus', label: 'Menus & overlays' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'forms', label: 'Forms' },
  { id: 'feedback', label: 'Status & feedback' },
  { id: 'data', label: 'Data display' },
  { id: 'layout', label: 'Layout & pages' },
]

function Section({
  id,
  title,
  hint,
  children,
}: {
  id: string
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section id={`gallery-${id}`} className="flex scroll-mt-24 flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[var(--border)] pb-2">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {hint && <span className="text-xs text-[var(--muted-foreground)]">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

export function ComponentGallery() {
  const { brand, mode } = useTheme()
  const { app, navigate } = useShowcase()
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <PageHeading
          eyebrow="Dynamic Lab design system"
          title="Component library"
          description="Every component, live and interactive. The same code renders in both apps: switch with the app switcher to compare the Dynamic and Backstage themes."
        />
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="success" pulse>
            {brand === 'backstage' ? 'Backstage' : 'Dynamic'} · {mode}
          </StatusBadge>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(app === 'lab' ? 'backstage/design-system' : 'lab/components')}>
            View in {app === 'lab' ? 'Backstage' : 'Dynamic Lab'}
          </Button>
        </div>
        <nav aria-label="Gallery sections" className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <FilterChip
              key={s.id}
              onClick={() =>
                document
                  .getElementById(`gallery-${s.id}`)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }>
              {s.label}
            </FilterChip>
          ))}
        </nav>
      </div>

      <ThemesSection />
      <ActionsSection />
      <MenusSection />
      <NavigationSection />
      <FormsSection />
      <FeedbackSection />
      <DataSection />
      <LayoutSection
        onToast={(title) => toast({ title, description: 'Fired from the gallery.', tone: 'info' })}
      />
    </div>
  )
}

/* -------------------------------------------------------------- Themes */

function ThemesSection() {
  return (
    <Section
      id="themes"
      title="Colour themes"
      hint="PalettePicker, PalettePreview, AppearanceSettings, TransparencyControl">
      <Panel
        title="PalettePicker"
        description="Named themes, each with a light and a dark version. Picking one recolours the public site."
        actions={<AppearanceSettings themesHref="#/lab/themes" />}>
        <PalettePicker showBothModes />
      </Panel>
    </Section>
  )
}

/* ------------------------------------------------------------- Actions */

function ActionsSection() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  return (
    <Section id="actions" title="Actions" hint="Button, IconButton, ThemeToggle, Tooltip">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Button variants">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Publish</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="outline">Preview</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Delete for good</Button>
            <Button variant="danger-outline">Move to trash</Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center gap-3">
            <Button
              loading={loading}
              leftIcon={<Sparkles className="size-4" />}
              onClick={() => {
                setLoading(true)
                setTimeout(() => setLoading(false), 1500)
              }}>
              {loading ? 'Publishing…' : 'Click to load'}
            </Button>
            <Button
              variant="secondary"
              leftIcon={
                <Bookmark
                  className={saved ? 'size-4 fill-current text-[var(--primary)]' : 'size-4'}
                />
              }
              aria-pressed={saved}
              onClick={() => setSaved((v) => !v)}>
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
          </div>
        </Panel>

        <Panel
          title="Sizes, icon buttons and tooltips"
          description="Hover or focus an icon button.">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center gap-3">
            <Tooltip content="Settings">
              <IconButton aria-label="Settings" icon={<Settings className="size-4" />} />
            </Tooltip>
            <Tooltip content="Add item">
              <IconButton
                aria-label="Add item"
                variant="primary"
                icon={<Plus className="size-4" />}
              />
            </Tooltip>
            <Tooltip content="Share" side="bottom">
              <IconButton
                aria-label="Share"
                variant="outline"
                icon={<Share2 className="size-4" />}
              />
            </Tooltip>
            <Tooltip content="Delete">
              <IconButton
                aria-label="Delete"
                variant="danger-outline"
                icon={<Trash2 className="size-4" />}
              />
            </Tooltip>
            <Separator orientation="vertical" className="h-8" />
            <ThemeToggle />
            <ThemeToggle variant="ghost" />
          </div>
        </Panel>
      </div>
    </Section>
  )
}

/* ---------------------------------------------------- Menus & overlays */

function MenusSection() {
  const { app, navigate } = useShowcase()
  const { toast } = useToast()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerSide, setDrawerSide] = useState<'left' | 'right' | 'bottom' | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [sort, setSort] = useState('newest')
  const [demoApp, setDemoApp] = useState('lab')

  const commands: CommandItem[] = [
    {
      id: 'new',
      label: 'New story',
      group: 'Create',
      icon: <Plus />,
      shortcut: ['N'],
      onSelect: () =>
        toast({ title: 'New story', description: 'Picked from the palette.', tone: 'success' }),
    },
    {
      id: 'dup',
      label: 'Duplicate',
      group: 'Create',
      icon: <Copy />,
      onSelect: () => toast({ title: 'Duplicated', description: 'Picked from the palette.' }),
    },
    {
      id: 'home',
      label: 'Go home',
      group: 'Navigate',
      icon: <Home />,
      onSelect: () => navigate('lab/home'),
    },
    {
      id: 'settings',
      label: 'Open settings',
      group: 'Navigate',
      icon: <Settings />,
      keywords: ['preferences'],
      onSelect: () => navigate('backstage/settings'),
    },
  ]

  return (
    <Section
      id="menus"
      title="Menus & overlays"
      hint="DropdownMenu, AppSwitcher, UserMenu, Popover, Dialog, Drawer, CommandPalette, Toast">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Dropdown menu" description="Arrow keys move, Esc closes.">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu align="start" trigger={<Button variant="secondary">Actions</Button>}>
              <MenuItem
                icon={<Pencil />}
                trailing={<Kbd>E</Kbd>}
                onClick={() => toast({ title: 'Edit', description: 'Menu item chosen.' })}>
                Edit
              </MenuItem>
              <MenuItem
                icon={<Copy />}
                trailing={<Kbd>D</Kbd>}
                onClick={() => toast({ title: 'Duplicate', description: 'Menu item chosen.' })}>
                Duplicate
              </MenuItem>
              <MenuItem
                icon={<Share2 />}
                subtitle="Anyone with the link"
                onClick={() =>
                  toast({ title: 'Link copied', description: 'Menu item chosen.', tone: 'success' })
                }>
                Share
              </MenuItem>
              <MenuSeparator />
              <MenuItem
                danger
                icon={<Trash2 />}
                onClick={() =>
                  toast({
                    title: 'Moved to trash',
                    description: 'Menu item chosen.',
                    tone: 'destructive',
                  })
                }>
                Move to trash
              </MenuItem>
            </DropdownMenu>
            <DropdownMenu
              align="start"
              trigger={
                <Button variant="ghost" leftIcon={<Filter className="size-4" />}>
                  Sort: {sort === 'newest' ? 'Newest' : sort === 'oldest' ? 'Oldest' : 'A–Z'}
                </Button>
              }>
              <MenuLabel>Sort by</MenuLabel>
              {[
                ['newest', 'Newest first'],
                ['oldest', 'Oldest first'],
                ['alpha', 'Title A–Z'],
              ].map(([value, label]) => (
                <MenuItem key={value} selected={sort === value} onClick={() => setSort(value)}>
                  {label}
                </MenuItem>
              ))}
            </DropdownMenu>
          </div>
        </Panel>

        <Panel
          title="App switcher & user menu"
          description="The first one switches this showcase for real.">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="body-sm text-[var(--muted-foreground)]">Live</span>
              <AppSwitcher
                apps={APPS}
                value={app}
                onValueChange={(id) =>
                  navigate(id === 'lab' ? 'lab/components' : 'backstage/design-system')
                }
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="body-sm text-[var(--muted-foreground)]">Local state: {demoApp}</span>
              <AppSwitcher
                value={demoApp}
                onValueChange={setDemoApp}
                apps={[
                  { id: 'lab', name: 'Dynamic Lab', description: 'Public site' },
                  { id: 'studio', name: 'Stories Studio', description: 'Content editor' },
                  { id: 'vault', name: 'Asset Vault', description: 'Media and icons' },
                ]}
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="body-sm text-[var(--muted-foreground)]">UserMenu</span>
              <UserMenu
                name="Maya Lin"
                email="maya@example.com"
                meta={<Badge size="sm">Creator</Badge>}>
                <MenuItem icon={<LayoutDashboard />}>Dashboard</MenuItem>
                <MenuItem icon={<User />}>Profile</MenuItem>
                <MenuSeparator />
                <MenuItem
                  icon={<LogOut />}
                  onClick={() => toast({ title: 'Signed out', description: 'Demo only.' })}>
                  Sign out
                </MenuItem>
              </UserMenu>
            </div>
          </div>
        </Panel>

        <Panel title="Popover" description="Any content, closes on outside click or Esc.">
          <Popover
            trigger={
              <Button variant="secondary" leftIcon={<Bell className="size-4" />}>
                Notification settings
              </Button>
            }
            aria-label="Notification settings"
            className="ui-menu w-72 p-4!">
            {({ close }) => (
              <div className="flex flex-col gap-3">
                <span className="ui-section-title">Email me about</span>
                <Checkbox defaultChecked label="New comments" />
                <Checkbox defaultChecked label="New followers" />
                <Checkbox label="Weekly digest" />
                <div className="flex justify-end gap-2 pt-1">
                  <Button size="sm" variant="ghost" onClick={close}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      close()
                      toast({
                        title: 'Preferences saved',
                        description: 'From the popover.',
                        tone: 'success',
                      })
                    }}>
                    Save
                  </Button>
                </div>
              </div>
            )}
          </Popover>
        </Panel>

        <Panel title="Dialog & drawer">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
            <Button variant="secondary" onClick={() => setDrawerSide('right')}>
              Drawer right
            </Button>
            <Button variant="secondary" onClick={() => setDrawerSide('left')}>
              Left
            </Button>
            <Button variant="secondary" onClick={() => setDrawerSide('bottom')}>
              Bottom
            </Button>
          </div>
        </Panel>

        <Panel title="Command palette" description="Also opens with ⌘K / Ctrl K in Backstage.">
          <CommandTrigger label="Search commands…" onClick={() => setPaletteOpen(true)} />
        </Panel>

        <Panel title="Toasts">
          <ToastButtons />
        </Panel>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Rename story"
        description="The new title shows everywhere the story is listed."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setDialogOpen(false)
                toast({ title: 'Renamed', description: 'Saved from the dialog.', tone: 'success' })
              }}>
              Save
            </Button>
          </>
        }>
        <TextField label="Title" defaultValue="The lighthouse keeper" autoFocus />
      </Dialog>

      <Drawer
        open={drawerSide !== null}
        side={drawerSide ?? 'right'}
        onClose={() => setDrawerSide(null)}
        title="Filters"
        description="Narrow down what you see."
        footer={<Button onClick={() => setDrawerSide(null)}>Apply</Button>}>
        <div className="flex flex-col gap-4">
          <Select
            label="Category"
            options={[
              { value: 'all', label: 'All categories' },
              { value: 'stories', label: 'Stories' },
            ]}
          />
          <Switch defaultChecked label="Only show work with open comments" />
          <Switch label="Hide mature content" />
        </div>
      </Drawer>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={commands}
        hotkey={false}
      />
    </Section>
  )
}

function ToastButtons() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast({ title: 'Saved', description: 'Your story is live.', tone: 'success' })
        }>
        Success
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Heads up',
            description: 'This item is waiting for review.',
            tone: 'warning',
          })
        }>
        Warning
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'Files must be under 20 MB.',
            tone: 'destructive',
          })
        }>
        Error
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast({
            title: 'Moved to trash',
            description: '“Paper Foxes” can be restored for 45 days.',
            action: {
              label: 'Undo',
              onClick: () =>
                toast({ title: 'Restored', description: 'Undo worked.', tone: 'success' }),
            },
          })
        }>
        With action
      </Button>
    </div>
  )
}

/* ---------------------------------------------------------- Navigation */

function NavigationSection() {
  const [pill, setPill] = useState('overview')
  const [side, setSide] = useState('content')
  const [page, setPage] = useState(1)
  const [view, setView] = useState('grid')
  const total = 5

  return (
    <Section
      id="navigation"
      title="Navigation"
      hint="Tabs, PillNav, SidebarNav, Breadcrumbs, Pagination, SegmentedControl">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[264px_minmax(0,1fr)]">
        <SidebarNav className="h-fit w-full" aria-label="Demo sidebar">
          <SidebarNavGroup label="Creator Lab">
            <SidebarNavItem
              icon={<Home />}
              active={side === 'overview'}
              onClick={() => setSide('overview')}>
              Overview
            </SidebarNavItem>
            <SidebarNavItem
              icon={<BookOpen />}
              active={side === 'content'}
              badge={12}
              onClick={() => setSide('content')}>
              Content
            </SidebarNavItem>
            <SidebarNavItem
              icon={<Layers />}
              active={side === 'library'}
              onClick={() => setSide('library')}>
              Library
            </SidebarNavItem>
          </SidebarNavGroup>
          <SidebarNavGroup label="Account">
            <SidebarNavItem
              icon={<Settings />}
              active={side === 'settings'}
              onClick={() => setSide('settings')}>
              Settings
            </SidebarNavItem>
          </SidebarNavGroup>
        </SidebarNav>

        <div className="flex min-w-0 flex-col gap-6">
          <Panel title="Tabs">
            <Tabs defaultValue="stories">
              <TabsList>
                <TabsTrigger value="stories" icon={<BookOpen className="size-4" />}>
                  Stories
                </TabsTrigger>
                <TabsTrigger value="tokens" icon={<Palette className="size-4" />}>
                  Tokens
                </TabsTrigger>
                <TabsTrigger value="code" icon={<FileCode className="size-4" />}>
                  Code
                </TabsTrigger>
              </TabsList>
              <TabsContent value="stories" className="body-sm text-[var(--muted-foreground)]">
                Pill tabs: for switching views inside a panel.
              </TabsContent>
              <TabsContent value="tokens">
                <TokenSwatches />
              </TabsContent>
              <TabsContent value="code">
                <pre className="overflow-x-auto rounded-[var(--radius-lg)] bg-[var(--muted)] p-4 font-mono text-xs">
                  {`import { ThemeProvider, Button } from '@furlab/dynamic-lab'\nimport '@furlab/dynamic-lab/styles.css'`}
                </pre>
              </TabsContent>
            </Tabs>
            <Separator className="my-5" />
            <Tabs defaultValue="details" variant="line">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="access">Access</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="body-sm text-[var(--muted-foreground)]">
                Line tabs: for top-level sections of a page.
              </TabsContent>
              <TabsContent value="history" className="body-sm text-[var(--muted-foreground)]">
                Three edits this week.
              </TabsContent>
              <TabsContent value="access" className="body-sm text-[var(--muted-foreground)]">
                Visible to everyone.
              </TabsContent>
            </Tabs>
          </Panel>

          <Panel title="Pill nav, breadcrumbs, segmented control">
            <div className="flex flex-col gap-5">
              <PillNav aria-label="Lab sections">
                {['overview', 'content', 'members', 'settings'].map((id) => (
                  <PillNavLink
                    key={id}
                    active={pill === id}
                    onClick={() => setPill(id)}
                    className="capitalize">
                    {id}
                  </PillNavLink>
                ))}
              </PillNav>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#/lab/home">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#/lab/browse">Browse</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize">{pill}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
                <span className="body-sm text-[var(--muted-foreground)]">View: {view}</span>
              </div>
            </div>
          </Panel>

          <Panel title="Pagination" description={`Page ${page} of ${total}`}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious disabled={page === 1} onClick={() => setPage((p) => p - 1)} />
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
                  <PaginationNext disabled={page === total} onClick={() => setPage((p) => p + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </Panel>
        </div>
      </div>
    </Section>
  )
}

function TokenSwatches() {
  const tokens = [
    '--primary',
    '--background',
    '--card',
    '--muted',
    '--border',
    '--sidebar',
    '--glow-a',
    '--glow-b',
  ]
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tokens.map((t) => (
        <div key={t} className="flex flex-col gap-1.5">
          <div
            className="h-10 rounded-[var(--radius-md)] border border-[var(--border)]"
            style={{ background: `var(${t})` }}
          />
          <code className="text-xs text-[var(--muted-foreground)]">{t}</code>
        </div>
      ))}
    </div>
  )
}

/* --------------------------------------------------------------- Forms */

function FormsSection() {
  const [title, setTitle] = useState('')
  const [rows, setRows] = useState([
    { id: 'a', label: 'Comments', checked: true },
    { id: 'b', label: 'Followers', checked: false },
    { id: 'c', label: 'Mentions', checked: true },
  ])
  const allChecked = rows.every((r) => r.checked)
  const someChecked = rows.some((r) => r.checked)

  return (
    <Section
      id="forms"
      title="Forms"
      hint="TextField, Select, Switch, Checkbox, RadioGroup, FileInput">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Text inputs">
          <div className="flex flex-col gap-3">
            <TextField
              label="Title"
              placeholder="Name your story"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText={`${title.length}/60 characters`}
              error={title.length > 60 ? 'Keep it under 60 characters' : undefined}
            />
            <TextField
              label="Search"
              placeholder="Search tokens…"
              startIcon={<Search className="size-4" />}
            />
            <TextField
              label="Summary"
              isTextarea
              rows={3}
              placeholder="A sentence or two for the card"
            />
            <Select
              label="Visibility"
              defaultValue="public"
              options={[
                { value: 'public', label: 'Public' },
                { value: 'unlisted', label: 'Unlisted' },
                { value: 'private', label: 'Only me' },
              ]}
            />
          </div>
        </Panel>

        <Panel title="Toggles">
          <div className="flex flex-col gap-4">
            <Switch
              defaultChecked
              label="Allow comments"
              description="Readers can reply to this story."
            />
            <Switch label="Mature content" />
            <Switch disabled label="Disabled switch" />
            <Separator />
            <Checkbox
              label="Email me about everything"
              checked={allChecked}
              indeterminate={someChecked && !allChecked}
              onCheckedChange={() =>
                setRows((prev) => prev.map((r) => ({ ...r, checked: !allChecked })))
              }
            />
            <div className="flex flex-col gap-2.5 pl-7">
              {rows.map((r) => (
                <Checkbox
                  key={r.id}
                  label={r.label}
                  checked={r.checked}
                  onCheckedChange={(checked) =>
                    setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, checked } : x)))
                  }
                />
              ))}
            </div>
            <Checkbox disabled label="Disabled checkbox" />
          </div>
        </Panel>

        <Panel title="Choices & files">
          <div className="flex flex-col gap-5">
            <RadioGroup label="Who can see this?" defaultValue="everyone">
              <RadioGroupItem value="everyone" label="Everyone" />
              <RadioGroupItem
                value="followers"
                label="Followers"
                description="People who follow your Lab"
              />
              <RadioGroupItem value="me" label="Only me" />
            </RadioGroup>
            <FileInput label="Cover image" accept="image/*" />
            <Separator label="or" />
            <FileInput variant="dropzone" multiple accept=".png,.jpg,.webp" />
          </div>
        </Panel>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------ Feedback */

function FeedbackSection() {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [loadingCard, setLoadingCard] = useState(true)

  useEffect(() => {
    if (!uploading) return
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setUploading(false)
          return 100
        }
        return Math.min(100, p + Math.random() * 18)
      })
    }, 300)
    return () => clearInterval(t)
  }, [uploading])

  const notices = [
    {
      id: 'success',
      tone: 'success' as const,
      title: 'Changes published',
      text: 'Saved. Your story is live.',
    },
    {
      id: 'warning',
      tone: 'warning' as const,
      title: 'Waiting for review',
      text: 'Edits will reset its place in the queue.',
    },
    {
      id: 'danger',
      tone: 'destructive' as const,
      title: "Couldn't upload cover.png",
      text: 'Files must be under 20 MB.',
    },
    {
      id: 'info',
      tone: 'info' as const,
      title: 'Tip',
      text: 'Press ⌘K in Backstage to jump anywhere.',
    },
  ]

  return (
    <Section
      id="feedback"
      title="Status & feedback"
      hint="StatusBadge, Badge, NoticePanel, Progress, Spinner, Skeleton, Kbd">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Badges">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="neutral">Draft</StatusBadge>
            <StatusBadge tone="warning">In review</StatusBadge>
            <StatusBadge tone="success" pulse>
              Published
            </StatusBadge>
            <StatusBadge tone="danger">Archived</StatusBadge>
            <StatusBadge tone="info">Syncing</StatusBadge>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Backstage</Badge>
            <Badge variant="solid">New</Badge>
            <Badge variant="neutral">12</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Verified</Badge>
            <Badge variant="warning">Suggestive</Badge>
            <Badge variant="danger">Mature</Badge>
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
              <Kbd keys={['⌘', 'K']} /> to search
            </span>
          </div>
        </Panel>

        <Panel title="Progress & loading">
          <div className="flex flex-col gap-4">
            <Progress
              label="Uploading chapter-3.pdf"
              value={progress}
              showValue
              tone={progress >= 100 ? 'success' : 'primary'}
            />
            <Progress label="Processing" size="sm" />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                disabled={uploading}
                onClick={() => {
                  setProgress(0)
                  setUploading(true)
                }}>
                {progress >= 100 ? 'Upload again' : 'Start upload'}
              </Button>
              {uploading && <Spinner size="sm" label="Uploading" showLabel />}
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-3 lg:col-span-1">
          {notices
            .filter((n) => !dismissed.includes(n.id))
            .map((n) => (
              <NoticePanel
                key={n.id}
                tone={n.tone}
                title={n.title}
                onDismiss={() => setDismissed((d) => [...d, n.id])}>
                {n.text}
              </NoticePanel>
            ))}
          {dismissed.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="self-start"
              onClick={() => setDismissed([])}>
              Show dismissed notices
            </Button>
          )}
        </div>

        <Panel
          title="Skeleton"
          actions={
            <Switch checked={loadingCard} onCheckedChange={setLoadingCard} label="Loading" />
          }>
          {loadingCard ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <SkeletonAvatar size="lg" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
              <SkeletonText lines={3} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <ProfileAvatar initials="ML" size="lg" status="online" />
                <div className="flex flex-col">
                  <span className="font-semibold">Maya Lin</span>
                  <span className="text-xs text-[var(--muted-foreground)]">Night Shift Comics</span>
                </div>
              </div>
              <p className="body-sm text-[var(--muted-foreground)]">
                Comics about the people who keep cities running after dark. Volume II is in review
                now.
              </p>
            </div>
          )}
        </Panel>
      </div>
    </Section>
  )
}

/* -------------------------------------------------------- Data display */

function DataSection() {
  const [selected, setSelected] = useState<number[]>([1])
  const stories = [
    {
      id: 1,
      title: 'The lighthouse keeper',
      author: 'Alex Rivera',
      tone: 'success' as const,
      status: 'Published',
    },
    {
      id: 2,
      title: 'Neon Odyssey: Volume II',
      author: 'Maya Lin',
      tone: 'warning' as const,
      status: 'In review',
    },
    {
      id: 3,
      title: 'Tidepool Sketchbook',
      author: 'Maya Lin',
      tone: 'neutral' as const,
      status: 'Draft',
    },
  ]

  return (
    <Section
      id="data"
      title="Data display"
      hint="Table, MetricCard, ContentCard, WorkflowTimeline, Accordion, Avatar, LocalDateTime">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard label="Waiting for review" value={12} href="#/backstage/content" />
        <MetricCard
          label="Published this week"
          value={48}
          delta={{ value: '+12%', direction: 'up' }}
        />
        <MetricCard
          label="Reports"
          value={3}
          delta={{ value: '-2', direction: 'down' }}
          subtext="vs last week"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select all"
                checked={selected.length === stories.length}
                indeterminate={selected.length > 0 && selected.length < stories.length}
                onCheckedChange={() =>
                  setSelected(selected.length === stories.length ? [] : stories.map((s) => s.id))
                }
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((s) => (
            <TableRow key={s.id} selected={selected.includes(s.id)}>
              <TableCell>
                <Checkbox
                  aria-label={`Select ${s.title}`}
                  checked={selected.includes(s.id)}
                  onCheckedChange={() =>
                    setSelected((prev) =>
                      prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                    )
                  }
                />
              </TableCell>
              <TableCell className="font-semibold">{s.title}</TableCell>
              <TableCell>{s.author}</TableCell>
              <TableCell>
                <StatusBadge tone={s.tone}>{s.status}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <ContentCard
          type="Story"
          title="The lighthouse keeper"
          byline="By Alex Rivera"
          icon={<BookOpen />}
          onClick={() => {}}
        />
        <ContentCard
          type="Artwork"
          title="Paper Foxes"
          byline="By Jordan Vance"
          icon={<Palette />}
          coverBadge={
            <Badge variant="solid" size="sm">
              New
            </Badge>
          }
          onClick={() => {}}
        />
        <ContentCard type="Page" title="About the Lab" byline="By Alex Rivera" aspect="square" />
        <ContentCard
          type="Visual novel"
          title="Last Train to Hollow Creek"
          byline="By Sam Okafor"
          cover={
            <span className="text-4xl font-black tracking-tight text-[var(--primary)]">LT</span>
          }
          onClick={() => {}}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Workflow timeline">
          <WorkflowTimeline>
            <WorkflowTimelineItem
              title="Published"
              time="Oct 21"
              completed
              status={<StatusBadge tone="success">Published</StatusBadge>}
            />
            <WorkflowTimelineItem title="Approved by Jordan" time="Oct 20" completed />
            <WorkflowTimelineItem
              title="Sent for review"
              time="Oct 19"
              active
              status={<StatusBadge tone="warning">In review</StatusBadge>}
            />
          </WorkflowTimeline>
        </Panel>
        <Panel title="Accordion">
          <Accordion type="single" defaultValue="a">
            <AccordionItem value="a">
              <AccordionTrigger>How are Dynamic and Backstage different?</AccordionTrigger>
              <AccordionContent>
                Dynamic is the public site: blue, roomy, top navigation. Backstage is the staff
                console: violet-tinted neutrals, tighter corners, denser controls and a sidebar
                shell.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="b">
              <AccordionTrigger>Can I control the theme?</AccordionTrigger>
              <AccordionContent>
                Wrap your app in ThemeProvider and call setBrand / setMode from useTheme. It sets
                data-theme on the html element.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="my-4" />
          <div className="flex flex-wrap items-center gap-4">
            <ProfileAvatar initials="AR" size="sm" status="online" />
            <ProfileAvatar initials="ML" size="md" status="away" />
            <ProfileAvatar initials="JV" size="lg" status="busy" />
            <ProfileAvatar initials="SO" size="xl" />
            <LocalDateTime date={new Date()} label="Now:" />
          </div>
        </Panel>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------ Layout & pages */

function LayoutSection({ onToast }: { onToast: (title: string) => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const emailError =
    submitted && !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email address' : undefined

  return (
    <Section
      id="layout"
      title="Layout & pages"
      hint="PageHeader, Toolbar, EmptyState, SiteBanner, AuthCard, NotFoundState, MaintenanceNotice">
      <div className="flex flex-col gap-6">
        <div className="ui-panel flex flex-col gap-5">
          <PageHeader
            title="Content"
            description="Everything your Creator Lab has published or drafted."
            actions={
              <>
                <Button variant="secondary" onClick={() => onToast('Export started')}>
                  Export
                </Button>
                <Button onClick={() => onToast('New story')}>New story</Button>
              </>
            }
          />
          <Toolbar label="Filter">
            <TextField
              placeholder="Search titles"
              aria-label="Search titles"
              className="min-w-48"
            />
            <Button
              variant="secondary"
              leftIcon={<Search className="size-4" />}
              onClick={() => onToast('Search')}>
              Search
            </Button>
            <span className="body-sm text-[var(--muted-foreground)]">3 selected</span>
          </Toolbar>
        </div>

        <SiteBanner
          tone="primary"
          icon={<Sparkles />}
          action={
            <Button size="sm" variant="secondary" onClick={() => onToast('Banner action')}>
              Try it
            </Button>
          }>
          SiteBanner: a strip for site-wide announcements.
        </SiteBanner>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EmptyState
            icon={<Search className="size-7" />}
            title="No stories match “lighthouse”"
            description="Try a different word, or clear the search to see everything in this lab."
            action={
              <Button variant="secondary" onClick={() => onToast('Search cleared')}>
                Clear search
              </Button>
            }
          />
          <AuthCard
            logo={<BrandLockup name="Dynamic Lab" />}
            title="Sign in"
            subtitle="Use your Dynamic Lab account.">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
                if (!/^\S+@\S+\.\S+$/.test(email)) return
                setSigningIn(true)
                setTimeout(() => {
                  setSigningIn(false)
                  onToast(`Signed in as ${email}`)
                }, 900)
              }}>
              <TextField
                label="Email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />
              <TextField label="Password" type="password" placeholder="••••••••" />
              <Button type="submit" className="w-full" loading={signingIn}>
                Sign in
              </Button>
            </form>
          </AuthCard>
        </div>

        <NotFoundState
          title="Lost in the Lab?"
          description="We couldn't find that page. Check the URL or head back home."
          onHomeClick={() => (window.location.hash = '/lab/home')}
        />

        <MaintenanceNotice
          icon={<Wrench className="size-8" />}
          title="We'll be right back"
          description="Dynamic Lab is updating. Everything will be back online in a few minutes."
          actionText="Check status"
          onAction={() => onToast('All systems operational')}
        />
      </div>
    </Section>
  )
}
