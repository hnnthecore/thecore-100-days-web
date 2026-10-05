# Day 013 · Modals

Six dialogs, all powered by one small controller (`createModal` in `script.js`). No libraries.

| # | Dialog | Best for | Highlights |
|---|--------|----------|------------|
| 01 | **Halden** type-to-confirm delete | Dangerous, permanent actions | `alertdialog`, lists exactly what will be lost, button unlocks only when the name matches, loading state (can't cancel mid-request), Undo toast |
| 02 | **Lumen** command palette | Apps with lots of pages & actions | ⌘K / Ctrl K, searches pages, actions and people at once, ↑ ↓ + Enter, highlighted matches, remembers recent picks; “Toggle dark mode” really works |
| 03 | **Forge** onboarding steps | Sign-up, setup wizards | Three questions + summary, progress bar, Next unlocks only when answered, Back keeps answers, can't be closed by an accidental backdrop click (it wiggles instead) |
| 04 | **Ember** bottom sheet | Mobile ordering, quick actions | Slides up from the bottom on phones, drag the handle down to dismiss or up to expand, extras + quantity with a live total; a centred dialog on wide screens |
| 05 | **Atlas** slide-over panel | Editing records in a list | Slides in from the right, validation, “Discard unsaved changes?” guard on Esc / close, saving updates and highlights the row |
| 06 | **Nova** share & invite | Docs, design files, projects | Type emails → chips (Enter, comma or paste a list), duplicate/invalid checks, change or remove access with Undo, public-link toggle, Copy link |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## What every dialog does (the checklist)

1. **Moves focus inside** to the most useful control (the input to type in, or the main button).
2. **Traps Tab** so keyboard users can't wander behind the dialog.
3. **Makes the page behind `inert`**, so screen readers and clicks can't reach it.
4. **Closes with Esc** and the backdrop (unless closing by accident would lose work).
5. **Returns focus** to the button that opened it, or to the next sensible place if that button is gone.
6. **Animates** in and out, with no animation when reduced motion is on.

## Why not the native `<dialog>` element?

`<dialog>.showModal()` is excellent on a real page, and Phase 3 sites will use it. On this showcase page, though, each demo lives inside a small preview frame. A native modal dialog always covers the whole browser window, so a custom `role="dialog"` keeps each one inside its own frame. The behaviour checklist above is the same either way.

## Notes

- The delete “server request” is simulated (0.9 s) so you can see the loading state.
- The ⌘K shortcut only works while the palette demo is on screen, so it never takes over the rest of the page.
- Copy link uses the Clipboard API, with an older fallback for browsers that block it.
