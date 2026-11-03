---
'@furlab/dynamic-lab': patch
---

HoverCard no longer clones its trigger, so it works when the trigger comes from a React Server
Component. Before, a production build rendered it as an element with an undefined type and the
page failed with "Element type is invalid". `children` now accepts any `ReactNode`.
