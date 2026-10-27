import React, { useState } from 'react'

import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Layers,
  LayoutDashboard,
  MousePointerClick,
  Palette,
  Sparkles,
} from 'lucide-react'

import {
  AppearanceSettings,
  Badge,
  BrandLockup,
  Button,
  buttonVariants,
  Card,
  cn,
  IconButton,
  PalettePicker,
  Popover,
  Progress,
  SegmentedControl,
  SiteFooter,
  SiteHeader,
  SiteNav,
  SiteNavLink,
  StatusBadge,
  Switch,
  Tag,
  ThemeProvider,
  ToastProvider,
  Tooltip,
  useToast,
} from '@furlab/dynamic-lab'
import pkg from '@furlab/dynamic-lab/package.json'

import { DOCS_URL, REPOSITORY_URL, SHOWCASE_URL } from './links'
import { GitLabLogo, NpmLogo } from './logos'

const INSTALL = `yarn add ${pkg.name}`

const FACTS = [
  { value: '~70', label: 'components' },
  { value: '8', label: 'colour themes' },
  { value: '2', label: 'brands' },
  { value: 'Light + dark', label: 'in every theme' },
]

const GROUPS = [
  {
    name: 'Actions & forms',
    items: 'Button, Switch, RadioGroup, TagInput, FileInput, SegmentedControl',
  },
  { name: 'Overlays', items: 'Dialog, Drawer, Popover, Menu, Tooltip, CommandPalette' },
  { name: 'Navigation', items: 'SiteHeader, SidebarNav, Tabs, Breadcrumbs, Pagination' },
  { name: 'Feedback', items: 'Toast, Progress, Skeleton, EmptyState, NoticePanel' },
  { name: 'Data display', items: 'Table, DescriptionList, MetricCard, StatusBadge, Tag' },
  { name: 'Content', items: 'ComicReader, Reader, ContentCard, MediaGallery, Comments' },
  { name: 'Layout', items: 'AdminShell, PageHeader, Panel, Card, Toolbar' },
  { name: 'Theming', items: 'ThemeProvider, PalettePicker, AppearanceSettings, ThemeToggle' },
]

const HIGHLIGHTS = [
  {
    icon: <Layers className="size-5" />,
    title: 'Adaptable to your app',
    text: 'Dynamic for the public site, Backstage for the staff console. Same components, each with its own look.',
  },
  {
    icon: <Palette className="size-5" />,
    title: 'Named colour themes',
    text: 'Eight themes from Midnight Wolf to Purrple Rain, in light and dark, plus your own palettes.',
  },
  {
    icon: <MousePointerClick className="size-5" />,
    title: 'Built for everyone',
    text: 'Keyboard support, reduced motion and adjustable transparency (full, reduced or off).',
  },
]

/* ------------------------------------------------------------------ Bits */

function LinkButton({
  href,
  variant,
  size = 'lg',
  className,
  children,
  external,
}: {
  href: string
  variant: 'primary' | 'secondary' | 'ghost'
  size?: 'md' | 'lg'
  className?: string
  children: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {children}
    </a>
  )
}

function InstallSnippet() {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL)
      setCopied(true)
      toast({ title: 'Copied', description: INSTALL, tone: 'success' })
      setTimeout(() => setCopied(false), 1600)
    } catch {
      toast({ title: 'Couldn’t copy', description: 'Select the command and copy it by hand.' })
    }
  }

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_70%,transparent)] py-1 pr-1 pl-4 font-mono text-sm backdrop-blur-md">
      <span className="text-[var(--muted-foreground)] select-none">$</span>
      <code className="truncate">{INSTALL}</code>
      <IconButton
        aria-label="Copy install command"
        variant="ghost"
        icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        onClick={copy}
      />
    </div>
  )
}

