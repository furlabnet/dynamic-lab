---
'@furlab/dynamic-lab': patch
---

`ThemeProvider` no longer reads saved choices during hydration, so server-rendered pages don't get
hydration mismatches, and it saves choices when they're made instead of on every render. Without a
saved mode it follows the system setting until one is picked. `Sparkline` takes a `locale`;
`StatTile` passes it on instead of a formatting function.
