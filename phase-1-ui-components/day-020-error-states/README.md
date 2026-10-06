# Day 020 · Error & empty states

The screens nobody designs until something breaks. Six states that turn a dead end into a next step. No libraries.

| # | State | Best for | Highlights |
|---|-------|----------|------------|
| 01 | **Halden** helpful 404 | Every website | Guesses the page you meant from the broken address (edit distance), site search, popular pages, “Report this broken link”, eyes that follow the pointer and blink (off with reduced motion) |
| 02 | **Atlas** server error | Apps & dashboards | Plain-language message, automatic retries with exponential backoff (2 s → 4 s → 8 s) and a countdown ring, Try now, copyable reference code, technical details tucked away, success after the third try |
| 03 | **Lumen** offline mode | Any app people use on the move | Works offline: changes are saved locally and marked “Waiting to sync”, a clear banner, then automatic sync on reconnect. Uses the real `online` / `offline` events plus a simulation switch |
| 04 | **Forma** empty states | Every list, search and inbox | First use (templates + blank project), no results (real filtering that says which filter to remove and how many homes it would show), all done (a celebration with confetti, or just a message under reduced motion) |
| 05 | **Atlas** “You need access” | Documents, workspaces, admin areas | Who owns it, request access with a note and level, a pending tracker, simulated approval, switching to an account that already has access |
| 06 | **Ember** partial failure | Dashboards & home screens | Every widget loads independently with its own skeleton; one fails with its own Retry, one falls back to saved data with a “2 hours ago” notice, and the page announces a summary |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## The rules behind every state

1. **Say what happened, in plain words.** “Deployments are taking a short break”, not “Error 503”. The code can still be there for support.
2. **Say what *didn't* happen.** “Your projects and data are safe” takes away the scariest question.
3. **Always offer a next step.** Retry, search, request access or remove a filter. There's never a dead end.
4. **Let the computer do the waiting.** Automatic retries back off (2, 4, 8 s…) so a struggling server isn't flooded, while Try now is always there.
5. **Fail small.** One broken widget shows its own error; the rest of the page keeps working. Old data is better than no data, as long as it's labelled.
6. **Empty isn't one thing.** First use invites, no results helps, and all done celebrates. Each needs a different message.

## Phase 1 complete

Day 020 closes Phase 1: **20 days × 6 patterns = 120 components**, all on the shared design system and ready to combine into the landing pages of Phase 2.
