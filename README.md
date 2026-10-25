# Dynamic Lab

The React component library for **The Furlab Project**: TypeScript, Tailwind CSS v4 and design tokens from Figma.

- Two brands: **Dynamic** for the public site and **Backstage** for the staff console
- Eight named colour themes, each in light and dark (Midnight Wolf, Fiery Fox, Blue Dog, Snow Leopard, Deer Delight, Scalies, Otter Space, Purrple Rain)
- Adjustable transparency (full, reduced or off), keyboard support and reduced motion
- About 70 components: from buttons and dialogs to a comic reader, a story reader, booru-style tags and content editors

**Documentation:** https://furlab.gitlab.io/dynamic-lab/ (guides, live examples, source and props for every component)

---

## Install

The package is published to the GitLab package registry. Point the `@furlab` scope at it once.

**Yarn (Berry)**, in `.yarnrc.yml`:

```yaml
npmScopes:
  furlab:
    npmRegistryServer: 'https://gitlab.com/api/v4/packages/npm/'
    # Only while the project is private: a token with the read_api scope
    npmAuthToken: '${GITLAB_TOKEN-}'
```

**npm / pnpm**, in `.npmrc`:

```ini
@furlab:registry=https://gitlab.com/api/v4/packages/npm/
//gitlab.com/api/v4/packages/npm/:_authToken=${GITLAB_TOKEN}
```

Then:

```bash
yarn add @furlab/dynamic-lab react react-dom
```

React 19 is a peer dependency. `lucide-react`, `clsx`, `tailwind-merge` and `class-variance-authority` install with the package.

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

Set `--font-sans` and `--font-display` to another family; otherwise the system font is used.

## Theming

`ThemeProvider` writes `data-theme`, `data-mode`, `data-brand` and `data-transparency` on `<html>`, applies the colour theme as CSS variables, and saves choices to localStorage. `useTheme()` reads and changes them:

```tsx
const { setMode, setPalette, setTransparency, setBrand } = useTheme()

setPalette('fiery-fox') // any id from PALETTES, or your own
setTransparency('off') // 'system' | 'full' | 'reduced' | 'off'
```

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

Colour themes apply to the Dynamic brand; Backstage keeps its own look unless you pass `paletteBrands={['dynamic', 'backstage']}`. Add your own with `palettes={[...PALETTES, myPalette]}`. The [theming guide](https://furlab.gitlab.io/dynamic-lab/#/guide/theming) covers brands, tokens and custom palettes.

## Development

Requires Node 24 (see `.nvmrc`) and Yarn 4 (via Corepack).

| Command | What it does |
| --- | --- |
| `yarn dev` | The showcase: two working apps (the Dynamic Lab public site and the Backstage console) built from the library, at http://localhost:5173 |
| `yarn docs:dev` | The documentation site, at http://localhost:5180 |
| `yarn build` | The library into `dist/`: tsdown bundles ESM and CJS, `tsc` writes the declarations, the Tailwind CLI writes `dist/styles.css` |
| `yarn docs:build` | The docs into `public/`, with relative asset paths so the build works at any URL |
| `yarn typecheck` | Type-check the library, showcase and docs |
| `yarn format` | Prettier |

```
src/
  components/   one folder per component
  theme/        ThemeProvider, palettes, tokens
  styles/       tokens.css, components.css, content.css; dynamic-lab.css is the published entry
  showcase/     the demo apps (yarn dev)
docs/           the documentation site (yarn docs:dev)
  examples/     live examples; each docs page shows this source
scripts/
  release.mjs   publishes to the GitLab package registry
```

The showcase's sample images come from [Lorem Picsum](https://picsum.photos) and avatars from [pravatar.cc](https://pravatar.cc).

## Releasing

1. Bump `version` in `package.json` and commit.
2. Tag and push: `git tag v0.2.0 && git push origin v0.2.0`.
3. The pipeline's `publish` job runs `yarn release` with the CI job token. Tags with a pre-release suffix (`v1.0.0-beta.1`) publish under the `next` dist-tag.

`yarn release` also works locally:

```bash
yarn release --dry-run                 # check everything, list the package contents, publish nothing
GITLAB_TOKEN=glpat-… yarn release      # publish (token needs the api scope)
GITLAB_TOKEN=glpat-… yarn release --tag next
```

It refuses to publish when the tag doesn't match the version, the working tree has uncommitted changes, or the version is already in the registry. Set `GITLAB_API_URL` and `GITLAB_PROJECT` for a self-managed GitLab or another project.

On the default branch, the `pages` job builds the docs and deploys them to GitLab Pages.

## Licence

MIT © 2026 Vedla Creative and The Furlab Project. See [LICENSE](./LICENSE).

Author: Vedla Creative <code@vedla.ca>
