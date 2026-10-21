# Fathom · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **a cash-flow forecasting product**, becomes **the forecast itself: the first screen is one huge live chart of the next 13 weeks that the visitor bends with three sliders, and the page leads with the answer, not a mock-up of a dashboard**.

*Competitor test:* every SaaS landing page opens with a purple gradient headline, a floating screenshot of a dashboard and two buttons. This one opens with the product doing its one job. A small-business owner moves "customers pay late by" to 30 days and watches the line fall under the red safety floor, and a sentence tells them what it means.

## The live thing

**Bend the forecast.** Three controls under the chart: sales change, a new hire per month, customers pay late by. The mint line, the lowest-balance callout, the verdict sentence and three readouts all update on every move. The dotted line is the current plan. Works by keyboard (arrow keys on each slider). Without JavaScript the chart shows the default scenario and the sentence still reads.

## What it is not

- Not a gradient headline, a violet-to-mint mesh, floating cards, or a dashboard screenshot hero.
- Not a bento of rounded cards. Not a logo strip pretending to be proof. Not a purple/blue SaaS palette.
- No eyebrow labels, no 01 / 02 / 03, no gradients, no shadows at rest, no emoji, no monospace.
- No invented customer counts beyond those already in the content.

## Type

- **Onest**: headings, the big numbers and chart labels (tabular figures).
- **Hanken Grotesk**: body and interface.

Steps: small 13px, body 17px, lead 20px, head 32-56px, hero value 40px.

## Colour

| Role | Value |
| --- | --- |
| Hero ground | `#0c110f` green-black |
| Ink | `#0c110f` |
| Light ground | `#eef1ee` |
| Soft ink on light | `#4d5a54` |
| Mint (line, accents on dark) | `#7cf5c4` |
| Deep green (accent on light, primary buttons) | `#0d6b4a` |
| Safety floor | `#ff6a55` coral, only for the floor and warnings |

## First screen

A plain dark bar. Under it, the h1 "Know your cash 13 weeks before it happens." at top left (two lines), and at top right the live sentence and three readouts. The chart fills the width and about 40% of the height. The three controls sit along the bottom with a Start free button.

## Page, in order

1. **The forecast** (hero, live).
2. **A morning with Fathom** – a sticky heading and a feed of five timed events, each arriving in turn: forecast updated, late invoice, scenario warning, payroll covered, accountant opened the plan.
3. **What Fathom does** – the six features as an accordion of tall panels: one open, the rest collapsed to a vertical title; hover or focus opens another.
4. **In numbers** – four numbers at poster size, counting up.
5. **Customers** – a horizontal choice of four businesses; the open one shows a photograph and a large quote.
6. **Start** – one large sentence and two buttons.
7. **Footer** – ink, the status strip kept, links.

## Inner pages

Keep their markup. They follow the same tokens: dark plain header, flat ink page heads (no mesh), square buttons and fields, flat tiles with no shadows, deep green instead of blue and violet.
