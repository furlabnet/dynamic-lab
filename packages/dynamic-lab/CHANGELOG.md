# Changelog

## 0.1.0-beta.6

### Patch Changes

- - Changed the default container max size.
  - Intoduces a component Index
  - Another small fixes

## 0.1.0-beta.5

### Minor Changes

- A calmer look in every theme. Glass is a light frost on floating chrome (headers, sidebars, menus,
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
- **Breaking:** reactions are icons, not emoji. `Reaction` is keyed by `id` instead of `emoji`,
  `onToggle` and `onPick` receive that id, and `choices` (and `DEFAULT_REACTIONS`) is a list of
  `{ id, label, icon }` with a lucide-react icon: heart, laugh, paw, fire, sparkles, star, thumbs-up,
  party, hug and sad. A reaction's `label` now defaults to its choice's label.
- The library works with React Server Components (Next.js App Router and similar). The build no
  longer stamps `'use client'` on every file: only the 45 modules that need the browser declare it,
  so layout, typography, cards, tables and the helpers (`cn`, `buttonVariants`, `TOKENS`…) render on
  the server and ship no JavaScript, and Server Components can call the helpers. The React Compiler
  only runs on client modules. Pure parts of interactive files moved into their own modules so they
  render on the server too: `SiteNav`, `SiteNavLink`, `SiteFooter`, `SidebarNavGroup`,
  `SidebarNavItem`, `MenuLabel`, `MenuSeparator`, `Select`, `MessageBubble`, `MessageDivider`,
  `ConversationItem`, `StatTile`, `CharacterSheet`, `SwatchList`, `ProfilePreview`, `PalettePreview`,
  `AgeRating`, `ReadingProgress`, plus `renderMarkdown`, `countWords`, `parseTag`, `readerStyle`,
  `formatCount`, `relativeTime`, `toDateKey` and the default lists. Import names are unchanged.
  `ThemeScript` (with `DEFAULT_THEME_STORAGE_KEY`) is an inline script for `<head>` that applies the
  saved theme before the first paint on server-rendered pages; the docs have a "Server rendering"
  guide with the Next.js set-up.

### Patch Changes

- `ThemeProvider` no longer reads saved choices during hydration, so server-rendered pages don't get
  hydration mismatches, and it saves choices when they're made instead of on every render. Without a
  saved mode it follows the system setting until one is picked. `Sparkline` takes a `locale`;
  `StatTile` passes it on instead of a formatting function.
- Prepare for release bump using the cli

## 0.1.0-beta.4

The first releases, 0.1.0-beta.1 to 0.1.0-beta.4, are listed together.

### Changed

- `yarn format` now checks formatting (it used to write) and `yarn format:fix` writes; both run
  in every workspace through Turborepo, plus the root files. `yarn format:check` is gone, and the
  GitLab `format` job runs `yarn format`.
- Prettier uses the shared `@vedla/prettier-config`, which also sorts imports and Tailwind classes.
  The whole repository was reformatted with it once. `prettier.config.cjs` is gone.
- The Dynamic look moved further from Material UI. Buttons, icon buttons, the segmented control,
  nav links and the search trigger have 12px corners. Primary and danger buttons are the same
  material as the other controls (a flat fill, a 1px edge a shade deeper, and the inner top
  highlight glass surfaces have) instead of lifting on hover; hover and press shift the fill. Text fields are filled wells that lift to the
  card colour with a ring on focus. Backstage keeps its tight, flat controls. The shapes come from
  two new tokens, `--radius-control` and `--radius-field`, plus `--control-highlight`.
- Midnight Wolf (the default theme) is now electric ultramarine (`hsl(238 76% 56%)` light,
  `hsl(234 100% 78%)` dark) with an orchid glow, instead of clear blue with violet. `TOKENS.colors`
  has the new values.
- Glass is more vivid: frosted surfaces boost the saturation of what's behind them
  (`--glass-saturate`), and cards, panels and chrome have a rim light along the edge
  (`--glass-edge`). Both are off in Backstage and when transparency is off.
- npm is now the main way to install: the installation guide and READMEs lead with
  `yarn add @furlab/dynamic-lab`, with the GitLab registry as an alternative, and the npm icon in
  the docs, landing page and The Lab Sans headers links to the package instead of saying "Soon".
- `--destructive` is a crimson (`hsl(350 76% 46%)` light, `hsl(350 90% 68%)` dark) in every theme.

- The repository is now a Turborepo monorepo. The library moved to `packages/dynamic-lab`; the
  showcase and docs are their own apps in `apps/showcase` and `apps/docs`. The published package,
  its exports and its stylesheet are unchanged.
- Root commands now run across every workspace through Turborepo: `yarn dev` starts every app,
  `yarn build` and `yarn typecheck` cover every workspace. `yarn docs:dev`, `yarn docs:build` and
  `yarn preview` are gone; use `yarn workspace @furlab/docs dev` and friends instead.
- GitLab Pages now serves a landing page at the root, with the showcase at `showcase/` and the docs
  at `docs/`. Links to the old docs root (`…/dynamic-lab/#/…`) need `docs/` added.
- Version bumps for releases go in `packages/dynamic-lab/package.json`, and the release script
  moved to `scripts/release.mjs`.
- Releases are now also published to npmjs.org, with trusted publishing (OIDC) from the GitLab
  pipeline instead of an npm token; `npm login` covers publishing by hand. Without a trusted
  publisher that job is allowed to fail. Pre-release versions default to the `next` dist-tag.
- A tag that looks like a release tag but doesn't match a package version (such as
  `the-lab-sans-v0.1.0.beta.1`) now fails the pipeline instead of skipping the publish jobs.
