import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Copy, Type } from 'lucide-react'
import {
  AppearanceSettings,
  Badge,
  BrandLockup,
  Card,
  FilterChip,
  IconButton,
  Popover,
  SegmentedControl,
  Select,
  SiteFooter,
  SiteHeader,
  SiteNav,
  SiteNavLink,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeProvider,
  ToastProvider,
  Tooltip,
  buttonVariants,
  useToast,
} from '@furlab/dynamic-lab'
import { cssVariable, faces, weights, type TheLabSansFace } from '@furlab/the-lab-sans'
import pkg from '@furlab/the-lab-sans/package.json'
import { LANDING_URL, REPOSITORY_URL } from './links'
import { GitLabLogo, NpmLogo } from './logos'

const INSTALL = `yarn add ${pkg.name}`
const PANGRAM = 'The quick brown fox jumps over the lazy dog'

/* ------------------------------------------------------------------ Data */

const SCRIPTS = [
  {
    name: 'Latin',
    note: 'Western, Central and Eastern European languages',
    sample: 'Über Fjord & Ærø — Ça, Łódź, Ğ, Ş, Ő, Ů, Ż',
  },
  { name: 'Vietnamese', note: 'Every tone mark', sample: 'Tiếng Việt: Phở, Hà Nội, Nguyễn' },
  { name: 'Greek', note: 'Monotonic', sample: 'Καλημέρα κόσμε · Αλφάβητο' },
  {
    name: 'Cyrillic',
    note: 'Russian, Ukrainian, Serbian and more',
    sample: 'Привіт, світе · Ђорђе Ћирилица',
  },
]

const GLYPH_SETS = [
  { name: 'Uppercase', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  { name: 'Lowercase', chars: 'abcdefghijklmnopqrstuvwxyz' },
  { name: 'Figures', chars: '0123456789' },
  { name: 'Punctuation', chars: '.,:;…!?¡¿‽·•-–—_()[]{}/\\|\'"‘’“”‹›«»' },
  { name: 'Symbols', chars: '&@#%‰*+−±×÷=≠≈≤≥∞§¶©®™°†‡' },
  { name: 'Currency', chars: '$€£¥₹₽₺₴¢' },
  { name: 'Arrows', chars: '←↑→↓' },
]

/** OpenType features the font has, with a sample that shows each one off. */
const FEATURES = [
  { tag: 'smcp', label: 'Small caps', sample: 'Small Caps for Headings' },
  { tag: 'onum', label: 'Old-style figures', sample: 'Since 1984, 2,350 members' },
  { tag: 'tnum', label: 'Tabular figures', sample: '111.11 / 888.88' },
  { tag: 'frac', label: 'Fractions', sample: '1/2 cup, 3/4 inch, 5/8' },
  { tag: 'zero', label: 'Slashed zero', sample: 'ID 0O0-80B0' },
  { tag: 'sups', label: 'Superscript', sample: 'E=mc2 · x2 + y3' },
  { tag: 'ss01', label: 'Stylistic set 1', sample: 'Ag Rag Bag yay' },
  { tag: 'dlig', label: 'Discretionary ligatures', sample: 'ct st sp fi fl' },
] as const

type FeatureTag = (typeof FEATURES)[number]['tag']

const SIZES = [
  { value: '24', label: 'S' },
  { value: '48', label: 'M' },
  { value: '80', label: 'L' },
  { value: '128', label: 'XL' },
]

const USAGE = [
  {
    id: 'next',
    label: 'Next.js',
    files: [
      {
        name: 'app/layout.tsx',
        code: `import '${pkg.name}/the-lab-sans.css'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`,
      },
      {
        name: 'app/globals.css',
        code: `body {
  font-family: var(${cssVariable});
}`,
      },
    ],
    note: 'Works with the App Router (Turbopack or webpack). With the Pages Router, import the stylesheet in pages/_app.tsx instead. Next.js copies the WOFF2 files into _next/static/media itself.',
  },
  {
    id: 'vite',
    label: 'Vite & React',
    files: [
      {
        name: 'src/main.tsx',
        code: `import '${pkg.name}/the-lab-sans.css'
import './index.css' // body { font-family: var(${cssVariable}); }`,
      },
    ],
    note: 'Any bundler that understands CSS imports and package exports works the same way.',
  },
  {
    id: 'tailwind',
    label: 'Tailwind CSS v4',
    files: [
      {
        name: 'app.css',
        code: `@import 'tailwindcss';
@import '${pkg.name}/the-lab-sans.css';

@theme {
  --font-sans: var(${cssVariable});
}`,
      },
    ],
    note: 'Every font-sans utility, and Tailwind’s default body font, now use The Lab Sans.',
  },
  {
    id: 'dynamic-lab',
    label: 'Dynamic Lab',
    files: [
      {
        name: 'app/layout.tsx',
        code: `import '@furlab/dynamic-lab/styles.css'
import '${pkg.name}/the-lab-sans.css'`,
      },
    ],
    note: 'Dynamic Lab lists The Lab Sans first in --font-sans and --font-display, so loading the stylesheet is all it takes.',
  },
  {
    id: 'js',
    label: 'JavaScript',
    files: [
      {
        name: 'theme.ts',
        code: `import { fontFamily, fontStack, faces } from '${pkg.name}'

fontFamily // 'The Lab Sans'
fontStack  // "'The Lab Sans', ui-sans-serif, system-ui, …"
faces      // [{ name: 'Thin', weight: 100, style: 'normal', file: 'TheLabSans-Thin' }, …]`,
      },
    ],
    note: 'For canvas, charts, emails or anything else that needs the family name or the list of faces. WOFF2 files are at fonts/*.woff2 and the OpenType originals at otf/*.otf.',
  },
]

/* ------------------------------------------------------------------ Bits */

function useCopy() {
  const { toast } = useToast()
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 1600)
    } catch {
      toast({ title: 'Couldn’t copy', description: 'Select the text and copy it by hand.' })
    }
  }
  return { copied, copy }
}

