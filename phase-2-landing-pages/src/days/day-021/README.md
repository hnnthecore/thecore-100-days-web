# Day 021 · Restaurant landing page: “Sol y Sal”

A modern Mexican kitchen & mezcal bar in Shoreditch (a fictional brand). The mood is hot, joyful and hand-made: marigold, hot pink and agave green on warm cream, with a deep cacao menu section. Typography pairs **Fraunces** (soft, characterful serif) with **Bricolage Grotesque** (friendly grotesk). Every illustration is hand-built SVG.

**Open it:** `phase-2-landing-pages/site/day-021-restaurant/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | Swaying papel picado bunting, big serif headline, illustrated taco plate with a spinning “hecho a mano” badge, live **Open now / Closed** pill (London time), counting stats, and a scrolling marquee with a pause button |
| 2 | **Menu** | Four tabs (Tacos, Platos, Dulces, Bebidas) with keyboard support; dietary filters (Vegetarian, Vegan, Gluten-free, No spice) that combine; signature badges, spice levels and an empty state with “Clear filters” |
| 3 | **Story** | Founder story with an illustrated arch collage and count-up facts |
| 4 | **Experiences** | Four colour-blocked weekly events (Taco Tuesday, mezcal masterclass, mariachi, private fiesta) with a gentle 3D tilt on hover |
| 5 | **Reviews** | Big-quote carousel that auto-advances but pauses on hover, focus, off-screen and reduced motion; demo publication strip |
| 6 | **Visit & booking** | Booking form: next 14 days (Mondays closed), free and fully-booked time slots, guests stepper (max 8, with a private-dining hint), validation and a confirmation with a reference code. Beside it: a map illustration, address and opening hours with today highlighted |

Plus a sticky header that turns solid on scroll, highlights the section you're reading and becomes a full-screen menu on phones, and a footer with a newsletter sign-up.

## Built with

- Astro page rendered at build time: menu, reviews and hours are real HTML, good for SEO and readable without JavaScript.
- Tailwind CSS v4 for layout; `styles.css` holds the brand system (inside `@layer components`).
- `script.ts` is about 8 kB of progressive enhancement and needs no library.

## Accessibility

- Skip link and real landmarks. Menu tabs follow the WAI-ARIA pattern. Filters use `aria-pressed`.
- Live regions for menu counts, the open/closed status and the booking summary.
- Form errors are linked with `aria-describedby`, and focus moves to the first problem.
- Marquee and carousel can be paused (WCAG 2.2.2). All motion is switched off under “reduce motion”.
- Focus is clearly visible on light and dark sections.

## Notes

- Fictional business: reviews, publications, phone and email are demo content, and no booking is really made.
- Opening status uses Europe/London time, so it's correct wherever the visitor is.
