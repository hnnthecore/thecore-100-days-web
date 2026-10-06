# Day 017 · Notifications & alerts

Six ways to tell people what happened, without nagging. No libraries.

| # | Pattern | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Lumen** toast system | Any app | Success / error / info / loading tones, stack of max 3, time bar that pauses on hover or focus, swipe sideways to dismiss, Undo action, “Saving…” → “Saved” promise toast, Esc to close, 3 positions |
| 02 | **Atlas** notification centre | SaaS & social apps | Bell with unread badge, panel grouped Today / Earlier, All / Mentions / Unread tabs, click to mark read, Mark all as read, live arrivals with a bell ring (switchable) |
| 03 | **Halden** inline alerts | Settings, billing, forms | Info / success / warning / error, each with its own icon, actions that resolve the alert in place (Update card, Retry sync), expandable details, form error summary that links to each field |
| 04 | **Nova** announcement banners | Shops & marketing sites | Sale banner with a live countdown, maintenance notice, rotating announcement bar with pause, dismissals remembered with `localStorage` |
| 05 | **Forge** notification preferences | Any product that sends messages | Topic × channel grid (email / push / SMS) that saves on change, safety rule (class changes keep at least one channel), quiet hours, polite pre-permission card that only asks the browser after a click and sends a real test notification |
| 06 | **Ember** upload tray | File managers, CMS, media | Progress bars with sizes and time left, max 2 uploads at once (rest queued), pause / resume / cancel, a failure with Retry, collapsible tray, drag-and-drop or your own files (nothing is actually uploaded) |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Rules these patterns follow

1. **Match the message to the moment.** A toast for “done”, an inline alert for “this needs you here”, a banner for “this affects everyone”, a tray for “this takes a while”.
2. **Errors don't disappear on their own.** Success toasts leave after ~5 s, while error toasts stay until dismissed and always offer a next step (Try again).
3. **Announce, don't steal focus.** Toasts are read out through `aria-live` regions (polite for success, assertive for errors), while focus stays where you were working.
4. **Give control over movement.** The rotating bar has a pause button, toasts pause while you read them, and live updates can be switched off. WCAG 2.2.2 requires this.
5. **Ask for permission only when it makes sense.** Explain the value first; the browser prompt appears only after the visitor clicks “Turn on”. If they've blocked notifications, we explain how to undo that instead of asking again.

## Technical notes

- Timers run in JavaScript, not on `animationend`, because under “reduce motion” CSS animations finish instantly but messages must still stay readable.
- Live features (notification arrivals, countdown, rotating bar) only run while their demo is on screen and the tab is visible.
- Upload rows update their text and progress in place; buttons are only re-created when the state changes, so keyboard focus is never lost mid-upload.
