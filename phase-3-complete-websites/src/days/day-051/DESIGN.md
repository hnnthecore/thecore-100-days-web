# Hirewell · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **a job board**, becomes **a chart of pay**: every role is a bar from its lowest to its highest salary on one shared £ scale, so the first thing a visitor learns is who pays what, and the list of jobs is something they read off the chart instead of a stack of cards.

*Competitor test:* every job board opens with a dark green or blue hero, a big search bar, "12 open roles" counters and a grid of cards with tiny salary text. This one has no hero search at all. It opens with the answer people came for: the pay, side by side. The company promise ("the salary is always on the listing") is the interface.

## The live thing

**Drag your line.** A slider sets "I need at least £__" and an orange line moves across the chart. Each bar is cut at the line: the part below it turns grey, the part above stays cobalt, and a role whose top salary falls short fades out. A sentence under the chart keeps count ("7 of 11 roles reach £50,000 or more"). Category buttons filter the rows and "Highest pay / Newest" reorders them. Press a bar's name to open the job; the star saves it. Contract roles are paid by the day, so they sit below the chart with their own small scale and the yearly equivalent worked out in words. Without JavaScript the chart is drawn in full and the rows are links.

## What it is not

- Not a dark green hero with a search bar in a floating card, a stats counter ("12 open roles"), mint chips or lime highlighter.
- Not a grid of boxed job cards as the main event. No eyebrow labels, no 01 / 02 / 03, no hairlines, no gradients, no shadows at rest, no emoji, no monospace.
- No invented applicant counts, "urgently hiring" badges or fake logos beyond the initial tiles already in the content.

## Type

- **Schibsted Grotesk** (extra bold, tight): headlines, salary figures, the chart labels.
- **Public Sans**: everything else.

Steps: small 13px, body 17px, lead 20px, head 32-56px, hero 48-80px. Figures use tabular numerals.

## Colour

Cobalt on a cool white, with ink type and one orange for the thing you control.

| Token | Value | Use |
|---|---|---|
| paper | #f4f5f9 | page |
| paper-2 | #e7e9f2 | rows, panels |
| ink | #0f1220 | text, footer |
| muted | #4a5063 | secondary text |
| cobalt | #2a44ff | the pay bars, buttons |
| cobalt-d | #1b2fd0 | text links, pressed |
| soft | #dfe4ff | hover, selected |
| signal | #ff6a1a | your line, saved, today |
| grey-bar | #aab0c4 | the part of a bar below your line |

## Layout

- Masthead: one plain bar (logo, Find jobs, Companies, For employers, Saved, Post a job).
- Home: the headline, the pay chart with its controls, contract roles, three promises in plain words, the five hiring companies with their workplace photographs, the employer call.
- Inner pages (job list with filters and a minimum-salary slider, twelve job pages with an apply dialog, five company pages, saved jobs with a side-by-side comparison, employers with a live preview) keep their structure and take the new tokens.

## Brand

Mark: two range bars of different lengths on cobalt, with a short orange tick between them. Favicon is the same on ink.

## Motion

Bars grow from their low end on load (transform only); the line eases as you drag; rows fade as they fall out; Lenis smooth scroll. Everything respects prefers-reduced-motion.
