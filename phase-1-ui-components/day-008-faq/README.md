# Day 008 · FAQ Sections

A good FAQ answers questions before they become emails, and it helps a page rank in search. Six ways to make answers easy to find:

| # | Section | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Lumen** searchable FAQ | SaaS, apps | Live search that highlights matching words (and opens answers that matched), category filter, "Was this helpful?" vote, copy-link per question, `#question` deep links |
| 02 | **Atlas** help-centre search | Products with many articles | Big search with instant suggestions (ARIA combobox, arrow keys + Enter), popular searches, topic cards, article view with related articles |
| 03 | **Forma** step-by-step guide | Processes (buying, onboarding, treatment) | Questions grouped by stage along a timeline, Expand all / Collapse all; the stage dot fills when one of its answers is open |
| 04 | **Halden** editorial accordion | Studios, premium brands | Large numbered serif questions; only one open at a time using `<details name>`, with **zero JavaScript** |
| 05 | **Forge** chat-style FAQ | Gyms, consumer brands | Tap a suggested question and get a chat reply with typing dots; hand-off to a human; a preview of the AI chat planned for later phases |
| 06 | **Ember** tabbed FAQ + ask | Restaurants, hospitality | Topic tabs, allergen table, ask-a-question form, and **FAQPage structured data** so Google can show answers in search results |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Notable details

- **Works without JavaScript.** Most questions are native `<details>` elements, so they open and close even if scripts fail. Search engines can read every answer.
- **Smooth native animation.** In modern browsers, `interpolate-size` and `::details-content` animate the height smoothly. Older browsers simply open instantly.
- **SEO.** The `<script type="application/ld+json">` block in the page `<head>` describes the Ember questions in Google's FAQ format.
- **Accessible.**
  - The search announces how many results it found.
  - Suggestions follow the ARIA combobox pattern.
  - Tabs work with the arrow keys.
  - The chat uses a live region, so new replies are read out.
