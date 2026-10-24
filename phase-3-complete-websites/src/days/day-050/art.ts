/** Day 050 · Citrus & Salt · every recipe gets a top-down plate illustration generated from its hue and title. */
function rng(seed: string) {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 2654435761); h = (h << 13) | (h >>> 19); }
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
}

export function dish(title: string, hue: number): string {
  const r = rng(title);
  const bg = `hsl(${(hue + 30) % 360} 85% 88%)`, plate = '#fffdf6', a = `hsl(${hue} 80% 52%)`, b = `hsl(${(hue + 35) % 360} 85% 62%)`, c = `hsl(${(hue + 120) % 360} 45% 38%)`, d = `hsl(${(hue + 190) % 360} 55% 30%)`;
  const o: string[] = [`<svg viewBox="0 0 400 300" role="img" aria-label="Illustration of ${title.replace(/"/g, '')}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="${bg}"/>`];
  for (let i = 0; i < 6; i++) o.push(`<circle cx="${(r() * 400).toFixed(0)}" cy="${(r() * 300).toFixed(0)}" r="${(8 + r() * 26).toFixed(0)}" fill="${b}" opacity="0.18"/>`);
  o.push(`<circle cx="200" cy="154" r="128" fill="#000" opacity="0.08"/><circle cx="200" cy="148" r="126" fill="${plate}"/><circle cx="200" cy="148" r="126" fill="none" stroke="${d}" stroke-opacity="0.2" stroke-width="3"/><circle cx="200" cy="148" r="98" fill="none" stroke="${d}" stroke-opacity="0.12" stroke-width="2"/>`);
  for (let i = 0; i < 16; i++) {
    const ang = r() * 6.283, rad = r() * 82, x = 200 + Math.cos(ang) * rad, y = 148 + Math.sin(ang) * rad, s = 8 + r() * 20;
    const col = [a, b, c, d][Math.floor(r() * 4)], k = r();
    if (k < 0.4) o.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(s * 0.6).toFixed(0)}" fill="${col}"/>`);
    else if (k < 0.75) o.push(`<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${s.toFixed(0)}" ry="${(s * 0.5).toFixed(0)}" fill="${col}" transform="rotate(${(r() * 180).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`);
    else o.push(`<path d="M${x.toFixed(0)} ${y.toFixed(0)}q${(s).toFixed(0)} ${(-s).toFixed(0)} ${(s * 2).toFixed(0)} 0" stroke="${col}" stroke-width="${(3 + r() * 3).toFixed(0)}" fill="none" stroke-linecap="round"/>`);
  }
  o.push(`<g transform="translate(330 40) rotate(20)"><path d="M0 0c0-14 24-14 24 0 0 14-12 28-12 28S0 14 0 0z" fill="#f7d046"/><path d="M12 6v18" stroke="#e5b800" stroke-width="2"/></g></svg>`);
  return o.join('');
}
