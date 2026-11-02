import React, { useEffect, useMemo, useState } from 'react'

import type { CommandItem, ThemeBrand } from '@furlab/dynamic-lab'
import {
  AdminShell,
  AdminSidebar,
  AppearanceSettings,
  Badge,
  BrandLockup,
  Button,
  CommandPalette,
  CommandTrigger,
  IconButton,
  Input,
  SegmentedControl,
  SidebarNav,
  SidebarNavGroup,
  SidebarNavItem,
  SiteFooter,
  SiteHeader,
  SiteNav,
  SiteNavLink,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ThemeProvider,
  ToastProvider,
  Tooltip,
  useTheme,
} from '@furlab/dynamic-lab'
import pkg from '@furlab/dynamic-lab/package.json'

import { BookOpen, Box, Building2, Globe, Search } from 'lucide-react'

import type { ComponentDoc } from './registry'
import { pageIcon } from './icons'
import { GitLabLogo, NpmLogo } from './logos'
import { ComponentIndex } from './pages/ComponentIndex'
import { GUIDE } from './pages/Guide'
import { COMPONENTS, exampleSource, GROUPS } from './registry'
import { CodeBlock, PropsTable } from './ui'

const REPO = import.meta.env.VITE_REPOSITORY_URL ?? pkg.repository.url

