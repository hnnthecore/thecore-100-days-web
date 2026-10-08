# Day 037 · Veterinary clinic landing page: “Pawprint Veterinary Care”

A friendly small-animal clinic in Norwich (fictional). The brief to myself: **reassure the worried owner and entertain the pet**. It uses cream, deep pine green, sunshine yellow and coral, with round shapes everywhere and a portrait that blinks, wiggles its ears and pants. Headlines are **Fraunces** (soft and warm) and the interface is **Nunito**. All the animals are drawn in code.

**Open it:** `phase-2-landing-pages/site/day-037-veterinary/index.html`

## The six signature sections

| # | Section | What it does |
|---|---------|--------------|
| 1 | **Hero + pet picker** | An open-now status calculated from clinic hours, then a dog, cat or rabbit portrait to choose from. Each has its own colour, tip and animation, and choosing one also sets the care timeline below |
| 2 | **Care timeline** | Dog / cat / rabbit × young / adult / senior. A paw-print timeline of what your pet needs and when: vaccines, microchip, neutering, parasite control, dental and senior screening |
| 3 | **Symptom checker** | Pick a species and tick what you're seeing among 17 signs. It ranks the **highest** concern: Emergency, Urgent today, Book soon or Monitor, with plain steps. Rabbits get a special rule (not eating is an emergency). Emergencies lead to the phone number, not a form |
| 4 | **Feeding calculator** | Weight, life stage and body shape give daily calories, dry and wet food in grams and a treat allowance, using the standard energy formula (70 × kg^0.75). A bowl fills to show the portion. Rabbits get pellets plus “unlimited hay” |
| 5 | **Meet the vets** | Four team members you can filter by what they know (dogs, cats, rabbits, dental, surgery). Others dim, and “Book with …” pre-selects them |
| 6 | **Book a visit** | Pet name and species, reason, preferred vet, an urgent toggle (skips scheduling) or a day and time. A live summary card shows the pet's portrait |

## Design decisions

- **Safety first.** The checker leads with the most serious thing you tick and says so clearly. It always ends with “this is general guidance, not a diagnosis”.
- Breed-specific and weight-specific advice is deliberately kept general: the aim is to get people to the vet at the right speed, not to replace one.

## Accessibility

- Pet buttons, life-stage buttons and vet filters use `aria-pressed`. The advice panel, timeline and food result are live regions.
- Symptoms are real checkboxes with visible tick boxes. Severity is written in words as well as colour.
- Booking controls are native, and the urgent option hides the scheduling fieldset instead of leaving it hidden-but-focusable.
- “Reduce motion” stops the bobbing, blinking, ear-wiggle, panting and entrance animations.

## Notes

Pawprint is a fictional clinic. Prices, vets and the emergency number are demo content, and nothing is sent.

## Photography

The photo band under the hero uses real photographs from Unsplash (free for commercial use, no attribution required), stored in `src/assets/day-037/` and converted to WebP at build time. I skipped photos that showed a real person's name badge and a branded smartwatch screen. The pet picker, vet avatars and calculators keep their drawn animals because they change as you interact.

| Use | Photo | Source |
| --- | --- | --- |
| Band, left | Vet examining a dachshund | https://unsplash.com/photos/e4f87NzUJsU |
| Band, right | Fur trim on an examination table | https://unsplash.com/photos/I3KxEBS6iOc |

### Pet photos

The hero pet picker, the booking summary and the team avatars now show real animal photographs from Pexels (free to use): golden retriever 30810890, cat 39497325, rabbit 34451824, beagle 38010. The hero and booking photos are embedded in the script so they work from disk. The symptom checker keeps its own artwork.
