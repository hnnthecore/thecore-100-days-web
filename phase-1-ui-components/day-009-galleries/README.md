# Day 009 · Galleries

Six ways to show visual work. All of them share one accessible lightbox (keyboard, swipe, focus trap, screen-reader friendly).

| # | Gallery | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Halden** filterable portfolio | Agencies, photographers, artists | Masonry layout, category filters with a smooth FLIP rearrange animation, hover captions, lightbox with ← → / swipe |
| 02 | **Ember** menu photo wall | Restaurants, cafés, bakeries | Bento grid, hover/focus captions with price, ♥ save favourites (summary updates live), lightbox |
| 03 | **Forma** property viewer | Real estate, hotels, rentals | Large photo with arrows, counter and room label; thumbnail strip (arrow keys); swipe on touch; "Show all photos" opens the lightbox |
| 04 | **Bygg & Co** before / after | Construction, renovation, cleaning, landscaping, clinics | Drag to compare; the handle is a real slider, so it works with keys and screen readers; project facts |
| 05 | **Nova** swipeable screenshots | Apps, SaaS feature tours | Scroll-snap strip, mouse click-and-drag, dots, progress bar, arrow keys |
| 06 | **Aurum** jewellery zoom | Jewellery, watches, fashion | Hover magnifier lens (2.5×), metal and stone swatches swap the photo, name and price; tap/Enter opens full screen |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## About the images

Everything in `images/` is a lightweight SVG illustration (40 files, about 150 KB in total), so the demo needs no photo downloads or licences. To use real photos, replace a file with one of the same name, or change the `src`/`href`. For real photography, add `loading="lazy"` and responsive `srcset` sizes. The illustrations are small enough to load immediately.

## Notable details

- **Works without JavaScript.** Every image is wrapped in a normal link to the full image, so it still opens on its own.
- **Shared lightbox.** One `createLightbox()` function powers galleries 01, 02, 03 and 06. It handles Esc, ← →, swiping, focus trapping, focus return and a live photo counter.
- **No race conditions.** The jewellery viewer ignores slow image loads from earlier choices, so the photo always matches the chosen metal and stone.
- **Respectful motion.** The filter animation and smooth scrolling switch off for visitors who prefer reduced motion.
