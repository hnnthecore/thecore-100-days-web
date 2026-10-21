# Day 042 · Complete website: “Atelier Nord”

A small architecture studio in Edinburgh (fictional), as a **complete 18-page website**: home, a filterable portfolio of case studies, a journal of long-form articles, a studio page and a project enquiry with a live estimator. It's the second Phase 3 site and the first one with long reading and a proper portfolio.

**Open it:** `phase-3-complete-websites/site/day-042-architecture/index.html`

The look is calm Nordic precision: birch white and ink with fjord blue, one amber accent, hairline rules, **Schibsted Grotesk** for the interface and **Newsreader** for anything you read at length. Every building is an **elevation drawing made in code**; on the home page the outline draws itself like a pen.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | A hero with a self-drawing elevation, key numbers, four featured projects, three beliefs, the latest journal entries and a call to action |
| **Projects** | `/projects/` | Eight projects from the `projects` collection, filterable by type, with a **grid / list** switch. The chosen type is kept in the URL hash |
| **Case studies ×8** | `/projects/<slug>/` | A drawing, a facts strip (location, year, area, client, status, type), materials, headline numbers, and the story in Markdown (brief, approach, outcome), then previous / next project and related work |
| **Journal** | `/journal/` | Five articles from the `journal` collection, with category filters and live search |
| **Articles ×5** | `/journal/<slug>/` | Long-form reading: a **progress bar**, a **contents list that follows you** (built from the article's headings and highlighting where you are), reading time and a copy-link button |
| **Studio** | `/studio/` | The story, five team members, the five-step process, awards and open roles in an accordion |
| **Contact** | `/contact/` | A project brief with a **live estimator** for build cost, architect's fee and timeline, a file picker that validates type and size, and a validated form |

## What it demonstrates

- **Two content collections with typed schemas.** Projects (Markdown + structured stats) and journal articles (Markdown) generate their own listing and detail pages. Heading anchors for the contents list come from the Markdown itself.
- **Progressive enhancement.** All pages are full HTML at build time. JavaScript only adds filtering, the grid / list switch, scroll behaviour and the estimator.
- **Estimator logic.** Build cost is area × a rate per project type (±12%), the fee is a percentage of that depending on ambition (9%, 11% or 13%, ±10%) and the timeline grows with the square root of the area. Presented as ranges and labelled “indicative”.
- **Shared shell and relative links.** One header, footer and mobile menu serve every page. Links are written as root paths and rewritten to relative ones after the build, and the scripts are bundled so the site opens straight from a folder.

## Accessibility

- Skip link, one `h1` per page, breadcrumbs and `aria-current="page"` navigation.
- The mobile menu is a button with `aria-expanded`, closes on Esc and on link click.
- Filters, view toggles and quality options use `aria-pressed` or real radios. The count and the estimate are live regions.
- The article's contents list is a real `<nav>` with in-page links, and the progress bar is decorative.
- Files can be removed with labelled buttons, and unsupported files are explained in text.
- “Reduce motion” stops the drawing animation, card entrances and hover zooms.

## Notes

Atelier Nord is a fictional practice. Projects, clients and people are invented. The form is a demo: nothing is sent and files never leave the browser.

## Photography

The photo band below the hero uses real photographs from Pexels (free to use, no attribution required), stored in `src/assets/day-042/` and converted to WebP at build time. The project elevation drawings stay because they are architectural drawings of the fictional projects, not photographs.

| Use | Pexels photo |
| --- | --- |
| Quiet, low-carbon homes | https://www.pexels.com/photo/33050276/ |
| Built to last | https://www.pexels.com/photo/19516616/ |
| Light by design | https://www.pexels.com/photo/16631149/ |

### Project photos

Project cards, project pages and the home hero now show real photographs from Pexels (free to use) in place of the elevation drawings. They are mood-matched stand-ins for the fictional projects (the sauna is an interior, the skerry house is a Scottish coastline). Pexels IDs: birch-court-primary-school 8926848, harbour-sauna 39237322, hollow-tower 37205749, house-on-the-skerry 28379500, lanark-courtyard-houses 4947117, orchard-pavilion 7082446, tide-mill-studios 37583472, ullapool-library-and-archive 40005497.

### Navigation redesign

The header is now a boxed bar with a heavy rule and squared tabs, and the home page sections follow a different order from the other days.

### Home hero redesign

The first screen is a giant full-bleed project photograph with the headline set over it and the key numbers on a black bar. The page opens with recent projects, then the photo band, how we work, the journal and the contact call to action.

### Team portraits

The five directors and leads on the Studio page now show real portrait photographs from Pexels (free to use, no attribution required): Elin 31646744, Callum 3855643, Maya 31307734, Jonas 3779508, Priyanka 29811345. They are stock stand-ins for the fictional staff; replace them with real photos of the team before launch.

## Redesign: the elevation

Rebuilt from `DESIGN.md` (Taste Skill direction "street elevation"). The home page is no longer a hero photo plus a card grid. It is one long architectural elevation: the studio's eight buildings stand shoulder to shoulder on a ground line with a metre ruler, each with a blue dimension line giving its floor area, and the page walks you along them.

- **Files:** `DESIGN.md` (the brief), `walk.css` (tokens, header, inner-page overrides and the home), `walk.ts` (the walk, the metre counter, the register preview), `pages/day-042-architecture/index.astro`, `components/day-042/Shell.astro` (plain header, title-block footer, scripts).
- **The live thing:** on screens 900px and wider (and when the visitor has not asked for reduced motion) vertical scroll is turned into a sideways walk along the strip. A readout counts the metres and names the building you are in front of; arrow buttons step building by building. Below 900px, or with reduced motion, it is a normal sideways swipe with snapping.
- **Type:** Archivo (width axis) for lettering, Source Serif 4 for reading. No monospace.
- **Colour:** cold concrete `#dde3e6` and ink `#101417`, with dimension blue `#1c4f9c` only on dimension lines and the current link. The old amber is gone.
- **Home, in order:** the elevation, "The site decides." with three notes, the register of all projects (hover shows the photograph), four numbers drawn as dimensions, the journal, and a huge "Start a project" line above the title-block footer.
- **Inner pages** keep their markup and follow the new tokens: flat concrete page heads, flat tiles, no amber.
- **Logo:** the survey needle mark was recoloured to the new palette (`scripts/make-brand.mjs`).

### Checks run
Taste Skill source linter 0 fail / 0 warn; browser inspector (1440 / 768 / 390) with the remaining notes being the reduced-motion environment, the sideways strip by design and no video; overflow and contrast sweep of all 19 pages at five widths, clean.