- Tagged releases create a GitLab release, with this changelog's section for the version as the
  description.
- CI type-checks and builds on Node 22 and 24.
- The GitLab pipeline and the GitHub mirror's workflow only run for release tags. GitLab Pages and
  GitHub Pages are deployed from release tags instead of every push to `main`.

### Added

- `tools/`: shared ESLint, Prettier, Tailwind and TypeScript configs as private workspaces
  (`@vedla/eslint-config`, `@vedla/prettier-config`, `@vedla/tailwind-config`, `@vedla/tsconfig`).
- `yarn lint` runs ESLint through Turborepo (the library and the Tailwind config so far), with a
  GitLab `lint` job that is allowed to fail. Every rule reports as a warning, and the library has
  none.
- `useLatestRef(value)`: a ref that always holds the latest value, for handlers and effects.
- Layout primitives, so whole screens can be built without hand-written layout CSS: `Box`,
  `Container`, `Section`, `Stack`, `HStack`, `VStack`, `ZStack` and `ZStackItem`, `Align`,
  `Center`, `Grid` and `GridItem`, `Columns` and `Column`, `SidebarLayout`, `ScrollArea`,
  `Spacer`, `AspectRatio`, `Show` and `Hide`. Direction, gap, column counts and spans take
  responsive values (`{ base: 1, md: 3 }`); the helpers behind them (`responsiveVars`, `toSpace`,
  `Responsive`, `Space`) are exported too.
- `Background`: the page or section gradient as a component. Presets (`brand`, `aurora`, `mesh`,
  `spotlight`) or your own `glows`, an optional dots, grid or noise pattern, `intensity` and a slow
  `animate` drift. `.dynamic-lab-glow-bg` still works.
- `Glass`: a tunable frosted surface (`opacity`, `blur`, `tint`, rim `edge`, `grain`,
  `interactive`), and a `glass` variant for `Button`. New tokens `--glass-floor` and `--blur-scale`
  let the transparency setting make them solid.
- `Combobox`: a filtered pick list with groups, multiple picks as chips, `max`, `onCreate` and
  server-side search (`inputValue` / `onInputChange`, `filter={false}`).
- `Calendar` and `DatePicker`: single days or ranges, event dots, min/max and disabled days,
  locale-aware names and week start, full keyboard support. `toDateKey` builds event keys.
- `ImageCropper` and `cropImage`: drag, pinch, scroll or keys to frame an avatar or banner, then
  export the crop as a Blob.
