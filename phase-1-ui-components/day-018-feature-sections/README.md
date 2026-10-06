# Day 018 · Feature sections

Six ways to present what a product or business does. No libraries, no images: every illustration is CSS.

| # | Section | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Lumen** interactive bento grid | SaaS, apps | Mixed-size tiles that are tiny working demos: live chart and visitor count, a privacy switch, a “Run it” install command, an invite button that grows the avatar stack, uptime count-up, glow that follows the pointer |
| 02 | **Atlas** auto-playing feature tabs | Developer tools, platforms | Vertical tabs with a progress line, auto-advance every 5 s, pauses on hover / focus / when off screen, Pause button, ↑ ↓ keys, mock terminal, pull request, score rings and history screens |
| 03 | **Halden** alternating service rows | Agencies, studios, trades | Zig-zag layout, rows fade in on scroll, results count up once, numbered services with checklists |
| 04 | **Forma** before / after slider | Renovation, cleaning, photo editing, redesigns | Drag the handle or click the picture, keyboard slider (← → Home End PageUp/Down), Before / Half / After shortcuts, results list |
| 05 | **Nova** sticky scroll story | Product launches, “how it works” | Steps scroll while the picture stays pinned and changes per step, progress dots, picture-per-step fallback on phones |
| 06 | **Ember** integrations directory | Platforms with partners | Category filters with counts, search with highlighted matches, “Popular” badges, and a request form instead of a dead-end “no results” |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Ideas worth knowing (in simple words)

- **Show, don't tell.** A switch you can flip is more convincing than a sentence saying “easy to configure”.
- **Anything that moves on its own can be paused.** The feature tabs pause on hover, on focus and with a Pause button, and stop when scrolled away (WCAG 2.2.2). Under “reduce motion” they don't auto-play at all.
- **Reveal animations must fail safely.** Rows only start hidden after the script adds `.is-ready`. If JavaScript fails, or motion is reduced, everything is simply visible.
- **Count-ups show the real number first**, so screen readers and slow devices never see “0”.
- **Sticky storytelling** is just `position: sticky` plus an `IntersectionObserver` watching which step crosses the middle of the screen.
- **The before/after slider** is a real `role="slider"` with `aria-valuetext` like “60% before, 40% after”, so it's usable without a mouse.
