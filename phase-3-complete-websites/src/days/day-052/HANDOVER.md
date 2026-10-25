# Stillwater · handover note

For whoever looks after this site after it is delivered. Plain steps, no jargon.

## What is in the folder

`phase-3-complete-websites/site/day-052-yoga-studio/` is the finished website: open `index.html` in a browser, or upload the whole folder to any web host. It is plain HTML, CSS and JavaScript, so it needs no server software.

The source is in `phase-3-complete-websites/src/`. You only need it if you want to change the site.

## Changing the words

- Classes: one file per class in `src/content/day-052/classes/`. Change the title, tagline, level or the text under the dashes.
- Teachers: `src/content/day-052/teachers/`.
- The weekly timetable (days, times, rooms, capacity): `src/days/day-052/schedule.ts`, the list called `WEEK`.
- Prices and the first-class offer: `src/pages/day-052-yoga-studio/pricing.astro` and the home page.

Then rebuild (see below).

## Changing the photographs

- Class photographs: `src/assets/day-052-classes/` (keep the file names, or update `src/days/day-052/photos.ts`).
- Teacher portraits: `src/assets/day-052-team/`.
- Home page photos: `src/assets/day-052/`.

Keep each photograph under about 2 MB. The build makes the small, fast versions for you.

## Colours, fonts and the logo

- Colours and spacing are at the top of `src/days/day-052/styles.css`.
- The reasoning behind the design is in `src/days/day-052/DESIGN.md`.
- The logo and the favicons come from `scripts/make-brand.mjs` (the entry named `day-052-yoga-studio`). Edit it and run `node scripts/make-brand.mjs`.

## Rebuilding after a change

1. Install Node.js (version 20 or newer) from nodejs.org.
2. In the `phase-3-complete-websites` folder run `npm install` once, then `npm run build`.
3. The finished site appears in `site/day-052-yoga-studio/`. Upload that folder.

## Putting it on your own address

1. Upload the `day-052-yoga-studio` folder so its files sit at the top of your domain.
2. In `src/layouts/Site.astro` and `scripts/seo.mjs` change the web address (the line starting `const ORIGIN`) to your domain, then rebuild. This makes the share image and the sitemap use your real address.
3. The build also writes `sitemap.xml`, `robots.txt` and `404.html`. If your host asks for a custom error page, point it at `404.html`.

## Forms

The booking dialog and the contact form check what people type, but they do not send anything yet. Bookings are kept in the visitor's own browser. To take real bookings you need a booking system or a small back end (many studios use a booking service and link to it), and a way to send confirmation emails. Decide where messages should go, then connect the forms.

## Analytics and cookies

None are installed, and the site sets no cookies (see the Cookies page). If you add analytics later, update the Privacy and Cookies pages to say so, and add a consent banner if the tool uses cookies.

## Speed

The home page loads about 185 KB in total before the lazy-loaded photographs (HTML, styles, scripts and fonts). Photographs are converted to WebP and sized for the screen by the build, and load only when they come into view. No third-party scripts or fonts are requested.

## Search and sharing

Every page has its own title and description. The home and detail pages carry structured data (schema.org) that search engines use for rich results. Sharing a link shows a 1200 × 630 picture (`og.png` in the site folder). A styled 404 page, `sitemap.xml` and `robots.txt` are generated on every build.

## What was tested

- Layout at 360, 768 and 1280 pixels wide: no sideways scrolling, no overlapping text.
- Keyboard use, visible focus, labelled controls and colour contrast, checked page by page with the axe accessibility checker at desktop and phone width (no remaining issues).
- The site works with JavaScript off (the core content and links); the interactive parts need it.
- Tested in Chrome. Please also check Safari and Firefox, and a real phone, before launch.

## The breathing pacer

It is a CSS animation of ten seconds (four counts in, six out) started by a button. The timing is in `src/days/day-052/styles.css` (`sw-breath`) and the words in the home page script.

## Honest limits

- The photographs are stock images that stand in for the business's own. Replace them with real photographs before launch.
- Names, addresses, phone numbers and email addresses are stand-ins. Replace them with the real ones everywhere (search the `src` folder), including the Privacy page.