function CodeFile({ name, code }: { name: string; code: string }) {
  const { copied, copy } = useCopy()
  return (
    <div className="specimen-code">
      <div className="flex items-center justify-between border-b border-[var(--border)] py-1 pr-1 pl-3.5 font-mono text-xs text-[var(--muted-foreground)]">
        <span>{name}</span>
        <IconButton
          aria-label={copied ? 'Copied' : `Copy ${name}`}
          variant="ghost"
          icon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          onClick={() => copy(code)}
        />
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}

function InstallSnippet() {
  const { copied, copy } = useCopy()
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_70%,transparent)] py-1 pr-1 pl-4 font-mono text-sm backdrop-blur-md">
      <span className="text-[var(--muted-foreground)] select-none">$</span>
      <code className="min-w-0 truncate">{INSTALL}</code>
      <IconButton
        aria-label="Copy install command"
        variant="ghost"
        icon={copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        onClick={() => copy(INSTALL)}
      />
    </div>
  )
}

function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex max-w-2xl scroll-mt-24 flex-col gap-2" id={id}>
      <span className="page-eyebrow">{eyebrow}</span>
      <h2 className="text-3xl font-extrabold tracking-tight">{title}</h2>
      {children && <p className="text-[var(--muted-foreground)]">{children}</p>}
    </div>
  )
}

/* -------------------------------------------------------------- Sections */

function Hero() {
  return (
    <section className="flex flex-col items-start gap-6">
      <Badge icon={<Type className="size-3.5" />}>The Furlab typeface</Badge>
      <h1 className="specimen-type text-[clamp(3.5rem,13vw,10rem)] leading-[0.9] font-black tracking-tight">
        The Lab <span className="font-thin italic">Sans</span>
      </h1>
      <p className="max-w-2xl text-lg text-pretty text-[var(--muted-foreground)]">
        A friendly, sturdy sans for The Furlab Project. Eight weights from Thin to Black, each with
        a true italic, more than a thousand characters across Latin, Greek, Cyrillic and Vietnamese,
        and the OpenType features that make interfaces and long reads look right.
      </p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">8 weights</Badge>
        <Badge variant="neutral">16 styles</Badge>
        <Badge variant="neutral">1,034 characters</Badge>
        <Badge variant="neutral">WOFF2 + OpenType</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a href="#use" className={buttonVariants({ size: 'lg' })}>
          Use it in your app
          <ArrowRight className="size-5" />
        </a>
        <InstallSnippet />
      </div>
    </section>
  )
}