function useHashPath() {
  const read = () => window.location.hash.replace(/^#\/?/, '') || 'guide/getting-started'
  const [path, setPath] = useState(read)
  useEffect(() => {
    const onHash = () => {
      setPath(read())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return path
}

const go = (path: string) => {
  window.location.hash = `/${path}`
}

/* ---------------------------------------------------------- Header bits */

const BRANDS: { value: ThemeBrand; label: string; icon: React.ReactNode }[] = [
  { value: 'dynamic', label: 'Dynamic', icon: <Globe className="size-3.5" /> },
  { value: 'backstage', label: 'Backstage', icon: <Building2 className="size-3.5" /> },
]

/** Preview the docs, and every example on them, in either brand. */
function BrandToggle() {
  const { brand, setBrand } = useTheme()
  const other = BRANDS.find((b) => b.value !== brand)!

  return (
    <>
      <SegmentedControl
        aria-label="Brand"
        size="sm"
        className="hidden lg:flex"
        value={brand}
        onValueChange={(value) => setBrand(value as ThemeBrand)}
        options={BRANDS}
      />
      <Tooltip content={`Switch to ${other.label}`} side="bottom">
        <IconButton
          aria-label={`Switch to the ${other.label} brand`}
          variant="ghost"
          className="lg:hidden"
          icon={other.icon}
          onClick={() => setBrand(other.value)}
        />
      </Tooltip>
    </>
  )
}

/* ----------------------------------------------------- Component page */

function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const index = COMPONENTS.indexOf(doc)
  const prev = COMPONENTS[index - 1]
  const next = COMPONENTS[index + 1]

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <h1 className="page-title">{doc.name}</h1>
        <p className="page-description text-[17px]">{doc.summary}</p>
        <CodeBlock
          code={`import { ${doc.imports.join(', ')} } from '${pkg.name}'`}
          className="mt-2"
        />
      </header>

      {doc.examples.map((example) => (
        <section key={example.name} className="flex flex-col gap-3" aria-label={example.title}>
          <h2 className="ui-section-title">{example.title}</h2>
          {example.description && (
            <p className="body-sm text-[var(--muted-foreground)]">{example.description}</p>
          )}
          <Tabs defaultValue="preview" variant="line">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <div
                className={
                  example.preview === 'frame' ? 'docs-preview docs-frame' : 'docs-preview'
                }>
                <example.render />
              </div>
            </TabsContent>
            <TabsContent value="code">
              <CodeBlock code={exampleSource(example.file, example.name)} />
            </TabsContent>
          </Tabs>
        </section>
      ))}

      {doc.props?.map((table) => (
        <section key={table.component} className="flex flex-col gap-3">
          <h2 className="ui-section-title">
            <code className="font-mono">{table.component}</code> props
          </h2>
          <PropsTable rows={table.rows} />
        </section>
      ))}

      <nav
        aria-label="More components"
        className="flex flex-wrap justify-between gap-3 border-t border-[var(--border)] pt-6">
        {prev ? (
          <Button variant="secondary" onClick={() => go(`components/${prev.id}`)}>
            Previous: {prev.name}
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button variant="secondary" onClick={() => go(`components/${next.id}`)}>
            Next: {next.name}
          </Button>
        )}
      </nav>
    </article>
  )
}

/* ----------------------------------------------------------- Layout */

function Docs() {
  const path = useHashPath()
  const [section, id] = path.split('/')
  const [filter, setFilter] = useState('')
  const [paletteOpen, setPaletteOpen] = useState(false)

  const guide = section === 'guide' ? GUIDE.find((g) => g.id === id) : undefined
  const component = section === 'components' ? COMPONENTS.find((c) => c.id === id) : undefined
  const isIndex = section === 'components' && !component
  const page = guide ?? (component || isIndex ? undefined : GUIDE[0])
  const currentLabel = guide?.title ?? component?.name ?? (isIndex ? 'Components' : GUIDE[0].title)

  const q = filter.trim().toLowerCase()
  const matches = (c: ComponentDoc) =>
    !q || `${c.name} ${c.imports.join(' ')} ${c.group}`.toLowerCase().includes(q)

  const commands: CommandItem[] = useMemo(
    () => [
      ...GUIDE.map((g) => ({
        id: `g-${g.id}`,
        label: g.title,
        group: 'Guide',
        icon: <BookOpen />,
        onSelect: () => go(`guide/${g.id}`),
      })),
      {
        id: 'components',
        label: 'All components',
        group: 'Guide',
        icon: <Box />,
        onSelect: () => go('components'),
      },
      ...COMPONENTS.map((c) => ({
        id: `c-${c.id}`,
        label: c.name,
        group: c.group,
        icon: <Box />,
        keywords: c.imports,
        description: c.imports.filter((i) => !i.startsWith('type ')).join(', '),
        onSelect: () => go(`components/${c.id}`),
      })),
    ],
    []
  )

  useEffect(() => {
    document.title = `${currentLabel} · Dynamic Lab docs`
  }, [currentLabel])

  const { brand } = useTheme()

  const actions = (
    <>
      <Badge variant="neutral" className="hidden xl:inline-flex">
        v{pkg.version}
      </Badge>
      {brand === 'dynamic' && (
        <div className="hidden w-56 xl:block">
          <CommandTrigger label="Search docs…" onClick={() => setPaletteOpen(true)} />
        </div>
      )}
      <IconButton
        aria-label="Search docs"
        variant="ghost"
        className={brand === 'dynamic' ? 'xl:hidden' : 'lg:hidden'}
        icon={<Search className="size-4" />}
        onClick={() => setPaletteOpen(true)}
      />
      <BrandToggle />
      <AppearanceSettings themesHref="#/guide/theming" />
      {/* On phones the repository link is in the footer. */}
      <div className="contents max-sm:hidden">
        <Tooltip content="Source on GitLab" side="bottom">
          <a
            href={REPO}
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
      </div>
    </>
  )

  // Backstage's sidebar collapses to an icon rail, so its items need icons.
  const railIcons = brand === 'backstage'
  const navItems = (
    <>
      <SidebarNavGroup label="Guide">
        {GUIDE.map((g) => (
          <SidebarNavItem
            key={g.id}
            icon={railIcons && pageIcon(g.id)}
            active={guide?.id === g.id || (!guide && !component && !isIndex && g === GUIDE[0])}
            onClick={() => go(`guide/${g.id}`)}>
            {g.title}
          </SidebarNavItem>
        ))}
      </SidebarNavGroup>
      <SidebarNavGroup label="Components">
        <SidebarNavItem
          icon={railIcons && pageIcon('components')}
          active={isIndex}
          onClick={() => go('components')}>
          All components
        </SidebarNavItem>
      </SidebarNavGroup>
      <div className="ui-nav-text px-1 pt-2 pb-2">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter components"
          aria-label="Filter components"
          startIcon={<Search className="size-4" />}
        />
      </div>
      {GROUPS.map((group) => {
        const items = COMPONENTS.filter((c) => c.group === group && matches(c))
        if (!items.length) return null
        return (
          <SidebarNavGroup key={group} label={group}>
            {items.map((c) => (
              <SidebarNavItem
                key={c.id}
                icon={railIcons && pageIcon(c.id)}
                active={component?.id === c.id}
                onClick={() => go(`components/${c.id}`)}>
                {c.name}
              </SidebarNavItem>
            ))}
          </SidebarNavGroup>
        )
      })}
      {q && !COMPONENTS.some(matches) && (
        <p className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
          No components match “{filter}”.
        </p>
      )}
    </>
  )

  const content = component ? (
    <ComponentPage key={component.id} doc={component} />
  ) : isIndex ? (
    <ComponentIndex filter={filter} onFilterChange={setFilter} matches={matches} />
  ) : (
    page && <page.render key={page.id} />
  )

  const footer = (
    <SiteFooter
      start={<span>© 2026 Vedla Creative &amp; The Furlab Project · MIT licence</span>}
      end={
        <a href={REPO} className="hover:underline">
          {pkg.name}@{pkg.version}
        </a>
      }
    />
  )

  const palette = (
    <CommandPalette
      open={paletteOpen}
      onOpenChange={setPaletteOpen}
      items={commands}
      placeholder="Search components and guides…"
    />
  )

  // Backstage previews the docs in the console layout the staff apps use.
  if (brand === 'backstage') {
    return (
      <div className="dynamic-lab-glow-bg">
        <AdminShell
          sidebar={
            <AdminSidebar
              aria-label="Documentation"
              header={
                <a
                  href="#/guide/getting-started"
                  className="flex items-center"
                  aria-label="Dynamic Lab documentation home">
                  <BrandLockup name="Dynamic Lab" product="Docs" size="md" />
                </a>
              }
              search={<CommandTrigger label="Search docs…" onClick={() => setPaletteOpen(true)} />}>
              {navItems}
            </AdminSidebar>
          }
          topbar={
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="truncate text-sm text-[var(--muted-foreground)]">
                {component ? component.group : isIndex ? 'Components' : 'Guide'}
                <span aria-hidden="true"> / </span>
                <span className="font-semibold text-[var(--foreground)]">{currentLabel}</span>
              </span>
              <div className="ml-auto flex shrink-0 items-center gap-1.5">{actions}</div>
            </div>
          }>
          {content}
          <div className="mt-16">{footer}</div>
        </AdminShell>
        {palette}
      </div>
    )
  }

  return (
    <div className="dynamic-lab-glow-bg flex min-h-screen flex-col">
      <SiteHeader
        brand={
          <a
            href="#/guide/getting-started"
            className="flex items-center gap-2"
            aria-label="Dynamic Lab documentation home">
            <BrandLockup
              name="Dynamic Lab"
              product="Docs"
              className="max-sm:[&_.ui-brand-product]:hidden"
            />
          </a>
        }
        nav={
          <SiteNav>
            <SiteNavLink
              active={section === 'guide' && id !== 'theming'}
              onClick={() => go('guide/getting-started')}>
              Guide
            </SiteNavLink>
            <SiteNavLink active={section === 'components'} onClick={() => go('components')}>
              Components
            </SiteNavLink>
            <SiteNavLink
              active={section === 'guide' && id === 'theming'}
              onClick={() => go('guide/theming')}>
              Theming
            </SiteNavLink>
          </SiteNav>
        }
        actions={actions}
      />

      <div className="mx-auto grid w-full max-w-[var(--container-max)] flex-1 grid-cols-1 gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <SidebarNav
          aria-label="Documentation"
          title="Documentation"
          variant="plain"
          collapsible
          currentLabel={currentLabel}
          className="docs-sidebar h-fit w-full lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          {navItems}
        </SidebarNav>

        <main className="min-w-0">{content}</main>
      </div>

      {footer}
      {palette}
    </div>
  )
}

export function DocsApp() {
  return (
    <ThemeProvider defaultBrand="dynamic" storageKey="dynamic-lab-docs">
      <ToastProvider>
        <Docs />
      </ToastProvider>
    </ThemeProvider>
  )
}
