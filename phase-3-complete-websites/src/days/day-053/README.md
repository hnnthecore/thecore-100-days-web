# Day 053 · Complete website: “Static”

An independent podcast network, as a **complete 25-page website** built around two hard problems: a **radio tuner** for finding a show, and a **player that keeps its place as you move between pages**.

**Open it:** `phase-3-complete-websites/site/day-053-podcast-network/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

## The idea

The network is called Static, so the home page is a radio. Four shows sit on a frequency band from 88 to 108 MHz. A slider (or the arrow keys, Page Up and Down, or the station buttons) turns a red needle across the scale. Away from a station the screen fills with animated static; within about half a MHz of one it locks: the static fades and the screen shows the show's cover, host, one line about it, the latest episode and **Play the latest**. Brushed aluminium, graphite and one red needle; each show keeps its own colour; **Archivo** for headlines, **Work Sans** for text.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | The tuner, newest episodes, a photo band, the four shows and the pitch call |
| **Shows** | `/shows/` | Four shows from the `shows` collection with a category filter |
| **Show ×4** | `/shows/<slug>/` | Cover, host, **Follow**, “play latest” and every episode |
| **Episodes** | `/episodes/` | Sixteen episodes from the `episodes` collection with live search, show filter, a length slider and sorting |
| **Episode ×16** | `/episodes/<slug>/` | A **big player** with a clickable waveform, −15 / +30 skip, speed, **chapters that highlight as you listen**, show notes and more from the show |
| **My library** | `/library/` | “Continue listening” with a progress bar for each episode you started, and the shows you follow |
| **About** | `/about/` | Values and a pitch-a-show form |

## How the player works

The episodes have no audio files, so the player is simulated, but it behaves like the real thing. Nothing ticks in memory: the player saves `{ pos, playing, since, speed }` in `localStorage`, and the current position is always computed from the time elapsed since it started. That is why the mini-player at the foot of every page carries on across page loads, and why listening history can remember where you stopped in each episode.

## Things worth reading in the code

- The tuner's control is a native `<input type="range">` in tenths of a MHz, so it works with keyboard and touch for free. `tune()` reads it and moves the needle, the readout, the static and the station card; the four station cards are rendered on the server, hidden, with real Play buttons already wired to the player.
- The static is a 128 × 80 canvas of random grey, scaled up with `image-rendering: pixelated`, redrawn about eleven times a second and faded as you near a station; reduced motion keeps one still frame.
- `player.ts` holds the model: `position()`, `play()`, `toggle()`, `seek()`, `speed()`, listening history and followed shows. `mini.ts` builds the mini-player from that state. The play and pause icons are drawn with CSS from a `data-state` attribute, so there are no icon characters in the markup.

## Photography

Show covers, host portraits and the photo band are real photographs from Pexels (free to use). The logo (a half-dial with a red needle) is in `scripts/make-brand.mjs`.
