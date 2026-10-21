# Changelog

A short record of what changed on each day, how it was tested and what is still open. Newest first.

## Day 44 · Fathom rebuilt around one live forecast

Rebuilt from a written brief (src/days/day-044/DESIGN.md) with the Taste Skill and Impeccable.

- **Idea:** the product itself is the first screen. A huge chart of the next 13 weeks that visitors bend with three sliders (sales change, a new hire, customers paying late). The line, the lowest-balance callout, a plain-English verdict and three readouts update on every move; the dotted line is the current plan and the coral line is the safety floor.
- **Sections:** a timed morning feed with a photograph, six feature panels that open like an accordion, poster-size numbers, a horizontal customer chooser with photograph and quote, and a large closing sentence.
- **Look:** green-black and mint with Onest and Hanken Grotesk. The purple-blue gradient headline, floating dashboard mock-up, rounded bento cards and monospace numbers are gone.
- **Inner pages:** restyled through tokens: dark plain header, flat ink page heads, square controls, flat tiles; the shared chart helper recoloured.
- **Logo:** the forecast-line mark recoloured to mint on ink.
- **Checked:** linter 0/0; inspector with only environment notes left; page sweep at five widths.

## Day 43 · Rootwork rebuilt around the current month

Rebuilt from a written brief (src/days/day-043/DESIGN.md) with the Taste Skill and Impeccable.

- **Idea:** a farm that is different every month. The first screen is the name of the current month at poster size, on that season's colour, with the crops being picked right now and a one-line farm note. Twelve month buttons scrub the year. It reads today's date on load.
- **Sections:** four programme bands, one per season; Come and dig (next shifts and places left); impact numbers on ink; Amina's quote with the stories as an editorial list; the donation box on the season colour; a footer with one large sentence.
- **Look:** flat, rectangular, saturated seasonal grounds. The rounded collage, pill nav, pillow cards, soft shadows and green arch headers are gone. Bricolage Grotesque (condensed) and Newsreader replace Fraunces.
- **Inner pages:** restyled through tokens: season-coloured flat page heads, plain header bar, square buttons and fields. The harvest-board footer was removed because the home now does that job.
- **Logo:** the sun-over-furrows badge recoloured to the new palette.
- **Checked:** linter 0/0; inspector with only environment and by-design notes left; page sweep at five widths.

## Day 42 · Atelier Nord rebuilt as one street elevation

Rebuilt from a written brief (src/days/day-042/DESIGN.md) with the Taste Skill and Impeccable.

- **Idea:** the studio's work as a single continuous elevation. Eight buildings stand side by side on a ground line with a metre ruler and blue dimension lines; scrolling walks you along them (pinned on wide screens, a plain swipe on phones and with reduced motion). A readout counts the metres and names the building you are passing.
- **First screen:** Atelier Nord at display size, one sentence, the readout, and the elevation already cut by the right edge. No hero photograph and no card grid.
- **Sections:** The site decides (three notes), the register of all projects with a hover photograph, four numbers drawn as dimensions, the journal with one large article, a huge Start a project line, and a title-block footer.
- **Type and colour:** Archivo and Source Serif 4; cold concrete, ink and one dimension blue. The amber and the Schibsted/Newsreader pairing are gone.
- **Inner pages:** restyled through tokens: flat concrete page heads, flat tiles, plain header, table rows fixed to equal columns.
- **Logo:** the survey needle recoloured to the new palette.
- **Checked:** linter 0/0, inspector no overflow or contrast issues, 19-page sweep clean.

## Day 41 · Pagebound Books rebuilt as a contact sheet

Second site rebuilt from a written brief (src/days/day-041/DESIGN.md) with the Taste Skill and Impeccable.

- **Idea:** the whole shop at once. Every book spine out in strict rows, mixed with greyscale pictures of Canongate and the book trade, instead of three featured bestsellers.
- **First screen:** Pagebound Books at display size, a plain line and the address, then a six-column sheet of covers and street pictures with a dark panel set into the grid. Hover a frame and its bookseller's note appears.
- **Sections:** the shop in a narrow column, the staff shelf with one lifted frame, What's on as two-ended rows, Reserve and collect as a drag row, The whole shop as a masonry sheet you can sort by shelf, one sentence and one button, and a footer of tiles with a live Edinburgh clock.
- **Type and colour:** Schibsted Grotesk; rose-grey ground and ink; green only on the current link and one footer tile. The covers are the only colour.
- **Photographs:** 17 open-licence pictures of the Royal Mile and the book trade from Wikimedia Commons, credited on the About page.
- **Inner pages:** books, a book, events, basket, about, visit and the staff shelf follow the same tokens: left-aligned headers, flat square tiles, text-style choices, no rules or pills.
- **Checked:** source linter 0 fail 0 warn; browser inspector 0 fail at 1440, 768 and 390; overflow and contrast sweep at five widths.

**Replaced:** the oxblood and cream look and the old home.

## Day 45 · Lingua Lane rebuilt as the pilot for the new design direction

Client feedback: the sites look AI-made (same hero formula, card grids, fonts and rhythm). Day 45 is rebuilt from a written design brief (src/days/day-045/DESIGN.md) using the Taste Skill and Impeccable tools.

