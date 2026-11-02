---
'@furlab/dynamic-lab': minor
---

**Breaking:** reactions are icons, not emoji. `Reaction` is keyed by `id` instead of `emoji`,
`onToggle` and `onPick` receive that id, and `choices` (and `DEFAULT_REACTIONS`) is a list of
`{ id, label, icon }` with a lucide-react icon: heart, laugh, paw, fire, sparkles, star, thumbs-up,
party, hug and sad. A reaction's `label` now defaults to its choice's label.
