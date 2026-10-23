/** Day 049 · Brightside Dental · opening hours, and a helper that says whether the clinic is open at a given moment. */
/** Index 0 is Sunday, to match Date.getDay(). Times are [open, close] in 24-hour hours, or null for closed. */
export const HOURS: ([number, number] | null)[] = [null, [8, 18], [8, 18], [8, 20], [8, 18], [8, 17], [9, 13]];
export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const clock = (h: number) => `${h > 12 ? h - 12 : h}${h >= 12 ? 'pm' : 'am'}`;

export function openState(now: Date): { open: boolean; text: string } {
  const h = HOURS[now.getDay()];
  const t = now.getHours() + now.getMinutes() / 60;
  if (h && t >= h[0] && t < h[1]) return { open: true, text: `Open now · until ${clock(h[1])}` };
  if (h && t < h[0]) return { open: false, text: `Closed · opens today at ${clock(h[0])}` };
  for (let i = 1; i <= 7; i++) {
    const next = HOURS[(now.getDay() + i) % 7];
    if (next) return { open: false, text: `Closed · opens ${i === 1 ? 'tomorrow' : DAY_NAMES[(now.getDay() + i) % 7]} at ${clock(next[0])}` };
  }
  return { open: false, text: 'Closed' };
}
