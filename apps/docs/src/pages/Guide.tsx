import React from 'react'

import {
  Badge,
  NoticePanel,
  PageHeading,
  PalettePreview,
  PALETTES,
  TransparencyControl,
  useTheme,
} from '@furlab/dynamic-lab'
import pkg from '@furlab/dynamic-lab/package.json'

import { Code, CodeBlock, PropsTable, Prose } from '../ui'

const REGISTRY = import.meta.env.VITE_REGISTRY_URL ?? 'https://gitlab.com/api/v4/packages/npm/'
const REGISTRY_HOST = REGISTRY.replace(/^https?:/, '')
const REPO = import.meta.env.VITE_REPOSITORY_URL ?? pkg.repository.url

export interface GuidePage {
  id: string
  title: string
  render: React.ComponentType
}

function GettingStarted() {
  return (
    <>
      <PageHeading
        title="Dynamic Lab"
        description="The React component library for The Furlab Project: the public site (Dynamic) and the staff console (Backstage), with named colour themes, light and dark modes and adjustable transparency."
      />
      <Prose>
        <h2>Install</h2>
        <p>
          The package is on npm (and mirrored in the GitLab package registry, see{' '}
          <a href="#/guide/installation">Installation</a>). Add it with React 19:
        </p>
        <CodeBlock language="sh" code={`yarn add ${pkg.name} react react-dom`} />
        <h2>Set up</h2>
        <p>
          Import the stylesheet once and wrap your app in the providers. ThemeProvider sets the
          brand, mode, colour theme and transparency; ToastProvider enables toasts.
        </p>
        <CodeBlock
          code={`import { ThemeProvider, ToastProvider } from '${pkg.name}'
import '${pkg.name}/styles.css'

export function App({ children }) {
  return (
    <ThemeProvider defaultBrand="dynamic" defaultPalette="midnight-wolf">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}`}
        />
        <h2>Use components</h2>
        <CodeBlock
          code={`import { Button, ContentCard, useToast } from '${pkg.name}'

function Publish() {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast({ title: 'Published', description: 'Your story is live.', tone: 'success' })}>
      Publish
    </Button>
  )
}`}
        />
        <p>
          Every component is documented under <strong>Components</strong> with a live example, its
          source and its props. Components work with or without Tailwind in your app; the published
          stylesheet already contains everything they need.
        </p>
      </Prose>
    </>
  )
}

function Installation() {
  return (
    <>
      <PageHeading
        title="Installation"
        description={`${pkg.name} is on npm, with a mirror in the GitLab package registry.`}
      />
      <Prose>
        <h2>1. Add the package</h2>
        <p>
          It is published to{' '}
          <a href={`https://www.npmjs.com/package/${pkg.name}`} target="_blank" rel="noreferrer">
            npmjs.com
          </a>
          , so no registry set-up is needed:
        </p>
        <CodeBlock
          language="sh"
          code={`yarn add ${pkg.name}\n# or: npm install ${pkg.name} / pnpm add ${pkg.name}`}
        />
        <p>
          While the library is in beta, the newest pre-release is on the <Code>next</Code> tag (
          <Code>yarn add {pkg.name}@next</Code>); <Code>latest</Code> is the last one promoted.
          React and React DOM 19 are peer dependencies. <Code>lucide-react</Code>, <Code>clsx</Code>
          , <Code>tailwind-merge</Code> and <Code>class-variance-authority</Code> install with it.
        </p>
        <h2>2. Or install from GitLab</h2>
        <p>
          Every release is also in the GitLab package registry. To use it, point the{' '}
          <Code>@furlab</Code> scope at the instance-level endpoint, which serves every project in
          the <Code>furlab</Code> group, then add the package as above.
        </p>
        <h3>Yarn (Berry)</h3>
        <CodeBlock
          language=".yarnrc.yml"
          code={`npmScopes:
  furlab:
    npmRegistryServer: "${REGISTRY}"
    # Only needed while the project is private:
    npmAuthToken: "\${GITLAB_TOKEN-}"`}
        />
        <h3>npm and pnpm</h3>
        <CodeBlock
          language=".npmrc"
          code={`@furlab:registry=${REGISTRY}
# Only needed while the project is private:
${REGISTRY_HOST}:_authToken=\${GITLAB_TOKEN}`}
        />
        <p>
          For a private project, create a personal or group access token with the{' '}
          <Code>read_api</Code> scope and export it as <Code>GITLAB_TOKEN</Code>. Never commit the
          token itself. In GitLab CI you can use <Code>CI_JOB_TOKEN</Code> instead.
        </p>
        <h2>3. Import the styles</h2>
        <CodeBlock code={`import '${pkg.name}/styles.css'`} />
        <p>
          The stylesheet holds the design tokens, component styles and the Tailwind utilities the
          components use. Component classes sit in the <Code>components</Code> cascade layer, so
          utilities you pass through <Code>className</Code> win.
        </p>
        <h3>If your app uses Tailwind v4</h3>
        <p>Import Tailwind first, then the library, so both share the same layers:</p>
        <CodeBlock
          language="css"
          code={`@import 'tailwindcss';\n@import '${pkg.name}/styles.css';`}
        />
        <h2>Fonts</h2>
        <p>
          To use a different family, set <Code>--font-sans</Code> and <Code>--font-display</Code> on{' '}
          <Code>:root</Code>.
        </p>
      </Prose>
    </>
  )
}

