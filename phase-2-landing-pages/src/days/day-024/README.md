# Day 024 · Construction company landing page: “Halden & Rowe”

A design & build contractor in London (fictional). The brief to myself: look like the firm architects *want* to work with. **Architectural and editorial**: stone white and charcoal, construction yellow used like a highlighter, blueprint blue for the estimator, **Space Grotesk** for technical clarity and **Instrument Serif** italics as “the architect's hand”.

**Open it:** `phase-2-landing-pages/site/day-024-construction/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero** | A nine-storey glass building rises floor by floor (isometric SVG), with a tower crane and a swaying load, over a blueprint grid. Stats include a **live “days since a lost-time injury”** count calculated from a date |
| 2 | **Sectors** | Residential / Commercial / Education / Heritage tabs, each with its own building drawing (brick, glass, timber, stone), capabilities and a headline number |
| 3 | **Projects** | Filterable portfolio on charcoal; every card opens a **native `<dialog>` case study** (value, area, programme, scope, client quote) |
| 4 | **Process** | Five stages from brief to aftercare; a vertical line fills and each stage lights up as you scroll |
| 5 | **Cost estimator** | Project type (each with its own sensible size range), floor area slider, specification and location give a cost range, rate per m², build time in weeks and a design / approvals / build split. “Turn this into a fixed quote” pre-fills the enquiry form |
| 6 | **Start a project** | Enquiry form with validation and drawing uploads (PDF/DWG/DXF/JPG/PNG, max 20 MB each, 8 files, drag & drop, removable), plus office details and accreditations |

## The isometric generator

`components/day-024/Iso.astro` turns `w × d × floors` and a material into an isometric building. Each floor is its own `<g>`, so CSS can make the building rise floor by floor. One component draws all eleven buildings on the page, and there isn't a single image file.

## Accessibility

- Case studies use the native `<dialog>` with `showModal()`, which gives a real modal: focus moves inside, Esc closes, and focus returns to the card. Clicking the backdrop also closes it.
- Tabs follow the WAI-ARIA pattern; filters use `aria-pressed` with a live count.
- The estimator range has `aria-valuetext` (“200 square metres”), and the result region is live.
- The rising building, crane sway and reveal animations switch off with “reduce motion”.

## Notes

Fictional business: projects, clients, quotes and figures are demo content. Estimates are illustrative, and no enquiry is sent.
