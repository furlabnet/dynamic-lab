# Design: Dynamic Lab

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose;
the file is the rule.

## System

- Genre: playful (a creator community), kept dense on app screens
- Shape of the first page: Narrative Workflow (the landing); app screens elsewhere
- Theme: brand (the library's own tokens; no catalog theme)
- Axes: light/grotesk-sans/cool · posture: Restrained · modes: light+dark

## Tokens

`packages/dynamic-lab/src/styles/tokens.css` is the source of truth. The project names its roles
shadcn-style; the Hallmark roles map onto them:

```css
:root {
  --background: paper;  --card: paper-2;  --muted: paper-3;
  --foreground: ink;  --secondary-foreground: ink-2;  --muted-foreground: muted;  --border: rule;
  --primary: accent;  --primary-foreground: accent-ink;  --ring: focus;
  --font-sans / --font-display: 'The Lab Sans', system sans fallbacks;
  --radius-3xl: card;  --radius-control / --radius-field: controls;  --radius-full: pill;
}
```

Spacing is `--space-2` to `--space-40`; motion is `--ease-out`, `--ease-in`, `--ease-in-out` with
`--dur-micro`, `--dur-short`, `--dur-long`; translucent black and white come from `--shade`,
`--scrim*` and `--veil*`. Each named palette (src/theme/palettes.ts) sets the accent, the neutral
tint and two glows in one hue family.

## Surfaces

- Cards and panels are solid. Glass is a light frost on floating chrome only (header, sidebar,
  menus, dialogs), never below 70% opacity.
- Glows stay under 10% strength, one hue per palette. No washes behind text.
- A card has a 1px border; depth reads from lightness. One containment layer.

## Controls

- Primary: a flat fill of `--primary` · `--radius-control` (12px Dynamic, 6px Backstage) · 44px
  (40px Backstage)
- Secondary: a solid card fill with a 1px border · same radius and height
- Labels: the body face, a step smaller, sentence case, untracked.

## Motion

- Character: calm. Hover is one colour or border step; nothing lifts or zooms. Under reduced motion
  everything ends at once.

## Exports

The library publishes the tokens as CSS variables (`@furlab/dynamic-lab/styles.css`) and the
brand colours as `TOKENS` in TypeScript.