function Theming() {
  const { palette, setPalette } = useTheme()
  return (
    <>
      <PageHeading
        title="Theming"
        description="Two brands, two modes, eight colour themes and three transparency levels, all from ThemeProvider and CSS variables."
      />
      <Prose>
        <h2>ThemeProvider</h2>
        <p>
          Wrap your app once. It writes <Code>data-theme</Code>, <Code>data-mode</Code>,{' '}
          <Code>data-brand</Code> and <Code>data-transparency</Code> on <Code>&lt;html&gt;</Code>{' '}
          and saves choices to localStorage.
        </p>
        <PropsTable
          rows={[
            {
              name: 'defaultBrand',
              type: "'dynamic' | 'backstage'",
              default: "'dynamic'",
              description: 'Dynamic is the public site; Backstage is the staff console.',
            },
            {
              name: 'defaultMode',
              type: "'light' | 'dark'",
              default: 'system preference',
              description: 'Colour mode.',
            },
            {
              name: 'defaultPalette',
              type: 'string',
              default: "'midnight-wolf'",
              description: 'Colour theme id.',
            },
            {
              name: 'palettes',
              type: 'Palette[]',
              default: 'PALETTES',
              description: 'Themes on offer. Spread PALETTES to add your own.',
            },
            {
              name: 'paletteBrands',
              type: 'ThemeBrand[]',
              default: "['dynamic']",
              description:
                'Brands colour themes apply to. Backstage keeps its own look by default.',
            },
            {
              name: 'defaultTransparency',
              type: "'system' | 'full' | 'reduced' | 'off'",
              default: "'system'",
              description: 'Glass opacity. System follows prefers-reduced-transparency.',
            },
            {
              name: 'storageKey',
              type: 'string',
              default: "'dynamic-lab-theme'",
              description: 'localStorage prefix (DEFAULT_THEME_STORAGE_KEY).',
            },
          ]}
        />
        <p>
          On a server-rendered site, also put <Code>ThemeScript</Code> in <Code>&lt;head&gt;</Code>{' '}
          with the same props, so the saved theme is applied before the first paint. See{' '}
          <a href="#/guide/server-rendering">Server rendering</a>.
        </p>
        <CodeBlock
          code={`const { mode, setMode, palette, setPalette, transparency, setTransparency, brand, setBrand } = useTheme()

setPalette('fiery-fox')
setTransparency('off')`}
        />
        <h2>Brands</h2>
        <p>
          <strong>Dynamic</strong> is the public site: blue-grey neutrals, roomy corners and 44px
          touch targets. <strong>Backstage</strong> is the staff console: violet-tinted neutrals,
          tighter corners, denser controls, a solid sidebar and a dot-grid background. Switch with{' '}
          <Code>setBrand</Code>.
        </p>
        <h2>Colour themes</h2>
        <p>
          Each theme has a light and a dark version under the same name, and sets the accent, the
          tint of the neutrals and the background glows. Names are puns on fursona species. Click
          one to try it here.
        </p>
        <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPalette(p.id)}
              aria-pressed={palette === p.id}
              className="ui-palette-option ui-palette-option-card text-left">
              <div className="grid grid-cols-2 gap-1.5">
                <PalettePreview palette={p} mode="light" />
                <PalettePreview palette={p} mode="dark" />
              </div>
              <span className="flex items-center justify-between gap-2">
                <span className="font-bold">{p.name}</span>
                <Badge variant="neutral" size="sm">
                  {p.species}
                </Badge>
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">
                <Code>{p.id}</Code> · {p.description}
              </span>
            </button>
          ))}
        </div>
        <h3>Adding a theme</h3>
        <CodeBlock
          code={`import { PALETTES, ThemeProvider, type Palette } from '${pkg.name}'

const hyenaLaughs: Palette = {
  id: 'hyena-laughs',
  name: 'Hyena Laughs',
  species: 'Hyena',
  description: 'Sandy gold with a dusk glow.',
  neutralHue: 40,        // hue of backgrounds and borders
  neutralTint: 0.5,      // 0–1, how much of it shows
  light: { primary: 'hsl(38 80% 34%)', glowA: 'hsl(38 90% 60%)', glowB: 'hsl(15 80% 60%)' },
  dark: { primary: 'hsl(40 90% 62%)', glowA: 'hsl(38 80% 45%)', glowB: 'hsl(15 70% 45%)' },
}

<ThemeProvider palettes={[...PALETTES, hyenaLaughs]}>…</ThemeProvider>`}
        />
        <p>
          Keep light-mode accents dark enough for white text (about 4.5:1). To show a palette inside
          one element without changing the page, spread <Code>paletteStyle(palette, mode)</Code>{' '}
          into its style.
        </p>
        <h2>Transparency</h2>
        <p>
          Glass surfaces can make text harder to read. Offer this control somewhere in your
          settings; it changes the whole page.
        </p>
        <div className="not-prose my-4 max-w-md">
          <TransparencyControl />
        </div>
        <h2>Design tokens</h2>
        <p>
          Everything is a CSS custom property, so you can read or override tokens in your own CSS:
        </p>
        <CodeBlock
          language="css"
          code={`--background  --foreground  --card  --muted  --muted-foreground  --border  --input
--primary  --primary-foreground  --ring  --destructive  --success  --warning  --info
--status-{success,warning,danger}-{ink,bg}  --glow-a  --glow-b  --sidebar
--radius-{sm,md,lg,xl,2xl,3xl,full}  --space-{2…40}  --touch-target  --control-compact
--glass-alpha  --surface-alpha  --blur-chrome  --blur-panel  --font-sans  --font-display`}
        />
      </Prose>
    </>
  )
}

