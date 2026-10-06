# Day 016 · Profile pages

Six profile pages for six kinds of people. No libraries, no images: avatars and covers are CSS gradients, so the folder stays tiny.

| # | Profile | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Mira Okafor** creator | Photographers, artists, influencers | Cover + overlapping avatar, verified badge, Follow updates the follower count, highlights row, Posts / About / Saved tabs, like any photo |
| 02 | **Sofia Lindqvist** professional | Job seekers, consultants, online CVs | “Open to work” ring and badge, experience timeline with “Show earlier roles”, endorse skills (+1), language levels with `<meter>`, Copy email |
| 03 | **Atlas** edit profile | Any app's account settings | Photo preview with FileReader (never uploaded), username format + availability check with suggestions, bio counter, colour swatches, live preview card, Save validation, Reset |
| 04 | **Kai Nakamura** freelancer | Marketplaces, agencies, coaches | Rating breakdown bars, Basic / Standard / Premium package tabs (what's included and what isn't), helpful votes on reviews, sticky hire card |
| 05 | **Arjun Mehta** developer | Developers, open-source portfolios | Contribution heatmap for the year (hover, or use the arrow keys to read days), year switcher, pinned repos you can star, language bar, achievements |
| 06 | **Dr. Lea Moreau** doctor | Clinics, salons, tutors, any appointment business | Trust signals, treatments, address, plus booking: visit type → day → free time slots (taken and fully-booked days disabled) → confirmation |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Ideas worth knowing (in simple words)

- **A profile answers three questions:** who is this, can I trust them, and what can I do next? Every layout puts the main action (Follow, Hire, Book, Copy email) next to the name.
- **Star ratings without images:** the stars are the text `★★★★★` coloured by a gradient that stops at, for example, 4.9 / 5 = 98%, so any decimal rating is exact.
- **Photo preview without uploading:** `FileReader` turns the chosen file into a local preview. A real app would upload it on Save.
- **Stable “random” demo data:** a tiny seeded random generator makes the heatmap and booked slots look natural but stay the same on every visit.
- **Floated legends:** a `<legend>` floated for styling must be followed by `clear: both`, otherwise grid content beside it collapses to zero width. This was a real bug, caught and fixed while testing.

## Accessibility notes

- Tabs follow the WAI-ARIA pattern (← → Home End).
- Toggle buttons (Follow, like, endorse, star, helpful) use `aria-pressed`, and focus stays on them after each update.
- The heatmap has a text summary and arrow-key reading, so it's not mouse-only.
- Booking uses native radio buttons, so the arrow keys and screen readers work without extra code; taken times are labelled “taken”.
