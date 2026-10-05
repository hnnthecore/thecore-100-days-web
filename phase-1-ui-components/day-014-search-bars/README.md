# Day 014 · Search bars

Six search bars, no libraries. Four of them share one small `combobox()` helper in `script.js`, which follows the WAI-ARIA combobox pattern.

| # | Search bar | Best for | Highlights |
|---|------------|----------|------------|
| 01 | **Nova** shop autocomplete | E-commerce | Recent & trending searches before typing; as you type, word completions + product previews with prices; category scope; → or the arrow icon fills in a suggestion; recent searches remembered |
| 02 | **Wander** travel booking | Hotels, holidays, rentals | Where / When / Who in one bar; destination suggestions; date chips (a radio group) and nights; guest steppers with limits; each step opens the next; friendly error when Where is empty; stacks into a card on phones |
| 03 | **Halden** expanding header | Portfolios, brand & content sites | Search icon grows into a full field over the menu; “/” opens it; ↓ moves into results; Esc or clicking away closes and returns focus |
| 04 | **Lumen** filter tokens | Issue trackers, admin tools, email | `status:open owner:riya label:bug priority:high` become chips; suggestions for both keys and values; plain words search titles (highlighted); Backspace twice removes the last chip; clear explanation for invalid filters |
| 05 | **Ember** live search | Recipes, blogs, catalogues | Results as you type (debounced), highlighted matches, sort by match / time / rating, quick-search chips, “under 30 min” understood, **“Did you mean …?”** for typos like “risoto” or “chiken” |
| 06 | **Atlas** async help centre | Help centres, docs, any server search | Waits until you pause typing, loading skeleton + spinner, cancels out-of-date requests, empty state with a next step, error state with Retry, voice input where the browser supports it |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Ideas worth knowing (in simple words)

- **Combobox:** focus stays in the text box while ↑ ↓ move a highlight through the suggestions. `aria-activedescendant` tells screen readers which suggestion is highlighted, without moving focus.
- **Debounce:** wait about 150–350 ms after the last keystroke before searching. Typing “domain” fires one search instead of six.
- **AbortController:** if a newer search starts, the older request is cancelled, so a slow, out-of-date answer can never overwrite a newer one.
- **Did you mean:** the search compares your word with every word it knows and counts how many letters must change (*edit distance*). One or two changes away is a good suggestion.
- **Never a dead end:** every “no results” state suggests something to try next.

## Notes

- All data is local demo data. The help-centre server is simulated with a random 0.45–1.1 s delay, and searching “error” fails once on purpose.
- The “/” shortcut only works while demo 03 is on screen and you're not typing in another field.
- The microphone button appears only in browsers with the Web Speech API (e.g. Chrome and Edge). Other browsers simply don't show it.
