/**
 * Prepares the botanical plates for Day 46 (Wildcombe Herbal).
 *
 * Each plate is a scan on slightly different paper (white, cream, orange-ish). This script finds the paper colour from the
 * edges of the scan and stretches it to pure white, so every plate can sit on any colour field with `mix-blend-mode: multiply`
 * and take on the field's colour. It also resizes to 1400 px wide and keeps only the plates the shop uses.
 *
 * Run from this folder:   node scripts/prep-plates.mjs
 * Input and output: src/assets/day-046-plates/ (originals are downloaded with the Taste Skill's assets.mjs; credits.json lists them).
 */
import sharp from 'sharp';
import { readdir, readFile, writeFile, rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const DIR = join(fileURLToPath(new URL('../', import.meta.url)), 'src/assets/day-046-plates');
const KEEP = ['chamomile', 'nettle', 'lemon-balm', 'peppermint', 'lime', 'valerian', 'calendula', 'comfrey', 'elder', 'echinacea', 'thyme', 'lavender'];

/* The scan that is a Köhler plate of the nettle was downloaded as nettle-b. */
try { await rename(join(DIR, 'nettle.jpg'), join(DIR, 'nettle-flora-batava.jpg')); await rename(join(DIR, 'nettle-b.jpg'), join(DIR, 'nettle.jpg')); } catch { /* already done */ }

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

for (const name of KEEP) {
  const file = join(DIR, name + '.jpg');
  const img = sharp(file).rotate();
  const { data, info } = await img.clone().resize({ width: 600 }).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  // sample a band along every edge, ignoring the outermost pixels (scan shadows)
  const px = [[], [], []];
  const take = (x, y) => { const i = (y * w + x) * c; for (let k = 0; k < 3; k++) px[k].push(data[i + k]); };
  for (let t = 0.04; t < 0.12; t += 0.02) for (let x = Math.round(w * 0.1); x < w * 0.9; x += 3) { take(x, Math.round(h * t)); take(x, Math.round(h * (1 - t))); }
  for (let t = 0.04; t < 0.12; t += 0.02) for (let y = Math.round(h * 0.1); y < h * 0.9; y += 3) { take(Math.round(w * t), y); take(Math.round(w * (1 - t)), y); }
  const paper = px.map(median);
  const gain = paper.map((p) => Math.min(1.9, 252 / Math.max(p, 40)));
  const out = await img.linear(gain, [0, 0, 0]).resize({ width: 1400, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  await writeFile(file + '.tmp', out);
  await rename(file + '.tmp', file);
  console.log(name.padEnd(12), 'paper', paper.join(','), '-> white');
}

for (const f of await readdir(DIR)) if (f.endsWith('.jpg') && !KEEP.includes(f.replace('.jpg', ''))) await rm(join(DIR, f));

const credits = JSON.parse(await readFile(join(DIR, 'credits.json'), 'utf8'));
const kept = credits.filter((c) => KEEP.some((k) => c.file.endsWith('/' + k + '.jpg') || (k === 'nettle' && c.file.endsWith('/nettle-b.jpg'))));
for (const c of kept) c.file = c.file.replace('nettle-b.jpg', 'nettle.jpg');
await writeFile(join(DIR, 'credits.json'), JSON.stringify(kept, null, 1));
console.log('kept', kept.length, 'credits');
