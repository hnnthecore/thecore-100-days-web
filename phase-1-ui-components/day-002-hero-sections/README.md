# Day 002 · Hero Sections

A hero section is the large area at the top of a homepage: the headline, a short pitch, and the main button. It's the first thing visitors see and it decides whether they stay. This day delivers six heroes, each built for a different industry from the roadmap, so they can be reused directly in Phase 2 (Landing Pages).

| # | Hero | Industry | What makes it work |
|---|------|----------|--------------------|
| 01 | **Nimbus** | SaaS / software | Cursor-following spotlight, email sign-up with friendly validation, product screenshot that tilts upright as you scroll, logo cloud |
| 02 | **Forma** | Real estate | Search-first layout: Buy/Rent/Sell tabs, validated search with instant results, illustrated home with floating listing and agent cards |
| 03 | **Ember** | Restaurant | Warm editorial look with film grain, a slowly turning plate, a rotating "Reserve a table" seal, and live open/closed status in London time |
| 04 | **Kinetic** | IT company / agency | Huge headline with a rolling word (software → platforms → mobile apps → AI products) and an endless services band |
| 05 | **Sentinel** | Cybersecurity | Typing terminal running a threat scan, radar sweep, and stats that count up when they come into view |
| 06 | **Forge** | Gym / fitness | Poster typography, live countdown to the next class, and background layers that move with the cursor |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Notable techniques

- **Brand-scoped tokens.** Each hero overrides a few design-system tokens (accent colour, or a full dark palette) on its own root element. Shared buttons and components inside it pick up the brand automatically. This is how one design system serves many different clients.
- **No image files.** The house, the plate dish, the radar and the textures are hand-built SVG and CSS. They stay sharp at any size and add almost nothing to the page weight. When we build real client sites, photos replace them.
- **Performance.** Looping animations pause when a hero scrolls off-screen (IntersectionObserver). Pointer and scroll effects run at most once per frame.
- **Accessibility.**
  - The rolling headline has a static, screen-reader-friendly version.
  - The tabs follow the WAI-ARIA pattern, with arrow keys, Home and End.
  - Form errors are announced politely.
  - Everything settles into a still state for visitors who prefer reduced motion.
- **Live, honest details.** The restaurant's status uses real opening hours in its own time zone, and the class countdown always targets the next half-hour slot.

## Reusing a hero

1. Include `packages/design-system/` (tokens, base, components).
2. Copy the hero's `<section class="hero …">` markup.
3. Copy the hero foundation plus that hero's section from `styles.css`.
4. Copy that hero's `init…` function plus the shared helpers at the top of `script.js`.
5. On a real page, the hero fills the screen (`min-height: 100svh`).
