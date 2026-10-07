/**
 * Day 027 · Maison Aurelle · jewellery drawn in code.
 * Pure functions that return SVG markup, used at build time (shop grid) and in the browser (configurator, 4Cs).
 * No image files anywhere on the page.
 */
export type Metal = 'yellow' | 'rose' | 'white';
export type Stone = 'diamond' | 'sapphire' | 'emerald' | 'ruby';
export type Shape = 'round' | 'oval' | 'emerald';
export type Setting = 'solitaire' | 'halo' | 'three';

export const METALS: Record<Metal, { name: string; a: string; b: string; c: string }> = {
  yellow: { name: '18ct yellow gold', a: '#f6e3a1', b: '#d4a944', c: '#8d6a1c' },
  rose: { name: '18ct rose gold', a: '#f7d3c4', b: '#d9977c', c: '#97553e' },
  white: { name: 'Platinum', a: '#fbfcfe', b: '#c4ccd6', c: '#7a8594' },
};
export const STONES: Record<Stone, { name: string; a: string; b: string; c: string }> = {
  diamond: { name: 'Diamond', a: '#ffffff', b: '#d8e8f7', c: '#9cb9d6' },
  sapphire: { name: 'Sapphire', a: '#8fb0ff', b: '#2a55c4', c: '#142a73' },
  emerald: { name: 'Emerald', a: '#7be0ae', b: '#12915c', c: '#08543a' },
  ruby: { name: 'Ruby', a: '#ff8fa5', b: '#c8153b', c: '#6e0a22' },
};

let uid = 0;
const nid = () => `a${(uid++).toString(36)}`;

function defs(id: string, metal: Metal, stone: Stone) {
  const m = METALS[metal]; const s = STONES[stone];
  return `<defs>
    <linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m.a}"/><stop offset=".5" stop-color="${m.b}"/><stop offset="1" stop-color="${m.c}"/></linearGradient>
    <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.a}"/><stop offset=".55" stop-color="${s.b}"/><stop offset="1" stop-color="${s.c}"/></linearGradient>
  </defs>`;
}

/** One cut stone centred on cx, cy. `s` is its half-width; `fire` (0–1) controls how brilliant the facets look. */
export function gem(id: string, cx: number, cy: number, s: number, shape: Shape, fire = 1) {
  const fill = `url(#${id}s)`;
  const f = `stroke="#fff" stroke-opacity="${(0.35 + fire * 0.4).toFixed(2)}" stroke-width="1" fill="none"`;
  if (shape === 'emerald') {
    const w = s * 0.86, h = s * 1.1, c = s * 0.34;
    return `<g><path d="M${cx - w + c} ${cy - h}H${cx + w - c}L${cx + w} ${cy - h + c}V${cy + h - c}L${cx + w - c} ${cy + h}H${cx - w + c}L${cx - w} ${cy + h - c}V${cy - h + c}Z" fill="${fill}" stroke="#0003"/>
      <path d="M${cx - w * .55} ${cy - h * .6}H${cx + w * .55}V${cy + h * .6}H${cx - w * .55}Z M${cx - w * .55} ${cy - h * .2}H${cx + w * .55} M${cx - w * .55} ${cy + h * .2}H${cx + w * .55}" ${f}/>
      <path d="M${cx - w * .8} ${cy - h * .85}L${cx - w * .1} ${cy - h * .85}L${cx - w * .6} ${cy - h * .2}Z" fill="#fff" opacity="${(0.25 + fire * 0.4).toFixed(2)}"/></g>`;
  }
  const rx = shape === 'oval' ? s * 0.78 : s, ry = shape === 'oval' ? s * 1.08 : s;
  const spokes = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4 + Math.PI / 8; return `M${cx} ${cy}L${(cx + Math.cos(a) * rx).toFixed(1)} ${(cy + Math.sin(a) * ry).toFixed(1)}`; }).join('');
  return `<g><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="#0003"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx * .62}" ry="${ry * .62}" ${f}/><path d="${spokes}" ${f}/>
    <ellipse cx="${cx - rx * .3}" cy="${cy - ry * .36}" rx="${rx * .24}" ry="${ry * .14}" fill="#fff" opacity="${(0.3 + fire * 0.5).toFixed(2)}" transform="rotate(-30 ${cx - rx * .3} ${cy - ry * .36})"/></g>`;
}

const prongs = (cx: number, cy: number, r: number) => [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y]) => `<circle cx="${cx + x * r * 0.78}" cy="${cy + y * r * 0.78}" r="3.2" fill="url(#PIDm)"/>`).join('');

