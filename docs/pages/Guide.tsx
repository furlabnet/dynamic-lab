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

import pkg from '../../package.json'
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
        eyebrow="Documentation"
        title="Dynamic Lab"
        description="The React component library for The Furlab Project: the public site (Dynamic) and the staff console (Backstage), with named colour themes, light and dark modes and adjustable transparency."
      />
      <Prose>
        <h2>Install</h2>
        <p>
          The package is published to the GitLab package registry. Point the <Code>@furlab</Code>{' '}
          scope at it once (see <a href="#/guide/installation">Installation</a>), then add it with
          React 19:
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
        eyebrow="Guide"
        title="Installation"
        description={`${pkg.name} lives in the GitLab package registry, not on npmjs.com.`}
      />
      <Prose>
        <h2>1. Point the scope at GitLab</h2>
        <p>
          Packages in the <Code>@furlab</Code> scope come from the instance-level endpoint, which
          serves every project in the <Code>furlab</Code> group.
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
        <h2>2. Add the package</h2>
        <CodeBlock
          language="sh"
          code={`yarn add ${pkg.name}\n# or: npm install ${pkg.name} / pnpm add ${pkg.name}`}
        />
        <p>
          React and React DOM 19 are peer dependencies. <Code>lucide-react</Code>, <Code>clsx</Code>
          , <Code>tailwind-merge</Code> and <Code>class-variance-authority</Code> install with it.
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
        eyebrow="Guide"
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
              description: 'localStorage prefix.',
            },
          ]}
        />
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
        eyebrow="Guide"
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
        eyebrow="Guide"
        title="Releasing"
        description="How new versions get to the GitLab package registry, and how these docs are deployed."
      />
      <Prose>
        <h2>Build</h2>
        <p>
          <Code>yarn build</Code> runs three steps: tsdown bundles ESM and CJS, <Code>tsc</Code>{' '}
          writes the type declarations, and the Tailwind CLI writes <Code>dist/styles.css</Code>.
        </p>
        <h2>Release a version</h2>
        <ol>
          <li>
            Bump <Code>version</Code> in <Code>package.json</Code> (semver) and commit.
          </li>
          <li>
            Tag and push: <Code>git tag v0.2.0 &amp;&amp; git push origin v0.2.0</Code>.
          </li>
          <li>
            The pipeline’s <Code>publish</Code> job runs <Code>yarn release</Code> with the CI job
            token. Pre-release tags such as <Code>v1.0.0-beta.1</Code> publish under the{' '}
            <Code>next</Code> dist-tag.
          </li>
        </ol>
        <h2>The release CLI</h2>
        <p>
          <Code>scripts/release.mjs</Code> works locally too. It checks that the tag matches the
          version, that the tree is clean and that the version isn’t already published, then builds
          and publishes to the project’s npm endpoint.
        </p>
        <CodeBlock
          language="sh"
          code={`# Check everything and list the package contents, publish nothing
yarn release --dry-run

# Publish from your machine (token needs the api scope)
GITLAB_TOKEN=glpat-… yarn release

# Publish a pre-release under the "next" tag
GITLAB_TOKEN=glpat-… yarn release --tag next`}
        />
        <PropsTable
          rows={[
            {
              name: 'CI_JOB_TOKEN / GITLAB_TOKEN',
              type: 'env',
              description: 'Credentials. The job token is used automatically in CI.',
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
            { name: '--tag <name>', type: 'flag', default: 'latest', description: 'Dist-tag.' },
            {
              name: '--allow-dirty',
              type: 'flag',
              description: 'Skip the clean working tree check (local only).',
            },
          ]}
        />
        <h2>Documentation</h2>
        <p>
          These docs are a separate Vite app in <Code>docs/</Code>. <Code>yarn docs:dev</Code> runs
          them locally; on the default branch the <Code>pages</Code> job builds them into{' '}
          <Code>public/</Code> and GitLab Pages serves them. Examples live in{' '}
          <Code>docs/examples</Code> and each page shows that file’s source, so the code shown is
          always the code running.
        </p>
        <p>
          Source: <a href={REPO}>{REPO.replace(/^https?:\/\//, '')}</a>
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
  { id: 'releasing', title: 'Releasing', render: Publishing },
]