function Accessibility() {
  return (
    <>
      <PageHeading
        title="Accessibility"
        description="What the components do for you, and what is still your job."
      />
      <Prose>
        <h2>Built in</h2>
        <ul>
          <li>
            Menus, popovers, the command palette, tabs, segmented controls, radio groups and
            sortable lists all work with the keyboard (arrow keys, Home/End, Enter, Escape).
          </li>
          <li>
            Dialogs, drawers and the lightbox lock scrolling and close with Escape; popovers return
            focus to their trigger.
          </li>
          <li>
            Every interactive element has a visible focus ring using <Code>--ring</Code>.
          </li>
          <li>
            Reordering announces new positions to screen readers, and status changes use live
            regions.
          </li>
          <li>
            Animations respect <Code>prefers-reduced-motion</Code>; transparency respects{' '}
            <Code>prefers-reduced-transparency</Code> and can be turned off entirely.
          </li>
          <li>Mature content can be gated with AgeGate, and ratings use text, not colour alone.</li>
        </ul>
        <h2>Your job</h2>
        <ul>
          <li>
            Give icon-only buttons an <Code>aria-label</Code> (IconButton requires it).
          </li>
          <li>
            Label form fields: pass <Code>label</Code>, or <Code>aria-label</Code> when the label is
            visual only.
          </li>
          <li>
            Write alt text for content images, and keep custom palette accents at 4.5:1 against
            their text.
          </li>
        </ul>
        <NoticePanel tone="info" title="Touch targets">
          Dynamic controls are 44px tall. Backstage is a dense desktop console and uses 40px; don’t
          use the Backstage brand for touch-first screens.
        </NoticePanel>
      </Prose>
    </>
  )
}

