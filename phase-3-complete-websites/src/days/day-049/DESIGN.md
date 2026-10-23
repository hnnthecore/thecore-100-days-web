# Brightside Dental · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **a dental clinic**, becomes **a plain-spoken answer to the question people arrive with**: the first screen asks "What's bothering you?", and one tap gives the honest answer, the right treatment, what it costs, how long it takes and a Book button that already knows what for.

*Competitor test:* every dental site opens with a smiling stock photo, a teal gradient, "Gentle care for the whole family" and a booking form. This one opens with the patient's worry. A nervous patient taps "I'm nervous" and reads what actually happens to them, not a slogan.

## The live thing

**Tap what's bothering you.** Seven choices: my tooth hurts, I'm nervous, how much will it cost, I want a nicer smile, it's for my child, I'm missing a tooth, I just need a check-up. The panel beside them changes to a short plain answer, the treatment's price and duration, and two buttons: Book it (opens the booking flow with that treatment already chosen) and Read more. The last choice is remembered in the address (#nervous) so it can be shared. Without JavaScript all seven answers are listed.

## What it is not

- Not an aqua and coral template, a Fraunces serif, a floating pill nav, a stats strip or a booking form laid over the hero photograph.
- No eyebrow labels, no 01 / 02 / 03, no hairlines, no gradients, no shadows at rest, no emoji, no monospace.
- No clinical stock-icon grid as the main event.

## Type

- **Sora** (semibold, tight): headlines and prices.
- **Figtree**: everything else.

Steps: small 13px, body 17px, lead 20px, head 32-56px, hero 56-88px.

## Colour

A clean white page, ink-blue type, pale blue surfaces and one friendly pink taken from the thing a dentist actually works on.

| Token | Value | Use |
|---|---|---|
| paper | #fbfcfd | page |
| tint | #e5eefb | surfaces, panels |
| tint-2 | #d3e2f8 | hover, raised surfaces |
| ink | #0e1b2b | text, footer, primary buttons |
| muted | #4b5a6b | secondary text |
| gum | #ff8fa3 | highlights, button hover, today in the hours |
| gum-soft | #ffe3e8 | selected states |
| gum-text | #b02a47 | pink used as text |

## Layout

- Masthead: one plain bar, logo left, links, an Open-now note and Book online.
- Home: the question and answer panel, a plain price list of every treatment (a real table), a photo band, what the first visit is like, the team with portraits, patient words, the booking call.
- Inner pages (treatments, eight treatment pages, team, membership calculator, booking, contact) keep their structure and take the new tokens.

## Brand

Mark: a tooth in ink with a pink smile line. Favicon is a white tooth on ink.

## Motion

The answer panel cross-fades; chips and buttons give feedback; Lenis smooth scroll. Everything respects prefers-reduced-motion.
