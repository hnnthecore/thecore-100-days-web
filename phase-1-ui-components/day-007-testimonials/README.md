# Day 007 · Testimonials & Reviews

People trust people. These six sections turn customer voices into proof, each in a style suited to a different kind of business.

| # | Section | Best for | Highlights |
|---|---------|----------|------------|
| 01 | **Lumen** wall of love | SaaS, apps, communities | Masonry grid, filter by role, "Read more" on long quotes, "Show more" reveal, overall rating |
| 02 | **Atlas** logo carousel | B2B, enterprise | One large quote at a time with a key result; customer logos act as tabs with a progress line; pause on hover or focus, pause button, arrow keys; no auto-play for reduced-motion users |
| 03 | **Forma** review summary | E-commerce, local services, agencies | Star breakdown bars that filter, sort by newest, rating or helpfulness, "Helpful" votes, verified badges, owner replies to negative reviews, "Load more" |
| 04 | **Halden** case-study results | Agencies, consultants | Client tabs, large editorial quote, results that count up when shown |
| 05 | **Forge** member stories | Gyms, coaching, education | Swipeable story cards with result chips, previous/next buttons, two rows of short reviews drifting in opposite directions (pause on hover) |
| 06 | **Ember** critics & guests | Restaurants, hotels, venues | Press quotes, recent guest reviews, a leave-a-review form with an accessible star picker; new reviews appear instantly |

## Run it

Open `index.html` in a browser, or from the repo root:

```bash
python -m http.server 5500
```

## Notable details

- **Content stays in the HTML.** Every quote and review is real markup, not injected by JavaScript, so search engines and screen readers see it all.
- **Honesty builds trust.** The review summary includes lower ratings and a public owner reply. Real businesses that show these convert better than "all 5-star" walls.
- **The carousel follows the WAI-ARIA pattern.**
  - Logos are tabs and stories are panels.
  - Auto-play pauses on hover, on keyboard focus, and when the carousel is scrolled off-screen.
  - Auto-play never starts for visitors who ask for reduced motion.
- **Accessible star rating.** The stars are five real radio buttons, so they work with a mouse, touch, the arrow keys and screen readers ("4 stars, very good").
- The review form uses the shared FormKit engine for validation and the character counter.

All names, companies, publications and reviews are fictional demo content.