/** A ring seen head-on. carat sizes the stone; setting changes the head. */
export function ring(o: { metal: Metal; stone: Stone; shape: Shape; setting: Setting; carat: number; label?: string }) {
  const id = nid();
  const r = Math.min(34, 15 + o.carat * 7.5);
  const cy = 74;
  let head = '';
  if (o.setting === 'halo') {
    const n = 14, rr = r * (o.shape === 'oval' ? 1.45 : 1.38);
    head += Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `<circle cx="${(120 + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr * (o.shape === 'oval' ? 1.12 : 1)).toFixed(1)}" r="3.4" fill="url(#${id}s)" stroke="#0002" stroke-width=".6"/>`; }).join('');
  }
  if (o.setting === 'three') {
    const sr = r * 0.52;
    head += gem(id, 120 - r - sr - 4, cy + 8, sr, 'round', 0.8) + gem(id, 120 + r + sr + 4, cy + 8, sr, 'round', 0.8);
  }
  head += gem(id, 120, cy, r, o.shape);
  const claws = o.setting === 'halo' ? '' : prongs(120, cy, r).replace(/PID/g, id);
  return `<svg viewBox="0 0 240 240" ${o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true"'}>${defs(id, o.metal, o.stone)}
    <ellipse cx="120" cy="228" rx="64" ry="7" fill="#000" opacity=".16"/>
    <circle cx="120" cy="156" r="70" fill="none" stroke="url(#${id}m)" stroke-width="13"/>
    <circle cx="120" cy="156" r="63.5" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="1"/>
    <path d="M104 ${cy + r * 0.9}L112 98H128L136 ${cy + r * 0.9}Z" fill="url(#${id}m)"/>
    ${claws}${head}</svg>`;
}

export function earrings(o: { metal: Metal; stone: Stone; shape: Shape; label?: string }) {
  const id = nid();
  const side = (x: number) => `<g><circle cx="${x}" cy="56" r="5" fill="url(#${id}m)"/><path d="M${x} 61V92" stroke="${METALS[o.metal].b}" stroke-width="3"/>${gem(id, x, 118, 22, o.shape)}<circle cx="${x}" cy="150" r="4" fill="url(#${id}m)"/></g>`;
  return `<svg viewBox="0 0 240 240" ${o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true"'}>${defs(id, o.metal, o.stone)}<ellipse cx="120" cy="228" rx="70" ry="6" fill="#000" opacity=".12"/>${side(78)}${side(162)}</svg>`;
}

export function necklace(o: { metal: Metal; stone: Stone; shape: Shape; label?: string }) {
  const id = nid();
  return `<svg viewBox="0 0 240 240" ${o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true"'}>${defs(id, o.metal, o.stone)}
    <path d="M30 30Q120 210 210 30" fill="none" stroke="url(#${id}m)" stroke-width="3" stroke-dasharray="5 2"/>
    <path d="M120 134V152" stroke="${METALS[o.metal].b}" stroke-width="3"/>${gem(id, 120, 178, 26, o.shape)}<ellipse cx="120" cy="228" rx="46" ry="5" fill="#000" opacity=".12"/></svg>`;
}

export function bracelet(o: { metal: Metal; stone: Stone; shape: Shape; label?: string }) {
  const id = nid();
  const links = Array.from({ length: 11 }, (_, i) => gem(id, 38 + i * 16.4, 120 + Math.sin((i / 10) * Math.PI) * -26 + 14, 8, 'round', 0.9)).join('');
  return `<svg viewBox="0 0 240 240" ${o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true"'}>${defs(id, o.metal, o.stone)}
    <path d="M26 134Q120 90 214 134" fill="none" stroke="url(#${id}m)" stroke-width="12"/><path d="M26 134Q120 90 214 134" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>
    <g transform="translate(0 -8)">${links}</g><ellipse cx="120" cy="188" rx="86" ry="6" fill="#000" opacity=".12"/></svg>`;
}

/** The loose stone used by the “4Cs” guide. */
export function stoneOnly(o: { stone: Stone; shape: Shape; size: number; fire: number; tint: number; flaws: number }) {
  const id = nid();
  const dots = Array.from({ length: o.flaws }, (_, i) => `<circle cx="${(100 + Math.cos(i * 2.4) * o.size * 0.4).toFixed(1)}" cy="${(110 + Math.sin(i * 2.4) * o.size * 0.4).toFixed(1)}" r="1.6" fill="#3b2a1a" opacity=".7"/>`).join('');
  const sparkles = o.fire > 0.7 ? `<path d="M190 30l3 10 10 3-10 3-3 10-3-10-10-3 10-3z" fill="#fff"/><path d="M40 170l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill="#fff"/>` : '';
  return `<svg viewBox="0 0 220 220" aria-hidden="true">${defs(id, 'white', o.stone)}
    ${gem(id, 110, 110, o.size, o.shape, o.fire)}
    <ellipse cx="110" cy="110" rx="${o.size}" ry="${o.size}" fill="#d9a441" opacity="${o.tint}"/>${dots}${sparkles}</svg>`;
}
