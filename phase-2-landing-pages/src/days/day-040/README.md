# Day 040 · Photography studio landing page: “Halide & Co.”

A wedding and portrait photography studio in Bristol (fictional), and **the last landing page of Phase 2**. The brief to myself: **let the pictures lead**. It uses paper white, ink black and a single film-red accent, with big **Bodoni Moda** headlines and a quiet **Hanken Grotesk** interface. Even the "photographs" are composed in code, in four genres and three palettes each, with a film-grain filter over every one.

**Open it:** `phase-2-landing-pages/site/day-040-photography/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + aperture studio** | A three-layer scene (foreground flowers, subject, background lights). Slide the aperture from f/1.4 to f/16 and the layers blur or sharpen like a real lens, with the shutter speed and a plain-English note on when we use each |
| 2 | **Portfolio & lightbox** | Twelve photographs in a masonry layout, filterable by weddings, portraits, travel and brand. Each opens in a **native `<dialog>` lightbox** with previous / next (buttons and arrow keys), the title, location and EXIF-style details |
| 3 | **Package builder** | Choose a shoot type (wedding, portrait, family, brand), hours and add-ons (second photographer, album, prints, aerial, rush edit). It prices the package live with a 30% deposit and delivery time, and hides add-ons that don't apply |
| 4 | **Process & turnaround** | Five steps that appear as you scroll along a drawing line, then a delivery-date calculator for each shoot type, with a rush option |
| 5 | **Availability calendar** | A month view with booked, one-slot-left and free dates (Saturdays from May to September go first). Pick a date to carry it into the turnaround calculator and the enquiry |
| 6 | **Enquiry** | A validated form that arrives pre-filled from the package and the date you chose, with a personal confirmation |

## Details worth knowing

- The lightbox is a real modal dialog: focus is trapped, Esc closes, a click on the backdrop closes, and focus goes back to the photo you opened.
- Everything that looks like a photograph is generated, so nothing is hot-linked or stock. The generator takes a genre and a palette index and returns an SVG that can be cropped to any shape.
- Availability is seeded from the date, so it looks the same on every visit.

## Accessibility

- The aperture slider announces its value (“f/2.8”) and the depth-of-field note is a live region. The blurred layers are decorative.
- Portfolio buttons have full labels (“Open Vows in the garden, Tyntesfield Estate”). Filters use `aria-pressed`.
- Calendar days are buttons with a full date and status in their label; booked and past days are disabled. The selected date is announced.
- “Reduce motion” stops the card entrance animations, the blur transitions, the process line and the step fades.

## Notes

Halide & Co. is a fictional studio. Photographs, prices and availability are demo content, and nothing is sent.
