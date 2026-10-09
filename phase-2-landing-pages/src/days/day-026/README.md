# Day 026 · Hair salon landing page: “Atelier Vesper”

An independent hair studio in London (fictional). The brief to myself: **soft editorial luxury**, the feel of a magazine rather than a price list. It uses cream, blush, clay and deep aubergine. **Instrument Serif** carries the headlines, with italics in clay as the accent, and **DM Sans** handles the interface. People are shown in arch-shaped portraits, and every portrait is drawn by one SVG component, so there are no photos.

**Open it:** `phase-2-landing-pages/site/day-026-hair-salon/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | Arch portraits rise in, with a rating stamp. A chip shows the **real next free appointment**, calculated from the same diary the booking form uses |
| 2 | **Menu** | Cut / Colour / Care / Bridal tabs in a dotted-leader price-list style. Every line has a **+** button, and a sticky basket shows the count, total price and time |
| 3 | **Stylists** | Four specialists, each with a quote, specialities and a “Book with …” shortcut that pre-selects them in the booking form |
| 4 | **Transformations** | Three before / after cases (balayage, pixie restyle, copper gloss) with a draggable reveal. The slider is a real range input, so it also works with a keyboard |
| 5 | **Booking** | Three steps: services → stylist, day and time → details, with a live summary and total. A confirmation screen gives a reference code |
| 6 | **Visit & reviews** | An **open-now** status calculated from the opening-hours table, today's row highlighted, address and three reviews |

## Booking logic

- Opening hours are read from the hours table on the page, so the table, the open-now status and the available slots can never disagree.
- Slots are every 30 minutes and must fit the **total duration** of the chosen services. A 3-hour balayage doesn't offer a 6 pm start.
- Availability is generated from the date, stylist and time, so the diary looks the same on every reload. With “Any stylist”, a slot is free if any of the four is free.
- Changing services or stylist after a time is picked clears it if it no longer fits. Days with no free slots are disabled.
- Each step validates before continuing (services, then day and time, then name, UK mobile and email), with inline errors.

## Accessibility

- Menu tabs follow the WAI-ARIA pattern. The add buttons use `aria-pressed`, and the basket is a live region.
- Services, stylists, days and times are real checkboxes and radios, styled with a visible focus state. Unavailable times are disabled and struck through.
- The stepper uses `aria-current="step"`. Errors use `role="alert"`, and the confirmation takes focus.
- “Reduce motion” turns off the arch rise, the basket pop and the tick animation.

## Notes

Atelier Vesper is a fictional business. Prices, reviews and people are demo content, and nothing is sent or stored.

## Photography

The three arches in the hero use real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-026/` and converted to WebP at build time. I skipped photos that showed a real salon name or hair-product brands. The team and gallery sections keep their drawn heads for now.

| Use | Photo | Source |
| --- | --- | --- |
| Arch 1 | Blow-dry with a round brush | https://unsplash.com/photos/FkAZqQJTbXM |
| Arch 2 | Hair wash at the basin | https://unsplash.com/photos/Md_DhaFsnCQ |
| Arch 3 | Salon floor with arched mirrors (black and white) | https://unsplash.com/photos/_Fy7Kq0w6OI |

### Team portraits

The four stylist portraits are stock photos from Pexels (free to use) standing in for the fictional team. Pexels IDs: 20781288, 36712860, 18003350, 9331274. The before/after slider keeps its drawn hair because it needs matched before and after photos of one client, which stock libraries rarely offer.

### Layout redesign

The hero now leads with a tall, staggered arch gallery on the left, with a narrow copy column on the right aligned to the bottom, instead of the usual text-left, picture-right split.

### Navigation redesign

The header is now a centred masthead with a ruled menu row, and the sections follow a different order from the other days.
