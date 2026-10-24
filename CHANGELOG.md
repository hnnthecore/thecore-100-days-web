# Changelog

A short record of what changed on each day, how it was tested and what is still open. Newest first.

## Day 51 · Hirewell redesigned as a chart of pay

- **Idea:** the home page is a salary chart. Every role is a bar from its lowest to its highest pay on one shared scale, and a slider moves an orange "I need at least" line across it: bars are cut at the line, roles that cannot reach it fade and a sentence keeps count. Category buttons filter and one button reorders (top pay or newest). The day-rate contract role sits below with its yearly equivalent worked out.
- **Look:** the dark green hero with a search box, stats counter, mint chips and lime highlighter are gone. Cobalt on cool white, ink type and one orange; Schibsted Grotesk and Public Sans; flat-edged buttons; no gradients, shadows or emoji.
- **Also:** a plain single-bar masthead, three plain-spoken promises, the five hiring companies with their workplace photographs, drawn star icons, a real footer address, logo (two pay bars with an orange tick) and favicon set, DESIGN.md. Fixed the Tailwind class clash that squeezed form fields.
- **Checked:** source linter clean; sweep of all 22 pages at 360, 768 and 1280 px with no findings; dragging the line, the category filter and the sort were tested in a real browser.

## Day 50 · Citrus & Salt redesigned as a weekly dinner planner

- **Idea:** the home page is the week itself. Seven dinner slots; pick a recipe for each night or fill the gaps with quick ones. The summary shows dinners, total cooking time and things to buy, and one button merges the whole week into the shopping list. New visitors start with a sample week.
- **Look:** the lemon-yellow hero, sticker shadows, tilted photo collage, DM Serif and tomato red are gone. Sea salt, slate and a single lemon; Archivo and Karla; flat-edged buttons instead of pills; no gradients, shadows or emoji.
- **Also:** a plain single-bar masthead, photo-first recipe cards, drawn hearts, logo (a lemon slice) and favicon set, DESIGN.md.
- **Also fixed (Day 49):** the membership card was stretched far too tall and ran over the footer; it now sits inside its column.

## Day 49 · Brightside Dental redesigned around "What's bothering you?"

- **Idea:** the home page opens with the patient's worry. Seven choices (pain, nerves, cost, a nicer smile, a child, a missing tooth, a check-up) each give a plain answer, the treatment's price and time, and a Book button that already knows what for. The choice is kept in the address.
- **Look:** the aqua and coral template, Fraunces serif, floating pill nav, stats strip and booking card over the photo are gone. White page, ink-blue type, pale blue surfaces and one gum pink; Sora and Figtree; flat colour only.
- **Also:** a plain price table of every treatment, the first visit minute by minute, a single-bar masthead, drawn tick marks (no emoji), logo (a tooth with a smile line) and favicon set, DESIGN.md.

## Day 48 · The Meridian redesigned as a wall of headlines sized by readership

- **Idea:** the front page set by its readers. Every story is a headline and the headline is as large as it is read. Section buttons filter, Most read / Newest reorders, and on desktop the cover photo follows the pointer.
- **Look:** the cream newsprint, Bodoni masthead, double rules and red button are gone. Cool light page, ink, one flat colour per section and a lime highlighter; Bricolage Grotesque and Newsreader; no gradients, shadows or hairlines.
- **Also:** a single-bar masthead, section tags moved into each story's byline, star icons drawn as SVG (no emoji), a real footer address, logo and favicon set, DESIGN.md.
- **Checked:** source linter clean; sweep of all 21 pages at 360, 768 and 1280 px with no findings.

## Day 47 · Solstice Sound redesigned around a dial of the programme

- **Idea:** the festival as a clock face. A big dial on the home page: three rings (Sunset, Forest, Dome), 16:00 to 23:00 round the circle, every act an arc. Day tabs, press an act to see its time and add it to your plan; keyboard works.
- **Look:** the synthwave sunset, countdown and marquee are gone. Ink-navy with sun yellow, vermilion, amber, sky and leaf; Syne and Albert Sans; flat colour only. Headliners are set as large type; real sunrise and sunset times for each day.
- **Also:** logo (a sun on the horizon) and favicon set, new footer, DESIGN.md, flat-colour cleanup of the old stylesheet.
- **Checked:** source linter clean; sweep of all 18 pages at 360, 768 and 1280 px with no findings.