- `Carousel`: a scroll-snapping shelf with responsive (and fractional) items per view, arrows on
  desktop and optional page dots.
- `HoverCard` and `ProfilePreview`: a creator preview on hover or focus.
- Messages: `MessageThread`, `MessageBubble` (grouping, read status, attachments),
  `MessageDivider`, `MessageComposer` (grows, Enter sends) and `ConversationItem`.
- `TierCard`: commission types and supporter tiers with status, slots left and features.
- `LikeButton` (with a small burst), `ReactionBar`, `ReactionPicker` and `formatCount`.
- `CharacterSheet`, `ColorSwatch` and `SwatchList`: reference sheets with copyable palettes.
- `Sparkline`, `BarChart` and `StatTile`: single-series charts for creator analytics, with hover
  tooltips and screen-reader summaries or tables.
- `FleskyFox`: the fox in the Furlab logo now has a name, and an export (the same component as
  `DynamicLabMark`).
- `useFloating` / `floatingStyle`: the positioning behind the new floating panels, exported for
  your own.
- Platform components: `Heading`, `Text` and `Link`; `List` and `ListItem`; `AvatarGroup`;
  `Indicator` (counts and dots on icons and avatars); `Stepper`; `Slider`; `BottomNav` and
  `BottomNavItem` (the phone tab bar); `VisuallyHidden` and `SkipLink`.
- Docs pages and live examples for all of the above, a "Utilities and hooks" guide page for the
  exported helpers, and docs for `FilterChip`, `Collapsible` and `BreadcrumbEllipsis`, which were
  exported but undocumented.
- `apps/playground`: a Furlab-style home feed built only from library components, on
  http://localhost:5175.

- `apps/landing`: a landing page that introduces the library and links to the showcase and docs.
  Its header has the same GitLab and npm links as the docs.
- `packages/the-lab-sans` (`@furlab/the-lab-sans`): The Lab Sans as its own package, released
  from `the-lab-sans-v*` tags with its own changelog. The landing page, showcase and docs load it
  from here.
- `apps/the-lab-sans`: a specimen site for The Lab Sans, served at `the-lab-sans/` on Pages and
  linked from the landing page.
- `.github/workflows/release.yml` for the GitHub mirror: type-checks and builds every push and pull
  request, deploys the documentation to GitHub Pages on `main`, and creates a GitHub release for each
  release tag. It doesn't publish packages.
- `scripts/release-notes.mjs` prints a release's notes from its changelog.
- `VITE_THE_LAB_SANS=off` leaves the font out of the showcase build.
- `yarn pages` builds the apps and assembles them into `public/`.
- Docs header: a Dynamic / Backstage switch that previews the docs and every example in either
  brand (Backstage also switches the docs to the AdminShell console layout, with an icon for every
  page in its sidebar), the GitLab logo on the source link, and an npm link to the package.

### Fixed

- Cleared every ESLint warning in the library. Refs are no longer written or read during render
  (`useControllableState`, `useDismiss`, ImageCropper, MarkdownEditor, SortableList and Popover's
  render-prop `close`), and state that reset in effects now resets in the event that changes it
  (Combobox, CommandPalette, ImageCropper). The empty `*Props` interfaces on Card, Tabs and
  Accordion are type aliases now.
- `ComicReader`'s full screen button works on phones and in browsers without the Fullscreen API:
  it now expands the reader over the whole viewport (above everything else, with the page behind
  locked and Escape to exit) instead of asking the browser for full screen.
- `Collapsible` works with the keyboard: a button trigger gets the toggle and `aria-expanded`, and
  any other trigger is wrapped in a button. The content is linked with `aria-controls`.
- `PillNav` scrolls sideways instead of overflowing its container on narrow screens.
- The docs' Getting started page no longer says the package is only on the GitLab registry.
- The docs header no longer runs off the screen on tablets and phones: the search box and version
  badge collapse below 1280px, and the GitLab and npm links move out of the way on phones.
- The showcase asked for `TheLabSans-ExtraBold.otf`, which doesn't exist (`Extrabold`), so
  extra-bold text fell back to a synthesised weight.
