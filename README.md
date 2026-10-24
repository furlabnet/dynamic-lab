# Dynamic Lab — React UI Component Library

**Dynamic Lab** is a modern, TypeScript-first React component library built with Tailwind CSS v4 and Figma design tokens. It features dual-brand styles (**Dynamic** & **Backstage**), multi-mode lighting (**Light** & **Dark**), backdrop frosted glassmorphism, and responsive variants.

---

## 🎨 Themes & UI Styles

Dynamic Lab provides 4 theme modes powered by CSS custom properties and DTCG tokens:

| Mode | Brand Accent | Top Glow | Base Surfaces |
| --- | --- | --- | --- |
| **Dynamic Light** | `#2354e7` (Blue) | `#3d6bf5` | Clean white / frosted light glass |
| **Dynamic Dark** | `#6094fb` (Soft Blue) | `#3464f4` | Deep obsidian / frosted dark glass |
| **Backstage Light** | `#773eda` (Violet Purple) | `#905aed` | Clean white / frosted violet glass |
| **Backstage Dark** | `#b890f9` (Soft Violet) | `#8347eb` | Deep obsidian / frosted violet glass |

Each theme supports:
- **Chrome Glass Blur**: `20px` background blur for headers, navigation, menus, and modals
- **Panel Glass Blur**: `14px` background blur for cards and content panels
- **Soft Ambient Glows**: Radial accent gradients behind surfaces

### Dynamic vs Backstage

The two brands are meant for different products, so they differ in more than the accent colour:

| | Dynamic (public site) | Backstage (staff console) |
| --- | --- | --- |
| Neutrals | Blue-grey (hue ~228) | Violet-tinted (hue ~252) |
| Corners | Roomy (`--radius-3xl` 20px) | Tight (`--radius-3xl` 14px) |
| Controls | 44px touch targets | Dense, 40px / 32px compact |
| Background | Two soft glows | Fainter glow over a dot grid |
| Shell | `SiteHeader` top navigation | `AdminShell` with a solid sidebar (`--sidebar` tokens) |

Component classes sit in Tailwind's `components` layer, so utilities passed via `className` always win.

---

## 📦 Component Catalog (50 Components)

### 0. App Shells (new)
- `SiteHeader`, `SiteNav`, `SiteNavLink`, `SiteFooter`: Public-site chrome, with a mobile menu below `md`.
- `SiteBanner`: Full-width announcement strip (e.g. "Maintenance mode is on").
- `AdminShell`, `AdminSidebar`, `useAdminShell`: Backstage console layout, with a collapsible sidebar on desktop and an off-canvas one on mobile.
- `AppSwitcher`: Controlled (`value` / `onValueChange`) or uncontrolled; it switches apps, with keyboard navigation.
- `UserMenu`: Avatar + name trigger for the account menu.
- `CommandPalette`, `CommandTrigger`: ⌘K / Ctrl K quick-jump with grouped, filterable commands.

### Content & creators (new)
- `Tag`, `TagList` (`grouped`): e621-style tags in categories (artist, copyright, character, species, general, lore, meta), each with its own colour.
- `AgeRating`, `AgeGate`: General / Teen / Mature badges, plus a blur gate that hides content above the viewer's allowed rating.
- `ContentActions`: Save (with count), Share (copies the link) and Report (a dialog with reasons).
- `CommentThread`, `CommentComposer`: Comments with likes, one level of replies, and a closed state.
- `ReadingProgress`, `useReadingProgress`, `ReaderSettings`, `useReaderPrefs`, `readerStyle`, `ChapterNav`: The story reader. A sticky progress bar with time left; font size, family, line spacing and width controls saved to localStorage; chapter navigation.
- `ComicReader`: Multi-page comics. `book` mode supports arrow keys, swiping, tapping either half, two-page spreads, thumbnails, full screen and `rtl`; `scroll` mode is a vertical strip.
- `MediaGallery`, `Lightbox`: Screenshot or image grids with a keyboard-navigable viewer.
- `DownloadList`, `PlatformBadge`, `detectPlatform`: Builds of a downloadable work, one per platform, with the visitor's platform marked.
- `DescriptionList`: Label / value metadata (engine, version, size…).
- `ProfileHeader` (`user` or `lab` variant): Banner, avatar, name, bio, stats and actions.
- `LinkHub`: A link-in-bio page.
- Dialog, Drawer, CommandPalette and Lightbox now render in a portal, so sticky ancestors can't trap them under the header.

### Editing (new)
- `TagInput`: Booru-style tag entry. Enter, comma or Tab commits a tag, and pasted comma lists split into several. Category prefixes (`artist:`, `character:`, `species:`, `copyright:`, `lore:`, `meta:`) file tags under that category, with autocomplete from `suggestions` and a `minTags` reminder.
- `SortableList`, `DragHandle`: Reorder by dragging the handle, or focus the handle and use the arrow keys. Moves are announced to screen readers.
- `ImageUploader`: Drop or browse multiple images, with previews, numbered pages, a "Cover"/"Main" badge, reordering and removal (`aspect`: page / portrait / square / video).
- `MarkdownEditor`, `renderMarkdown`, `countWords`: A textarea with a formatting toolbar (⌘/Ctrl B, I, K), Write/Preview tabs and a word count. The renderer outputs React nodes, never raw HTML.
- `FormSection`, `EditorActionBar`: Two-column form sections, plus a sticky bottom bar showing save status.

