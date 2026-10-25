# Stillwater · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **a yoga and pilates studio**, becomes **a place that lets you breathe before it asks you for anything**: the first screen is a slow breathing pacer you can use for one minute, and beside it, plainly, what is on at the studio today and how many spaces are left.

*Competitor test:* every studio site opens with a dim photograph of women in prayer pose, a floating pill nav, an italic serif and "Make space to breathe". This one does the thing it promises. A visitor can breathe for a minute, and then book, with today's classes already in front of them.

## The live thing

**One minute.** A large soft disc grows over four seconds ("Breathe in") and settles over six ("Breathe out"), with a count of the minute left. "Breathe for a minute" starts and stops it; at the end the page says so and offers the next class. Beside it, "Today at Stillwater" lists the classes still to come today (or tomorrow's, once today is over) with the time, class, room and spaces left; each links to the timetable filtered to that class. With reduced motion the disc does not move; the words still change. Without JavaScript the breathing area is a short instruction and the list is a link to the timetable.

## What it is not

- Not a darkened full-bleed photo with an italic serif, a floating pill nav, terracotta buttons or cream paper.
- No eyebrow labels, no 01 / 02 / 03, no hairlines, no gradients, no shadows at rest, no emoji, no monospace, no lotus or flower glyphs.
- No invented member counts.

## Type

- **Outfit** (light to medium, tight): headlines and times. Lowercase feels, never shouted.
- **Hanken Grotesk**: everything else.

Steps: small 13px, body 17px, lead 20px, head 36-64px, hero 52-88px. Times use tabular numerals.

## Colour

The colours of still water and early light.

| Token | Value | Use |
|---|---|---|
| mist | #f2f7f7 | page |
| mist-2 | #e0ecee | surfaces |
| mist-3 | #cadfe2 | hover, raised |
| ink | #0c2a31 | text, footer |
| muted | #46606a | secondary text |
| water | #0b6f7c | links, focus, the "in" half of the breath |
| sun | #f2c46d | the breathing disc, buttons, today |
| sun-soft | #fbe9bf | selected states |
| gold-text | #7a5a10 | gold used as text on light |

## Layout

- Masthead: one plain bar.
- Home: the pacer and today's classes, four classes with photographs, a photo band, what a first class is like (before, during, after), the four teachers with portraits, one quote, the half-price first class.
- Inner pages (eight classes, the timetable with booking and My classes, teachers, pricing with its estimator, find-my-class quiz) keep their structure and take the new tokens.

## Brand

Mark: three ripples, the middle one filled with sun. Favicon is the same on ink.

## Motion

The disc breathes (transform only); the label crossfades with the phase; sections rise as they arrive; Lenis smooth scroll. Everything respects prefers-reduced-motion.
