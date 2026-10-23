/** Day 049 · Brightside Dental · the seven things people arrive worried about, and the plain answer to each. Plain data: no images, so the page script can read it too. */
export interface Concern {
  id: string;
  chip: string;
  answer: string;
  /** The treatment this points to (id of a treatments entry), or null when the answer is about money. */
  treatment: string | null;
  /** Buttons for answers that are not about one treatment. */
  links?: [string, string][];
}

export const CONCERNS: Concern[] = [
  { id: 'pain', chip: 'My tooth hurts', treatment: 'emergency', answer: 'Tell us when it started and whether it wakes you at night. We hold same-day slots every morning and we see people in pain before routine appointments. The aim is to stop the pain first and plan the fix once you are comfortable.' },
  { id: 'nervous', chip: 'I’m nervous', treatment: 'check-up', answer: 'Plenty of our patients are. Book the check-up, tell us at the door and we will agree a hand signal so you can stop at any point. We explain everything before we do it, and nothing happens without your say-so. There is no telling-off for how long it has been.' },
  { id: 'cost', chip: 'How much will it cost?', treatment: null, links: [['Try the membership calculator', 'membership/'], ['See every price', 'treatments/']], answer: 'Every price is on its treatment page and in writing before we start, so there are no surprises on the day. If you mostly need a check-up and a clean, the £19 a month membership can work out cheaper. Our calculator tells you honestly when it does not.' },
  { id: 'smile', chip: 'I want a nicer smile', treatment: 'whitening', answer: 'Whitening is done by your dentist, with trays made to fit you, and lifts teeth by up to eight shades. If crowding is what bothers you, clear aligners are the other route, and a check-up first tells you which one suits your teeth.' },
  { id: 'child', chip: 'It’s for my child', treatment: 'children', answer: 'A first visit is mostly looking, counting teeth and getting used to the chair. Your child can sit on your lap, hold the mirror and say no to anything. We keep a short chart of what brushing is working, and it goes home with you.' },
  { id: 'missing', chip: 'I’m missing a tooth', treatment: 'implants', answer: 'An implant replaces the root as well as the tooth, so it feels and works like your own. It takes several appointments over a few months, and a scan at the first one shows whether there is enough bone. We tell you the full price before you commit to anything.' },
  { id: 'checkup', chip: 'I just need a check-up', treatment: 'check-up', answer: 'A thorough exam, X-rays only if they are useful, and a polish that lifts surface stains. We will tell you what is fine, what to keep an eye on and what needs treatment, with prices, in writing.' },
];
