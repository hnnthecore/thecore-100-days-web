# Day 030 · Gym landing page: “Rival Athletic Club”

A three-club gym brand across Leeds, Manchester and Sheffield (fictional). The brief to myself: **an athletic poster that works**. It uses black, bone white and one hot magenta, with huge uppercase **Anton**, hard edges and offset shadows on hover, a scrolling ticker, and **Archivo** for body text. It also has the tools a gym site should have: classes you can book, a plan you can price, and a week you can build.

**Open it:** `phase-2-landing-pages/site/day-030-gym/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + live busyness** | A giant “EARN IT.” with a ticker underneath. A panel shows **how full each club is right now**, calculated from the time of day (peaks at 7 am, lunchtime and 6 pm), with a label and “quietest time left today” |
| 2 | **Class timetable** | Seven days, six classes a day, filterable by HIIT, strength, cycle, boxing and yoga. Spots-left bars, “only 2 left”, waitlists for full classes, and classes that have already started are disabled. **Bookings are remembered** (`localStorage`) |
| 3 | **Membership** | Three plans in a radio group, with a monthly / annual toggle (annual = 2 months free and no joining fee) and a summary line |
| 4 | **Week builder** | Pick a goal, days per week and experience. It builds a full Monday–Sunday programme with named exercises, sets and reps, rest days, and a total time. “Copy my plan” puts it on the clipboard |
| 5 | **The Rival 30 leaderboard** | Eight members compete. Join with a name, log workouts for +10 points, and the board re-sorts with a sliding animation. It tells you who to overtake and how many workouts it'll take |
| 6 | **Free 3-day pass** | A validated form (name, email, club, start date, consent) that issues a pass code and mentions the plan you were looking at |

## Details worth knowing

- Class lists are generated from templates plus the date, so every day looks different but is stable between reloads. Weekends get a later timetable.
- The week builder adjusts sets by experience and swaps rep ranges and finishers by goal. The splits are real ones: full body for 2 days, push / pull / legs for 3, upper / lower for 4, and so on.
- The leaderboard animates with a small FLIP technique: it measures positions before and after re-sorting, then slides each row from its old place.
- Annual prices are shown as an effective monthly price (for example £32.50), with the yearly total in the summary line.

## Accessibility

- Days, class types, clubs and every booking button use `aria-pressed`, and booking buttons carry a full label (“Book: Lift Lab at 09:15”). Booking changes are announced in a live region, and focus stays on the button.
- Plans, goals, days and experience are real radio groups, and the billing toggle is a real checkbox. Not-included features are marked in text for screen readers, not just by strikethrough.
- The leaderboard is not a live region, so it won't chatter. “Reduce motion” stops the ticker, the pulse, the sliding rows and the random score changes.

## Notes

Rival Athletic Club is a fictional business. Classes, prices, members and the busyness figures are demo content, and nothing is sent.

## Photography

The photo band under the hero uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-030/` and converted to WebP at build time. I skipped several gym photos that showed visible equipment brands. The live busyness meter, timetable and week builder stay as interface.

| Use | Photo | Source |
| --- | --- | --- |
| Band, large | Dumbbell rack and member training | https://unsplash.com/photos/CQfNt66ttZM |
| Band, small | Rubber dumbbells close up | https://unsplash.com/photos/VJ2s0c20qCo |

### Layout redesign

The hero is now a billboard poster: the headline is set across the full width, with the live club meter as a horizontal strip beneath it.

### Navigation redesign

The header is now a boxed bar with a heavy rule and squared tabs, and the sections follow a different order from the other days.
