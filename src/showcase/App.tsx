import React, { useState } from 'react'
import {
  ThemeProvider,
  useTheme,
  Button,
  IconButton,
  FilterChip,
  ThemeToggle,
  TextField,
  Input,
  Textarea,
  Switch,
  Checkbox,
  Select,
  AppSwitcher,
  PillNav,
  PillNavLink,
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
  NoticePanel,
  StatusBadge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  MetricCard,
  AuthCard,
  Dialog,
  Menu,
  MenuItem,
  MenuSeparator,
  Panel,
  EmptyState,
  BrandLockup,
  PageHeader,
  PageHeading,
  ProfileAvatar,
  Toolbar,
  WorkflowTimeline,
  WorkflowTimelineItem,
  MaintenanceNotice,
  LocalDateTime,
  // Extended Suite Components
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Tooltip,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  NotFoundState,
  Drawer,
  ToastProvider,
  useToast,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '../index'
import {
  Sparkles,
  Settings,
  Plus,
  Trash2,
  Bookmark,
  Share2,
  ExternalLink,
  Layers,
  Search,
  BookOpen,
  Gamepad2,
  Lock,
  LogOut,
  Palette,
  Sun,
  Moon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Home,
  CheckCircle2,
  SlidersHorizontal,
  FileCode,
  Info,
  ChevronRight,
  Bell,
  PanelLeftClose,
} from 'lucide-react'

function ShowcaseContent() {
  const { theme, brand, mode, setBrand, setMode } = useTheme()
  const { toast } = useToast()

  // Interactive states
  const [activeChip, setActiveChip] = useState('all')
  const [activeNav, setActiveNav] = useState('overview')
  const [activeSidebar, setActiveSidebar] = useState('dashboard')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDangerDialogOpen, setIsDangerDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [switchState, setSwitchState] = useState(true)
  const [checkboxState, setCheckboxState] = useState(true)
  const [dismissedNotice, setDismissedNotice] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const sampleStories = [
    {
      id: 1,
      title: 'The lighthouse keeper',
      author: 'Alex Rivera',
      status: 'Published' as const,
      tone: 'success' as const,
      updated: '10 mins ago',
      views: '1,420',
    },
    {
      id: 2,
      title: 'Neon Odyssey: Volume II',
      author: 'Maya Lin',
      status: 'In review' as const,
      tone: 'warning' as const,
      updated: '1 hour ago',
      views: '840',
    },
    {
      id: 3,
      title: 'Backstage Architecture RFC',
      author: 'Jordan Vance',
      status: 'Draft' as const,
      tone: 'neutral' as const,
      updated: '2 days ago',
      views: '120',
    },
  ]

  return (
    <div className="dynamic-lab-glow-bg min-h-screen text-[var(--foreground)] transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] glass-chrome bg-[color-mix(in_srgb,var(--card)_80%,transparent)] backdrop-blur-[var(--blur-chrome)] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <BrandLockup name="Dynamic Lab" product="v0.1.0" />
            <div className="hidden md:flex items-center">
              <PillNav>
                <PillNavLink
                  active={activeNav === 'overview'}
                  onClick={() => setActiveNav('overview')}>
                  Overview
                </PillNavLink>
                <PillNavLink
                  active={activeNav === 'components'}
                  onClick={() => setActiveNav('components')}>
                  Components (33)
                </PillNavLink>
                <PillNavLink active={activeNav === 'theme'} onClick={() => setActiveNav('theme')}>
                  Themes & Tokens
                </PillNavLink>
              </PillNav>
            </div>
          </div>

          {/* Theme Quick Bar */}
          <div className="flex items-center gap-2.5">
            {/* Theme brand switcher tabs */}
            <div className="hidden sm:inline-flex p-1 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setBrand('dynamic')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  brand === 'dynamic'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}>
                Dynamic
              </button>
              <button
                type="button"
                onClick={() => setBrand('backstage')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  brand === 'backstage'
                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}>
                Backstage
              </button>
            </div>

            <Tooltip content="Open Workspace Drawer">
              <IconButton
                aria-label="Toggle Drawer"
                icon={<SlidersHorizontal className="size-4" />}
                onClick={() => setIsDrawerOpen(true)}
              />
            </Tooltip>

            <Tooltip content="Switch application">
              <AppSwitcher />
            </Tooltip>

            <ThemeToggle showBrandToggle />
            <ProfileAvatar initials="DL" status="online" size="md" />
          </div>
        </div>
      </header>

      {/* Hero Banner with Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 pb-4 flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="size-3.5" />
                <span>Home</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Creator Lab</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Component Explorer</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeading
          eyebrow="Dynamic Lab Design System"
          title="React Component Suite"
          description="A complete production UI kit with 33 components, dual-brand tokens (Dynamic Blue & Backstage Violet), frosted glass surfaces, accessible modals, drawers, data tables, and interactive toasts."
        />

        {/* Current Active Mode Badge */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <StatusBadge tone="success" pulse>
            Active Theme: {theme}
          </StatusBadge>
          <span className="text-xs text-[var(--muted-foreground)]">•</span>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Bell className="size-3.5" />}
            onClick={() =>
              toast({
                title: 'Token Sync Complete',
                description: `Dynamic Lab switched to ${theme} mode successfully.`,
                tone: 'success',
              })
            }>
            Trigger Toast Notification
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-12">
        {/* Section: In-Page Tabs */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">1. Tabs & In-Page Switching</h2>
            <span className="text-xs text-[var(--muted-foreground)]">Pill & line styles</span>
          </div>

          <Tabs defaultValue="stories" variant="pill">
            <TabsList>
              <TabsTrigger value="stories" icon={<BookOpen className="size-4" />}>
                Stories & Content
              </TabsTrigger>
              <TabsTrigger value="tokens" icon={<Palette className="size-4" />}>
                Design Tokens
              </TabsTrigger>
              <TabsTrigger value="code" icon={<FileCode className="size-4" />}>
                Usage Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stories">
              <Panel
                title="Published Works"
                description="Manage stories, media assets, and published content across Dynamic Lab">
                {/* Data Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleStories.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-semibold">{s.title}</TableCell>
                        <TableCell>{s.author}</TableCell>
                        <TableCell>
                          <StatusBadge tone={s.tone}>{s.status}</StatusBadge>
                        </TableCell>
                        <TableCell>{s.views}</TableCell>
                        <TableCell className="text-xs text-[var(--muted-foreground)]">
                          {s.updated}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Tooltip content="Edit item">
                              <IconButton
                                aria-label="Edit"
                                size="sm"
                                icon={<Settings className="size-3.5" />}
                              />
                            </Tooltip>
                            <Tooltip content="Delete item">
                              <IconButton
                                aria-label="Delete"
                                size="sm"
                                variant="danger-outline"
                                icon={<Trash2 className="size-3.5" />}
                                onClick={() => setIsDangerDialogOpen(true)}
                              />
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          isActive={currentPage === 1}
                          onClick={() => setCurrentPage(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          isActive={currentPage === 2}
                          onClick={() => setCurrentPage(2)}>
                          2
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          disabled={currentPage === 2}
                          onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="tokens">
              <Panel
                title="Active Tokens"
                description="Live CSS Custom Properties synchronized from Figma">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="surface-card p-4 rounded-xl flex flex-col gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">Primary Accent</span>
                    <div className="h-10 rounded-lg bg-[var(--primary)] flex items-center justify-center font-bold text-xs text-[var(--primary-foreground)]">
                      var(--primary)
                    </div>
                  </div>
                  <div className="surface-card p-4 rounded-xl flex flex-col gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">Card Surface</span>
                    <div className="h-10 rounded-lg bg-[var(--card)] border border-[var(--border)] flex items-center justify-center font-bold text-xs text-[var(--foreground)]">
                      var(--card)
                    </div>
                  </div>
                  <div className="surface-card p-4 rounded-xl flex flex-col gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">Glow A</span>
                    <div className="h-10 rounded-lg bg-[var(--glow-a)] flex items-center justify-center font-bold text-xs text-white">
                      var(--glow-a)
                    </div>
                  </div>
                  <div className="surface-card p-4 rounded-xl flex flex-col gap-2">
                    <span className="text-xs text-[var(--muted-foreground)]">Glow B</span>
                    <div className="h-10 rounded-lg bg-[var(--glow-b)] flex items-center justify-center font-bold text-xs text-white">
                      var(--glow-b)
                    </div>
                  </div>
                </div>
              </Panel>
            </TabsContent>

            <TabsContent value="code">
              <Panel title="Installation & Import" description="Using Dynamic Lab in your application">
                <pre className="p-4 rounded-xl bg-[color-mix(in_srgb,var(--card)_80%,black)] text-xs overflow-x-auto font-mono text-[var(--primary)]">
                  {`import { ThemeProvider, Button, Table, Drawer, useToast } from 'dynamic_lab'\nimport 'dynamic_lab/styles.css'`}
                </pre>
              </Panel>
            </TabsContent>
          </Tabs>
        </section>

        {/* Section: Accordion & Skeletons */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">2. Accordions & Skeletons</h2>
            <span className="text-xs text-[var(--muted-foreground)]">
              Collapsible panels and shimmer placeholders
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel title="Frequently Asked Questions" description="Smooth animated accordions">
              <Accordion type="single" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does dual-brand theming work?</AccordionTrigger>
                  <AccordionContent>
                    Dynamic Lab supports two brand color harmonies: <strong>Dynamic</strong> (classic
                    vibrant blue #2354e7) and <strong>Backstage</strong> (modern violet #773eda),
                    both paired with light and dark mode ambient glass surfaces.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I customize glassmorphism blur?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Glass blur levels are controlled by CSS variables: 20px chrome blur for
                    navigation, headers, and dialogs; 14px for cards and panels.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Are components accessible?</AccordionTrigger>
                  <AccordionContent>
                    All components adhere to WAI-ARIA authoring practices with keyboard navigation,
                    focus-visible indicators, screen-reader labels, and escape key handlers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Panel>

            <Panel title="Loading Placeholders (Skeletons)" description="Shimmer states while data loads">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size="lg" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
                <SkeletonText lines={3} />
                <div className="flex gap-2 justify-end pt-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* Section: Dedicated 404 / NotFoundState */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">3. Page Not Found (404 Illustration)</h2>
            <span className="text-xs text-[var(--muted-foreground)]">
              Full illustration extracted from Figma assets
            </span>
          </div>

          <NotFoundState
            title="Lost in the Lab?"
            description="We couldn't locate the story or component you requested. Please verify the URL or return to the main dashboard."
            onHomeClick={() => alert('Returning to home dashboard!')}
          />
        </section>

        {/* Section: Actions & Buttons */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">4. Actions & Buttons</h2>
            <span className="text-xs text-[var(--muted-foreground)]">
              Primary, Secondary, Danger, Ghost, Outline, Sizes, Icons, Loading
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel title="Button Variants" description="Different visual hierarchies and semantic states">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Publish</Button>
                <Button variant="secondary">Save draft</Button>
                <Button variant="outline">Preview</Button>
                <Button variant="ghost">Cancel</Button>
                <Button variant="danger">Delete</Button>
                <Button variant="danger-outline">Move to trash</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                <Button
                  variant="primary"
                  loading={btnLoading}
                  onClick={() => {
                    setBtnLoading(true)
                    setTimeout(() => setBtnLoading(false), 1500)
                  }}
                  leftIcon={<Sparkles className="size-4" />}>
                  {btnLoading ? 'Updating...' : 'Trigger Loading'}
                </Button>
                <Button variant="secondary" leftIcon={<Bookmark className="size-4" />}>
                  With Icon
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </Panel>

            <Panel title="Sizes & Tooltip Icon Buttons" description="Hover over any icon button to see tooltips">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="primary">
                  Small (34px)
                </Button>
                <Button size="md" variant="primary">
                  Medium (44px)
                </Button>
                <Button size="lg" variant="primary">
                  Large (48px)
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                <Tooltip content="Manage project settings">
                  <IconButton aria-label="Settings" icon={<Settings className="size-4" />} />
                </Tooltip>
                <Tooltip content="Add new element">
                  <IconButton
                    aria-label="Add item"
                    variant="primary"
                    icon={<Plus className="size-4" />}
                  />
                </Tooltip>
                <Tooltip content="Delete permanently">
                  <IconButton
                    aria-label="Delete"
                    variant="danger"
                    icon={<Trash2 className="size-4" />}
                    onClick={() => setIsDangerDialogOpen(true)}
                  />
                </Tooltip>
                <Tooltip content="Change theme palette">
                  <IconButton
                    aria-label="Palette"
                    variant="outline"
                    icon={<Palette className="size-4" />}
                  />
                </Tooltip>
              </div>
            </Panel>
          </div>
        </section>

        {/* Section: Filter Chips & Status Badges */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">5. Filter Chips & Status Indicators</h2>
            <span className="text-xs text-[var(--muted-foreground)]">Pills, counters, dismissible chips</span>
          </div>

          <Panel title="Interactive Filter Chips" description="Category filtering and selected states">
            <div className="flex flex-wrap items-center gap-2.5">
              <FilterChip
                active={activeChip === 'all'}
                count={42}
                onClick={() => setActiveChip('all')}>
                All Components
              </FilterChip>
              <FilterChip
                active={activeChip === 'actions'}
                count={8}
                icon={<Sparkles className="size-3.5" />}
                onClick={() => setActiveChip('actions')}>
                Actions
              </FilterChip>
              <FilterChip
                active={activeChip === 'navigation'}
                count={14}
                icon={<Layers className="size-3.5" />}
                onClick={() => setActiveChip('navigation')}>
                Navigation
              </FilterChip>
              <FilterChip
                active={activeChip === 'forms'}
                count={6}
                onClick={() => setActiveChip('forms')}>
                Forms
              </FilterChip>
              <FilterChip
                active={activeChip === 'dismissible'}
                onDismiss={() => alert('Chip dismissed')}
                onClick={() => setActiveChip('dismissible')}>
                Dismissible Tag
              </FilterChip>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-[var(--border)]">
              <StatusBadge tone="success" pulse>
                Published
              </StatusBadge>
              <StatusBadge tone="warning">In review</StatusBadge>
              <StatusBadge tone="neutral">Draft</StatusBadge>
              <StatusBadge tone="danger">Rejected</StatusBadge>
              <StatusBadge tone="info">Synchronizing</StatusBadge>
            </div>
          </Panel>
        </section>

        {/* Section: Forms & Inputs */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">6. Form Controls & Inputs</h2>
            <span className="text-xs text-[var(--muted-foreground)]">
              TextField, Input, Textarea, Select, Switch, Checkbox
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Panel title="Text Inputs" description="Labels, icons and validation">
              <div className="flex flex-col gap-3">
                <TextField
                  label="Title"
                  placeholder="Enter story or component name"
                  defaultValue="The lighthouse keeper"
                />
                <TextField
                  label="Search with Icon"
                  placeholder="Search tokens..."
                  startIcon={<Search className="size-4" />}
                />
                <TextField
                  label="With Error"
                  placeholder="Required field"
                  error="This title already exists in the workspace"
                />
              </div>
            </Panel>

            <Panel title="Textarea & Select" description="Multi-line and picker controls">
              <div className="flex flex-col gap-3">
                <TextField
                  label="Description"
                  isTextarea
                  rows={3}
                  placeholder="Add notes about this version"
                  helperText="Supports Markdown syntax"
                />
                <Select
                  label="Environment"
                  options={[
                    { value: 'production', label: 'Production (Stable)' },
                    { value: 'staging', label: 'Staging (Preview)' },
                    { value: 'dev', label: 'Development Lab' },
                  ]}
                />
              </div>
            </Panel>

            <Panel title="Toggles & Checkboxes" description="Switches and multi-select">
              <div className="flex flex-col gap-4 pt-1">
                <Switch
                  checked={switchState}
                  onCheckedChange={setSwitchState}
                  label="Auto-sync tokens with Figma"
                />
                <Switch checked={false} label="Reduced transparency mode" />
                <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2.5">
                  <Checkbox
                    checked={checkboxState}
                    onChange={(e) => setCheckboxState(e.target.checked)}
                    label="Enable backdrop blur filters (20px)"
                  />
                  <Checkbox checked={true} label="Radial ambient glows" />
                  <Checkbox disabled label="Legacy token mode (Disabled)" />
                </div>
              </div>
            </Panel>
          </div>
        </section>

        {/* Section: Notice Panels & Alerts */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">7. Notice Panels & Alerts</h2>
            <span className="text-xs text-[var(--muted-foreground)]">Semantic notification banners</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NoticePanel tone="success" title="Changes Published">
              Saved. Your component variations are live in the design token registry.
            </NoticePanel>

            <NoticePanel tone="warning" title="Pending Verification">
              This item is waiting for review; edits will restart the approval timeline.
            </NoticePanel>

            <NoticePanel tone="destructive" title="Component Deprecation">
              Notice: Legacy button tokens will be retired in Dynamic Lab v1.0.
            </NoticePanel>

            {!dismissedNotice && (
              <NoticePanel
                tone="info"
                title="Figma Synchronization"
                onDismiss={() => setDismissedNotice(true)}>
                Variables exported from Figma are active in the CSS tokens runtime.
              </NoticePanel>
            )}
          </div>
        </section>

        {/* Section: Composite Surfaces */}
        <section className="flex flex-col gap-4">
          <div className="border-b border-[var(--border)] pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">8. Composite Surfaces & Workflows</h2>
            <span className="text-xs text-[var(--muted-foreground)]">
              Auth card & maintenance announcement
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <AuthCard
              logo={<BrandLockup product="Backstage" />}
              title="Sign in to Dynamic Lab"
              subtitle="Enter your email to access your design system workspace">
              <TextField label="Email address" type="email" placeholder="name@dynamiclab.design" />
              <TextField label="Password" type="password" placeholder="••••••••" />
              <Button variant="primary" className="w-full mt-2">
                Continue to Workspace
              </Button>
              <div className="text-center text-xs text-[var(--muted-foreground)]">
                Protected by Dynamic Lab SSO • Backstage Access
              </div>
            </AuthCard>

            <MaintenanceNotice
              title="We'll be right back"
              description="Dynamic Lab systems are updating components with the newest Figma variables. Everything will be back online in a few minutes."
              actionText="Check system status"
              onAction={() => alert('All systems operational!')}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] mt-16 py-8 px-4 sm:px-8 text-center text-xs text-[var(--muted-foreground)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLockup name="Dynamic Lab" />
          <p>© 2026 Dynamic Lab Component Library. Exported from Figma design tokens.</p>
          <LocalDateTime date={new Date()} label="Current time:" />
        </div>
      </footer>

      {/* Slide-out Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Workspace Inspector"
        description="Configure active tokens and workspace preferences"
        footer={
          <Button variant="primary" onClick={() => setIsDrawerOpen(false)}>
            Done
          </Button>
        }>
        <div className="flex flex-col gap-4">
          <TextField label="Workspace Name" defaultValue="Production Lab" />
          <Select
            label="Default Theme Mode"
            options={[
              { value: 'dynamic-light', label: 'Dynamic Light' },
              { value: 'dynamic-dark', label: 'Dynamic Dark' },
              { value: 'backstage-light', label: 'Backstage Light' },
              { value: 'backstage-dark', label: 'Backstage Dark' },
            ]}
          />
          <Switch checked={true} label="Auto-detect system dark mode" />
          <Switch checked={true} label="Backdrop frosted glass blur" />
        </div>
      </Drawer>

      {/* Interactive Modal Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Create New Component"
        description="Add a new custom component definition with variants to Dynamic Lab."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                toast({
                  title: 'Component Created',
                  description: 'The new component definition was added to Dynamic Lab.',
                  tone: 'success',
                })
                setIsDialogOpen(false)
              }}>
              Create Component
            </Button>
          </>
        }>
        <div className="flex flex-col gap-3">
          <TextField label="Component Name" placeholder="e.g. Breadcrumbs, Accordion" />
          <TextField label="Category" placeholder="e.g. Navigation, Feedback" />
          <Checkbox checked={true} label="Auto-generate TypeScript types & Story" />
        </div>
      </Dialog>

      {/* Danger Modal Dialog */}
      <Dialog
        open={isDangerDialogOpen}
        onClose={() => setIsDangerDialogOpen(false)}
        title="Delete “The lighthouse keeper”?"
        description="This will permanently remove the story and its associated media assets. This action cannot be undone."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDangerDialogOpen(false)}>
              Keep story
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                toast({
                  title: 'Story Deleted',
                  description: 'The lighthouse keeper was permanently removed.',
                  tone: 'destructive',
                })
                setIsDangerDialogOpen(false)
              }}>
              Delete for good
            </Button>
          </>
        }
      />
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider defaultBrand="dynamic" defaultMode="light">
      <ToastProvider>
        <ShowcaseContent />
      </ToastProvider>
    </ThemeProvider>
  )
}
export default App
