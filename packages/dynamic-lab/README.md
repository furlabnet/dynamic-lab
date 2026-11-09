# @furlab/dynamic-lab

The React component library for **The Furlab Project**: TypeScript, Tailwind CSS v4 and design tokens from Figma.

- Two brands: **Dynamic** for the public site and **Backstage** for the staff console
- Eight named colour themes, each in light and dark (Midnight Wolf, Fiery Fox, Blue Dog, Snow Leopard, Deer Delight, Scalies, Otter Space, Purrple Rain)
- Adjustable transparency (full, reduced or off), keyboard support and reduced motion
- More than 90 components: layout primitives (stacks, grids, columns, containers), buttons and dialogs, comboboxes, date pickers, chat, charts, a comic reader, a story reader, booru-style tags and content editors

**Documentation:** https://furlab.gitlab.io/dynamic-lab/docs/ (guides, live examples, source and props for every component)
**Showcase:** https://furlab.gitlab.io/dynamic-lab/showcase/
**npm:** https://www.npmjs.com/package/@furlab/dynamic-lab

---

## Install

```bash
yarn add @furlab/dynamic-lab react react-dom
# or: npm install @furlab/dynamic-lab react react-dom
```

The package is on [npm](https://www.npmjs.com/package/@furlab/dynamic-lab). While it is in beta,
the newest pre-release is on the `next` tag: `yarn add @furlab/dynamic-lab@next`.

React 19 is a peer dependency. `lucide-react`, `clsx`, `tailwind-merge` and `class-variance-authority` install with the package.

### From the GitLab package registry

Every release is also published to GitLab. The project is public, so no token is needed: point
the `@furlab` scope at it.

**Yarn (Berry)**, in `.yarnrc.yml`:

```yaml
npmScopes:
  furlab:
    npmRegistryServer: 'https://gitlab.com/api/v4/packages/npm/'
```

**npm / pnpm**, in `.npmrc`:

```ini
@furlab:registry=https://gitlab.com/api/v4/packages/npm/
```

### From a CDN

For a static page with no build step (an error page, a status page, an email preview), link the
stylesheet from [jsDelivr](https://www.jsdelivr.com/package/npm/@furlab/dynamic-lab?path=dist).
Pin an exact version so a release never changes a live page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@furlab/the-lab-sans@0.1.0/dist/the-lab-sans.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@furlab/dynamic-lab@0.1.1/dist/styles.css" />
```

That gives you the tokens (`var(--primary)`, `var(--card)`, `var(--radius-3xl)`…), the component
classes and the Tailwind utilities the components use. Set the body font yourself
(`font-family: 'The Lab Sans', system-ui, sans-serif`). Without `ThemeProvider`, choose the mode
with an attribute on `<html>`: `data-theme="dark"` or `data-theme="light"`. The playground's
[error pages](https://furlab.gitlab.io/dynamic-lab/playground/errors/) are built this way; view
their source for a complete example, including following the system's dark mode.

## Set up

```tsx
import { ThemeProvider, ToastProvider, Button, useToast } from '@furlab/dynamic-lab'
import '@furlab/dynamic-lab/styles.css'

export function App() {
  return (
    <ThemeProvider defaultBrand="dynamic" defaultPalette="midnight-wolf">
      <ToastProvider>
        <Publish />
      </ToastProvider>
    </ThemeProvider>
  )
}

function Publish() {
  const { toast } = useToast()
  return <Button onClick={() => toast({ title: 'Published', description: 'Your story is live.', tone: 'success' })}>Publish</Button>
}
```

The stylesheet contains the tokens, component styles and every Tailwind utility the components use, so your app doesn't need Tailwind. If it does use Tailwind v4, import `tailwindcss` first and then `@furlab/dynamic-lab/styles.css`. Component classes live in the `components` layer, so utilities you pass in `className` win.

Set `--font-sans` and `--font-display` to load a font family; otherwise the system font is used. Inside this repository, apps can load The Lab Sans from `@furlab/the-lab-sans`.

## Server rendering (Next.js)

Components that need the browser are marked `'use client'`; everything else (layout, typography,
cards, tables, badges and the helpers such as `cn` and `buttonVariants`) works in React Server
Components and ships no JavaScript. Interactive components can be rendered from a Server Component
as usual.

Wrap `ThemeProvider` in a client component, and put `ThemeScript` in `<head>` with the same props
so the saved theme is applied before the first paint:

```tsx
// app/layout.tsx
import '@furlab/dynamic-lab/styles.css'
import { ThemeScript } from '@furlab/dynamic-lab'
import { Providers } from './providers' // 'use client', renders <ThemeProvider storageKey="my-app">

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
}
```

The [server rendering guide](https://furlab.gitlab.io/dynamic-lab/docs/#/guide/server-rendering)
lists which components are client components.

## Layout

Build screens from the layout primitives instead of writing layout CSS. Responsive props take a
value or one per breakpoint (`base`, `sm`, `md`, `lg`, `xl`, matching Tailwind); numeric gaps and
padding are steps on the 4px scale.

```tsx
import { Container, Stack, HStack, Grid, Spacer, Heading, Button } from '@furlab/dynamic-lab'

<Container>
  <Stack gap={6}>
    <HStack>
      <Heading level={1}>Your feed</Heading>
      <Spacer />
      <Button>Create</Button>
    </HStack>
    <Grid cols={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 4, lg: 6 }}>
      {cards}
    </Grid>
  </Stack>
</Container>
```

Put a `<Background variant="aurora" pattern="dots" />` at the top of the page for the ambient
gradient (or pass your own `glows`), and use `Glass` for frosted panels over it.

`ZStack` layers children, `Columns` mixes fixed, fractional and fill widths, `Align` and `Center`
place content, `SidebarLayout` adds a side column, and `Show` / `Hide` swap content by screen size.

## Theming

`ThemeProvider` writes `data-theme`, `data-mode`, `data-brand` and `data-transparency` on `<html>`, applies the colour theme as CSS variables, and saves choices to localStorage. `useTheme()` reads and changes them:

```tsx
const { setMode, setPalette, setTransparency, setBrand } = useTheme()

setPalette('fiery-fox') // any id from PALETTES, or your own
setTransparency('off') // 'system' | 'full' | 'reduced' | 'off'
```

| Theme | Species | Look |
| --- | --- | --- |
| **Midnight Wolf** (default) | Wolf | Deep night blue with a moonlit glow |
| **Fiery Fox** | Fox | Burnt orange with an ember-red glow |
| **Blue Dog** | Dog | Friendly turquoise |
| **Snow Leopard** | Snow leopard | Quiet steel and frost, almost monochrome |
| **Deer Delight** | Deer | Rose and coral |
| **Scalies** | Dragons and reptiles | Emerald with a leaf-green shimmer |
| **Otter Space** | Otter | Navy sky with golden starlight |
| **Purrple Rain** | Cat | Royal purple with an orchid storm |

Colour themes apply to the Dynamic brand; Backstage keeps its own look unless you pass `paletteBrands={['dynamic', 'backstage']}`. Add your own with `palettes={[...PALETTES, myPalette]}`. The [theming guide](https://furlab.gitlab.io/dynamic-lab/docs/#/guide/theming) covers brands, tokens and custom palettes.

## The mark

The fox in the Furlab logo is called **FleskyFox**. `DynamicLabMark` draws it (also exported as
`FleskyFox`), and `BrandLockup` pairs it with the name.

## Licence

MIT © 2026 Vedla Creative and The Furlab Project. See [LICENSE](./LICENSE).

Author: Vedla Creative <code@vedla.ca>
