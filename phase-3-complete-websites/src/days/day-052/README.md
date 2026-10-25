# Day 052 · Complete website: “Stillwater”

A yoga and pilates studio in Brighton, as a **complete 14-page website** with a real bookable timetable: classes, teachers, pricing, a find-your-class quiz and a booking dialog with “My classes”.

**Open it:** `phase-3-complete-websites/site/day-052-yoga-studio/index.html`

Read `DESIGN.md` first: it is the brief this site is built from.

## The idea

The home page lets you breathe before it asks for anything. A large soft disc grows over four seconds (“Breathe in”) and settles over six (“Breathe out”) for one minute, and beside it, “Today at Stillwater” lists the classes still to come today (or tomorrow's once today is over) with the time, room and spaces left; each links to the timetable filtered to that class. With reduced motion the disc stays still and only the words change. The colours are still water and early light: mist, deep teal-ink, one teal for links and a soft gold for the disc and buttons; **Outfit** for headlines, **Hanken Grotesk** for text.

## The pages

| Page | URL | What it does |
|------|-----|--------------|
| **Home** | `/` | The breathing pacer, today's classes, four classes with photographs, a photo band, what a first class is like, the teachers and the half-price first class |
| **Classes** | `/classes/` | Eight styles from the `yogaClasses` collection, filter by level and energy, with intensity dots |
| **Class ×8** | `/classes/<slug>/` | Description, benefits, weekly times, the teacher, and a Book button that opens the timetable already filtered |
| **Timetable** | `/timetable/` | The **next seven real dates**, filters for style and time of day, **spots left**, a booking dialog, and a **My classes** panel with cancellation. Classes that have already started today are hidden |
| **Teachers** | `/teachers/` | Four teachers from the `yogaTeachers` collection and the classes each leads |
| **Pricing** | `/pricing/` | Drop-in, 10-class pass and unlimited membership with a monthly / yearly toggle, and a slider that works out the cheapest option for how often you practise |
| **Find my class** | `/find-a-class/` | Four questions that score every class and recommend one, linking straight to its times |

## Things worth reading in the code

- `schedule.ts` holds one fixed week and turns it into real dated occurrences with stable ids like `2026-10-07|morning-mobility|07:00`. The home page reuses `upcoming()` to list today's classes, so it can never disagree with the timetable.
- The pacer is a CSS animation on one disc (`sw-breath`, 10 seconds: four counts in, six out); the script only switches the label, counts the minute and adds or removes the class that starts the animation.
- Booked counts are hashed from the occurrence id, so availability looks lived-in but is identical on every visit.
- Bookings live in `localStorage`, re-read on every call because each page's scripts are bundled separately.

## Photography

Real photographs from Pexels (free to use) for the classes, the photo band and the teachers' portraits. The logo (three ripples, the middle one filled with sun) is in `scripts/make-brand.mjs`.
