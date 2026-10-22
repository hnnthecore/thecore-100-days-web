/**
 * Brand assets for the Phase 2 landing pages (Days 21 to 40): a logo mark and a favicon set for each one.
 *
 * Run from this folder:   node scripts/make-brand.mjs
 * Writes to public/<site-folder>/ :
 *   mark.svg            the logo mark on a transparent background (also drawn inline beside each page's live wordmark)
 *   favicon.svg         the mark on a solid tile, for browser tabs
 *   favicon.ico         16, 32 and 48 px, for old browsers and Safari
 *   favicon-32.png      32 px PNG
 *   apple-touch-icon.png  180 px, shown when a visitor saves the page to a phone home screen
 *   icon-512.png        512 px, for app stores and social previews
 * and src/days/brand/marks.ts (the same artwork as data for the Mark component) and public/_brand-review.png (a proof sheet).
 *
 * Each mark is drawn on a 32 x 32 grid so it stays sharp from 16 px to 512 px. `mark` is the logo on the page's own colour;
 * `tileMark` is a simplified version that sits on the solid favicon tile. To change a logo, edit its entry below and run the script again.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

/* Small drawing helpers: all numbers are on the 32 x 32 grid. */
const f = (n) => +n.toFixed(2);
const polar = (cx, cy, r, deg) => [f(cx + r * Math.cos((deg * Math.PI) / 180)), f(cy + r * Math.sin((deg * Math.PI) / 180))];
const poly = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p.join(' ')).join(' ') + 'z';
const ngon = (cx, cy, r, n, rot = -90) => poly(Array.from({ length: n }, (_, i) => polar(cx, cy, r, rot + (360 / n) * i)));
const rays = (cx, cy, r1, r2, n, w, colour, rot = -90) => Array.from({ length: n }, (_, i) => {
  const a = polar(cx, cy, r1, rot + (360 / n) * i), b = polar(cx, cy, r2, rot + (360 / n) * i);
  return `<path d="M${a.join(' ')}L${b.join(' ')}" stroke="${Array.isArray(colour) ? colour[i % colour.length] : colour}" stroke-width="${w}" stroke-linecap="round"/>`;
}).join('');

