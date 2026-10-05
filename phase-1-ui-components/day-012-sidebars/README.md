# Day 012 · Sidebars

Six sidebars for apps, documentation, mobile, shops, settings and email. No libraries.

| # | Sidebar | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Lumen** collapsible app sidebar | SaaS, admin panels | Collapses to an icon rail with tooltips and remembers your choice, expandable project group, unread badges, workspace and profile pinned top and bottom |
| 02 | **Atlas** documentation | Docs, help centres, courses | Filterable section tree (highlights matches), expandable groups, “On this page” list that follows your scroll (scroll-spy) |
| 03 | **Nova** swipeable drawer | Mobile apps & sites | Slides in over the page, follows your finger so you can drag it closed, backdrop + Esc to close, focus stays inside; becomes a fixed sidebar on wide screens |
| 04 | **Forma** search filters | Property, e-commerce, listings | Two-handle price slider, property-type counts, bedroom selector, removable filter chips, live result count, clear all |
| 05 | **Atlas** settings | Any app's settings | Vertical tabs (↑ ↓ / Home / End), unsaved-changes dot per tab, sticky save bar with Save and Discard |
| 06 | **Halden** mail | Email, chat, file managers | Drag the divider to resize, snaps to icons-only when narrow, keyboard resize (← →, Shift for bigger steps, Home / End, Enter to reset), double-click to reset |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## How it works (in simple words)

- **Collapse (01):** one class, `is-collapsed`, on the layout changes the sidebar width. Labels are visually hidden, not deleted, so screen readers still announce “Inbox” on the icon-only link. The choice is saved in `localStorage`.
- **Scroll-spy (02):** while the article scrolls, the script checks which heading has passed the top and highlights the matching link. It runs at most once per animation frame, so scrolling stays smooth.
- **Drawer (03):** the drawer is moved with `translate`. While you drag, it follows the pointer exactly; when you let go, it closes if you dragged far enough or flicked quickly, otherwise it springs back.
- **Dual slider (04):** two normal range inputs sit on top of each other, and only their handles accept clicks. The script stops the handles from crossing.
- **Unsaved changes (05):** each field remembers its saved value. If anything differs, the save bar appears and that tab gets a dot.
- **Resizer (06):** a `role="separator"` element with `aria-valuenow`, so screen readers announce the width. Pointer capture keeps the drag working even if the mouse leaves the divider.

## Responsive

Each sidebar adapts to the width of its own container (container queries), not just the screen:

- **01:** always an icon rail on phones.
- **02:** “On this page” is hidden on tablets, and the menu stacks above the article on phones.
- **03:** a fixed sidebar on wide screens and a drawer on narrow ones.
- **04 & 05:** the panel moves above the content on phones (settings tabs become a horizontal strip).
- **06:** icons only, with no resizer, on phones.

## Accessibility

- Every icon-only control has an accessible name.
- Current pages use `aria-current`.
- Expandable groups use `aria-expanded`.
- Vertical tabs follow the WAI-ARIA tabs pattern.
- The drawer traps focus and returns it to the menu button.
- Result counts and save messages are announced through live regions.
- Animations are turned off with reduced motion.
