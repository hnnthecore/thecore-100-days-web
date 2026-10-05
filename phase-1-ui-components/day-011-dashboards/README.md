# Day 011 · Dashboards

Six dashboards for six kinds of business, built on a tiny hand-made chart toolkit (`charts.js`) with no chart library.

| # | Dashboard | Best for | Highlights |
|---|-----------|----------|------------|
| 01 | **Lumen** SaaS analytics | Software, apps | KPI cards with sparklines and change %, visitors chart comparing this period with the last (hover crosshair), top pages with inline bars, 7D / 30D / 90D ranges |
| 02 | **Ember** tonight's service | Restaurants, venues | Tap tables on a floor plan to cycle free → seated → bill (counts and guests update), covers per hour with the current hour highlighted, revenue-target donut |
| 03 | **Forma** agent pipeline | CRM, sales teams | Leads → viewings → offers → sales funnel with conversion rates, views per listing, today's viewings checklist |
| 04 | **Forge** member progress | Gyms, coaching, education | 12-week activity heatmap, streak, strength-progress chart, next-class booking toggle |
| 05 | **Sentinel** security ops | IT, security, monitoring | Live alert feed (new alert every 4 s, pauses off-screen or on request), acknowledge actions, severity donut |
| 06 | **Nova** shop admin | E-commerce | Revenue per day with today highlighted, orders with status filters, low-stock list with one-click reorder |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## The chart toolkit (`charts.js`)

```js
Charts.area(el, { labels, series: [{ name, values, color, dashed }], format });
Charts.bars(el, { labels, values, color, highlight, highlightColor, format });
Charts.donut(el, { segments: [{ label, value, color }], center: { value, label } });
Charts.spark(el, values, color);
```

- Charts redraw on resize, so text stays crisp at any width.
- Hover tooltips show exact values.
- Every chart also includes a visually hidden data table, so screen-reader users get the same numbers.
- Each function returns an `update(data)` function, which is how the date-range switch redraws the traffic chart.

## Notes

- All figures are generated demo data. In Phase 4 these widgets read from a real API and database; only the data part of each section changes.
- The live alert feed pauses when it's scrolled off-screen or the tab is hidden, so it never wastes CPU.
