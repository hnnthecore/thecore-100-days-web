# Day 045 · Complete website: “Lingua Lane”

A language school in London (fictional), as a **complete 14-page website**: eight languages, a free level test, teachers, a live-priced enrolment flow and an about page with FAQ and contact form.

**Open it:** `phase-3-complete-websites/site/day-045-language-school/index.html`

The look is warm, playful and cosmopolitan: plum-black ink on warm cream with coral, saffron and teal, hard offset shadows and speech-bubble shapes. **Young Serif** for headlines and **Figtree** for everything else. Every language has its own colour and greeting.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | Hero of floating greetings, eight language cards, how it works, teachers, a testimonial band and an enrol call to action; a scrolling "hello" ribbon sits above every footer |
| **Courses** | `/courses/` | Eight courses from the `courses` collection with **live search** and a daytime / evening / weekend filter |
| **Course ×8** | `/courses/<slug>/` | A page tinted in the language's colour, highlights, the teacher, class times and four levels with Enrol links that pre-fill the enrol form |
| **Level test** | `/level-test/` | Six questions in Spanish, French or German, instant right / wrong feedback, a CEFR level (A1 to B2) and an Enrol link at that level |
| **Teachers** | `/teachers/` | Eight teachers from the `teachers` collection, filterable by language, with each bio in a native `<dialog>` |
| **Enrol** | `/enrol/` | Two-step form with a **live price** (group or private, course pack, promo code `LINGUA10`), next four start Mondays, validation and a confirmation |
| **About** | `/about/` | Values, FAQ accordion and a validated contact form |

## Things worth reading in the code

- `quiz.ts` holds the questions as plain data, and `quiz-page.ts` runs them one at a time.
- `enrol.ts` reads `?course=` and `?level=` from the URL so the course pages and the level test can send visitors straight to a filled-in form.
- Course and teacher pages are generated from Markdown, so adding a language is adding a file.
- Forms use the shared `wire()` helper. They are demos: nothing is sent or charged.

## Photography

The photo band under the hero uses real photographs from Pexels (free to use, no attribution required), stored in `src/assets/day-045/` and converted to WebP at build time. The coloured course tiles stay as brand elements.

| Use | Pexels photo |
| --- | --- |
| Small classes, real conversation | https://www.pexels.com/photo/6503155/ |
| Taught by native speakers | https://www.pexels.com/photo/8423049/ |

### Navigation redesign

The header is now a capsule menu, and the home page sections follow a different order from the other days.

### Home hero redesign

The first screen is one huge greeting that cycles through six languages (pure CSS; reduced-motion users see the first one). The page opens with the level test and a student quote, then courses, the photo band, how it works and teachers.

### Real photography

Every teacher has a real portrait (Pexels, free to use): Ana 30557590, Camille 3791554, Giulia 15069656, Jonas 20293949, Marta 10924574, Omar 7129611, Wei 19802254, Yuki 18962988. Every language has a real street scene for its card and course page: Spanish 14366474 (Madrid), French 32796689 (Montmartre), German 37468367 (Berlin), Italian 20386742 (Rome), Japanese 32005301 (Tokyo), Mandarin 36931913 (Beijing), Portuguese 20197709 (Lisbon), Arabic 40044202 (calligraphy). The photos are stand-ins for the fictional teachers.

### About page photography

The About page now opens with two real photographs from Pexels (free to use): a relaxed adult class (5940846) and two friends practising over coffee (8640103). The contact section has a real OpenStreetMap map of Gower Mews, Bloomsbury, with a photograph of a London mews (30683467). The street is real, the school is fictional.

### Second round: deeper structure

- **Flip tiles** on Courses: each language flips (button, not hover, so it works on touch and keyboard) to show its A1 to B2 level path. Escape flips back.
- **Syllabus stepper** on every course page: A1, A2, B1, B2 with ten weekly outcomes each and an "Enrol at this level" button. `?level=B1` opens that step.
- **Rotating hello** footer: one big greeting at a time in all eight languages with pronunciation; pauses on hover and focus and does not auto-rotate with reduced motion.
- **Free trial lesson** (new page `/trial/`): choose a language, pick a taster slot (generated from the real class times, some shown full), leave details, then download a calendar file. It is a demo, nothing is sent.
- The level test stays as the signature moment.

## Redesign (pilot for the new design direction)

Rebuilt from `DESIGN.md`, using the Taste Skill's art direction ("One motif") and Impeccable's checks. Gower Mews is a lane of eight painted doors, so one arched door shape runs the whole site.

- **Files:** `DESIGN.md` (the brief), `door.css` (tokens and the door system, loaded after `styles.css`), `home.ts` (door picker, accordion, question cards), `components/day-045/Shell.astro` (plain bar header, footer of eight doors), `pages/day-045-language-school/index.astro`.
- **Type:** Switzer 400/500/600, self-hosted in `src/assets/fonts/switzer/` (Fontshare free licence).
- **Home:** giant coral door with a window onto the real lane; a statement with arched thumbnails; "Pick a door" (eight languages, photo shutter); a horizontal accordion for how a course runs; the teachers as an arched-photo list; question cards filed like index cards; one action tile; footer of eight doors.
- **Inner pages** keep their markup and follow the same tokens (see the second half of `door.css`).
- **Motion:** parts rise in as they arrive, the footer doors open, the hero door slides in, the photo opens with a shutter. All switched off under `prefers-reduced-motion`.

### Photographs and credits

- Hero window: "Gower Mews, Bloomsbury" by David Howard, CC BY-SA 2.0, via Wikimedia Commons (`src/assets/day-045/gower-mews.jpg`, credit recorded in `credits.json` and shown in the footer). Found with the Taste Skill's `assets.mjs`.
- Language streets and teacher portraits: Pexels, free to use (listed earlier in this file). The portraits stand in for fictional teachers.

### Checks run

- Taste Skill source linter: 0 fail, 0 warn.
- Taste Skill browser inspector at 1440, 768 and 390: the only open items are the motion check (this PC reports "reduce motion", so the checker cannot see animations; with reduced motion forced off the page runs 12 or more moving parts) and no video on the page.
- Overflow and contrast sweep at 360, 768, 1024, 1280 and 1536 px on all 15 pages.
