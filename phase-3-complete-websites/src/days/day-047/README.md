# Day 047 · Complete website: “Solstice Sound”

A three-day music festival in the Cotswolds, as a **complete 18-page website**: home, line-up, one page per act, a clash-aware schedule, tickets with checkout and practical info.

**Open it:** `phase-3-complete-websites/site/day-047-music-festival/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

**The idea:** the festival as a clock face. The home page opens with a **dial**: three rings (Sunset, Forest, Dome), time running round from 16:00 to 23:00, every act an arc on its stage's ring. Day tabs switch the dial; press an act to see its time and add it to your plan. Ink-navy night with sun yellow, vermilion, amber, sky and leaf; **Syne** for headlines, **Albert Sans** for text. No gradients, no neon.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | The programme dial with day tabs, headliners set as large type, three stages with photographs, computed sunrise and sunset for each day, tickets, getting here |
| **Line-up** | `/lineup/` | Twelve acts from the `artists` collection, filter by day and genre, live search, ★ to add to your plan |
| **Act ×12** | `/artists/<slug>/` | Poster, facts, bio, an **Add to my plan** button, the other acts that day and previous / next links |
| **Schedule** | `/schedule/` | A three-stage timetable per day, **clash warnings** for starred sets that overlap, and a printable "My plan" |
| **Tickets** | `/tickets/` | Day pass, weekend or VIP, a quantity stepper, camping / parking / shuttle extras (priced per person, pitch or car), a live total and a checkout dialog with a booking reference |
| **Info** | `/info/` | Getting there, camping, access, families, sustainability, FAQ accordion and a contact form |

## Things worth reading in the code

- `plan.ts` is the shared "My plan". It reads `localStorage` on every call, because each page's scripts are bundled separately and a cached copy would go stale.
- `clashes()` finds starred sets on the same day whose times overlap.
- The dial on the home page is drawn on the server: each act's arc is computed from its start and end time (`index.astro`), and a small script handles the day tabs and the plan button. Sunrise and sunset use NOAA's simple formula for 51.8 N, 1.8 W, in British Summer Time.
- Forms use the shared `wire()` helper.

## Photography

The photo band under the hero uses real photographs from Pexels (free to use, no attribution required), stored in `src/assets/day-047/` and converted to WebP at build time. The artist artwork stays generated because the lineup is fictional.

| Use | Pexels photo |
| --- | --- |
| Three days. One valley. | https://www.pexels.com/photo/14267300/ |
| Four stages | https://www.pexels.com/photo/7513442/ |
| Camp under the stars | https://www.pexels.com/photo/37541019/ |

### Navigation redesign

The header is now a bottom dock on desktop, and the home page sections follow a different order from the other days.

### Home hero redesign

The sunset hero stays, and the countdown is now a perforated festival ticket. The page opens with the line-up, then the three days, the photo band, the stages and tickets.

### Real photography and new structures (Days 46 to 60 uniqueness pass)

- **Photography:** every act, stage, the camping and shuttle scenes and the wristbands are real Pexels photographs (free to use). Acts: Aya Moon 8198205, Cassius Rowe 9008804, Fenwick 16844542, Juno & the Wolves 38228687, Kite & Key 3947517, Lila Hart 9002845, Moss Theory 5610109, Nova Vale 30124278, Ozone Kids 3656773, Pale Static 13807985, The Marlowes 16118368, Tilda Brandt 8041087. Stages: Sunset 13888672, Forest 31367353, Dome 35777518. Others: camp 8993120, camp lawn 33708374, wristbands 12092995, shuttle 37360409, food 20147044. They are stand-ins for the fictional acts. The drawn posters are gone.
- **Line-up:** the default view is now a typographic festival poster with names sized by billing, a photo that appears when you hover or focus a name, and a Cards view with stars.
- **Artist pages:** a set-time bar shows where the act sits in the day across the three stages, and warns when it overlaps an act already in your plan.
- **Footer:** a ticket stub with a perforated tear-off and a Get tickets button.
- **New page:** Getting here and camping, with routes compared in a table, a camping planner and a packing list that remembers what you have packed, and a real map.