- **Idea:** Gower Mews is a lane of eight painted doors, so one arched door shape runs the whole site: the giant coral hero door (with its number 14), the photographs, the buttons, the teacher bullets and the footer.
- **First screen:** Eight doors, one lane. A giant door cropped by the viewport, one sentence, one button. No label above the headline, no highlighted word, no row of stats.
- **Live thing:** Pick a door. Eight languages, each with its photograph, greeting, teacher and class times. The photograph opens with a shutter.
- **Sections:** statement with arched thumbnails, the eight doors, a horizontal accordion for how a course runs, a two-column teacher list, question cards filed like index cards, one action tile, and a footer built from eight doors in the language colours.
- **Type and colour:** Switzer (self-hosted), one family; the brand coral, saffron, teal and ink on a cool lilac-white ground. No gradients, no shadows, no outlines, no eyebrow labels.
- **Inner pages:** the same tokens: left-aligned page headers, flat tiles, arched buttons and chips, door-shaped photos.
- **Photographs:** the hero door holds a real photograph of Gower Mews, Bloomsbury (CC BY-SA 2.0, David Howard, credited in the footer), found with the skill's open-collection picture finder.
- **Checked:** the Taste Skill source linter reports 0 fail and 0 warn; the sweep at 360, 768, 1024, 1280 and 1536 px was run on all 15 pages and its findings (clipped footer labels on small phones, several pale text colours) were fixed.

**Replaced:** the rotating hello footer and the old hero.

## Days 41–45 · Real logos and favicons

Client feedback: every site needs its own logo and favicon. The emoji favicons and clip-art logos are replaced by marks drawn for each brand.

| Day | Mark |
| --- | --- |
| 41 Pagebound Books | Books on a shelf seen from the spines, one leaning against the others |
| 42 Atelier Nord | A survey mark: a slim compass needle, half ink and half fjord blue, crossed by a hairline |
| 43 Rootwork | A round badge: sun rising over furrows in the field |
| 44 Fathom | A forecast line that turns dashed mint where the forecast begins |
| 45 Lingua Lane | Two speech bubbles in conversation, saffron where they overlap |

Each site now has mark.svg, favicon.svg, favicon.ico, favicon-32.png, apple-touch-icon.png and icon-512.png under public/<site-folder>/. The header and footer draw the mark inline beside the live wordmark. The artwork is generated by scripts/make-brand.mjs; edit a mark there and run node scripts/make-brand.mjs.

**Next:** the same for Days 46 to 60, then a design.md for each site.

## Days 41–45 · Second round of deeper structure

Each site now has its own collection layout, detail layout, footer, signature moment and one page no other site has (see UNIQUENESS-MATRIX.md).

| Day | Collection | Detail page | Footer | New page |
| --- | --- | --- | --- | --- |
| 41 Pagebound Books | Shelves of spines that flip to covers (with a Grid view) | Look inside / Details / In store tabs with an open-book spread | Colophon and library-card hours | Staff shelf; basket gets a pick-up day and slot |
| 42 Atelier Nord | Drawing-sheet index: numbered rows with hover preview | Title block plus Photograph / Site map toggle (real OpenStreetMap) | Title-block footer | Awards timeline |
| 43 Rootwork | Seasonal calendar of programmes by month | Hour-by-hour "A day at the farm" | Sunrise strip with this week's harvest board | What's growing now (month picker, 10 crops with real photos) |
| 44 Fathom | Feature comparison matrix | Tabs: Overview / How it works / Pricing | Status-page footer (uptime strip, latest changes) | Plan quiz |
| 45 Lingua Lane | Flip tiles that open onto A1 to B2 level paths | Syllabus stepper with weekly outcomes | Rotating hello in eight languages | Free trial lesson booking with calendar file |

**Fixed along the way:** Fathom's mobile menu icon was white on white; a new tab style briefly clashed with the home customer tabs and was renamed.

**Tested:** all pages of Days 41 to 45 are clean at 360, 768, 1024, 1280 and 1536 px in the automated sweep.

## Days 43–45 · No drawn or sample images left

**Why:** the client asked for real photographs instead of drawn or sample pictures. Every drawn illustration on these three sites is now a real photograph.

| Day | What was drawn | Now |
| --- | --- | --- |
| 43 Rootwork | Story cards had no picture; "More from the farm" and the contact map were drawn; the volunteer quote had no face | A real photo for each of the three stories (card, story page, "more stories"), a real portrait on the volunteer quote, programme photos in "More from the farm", a real OpenStreetMap map of Chorlton with a photo of the allotment gate, and real portraits of the four team members on the About page |
| 44 Fathom | Feature pages showed a drawn chart; customers were letter tiles | One real photograph for each of the six features, a real photograph of each customer's business, and a real portrait of each person quoted. The hero dashboard and the live what-if demo stay as real interactive interface, not pictures |
| 45 Lingua Lane | Teachers were coloured initials; courses were plain colour cards | A real portrait of each of the eight teachers (cards, bios, course pages) a real street scene for each of the eight languages, and on the About page two real class photographs plus a real OpenStreetMap map of Gower Mews with a photo of the mews |

**Checked:** every portrait was inspected so the whole face is in frame, brand names and readable logos were avoided, and the automated sweep (360, 768 and 1280 px) is clean on all 43 pages of the three sites.

**Known limits:** all photographs are free stock (Pexels, listed in each day's README) standing in for fictional people, businesses and places. The Day 43 map needs an internet connection.

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
