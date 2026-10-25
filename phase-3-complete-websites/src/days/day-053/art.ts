/** Day 053 · Static · cover art (a coloured waveform "sound wave" portrait) and the seeded waveform used by the full player. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h += 0x6d2b79f5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const hueOf = (hex: string) => {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  if (!d) return 0;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round((h * 60 + 360) % 360);
};

export function cover(title: string, hue: number, label = ''): string {
  const r = rng(title);
  const bg = `hsl(${hue} 70% 14%)`, a = `hsl(${hue} 95% 62%)`, b = `hsl(${(hue + 40) % 360} 95% 68%)`;
  const o: string[] = [`<svg viewBox="0 0 300 300" role="img" aria-label="${label || 'Cover art for ' + title.replace(/"/g, '')}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="300" height="300" fill="${bg}"/>`];
  o.push(`<circle cx="${(120 + r() * 60).toFixed(0)}" cy="${(110 + r() * 40).toFixed(0)}" r="${(70 + r() * 30).toFixed(0)}" fill="${a}" opacity=".18"/>`);
  const n = 26, w = 300 / n;
  for (let i = 0; i < n; i++) {
    const env = Math.sin((i / n) * Math.PI);
    const h = 14 + (0.25 + r() * 0.75) * env * 170;
    o.push(`<rect x="${(i * w + 2).toFixed(1)}" y="${(150 - h / 2).toFixed(1)}" width="${(w - 4).toFixed(1)}" height="${h.toFixed(1)}" rx="${((w - 4) / 2).toFixed(1)}" fill="${i % 3 ? a : b}"/>`);
  }
  o.push('</svg>');
  return o.join('');
}

/** `n` bar heights between 0.15 and 1, stable for a given episode. */
export function bars(seed: string, n = 72): number[] {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => Math.round((0.2 + r() * 0.8 * (0.6 + 0.4 * Math.sin((i / n) * Math.PI * 3))) * 100) / 100);
}
