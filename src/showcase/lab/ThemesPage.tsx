import React from 'react'
import { Badge, Button, PageHeading, PalettePreview, SegmentedControl, TransparencyControl, paletteTokens, useTheme, useToast } from '../../index'
import { Check, Moon, Sun } from 'lucide-react'

/** Every colour theme, light and dark, with a button to switch to it. */
export function ThemesPage() {
  const { palettes, palette, setPalette, mode, setMode } = useTheme()
  const { toast } = useToast()

  return (
    <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-10 px-4 py-10 sm:px-8">
      <div className="flex flex-col gap-5">
        <PageHeading
          eyebrow="Make it yours"
          title="Themes"
          description="Each theme has a light and a dark version under the same name. Your choice is saved on this device and applies across the whole public site."
        />
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="button-sm">Mode</span>
            <SegmentedControl
              aria-label="Mode"
              value={mode}
              onValueChange={(v) => setMode(v as 'light' | 'dark')}
              options={[
                { value: 'light', label: 'Light', icon: <Sun /> },
                { value: 'dark', label: 'Dark', icon: <Moon /> },
              ]}
            />
          </div>
          <div className="flex min-w-72 flex-col gap-1.5">
            <span className="button-sm">Transparency</span>
            <TransparencyControl size="sm" showHelp={false} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {palettes.map((p) => {
          const active = p.id === palette
          const accent = paletteTokens(p, mode)['--primary']
          return (
            <section
              key={p.id}
              aria-label={p.name}
              className="ui-panel flex flex-col gap-4"
              style={active ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary)' } : undefined}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="flex flex-wrap items-center gap-2 text-xl font-extrabold tracking-tight">
                    <span className="size-3 rounded-full" style={{ background: accent }} aria-hidden />
                    {p.name}
                    {active && <Badge>Current</Badge>}
                  </h2>
                  <p className="body-sm text-[var(--muted-foreground)]">{p.description}</p>
                </div>
                <Badge variant="neutral">{p.species}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <figure className="flex flex-col gap-1.5">
                  <PalettePreview palette={p} mode="light" size="full" />
                  <figcaption className="text-xs text-[var(--muted-foreground)]">Light</figcaption>
                </figure>
                <figure className="flex flex-col gap-1.5">
                  <PalettePreview palette={p} mode="dark" size="full" />
                  <figcaption className="text-xs text-[var(--muted-foreground)]">Dark</figcaption>
                </figure>
              </div>
              <Button
                variant={active ? 'secondary' : 'primary'}
                className="self-start"
                disabled={active}
                leftIcon={active ? <Check className="size-4" /> : undefined}
                onClick={() => {
                  setPalette(p.id)
                  toast({ title: `${p.name} on`, description: p.description, tone: 'success' })
                }}>
                {active ? 'In use' : 'Use this theme'}
              </Button>
            </section>
          )
        })}
      </div>
    </div>
  )
}