export const BRANDS = {
  /* 21 · Sol y Sal: a Mexican street-food kitchen. A sun whose rays alternate marigold and chili, with a grain of salt. */
  'day-021-restaurant': {
    name: 'Sol y Sal', tile: '#24130e', pageBg: '#fff4e0',
    mark: `<circle cx="16" cy="16" r="6.4" fill="#ffb627"/>${rays(16, 16, 10, 14.2, 12, 2.4, ['#ff7a1a', '#e8362c'])}`,
    tileMark: `<circle cx="16" cy="16" r="6.2" fill="#ffb627"/>${rays(16, 16, 9.6, 13.6, 12, 2.6, ['#ff7a1a', '#ff3d8b'])}`,
  },
  /* 22 · Forno Rosso: a wood-fired pizzeria. A roundel with the oven mouth and its flame. */
  'day-022-pizzeria': {
    name: 'Forno Rosso', tile: '#d8381e', pageBg: '#fbf1de',
    mark: `<circle cx="16" cy="16" r="15" fill="#d8381e"/><path d="M6.8 26V16.6a9.2 9.2 0 0 1 18.4 0V26z" fill="#fbf1de"/><path d="M10.6 26v-8.4a5.4 5.4 0 0 1 10.8 0V26z" fill="#2b1b17"/><path d="M16 25.4c-2.6 0-3.9-1.6-3.9-3.4 0-1.9 1.5-2.8 2.4-4.5.4 1.1 1.7 1.5 1.7 3.2.9-.5 1.2-1.4 1.2-2.2 1.3 1.3 2.5 2.6 2.5 3.8 0 1.8-1.3 3.1-3.9 3.1z" fill="#f2b705"/>`,
    tileMark: `<path d="M5.6 27V16a10.4 10.4 0 0 1 20.8 0v11z" fill="#fbf1de"/><path d="M10 27v-9.4a6 6 0 0 1 12 0V27z" fill="#2b1b17"/><path d="M16 26.2c-2.9 0-4.3-1.8-4.3-3.8 0-2.1 1.7-3.1 2.7-5 .4 1.2 1.9 1.7 1.9 3.5 1-.5 1.3-1.5 1.3-2.4 1.4 1.4 2.8 2.9 2.8 4.2 0 2-1.4 3.5-4.4 3.5z" fill="#f2b705"/>`,
  },
  /* 23 · Northgate Motorworks: an independent garage. A hex nut with an N cut through it. */
  'day-023-workshop': {
    name: 'Northgate Motorworks', tile: '#0b0c0e', pageBg: '#0b0c0e',
    mark: `<path d="${ngon(16, 16, 14, 6, -90)}" fill="none" stroke="#ff5a1f" stroke-width="2.4" stroke-linejoin="round"/><path d="M11.4 22.2V9.8L20.6 22.2V9.8" fill="none" stroke="#eceef1" stroke-width="2.8" stroke-linejoin="miter" stroke-linecap="butt"/>`,
    tileMark: `<path d="${ngon(16, 16, 13.4, 6, -90)}" fill="none" stroke="#ff5a1f" stroke-width="2.8" stroke-linejoin="round"/><path d="M11.4 22.4V9.6L20.6 22.4V9.6" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linejoin="miter"/>`,
  },
  /* 24 · Halden & Rowe: a design-and-build firm. A site-plan square with an H whose crossbar is the beam. */
  'day-024-construction': {
    name: 'Halden & Rowe', tile: '#1b1b1a', pageBg: '#f4f1ec',
    mark: `<rect x="3" y="3" width="26" height="26" fill="#1b1b1a"/><path d="M9 8h4v16H9zM19 8h4v16h-4z" fill="#f4f1ec"/><path d="M13 14.2h6v3.6h-6z" fill="#f5c518"/>`,
    tileMark: `<path d="M7.5 6h5.2v20H7.5zM19.3 6h5.2v20h-5.2z" fill="#f4f1ec"/><path d="M12.7 13.4h6.6v5.2h-6.6z" fill="#f5c518"/>`,
  },
  /* 25 · Pace Logistics: freight. Two forward chevrons, painted like road markings. */
  'day-025-transport': {
    name: 'Pace Logistics', tile: '#0b1b3a', pageBg: '#f6f8fc',
    mark: `<path d="M5 6.5l9.5 9.5L5 25.5" fill="none" stroke="#2d5bff" stroke-width="4.6" stroke-linejoin="miter"/><path d="M15.5 6.5L25 16l-9.5 9.5" fill="none" stroke="#c6f432" stroke-width="4.6" stroke-linejoin="miter"/>`,
    tileMark: `<path d="M6 7l9 9-9 9" fill="none" stroke="#5b83ff" stroke-width="4.6"/><path d="M16 7l9 9-9 9" fill="none" stroke="#c6f432" stroke-width="4.6"/>`,
  },
  /* 26 · Atelier Vesper: a hair salon. A salon mirror's arch holding a thin V and the evening star. */
  'day-026-hair-salon': {
    name: 'Atelier Vesper', tile: '#2b1625', pageBg: '#f8f1e9',
    mark: `<path d="M6.5 29V14.2a9.5 9.5 0 0 1 19 0V29" fill="none" stroke="#2b1625" stroke-width="1.8" stroke-linecap="round"/><path d="M11.2 13.4L16 24l4.8-10.6" fill="none" stroke="#c2745c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 4.6l.9 2.5 2.5.9-2.5.9L16 11.4l-.9-2.5-2.5-.9 2.5-.9z" fill="#2b1625" transform="translate(0 1.4)"/>`,
    tileMark: `<path d="M6.5 28V14.4a9.5 9.5 0 0 1 19 0V28" fill="none" stroke="#f8f1e9" stroke-width="2" stroke-linecap="round"/><path d="M11.4 14L16 24l4.6-10" fill="none" stroke="#e8a58c" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 4.6l1 2.6 2.6 1-2.6 1-1 2.6-1-2.6-2.6-1 2.6-1z" fill="#f8f1e9" transform="translate(0 1)"/>`,
  },
  /* 27 · Maison Aurelle: fine jewellery. A brilliant-cut stone seen from above, drawn in gold line. */
  'day-027-jewelry': {
    name: 'Maison Aurelle', tile: '#0f1a17', pageBg: '#f7f3ec',
    mark: `<path d="${ngon(16, 16, 14, 8, -90)}" fill="none" stroke="#b8924a" stroke-width="1.5" stroke-linejoin="round"/><path d="${ngon(16, 16, 6.6, 8, -67.5)}" fill="#b8924a" fill-opacity=".14" stroke="#b8924a" stroke-width="1.2" stroke-linejoin="round"/>${Array.from({ length: 8 }, (_, i) => { const a = polar(16, 16, 6.6, -67.5 + 45 * i), b = polar(16, 16, 14, -90 + 45 * i), c = polar(16, 16, 14, -45 + 45 * i); return `<path d="M${b.join(' ')}L${a.join(' ')}L${c.join(' ')}" fill="none" stroke="#b8924a" stroke-width="1.2" stroke-linejoin="round"/>`; }).join('')}`,
    tileMark: `<path d="${ngon(16, 16, 13.6, 8, -90)}" fill="none" stroke="#e2c98c" stroke-width="1.9" stroke-linejoin="round"/><path d="${ngon(16, 16, 6.4, 8, -67.5)}" fill="#e2c98c" fill-opacity=".26" stroke="#e2c98c" stroke-width="1.6" stroke-linejoin="round"/>${Array.from({ length: 8 }, (_, i) => { const a = polar(16, 16, 6.4, -67.5 + 45 * i), b = polar(16, 16, 13.6, -90 + 45 * i), c = polar(16, 16, 13.6, -45 + 45 * i); return `<path d="M${b.join(' ')}L${a.join(' ')}L${c.join(' ')}" fill="none" stroke="#e2c98c" stroke-width="1.6" stroke-linejoin="round"/>`; }).join('')}`,
  },
  /* 28 · Stackwell: managed IT. Three layers stacked into an S, each cut at an angle. */
  'day-028-it-company': {
    name: 'Stackwell', tile: '#1e1f24', pageBg: '#faf7f2',
    mark: `<path d="M16 4L29 10.4 16 16.8 3 10.4z" fill="#ff5a1f"/><path d="M3 16l13 6.4L29 16" fill="none" stroke="#1e1f24" stroke-width="3" stroke-linejoin="miter"/><path d="M3 21.6l13 6.4 13-6.4" fill="none" stroke="#1e1f24" stroke-width="3" stroke-linejoin="miter"/>`,
    tileMark: `<path d="M16 4.4L28.6 10.6 16 16.8 3.4 10.6z" fill="#ff5a1f"/><path d="M3.4 16.2l12.6 6.2 12.6-6.2" fill="none" stroke="#ffffff" stroke-width="3.2"/><path d="M3.4 21.8l12.6 6.2 12.6-6.2" fill="none" stroke="#ffffff" stroke-width="3.2"/>`,
  },
  /* 29 · Ironveil: managed security. A shield drawn half in outline, half in solid: what is seen and what is covered. */
  'day-029-cybersecurity': {
    name: 'Ironveil', tile: '#05080a', pageBg: '#05080a',
    mark: `<path d="M16 3L5.5 7.2v7.6c0 6.8 4.5 11.4 10.5 14V3z" fill="#2cf59b"/><path d="M16 3l10.5 4.2v7.6c0 6.8-4.5 11.4-10.5 14" fill="none" stroke="#2cf59b" stroke-width="2.2" stroke-linejoin="round"/>`,
    tileMark: `<path d="M16 4L6 8v7c0 6.5 4.2 10.9 10 13.4V4z" fill="#2cf59b"/><path d="M16 4l10 4v7c0 6.5-4.2 10.9-10 13.4" fill="none" stroke="#2cf59b" stroke-width="2.6" stroke-linejoin="round"/>`,
  },
  /* 30 · Rival Athletic Club: a gym. The slash from RIVAL/AC, doubled and cut at the angle of a sprint start. */
  'day-030-gym': {
    name: 'Rival Athletic Club', tile: '#0a0a0a', pageBg: '#f4f1ec',
    mark: `<path d="M5 28L14.6 4h5.6L10.6 28z" fill="#0a0a0a"/><path d="M15.8 28L25.4 4H31L21.4 28z" fill="#ff2e88"/>`,
    tileMark: `<path d="M4 28L13.6 4h6L10 28z" fill="#f4f1ec"/><path d="M15 28L24.6 4h6L21 28z" fill="#ff2e88"/>`,
  },
  /* 31 · The Saltmarsh: a coastal hotel. A roundel with a low sun on the horizon and three reeds. */
  'day-031-hotel': {
    name: 'The Saltmarsh', tile: '#1e3b44', pageBg: '#f4efe6',
    mark: `<circle cx="16" cy="16" r="15" fill="#1e3b44"/><circle cx="22.6" cy="15.4" r="4.8" fill="#b98b4d"/><path d="M10.2 29.6V12M15.4 29.6V7.6M20.6 29.6V13.6" stroke="#d6e4df" stroke-width="1.3" stroke-linecap="round"/><rect x="9.1" y="8" width="2.2" height="6.6" rx="1.1" fill="#d6e4df"/><rect x="14.3" y="3.6" width="2.2" height="6.6" rx="1.1" fill="#d6e4df"/><rect x="19.5" y="9.6" width="2.2" height="6.6" rx="1.1" fill="#d6e4df"/>`,
    tileMark: `<circle cx="22.6" cy="14.6" r="5.6" fill="#b98b4d"/><path d="M10.2 29.6V12M15.4 29.6V7.6M20.6 29.6V13.6" stroke="#d6e4df" stroke-width="1.7" stroke-linecap="round"/><rect x="9.1" y="8" width="2.6" height="6.6" rx="1.3" fill="#d6e4df"/><rect x="14.3" y="3.6" width="2.6" height="6.6" rx="1.3" fill="#d6e4df"/><rect x="19.5" y="9.6" width="2.6" height="6.6" rx="1.3" fill="#d6e4df"/>`,
  },
  /* 32 · Lemon & Linen: a cleaning service. A lemon slice whose segments are cut like a linen weave. */
  'day-032-cleaning': {
    name: 'Lemon & Linen', tile: '#0f3d3a', pageBg: '#f4fbf8',
    mark: `<circle cx="16" cy="17" r="13" fill="#ffe45c" stroke="#0f3d3a" stroke-width="1.8"/><circle cx="16" cy="17" r="9.6" fill="#fff7b8"/>${rays(16, 17, 1.6, 9.6, 8, 1.4, '#0f3d3a', -90)}<path d="M22.6 4.4c2.2-1.6 4.8-1.4 6.2-.8-.2 2.6-2.2 4.8-5.2 4.8-.4-1.6-.6-2.8-1-4z" fill="#1cc38b"/>`,
    tileMark: `<circle cx="16" cy="16.4" r="12.6" fill="#ffe45c"/><circle cx="16" cy="16.4" r="9.2" fill="#fff7b8"/>${rays(16, 16.4, 1.6, 9.2, 8, 1.7, '#0f3d3a', -90)}`,
  },
  /* 33 · Voltline: electricians. A bolt cut from a single line, with the spark it leaves. */
  'day-033-electrician': {
    name: 'Voltline Electrical', tile: '#1b2bdb', pageBg: '#f5f6fc',
    mark: `<path d="M19.2 2.6L7 17.4h7.4L12 29.4 25 13.2h-7.6z" fill="#1b2bdb"/><circle cx="25.6" cy="25.4" r="3" fill="#ffd400"/>`,
    tileMark: `<path d="M19.2 2.8L7.4 17.2h7.2l-2.4 12 12.6-16h-7.4z" fill="#ffd400"/>`,
  },
  /* 34 · Copperline: plumbing and heating. A copper pipe in a quarter bend, with a flange at each end. */
  'day-034-plumber': {
    name: 'Copperline', tile: '#0e3f44', pageBg: '#fbf5ec',
    mark: `<path d="M8 8.5h9a6.5 6.5 0 0 1 6.5 6.5v9" fill="none" stroke="#c86b3c" stroke-width="5" stroke-linejoin="round"/><path d="M5.6 4.6h3.2v7.8H5.6zM19.5 22.6h8v3.2h-8z" fill="#0e3f44"/><circle cx="25" cy="6.5" r="2.4" fill="#6ec1d9"/>`,
    tileMark: `<path d="M8.4 9h8.8a6.8 6.8 0 0 1 6.8 6.8V25" fill="none" stroke="#e0885a" stroke-width="5.4" stroke-linejoin="round"/><path d="M5.6 5h3.4v8.4H5.6zM19.2 23.8h9v3.4h-9z" fill="#fbf5ec"/>`,
  },
  /* 35 · Apex Motor Group: a used-car dealer. A solid peak crossed by one red stripe, like the stripe on a bonnet. */
  'day-035-car-dealership': {
    name: 'Apex Motor Group', tile: '#0d0d0f', pageBg: '#f6f6f3',
    mark: `<path d="M16 3.4L30 28.6H2z" fill="#0d0d0f"/><path d="M19.4 11.6l3.2 5.6L13 28.6H8.2z" fill="#e8262b"/>`,
    tileMark: `<path d="M16 4L29.6 28H2.4z" fill="#f6f6f3"/><path d="M19.4 12l3.1 5.4L13.4 28H8.6z" fill="#e8262b"/>`,
  },
  /* 36 · Latch & Lane: estate agents. A house outline with the lane that leads to its front door. */
  'day-036-real-estate': {
    name: 'Latch & Lane', tile: '#14213d', pageBg: '#fbf6ef',
    mark: `<path d="M4.4 15.6L16 4.6l11.6 11V28H4.4z" fill="none" stroke="#14213d" stroke-width="2.2" stroke-linejoin="round"/><path d="M13.6 28l1.4-7.6h2L18.4 28z" fill="#ff6b5b"/><path d="M12.6 28h6.8" stroke="#ff6b5b" stroke-width="2"/><path d="M14.6 20.4h2.8v-4.8h-2.8z" fill="#14213d"/>`,
    tileMark: `<path d="M4.8 15.6L16 5l11.2 10.6V27.4H4.8z" fill="none" stroke="#fbf6ef" stroke-width="2.4" stroke-linejoin="round"/><path d="M12.4 27.4l1.7-9h3.8l1.7 9z" fill="#ff6b5b"/>`,
  },
  /* 37 · Pawprint Veterinary Care: a paw whose pad holds a medical cross. */
  'day-037-veterinary': {
    name: 'Pawprint Veterinary Care', tile: '#1f4d3a', pageBg: '#fff8e8',
    mark: `<ellipse cx="6.4" cy="14" rx="2.7" ry="3.6" fill="#1f4d3a" transform="rotate(-24 6.4 14)"/><ellipse cx="12.4" cy="7.6" rx="2.8" ry="3.9" fill="#1f4d3a" transform="rotate(-8 12.4 7.6)"/><ellipse cx="19.6" cy="7.6" rx="2.8" ry="3.9" fill="#1f4d3a" transform="rotate(8 19.6 7.6)"/><ellipse cx="25.6" cy="14" rx="2.7" ry="3.6" fill="#1f4d3a" transform="rotate(24 25.6 14)"/><path d="M16 14.2c4.6 0 9 4.2 9 8.8 0 3.2-2.4 5-5 5-1.7 0-2.8-.7-4-.7s-2.3.7-4 .7c-2.6 0-5-1.8-5-5 0-4.6 4.4-8.8 9-8.8z" fill="#1f4d3a"/><path d="M14.8 18.4h2.4v2.6h2.6v2.4h-2.6V26h-2.4v-2.6h-2.6V21h2.6z" fill="#ffc93c"/>`,
    tileMark: `<ellipse cx="6.4" cy="13.4" rx="2.6" ry="3.5" fill="#ffc93c" transform="rotate(-24 6.4 13.4)"/><ellipse cx="12.4" cy="7.2" rx="2.7" ry="3.8" fill="#ffc93c" transform="rotate(-8 12.4 7.2)"/><ellipse cx="19.6" cy="7.2" rx="2.7" ry="3.8" fill="#ffc93c" transform="rotate(8 19.6 7.2)"/><ellipse cx="25.6" cy="13.4" rx="2.6" ry="3.5" fill="#ffc93c" transform="rotate(24 25.6 13.4)"/><path d="M16 13.8c4.6 0 9 4.2 9 8.8 0 3.2-2.4 5-5 5-1.7 0-2.8-.7-4-.7s-2.3.7-4 .7c-2.6 0-5-1.8-5-5 0-4.6 4.4-8.8 9-8.8z" fill="#ffc93c"/><path d="M14.8 18h2.4v2.6h2.6V23h-2.6v2.6h-2.4V23h-2.6v-2.4h2.6z" fill="#1f4d3a"/>`,
  },
  /* 38 · Ember & Oak: a coffee roastery. A roasted bean whose centre crease is also a flame. */
  'day-038-coffee-roastery': {
    name: 'Ember & Oak', tile: '#d9622b', pageBg: '#f5ecdc',
    mark: `<ellipse cx="16" cy="16" rx="10" ry="13.4" fill="#1e1410" transform="rotate(28 16 16)"/><path d="M12.8 5.6c4 2.2 1.8 5.8 3.8 8.4 1.8 2.4 4.8 3.2 2.6 12.4" fill="none" stroke="#e7d6b8" stroke-width="2" stroke-linecap="round"/><path d="M22.6 3.8c1.6 1.8 1.6 3.4.4 4.8-1.2 1.4-3 .6-2.8-1.2.9.3 1.6-.2 1.7-1.1.1-.8.3-1.8.7-2.5z" fill="#d9622b"/>`,
    tileMark: `<ellipse cx="16" cy="16.4" rx="9.6" ry="13" fill="#1e1410" transform="rotate(28 16 16.4)"/><path d="M12.8 6c4 2.2 1.8 5.8 3.8 8.4 1.8 2.4 4.8 3.2 2.6 12.2" fill="none" stroke="#f5ecdc" stroke-width="2.2" stroke-linecap="round"/>`,
  },
  /* 39 · Wayfarer Journeys: tailor-made travel. A W drawn as a trail that ends on a map pin. */
  'day-039-travel': {
    name: 'Wayfarer Journeys', tile: '#1b1147', pageBg: '#fbf3e6',
    mark: `<path d="M3.6 7.4L9.6 24.6 15.2 12.4 20.4 24.6 26 12.6" fill="none" stroke="#1b1147" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="0.1 0"/><path d="M26 3.4a5 5 0 0 1 5 5c0 3.4-5 8.8-5 8.8s-5-5.4-5-8.8a5 5 0 0 1 5-5z" fill="#ff8a3d"/><circle cx="26" cy="8.4" r="1.9" fill="#1b1147"/>`,
    tileMark: `<path d="M3.8 8.6L9.6 25 15 13.4 20.2 25l5-11" fill="none" stroke="#fbf3e6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M25.4 3a5 5 0 0 1 5 5c0 3.4-5 8.8-5 8.8s-5-5.4-5-8.8a5 5 0 0 1 5-5z" fill="#ff8a3d" transform="translate(0 1)"/>`,
  },
  /* 40 · Halide & Co.: wedding and portrait photography. A lens aperture: six blades around a red opening. */
  'day-040-photography': {
    name: 'Halide & Co.', tile: '#111111', pageBg: '#f4f2ee',
    mark: `<circle cx="16" cy="16" r="14" fill="none" stroke="#111111" stroke-width="1.8"/>${Array.from({ length: 6 }, (_, i) => { const a = polar(16, 16, 5.6, -90 + 60 * i), b = polar(16, 16, 13.4, -90 + 60 * i + 74); return `<path d="M${a.join(' ')}L${b.join(' ')}" stroke="#111111" stroke-width="1.6" stroke-linecap="round"/>`; }).join('')}<path d="${ngon(16, 16, 5.6, 6, -90)}" fill="#d9381e"/>`,
    tileMark: `<circle cx="16" cy="16" r="13.4" fill="none" stroke="#f4f2ee" stroke-width="2"/>${Array.from({ length: 6 }, (_, i) => { const a = polar(16, 16, 5.8, -90 + 60 * i), b = polar(16, 16, 13, -90 + 60 * i + 74); return `<path d="M${a.join(' ')}L${b.join(' ')}" stroke="#f4f2ee" stroke-width="1.9" stroke-linecap="round"/>`; }).join('')}<path d="${ngon(16, 16, 5.8, 6, -90)}" fill="#ff5a3c"/>`,
  },
};

