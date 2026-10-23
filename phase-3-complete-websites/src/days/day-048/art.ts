/**
 * Day 048 · The Meridian · cover illustrations. Each article gets an abstract picture made in code,
 * styled by its section (orbits, arches, skyline, plates) and tinted by the article's own hue.
 */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h += 0x6d2b79f5; let t = Math.imul(h ^ (h >>> 15), 1 | h); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const SECTION_COLOUR: Record<string, string> = { Science: '#0e9f7e', Culture: '#6d4cf0', Cities: '#2563eb', Food: '#e86a10' };

export function cover(section: string, title: string, hue: number): string {
  const r = rng(title);
  const bg = `hsl(${hue} 70% 90%)`, a = `hsl(${hue} 78% 42%)`, b = `hsl(${(hue + 40) % 360} 85% 58%)`, c = `hsl(${(hue + 200) % 360} 60% 18%)`, d = `hsl(${(hue + 340) % 360} 90% 66%)`;
  const o: string[] = [`<svg viewBox="0 0 400 300" role="img" aria-label="Illustration for ${section}: ${title.replace(/"/g, '')}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="${bg}"/>`];
  if (section === 'Science') {
    const cx = 120 + r() * 160, cy = 110 + r() * 80;
    for (let i = 6; i >= 1; i--) o.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${i * 24}" fill="none" stroke="${i % 2 ? a : c}" stroke-width="${i % 2 ? 2 : 1}" opacity="${(0.25 + i * 0.1).toFixed(2)}"/>`);
    o.push(`<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="26" fill="${b}"/>`);
    for (let i = 0; i < 5; i++) { const ang = r() * 6.28, rad = 40 + r() * 100; o.push(`<circle cx="${(cx + Math.cos(ang) * rad).toFixed(0)}" cy="${(cy + Math.sin(ang) * rad).toFixed(0)}" r="${(5 + r() * 9).toFixed(0)}" fill="${i % 2 ? d : c}"/>`); }
  } else if (section === 'Culture') {
    const n = 5 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) { const w = 400 / n; const h = 120 + r() * 140; const x = i * w; o.push(`<path d="M${x.toFixed(0)} 300 V${(300 - h).toFixed(0)} a${(w / 2).toFixed(0)} ${(w / 2).toFixed(0)} 0 0 1 ${w.toFixed(0)} 0 V300Z" fill="${[a, b, c, d][i % 4]}" opacity="${i % 2 ? 0.92 : 0.8}"/>`); }
    o.push(`<circle cx="${(60 + r() * 280).toFixed(0)}" cy="${(50 + r() * 40).toFixed(0)}" r="24" fill="${d}"/>`);
  } else if (section === 'Cities') {
    let x = 0;
    while (x < 400) { const w = 28 + r() * 40, h = 70 + r() * 170; o.push(`<rect x="${x.toFixed(0)}" y="${(300 - h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="${r() > 0.5 ? a : c}" opacity="${(0.6 + r() * 0.4).toFixed(2)}"/>`);
      for (let wy = 300 - h + 10; wy < 290; wy += 18) for (let wx = x + 6; wx < x + w - 8; wx += 12) if (r() > 0.55) o.push(`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="5" height="8" fill="${d}"/>`);
      x += w + 3; }
    o.push(`<circle cx="${(300 + r() * 60).toFixed(0)}" cy="${(40 + r() * 30).toFixed(0)}" r="26" fill="${b}"/>`);
  } else {
    const cx = 200, cy = 150;
    o.push(`<circle cx="${cx}" cy="${cy}" r="124" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="124" fill="none" stroke="${c}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="96" fill="none" stroke="${a}" stroke-width="1.5"/>`);
    for (let i = 0; i < 9; i++) { const ang = r() * 6.28, rad = r() * 78; o.push(`<ellipse cx="${(cx + Math.cos(ang) * rad).toFixed(0)}" cy="${(cy + Math.sin(ang) * rad).toFixed(0)}" rx="${(12 + r() * 20).toFixed(0)}" ry="${(8 + r() * 14).toFixed(0)}" fill="${[a, b, d, c][i % 4]}" transform="rotate(${(r() * 180).toFixed(0)} ${cx} ${cy})" opacity="0.9"/>`); }
  }
  o.push('</svg>');
  return o.join('');
}
