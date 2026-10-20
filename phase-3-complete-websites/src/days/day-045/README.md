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
