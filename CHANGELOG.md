# Changelog

A short record of what changed on each day, how it was tested and what is still open. Newest first.

## Days 31–40 · Distinct layouts, real photography, phone menu

**Why:** the same client feedback as Days 21–30, applied to the second half of Phase 2.

| Day | Site | First screen | Navigation | Opens with | Photography |
| --- | --- | --- | --- | --- | --- |
| 31 | The Saltmarsh (hotel) | Magazine layout: tall arched window beside the headline, wide booking bar beneath | Split masthead, logo centred | Plan your stay | Hero and six room cards, each with its own photo |
| 32 | Lemon & Linen (cleaning) | Rounded mint panel, instant quote left and copy right | Floating pill | Room by room | Photo band, team photo |
| 33 | Voltline (electrician) | Lightning-strike diagonal with a huge bolt bleeding off the edge | Bottom dock on desktop | Emergency triage | Electrician and consumer-unit photos |
| 34 | Copperline (plumber) | Copper pipe running down the copy, today's slots in a side card | Copper pipework bar | Leak calculator | Two plumbing photos |
| 35 | Apex Motor Group (cars) | Night showroom with a red racing stripe and the colour studio as a display stand | Boxed bar, red rule | Stock | Nine real stock-car photos on the cards and in the test-drive summary |
| 36 | Latch & Lane (estate agent) | Photo running from the left screen edge, search card beside it | File-style tabs | Neighbourhood guide | Nine listing photos on the cards and in the viewing summary |
| 37 | Pawprint (vet) | Organic pet blob with the picker floating on it, wavy edge | Floating pill | Symptom checker | Pet photos in the hero, summary and team avatars |
| 38 | Ember & Oak (coffee) | Dark roast control panel with the roast dial as a wide instrument panel | Inverted dark bar | Taste quiz | Roastery photo band |
| 39 | Wayfarer (travel) | Full-bleed Santorini photo behind the hero, trip matcher as a panel | Floating pill | Itinerary builder | Eight destination photos |
| 40 | Halide & Co. (photography) | Giant serif headline, then a cinematic aperture strip with controls beneath | Centred masthead, ruled menu row | How it works | Twelve portfolio photos and lightbox |

Also: sections reordered on every page so the signature feature comes first (the booking or contact block stays last), the navigation follows the new order, and the shared phone menu from Days 21–30 covers these pages.

**Fixed along the way**
- The phone-menu button had become the header's last element and broke the right-hand button layout on Days 26, 27, 28 and 31 on desktop. It now sits before the navigation and is moved to the end with CSS, so every header keeps its own layout. This fix also applies to Days 26–28, which were already published.
- Day 31: The Lighthouse room now has its own photo instead of reusing the Sea View Suite.
- Day 35: the nine stock cards and the test-drive summary use real car photos instead of drawn cars.
- Day 36: the viewing summary shows the chosen property's photo.
- Day 33: the bottom dock no longer overlaps the Thecore badge.
- Contrast and layout fixes found by the automated sweep on Days 31, 34, 36, 37, 38 and 40.

**How it was tested**
- The same automated sweep as Days 21–30, at 360, 768, 1024, 1280 and 1536 px.
- Phone menu on every page at 360, 420 and 768 px.
- Visual check of the first screen and the first section after it on each day.

**Known limits and still open**
- Photographs are free stock (Pexels, sources in each day's README) and stand in for the fictional items. The Day 35 cars are the right models but not the exact colours, trims or plates.
- The hero colour studio (Day 35), the ring designer (Day 27) and the pizza builder (Day 22) keep drawn artwork because they change live.
- Not yet tested on real phones or in Safari, and no keyboard-focus pass on the new navigation bars.

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
