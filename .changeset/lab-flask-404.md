---
'@furlab/dynamic-lab': patch
---

`Illustration404` (used by `NotFoundState`) is now an original illustration in the Furlab style.
It replaces third-party artwork. The 0 in "404" is the Furlab mark (FoxyFlask), with its liquid in
the brand colour and bubbles rising from the flask. It is drawn only with theme tokens, so it
follows the brand and light or dark mode, and the bubbles stop when reduced motion is requested.
A new optional `title` prop sets the accessible name; an empty string hides it.

`IconButton` with `variant="primary"` or `"danger"` now shows its solid fill. Previously the
`.icon-button` defaults painted it card-coloured, which hid the light icon.
