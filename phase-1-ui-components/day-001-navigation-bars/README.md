# Day 001 · Navigation Bars

Six production-ready navigation patterns, each shown in its own interactive browser frame with Desktop, Tablet and Mobile toggles.

| # | Pattern | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Aurora**: floating glass pill | SaaS, product, startup sites | Frosted glass, a highlight that slides to the hovered link, staggered dropdown sheet on mobile |
| 02 | **Atlas**: mega menu | Enterprise, B2B, platforms | Hover intent, instant panel switching, feature cards, page dimming, off-canvas drawer with accordions |
| 03 | **Halden**: editorial overlay | Agencies, studios, restaurants, luxury | Serif wordmark, underline that draws on hover, full-screen clip-path wipe, staggered type, live local time |
| 04 | **Nova**: app bar + command palette | Dashboards, admin panels, web apps | Workspace switcher, breadcrumbs, notifications, account menu, working ⌘K / Ctrl+K palette |
| 05 | **Pulse**: smart sticky header | Blogs, news, documentation | Shrinks on scroll, hides when reading down, returns when scrolling up, reading-progress bar, swipeable tabs on mobile |
| 06 | **Dock**: adaptive app nav | Mobile-first apps, PWAs | Floating bottom tab bar that becomes a side rail on wide screens, safe-area aware, spring-animated active pill |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Reusing a pattern

1. Include `packages/design-system/tokens.css` and `base.css`.
2. Copy the pattern's markup (header plus its sibling overlay, if it has one).
3. Copy that pattern's section from `styles.css` along with the shared primitives (buttons, hamburger, popover).
4. Copy the pattern's `init…` function and the utilities from `script.js`. On a real page it uses the window as the scroll root automatically.

Each nav header is its own CSS **query container**, so it adapts to the space it is placed in rather than the screen size.

## Engineering notes

- **Progressive enhancement.** Every nav is plain semantic HTML with real links, and works without JavaScript.
- **Overlays are siblings of the header**, not children. This keeps `position: fixed` reliable even when the header uses transforms or `backdrop-filter`.
- **Glass on a pseudo-element** (`.aurora__bar::before`) for the same reason.
- **Accessibility:** `aria-expanded` / `aria-controls` on every trigger, focus trapped in modals and returned to the trigger on close, Escape closes everything, arrow keys work in menus and the palette (ARIA combobox + listbox with `aria-activedescendant`), and the reduced-motion preference is respected.
- **Performance:** scroll handling is `requestAnimationFrame`-throttled with passive listeners. Animations only touch `transform`, `opacity` and `clip-path`. No dependencies.
- **Theme:** the theme is resolved before first paint (no flash) and the switch cross-fades using the View Transitions API.
