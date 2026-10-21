/**
 * Day 044 · Fathom · the home page's live forecast: the cash model and the big dark chart drawn from it.
 * Pure functions with no DOM, so the page can render the first view at build time and the script can redraw it on every slider move.
 */
import { gbp } from './chart';

export const START = 84000, SALES = 21000, COSTS = 19000, PAYROLL = 18000, FLOOR = 25000;

/** Thirteen weekly closing balances for a sales change (%), a new hire (£ a month) and customers paying late (days). */
export function model(growth: number, hire: number, late: number): number[] {
  const lateWeeks = Math.round(late / 7);
  let bal = START;
  return Array.from({ length: 13 }, (_, i) => {
    const income = (i < lateWeeks ? 0.4 : 1) * SALES * (1 + growth / 100);
    const cost = COSTS + (i >= 2 ? (hire * 12) / 52 : 0) + (i % 4 === 3 ? PAYROLL : 0);
    bal += income - cost;
    return Math.round(bal);
  });
}

/** The sentence under the headline: what the scenario means in plain words. */
export function verdict(pts: number[]): { text: string; bad: boolean } {
  const low = Math.min(...pts), wk = pts.indexOf(low) + 1;
  if (low < 0) return { bad: true, text: `You would run out of cash in week ${pts.findIndex((p) => p < 0) + 1}. Delay the hire or chase invoices sooner.` };
  if (low < FLOOR) return { bad: true, text: `Careful: week ${wk} dips below your ${gbp(FLOOR)} safety floor. A slower hire or faster payers would fix it.` };
  return { bad: false, text: `Comfortable: your lowest point is ${gbp(low)} in week ${wk}, above your ${gbp(FLOOR)} floor.` };
}

const NICE = [10000, 20000, 25000, 50000, 100000];
/** The forecast as an SVG string sized to the pixels it will be shown at, so its text is never stretched. */
export function heroChart(points: number[], baseline: number[], width: number, height: number): string {
  const padL = width < 560 ? 46 : 64, padR = width < 560 ? 12 : 24, padT = 28, padB = 36;
  const all = [...points, ...baseline, FLOOR, 0];
  let lo = Math.min(...all), hi = Math.max(...all);
  const span = hi - lo;
  lo -= span * 0.04; hi += span * 0.12;
  const x = (i: number) => padL + (i / (points.length - 1)) * (width - padL - padR);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (height - padT - padB);
  const step = NICE.find((n) => (hi - lo) / n <= 6) ?? 100000;
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);
  const path = (arr: number[]) => arr.map((v, i) => {
    if (i === 0) return `M${x(0).toFixed(1)} ${y(v).toFixed(1)}`;
    const cx = (x(i - 1) + x(i)) / 2;
    return `C${cx.toFixed(1)} ${y(arr[i - 1]).toFixed(1)} ${cx.toFixed(1)} ${y(v).toFixed(1)} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
  }).join(' ');
  const low = Math.min(...points), mi = points.indexOf(low), bad = low < FLOOR;
  const col = bad ? '#ff6a55' : '#7cf5c4';
  const line = path(points);
  const k = (n: number) => '£' + Math.round(n / 1000) + 'k';
  const lx = Math.min(Math.max(x(mi), padL + 90), width - padR - 90);
  const p: string[] = [];
  p.push(`<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Cash forecast for the next 13 weeks. Lowest balance ${gbp(low)} in week ${mi + 1}." xmlns="http://www.w3.org/2000/svg" data-ui>`);
  for (const t of ticks) p.push(`<path d="M${padL} ${y(t).toFixed(1)}H${width - padR}" stroke="#ffffff" stroke-opacity=".09"/><text x="${padL - 10}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="13" fill="#9aa8a1" font-family="Onest Variable, sans-serif">${k(t)}</text>`);
  for (let i = 0; i < points.length; i += width < 560 ? 4 : 2) p.push(`<text x="${x(i).toFixed(1)}" y="${height - 10}" text-anchor="middle" font-size="13" fill="#9aa8a1" font-family="Onest Variable, sans-serif">W${i + 1}</text>`);
  p.push(`<path d="M${padL} ${y(FLOOR).toFixed(1)}H${width - padR}" stroke="#ff6a55" stroke-width="2" stroke-dasharray="6 6"/><text x="${width - padR}" y="${(y(FLOOR) - 8).toFixed(1)}" text-anchor="end" font-size="13" font-weight="600" fill="#ff8f7e" font-family="Onest Variable, sans-serif">Safety floor ${k(FLOOR)}</text>`);
  p.push(`<path d="${path(baseline)}" fill="none" stroke="#9aa8a1" stroke-width="2.5" stroke-dasharray="2 7" stroke-linecap="round"/>`);
  p.push(`<path d="${line} L${x(points.length - 1).toFixed(1)} ${y(lo).toFixed(1)} L${x(0).toFixed(1)} ${y(lo).toFixed(1)}Z" fill="${col}" fill-opacity=".1"/>`);
  p.push(`<path class="fh__line" d="${line}" fill="none" stroke="${col}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`);
  p.push(`<circle cx="${x(mi).toFixed(1)}" cy="${y(low).toFixed(1)}" r="8" fill="#0c110f" stroke="${col}" stroke-width="4"/>`);
  p.push(`<text x="${lx.toFixed(1)}" y="${(y(low) + 34).toFixed(1)}" text-anchor="middle" font-size="15" font-weight="700" fill="${col}" font-family="Onest Variable, sans-serif">Lowest ${gbp(low)}, week ${mi + 1}</text>`);
  p.push('</svg>');
  return p.join('');
}
