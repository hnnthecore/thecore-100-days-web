# Static · design.md

The brief this site is built from. Anything that contradicts it is a bug.

## The idea (one sentence)

On this page, **an independent podcast network called Static**, becomes **a radio you tune**: four shows sit on a frequency band, you turn the needle across it, the static clears as you land on a station, and the station tells you what it is and what is on.

*Competitor test:* every podcast site opens with a big headline, a fan of tilted cover art and "Play episode". This one has a dial. Between stations you hear (see) static; on a station you meet the host and the latest episode. The brand name is the interface.

## The live thing

**The tuner.** A large graphite panel with a lit frequency readout, a scale from 88 to 108 MHz and a red needle. A slider (and the arrow keys: 0.1 per press, Page Up and Down for a whole MHz) moves the needle. Four stations sit on the band, one per show. Away from a station the screen fills with animated static and the card says "Between stations"; within about half a MHz of one it locks: the static fades and the card shows the show's cover, host, one line about it, the latest episode and Play. "Previous" and "Next station" jump between them. Play uses the site's persistent player, which keeps its place across pages. With reduced motion the static is a still frame and the needle moves without easing. Without JavaScript the four shows are listed as plain links.

## What it is not

- Not a centred "Good listening takes time" headline, a fan of tilted covers, hard offset shadows or a hot-tangerine call to action.
- No eyebrow labels, no 01 / 02 / 03, no hairlines, no gradients, no shadows at rest, no emoji, no play-triangle characters, no monospace (the frequency uses tabular figures of a normal face).
- No invented listener numbers or download counts.

## Type

- **Archivo** (extra bold, tight): headlines, the frequency readout, show names.
- **Work Sans**: everything else.

Steps: small 13px, body 17px, lead 20px, head 36-64px, hero 52-88px, readout 72-112px.

## Colour

A radio cabinet: brushed aluminium, graphite and one red needle.

| Token | Value | Use |
|---|---|---|
| alu | #e3e5e8 | page |
| alu-2 | #d0d4d9 | surfaces |
| alu-3 | #bcc2c9 | hover |
| graphite | #16181b | the tuner panel, player, footer, text |
| graphite-2 | #25282d | raised parts of the panel |
| muted | #4b5159 | secondary text |
| needle | #e5322d | the needle, the play button, focus on dark |
| glow | #ffb347 | the lit frequency readout |
| (shows) | each show's own colour | its station mark, pill and cover |

## Layout

- Masthead: one plain light bar (logo, Shows, Episodes, My library, About, Pitch a show).
- Home: the headline, the tuner panel (readout, scale, controls, station card), newest episodes, a photo band, the four shows, the pitch call.
- Inner pages (shows, a page per show, sixteen episodes with the big player and chapters, library with continue-listening, about with a pitch form) keep their structure and take the new tokens.
- The mini-player at the foot of every page is graphite with a red play button.

## Brand

Mark: a half-dial with five ticks and a red needle. Favicon is the same on graphite.

## Motion

The needle eases between stations (transform only); the static grain flickers at about twelve frames a second; the card cross-fades on lock. Lenis smooth scroll. Everything respects prefers-reduced-motion.
