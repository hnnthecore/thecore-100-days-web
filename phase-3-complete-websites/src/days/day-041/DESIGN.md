# Pagebound Books · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **the whole shop, every book spine out on its shelf**, becomes **a contact sheet: the shelves laid out at once, small, in strict rows, mixed with the grey stone of the street the shop stands in**.

*Competitor test:* a generic bookshop site features three bestsellers. This one refuses to feature anything. It shows the volume of the shop at a glance and lets the visitor choose, which is how Pagebound's booksellers say they like people to shop. The street (Canongate, on Edinburgh's Royal Mile) supplies the grey.

## The live thing

**Sort the sheet.** Press a shelf (Fiction, Non-fiction, Children's...) and the sheet dims everything else. Hover any frame and its bookseller's note appears in a fixed place. It works without JavaScript (everything is shown) and with a thumb.

## What it is not

- Not a hero with a featured book, a headline and two buttons.
- No eyebrow labels, no 01 / 02 / 03, no thin rules, no gradients, no shadows at rest, no emoji.
- No cream-and-terracotta. No oxblood-on-cream "literary" look.
- No invented reviews or sales numbers.

## Type

One family, **Schibsted Grotesk**. Wordmark and display: 800, tracking -0.05em. Body: 400. Functional text (navigation, strips, captions): 600.
Steps: small 13px, body 17px, lead 20-22px, head 24-36px, wordmark in the footer about 9vw.

## Colour (dealt, and right for the street)

| Role | Value |
| --- | --- |
| Ground | `#ebe5e3` rose grey, like Canongate stone in rain |
| Surface | `#e1dad7` |
| Ink | `#2b2622` |
| Soft ink | `#6a615d` |
| Accent | `#0b6a3a` green, only on the current page link and the one button in the footer |

The book covers are the only colour on the page. Photographs of Edinburgh and the book trade are shown in greyscale.

## First screen

No header. The whole viewport is a sheet of frames in six columns, each column offset so rows never line up, the top and bottom frames cropped. Every frame has a flat strip under it with its title or place. In columns 3 and 4 one cell is not a picture but a dark panel holding the wordmark, one sentence, one button (Browse the shelves) and three links (Events, Staff shelf, Visit).

## Page, in order

1. **The sheet** (hero).
2. **The shop** – a narrow column of five short paragraphs. Proof: 42 Canongate, open since 1998, the kettle.
3. **On the staff shelf** – a run of frames at one height with one lifted frame, the bookseller's note beside it.
4. **What's on** – a two-ended list of the real events: title left, date and time right.
5. **Reserve and collect** – a drag row of five moments, each with a grey photograph.
6. **The whole shop** – a dense masonry of 24 frames with the shelf filter.
7. **Call to action** – one plain sentence and one small button.
8. **Footer** – tiles: statement, navigation, Edinburgh time, email, the wordmark large, a green "Reserve a book" tile.

## Motion

- The hero columns slide up once, each a little later than the last.
- The lifted frame in the staff shelf opens with a shutter (clip-path, about 1.1s).
- Hovering a frame dims the others. Everything respects `prefers-reduced-motion`.

## Rules for the build

- Headlines two lines or fewer at every width; one `h1`; every section has a heading.
- Nothing under 13px. Body 16px or more.
- One button shape (square corners, 44px tall on the first screen), one pair of page margins (16px).
- At least 24 real pictures on the page: twelve covers plus seventeen from open collections, credited on the About page.
- Checked at 360, 768, 1024, 1280 and 1536px in a real browser, then with the Taste Skill inspector.

## Replaced by this redesign

The oxblood-and-cream look, the hero with a headline and two buttons, the logo's colours on the page (the bookshelf logo stays, as a small mark).
