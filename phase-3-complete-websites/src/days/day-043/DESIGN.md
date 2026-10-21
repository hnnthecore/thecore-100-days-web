# Rootwork · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **a community farm that is different every month**, becomes **a page that knows the date: the whole first screen is the current month's name at poster size, in that season's colour, with what is being picked right now**.

*Competitor test:* a generic charity site opens with a smiling-people collage, "Growing food, skills and friendship" and a Donate button. This one opens with "October", the colour of October, and the six things that are ready to be picked this week. A visitor learns what the farm is by what it is doing today.

## The live thing

**The month decides the page.** On load the page reads today's date, sets the month, the season colour and the crops in the ground. Twelve month buttons along the bottom scrub the year; the ground colour, the word, the crops and a one-line farm note change together. Without JavaScript it shows October (the build month) and every crop link still works.

## What it is not

- Not a collage of rounded photographs around a centred headline.
- Not pill buttons, pillow cards, soft shadows, floating pill navigation, blobs or hand-drawn scribbles.
- No eyebrow labels, no 01 / 02 / 03, no gradients, no shadows at rest, no emoji, no cream-and-terracotta.
- No invented testimonials beyond the Amina quote already in the content. No invented donation totals.

## Type

- **Bricolage Grotesque** (width axis down to 75%): the month at poster size (about 24vw, 800, tracking -0.05em), headings, interface.
- **Newsreader**: the volunteer quote, story excerpts and notes, in italic where it is a voice.

Steps: small 13px, body 17px, lead 21px, head 32-56px, the month 6-24vw.

## Colour (dealt by the season)

| Role | Value |
| --- | --- |
| Spring | `#c9e27a` fresh lime |
| Summer | `#f1de4b` sun yellow |
| Autumn | `#f4a63a` amber |
| Winter | `#c3d5df` frost |
| Ink | `#1b1611` soil-black |
| Soft ink | `#4a4036` |
| Page below the hero | `#f4f6f3` cool white |

Text is always ink on the season colour. The page ground below the first screen is neutral; colour returns in the four programme panels, one season each.

## First screen

A plain bar (wordmark left, links right, a Donate button) on the season ground. The h1 "Rootwork Community Farm" is small and sits top left with one line about the farm; the month fills the width beneath it. Under the month, the crops in season as upright photographs with their names, and the twelve-month scrubber along the bottom edge with today's month marked.

## Page, in order

1. **The month** (hero, scrubber).
2. **Four seasons, four programmes** – full-width bands, each in a season colour: title huge, tagline, when and who, one photograph.
3. **Come and dig** – the next volunteer shifts as a plain list (date, title, kind, spots left as a short bar) with one button.
4. **In numbers** – the four impact numbers at poster size on ink, counting up.
5. **From the farm** – Amina's quote with her photograph, then the three stories as an editorial list with small square photographs.
6. **Give** – the donation box on the page ground, a short paragraph beside it.
7. **Footer** – ink, one large sentence, links and address.

## Inner pages

Keep their markup. They follow the same tokens: rectangular buttons and inputs, flat tiles with no soft shadows, a flat season-coloured page head (left aligned) instead of the rounded green arch, a plain header bar instead of the floating pill.
