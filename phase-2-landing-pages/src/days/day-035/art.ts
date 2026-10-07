/**
 * Day 035 · Apex Motor Group · cars drawn in code (side profile, facing right).
 * One function draws every body type in any colour, so the stock grid and hero need no photographs.
 */
export type Body = 'hatch' | 'suv' | 'saloon' | 'estate' | 'coupe';

const SHAPES: Record<Body, { body: string; glass: string; roofY: number; wheelR: number }> = {
  hatch: { body: 'M30 148L30 116Q30 100 46 94L80 62Q96 52 130 52L270 52Q312 54 340 90L420 102Q446 108 450 128L450 148Z', glass: 'M98 90L108 68Q114 60 134 60L268 60Q300 62 322 90Z', roofY: 52, wheelR: 32 },
  suv: { body: 'M26 150L26 110Q26 94 44 88L66 48Q74 40 100 40L310 40Q348 44 372 86L432 96Q454 102 454 126L454 150Z', glass: 'M80 84L92 56Q96 50 112 50L306 50Q334 54 352 84Z', roofY: 40, wheelR: 37 },
  saloon: { body: 'M24 148L24 126Q26 112 48 108L136 98Q170 62 226 56L300 56Q336 60 358 98L424 108Q452 114 456 132L456 148Z', glass: 'M170 94Q190 68 228 64L298 64Q324 68 340 94Z', roofY: 56, wheelR: 33 },
  estate: { body: 'M26 148L26 112Q26 98 44 92L70 54Q80 48 110 48L290 48Q330 52 352 90L430 100Q456 106 458 128L458 148Z', glass: 'M84 88L98 60Q104 56 120 56L286 56Q316 58 332 88Z', roofY: 48, wheelR: 33 },
  coupe: { body: 'M24 148L24 128Q26 114 50 110L150 98Q190 62 250 58L300 60Q340 70 372 100L430 110Q456 116 458 134L458 148Z', glass: 'M186 94Q210 68 252 66L298 68Q326 76 348 96Z', roofY: 58, wheelR: 31 },
};

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
}

export function car(body: Body, color: string, label = '') {
  const s = SHAPES[body];
  const id = 'c' + Math.random().toString(36).slice(2, 7);
  const wheel = (cx: number) => `<g><circle cx="${cx}" cy="150" r="${s.wheelR + 7}" fill="#17171a"/><circle cx="${cx}" cy="150" r="${s.wheelR}" fill="#222"/><circle cx="${cx}" cy="150" r="${s.wheelR * 0.62}" fill="#c9ccd1"/>${Array.from({ length: 5 }, (_, i) => { const a = (i / 5) * Math.PI * 2; return `<path d="M${cx} 150L${(cx + Math.cos(a) * s.wheelR * 0.6).toFixed(1)} ${(150 + Math.sin(a) * s.wheelR * 0.6).toFixed(1)}" stroke="#7f838b" stroke-width="5" stroke-linecap="round"/>`; }).join('')}<circle cx="${cx}" cy="150" r="5" fill="#555"/></g>`;
  return `<svg viewBox="0 0 480 200" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>
    <defs>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, 0.14)}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, -0.18)}"/></linearGradient>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dff1fb"/><stop offset="1" stop-color="#5a7488"/></linearGradient>
    </defs>
    <ellipse cx="240" cy="190" rx="205" ry="9" fill="#000" opacity=".18"/>
    <path d="${s.body}" fill="url(#${id}b)"/>
    <path d="${s.glass}" fill="url(#${id}g)"/>
    <path d="M${252} ${s.roofY + 8}V${s.roofY + 36}" stroke="${shade(color, -0.2)}" stroke-width="5"/>
    <circle cx="110" cy="150" r="${s.wheelR + 9}" fill="#111"/><circle cx="370" cy="150" r="${s.wheelR + 9}" fill="#111"/>
    ${wheel(110)}${wheel(370)}
    <path d="M60 128H420" stroke="${shade(color, 0.22)}" stroke-opacity=".55" stroke-width="2"/>
    <rect x="${body === 'suv' ? 434 : 436}" y="112" width="18" height="9" rx="4" fill="#fff6c8" stroke="#bda24a"/>
    <rect x="22" y="112" width="12" height="9" rx="3" fill="#d9262b"/>
    <rect x="262" y="118" width="22" height="4" rx="2" fill="${shade(color, -0.3)}"/>
  </svg>`;
}