function Weights() {
  const [italic, setItalic] = useState(false)
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="weights" eyebrow="Weights" title="Thin to Black, upright and italic" />
        <Switch checked={italic} onCheckedChange={setItalic} label="Italic" />
      </div>
      <Card className="flex flex-col divide-y divide-[var(--border)] p-0">
        {weights.map(({ name, weight }) => (
          <div
            key={name}
            className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-6 sm:px-6">
            <span className="w-32 shrink-0 text-sm text-[var(--muted-foreground)]">
              {name} <span className="tabular-nums">{weight}</span>
            </span>
            <span
              className="specimen-type truncate text-2xl sm:text-4xl"
              style={{ fontWeight: weight, fontStyle: italic ? 'italic' : 'normal' }}>
              {PANGRAM}
            </span>
          </div>
        ))}
      </Card>
    </section>
  )
}

function Tester() {
  const [text, setText] = useState('Stories, comics and art by the community, for the community.')
  const [face, setFace] = useState<TheLabSansFace>(faces.find((f) => f.weight === 700)!)
  const [size, setSize] = useState(80)
  const [features, setFeatures] = useState<FeatureTag[]>([])

  const toggle = (tag: FeatureTag) =>
    setFeatures((on) => (on.includes(tag) ? on.filter((t) => t !== tag) : [...on, tag]))

  return (
    <section className="flex flex-col gap-8">
      <SectionHeading id="tester" eyebrow="Type tester" title="Try it with your own words">
        Pick a style and size, and turn OpenType features on and off.
      </SectionHeading>
      <Card className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,14rem)] md:items-end">
          <Select
            label="Style"
            value={`${face.weight}-${face.style}`}
            onChange={(e) =>
              setFace(faces.find((f) => `${f.weight}-${f.style}` === e.target.value)!)
            }
            options={faces.map((f) => ({
              value: `${f.weight}-${f.style}`,
              label: `${f.name}${f.style === 'italic' ? ' Italic' : ''} · ${f.weight}`,
            }))}
          />
          <SegmentedControl
            aria-label="Preset size"
            value={String(size)}
            onValueChange={(v) => setSize(Number(v))}
            options={SIZES}
          />
          <label className="flex flex-col gap-1.5">
            <span className="button-sm flex justify-between">
              Size <span className="text-[var(--muted-foreground)] tabular-nums">{size}px</span>
            </span>
            <input
              type="range"
              min={12}
              max={200}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="ui-range h-[var(--touch-target)]"
              aria-label="Font size"
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="OpenType features">
          {FEATURES.map((f) => (
            <FilterChip key={f.tag} active={features.includes(f.tag)} onClick={() => toggle(f.tag)}>
              {f.label}
            </FilterChip>
          ))}
        </div>
        <Textarea
          aria-label="Sample text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          className="specimen-preview specimen-type min-h-48 resize-y [field-sizing:content] leading-[1.1] break-words"
          style={{
            fontSize: size,
            fontWeight: face.weight,
            fontStyle: face.style,
            fontFeatureSettings: features.length
              ? features.map((t) => `'${t}' 1`).join(', ')
              : undefined,
          }}
        />
      </Card>
    </section>
  )
}

