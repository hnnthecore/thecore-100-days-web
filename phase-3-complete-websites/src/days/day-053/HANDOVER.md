# Static · handover note

For whoever looks after this site after it is delivered. Plain steps, no jargon.

## What is in the folder

`phase-3-complete-websites/site/day-053-podcast-network/` is the finished website: open `index.html` in a browser, or upload the whole folder to any web host. It is plain HTML, CSS and JavaScript, so it needs no server software.

The source is in `phase-3-complete-websites/src/`. You only need it if you want to change the site.

## Changing the words

- Shows: one file per show in `src/content/day-053/shows/` (title, host, tagline, colour).
- Episodes: one file per episode in `src/content/day-053/episodes/` (title, show, number, date, length in minutes, chapters).
- The four radio stations on the home page: `STATIONS` near the top of `src/pages/day-053-podcast-network/index.astro` (a show and its frequency).

Then rebuild (see below).

## Changing the photographs

- Show covers: `src/assets/day-053-covers/`; host portraits: `src/assets/day-053-hosts/`; studio photos: `src/assets/day-053/`.

Keep each photograph under about 2 MB. The build makes the small, fast versions for you.

## Colours, fonts and the logo

- Colours and spacing are at the top of `src/days/day-053/styles.css`.
- The reasoning behind the design is in `src/days/day-053/DESIGN.md`.
- The logo and the favicons come from `scripts/make-brand.mjs` (the entry named `day-053-podcast-network`). Edit it and run `node scripts/make-brand.mjs`.

## Rebuilding after a change

1. Install Node.js (version 20 or newer) from nodejs.org.
2. In the `phase-3-complete-websites` folder run `npm install` once, then `npm run build`.
3. The finished site appears in `site/day-053-podcast-network/`. Upload that folder.

## Putting it on your own address

1. Upload the `day-053-podcast-network` folder so its files sit at the top of your domain.
2. In `src/layouts/Site.astro` and `scripts/seo.mjs` change the web address (the line starting `const ORIGIN`) to your domain, then rebuild. This makes the share image and the sitemap use your real address.
3. The build also writes `sitemap.xml`, `robots.txt` and `404.html`. If your host asks for a custom error page, point it at `404.html`.

## Forms

The pitch form checks what people type but does not send anything yet. Connect it to an email service or form service and decide who receives pitches.

## Analytics and cookies

None are installed, and the site sets no cookies (see the Cookies page). If you add analytics later, update the Privacy and Cookies pages to say so, and add a consent banner if the tool uses cookies.

## Speed

The home page loads about 290 KB in total before the lazy-loaded photographs (HTML, styles, scripts and fonts). Photographs are converted to WebP and sized for the screen by the build, and load only when they come into view. No third-party scripts or fonts are requested.

## Search and sharing

Every page has its own title and description. The home and detail pages carry structured data (schema.org) that search engines use for rich results. Sharing a link shows a 1200 × 630 picture (`og.png` in the site folder). A styled 404 page, `sitemap.xml` and `robots.txt` are generated on every build.

## What was tested

- Layout at 360, 768 and 1280 pixels wide: no sideways scrolling, no overlapping text.
- Keyboard use, visible focus, labelled controls and colour contrast, checked page by page with the axe accessibility checker at desktop and phone width (no remaining issues).
- The site works with JavaScript off (the core content and links); the interactive parts need it.
- Tested in Chrome. Please also check Safari and Firefox, and a real phone, before launch.

## Real audio

The player is a simulation: the episodes have no audio files, so it keeps time itself and remembers where each listener stopped. To play real audio, give each episode an `audio` address in its file and replace the timing code in `src/days/day-053/player.ts` with an `<audio>` element that reads the same saved position. The mini-player, chapters and library will keep working.

## Honest limits

- The photographs are stock images that stand in for the business's own. Replace them with real photographs before launch.
- Names, addresses, phone numbers and email addresses are stand-ins. Replace them with the real ones everywhere (search the `src` folder), including the Privacy page.
