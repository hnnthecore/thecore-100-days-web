# Day 035 · Car dealership landing page: “Apex Motor Group”

An approved-used car dealer in the East Midlands (fictional). The brief to myself: **a clean showroom, not a classified-ads page**. It uses off-white, ink black and one signal red, with racing-stripe accents and spec lines set in monospace. **Inter** at its heaviest weight carries the headlines, and **JetBrains Mono** handles the numbers. All cars are drawn in code (five body styles, any colour), so there are no photos.

**Open it:** `phase-2-landing-pages/site/day-035-car-dealership/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + colour studio** | A car on a moving road line. Choose a body style and one of six colours, and it redraws. “See matching cars” filters the stock to that body style |
| 2 | **Stock & compare** | Nine cars with filters (body, fuel, max price), sorting and a live count. Each card shows an illustrative “from £X/mo”. Tick up to three and open a **native `<dialog>` comparison table** that highlights the best price, newest year and lowest mileage |
| 3 | **Finance calculator** | Pick a car, then HP or PCP, deposit, term and APR. You get the monthly payment, total payable and (for PCP) the final payment, with a donut chart of deposit versus car cost versus interest |
| 4 | **Part-exchange** | Enter a number plate (validated as a UK format, with the age identifier decoded into a year), mileage, condition and service history for a valuation range that's guaranteed for 7 days |
| 5 | **100-point check** | A ring that counts up to 100 as it scrolls in, and eight categories (engine, brakes, electrics, history…) in an accordion listing what is actually checked |
| 6 | **Test drive** | Choose the car, a day and a time (availability depends on the car and date), add your details and confirm your licence. The summary shows the car, price and any part-exchange |

## The numbers

- Finance uses the standard annuity formula. PCP assumes a final payment of 40% of the price, discounted, and terms cap at 48 months. The donut shows the deposit, the financed car cost and the interest as shares of the total.
- Part-exchange: `base price × 0.82^age`, reduced for mileage above 9,000 a year, then multiplied by condition (1.0, 0.94, 0.85 or 0.72) and 0.95 without full service history. The make and model are generated from the plate for the demo and the page says so.

## Accessibility

- The comparison opens with `showModal()`: focus is trapped, Esc closes, and focus returns to the button that opened it. Clicking the backdrop closes it too.
- Filters and body or colour choices use `aria-pressed`. The colour swatches have names, and the result count, finance result and valuation are live regions.
- Compare checkboxes disable themselves at three. The accordion is native `<details>`, and the plate field has a text label plus an error message.
- “Reduce motion” stops the road line, card entrance animations and the ring and donut transitions.

## Notes

Apex is a fictional dealership. Cars, prices and finance figures are demo content and not a credit offer. Nothing is sent.

## Photography

I kept the drawn cars on this page on purpose. The colour studio and stock cards change body style and colour live, which a photograph cannot do, and every real car photo I found showed a manufacturer badge or showroom brand name (SEAT, Nissan, Mazda and others), which would clash with the fictional "Apex Motor Group". Add dealer-supplied photos of the actual stock when the real business provides them.

### Layout redesign

The hero is now a night showroom: a black hero with a red racing stripe and the colour studio as a lit display stand.

### Navigation redesign

The header is now a boxed bar with a heavy rule and squared tabs, and the sections follow a different order from the other days.

### Stock photography

The nine stock cards and the test-drive summary now show real photographs from Pexels (free to use): golf 32447516, m3 39414339, rav4 2036544, 3t 32724481, tt 14666502, niro 11320632, fiesta 12310882, v60 15941295, cclass 16284837. They are mood-matched stand-ins: the model is right but the colour, trim and plates are not those of the fictional stock, so a real dealer would replace them with its own. The hero colour studio keeps its drawn car because it recolours live as you pick a body style and colour.