## Day 46 · Wildcombe Herbal: a herbal e-commerce template (new)

A new Day 46: an online herb shop built as a template for the client's e-commerce work. The sites that were Days 46 to 59 moved up to 47 to 60 (the Phase 3 showcase is now Day 60), and the plant shop was dropped because it was too close to this one.

- **Idea:** the catalogue as a herbarium. Every product is a public-domain botanical plate (Köhler's Medizinal-Pflanzen, 1887, and other herbals) printed onto its herb's own colour, with its Latin name. No sage green, no cream, no white-background packshots.
- **Home:** a pinned poster where the brand name holds its place while six plates pass beneath it; "What do you fancy a cup of?", a chooser by hour and taste that brings matching plates forward; the farm; a brewing table; the tea club; the journal.
- **Shop:** 14 products in 5 collections. Filter by kind, hour and taste, sort by price or name; the choice lives in the address. Product pages have a plate, a drawn pack, sizes, live price, quantity and an accordion of details.
- **Basket and checkout:** a slide-in basket from every page, a free-delivery bar (over £35), promo code WILD10, a three-part checkout with card, expiry, security code and UK postcode checks, and a confirmation.
- **Also:** tea club sign-up, four journal notes, about (with every plate and picture credited), shipping and returns, questions, contact, a logo and favicon set.
- **Type and colour:** Fraunces and Instrument Sans; ink, paper and twelve herb colours.
- **Checked:** source linter clean; sweep of all 33 pages at 360, 768 and 1280 px with no overflow, broken images, missing alt text or low contrast; the basket, promo, checkout and tea-club flows tested end to end. Product photography is still needed (the drawn packs stand in).

## Days 21–45 · Smooth scrolling, Day 42 arrows, Day 44 rebuilt, genuine footers

Feedback from the client after the Days 41–45 review.

- **Lenis smooth scrolling** on every landing page and website (the Lenis library, loaded once from a shared script). It is switched off for visitors who set reduced motion in their system, and dialogs, menus and the basket drawer keep normal scrolling inside them.
- **Day 42 arrows fixed:** Next and Previous now step building by building from wherever you are. Before, the first press barely moved and the readout could name a different building from the one on screen. The metre counter and the name now agree.
- **Genuine footers:** removed every line saying a site is a fictional project made for the 100 Days of Web, every "Demo only: nothing was sent" note, the "(demo)" labels and the demo sentences in confirmation messages, and the project tail from each page's search description. Safety notes that matter (call 999, call a vet, check entry rules, finance subject to status) stay. The small Day number badge that links back to the project list is still there.
- **Day 44 Fathom rebuilt below the hero:** the live forecast hero stays. "Thirteen weeks, one scroll" is new: the section pins and scrolling draws the 13 weeks, with the invoice, payroll, hire and warning appearing as you pass them. "What Fathom does" now shows six real product screens built in code (forecast, scenarios, invoice chasing with a drafted reminder, an alert, a report, a team list) instead of stock photographs.

## Days 21–40 · Real logos and favicons for every landing page

The same client feedback as Days 41–45: no emoji tab icons, and a real logo on every page. Each of the 20 landing pages now has its own mark and favicon set.

- **Marks:** drawn one by one on a 32 × 32 grid, each from the business itself and in its own palette: a sun with alternating rays (Sol y Sal), an oven mouth with its flame (Forno Rosso), a hex nut cut by an N (Northgate), an H whose crossbar is a beam (Halden & Rowe), two road-marking chevrons (Pace), a salon-mirror arch with the evening star (Atelier Vesper), a brilliant-cut stone (Maison Aurelle), isometric layers (Stackwell), a half-solid shield (Ironveil), a doubled slash (Rival AC), cattails and a low sun (The Saltmarsh), a lemon slice cut like a weave (Lemon & Linen), a bolt with its spark (Voltline), a copper pipe bend with flanges (Copperline), a peak with one red stripe (Apex), a house and its lane (Latch & Lane), a paw with a medical cross (Pawprint), a bean whose crease is a flame (Ember & Oak), a W trail ending on a pin (Wayfarer) and a lens aperture (Halide & Co.).
- **Different kinds of logo:** roundels, a shield, an arch, a hard square, a single glyph, a tile. The old marks were mostly the same rounded tile with a glyph in it.
- **Favicons:** an SVG for tabs, a 32 px PNG, a multi-size .ico, a 180 px Apple touch icon and a 512 px icon per page, in public/<page>/. The emoji icons are gone (they stay only as a fallback in the layout).
- **In the pages:** the mark now sits beside each page's live wordmark in the header and the footer (on dark headers and footers the mark uses its tile version so it stays visible).
- **How to change one:** edit its entry in phase-2-landing-pages/scripts/make-brand.mjs and run node scripts/make-brand.mjs; it also writes a proof sheet at public/_brand-review.png.
- **Tested:** all 20 pages at 390 and 1280 px, opened from disk: no overflow, no broken images, four icon links and a logo in header and footer on every page.

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

## Days 46–60 · Uniqueness pass (in progress)

Each site gets real photography, then its own collection layout, detail layout, footer, signature moment and a page no other site has (see UNIQUENESS-MATRIX.md).

### Day 46 · Solstice Sound (festival)
- **Photography:** a real photograph for each of the 12 acts, the three stages, camping, shuttle, food and wristbands. The drawn posters are gone.
- **Line-up:** a typographic festival poster is the default view (names sized by billing, a photo appears on hover or focus), with a Cards view for starring acts.
- **Artist pages:** a set-time bar shows where the act sits across the three stages and warns when it overlaps an act in your plan.
- **Footer:** a perforated ticket stub with a tear-off and a Get tickets button.
- **New page:** Getting here and camping, with routes compared in a table, a camping planner, a packing list that remembers what you have packed and a real map.
- **Fixed:** a starred act in the schedule showed a dark star on a dark button.
- **Tested:** all 18 pages are clean at 360, 768, 1024, 1280 and 1536 px.

## Days 43–45 · No drawn or sample images left

**Why:** the client asked for real photographs instead of drawn or sample pictures. Every drawn illustration on these three sites is now a real photograph.

| Day | What was drawn | Now |
| --- | --- | --- |
| 43 Rootwork | Story cards had no picture; "More from the farm" and the contact map were drawn; the volunteer quote had no face | A real photo for each of the three stories (card, story page, "more stories"), a real portrait on the volunteer quote, programme photos in "More from the farm", a real OpenStreetMap map of Chorlton with a photo of the allotment gate, and real portraits of the four team members on the About page |
| 44 Fathom | Feature pages showed a drawn chart; customers were letter tiles | One real photograph for each of the six features, a real photograph of each customer's business, and a real portrait of each person quoted. The hero dashboard and the live what-if demo stay as real interactive interface, not pictures |
| 45 Lingua Lane | Teachers were coloured initials; courses were plain colour cards | A real portrait of each of the eight teachers (cards, bios, course pages) a real street scene for each of the eight languages, and on the About page two real class photographs plus a real OpenStreetMap map of Gower Mews with a photo of the mews |

**Checked:** every portrait was inspected so the whole face is in frame, brand names and readable logos were avoided, and the automated sweep (360, 768 and 1280 px) is clean on all 43 pages of the three sites.

**Known limits:** all photographs are free stock (Pexels, listed in each day's README) standing in for fictional people, businesses and places. The Day 43 map needs an internet connection.

## Days 41–50 · Distinct home pages for Phase 3

**Why:** the same client feedback as Days 21–40, now for the first ten complete websites. Only the **home page** of each site is redesigned in this step. All 167 built pages of these ten sites were also put through the automated sweep (see below); every inner page now also has its own page header per site (see below); the page bodies keep their layouts.

| Day | Site | First screen | Navigation | Opens with | Photography |
| --- | --- | --- | --- | --- | --- |
| 41 | Pagebound Books | Centred headline over a wooden shelf of standing book covers | Split masthead, logo centred | Bookseller's pick | Shelf band (3 photos); all 12 book covers are now real photographs with live title and author type |
| 42 | Atelier Nord (architecture) | Giant full-bleed project photograph, headline set over it, stats on a black bar | Boxed bar, heavy rule | Recent projects | Project photos on the hero, cards and pages |
| 43 | Rootwork (community farm) | Collage of four rounded photographs around a centred headline | Floating pill | Programmes | Hero collage and programme photos |
| 44 | Fathom (SaaS) | Centred headline with the dashboard as a wide stage beneath | Inverted dark bar, mint rule | Live "what if" demo | None (the dashboard and charts are the product) |
| 45 | Lingua Lane (language school) | One huge greeting that cycles through the languages | Capsule menu | Level test and student quote | Classroom band |
| 46 | Solstice Sound (festival) | Sunset hero kept; the countdown is now a perforated ticket | Bottom dock on desktop | Line-up | Crowd, stage and tent band |
| 47 | The Meridian (magazine) | Lead story as a full-width cover with the next two stories in a row | Centred masthead with a double rule | Lead story | Story photos |
| 48 | Brightside Dental | Bright split hero with an online booking card laid over the photograph | Floating pill | Book online | Hero, child and patient photos |
| 49 | Citrus & Salt (recipes) | Overlapping, slightly tilted plate photographs beside the headline | File-style tabs | Quick recipes | Hero collage and recipe photos |
| 50 | Hirewell (job board) | Dark, search-first stage with a very large search bar and three photographs of people at work | Boxed bar, green rule | Job search | New: interview, colleagues and team photos |

**Inner-page headers (all ~157 inner pages):** 41 centred bookplate with a double rule; 42 dark band with an amber rule; 43 green band with a curved bottom; 44 dark gradient with glow; 45 lilac band with a colour-dash underline; 46 neon title over a sunset-gradient stripe; 47 oversized newspaper headline; 48 rounded aqua panel; 49 lemon band with a zigzag edge; 50 dark emerald band with a lime rule.

Also: sections reordered on Days 41, 42, 43, 44, 45, 46, 48 and 49 so the signature feature comes first and the call to action stays last. Days 47 and 50 already opened with their signature piece.

**Fixed along the way**
- Day 41: the events section was dark red on dark red (an old position-based rule had stayed attached to the wrong section after the photo band was added). The rule now targets the newsletter section by its class.
- Days 43–49: the position-based contrast rules written earlier were removed because they break when sections move. Their fixes now live in each day's stylesheet (Days 44, 45, 48, 49), and the sweep confirms the result.
- Day 49: recipe cards inside the navy band had white text on white; the tomato accents on lemon, the sticker and the list counter were raised to AA.
- Day 41: the drawn book covers are replaced by real photographs (a mood-matched Pexels photo per book, cropped to 2:3, with a hinge and page edge and the title and author as live text) on the shelf, front table, bookseller's pick, catalogue, detail pages, related books and basket.
- Day 47: the lead cover image is a fixed-height full-width band so the headline shows on the first screen.
- Inner pages: pricing ticks (Day 44), the format price line (Day 45), membership prices (Day 48) and the headline accent on the About, Recipes and Shopping-list pages (Day 49) were below AA contrast and are fixed.

**How it was tested**
- The automated sweep at 360, 768, 1024, 1280 and 1536 px on all ten home pages: overflow, off-screen elements, clipped text, broken images, alt text, duplicate ids, one heading per page, contrast.
- The sweep at 360 and 1280 px on all 167 built pages of Days 41–50 (home, listings, detail pages, forms): six pages needed contrast fixes, now clean, re-checked at all five widths.
- Menu button opens and shows the links at 390 px on all ten sites, and the header has no overlap or wrapping at 800, 1024 and 1280 px.
- Visual check of the first screen of each page.

**Known limits and still open**
- Photographs are free stock (Pexels) and stand in for the fictional items. Day 50's people photos show no brand names or readable badges.
- Inner-page bodies (listings, detail pages, forms) still use each site's shared card and form styling; only their headers are redesigned.
- Lower sections still share card styling within each site.
- Not yet tested on real phones or in Safari, and no keyboard-focus pass on the new navigation bars.
- Nothing is pushed yet.

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