function Features() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading id="features" eyebrow="OpenType" title="Features that do the fiddly work">
        Each sample is shown without the feature, then with it.
      </SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Card key={f.tag} variant="panel" className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold">{f.label}</h3>
              <code className="text-xs text-[var(--muted-foreground)]">{f.tag}</code>
            </div>
            <p className="specimen-type text-xl text-[var(--muted-foreground)]">{f.sample}</p>
            <p className="specimen-type text-xl" style={{ fontFeatureSettings: `'${f.tag}' 1` }}>
              {f.sample}
            </p>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Languages() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading id="languages" eyebrow="Languages" title="Four scripts, one voice" />
      <div className="grid gap-4 md:grid-cols-2">
        {SCRIPTS.map((s) => (
          <Card key={s.name} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-bold">{s.name}</h3>
              <span className="body-sm text-[var(--muted-foreground)]">{s.note}</span>
            </div>
            <p className="specimen-type text-2xl font-semibold sm:text-3xl">{s.sample}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Glyphs() {
  const [weight, setWeight] = useState('400')
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading id="glyphs" eyebrow="Glyphs" title="Character set" />
        <SegmentedControl
          aria-label="Glyph weight"
          size="sm"
          value={weight}
          onValueChange={setWeight}
          options={[
            { value: '300', label: 'Light' },
            { value: '400', label: 'Regular' },
            { value: '700', label: 'Bold' },
            { value: '900', label: 'Black' },
          ]}
        />
      </div>
      <div className="flex flex-col gap-6">
        {GLYPH_SETS.map((set) => (
          <div key={set.name} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-[var(--muted-foreground)]">{set.name}</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(3.5rem,1fr))] gap-1.5">
              {[...set.chars].map((ch) => (
                <span
                  key={ch}
                  title={`U+${ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`}
                  className="specimen-type grid aspect-square place-items-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_60%,transparent)] text-2xl"
                  style={{ fontWeight: Number(weight) }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Usage() {
  return (
    <section className="flex flex-col gap-8">
      <SectionHeading id="use" eyebrow="Use it" title="Install the package, import one stylesheet">
        The package ships WOFF2 web fonts, a stylesheet with every @font-face rule and a{' '}
        <code className="rounded-[var(--radius-sm)] bg-[var(--muted)] px-1 text-[0.9em] whitespace-nowrap">
          {cssVariable}
        </code>{' '}
        variable, the OpenType files for desktop apps, and a little JavaScript with the family name
        and list of faces.
      </SectionHeading>
      <InstallSnippet />
      <Tabs defaultValue="next" variant="line">
        <TabsList className="overflow-x-auto">
          {USAGE.map((u) => (
            <TabsTrigger key={u.id} value={u.id}>
              {u.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {USAGE.map((u) => (
          <TabsContent key={u.id} value={u.id} className="flex flex-col gap-3 pt-4">
            {u.files.map((f) => (
              <CodeFile key={f.name} {...f} />
            ))}
            <p className="body-sm max-w-3xl text-[var(--muted-foreground)]">{u.note}</p>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

/* ------------------------------------------------------------------ Page */

function Specimen() {
  return (
    <div className="dynamic-lab-glow-bg flex min-h-screen flex-col">
      <SiteHeader
        brand={
          <a href="#" className="flex items-center gap-2" aria-label="The Lab Sans home">
            <BrandLockup
              name="The Lab Sans"
              product="Type"
              className="max-sm:[&_.ui-brand-product]:hidden"
            />
          </a>
        }
        nav={
          <SiteNav>
            <SiteNavLink href="#weights">Weights</SiteNavLink>
            <SiteNavLink href="#tester">Tester</SiteNavLink>
            <SiteNavLink href="#use">Use it</SiteNavLink>
            <SiteNavLink href={LANDING_URL} icon={<ArrowLeft />}>
              Dynamic Lab
            </SiteNavLink>
          </SiteNav>
        }
        actions={
          <>
            <Badge variant="neutral" className="hidden xl:inline-flex">
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
        <Hero />
        <Weights />
        <Tester />
        <Features />
        <Languages />
        <Glyphs />
        <Usage />
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

export function SpecimenApp() {
  return (
    <ThemeProvider defaultBrand="dynamic" storageKey="dynamic-lab-the-lab-sans">
      <ToastProvider>
        <Specimen />
      </ToastProvider>
    </ThemeProvider>
  )
}
