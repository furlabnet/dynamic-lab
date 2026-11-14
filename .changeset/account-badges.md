---
'@furlab/dynamic-lab': minor
---

New `AccountBadge` and `AccountBadges`: a mark next to a person's name that says who they are to the
platform. Five tones (`official`, `staff`, `verified`, `supporter` and `neutral`) each have their
own colour and default icon, which `icon` can replace. `display="icon"` shows only the icon for
bylines, cards and comments, and `display="label"` adds the name for profile headers (pass them to
`ProfileHeader`'s `badges`). The label is always announced to screen readers, and `description`
shows on hover. `AccountBadges` takes a list straight from an API, and `max` folds the rest into a
"+N" count. Both render without client JavaScript.
