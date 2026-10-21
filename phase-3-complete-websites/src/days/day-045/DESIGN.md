# Lingua Lane · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **Gower Mews, a narrow lane of eight painted front doors**, becomes **one arched door shape** that holds every photograph, every button and every language.

*Competitor test:* another language school would not have a lane of doors. The school is named for it (Lingua + Lane), sits at 14 Gower Mews, and teaches exactly eight languages, so each language is a door.

## The live thing

**Knock on a door.** Pick any of the eight languages on the home page and its door opens: the photograph changes, and you see the greeting, the teacher, the class times and the two actions (see the course, book a free lesson). It works without JavaScript (all eight are listed) and on a phone.

## What it is not

- Not a centred hero with a highlighted word and two buttons.
- No eyebrow labels, no 01 / 02 / 03, no thin rules, no gradients, no shadows on things at rest, no emoji, no pills, no glass.
- No cream-and-terracotta, no violet. No oversized italic serif.
- No invented proof: no star ratings, no student quotes, no counts of students.
- No fade-and-rise on every section. One signature move (the shutter) and honest feedback on controls.

## Type

One family, **Switzer** (Fontshare, free licence, self-hosted in `src/assets/fonts/switzer/`).
Display: 600, tracking -0.04em, leading 0.95, sentence case. Text: 400, 500 for emphasis, leading 1.5.
Five steps only: small 13-14px, body 17-19px, lead 20-26px, head 32-64px, hero 52-109px.

## Colour (kept from the brand and the logo)

| Role | Value |
| --- | --- |
| Ground | `#f2f1f7` (a cool low-chroma lilac-white) |
| Ink | `#1b1030` |
| Accent (the hero door, primary buttons) | coral `#ff5a3c` |
| Second field | saffron `#ffb703` |
| Third field | deep teal `#0c6f6f` |
| The eight doors | each language's own colour from its course file |

## The motif: the door

An arch: a rectangle with a semicircular top (`border-radius: 999px 999px 0 0`).
- Hero: one coral door about 120vh tall, cropped by the viewport, with a saffron number plate "14", a letterbox and a knob. It enters once from the right.
- Photographs sit inside the arch (showcase plate, teacher bullets, inline thumbnails).
- Buttons have an arched top and a nearly square bottom.
- The footer builds the mark large: eight doors in the eight language colours, bottoms on one line, 4px apart, each a link to its course.

## First screen

Left: the headline "Eight doors, one lane." (two lines, 6.4vw), one sentence, one primary button ("Try a free lesson") and a plain text link. Right: the giant door. On a phone the door moves to the bottom, 130vw wide, and the text sits above it.

## Page, in order (each section has a claim)

1. **Hero** – this is a language school on a lane of eight doors. Proof: the doors.
2. **Statement** – you speak from the first minute. Proof: small groups, ten weeks, A1 to B2.
3. **The eight doors** (live thing) – eight languages, each with a teacher and times. Proof: the real course data.
4. **How a course runs** – find your level, try a lesson, ten weeks, keep going. Horizontal accordion of tinted panels.
5. **Your teachers** – eight named teachers. Two-column list with arched photo bullets.
6. **Questions** – the real answers, filed as index cards.
7. **Book a free lesson** – one action tile.
8. **Footer** – the eight doors, built large.

## Motion

- **Signature:** the showcase photograph opens from the top edge (a clip-path shutter, about 1.1s) while the picture settles from 1.12 scale.
- The hero door slides in from the right once, about 0.9s.
- Controls: press scales to 0.97; hover changes colour only.
- Everything respects `prefers-reduced-motion`.

## Rules for the build

- Headlines are two lines or fewer at every width. One `h1`. Every section has a heading.
- Body text 16px or more; nothing under 13px.
- One button shape, one corner radius (28px on tiles), one pair of page margins.
- At least four real photographs on the page (there are twenty available: eight streets, eight teachers).
- Checked at 360, 768, 1024, 1280 and 1536px in a real browser, then with Impeccable's detector.

## Replaced by this redesign

The rotating "hello" footer and the old hero (centred headline with a highlighted word) are gone. The level test, the free-trial booking and the syllabus stepper stay, restyled by the same tokens.
