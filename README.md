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

---

## 📦 Component Catalog (33 Components)

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

To compile the library bundle for distribution (ESM + CJS + `.d.ts`):

```bash
yarn build:lib
```

To run type checking:

```bash
yarn typecheck
```
