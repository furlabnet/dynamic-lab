---
'@furlab/dynamic-lab': minor
---

A calmer look in every theme. Glass is a light frost on floating chrome (headers, sidebars, menus,
dialogs) rather than a clear pane: cards and panels are solid (`--surface-alpha: 1`), the rim
light is gone from them (`--glass-edge: none`; Glass's `edge` prop draws a softer one from the new
`--glass-rim`), blur is lower (`--blur-chrome` 12px, `--blur-panel` 8px) and Glass never goes below
70% opacity (`--glass-floor: 0.7`, `--blur-scale: 0.7`). Background glows are fainter
(`--glow-strength` about 0.1) and each palette's two glows share one hue. Shadows are short and
offset, and solid buttons lose their inner highlight.

Midnight Wolf (the default theme) is a deep night blue (`hsl(226 72% 46%)` light,
`hsl(220 85% 74%)` dark) with a moonlit glow, instead of electric ultramarine with an orchid glow,
and Backstage's violet is muted (`hsl(258 46% 48%)` light, `hsl(258 60% 78%)` dark). Fiery Fox,
Deer Delight, Scalies and Purrple Rain keep their primaries; their second glow moves next to the
first. `TOKENS.colors` has the new values.

Section labels (`.page-eyebrow`, sidebar, menu, command palette, list and toolbar group labels, tag
group headings, age ratings) are sentence case and untracked. Cards, link hub links, metric cards
and Glass no longer lift on hover and thumbnails no longer zoom: hover firms the border instead.
Progress bars, the admin sidebar, carousel dots and bar charts no longer animate their size.
`ProfileHeader` sits on the page instead of in a card, and without a banner image the banner
shrinks to a short band. `AdminShell`'s top bar and sidebar stick below `--banner-height` when a
page sets it.

New tokens: `--space-4`; `--ease-out`, `--ease-in`, `--ease-in-out`, `--dur-micro`, `--dur-short`,
`--dur-long`; `--font-mono`; `--shade`, `--shade-ink`, `--shadow-control`, `--shadow-pop`,
`--shadow-modal`, `--scrim`, `--scrim-soft`, `--scrim-strong`, `--veil`, `--veil-strong`;
`--tag-general`, `--tag-artist`, `--tag-copyright`, `--tag-character`, `--tag-species`,
`--tag-lore`, `--tag-meta`. Every colour in the stylesheets comes from a token.