function Publishing() {
  return (
    <>
      <PageHeading
        title="Releasing"
        description="How new versions get to npm and the GitLab package registry, and how these docs are deployed."
      />
      <Prose>
        <h2>Build</h2>
        <p>
          The library lives in <Code>packages/dynamic-lab</Code> of a Turborepo monorepo. Its{' '}
          <Code>build</Code> runs three steps: tsdown bundles ESM and CJS, <Code>tsc</Code> writes
          the type declarations, and the Tailwind CLI writes <Code>dist/styles.css</Code>.{' '}
          <Code>yarn build</Code> at the root builds it and every app that depends on it.
        </p>
        <h2>Release a version</h2>
        <p>Releases go through Changesets, so versions and changelogs are never edited by hand.</p>
        <ol>
          <li>
            With each change to a package, run <Code>yarn changeset</Code>: pick the package and the
            size of the bump, write the changelog entry, and commit the file it adds in{' '}
            <Code>.changeset/</Code>.
          </li>
          <li>
            On every push to <Code>main</Code>, the pipeline gathers the changesets into a{' '}
            <strong>Version Packages</strong> merge request that bumps the versions and writes the
            changelogs.
          </li>
          <li>
            Merging it releases: one pipeline type-checks and builds, publishes each package whose
            version moved to the project’s package registry and to npmjs.org (with trusted
            publishing, no token), creates the GitLab release and its tag (<Code>v0.2.0</Code> for
            this library, <Code>the-lab-sans-v0.2.0</Code> for the font) and deploys these docs.
            Pre-releases such as <Code>1.0.0-beta.1</Code> publish under the <Code>next</Code>{' '}
            dist-tag.
          </li>
        </ol>
        <p>
          The GitHub mirror’s workflow creates a matching GitHub release when the tags arrive, but
          never publishes.
        </p>
        <h2>The release CLI</h2>
        <p>
          <Code>scripts/release.mjs</Code> works locally too, through each package’s{' '}
          <Code>release</Code> script (<Code>yarn release</Code> at the root is short for this
          library’s). It checks that the tree is clean and that the version isn’t already published,
          then builds and publishes.
        </p>
        <CodeBlock
          language="sh"
          code={`# Check everything and list the package contents, publish nothing
yarn release --dry-run

# Publish to the GitLab package registry (token needs the api scope)
GITLAB_TOKEN=glpat-… yarn release

# Publish to npmjs.org
NPM_TOKEN=npm_… yarn release --registry npm`}
        />
        <PropsTable
          rows={[
            {
              name: 'CI_JOB_TOKEN / GITLAB_TOKEN',
              type: 'env',
              description: 'GitLab credentials. The job token is used automatically in CI.',
            },
            {
              name: 'NPM_TOKEN',
              type: 'env',
              description:
                'npmjs.org credentials. Without it, --registry npm exits with code 78, which CI allows to fail.',
            },
            {
              name: 'GITLAB_API_URL',
              type: 'env',
              default: 'https://gitlab.com/api/v4',
              description: 'For self-managed GitLab.',
            },
            {
              name: 'GITLAB_PROJECT',
              type: 'env',
              default: 'from package.json repository',
              description: 'Numeric id or group/project.',
            },
            {
              name: '--dry-run',
              type: 'flag',
              description: 'Build and list files without publishing.',
            },
            {
              name: '--registry <name>',
              type: 'flag',
              default: 'gitlab',
              description: 'gitlab or npm.',
            },
            {
              name: '--tag <name>',
              type: 'flag',
              default: 'latest, or next for pre-releases',
              description: 'Dist-tag.',
            },
            {
              name: '--allow-dirty',
              type: 'flag',
              description: 'Skip the clean working tree check (local only).',
            },
          ]}
        />
        <h2>Documentation</h2>
        <p>
          These docs are a Vite app in <Code>apps/docs</Code>, next to the landing page (
          <Code>apps/landing</Code>), the showcase (<Code>apps/showcase</Code>) and The Lab Sans
          specimen (<Code>apps/the-lab-sans</Code>). <Code>yarn dev</Code> runs them all locally. On
          the default branch the <Code>pages</Code> job runs <Code>yarn pages</Code>, which builds
          them into <Code>public/</Code> (landing at the root, then <Code>showcase/</Code>,{' '}
          <Code>docs/</Code> and <Code>the-lab-sans/</Code>) for GitLab Pages. Examples live in{' '}
          <Code>apps/docs/src/examples</Code> and each page shows that file’s source, so the code
          shown is always the code running.
        </p>
        <p>
          Source: <a href={REPO}>{REPO.replace(/^https?:\/\//, '')}</a>
        </p>
      </Prose>
    </>
  )
}

function ServerRendering() {
  return (
    <>
      <PageHeading
        title="Server rendering"
        description="Using Dynamic Lab with React Server Components, in Next.js (App Router) and similar frameworks."
      />
      <Prose>
        <h2>What runs where</h2>
        <p>
          Only the modules that need the browser (state, effects, portals, browser APIs) are marked{' '}
          <Code>'use client'</Code>. Everything else is a plain module, so in a Server Component you
          can render layout, typography, cards, badges, tables and the rest on the server, and call
          the helpers (<Code>cn</Code>, <Code>buttonVariants</Code>, <Code>toSpace</Code>,{' '}
          <Code>formatCount</Code>, <Code>renderMarkdown</Code>, <Code>TOKENS</Code>…) directly.
          Their JavaScript isn’t sent to the browser.
        </p>
        <p>
          Interactive components still work from a Server Component: import and render them as
          usual, and the framework hydrates just those. These are client components:
        </p>
        <ul>
          <li>
            <strong>Overlays and menus:</strong> Dialog, Drawer, Popover, DropdownMenu and Menu,
            MenuItem, Tooltip, HoverCard, CommandPalette and CommandTrigger, Lightbox, ToastProvider
          </li>
          <li>
            <strong>Forms:</strong> Switch, Checkbox, RadioGroup, SegmentedControl, Slider,
            Combobox, DatePicker and Calendar, FileInput, ImageUploader, ImageCropper, TagInput,
            MarkdownEditor, SortableList
          </li>
          <li>
            <strong>Navigation and shells:</strong> SiteHeader, SidebarNav, Tabs, Accordion and
            Collapsible, AppSwitcher, AdminShell and AdminSidebar, Carousel
          </li>
          <li>
            <strong>Content:</strong> ComicReader, MediaGallery, ReaderSettings, ChapterNav,
            CommentThread and CommentComposer, ContentActions, MessageThread and MessageComposer,
            LikeButton, ReactionBar and ReactionPicker, AgeGate, ColorSwatch, LocalDateTime,
            Sparkline and BarChart
          </li>
          <li>
            <strong>Theming:</strong> ThemeProvider, ThemeToggle, AppearanceSettings, PalettePicker,
            TransparencyControl, and every hook (<Code>useTheme</Code>, <Code>useToast</Code>…)
          </li>
        </ul>
        <p>
          Pieces of these that don’t need the browser are server-safe on their own: SiteNav,
          SiteNavLink and SiteFooter, SidebarNavGroup and SidebarNavItem, MenuLabel and
          MenuSeparator, Select, MessageBubble, MessageDivider and ConversationItem, StatTile,
          CharacterSheet and SwatchList, ProfilePreview, PalettePreview, AgeRating and
          ReadingProgress.
        </p>

        <h2>Next.js set-up</h2>
        <p>
          ThemeProvider holds state, so wrap it (and ToastProvider) in a small client component, and
          put <Code>ThemeScript</Code> in <Code>&lt;head&gt;</Code> with the same props. The script
          applies the saved theme before the first paint; ThemeProvider renders the defaults while
          hydrating, so the server and client HTML match, then takes over. Add{' '}
          <Code>suppressHydrationWarning</Code> to <Code>&lt;html&gt;</Code>, because the script
          changes its attributes.
        </p>
        <CodeBlock
          language="app/providers.tsx"
          code={`'use client'
import { ThemeProvider, ToastProvider } from '${pkg.name}'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider storageKey="my-app">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}`}
        />
        <CodeBlock
          language="app/layout.tsx"
          code={`import '${pkg.name}/styles.css'
import { ThemeScript } from '${pkg.name}'
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript storageKey="my-app" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}`}
        />
        <p>
          <Code>ThemeScript</Code> takes a <Code>nonce</Code> for a Content Security Policy.
        </p>

        <h2>Things to know</h2>
        <ul>
          <li>
            A Server Component can’t pass functions to a client component, so handlers such as{' '}
            <Code>onClick</Code>, <Code>onValueChange</Code> or a <Code>format</Code> function
            belong in a client component of your own.
          </li>
          <li>
            Values exported next to client components (<Code>DEFAULT_REACTIONS</Code>,{' '}
            <Code>defaultApps</Code>, <Code>DEFAULT_READER_PREFS</Code>…) live in their own plain
            modules, so they can be read on the server too.
          </li>
          <li>
            For the font, import <Code>@furlab/the-lab-sans/the-lab-sans.css</Code> in the root
            layout too; Next.js serves the font files from your own domain.
          </li>
        </ul>
      </Prose>
    </>
  )
}

function Utilities() {
  return (
    <>
      <PageHeading
        title="Utilities and hooks"
        description="The helpers the components are built from, exported for your own components."
      />
      <Prose>
        <h2>Class names</h2>
        <p>
          <Code>cn(...classes)</Code> joins class names with <Code>clsx</Code> and resolves
          conflicting Tailwind utilities with <Code>tailwind-merge</Code>, so a{' '}
          <Code>className</Code> you pass wins over a component's own.
        </p>
        <CodeBlock code={`cn('px-4 py-2', isActive && 'bg-[var(--primary)]', className)`} />

        <h2>Variant classes</h2>
        <p>
          To style your own element like a library component, use its class builder:{' '}
          <Code>buttonVariants({'{ variant, size }'})</Code>,{' '}
          <Code>badgeVariants({'{ variant, size }'})</Code>,{' '}
          <Code>headingVariants({'{ size, tone }'})</Code>,{' '}
          <Code>textVariants({'{ size, weight, tone }'})</Code> and{' '}
          <Code>containerVariants({'{ size, gutter }'})</Code>. They return class names, so a link
          can look like a button.
        </p>
        <CodeBlock
          code={`<a href="/upload" className={buttonVariants({ variant: 'primary' })}>Upload</a>`}
        />

        <h2>State and dismissal</h2>
        <PropsTable
          rows={[
            {
              name: 'useControllableState(value, defaultValue, onChange)',
              type: '[value, setValue]',
              description:
                'State that is controlled when value is set and uncontrolled otherwise, the pattern every component with value / defaultValue / onValueChange uses.',
            },
            {
              name: 'useDismiss(refs, active, onDismiss)',
              type: 'void',
              description:
                "Calls onDismiss('outside' | 'escape') on a press outside every ref, or on Escape. Pass several refs when part of the UI is in a portal.",
            },
            {
              name: 'useLatestRef(value)',
              type: 'RefObject',
              description:
                'A ref that always holds the latest value, for reading in handlers and effects without re-subscribing. Updated after render, so don’t read it during render.',
            },
            {
              name: 'useScrollLock(active)',
              type: 'void',
              description: 'Stops the page scrolling while a dialog or drawer is open.',
            },
            {
              name: 'focusSibling(container, selector, direction)',
              type: 'void',
              description:
                "Moves focus to the 'next', 'prev', 'first' or 'last' element matching selector, for arrow-key menus and lists.",
            },
            {
              name: 'isMacPlatform()',
              type: 'boolean',
              description: 'True on macOS and iOS, to show ⌘ instead of Ctrl in shortcuts.',
            },
          ]}
        />

        <h2>Floating panels</h2>
        <p>
          <Code>useFloating(anchorRef, panelRef, open, {'{ side, align, matchWidth }'})</Code>{' '}
          positions a panel rendered in a portal next to its anchor: it flips when there isn’t room,
          stays on screen and follows the anchor on scroll and resize. Spread{' '}
          <Code>floatingStyle(position)</Code> on the panel; it stays hidden until measured.
          Combobox, DatePicker and HoverCard use it.
        </p>
        <CodeBlock
          code={`const position = useFloating(fieldRef, panelRef, open, { matchWidth: true })

{open && createPortal(
  <div ref={panelRef} style={floatingStyle(position)} className="ui-menu z-[80]">…</div>,
  document.body
)}`}
        />

        <h2>Responsive layout values</h2>
        <p>
          The layout primitives take <Code>{'Responsive<T>'}</Code>: a value, or one per breakpoint
          (<Code>{'{ base, sm, md, lg, xl }'}</Code>, the same as Tailwind’s, listed in{' '}
          <Code>BREAKPOINTS</Code>). Spacing is a <Code>Space</Code>: a number on the 4px scale or
          any CSS length, converted by <Code>toSpace</Code>.
        </p>
        <p>
          To make your own responsive component, turn a prop into CSS variables with{' '}
          <Code>responsiveVars(name, value, format)</Code> (it writes <Code>--name</Code>,{' '}
          <Code>--name-md</Code> and so on), merge them into <Code>style</Code> with{' '}
          <Code>withVars</Code>, and read them in your CSS inside media queries. <Code>ALIGN</Code>{' '}
          and <Code>JUSTIFY</Code> map the short alignment names to CSS values.
        </p>
        <CodeBlock
          code={`style={withVars(responsiveVars('cols', cols, String), style)}

/* CSS */
.my-grid { grid-template-columns: repeat(var(--cols, 1), 1fr); }
@media (min-width: 768px) {
  .my-grid { grid-template-columns: repeat(var(--cols-md, var(--cols, 1)), 1fr); }
}`}
        />

        <h2>Formatting and data</h2>
        <PropsTable
          rows={[
            {
              name: 'formatCount(n, locale?)',
              type: 'string',
              description: 'Compact counts in the reader’s locale: 1.2K, 34K, 1.5M.',
            },
            {
              name: 'toDateKey(date)',
              type: 'string',
              description: "'YYYY-MM-DD' in local time, the key format of Calendar events.",
            },
            {
              name: 'cropImage(src, area, options?)',
              type: 'Promise<Blob>',
              description: 'Exports an ImageCropper area as an image file.',
            },
            {
              name: 'formatTagName(name)',
              type: 'string',
              description: 'Shows a stored tag ("red_fox") with spaces ("red fox").',
            },
            {
              name: 'relativeTime(date)',
              type: 'string',
              description:
                "Relative times as comments show them: 'just now', '5m ago', '3h ago', then a date after 30 days.",
            },
            {
              name: 'DEFAULT_REACTIONS',
              type: 'ReactionChoice[]',
              description:
                'The reactions ReactionBar and ReactionPicker offer by default, as icons.',
            },
            {
              name: 'DEFAULT_READER_PREFS',
              type: 'ReaderPrefs',
              description: 'The story reader’s starting font size, font, line height and width.',
            },
          ]}
        />

        <h2>Theme data</h2>
        <p>
          <Code>TOKENS</Code> holds the radii, spacing and brand colours as values for JavaScript
          (charts, canvas, emails). <Code>PALETTES</Code> and <Code>DEFAULT_PALETTE_ID</Code> list
          the colour themes, and <Code>paletteTokens(palette, mode)</Code> /{' '}
          <Code>paletteStyle</Code> give the CSS variables one sets, e.g. to preview a theme inside
          a card. <Code>defaultApps</Code> is the AppSwitcher’s standard list of Furlab apps. See{' '}
          <a href="#/guide/theming">Theming</a>.
        </p>
      </Prose>
    </>
  )
}

export const GUIDE: GuidePage[] = [
  { id: 'getting-started', title: 'Getting started', render: GettingStarted },
  { id: 'installation', title: 'Installation', render: Installation },
  { id: 'theming', title: 'Theming', render: Theming },
  { id: 'accessibility', title: 'Accessibility', render: Accessibility },
  { id: 'server-rendering', title: 'Server rendering', render: ServerRendering },
  { id: 'utilities', title: 'Utilities and hooks', render: Utilities },
  { id: 'releasing', title: 'Releasing', render: Publishing },
]
