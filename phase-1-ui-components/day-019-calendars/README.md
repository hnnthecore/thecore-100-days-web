# Day 019 · Calendars & date pickers

Six calendar patterns built on plain JavaScript `Date` and `Intl`. No date library.

| # | Calendar | Best for | Highlights |
|---|----------|----------|------------|
| 01 | **Atlas** date picker | Any form with a date | Type it (“next friday”, “tomorrow”, “24/12”, “3 nov”, 2026-11-24) or pick it; WAI-ARIA dialog + grid keyboard (arrows, Page Up/Down, Shift+Page for years, Home/End, Enter, Esc); weekends & past days blocked with a helpful “next free day” |
| 02 | **Wander** range picker | Hotels, rentals, car hire | Two months, check-in → check-out with hover preview, nights and total price (weekend rates), presets, booked nights can't be inside a stay but can be a check-out day |
| 03 | **Lumen** month calendar | Team & booking apps | 6-week grid, colour-coded events, “+n more”, category filters, click a day to quick-add (“14:30 Client call” sets the time), keyboard moves between days, dots + agenda list on phones |
| 04 | **Halden** week schedule | Studios, clinics, schools | Events placed by real start/end times, overlapping events share the width, 7-day week with roomier weekdays, a current-time line, event details popover (Esc closes) |
| 05 | **Nova Air** fare calendar | Flights, events, dynamic pricing | Price per day coloured by quartile, ★ cheapest day, sold-out days, keyboard grid, flights for the chosen day |
| 06 | **Ember** event card | Events, classes, webinars | Date badge, time shown in any time zone (with “a different day for you”), live countdown, Add to Google / Outlook, and a real `.ics` download with a 2-hour reminder |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Date lessons (in simple words)

1. **Never parse date strings with `new Date("2026-11-24")`.** It's read as UTC midnight, which is still the 23rd in New York. Build calendar dates with `new Date(year, month, day)` instead.
2. **Calendar days and moments are different things.** A booking night is a *calendar day* (no time zone). An event start is a *moment* (a point in time shown differently around the world). Days 01–05 use calendar days, while 06 uses a moment.
3. **Months have different lengths.** “One month after 31 January” is clamped to 28/29 February (`addMonths`).
4. **Let `Intl` do the formatting**: weekday names, month names and time-zone labels come out right for every language and zone.
5. **Weeks start on Monday** here (UK / Europe). Changing one helper (`mondayOf`) switches it to Sunday-first.

## Accessibility notes

- Every day button has a full label (“Tuesday, 24 November 2026, unavailable”), so the grid isn't just a list of numbers.
- The grids use a roving tabindex: Tab enters once, and the arrow keys move between days.
- In the date picker and range picker, unavailable days use `aria-disabled` rather than `disabled`, so keyboard users can still land on them and hear why. In the fare calendar, sold-out days are skipped.
- The countdown is announced once as a sentence, not every second.
