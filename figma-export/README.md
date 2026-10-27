# Furlab design system → Figma

Everything needed to rebuild the Furlab design system as a Figma library. It is generated from the
design system published from `packages/shared` (theme.css, furlab-ui.css, brand.tsx and the shared
components), so the values match the code.

| Path | What | Import with |
| --- | --- | --- |
| `fonts/` | The Lab Sans, all 16 faces | Install on your machine first (licence permitting) |
| `variables/Theme.*.tokens.json` | 36 colours + 3 glass opacities, one file per mode | Figma variables import |
| `variables/Dimensions.Default.tokens.json` | Spacing, radii, sizes (px) | Figma variables import |
| `tokens-studio/furlab.tokens.json` | The same tokens plus 18 text styles, with 4 themes | Tokens Studio plugin |
| `furlab-components.html` | Every component in every theme, as static HTML | html.to.design (or similar) |
| `assets/` | Logos (ink and white), 23 lucide icons, 404 illustration | Drag the SVGs in |

## 1. Fonts

Install the files in `fonts/` (double-click each, then **Install**) and restart Figma. Figma lists
them as family **The Lab Sans** with styles Thin to Black. Without them, text styles and the
imported components fall back to another font.

## 2. Variables

The files use the W3C design-tokens (DTCG) format with Figma's colour objects and scopes.

1. Create a collection **Theme** with four modes: `Furlab Light`, `Furlab Dark`,
   `Backstage Light`, `Backstage Dark`.
2. Import each `Theme.<Mode>.tokens.json` into its mode, then `Dimensions.Default.tokens.json`
   into a second collection, **Dimensions**.

Colours are grouped as `surface/`, `lines/`, `accent/`, `feedback/`, `status/` and `effects/`,
and every variable carries its usage note as its description. Switching a frame's mode re-themes it,
like `data-theme` in code. The two Backstage modes differ from the Furlab ones only in `primary`,
`ring`, `glow-a` and `glow-b` (and `primary-foreground` in dark).

If your Figma has no JSON import for variables, use step 3 instead: Tokens Studio creates the same
variables and modes.

## 3. Text styles (and variables) with Tokens Studio

Load `tokens-studio/furlab.tokens.json` in the Tokens Studio plugin (Tools → Load from file). It has
a `core` set (spacing, radii, sizes, typography) and one set per theme, wired as four themes in the
`Theme` group. Use **Styles & Variables → Export** to create:

- the variables, with one mode per theme;
- 18 text styles in three groups: *Marketing & public pages*, *Dashboards & Backstage*, *Body & controls*.

Weights the code sets between font files (550, 650, 750) use the face the browser renders:
Semibold, Bold and Extrabold. Fluid sizes (`page-title`, `section-title`, `ui-page-title`) use their
largest size; the description notes the range.

## 4. Components

`furlab-components.html` is a static page with no scripts. It has one block per theme, holding the
cover and the 23 components grouped as in the design system (Actions, Forms, Navigation, Status,
Surfaces, Layout, Brand, Pages). Serve it locally, then capture it with an HTML-to-Figma plugin such
as html.to.design:

```bash
python3 -m http.server 8766 --directory figma-export
```

Open http://127.0.0.1:8766/furlab-components.html at a viewport of at least 1140px.

The import copies the rendered look, so fills and text are fixed values. To turn the layers into a
real library:

- make each card a component, with themes as variants or by setting the frame's variable mode;
- rebind fills, strokes and text to the variables and text styles from steps 2 and 3;
- recreate the glass as a **Background blur** effect: 20px for chrome (bars, menus, dialogs) and
  14px for panels and cards, over the `glass` or `card` fill at `glass-alpha` or `surface-alpha`.

The page shows `ProfileAvatar` as initials, because the picture comes from the app's API, and
`AppSwitcher` with its menu open.

## 5. Assets

Drag the SVGs from `assets/` onto the canvas. In code, the logos and icons inherit the text colour.
In Figma, bind their fill or stroke to `surface/foreground` so they follow the mode.
