# Solstice Sound · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **a three-day music festival**, becomes **the festival as a clock face: one big dial of the day where every act is an arc on the ring of its stage, so a visitor sees the whole weekend, and what clashes with what, in a single glance**.

*Competitor test:* every festival site opens with a neon gradient, a countdown and a wall of band logos. This one opens with the programme itself. Pick Friday, Saturday or Sunday, press an act on the dial, and its time, stage and a button to add it to your plan appear in the middle.

## The live thing

**The dial.** Three concentric rings, one per stage (Sunset outside, Forest, Dome inside). Time runs round the circle from 14:00 at the top to 02:00. Each act is an arc on its stage's ring, sized by its set length. Day tabs switch the dial. Hover, focus or tap an act and the centre shows the name, time, genre and an Add to my plan button. Acts already in the plan are filled; the rest are outlined. Works by keyboard (each arc is a button). Without JavaScript the three days are listed underneath as plain text.

## What it is not

- Not a purple-to-pink sunset gradient, a neon glow, a countdown card strip or a marquee of band names.
- Not rounded floating cards. No eyebrow labels, no 01 / 02 / 03, no gradients, no shadows at rest, no emoji, no monospace.
- No invented crowd numbers or sold-out claims.

## Type

- **Syne** (extra bold, uppercase only for the wordmark and the day names): headings and the big numerals.
- **Albert Sans**: body and interface.

Steps: small 13px, body 17px, lead 20px, head 32-64px, hero 72-150px.

## Colour

Ink-navy night with the colours of a solstice sky.

| Token | Value | Use |
|---|---|---|
| night | #0b1530 | page |
| night-2 | #12204a | raised bands |
| night-3 | #1b2d63 | controls, hover |
| sun | #ffd84a | the sun, focus, primary highlights |
| vermilion | #ff5a3c | main button, today marker |
| amber | #ffa62b | Sunset stage |
| sky | #8fd3ff | links, Dome stage |
| leaf | #5fd6a0 | Forest stage |
| text | #f1f4f9 | text |
| muted | #b3bddb | secondary text |

No purple, no pink. Solid fills only.

## Layout

- Home: hero with the wordmark and the dial side by side (stacked on phones), the headline acts as plain large type sized by billing, the three stages with photographs, the light times for each day (computed sunrise and sunset), tickets, getting here.
- Inner pages keep their existing structure (line-up, schedule with clash detection, tickets with checkout, info, getting here, twelve artist pages) and take the new tokens.

## Brand

Mark: a sun on a horizon line, drawn as a half-disc over two bars. Favicon is the same mark on ink.

## Motion

Arcs draw in on load; the centre text cross-fades; Lenis smooth scroll. Everything respects prefers-reduced-motion.
