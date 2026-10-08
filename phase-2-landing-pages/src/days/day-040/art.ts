/**
 * Day 040 · Halide & Co. · “photographs” composed in code: four genres, six palettes each.
 * Drawn on a 300 × 400 canvas and cropped to fit by the page.
 */
export type Kind = 'wedding' | 'portrait' | 'travel' | 'brand';

const PAL: Record<Kind, [string, string, string][]> = {
  wedding: [['#f6d9c0', '#e6a98a', '#fff4e8'], ['#e9dccb', '#b79a7a', '#fffaf2'], ['#d9e3e6', '#8fa8b1', '#ffffff']],
  portrait: [['#3a2d3f', '#c98a6a', '#f5d6bf'], ['#1d2a38', '#7fa6bf', '#f1d9c8'], ['#4a3b2a', '#d9a35f', '#f4dcc3']],
  travel: [['#f6b17a', '#6a4c93', '#fff1d6'], ['#9fd0e8', '#3d6f94', '#ffffff'], ['#f3c98b', '#a34e3c', '#fff5e0']],
  brand: [['#e8e0d4', '#2c3a34', '#d96a3b'], ['#f2e8e1', '#6b4b3e', '#9cb59a'], ['#dfe6ea', '#243447', '#e9b44c']],
};

export function photo(kind: Kind, v: number, label = '') {
  const [a, b, c] = PAL[kind][v % 3];
  const id = 'p' + Math.random().toString(36).slice(2, 7);
  const bokeh = Array.from({ length: 9 }, (_, i) => `<circle cx="${(i * 71 + v * 37) % 300}" cy="${(i * 53 + v * 29) % 220 + 20}" r="${10 + (i % 4) * 7}" fill="${c}" opacity="${0.16 + (i % 3) * 0.07}"/>`).join('');
  let g = '';
  if (kind === 'wedding') g = `${bokeh}<path d="M60 400V190a90 90 0 0 1 180 0v210z" fill="none" stroke="${c}" stroke-width="10" opacity=".8"/>${Array.from({ length: 14 }, (_, i) => { const t = (i / 13) * Math.PI; return `<circle cx="${150 - Math.cos(t) * 90}" cy="${190 - Math.sin(t) * 120}" r="${9 + (i % 3) * 4}" fill="${i % 2 ? c : '#f2a7a0'}"/>`; }).join('')}<ellipse cx="120" cy="290" rx="26" ry="70" fill="#1d1a22"/><circle cx="120" cy="198" r="19" fill="#1d1a22"/><path d="M178 214c-18 0-24 20-24 48l-8 128h60l-8-128c0-28-8-48-20-48z" fill="${c}"/><circle cx="178" cy="196" r="17" fill="#3a2a26"/><path d="M160 180q18-18 36 0v26q-18-6-36 0z" fill="${c}" opacity=".7"/>`;
  if (kind === 'portrait') g = `${bokeh}<ellipse cx="150" cy="430" rx="130" ry="120" fill="${b}"/><rect x="132" y="250" width="36" height="60" fill="${c}"/><ellipse cx="150" cy="200" rx="52" ry="68" fill="${c}"/><path d="M98 190q-6-84 52-82t52 82q-14-44-52-40t-52 40z" fill="#1a1417"/><path d="M104 200q-4-60 46-62" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>`;
  if (kind === 'travel') g = `<circle cx="214" cy="118" r="36" fill="${c}"/><path d="M0 330V220l60-70 50 60 50-90 70 110 70-80v180z" fill="${b}"/><path d="M0 400V320q80-30 160 0t140-8v88z" fill="${a}" opacity=".5"/><path d="M0 400V350q80-20 150 0t150-4v54z" fill="#17313f" opacity=".6"/>`;
  if (kind === 'brand') g = `<rect width="300" height="400" fill="${a}"/><circle cx="104" cy="140" r="64" fill="#fff"/><circle cx="104" cy="140" r="48" fill="${b}"/><path d="M168 130h30a22 22 0 0 1 0 44h-30" fill="none" stroke="#fff" stroke-width="8"/><rect x="40" y="240" width="170" height="120" rx="8" fill="${c}" transform="rotate(-6 125 300)"/><rect x="56" y="262" width="104" height="8" fill="#fff" opacity=".6" transform="rotate(-6 125 300)"/><rect x="56" y="282" width="76" height="8" fill="#fff" opacity=".4" transform="rotate(-6 125 300)"/><path d="M230 400q-20-80 20-130 10 60-20 130zM250 400q10-60 50-80-14 50-50 80z" fill="#4c7a56"/>`;
  return `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><defs><linearGradient id="${id}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${kind === 'brand' ? a : b}"/></linearGradient><filter id="${id}n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .18 0"/></filter></defs>${kind === 'brand' ? '' : `<rect width="300" height="400" fill="url(#${id})"/>`}${g}<rect width="300" height="400" filter="url(#${id}n)" opacity=".5"/></svg>`;
}
