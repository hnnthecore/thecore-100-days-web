/**
 * Day 044 · Fathom · drawing helpers: the cash-forecast line chart and the six feature icons.
 * Returns SVG markup as strings so the same code serves static pages and live (interactive) charts.
 */
export const gbp = (n: number) => (n < 0 ? '-' : '') + '£' + Math.round(Math.abs(n)).toLocaleString('en-GB');
export const gbpK = (n: number) => (n < 0 ? '-' : '') + '£' + (Math.abs(n) / 1000).toFixed(Math.abs(n) >= 100000 ? 0 : 1).replace(/\.0$/, '') + 'k';

export interface ChartOptions {
  /** Weekly closing balances. */
  points: number[];
  /** Optional second line to compare against (the baseline). */
  baseline?: number[];
  /** Floor line (the minimum balance you want to stay above). */
  floor?: number;
  width?: number;
  height?: number;
  /** Show axis labels and gridlines. */
  axes?: boolean;
  /** Unique id for gradient definitions when several charts share a page. */
  id: string;
}

export function forecastChart({ points, baseline, floor, width = 640, height = 260, axes = true, id }: ChartOptions): string {
  const padL = axes ? 52 : 8, padR = 12, padT = 16, padB = axes ? 30 : 8;
  const all = [...points, ...(baseline ?? []), floor ?? points[0]];
  let lo = Math.min(...all, 0), hi = Math.max(...all);
  const span = hi - lo || 1;
  lo -= span * 0.06; hi += span * 0.08;
  const x = (i: number) => padL + (i / (points.length - 1)) * (width - padL - padR);
  const y = (v: number) => padT + (1 - (v - lo) / (hi - lo)) * (height - padT - padB);
  const smooth = (arr: number[]) => arr.map((v, i) => {
    if (i === 0) return `M${x(0).toFixed(1)} ${y(v).toFixed(1)}`;
    const cx = (x(i - 1) + x(i)) / 2;
    return `C${cx.toFixed(1)} ${y(arr[i - 1]).toFixed(1)} ${cx.toFixed(1)} ${y(v).toFixed(1)} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`;
  }).join(' ');
  const line = smooth(points);
  const area = `${line} L${x(points.length - 1).toFixed(1)} ${y(lo).toFixed(1)} L${x(0).toFixed(1)} ${y(lo).toFixed(1)}Z`;
  const minIdx = points.indexOf(Math.min(...points));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => lo + t * (hi - lo));
  const parts: string[] = [];
  parts.push(`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Cash forecast over ${points.length} weeks. Lowest balance ${gbp(points[minIdx])} in week ${minIdx + 1}." xmlns="http://www.w3.org/2000/svg">`);
  parts.push(`<defs><linearGradient id="${id}-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d5afe" stop-opacity=".28"/><stop offset="1" stop-color="#3d5afe" stop-opacity="0"/></linearGradient><linearGradient id="${id}-l" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3d5afe"/><stop offset="1" stop-color="#12d6a4"/></linearGradient></defs>`);
  if (axes) {
    for (const t of ticks) parts.push(`<line x1="${padL}" x2="${width - padR}" y1="${y(t).toFixed(1)}" y2="${y(t).toFixed(1)}" stroke="#0a1230" stroke-opacity=".08"/><text x="${padL - 8}" y="${(y(t) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#5b6485" font-family="JetBrains Mono Variable, monospace">${gbpK(t)}</text>`);
    for (let i = 0; i < points.length; i += 3) parts.push(`<text x="${x(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" fill="#5b6485" font-family="JetBrains Mono Variable, monospace">W${i + 1}</text>`);
  }
  if (floor !== undefined) parts.push(`<line x1="${padL}" x2="${width - padR}" y1="${y(floor).toFixed(1)}" y2="${y(floor).toFixed(1)}" stroke="#ff6b57" stroke-width="1.5" stroke-dasharray="5 5"/>${axes ? `<text x="${width - padR}" y="${(y(floor) - 6).toFixed(1)}" text-anchor="end" font-size="11" font-weight="700" fill="#e0452f">Safety floor ${gbpK(floor)}</text>` : ''}`);
  if (baseline) parts.push(`<path d="${smooth(baseline)}" fill="none" stroke="#0a1230" stroke-opacity=".35" stroke-width="2" stroke-dasharray="2 6" stroke-linecap="round"/>`);
  parts.push(`<path d="${area}" fill="url(#${id}-a)"/><path class="fa-draw" d="${line}" fill="none" stroke="url(#${id}-l)" stroke-width="3.5" stroke-linecap="round" pathLength="1"/>`);
  const below = floor !== undefined && points[minIdx] < floor;
  parts.push(`<circle cx="${x(minIdx).toFixed(1)}" cy="${y(points[minIdx]).toFixed(1)}" r="6" fill="#fff" stroke="${below ? '#ff6b57' : '#3d5afe'}" stroke-width="3"/>`);
  if (axes) {
    const lx = Math.min(Math.max(x(minIdx), padL + 60), width - padR - 60);
    parts.push(`<text x="${lx.toFixed(1)}" y="${(y(points[minIdx]) + 24).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="800" fill="${below ? '#e0452f' : '#0a1230'}">Lowest: ${gbp(points[minIdx])}</text>`);
  }
  parts.push('</svg>');
  return parts.join('');
}

/** A believable 13-week balance curve used for static mock-ups. */
export function demoPoints(seed = 1): number[] {
  const out: number[] = [];
  let bal = 84000;
  for (let i = 0; i < 13; i++) {
    const wave = Math.sin((i + seed) * 0.9) * 6200;
    const payroll = i % 4 === 3 ? -21000 : 0;
    bal += 4200 + wave + payroll;
    out.push(Math.round(bal));
  }
  return out;
}

const ICONS: Record<string, string> = {
  line: '<path d="M3 17l5-6 4 3 8-9" /><path d="M3 21h18" />',
  branch: '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="12" r="2.2"/><path d="M6 7.2v9.6M8 6c6 0 8 2 8 4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/>',
  bell: '<path d="M6 17V11a6 6 0 0112 0v6l1.5 2h-15z"/><path d="M10 21h4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.3c2.4.2 4 2 4 4.7"/>',
};
export function icon(name: string, size = 24): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] ?? ''}</svg>`;
}

/** Initial-letter logo mark for a customer, drawn as a rounded tile. */
export function mark(name: string, colour: string, size = 44): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 44 44" aria-hidden="true"><rect width="44" height="44" rx="12" fill="${colour}"/><text x="22" y="29" text-anchor="middle" font-size="21" font-weight="800" fill="#fff" font-family="Manrope Variable, sans-serif">${name[0]}</text></svg>`;
}
