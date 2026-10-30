/**
 * Brand assets for the Phase 3 sites: a logo mark and a favicon set for each one.
 *
 * Run from this folder:   node scripts/make-brand.mjs
 * Writes to public/<site-folder>/ :
 *   mark.svg            the logo mark on a transparent background (also pasted inline into each site's header)
 *   favicon.svg         the mark on a solid tile, for browser tabs
 *   favicon.ico         16, 32 and 48 px, for old browsers and Safari
 *   favicon-32.png      32 px PNG
 *   apple-touch-icon.png  180 px, shown when a visitor saves the site to a phone home screen
 *   icon-512.png        512 px, for app stores and social previews
 *
 * Each mark is drawn on a 32 x 32 grid so it stays sharp from 16 px to 512 px. To change a logo, edit its entry
 * in BRANDS below and run the script again.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../', import.meta.url));


export const BRANDS = {
  'day-041-bookshop': {
    name: 'Pagebound Books',
    tile: '#7a1f2b',
    pageBg: '#f7f0e2',
    // Books on a shelf, seen from the spines: one leaning, one with a ribbon bookmark hanging out.
    mark: `<rect x="2.6" y="8" width="6.2" height="20" rx="1" fill="#7a1f2b"/><rect x="2.6" y="12" width="6.2" height="1.6" fill="#f7f0e2"/><rect x="10" y="3" width="6" height="25" rx="1" fill="#8a9a7b"/><rect x="10" y="7" width="6" height="1.6" fill="#f7f0e2"/><rect x="17.2" y="10" width="5.2" height="18" rx="1" fill="#231a17"/><rect x="17.2" y="14" width="5.2" height="1.6" fill="#c9a24b"/><rect x="23.2" y="10.4" width="4.6" height="17.6" rx="1" fill="#7a1f2b" transform="rotate(11 25.5 28)"/><path d="M1.5 29h29" stroke="#231a17" stroke-width="1.4" stroke-linecap="round"/>`,
    tileMark: `<rect x="5.5" y="9" width="5" height="16" rx="0.8" fill="#f7f0e2"/><rect x="11.5" y="5" width="4.8" height="20" rx="0.8" fill="#dfe6d6"/><rect x="17.3" y="11" width="4.8" height="14" rx="0.8" fill="#c9a24b"/><rect x="23" y="11.2" width="4.4" height="13.8" rx="0.8" fill="#f7f0e2" transform="rotate(13 25 25)"/><path d="M4 26.4h24" stroke="#f7f0e2" stroke-width="1.4" stroke-linecap="round"/>`,
  },
  'day-042-architecture': {
    name: 'Atelier Nord',
    tile: '#101417',
    pageBg: '#dde3e6',
    // A survey mark: a slim compass needle, half ink and half fjord, with a hairline across it.
    mark: `<path d="M16 1.5 22.5 16 16 30.5z" fill="#1c4f9c"/><path d="M16 1.5 9.5 16 16 30.5z" fill="#101417"/><path d="M2 16h28" stroke="#101417" stroke-width="1.1"/><circle cx="16" cy="16" r="2" fill="#dde3e6" stroke="#101417" stroke-width="1.1"/>`,
    tileMark: `<path d="M16 3.5 22 16 16 28.5z" fill="#9db9e6"/><path d="M16 3.5 10 16 16 28.5z" fill="#fff"/><path d="M4 16h24" stroke="#fff" stroke-width="1"/><circle cx="16" cy="16" r="1.9" fill="#101417" stroke="#fff" stroke-width="1"/>`,
  },
  'day-043-community-farm': {
    name: 'Rootwork',
    tile: '#1b1611',
    pageBg: '#f6f5ef',
    // A badge: sun rising over furrows in the field.
    mark: `<circle cx="16" cy="16" r="14.5" fill="#1b1611"/><path d="M9.5 17.5a6.5 6.5 0 0 1 13 0z" fill="#f4a63a"/><path d="M5.5 20.2Q16 16.4 26.5 20.2M5.2 23.6Q16 19.8 26.8 23.6M6.6 27Q16 23.4 25.4 27" fill="none" stroke="#c9e27a" stroke-width="1.7" stroke-linecap="round"/><path d="M16 5v2.2M8.2 8.4l1.5 1.5M23.8 8.4l-1.5 1.5" stroke="#f4a63a" stroke-width="1.5" stroke-linecap="round"/>`,
    tileMark: `<path d="M8.5 19a7.5 7.5 0 0 1 15 0z" fill="#f4a63a"/><path d="M4.5 22.4Q16 18.4 27.5 22.4M4.5 26Q16 22 27.5 26" fill="none" stroke="#c9e27a" stroke-width="1.9" stroke-linecap="round"/><path d="M16 6.5v2.6M7.8 9.6l1.8 1.8M24.2 9.6l-1.8 1.8" stroke="#f4a63a" stroke-width="1.7" stroke-linecap="round"/>`,
  },
  'day-044-saas-product': {
    name: 'Fathom',
    tile: '#0c110f',
    pageBg: '#0c110f',
    // A forecast line: solid where the money has happened, dashed mint where Fathom looks ahead.
    mark: `<path d="M3 24 10.5 15.5 15.5 20.5 21.5 9" fill="none" stroke="#7cf5c4" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="21.5" cy="9" r="2.6" fill="#7cf5c4"/><path d="M21.5 9 29 3.6" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-dasharray="0.1 5.2"/><path d="M2.5 29.2h27" stroke="#7cf5c4" stroke-width="1.3" stroke-linecap="round"/>`,
    tileMark: `<path d="M5.5 22.5 11 16.4 15.6 20.6 21 10.6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="21" cy="10.6" r="2.3" fill="#fff"/><path d="M21 10.6 26.8 6.2" fill="none" stroke="#7cf5c4" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="0.1 4.6"/><path d="M5 26.6h22" stroke="#7cf5c4" stroke-width="1.2" stroke-linecap="round"/>`,
  },
  'day-045-language-school': {
    name: 'Lingua Lane',
    tile: '#1b1030',
    pageBg: '#fff6e8',
    // Two speech bubbles in conversation: coral and teal, with saffron where they overlap.
    mark: `<circle cx="11.5" cy="12" r="8.6" fill="#ff5a3c"/><path d="M4.6 17.6 3 24l6-3z" fill="#ff5a3c"/><circle cx="20.5" cy="19" r="8.6" fill="#0f8a8a"/><path d="M27.4 24.6 29.2 30l-6-2.6z" fill="#0f8a8a"/><path d="M12.05 20.58A8.6 8.6 0 0 0 19.95 10.42 8.6 8.6 0 0 0 12.05 20.58z" fill="#ffb703"/>`,
    tileMark: `<circle cx="12.5" cy="13" r="7.4" fill="#ff5a3c"/><path d="M6.6 17.6 5.4 23l5.2-2.6z" fill="#ff5a3c"/><circle cx="20" cy="19" r="7.4" fill="#0f8a8a"/><path d="M25.6 23.8 27 28.4l-5.2-2.2z" fill="#0f8a8a"/><path d="M12.73 20.4A7.4 7.4 0 0 0 19.77 11.6 7.4 7.4 0 0 0 12.73 20.4z" fill="#ffb703"/>`,
  },
  'day-046-herbal-shop': {
    name: 'Wildcombe Herbal',
    tile: '#14110f',
    pageBg: '#f2f1ee',
    // A herbarium specimen tag: a marigold label with its punched hole, and a pressed sprig on it.
    mark: `<path d="M8 4h16a1.5 1.5 0 0 1 1.5 1.5V27a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 27V5.5A1.5 1.5 0 0 1 8 4z" fill="#f5a623"/><circle cx="16" cy="8" r="1.7" fill="#f2f1ee"/><path d="M16 26V13.5" stroke="#14110f" stroke-width="1.6" stroke-linecap="round"/><path d="M16 22c-3.4 0-5-2.2-5-4.6 3 0 5 1.6 5 4.6zM16 22c3.4 0 5-2.2 5-4.6-3 0-5 1.6-5 4.6zM16 17.6c-2.6 0-3.8-1.7-3.8-3.6 2.4 0 3.8 1.3 3.8 3.6zM16 17.6c2.6 0 3.8-1.7 3.8-3.6-2.4 0-3.8 1.3-3.8 3.6zM16 13.6c-1.4-1.5-1.4-3.3 0-4.8 1.4 1.5 1.4 3.3 0 4.8z" fill="#14110f"/>`,
    tileMark: `<path d="M9 5h14a1.5 1.5 0 0 1 1.5 1.5V26a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 26V6.5A1.5 1.5 0 0 1 9 5z" fill="#f5a623"/><circle cx="16" cy="8.6" r="1.6" fill="#14110f"/><path d="M16 25.4V14" stroke="#14110f" stroke-width="1.8" stroke-linecap="round"/><path d="M16 22.2c-3.4 0-5-2.2-5-4.6 3 0 5 1.6 5 4.6zM16 22.2c3.4 0 5-2.2 5-4.6-3 0-5 1.6-5 4.6zM16 18c-2.6 0-3.8-1.7-3.8-3.6 2.4 0 3.8 1.3 3.8 3.6zM16 18c2.6 0 3.8-1.7 3.8-3.6-2.4 0-3.8 1.3-3.8 3.6z" fill="#14110f"/>`,
  },
  'day-047-music-festival': {
    name: 'Solstice Sound',
    tile: '#0b1530',
    pageBg: '#f4f1e8',
    // The sun on the horizon: a half-disc rising over two water-lines.
    mark: `<path d="M5 19a11 11 0 0 1 22 0z" fill="#ff8a1f"/><rect x="5" y="22" width="22" height="2.4" rx="1.2" fill="#0b1530"/><rect x="9" y="26.6" width="14" height="2.4" rx="1.2" fill="#0b1530"/>`,
    tileMark: `<path d="M6 19a10 10 0 0 1 20 0z" fill="#ffd84a"/><rect x="6" y="22" width="20" height="2.4" rx="1.2" fill="#f4f1e8"/><rect x="10" y="26.2" width="12" height="2.4" rx="1.2" fill="#f4f1e8"/>`,
  },
  'day-048-magazine': {
    name: 'The Meridian',
    tile: '#0d0f12',
    pageBg: '#f3f4f6',
    // The meridian: an ink disc with one lime line of longitude through it.
    mark: `<circle cx="16" cy="16" r="12.5" fill="#0d0f12"/><rect x="14.4" y="3.5" width="3.2" height="25" rx="1.6" fill="#d6f23b"/>`,
    tileMark: `<circle cx="16" cy="16" r="11" fill="#d6f23b"/><rect x="14.5" y="5" width="3" height="22" rx="1.5" fill="#0d0f12"/>`,
  },
  'day-049-dental-clinic': {
    name: 'Brightside Dental',
    tile: '#0e1b2b',
    pageBg: '#fbfcfd',
    // A tooth in ink with a gum-pink smile line.
    mark: `<path d="M16 7C13 4.2 8 4.2 6.5 8 5.2 11.5 8 14.5 8.5 18.5 9 22.5 9.6 27 11.8 27c2.4 0 2.2-5.5 4.2-5.5s1.8 5.5 4.2 5.5c2.2 0 2.8-4.5 3.3-8.500.5-4 3.300-7 2-10.500C24 4.200 19 4.200 16 7z" fill="#0e1b2b"/><path d="M11.500 14.200Q16 18.600 20.500 14.200" fill="none" stroke="#ff8fa3" stroke-width="2.100" stroke-linecap="round"/>`,
    tileMark: `<path d="M16 8C13.500 5.700 9.500 5.700 8.200 8.800 7.100 11.700 9.400 14.200 9.800 17.500 10.200 20.800 10.800 25 12.700 25c2 0 1.800-4.600 3.300-4.600s1.300 4.600 3.300 4.600c1.900 0 2.500-4.200 2.900-7.500.4-3.300 2.700-5.800 1.600-8.700C22.500 5.700 18.500 5.700 16 8z" fill="#fff"/><path d="M12.200 14.400Q16 18 19.800 14.400" fill="none" stroke="#ff8fa3" stroke-width="1.900" stroke-linecap="round"/>`,
  },
  'day-050-recipes': {
    name: 'Citrus & Salt',
    tile: '#17222c',
    pageBg: '#f5f7f8',
    // A lemon slice: a lemon disc cut into segments by slate pith lines.
    mark: `<circle cx="16" cy="16" r="13" fill="#ffd60a"/><circle cx="16" cy="16" r="13" fill="none" stroke="#17222c" stroke-width="2"/><path d="M16 5v22M6.5 10.5l19 11M6.5 21.5l19-11" stroke="#17222c" stroke-width="1.8" stroke-linecap="round"/>`,
    tileMark: `<circle cx="16" cy="16" r="11.5" fill="#ffd60a"/><path d="M16 6v20M7 11l18 10M7 21l18-10" stroke="#17222c" stroke-width="1.8" stroke-linecap="round"/>`,
  },
  'day-051-job-board': {
    name: 'Hirewell',
    tile: '#0f1220',
    pageBg: '#f4f5f9',
    // Two pay bars of different lengths on cobalt, with an orange tick between them.
    mark: `<rect width="32" height="32" rx="8" fill="#2a44ff"/><rect x="6" y="8" width="14" height="5" rx="2.5" fill="#fff"/><rect x="11" y="19" width="15" height="5" rx="2.5" fill="#fff"/><rect x="15.2" y="5" width="2.6" height="22" rx="1.3" fill="#ff6a1a"/>`,
    tileMark: `<rect x="4" y="4" width="24" height="24" rx="6" fill="#2a44ff"/><rect x="8" y="10" width="10" height="4" rx="2" fill="#fff"/><rect x="12" y="18" width="12" height="4" rx="2" fill="#fff"/><rect x="15.3" y="7.5" width="2.4" height="17" rx="1.2" fill="#ff6a1a"/>`,
  },
  'day-052-yoga-studio': {
    name: 'Stillwater',
    tagline: 'Yoga and pilates in Brighton',
    tile: '#0c2a31',
    pageBg: '#f2f7f7',
    // Three ripples on still water; the middle one is filled with early-morning light.
    mark: `<circle cx="16" cy="16" r="13.5" fill="none" stroke="#0c2a31" stroke-width="1.8"/><circle cx="16" cy="16" r="9" fill="#f2c46d"/><circle cx="16" cy="16" r="4.2" fill="none" stroke="#0c2a31" stroke-width="1.8"/>`,
    tileMark: `<circle cx="16" cy="16" r="12.5" fill="none" stroke="#cadfe2" stroke-width="1.6"/><circle cx="16" cy="16" r="8.5" fill="#f2c46d"/><circle cx="16" cy="16" r="3.8" fill="none" stroke="#0c2a31" stroke-width="1.6"/>`,
  },
  'day-053-podcast-network': {
    name: 'Static',
    tagline: 'An independent podcast network',
    tile: '#16181b',
    pageBg: '#e3e5e8',
    // A half-dial: five tick marks on an arc and a red tuning needle.
    mark: `<path d="M3 24a13 13 0 0 1 26 0" fill="none" stroke="#16181b" stroke-width="2.4" stroke-linecap="round"/><path d="M6.2 15.5l1.4 1M11 10.4l1 1.5M16 8.4v1.8M21 10.4l-1 1.5M25.8 15.5l-1.4 1" stroke="#16181b" stroke-width="1.8" stroke-linecap="round"/><path d="M16 25L21.5 12.5" stroke="#e5322d" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="25" r="2.4" fill="#16181b"/>`,
    tileMark: `<path d="M5 23a11 11 0 0 1 22 0" fill="none" stroke="#e3e5e8" stroke-width="2.2" stroke-linecap="round"/><path d="M16 24L21 13" stroke="#e5322d" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="24" r="2.3" fill="#ffb347"/>`,
  },
  'day-054-education': {
    name: 'Nexora Education',
    tagline: 'Learn forward. Build what matters.',
    ogFontSize: 82,
    tile: '#14213D',
    pageBg: '#F8F7F2',
    // An open book whose centre line rises into a learning path: recognisable at favicon size without a generic cap.
    mark: `<path d="M3.5 7.5c5.4 0 9.1 1.5 12.5 4.8v15.2c-3.4-3-7.1-4.4-12.5-4.4z" fill="#3157D5"/><path d="M28.5 7.5c-5.4 0-9.1 1.5-12.5 4.8v15.2c3.4-3 7.1-4.4 12.5-4.4z" fill="#14213D"/><path d="M16 12.3V5.8" stroke="#3157D5" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="3.5" r="2" fill="#3157D5"/>`,
    tileMark: `<path d="M4.5 8.5c4.9 0 8.2 1.4 11.5 4.3v13.7c-3.3-2.7-6.6-4-11.5-4z" fill="#9FB2F2"/><path d="M27.5 8.5c-4.9 0-8.2 1.4-11.5 4.3v13.7c3.3-2.7 6.6-4 11.5-4z" fill="#FFFFFF"/><path d="M16 12.8V6.5" stroke="#9FB2F2" stroke-width="1.9" stroke-linecap="round"/><circle cx="16" cy="4.2" r="1.8" fill="#9FB2F2"/>`,
  },
  'day-055-wedding-venue': {
    name: 'Hollowfield Barn',
    tagline: 'A wedding barn in the Cotswolds',
    tile: '#231b17',
    pageBg: '#f4f3f0',
    // A barn: a gabled front in barn red with a white braced door.
    mark: `<path d="M3.5 28.5V13.2L16 4l12.5 9.2v15.3z" fill="#9a2f22"/><rect x="10" y="15" width="12" height="13.5" fill="#f4f3f0"/><path d="M10 15l12 13.5M22 15L10 28.5" stroke="#9a2f22" stroke-width="1.6"/><rect x="10" y="15" width="12" height="13.5" fill="none" stroke="#9a2f22" stroke-width="1.6"/>`,
    tileMark: `<path d="M5 26.5V14.3L16 6l11 8.3v12.2z" fill="#c9503f"/><rect x="11" y="15.5" width="10" height="11" fill="#f4f3f0"/><path d="M11 15.5l10 11M21 15.5l-10 11" stroke="#c9503f" stroke-width="1.4"/>`,
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
  // The same artwork as a TypeScript module, so the Mark component can draw it inline in each site's header and footer.
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
    // Share image (1200 x 630): the mark large on the page colour, with the name and a line about the site.
    const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${b.pageBg}"/><g transform="translate(90 135) scale(10.6)">${b.mark}</g><text x="520" y="300" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${b.ogFontSize || 108}" letter-spacing="-4" fill="${b.tile}">${esc(b.name)}</text><text x="524" y="380" font-family="Arial, Helvetica, sans-serif" font-size="38" fill="${b.tile}" fill-opacity="0.72">${esc(b.tagline || '')}</text></svg>`;
    await writeFile(join(dir, 'og.png'), await sharp(Buffer.from(og), { density: 144 }).resize(1200, 630).png().toBuffer());
    await writeFile(join(dir, 'favicon.ico'), ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tile, size) })))));
    console.log('wrote', folder);
  }
  // A review sheet: each mark large on its page colour, then at favicon sizes on a tile.
  const cell = 260, rows = Object.entries(BRANDS);
  const comp = [];
  for (let i = 0; i < rows.length; i++) {
    const [, b] = rows[i];
    comp.push({ input: await png(svg(b.mark, b.pageBg), 200), left: 30, top: i * cell + 30 });
    comp.push({ input: await png(svg(b.tileMark, b.tile), 128), left: 270, top: i * cell + 66 });
    comp.push({ input: await png(svg(b.tileMark, b.tile), 32), left: 430, top: i * cell + 114 });
    comp.push({ input: await png(svg(b.tileMark, b.tile), 16), left: 490, top: i * cell + 122 });
  }
  await sharp({ create: { width: 560, height: cell * rows.length, channels: 3, background: '#ffffff' } }).composite(comp).png().toFile(join(ROOT, 'public', '_brand-review.png'));
}
