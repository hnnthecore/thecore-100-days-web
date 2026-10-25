/** Day 052 · Stillwater · every class gets a soft "aura" artwork: layered rings, a rising sun and gentle hills in the class's own colour. */
export function aura(hue: number, id: string, label = ''): string {
  const a = `hsl(${hue} 70% 82%)`, b = `hsl(${(hue + 30) % 360} 80% 70%)`, c = `hsl(${(hue + 330) % 360} 55% 38%)`, d = `hsl(${hue} 45% 94%)`;
  const g = 'a' + id.replace(/\W/g, '');
  return `<svg viewBox="0 0 400 300" role="img" aria-label="${label || 'Artwork'}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
  <defs><radialGradient id="${g}" cx="50%" cy="62%" r="70%"><stop offset="0" stop-color="${d}"/><stop offset="0.6" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs>
  <rect width="400" height="300" fill="url(#${g})"/>
  <g fill="none" stroke="#fff" stroke-opacity=".55">${[1, 2, 3, 4, 5].map((i) => `<circle cx="200" cy="190" r="${i * 34}" stroke-width="${i % 2 ? 1.5 : 0.8}"/>`).join('')}</g>
  <circle cx="200" cy="190" r="46" fill="${b}"/><circle cx="200" cy="190" r="46" fill="#fff" fill-opacity=".35"/>
  <path d="M0 240C70 200 120 250 200 226s140-44 200 0V300H0z" fill="${c}" fill-opacity=".85"/>
  <path d="M0 270C90 240 150 280 240 258s110-20 160 0V300H0z" fill="${c}"/>
</svg>`;
}