### Colour themes
Named palettes, each with a light and a dark version under the same name. A palette sets the accent, the tint of the neutrals and the background glows; layout, radii, status colours and glass opacity stay the same. The names are puns on fursona species:

| Theme | Species | Look |
| --- | --- | --- |
| **Midnight Wolf** (default) | Wolf | Clear blue on cool blue-grey |
| **Fiery Fox** | Fox | Burnt orange with an ember-pink glow |
| **Blue Dog** | Dog | Friendly turquoise |
| **Snow Leopard** | Snow leopard | Quiet steel and frost, almost monochrome |
| **Deer Delight** | Deer | Rose and peach |
| **Scalies** | Dragons and reptiles | Emerald with a lime shimmer |
| **Otter Space** | Otter | Navy sky with golden starlight |
| **Purrple Rain** | Cat | Royal purple with a magenta storm |

```tsx
const { palette, setPalette, palettes } = useTheme()
setPalette('fiery-fox')

// Add your own (or replace the list):
<ThemeProvider palettes={[...PALETTES, { id: 'hyena-laughs', name: 'Hyena Laughs', species: 'Hyena', description: '…', neutralHue: 40, light: { primary: 'hsl(38 80% 35%)', glowA: '…', glowB: '…' }, dark: { primary: 'hsl(40 90% 62%)', glowA: '…', glowB: '…' } }]}>
```

- Palettes apply to the `dynamic` brand only by default, so Backstage keeps its own look. Pass `paletteBrands={['dynamic', 'backstage']}` to theme both.
- The choice is saved in localStorage and applied as inline CSS variables on `<html>` (plus `data-palette`).
- `PalettePicker` (`cards` or `compact`) picks a palette; `PalettePreview` renders one in isolation, with its variables scoped to the element. `paletteTokens(palette, mode)` and `paletteStyle(palette, mode)` give you the raw values.
- `AppearanceSettings` now holds colour theme, mode and transparency in one popover.

### Transparency (accessibility)
`ThemeProvider` now takes `defaultTransparency` and exposes `transparency`, `resolvedTransparency` and `setTransparency` from `useTheme()`:

| Setting | Effect |
| --- | --- |
| `system` (default) | Follows the OS `prefers-reduced-transparency` setting |
| `full` | Frosted glass as designed |
| `reduced` | Surfaces 94–97% opaque, lighter blur, fainter glows |
| `off` | Solid surfaces, no `backdrop-filter` anywhere, no background glows, an opaque overlay scrim |

The setting is stored in localStorage and applied as `html[data-transparency]`. Use `AppearanceSettings` (a popover with theme and transparency) or `TransparencyControl` (just the picker) to let people change it.

### New primitives
- `Popover`, `DropdownMenu`, `MenuLabel`: Floating panels with outside-click / Esc dismissal and arrow-key menus. `MenuItem` now supports `href`, `selected`, `trailing` and auto-closes its menu.
- `Badge`, `Kbd`, `Spinner`, `Progress` (determinate and indeterminate), `Separator`.
- `RadioGroup` / `RadioGroupItem` (default and `card` variants), `SegmentedControl`, `FileInput` (`inline` and `dropzone`).
- `ContentCard`: Cover, type, title and byline card for browse grids.
- `Switch` and `Checkbox` now work uncontrolled (`defaultChecked`); `Checkbox` adds `indeterminate` and `onCheckedChange`.

### 1. Actions & Controls
- `Button`: Primary, secondary, danger, danger-outline, ghost, outline; sizes (`sm`, `md`, `lg`); loading spinner; icon slots.
- `IconButton`: Compact icon-only control with accessible labels and tooltips.
- `ThemeToggle`: One-click toggle between Light & Dark modes and Dynamic & Backstage themes.

### 2. Navigation & Breadcrumbs
- `Breadcrumbs` (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`): Multi-level page hierarchy.
- `PillNav` & `PillNavLink`: Segmented pill navigation bar.
- `SidebarNav`, `SidebarNavGroup`, `SidebarNavItem`: Multi-level sidebar navigation with active indicator rails and badges.
- `AppSwitcher`: Brand app launcher with interactive glass popover.
- `Toolbar`: Action bar container with search input and filters.
- `Pagination` (`Pagination`, `PaginationContent`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`): Page controls.