const svg = (inner, bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${bg ? `<rect width="32" height="32" rx="7" fill="${bg}"/>` : ''}${inner}</svg>\n`;

/** An .ico file is a small header plus PNG pictures; modern Windows, macOS and browsers read PNG inside it. */
function ico(pngs) {
  const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const dir = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size === 256 ? 0 : size, 0); e.writeUInt8(size === 256 ? 0 : size, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(data.length, 8); e.writeUInt32LE(offset, 12);
    offset += data.length; return e;
  });
  return Buffer.concat([head, ...dir, ...pngs.map((p) => p.data)]);
}

const png = (markup, size, density = 512) => sharp(Buffer.from(markup), { density }).resize(size, size).png().toBuffer();

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // The same artwork as a TypeScript module, so the Mark component can draw it inline in each page's header and footer.
  const marks = Object.fromEntries(Object.entries(BRANDS).map(([k, b]) => [k, { mark: b.mark, tile: b.tile, tileMark: b.tileMark }]));
  await mkdir(join(ROOT, 'src/days/brand'), { recursive: true });
  await writeFile(join(ROOT, 'src/days/brand/marks.ts'), `/** Generated by scripts/make-brand.mjs. Do not edit by hand. */\nexport const MARKS = ${JSON.stringify(marks, null, 2)} as const;\n`);
  for (const [folder, b] of Object.entries(BRANDS)) {
    const dir = join(ROOT, 'public', folder);
    await mkdir(dir, { recursive: true });
    const tile = svg(b.tileMark, b.tile);
    await writeFile(join(dir, 'mark.svg'), svg(b.mark));
    await writeFile(join(dir, 'favicon.svg'), tile);
    await writeFile(join(dir, 'favicon-32.png'), await png(tile, 32));
    await writeFile(join(dir, 'icon-512.png'), await png(tile, 512));
    // The home-screen icon has no rounded corners of its own: phones round it, so it needs a full square.
    const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${b.tile}"/>${b.tileMark}</svg>`;
    await writeFile(join(dir, 'apple-touch-icon.png'), await png(touch, 180));
    await writeFile(join(dir, 'favicon.ico'), ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tile, size) })))));
  }
  console.log('wrote', Object.keys(BRANDS).length, 'brands');
  // A proof sheet: four columns; each cell shows the logo large on its page colour, then the favicon tile at 96, 32 and 16 px.
  const cols = 4, cw = 330, ch = 220, rows = Object.entries(BRANDS);
  const comp = [];
  for (let i = 0; i < rows.length; i++) {
    const [, b] = rows[i], x = (i % cols) * cw, y = Math.floor(i / cols) * ch;
    comp.push({ input: await png(svg(b.mark, b.pageBg), 150), left: x + 10, top: y + 10 });
    comp.push({ input: await png(svg(b.tileMark, b.tile), 96), left: x + 175, top: y + 12 });
    comp.push({ input: await png(svg(b.tileMark, b.tile), 32), left: x + 175, top: y + 124 });
    comp.push({ input: await png(svg(b.tileMark, b.tile), 16), left: x + 220, top: y + 132 });
    comp.push({ input: await png(svg(b.mark, '#ffffff'), 32), left: x + 262, top: y + 124 });
    comp.push({ input: await png(svg(b.mark, b.pageBg), 24), left: x + 262, top: y + 168 });
  }
  await sharp({ create: { width: cw * cols, height: ch * Math.ceil(rows.length / cols), channels: 3, background: '#dddddd' } }).composite(comp).png().toFile(join(ROOT, 'public', '_brand-review.png'));
}
