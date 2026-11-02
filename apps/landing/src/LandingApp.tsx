import React, { useState } from 'react'

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
  useTheme,
  useToast,
} from '@furlab/dynamic-lab'
import pkg from '@furlab/dynamic-lab/package.json'

import { ArrowRight, Check, Copy, LayoutDashboard } from 'lucide-react'

import { DOCS_URL, FONT_URL, REPOSITORY_URL, SHOWCASE_URL } from './links'
import { GitLabLogo, NpmLogo } from './logos'

const INSTALL = `yarn add ${pkg.name}`

const SETUP = `import { ThemeProvider, ToastProvider } from '${pkg.name}'
import '${pkg.name}/styles.css'

export function App({ children }) {
  return (
    <ThemeProvider defaultBrand="dynamic">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}`

const FACTS = [
  { value: '90+', label: 'components' },
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
    <div className="landing-install">
      <span className="landing-install-prompt select-none">$</span>
      <code className="min-w-0 truncate">{INSTALL}</code>
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
    <Card className="landing-preview flex flex-col gap-5">
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
        <StatusBadge tone="success">Published</StatusBadge>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm text-[var(--muted-foreground)]">Chapter 4 of 6</span>
        <h3 className="text-2xl font-bold tracking-tight">The Otter Who Mapped the Stars</h3>
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

function BrandSwitch() {
  const { brand, setBrand } = useTheme()
  return (
    <SegmentedControl
      aria-label="Brand"
      value={brand}
      onValueChange={(v) => setBrand(v as 'dynamic' | 'backstage')}
      options={[
        { value: 'dynamic', label: 'Dynamic' },
        { value: 'backstage', label: 'Backstage' },
      ]}
    />
  )
}

/* ------------------------------------------------------------------ Page */

function Landing() {
  return (
    <div className="dynamic-lab-glow-bg flex min-h-screen flex-col">
      <SiteHeader
        className="landing-nav"
        brand={
          <a href="./" className="flex items-center gap-2" aria-label="Dynamic Lab home">
            <BrandLockup name="Dynamic Lab" />
          </a>
        }
        nav={
          <SiteNav>
            <SiteNavLink href={SHOWCASE_URL}>Showcase</SiteNavLink>
            <SiteNavLink href={DOCS_URL}>Docs</SiteNavLink>
            <SiteNavLink href={FONT_URL}>The Lab Sans</SiteNavLink>
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
            <Tooltip content="Package on npm" side="bottom">
              <a
                href={`https://www.npmjs.com/package/${pkg.name}`}
                target="_blank"
                rel="noreferrer"
                className="icon-button border-0! bg-transparent!"
                aria-label="Package on npm">
                <NpmLogo className="size-4" />
              </a>
            </Tooltip>
          </>
        }
      />

      <main className="flex-1">
        {/* Hero: the library itself, running */}
        <section className="landing-hero landing-container">
          <div className="landing-hero-text">
            <h1 className="landing-display">The component library for The Furlab Project</h1>
            <p className="landing-lead">
              React components, tokens and themes, from buttons to a comic reader.
            </p>
            <div className="flex flex-col items-start gap-4">
              <InstallSnippet />
              <LinkButton href={SHOWCASE_URL} variant="primary">
                <LayoutDashboard className="size-5" />
                See the showcase
              </LinkButton>
            </div>
          </div>
          <LivePreview />
        </section>

        {/* The facts, set as figures */}
        <section aria-label="At a glance" className="landing-container">
          <dl className="landing-figures">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd className="landing-figure">{f.value}</dd>
                <dd className="text-sm text-[var(--muted-foreground)]">{f.label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* The workflow: four stages, each with its own object */}
        <ol className="landing-stages landing-container">
          <li className="landing-stage">
            <div className="landing-stage-text">
              <h2 className="landing-section-head">1. Install</h2>
              <p className="landing-lead">
                One package for React 19 and Tailwind CSS v4, typed throughout.
              </p>
            </div>
            <dl className="landing-index landing-stage-object">
              <div className="landing-index-row">
                <dt className="font-semibold">Package</dt>
                <dd className="font-mono text-sm">{pkg.name}</dd>
              </div>
              <div className="landing-index-row">
                <dt className="font-semibold">Version</dt>
                <dd className="tabular-nums">{pkg.version}</dd>
              </div>
              <div className="landing-index-row">
                <dt className="font-semibold">Needs</dt>
                <dd>React 19, Tailwind CSS v4</dd>
              </div>
              <div className="landing-index-row">
                <dt className="font-semibold">Licence</dt>
                <dd>{pkg.license}</dd>
              </div>
            </dl>
          </li>

          <li className="landing-stage">
            <div className="landing-stage-text">
              <h2 className="landing-section-head">2. Wrap your app</h2>
              <p className="landing-lead">
                Dynamic for the public site, Backstage for the staff console. Same components, each
                with its own look.
              </p>
              <BrandSwitch />
            </div>
            <figure className="landing-stage-object">
              <pre className="landing-code">
                <code>{SETUP}</code>
              </pre>
              <figcaption className="text-sm text-[var(--muted-foreground)]">App.tsx</figcaption>
            </figure>
          </li>

          <li className="landing-stage">
            <div className="landing-stage-text">
              <h2 className="landing-section-head">3. Build from the parts</h2>
              <p className="landing-lead">
                General-purpose building blocks, plus the pieces specific to a creative community:
                readers, galleries, content cards, tagging and moderation workflows.
              </p>
              <p className="text-[var(--muted-foreground)]">
                Keyboard support, reduced motion and adjustable transparency (full, reduced or off).
              </p>
            </div>
            <dl className="landing-index landing-stage-object">
              {GROUPS.map((g) => (
                <div key={g.name} className="landing-index-row">
                  <dt className="font-semibold">{g.name}</dt>
                  <dd className="text-[var(--muted-foreground)]">{g.items}</dd>
                </div>
              ))}
            </dl>
          </li>

          <li className="landing-stage">
            <div className="landing-stage-text">
              <h2 className="landing-section-head">4. Pick a theme</h2>
              <p className="landing-lead">
                Eight themes from Midnight Wolf to Purrple Rain, in light and dark, plus your own
                palettes. This page follows.
              </p>
            </div>
            <div className="landing-stage-object">
              <PalettePicker />
            </div>
          </li>
        </ol>

        {/* Where next */}
        <section className="landing-next landing-container" aria-labelledby="where-next">
          <h2 id="where-next" className="landing-section-head">
            Where next
          </h2>
          <div className="landing-next-rows">
            <div className="landing-next-row">
              <h3 className="landing-next-title">Showcase</h3>
              <p className="text-[var(--muted-foreground)]">
                Two working apps built only from the library: the Dynamic Lab public site and the
                Backstage staff console. Click around to see the components together.
              </p>
              <LinkButton href={SHOWCASE_URL} variant="secondary" size="md">
                Open the showcase
              </LinkButton>
            </div>
            <div className="landing-next-row">
              <h3 className="landing-next-title">Documentation</h3>
              <p className="text-[var(--muted-foreground)]">
                Install and set-up guides, theming, and a page for every component with live
                examples, their source and the full props table.
              </p>
              <LinkButton href={DOCS_URL} variant="secondary" size="md">
                Read the docs
              </LinkButton>
            </div>
            <div className="landing-next-row">
              <h3 className="landing-next-title landing-next-face">The Lab Sans</h3>
              <p className="text-[var(--muted-foreground)]">
                The typeface you’re reading: eight weights with italics, as its own package for any
                web app, Next.js included.
              </p>
              <LinkButton href={FONT_URL} variant="secondary" size="md">
                See the specimen
              </LinkButton>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter
        start={<span>© 2026 Vedla Creative &amp; The Furlab Project. MIT licence.</span>}
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