### 3. Data Display & Tables
- `Table` (`Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`): Frosted glass data table with row selection, hover highlights, and responsive overflow.
- `Tabs` (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`): Pill-styled and line-styled tabbed interfaces.
- `MetricCard`: KPI stat card with value, delta indicators (`up`/`down`), trends, and hover lift effects.
- `WorkflowTimeline` & `WorkflowTimelineItem`: Vertical progress timeline with status markers.
- `LocalDateTime`: Formatted localized relative/absolute timestamps.

### 4. Overlays, Dialogs & Drawers
- `Dialog`: Accessible modal dialog with backdrop blur scrim and header/footer actions.
- `Drawer`: Slide-over drawer with backdrop blur (`right`, `left`, `top`, `bottom`).
- `Menu`, `MenuItem`, `MenuSeparator`: Floating glass popover menu with icons and destructive actions.
- `Tooltip`: Hover/focus floating tooltip with glass backdrop.
- `Toast` (`ToastProvider`, `useToast`): Floating transient toast notification banners.

### 5. Forms & Inputs
- `TextField`: Input with labels, helper text, error messages, and icon slots.
- `Input` & `Textarea`: Standalone form controls with focus rings.
- `Select`: Clean styled dropdown picker.
- `Switch`: Smooth animated toggle switch.
- `Checkbox`: Custom styled checkbox with checkmark.
- `FilterChip`: Selectable filter pills with count badges, icons, and dismissible cross buttons.

### 6. Surfaces & Feedback
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`: Glass & surface card layouts.
- `AuthCard`: Dedicated authentication/login card with logo, title, and action fields.
- `Panel`: Frosted glass panel with title, description, and action slots.
- `NoticePanel`: Semantic alerts (`info`, `success`, `warning`, `destructive`) with icons and dismiss action.
- `StatusBadge`: Status pill with pulsing live dot indicator (`success`, `warning`, `danger`, `neutral`, `info`).
- `Skeleton` (`Skeleton`, `SkeletonText`, `SkeletonAvatar`, `SkeletonCard`): Shimmer loading placeholders.
- `Accordion` & `Collapsible`: Expandable panels with smooth transitions (`single` or `multiple`).

### 7. Brand & Error States
- `DynamicLabMark`: Scalable SVG lab flask mark.
- `BrandLockup`: Brand mark + wordmark + product badge tag.
- `ProfileAvatar`: User avatar with image or fallback initials and online/offline status dot.
- `EmptyState`: Empty state container with hero icon, description, and action button.
- `PageHeader` & `PageHeading`: Top-level page titles with eyebrows, subtitles, and action bars.
- `NotFoundState` & `Illustration404`: Dedicated 404 page with the full illustration extracted from Figma.
- `MaintenanceNotice`: Full-bleed platform maintenance banner.

---

## 🚀 Quick Start

### Installation

```bash
yarn add dynamic_lab
# or
npm install dynamic_lab
```

### Setup Provider & Styles

Wrap your root application in `ThemeProvider` and `ToastProvider`, then import the CSS:

```tsx
import React from 'react'
import {
  ThemeProvider,
  ToastProvider,
  useToast,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'dynamic_lab'
import 'dynamic_lab/styles.css'

function MyComponent() {
  const { toast } = useToast()

  return (
    <div className="p-8 space-y-6">
      <Button
        variant="primary"
        onClick={() => toast({ title: 'Saved', description: 'Changes published.', tone: 'success' })}>
        Publish Story
      </Button>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>The lighthouse keeper</TableCell>
                <TableCell>Published</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function App() {
  return (
    <ThemeProvider defaultBrand="dynamic" defaultMode="light">
      <ToastProvider>
        <MyComponent />
      </ToastProvider>
    </ThemeProvider>
  )
}
```

---

## 🛠️ Development & Showcase

To run the interactive component showcase app locally:

```bash
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

The showcase is two working apps built from the library, sharing one in-memory state:

- **Dynamic Lab** (`#/lab/…`): Home, Browse (live search and filters), Library (dashboard) and Components (the full gallery). There is one example of each content type: page `#/lab/view/c5`, artwork `c3` (mature example: `c13`), comic `c8`, multi-chapter story `c10` and visual novel `c4`. Every colour theme, light and dark, is at `#/lab/themes`. Editors are at `#/lab/new` (type picker), `#/lab/new/<type>` and `#/lab/edit/<id>`. Creator profiles live at `#/lab/u/<handle>`, Lab portfolios at `#/lab/labs/<slug>` and link-in-bio pages at `#/lab/links/<handle-or-slug>`. Sample images come from [Lorem Picsum](https://picsum.photos) and avatars from [pravatar.cc](https://pravatar.cc).
- **Backstage** (`#/backstage/…`): Overview, Content (selection, bulk actions, edit / view / delete), Trash, Users, Moderation, Tags, Audit, Site settings, plus the gallery under *Design system*.

The app switcher moves between them and sets the theme brand. Changes carry across apps: turn maintenance mode off in Backstage and the Lab's banner goes away; create a draft in the Lab and it shows up in Backstage → Content.

To compile the library bundle for distribution (ESM + CJS + `.d.ts`):

```bash
yarn build:lib
```

To run type checking:

```bash
yarn typecheck
```
