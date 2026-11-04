---
'@furlab/dynamic-lab': minor
---

`ContentCard` has a `variant` prop: `detailed` (the default, as before) or `compact`, the cover with
a title and one quiet line (the byline, or the type when there is none) for dense grids and small
spaces; compact cards leave out the type label, byline avatar, tags, stats and footer. The detailed
card now clamps titles to two lines and, in a column narrower than about 16rem, hides its tags and
tightens its padding. The rating over a cover is a solid chip in its rating's colour, readable on
any art. Hover no longer animates a transform.
