# Day 043 · Complete website: “Rootwork Community Farm”

A community farm and charity in Manchester (fictional), as a **complete 13-page website** built around the two things a charity site must do well: get people to volunteer and get people to give.

**Open it:** `phase-3-complete-websites/site/day-043-community-farm/index.html`

The look is warm and hopeful: soil brown and leaf green with sunshine yellow and tomato red, **Bricolage Grotesque** for headings and **Fraunces** italics for emphasis. Every scene is an illustration made in code.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | Hero, animated impact counters, four programmes, a donation box, stories and a call to action |
| **Programmes** | `/programmes/` | Four programmes from the `programmes` collection |
| **Programme ×4** | `/programmes/<slug>/` | Detail page for each programme |
| **Get involved** | `/get-involved/` | Volunteer shifts from the `shifts` collection with a type filter, live spots left, multi-select sign-up, a native-dialog confirmation form and a full donation section |
| **Stories** | `/stories/` | Three stories from the `stories` collection with category filters |
| **Story ×3** | `/stories/<slug>/` | Long-form reading with reading time and more stories |
| **About** | `/about/` | Mission, team, timeline and supporters |
| **Contact** | `/contact/` | Validated message form, map, visiting details and an FAQ accordion |

## Things worth reading in the code

- `DonateBox.astro` is one component used on two pages. It has once/monthly, preset and custom amounts, a live "what your gift buys" line and a demo thank-you.
- `involved.ts` keeps a `Set` of chosen shifts and repaints the list, spots left and the sticky summary bar.
- Forms use the shared `wire()` helper. They are demos: nothing is sent.

## Photography

The hero and the photo band use real photographs from Pexels (free to use, no attribution required), stored in `src/assets/day-043/` and converted to WebP at build time.

| Use | Pexels photo |
| --- | --- |
| Everyone is welcome | https://www.pexels.com/photo/7658761/ |
| Grow, pick, cook, share | https://www.pexels.com/photo/23391569/ |
| Harvest days every Saturday | https://www.pexels.com/photo/27177504/ |
| Hero image | https://www.pexels.com/photo/27742358/ |

### Programme photos

The four programme cards and programme pages use real photographs from Pexels (free to use): green-jobs 17912395, grow-together 7728631, little-sprouts 11286045, seed-to-plate 8507629.

### Navigation redesign

The header is now a floating pill bar, and the home page sections follow a different order from the other days.

### Home hero redesign

The first screen is a collage of four rounded photographs (arch, circle, inverted arch, rounded square) around a centred headline; the old photo band now lives inside it. The page opens with the programmes, then the impact numbers, stories, a volunteer quote and the donate box.

### Real photography on stories, quote and map

Every drawn picture is gone. The three stories each have a real photograph (card, story page and "more stories"): Amina and the allotment 7658788, From trainee to grower 6511169, The 1,000-tomato summer 5479521. The volunteer quote has a real portrait (6787552). "More from the farm" on programme pages uses the programme photographs, and the contact page has a real OpenStreetMap map of Chorlton with a photograph of the allotment gate (8234308). All from Pexels (free to use). The photos are stand-ins for the fictional people and places.

### Team portraits

The four people on the About page now have real portraits from Pexels (free to use): Farida Haque 30647743, Joe Mbeki 7156436, Dev Anand 36294665, Lucy Marsh 7656127. They are stand-ins for the fictional team; replace them with real photos before launch.
