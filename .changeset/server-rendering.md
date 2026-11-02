---
'@furlab/dynamic-lab': minor
---

The library works with React Server Components (Next.js App Router and similar). The build no
longer stamps `'use client'` on every file: only the 45 modules that need the browser declare it,
so layout, typography, cards, tables and the helpers (`cn`, `buttonVariants`, `TOKENS`…) render on
the server and ship no JavaScript, and Server Components can call the helpers. The React Compiler
only runs on client modules. Pure parts of interactive files moved into their own modules so they
render on the server too: `SiteNav`, `SiteNavLink`, `SiteFooter`, `SidebarNavGroup`,
`SidebarNavItem`, `MenuLabel`, `MenuSeparator`, `Select`, `MessageBubble`, `MessageDivider`,
`ConversationItem`, `StatTile`, `CharacterSheet`, `SwatchList`, `ProfilePreview`, `PalettePreview`,
`AgeRating`, `ReadingProgress`, plus `renderMarkdown`, `countWords`, `parseTag`, `readerStyle`,
`formatCount`, `relativeTime`, `toDateKey` and the default lists. Import names are unchanged.
`ThemeScript` (with `DEFAULT_THEME_STORAGE_KEY`) is an inline script for `<head>` that applies the
saved theme before the first paint on server-rendered pages; the docs have a "Server rendering"
guide with the Next.js set-up.
