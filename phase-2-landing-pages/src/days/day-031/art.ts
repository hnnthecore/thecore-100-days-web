/**
 * Day 031 · The Saltmarsh · illustrations drawn in code.
 * `view()` paints the landscape seen through a window; `room()` places a window and a bed in a room.
 */
export type View = 'sea' | 'marsh' | 'garden' | 'courtyard' | 'dunes';

/** Landscape for a 160 × 100 window, drawn at the origin. */
export function view(v: View, id: string) {
  const sky: Record<View, [string, string]> = {
    sea: ['#bfe3ee', '#f6e8cf'], marsh: ['#f5d9b8', '#fbeede'], garden: ['#cfe6f2', '#f4f1dd'], courtyard: ['#d9e6ee', '#f3ede3'], dunes: ['#a9d3e6', '#f7e9cd'],
  };
  const [a, b] = sky[v];
  const defs = `<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  let body = '';
  if (v === 'sea') body = `<circle class="hl-sun" cx="112" cy="46" r="11" fill="#fff4cf"/><rect y="58" width="160" height="42" fill="#5f9fb1"/>${[64, 72, 80, 90].map((y, i) => `<path class="hl-wave" d="M${-10 + i * 7} ${y}q10-5 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" fill="none" stroke="#e9f7f8" stroke-opacity=".7" stroke-width="1.4"/>`).join('')}<path d="M0 90q50-10 160 2v8H0z" fill="#e8d3a8"/>`;
  if (v === 'marsh') body = `<circle class="hl-sun" cx="40" cy="58" r="12" fill="#ffd9a0"/><rect y="64" width="160" height="36" fill="#a9b9a0"/><path d="M0 76h160M0 86h160" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/>${Array.from({ length: 22 }, (_, i) => `<path d="M${6 + i * 7} 100q${i % 2 ? -3 : 3}-18 ${i % 3 - 1} -34" stroke="#7d7a4c" stroke-width="1.4" fill="none"/>`).join('')}`;
  if (v === 'garden') body = `<circle cx="120" cy="36" r="9" fill="#fff8d6"/><rect y="62" width="160" height="38" fill="#8fb36e"/><circle cx="36" cy="54" r="24" fill="#6f9a56"/><rect x="33" y="64" width="6" height="26" fill="#7b5b3a"/><path d="M70 70q20-18 50 0v30H70z" fill="#7ea862"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${14 + i * 13}" cy="${90 + (i % 3) * 3}" r="2.2" fill="${['#f08aa0', '#fff', '#f6c453'][i % 3]}"/>`).join('')}`;
  if (v === 'courtyard') body = `<rect y="30" width="160" height="70" fill="#c98a6b"/>${Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, c) => `<rect x="${c * 18 - (r % 2) * 9}" y="${34 + r * 11}" width="16" height="9" fill="#d89d7f" stroke="#b97b5c" stroke-width=".6"/>`).join('')).join('')}<path d="M10 28q70 14 140 0" fill="none" stroke="#6b5b49" stroke-width="1"/>${[24, 52, 80, 108, 136].map((x, i) => `<circle cx="${x}" cy="${36 + Math.sin(i + 1) * 4 + 4}" r="3" fill="#ffe08a"/>`).join('')}<rect x="26" y="78" width="16" height="22" rx="3" fill="#b5654a"/><circle cx="34" cy="70" r="12" fill="#6f9a56"/><rect x="108" y="82" width="14" height="18" rx="3" fill="#b5654a"/><circle cx="115" cy="74" r="10" fill="#7fae62"/>`;
  if (v === 'dunes') body = `<circle cx="124" cy="40" r="10" fill="#fff4cf"/><path d="M0 70q40-26 80-4t80-12v46H0z" fill="#ecd7a5"/><path d="M0 84q50-22 110-4t50-4v24H0z" fill="#dcc08a"/>${[16, 40, 70, 100, 130].map((x, i) => `<path d="M${x} ${96 - (i % 2) * 6}q-6-16-10-18m10 18q0-18 2-22m-2 22q8-14 12-16" stroke="#7d8c4a" stroke-width="1.4" fill="none"/>`).join('')}`;
  return { defs, body: `<rect width="160" height="100" fill="url(#${id}sky)"/>${body}` };
}

/** A whole room: wall, window with the view, bed, lamp. `tone` is the wall colour, `accent` the bed throw. */
export function room(v: View, tone: string, accent: string, king = true, label = '') {
  const id = 'r' + Math.random().toString(36).slice(2, 7);
  const sc = view(v, id);
  const bedW = king ? 150 : 120;
  const bx = 160 - bedW / 2;
  return `<svg viewBox="0 0 320 200" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} preserveAspectRatio="xMidYMid slice">
    <defs>${sc.defs}<clipPath id="${id}c"><path d="M80 122V102a80 80 0 0 1 160 0v20z"/></clipPath></defs>
    <rect width="320" height="200" fill="${tone}"/>
    <rect y="150" width="320" height="50" fill="#000" opacity=".08"/>
    <g clip-path="url(#${id}c)"><g transform="translate(80 22)">${sc.body}</g></g>
    <path d="M80 122V102a80 80 0 0 1 160 0v20z" fill="none" stroke="#fff" stroke-width="5"/><path d="M160 22v100M80 72h160" stroke="#fff" stroke-width="3"/>
    <rect x="${bx - 8}" y="104" width="${bedW + 16}" height="30" rx="8" fill="#5b4636"/>
    <rect x="${bx}" y="120" width="${bedW}" height="46" rx="10" fill="#fbf7ef"/>
    <rect x="${bx}" y="142" width="${bedW}" height="24" rx="8" fill="${accent}"/>
    <rect x="${bx + 12}" y="112" width="${bedW / 2 - 18}" height="16" rx="7" fill="#fff"/><rect x="${bx + bedW / 2 + 6}" y="112" width="${bedW / 2 - 18}" height="16" rx="7" fill="#fff"/>
    <rect x="${bx + 4}" y="164" width="6" height="14" fill="#5b4636"/><rect x="${bx + bedW - 10}" y="164" width="6" height="14" fill="#5b4636"/>
    <g><rect x="${bx - 40}" y="140" width="22" height="30" rx="3" fill="#8a6a4d"/><path d="M${bx - 29} 140v-14" stroke="#555" stroke-width="2"/><path d="M${bx - 39} 126h20l-4-14h-12z" fill="#f4d8a0"/></g>
  </svg>`;
}
