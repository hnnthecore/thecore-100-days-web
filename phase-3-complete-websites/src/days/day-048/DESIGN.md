# The Meridian · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **an independent online magazine**, becomes **a front page set by its readers: every story is a headline, and the size of the headline is how many people read it**, so the cover is a ranked typographic wall instead of a lead photo and a stack of cards.

*Competitor test:* every magazine site opens with one big photo, a serif headline, double rules and a cream "newsprint" background. This one opens with all twelve stories at once, the most-read set huge and the least-read small. A reader sees the whole issue and where the attention is in one glance.

## The live thing

**Read the room.** Under the wall: section buttons (All, Science, Culture, Cities, Food) and a sort (Most read, Newest). The wall reflows in place: other sections fade, the order and the sizes change. Move the pointer over any headline and its cover photograph follows the cursor (desktop); on touch the headline is simply a link. Saved stars work on every card. Without JavaScript the wall shows all twelve stories, most read first.

## What it is not

- Not a cream/newsprint page, double rules, a Bodoni masthead or a red "signal" subscribe button.
- Not a lead-photo-and-card-grid front page. No eyebrow labels, no 01 / 02 / 03, no hairlines, no gradients, no shadows at rest, no emoji, no monospace.
- No made-up subscriber numbers.

## Type

- **Bricolage Grotesque** (bold, tight): masthead, headlines, the wall.
- **Newsreader**: article text and standfirsts, for reading comfort.
- Interface text uses Bricolage Grotesque too, so the site has two typefaces.

Wall steps: smallest headline 1.6rem, largest 5.6rem, by reads. Body 18px, small 13px.

## Colour

A cool light page with ink, and one flat colour per section.

| Token | Value | Use |
|---|---|---|
| paper | #f3f4f6 | page |
| paper-2 | #e6e8ec | raised bands |
| ink | #0d0f12 | text, masthead, footer |
| muted | #565b66 | secondary text |
| Science | #0e9f7e | section |
| Culture | #6d4cf0 | section |
| Cities | #2563eb | section |
| Food | #e86a10 | section |
| lime | #d6f23b | the highlighter: saved, hover on the wall |

Section colours are flat blocks behind headlines and on tags. No gradient.

## Layout

- Masthead: one bar, wordmark left, sections and search in the middle, Saved and Subscribe right.
- Home: the wall, the controls, then one row of photo stories per section, a short about line, the newsletter.
- Inner pages (article ×12, four sections, writers, search, saved, subscribe) keep their structure and take the new tokens and type.

## Brand

Mark: a circle (the meridian) crossed by one vertical line, ink on lime. Favicon is the same on ink.

## Motion

The wall settles in on load (opacity and a small rise, staggered); filtering fades and re-sizes; the cover photo follows the pointer with a short ease. Lenis smooth scroll. Everything respects prefers-reduced-motion.
