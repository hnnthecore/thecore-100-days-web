# Day 015 · Tables

Six data tables built from plain HTML `<table>` elements and small data arrays. No libraries.

| # | Table | Best for | Highlights |
|---|-------|----------|------------|
| 01 | **Lumen** sortable data table | Admin panels, CRMs | Sort any column (`aria-sort`, click again to reverse), search + status filter, pagination, select rows or a whole page (indeterminate header checkbox), bulk Export CSV / Delete with Undo |
| 02 | **Halden** responsive invoices | Finance, bookings, orders | Becomes labelled cards on phones (`data-label`), status tabs with counts, outstanding total in the footer, Remind and Mark paid actions |
| 03 | **Forge** class timetable | Gyms, schools, events | Times × days grid, today highlighted, type filters, tap to book or cancel (spots update, full classes disabled), sticky time column and header when scrolling sideways |
| 04 | **Atlas** editable budget grid | Budgets, planners, inventories | `role="grid"` with arrow-key navigation, type to edit, Enter / Tab to save and move, Esc to cancel, validation, live row and column totals, budget meter, add rows |
| 05 | **Nova** expandable orders | E-commerce, support, logs | Rows expand to show items, address and a progress timeline; Mark as shipped / delivered updates the status and timeline; Copy order ID; Expand all |
| 06 | **Ember** configurable report | Reports, analytics exports | Choose columns, compact or comfortable rows, sticky header, first column and totals, revenue bars, Export CSV of exactly the visible columns |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Three ways to make a table work on phones

1. **Hide the least important columns** (01, 05): `.hide-sm` / `.hide-md` columns disappear on narrow screens.
2. **Turn rows into cards** (02): CSS changes each row to a block and shows each cell's label with `td::before { content: attr(data-label) }`.
3. **Scroll sideways with a pinned column** (03, 04, 06): `position: sticky` on the first column and header keeps your bearings.

## Accessibility notes

- Real `<th scope="col">` / `<th scope="row">` headers, so screen readers announce “Status, Active”, not just “Active”.
- Sort buttons live inside the header cells, and `aria-sort` tells screen-reader users the current order.
- The budget grid uses a *roving tabindex*: Tab enters the grid once, and the arrow keys move inside it, just like a spreadsheet.
- Expand buttons use `aria-expanded` + `aria-controls`; the timetable marks today with `aria-current="date"`.
- After an action removes a button (Mark paid, Delete), focus moves somewhere sensible instead of being lost.

## Notes

- All data is generated demo data. Export creates real CSV files in your Downloads folder.
- Budget values are in thousands of pounds (£k).
