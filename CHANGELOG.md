# Changelog

A short record of what changed on each day, how it was tested and what is still open. Newest first.

## Days 21–30 · Distinct layouts, real photography, phone menu

**Why:** client feedback that the sites looked like variations of one template, and that the cartoon-style images should become realistic.

**What changed**

| Day | Site | First screen | Navigation | Opens with | Photography |
| --- | --- | --- | --- | --- | --- |
| 21 | Sol y Sal (restaurant) | Full-bleed tacos photo, headline bottom-left, stats in a glass strip | Split masthead, logo centred | Menu | 16 dish photos |
| 22 | Forno Rosso (pizzeria) | Centred billboard with an oversized pizza rising from the bottom edge | Inverted dark bar | Pizza builder | 6 classic pizzas, delivery rider, open kitchen |
| 23 | Northgate Motorworks | Live car scan as a wide banner, copy in two columns beneath | Capsule menu | Instant quote | Mechanic, tyre, spanner |
| 24 | Halden & Rowe (construction) | Editorial site board: giant headline, tall photo, ruled brief column | Boxed bar, heavy rule, squared tabs | Projects | Hero, process photos, 6 projects, 4 sectors |
| 25 | Pace Logistics | Dark control room with a wide tracking bar | Floating pill | Instant quote | Lorry, warehouse, handover |
| 26 | Atelier Vesper (salon) | Tall staggered arch gallery, narrow copy column | Centred masthead, ruled menu row | Our work | 3 hero arches, 4 stylist portraits |
| 27 | Maison Aurelle (jewellery) | Pedestal: ring in the centre, headline left, actions right | Centred masthead, ruled menu row | Collection | Hero ring, 8 pieces, atelier photos |
| 28 | Stackwell (IT) | Headline row, then the ticket console as a full-width app window | Slim side rail on wide screens | Live status | Open-plan office band |
| 29 | Ironveil (cybersecurity) | Three-panel SOC dashboard: brief, live radar, metrics | Boxed bar, green rule | Live SOC feed | Data hall, engineer |
| 30 | Rival Athletic Club (gym) | Billboard "EARN IT." across the full width, live meter beneath | Boxed bar, pink rule | Week builder | Free weights, dumbbells |

Also: each page's sections were reordered so the signature feature comes first (the booking or contact block stays last); the navigation links follow the new order.

**Added to every landing page (Days 21–40):** a phone menu. Below 1024 px the menu button opens the same links in a panel, and on very narrow screens the header buttons move into it. Day 21 keeps its own existing menu.

**Fixed along the way**
- Day 24: the "How we work" photos broke the sticky heading and the steps; the estimator bar labels were clipped on tablets and phones.
- Day 25 and Day 38: new dark and light panels left some text unreadable; corrected.
- Day 21, 22, 26, 27: contrast on pink, red, clay and gold elements raised to the WCAG minimum.
- Day 22: the delivery photo shifted two coloured cards; moved.
- Day 30: headline kept on one line with its space.

**How it was tested**
- Automated sweep at 360, 768, 1024, 1280 and 1536 px: page overflow, elements off-screen, clipped text, broken images, missing alt text, duplicate ids, one heading per page, and text contrast. All ten pages pass.
- Phone menu: opens, closes on a link, stays inside the screen, and no sideways scroll on every page at 360, 420 and 768 px.
- Spot checks of the first screen in the browser pane.

**Known limits and still open**
- Photographs are free stock (Pexels, sources listed in each day's README) and stand in for the fictional items; they are not photos of the exact dishes, projects or people.
- Only the first screen, navigation and section order were redesigned. Many lower sections still share card styling.
- Not yet tested on real phones or in Safari, and no keyboard-focus pass on the new navigation bars.
- Interactive pieces that change live (the pizza builder, the ring designer, before/after sliders) keep their drawn artwork.
- Nothing is pushed yet.