/** A handful of real components, so the hero shows the library rather than a picture of it. */
function LivePreview() {
  const [view, setView] = useState('stories')
  const [notify, setNotify] = useState(true)

  return (
    <Card variant="glass" className="landing-preview flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          aria-label="Library section"
          value={view}
          onValueChange={setView}
          size="sm"
          options={[
            { value: 'stories', label: 'Stories' },
            { value: 'comics', label: 'Comics' },
            { value: 'art', label: 'Art' },
          ]}
        />
        <StatusBadge tone="success" pulse>
          Published
        </StatusBadge>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold tracking-wide text-[var(--muted-foreground)] uppercase">
          Chapter 4 of 6
        </span>
        <h3 className="text-xl font-bold tracking-tight">The Otter Who Mapped the Stars</h3>
        <p className="body-sm text-[var(--muted-foreground)]">
          A navy sky, a golden river, and one very determined cartographer.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Tag name="artist:river_pip" category="artist" />
        <Tag name="species:otter" category="species" />
        <Tag name="adventure" count={1284} />
      </div>

      <Progress value={66} label="Reading progress" showValue size="sm" />

      <Switch
        checked={notify}
        onCheckedChange={setNotify}
        label="Notify me about new chapters"
        description="One message per release, nothing else."
      />

      <div className="flex flex-wrap gap-2">
        <Button rightIcon={<ArrowRight className="size-4" />}>Keep reading</Button>
        <Button variant="secondary">Add to shelf</Button>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ Page */

function Landing() {
  return (
    <div className="dynamic-lab-glow-bg flex min-h-screen flex-col">
      <SiteHeader
        brand={
          <a href="./" className="flex items-center gap-2" aria-label="Dynamic Lab home">
            <BrandLockup name="Dynamic Lab" />
          </a>
        }
        nav={
          <SiteNav>
            <SiteNavLink href={SHOWCASE_URL}>Showcase</SiteNavLink>
            <SiteNavLink href={DOCS_URL}>Docs</SiteNavLink>
          </SiteNav>
        }
        actions={
          <>
            <Badge variant="neutral" className="hidden sm:inline-flex">
              v{pkg.version}
            </Badge>
            <AppearanceSettings />
            <Tooltip content="Source on GitLab" side="bottom">
              <a
                href={REPOSITORY_URL}
                target="_blank"
                rel="noreferrer"
                className="icon-button border-0! bg-transparent!"
                aria-label="Source on GitLab">
                <GitLabLogo className="size-4" />
              </a>
            </Tooltip>
            <Popover
              trigger={
                <IconButton
                  aria-label="npm"
                  variant="ghost"
                  icon={<NpmLogo className="size-4" />}
                />
              }
              aria-label="npm"
              align="end"
              className="ui-menu px-3! py-2! text-sm font-semibold">
              Soon
            </Popover>
          </>
        }
      />

      <main className="mx-auto flex w-full max-w-[var(--container-max)] flex-1 flex-col gap-24 px-4 py-12 sm:px-8 sm:py-20">
        {/* Hero */}
        <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-start gap-6">
            <Badge icon={<Sparkles className="size-3.5" />}>React 19 · Tailwind CSS v4</Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">
              The component library for The Furlab Project
            </h1>
            <p className="max-w-xl text-lg text-pretty text-[var(--muted-foreground)]">
              Dynamic Lab is a set of React components, design tokens and themes: from buttons and
              dialogs to a comic reader, a story reader and booru-style tags. Typed, accessible, and
              themeable down to the last border.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href={SHOWCASE_URL} variant="primary">
                <LayoutDashboard className="size-5" />
                See the showcase
              </LinkButton>
              <LinkButton href={DOCS_URL} variant="secondary">
                <BookOpen className="size-5" />
                Read the docs
              </LinkButton>
            </div>
            <InstallSnippet />
          </div>
          <LivePreview />
        </section>

        {/* Facts */}
        <section aria-label="At a glance" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FACTS.map((f) => (
            <Card key={f.label} className="flex flex-col gap-1 p-5">
              <span className="text-3xl font-extrabold tracking-tight">{f.value}</span>
              <span className="body-sm text-[var(--muted-foreground)]">{f.label}</span>
            </Card>
          ))}
        </section>

        {/* Highlights */}
        <section className="grid gap-4 md:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <Card key={h.title} className="flex flex-col gap-3">
              <span className="grid size-10 place-items-center rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[var(--primary)]">
                {h.icon}
              </span>
              <h2 className="text-lg font-bold tracking-tight">{h.title}</h2>
              <p className="body-sm text-[var(--muted-foreground)]">{h.text}</p>
            </Card>
          ))}
        </section>

        {/* What's inside */}
        <section className="flex flex-col gap-8">
          <div className="flex max-w-2xl flex-col gap-2">
            <span className="page-eyebrow">What’s inside</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Everything an app needs</h2>
            <p className="text-[var(--muted-foreground)]">
              General-purpose building blocks, plus the pieces specific to a creative community:
              readers, galleries, content cards, tagging and moderation workflows.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GROUPS.map((g) => (
              <Card key={g.name} variant="panel" className="flex flex-col gap-2 p-5">
                <h3 className="font-bold">{g.name}</h3>
                <p className="body-sm text-[var(--muted-foreground)]">{g.items}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Themes */}
        <section className="flex flex-col gap-8">
          <div className="flex max-w-2xl flex-col gap-2">
            <span className="page-eyebrow">Theming</span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Pick a theme. This page follows.
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Every colour on this page comes from the theme tokens. Choose one below, or switch
              between light and dark from the header.
            </p>
          </div>
          <PalettePicker />
        </section>

        {/* Where next */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col items-start gap-4 p-8">
            <LayoutDashboard className="size-8 text-[var(--primary)]" />
            <h2 className="text-2xl font-extrabold tracking-tight">Showcase</h2>
            <p className="text-[var(--muted-foreground)]">
              Two working apps built only from the library: the Dynamic Lab public site and the
              Backstage staff console. Click around to see the components together.
            </p>
            <LinkButton href={SHOWCASE_URL} variant="primary" size="md" className="mt-auto">
              Open the showcase
              <ArrowRight className="size-4" />
            </LinkButton>
          </Card>
          <Card className="flex flex-col items-start gap-4 p-8">
            <BookOpen className="size-8 text-[var(--primary)]" />
            <h2 className="text-2xl font-extrabold tracking-tight">Documentation</h2>
            <p className="text-[var(--muted-foreground)]">
              Install and set-up guides, theming, and a page for every component with live examples,
              their source and the full props table.
            </p>
            <LinkButton href={DOCS_URL} variant="secondary" size="md" className="mt-auto">
              Read the docs
              <ArrowRight className="size-4" />
            </LinkButton>
          </Card>
        </section>
      </main>

      <SiteFooter
        start={<span>© 2026 Vedla Creative &amp; The Furlab Project · MIT licence</span>}
        end={
          <a href={REPOSITORY_URL} className="hover:underline">
            {pkg.name}@{pkg.version}
          </a>
        }
      />
    </div>
  )
}

export function LandingApp() {
  return (
    <ThemeProvider defaultBrand="dynamic" storageKey="dynamic-lab-landing">
      <ToastProvider>
        <Landing />
      </ToastProvider>
    </ThemeProvider>
  )
}
