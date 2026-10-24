import React, { useEffect, useMemo, useState } from 'react'
import { BookOpen, Box, ExternalLink, Search } from 'lucide-react'
import {
  AppearanceSettings,
  Badge,
  BrandLockup,
  Button,
  CommandPalette,
  CommandTrigger,
  IconButton,
  Input,
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
  type CommandItem,
} from '@furlab/dynamic-lab'
import pkg from '../package.json'
import { COMPONENTS, GROUPS, exampleSource, type ComponentDoc } from './registry'
import { GUIDE } from './pages/Guide'
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

/* ----------------------------------------------------- Component page */

function ComponentPage({ doc }: { doc: ComponentDoc }) {
  const index = COMPONENTS.indexOf(doc)
  const prev = COMPONENTS[index - 1]
  const next = COMPONENTS[index + 1]

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <span className="page-eyebrow">{doc.group}</span>
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
            ← {prev.name}
          </Button>
        ) : (
          <span />
        )}
        {next && (
          <Button variant="secondary" onClick={() => go(`components/${next.id}`)}>
            {next.name} →
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
  const page = guide ?? (component ? undefined : GUIDE[0])
  const currentLabel = guide?.title ?? component?.name ?? GUIDE[0].title

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

  return (
    <div className="dynamic-lab-glow-bg flex min-h-screen flex-col">
      <SiteHeader
        brand={
          <a
            href="#/guide/getting-started"
            className="flex items-center gap-2"
            aria-label="Dynamic Lab documentation home">
            <BrandLockup name="Dynamic Lab" product="Docs" />
          </a>
        }
        nav={
          <SiteNav>
            <SiteNavLink
              active={section === 'guide' && id !== 'theming'}
              onClick={() => go('guide/getting-started')}>
              Guide
            </SiteNavLink>
            <SiteNavLink
              active={section === 'components'}
              onClick={() => go(`components/${COMPONENTS[0].id}`)}>
              Components
            </SiteNavLink>
            <SiteNavLink
              active={section === 'guide' && id === 'theming'}
              onClick={() => go('guide/theming')}>
              Theming
            </SiteNavLink>
          </SiteNav>
        }
        actions={
          <>
            <Badge variant="neutral" className="hidden sm:inline-flex">
              v{pkg.version}
            </Badge>
            <div className="hidden w-56 md:block">
              <CommandTrigger label="Search docs…" onClick={() => setPaletteOpen(true)} />
            </div>
            <IconButton
              aria-label="Search docs"
              variant="ghost"
              className="md:hidden"
              icon={<Search className="size-4" />}
              onClick={() => setPaletteOpen(true)}
            />
            <AppearanceSettings themesHref="#/guide/theming" />
            <Tooltip content="Source on GitLab" side="bottom">
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="icon-button border-0! bg-transparent!"
                aria-label="Source on GitLab">
                <ExternalLink className="size-4" />
              </a>
            </Tooltip>
          </>
        }
      />

      <div className="mx-auto grid w-full max-w-[var(--container-max)] flex-1 grid-cols-1 gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <SidebarNav
          aria-label="Documentation"
          title="Documentation"
          collapsible
          currentLabel={currentLabel}
          className="h-fit w-full lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <SidebarNavGroup label="Guide">
            {GUIDE.map((g) => (
              <SidebarNavItem
                key={g.id}
                active={guide?.id === g.id || (!guide && !component && g === GUIDE[0])}
                onClick={() => go(`guide/${g.id}`)}>
                {g.title}
              </SidebarNavItem>
            ))}
          </SidebarNavGroup>
          <div className="px-1 pt-2">
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
        </SidebarNav>

        <main className="min-w-0">
          {component ? (
            <ComponentPage key={component.id} doc={component} />
          ) : (
            page && <page.render key={page.id} />
          )}
        </main>
      </div>

      <SiteFooter
        start={<span>© 2026 Vedla Creative &amp; The Furlab Project · MIT licence</span>}
        end={
          <a href={REPO} className="hover:underline">
            {pkg.name}@{pkg.version}
          </a>
        }
      />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={commands}
        placeholder="Search components and guides…"
      />
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
