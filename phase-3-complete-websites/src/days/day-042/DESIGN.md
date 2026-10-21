# Atelier Nord · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **the studio's eight buildings**, become **one continuous street elevation: the photographs stand shoulder to shoulder on a ground line, and the page walks you along them as you scroll**.

*Competitor test:* a generic architecture studio site opens with one full-bleed hero photograph and a grid of project cards. This one has no hero photograph and no cards. It is a single long elevation, drawn the way an architect draws a street, with a ruler on the ground and a running dimension counting the metres as you pass each building.

## The live thing

**Walk the elevation.** Vertical scroll drives the strip sideways (pinned on desktop). A readout in the title block counts the metres walked and names the building you are standing in front of (name, place, year, area). On phones and with reduced motion it is a normal sideways swipe with snapping. Click a building to open its case study. Works without JavaScript as a native sideways scroll.

## What it is not

- Not a full-bleed hero photo with a headline over it and a dark gradient.
- Not a grid of rounded project cards. Not a row of four stat tiles. Not three numbered beliefs.
- No eyebrow labels, no 01 / 02 / 03, no gradients, no shadows at rest, no emoji, no cream-and-terracotta, no amber.
- No invented awards or numbers that are not already in the content.

## Type

Two families, each with a job.

- **Archivo** (width axis): the drawing-sheet lettering. Display and wordmark at wdth 112, 800, tight tracking; interface at wdth 100.
- **Source Serif 4**: anything read at length (journal, case studies, ledes).
- **Archivo, tabular figures**: dimensions, the metre counter and title-block cells, at 13px minimum. (No monospace: the house rules keep it for literal code.)

Steps: small 13px, body 17px, lead 21px, head 32-56px, wordmark and "Start a project" line about 9vw.

## Colour (dealt, and right for the studio)

| Role | Value |
| --- | --- |
| Ground | `#dde3e6` cold concrete paper |
| Surface | `#cfd7db` |
| Ink | `#101417` |
| Soft ink | `#47525a` |
| Dimension blue | `#1c4f9c`, only for dimension lines, the current link and the metre counter |
| Paper (cards, form fields) | `#f2f5f6` |

Photographs are shown as they are. No tint, no overlay.

## First screen

A plain bar (wordmark left, four links right). Under it, on the cold ground, **Atelier Nord** at display size and a single plain line. The lower 60% of the viewport is the elevation: the photographs stand on a thick ink ground line carrying a metre ruler. The next building is already cut by the right edge so the visitor knows to scroll. The title-block readout sits bottom left.

## Page, in order

1. **The elevation** (hero, pinned horizontal scroll through all eight projects).
2. **How we work** – a sticky large sentence on the left, three paragraphs on the right, written as notes on a drawing.
3. **The register** – all eight projects as large rows (title, place, type, year, area); hover or focus shows its photograph in a sticky pane.
4. **In numbers** – four dimensions drawn as dimension lines with end ticks (64 projects, 21 awards and shortlists, 72% energy saving, 15 years).
5. **Journal** – the latest three articles, one large with a serif excerpt, two smaller.
6. **Start a project** – one huge line as a link, with the studio address.
7. **Footer** – the drawing title block, solid ink cells.

## Inner pages

Keep their markup and structure. They follow the same tokens, type and header, with a flat concrete page head (no amber bar), left-aligned display titles, flat square tiles.
