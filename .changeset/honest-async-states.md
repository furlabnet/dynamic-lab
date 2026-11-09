---
'@furlab/dynamic-lab': minor
---

Composers and the report dialog now wait for your server. `CommentComposer`, `CommentThread`
(`onAdd`), `MessageComposer` (`onSend`) and `ContentActions` (`onReport`) accept a function that
returns a promise. While it is pending the field is read-only, the button shows a spinner and a
second submit is ignored. The text clears, or the report dialog says thanks, only once the promise
resolves. If it rejects, what the person wrote stays and an error offers a retry. A new
`errorText` prop on both composers sets that message. Functions that return nothing behave as
before. The composers' forms carry `data-status` (`idle`, `pending`, `success` or `error`) for
styling.

Two new hooks share this behaviour with your own components. `useAsyncAction(fn)` returns
`{ status, error, isPending, run, reset }`, and `run` resolves to `true` on success.
`useCopyToClipboard(resetAfter?)` returns `{ status, copy }`, with `status` being `idle`, `copied`
or `failed`.

Fixes:

- Share in `ContentActions` and `ColorSwatch` say "Couldn’t copy" when the clipboard is blocked,
  instead of claiming the link was copied (or saying nothing).
- Toasts pause while hovered or focused, so one can't vanish while you read it or reach for its
  action. Showing a toast with an `id` already on screen replaces it, timers are cleared on
  dismiss and unmount, and the dismiss button has an accessible name.
- `Tooltip` stays open while its trigger has keyboard focus, even after the pointer leaves, and
  Escape hides it.
- The brand mark no longer logs a React warning about `fill-rule`.
