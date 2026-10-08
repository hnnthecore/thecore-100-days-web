/**
 * Day 040 · Halide & Co. · interactions.
 * Aperture / depth-of-field demo · filterable portfolio with a native-dialog lightbox · package pricing · scroll-driven process line ·
 * turnaround dates · availability calendar · enquiry form.
 */
import { photo, type Kind } from './art';

type Shot = { id: number; kind: Kind; v: number; cat: string; title: string; place: string; ratio: string; lens: string; f: number; shutter: string; iso: number };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.hc');
const SHOTS: Shot[] = JSON.parse(root.dataset.shots!);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const long = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Aperture demo ---------- */
const STOPS = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16];
const BLUR_BG = [16, 11, 7, 4, 2, 0.6, 0, 0];
const BLUR_FG = [9, 6, 4, 2, 1, 0, 0, 0];
const SHUT = [2000, 1000, 500, 250, 125, 60, 30, 15];
const NOTES = ['Very shallow: the subject glows and the world melts away. Our signature portrait look.', 'Very shallow: beautiful for portraits and quiet moments in the ceremony.', 'Shallow: soft backgrounds with a touch more context. Great for couples.', 'Shallow-to-medium: faces sharp, setting gently hinted at.', 'Balanced: subject crisp and the place still recognisable.', 'Balanced: everyone in a group sharp, from front to back.', 'Deep: nearly everything sharp. Ideal for landscapes and venues.', 'Very deep: front to back sharpness, used for architecture and wide scenes.'];
const ap = $<HTMLInputElement>('#ap');
const scene = $('[data-aperture-scene]');
function paintAperture() {
  const i = Number(ap.value);
  scene.style.setProperty('--b-bg', BLUR_BG[i] + 'px');
  scene.style.setProperty('--b-fg', BLUR_FG[i] + 'px');
  $('[data-ap-out]').textContent = `f/${STOPS[i]}`;
  $('[data-ap-note]').textContent = NOTES[i];
  $('[data-exif]').textContent = `f/${STOPS[i]} · 1/${SHUT[i]} s · ISO 100 · 50 mm`;
  ap.setAttribute('aria-valuetext', `f/${STOPS[i]}`);
}
ap.addEventListener('input', paintAperture);
paintAperture();

/* ---------- Portfolio & lightbox ---------- */
let cat = 'all';
const visible = () => SHOTS.filter((s) => cat === 'all' || s.cat === cat);
function paintGallery() {
  const ids = new Set(visible().map((s) => s.id));
  let n = 0;
  SHOTS.forEach((s) => { const li = $(`[data-shot="${s.id}"]`); li.hidden = !ids.has(s.id); if (ids.has(s.id)) li.style.animationDelay = `${n++ * 50}ms`; });
}
$('[data-cats]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  cat = b.dataset.cat!;
  $$('[data-cats] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paintGallery();
});
const lb = $<HTMLDialogElement>('[data-lightbox]');
let cur = 0, opener: HTMLElement | null = null;
function showShot(i: number) {
  const list = visible();
  cur = (i + list.length) % list.length;
  const s = list[cur];
  const [w, h] = s.ratio.split('/').map((x) => Number(x.trim()));
  const img = $('[data-lb-img]');
  img.style.setProperty('--r', s.ratio);
  img.style.setProperty('--rn', String(w / h));
  img.innerHTML = photo(s.kind, s.v, `${s.title}, ${s.place}`);
  $('[data-lb-title]').textContent = s.title;
  $('[data-lb-place]').textContent = s.place;
  $('[data-lb-exif]').textContent = `${s.lens} · f/${s.f} · ${s.shutter} s · ISO ${s.iso}`;
  $('[data-lb-count]').textContent = `${cur + 1} / ${list.length}`;
}
$('[data-masonry]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-open]');
  if (!b) return;
  opener = b;
  showShot(visible().findIndex((s) => s.id === Number(b.dataset.open)));
  lb.showModal();
});
$('[data-lb-close]').addEventListener('click', () => lb.close());
$('[data-lb-prev]').addEventListener('click', () => showShot(cur - 1));
$('[data-lb-next]').addEventListener('click', () => showShot(cur + 1));
lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') showShot(cur - 1); if (e.key === 'ArrowRight') showShot(cur + 1); });
lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
lb.addEventListener('close', () => opener?.focus());

/* ---------- Packages ---------- */
type Pkg = { name: string; base: number; incl: number; extra: number; min: number; max: number; def: number; items: string[]; days: number };
const PKG: Record<string, Pkg> = {
  wedding: { name: 'Wedding', base: 1800, incl: 6, extra: 220, min: 4, max: 12, def: 8, days: 42, items: ['Pre-wedding call and shot list', 'Private online gallery with downloads', 'Around 70 edited images per hour', 'Full print release'] },
  portrait: { name: 'Portrait', base: 280, incl: 1, extra: 120, min: 1, max: 4, def: 1, days: 7, items: ['One location of your choice', 'Outfit-change guidance', '15+ edited images', 'Print release'] },
  family: { name: 'Family', base: 350, incl: 2, extra: 140, min: 1, max: 4, def: 2, days: 10, items: ['Relaxed, playful session', 'Child-friendly approach', '30+ edited images', 'Print release'] },
  brand: { name: 'Brand', base: 650, incl: 4, extra: 150, min: 2, max: 10, def: 4, days: 14, items: ['Shot list and mood board', 'Licence for web and social', '40+ edited images', 'Retouching of hero shots'] },
};
const ADDONS = [
  { id: 'second', name: 'Second photographer', note: 'Two angles, two moments at once', price: 450, only: ['wedding'] },
  { id: 'album', name: 'Heirloom album', note: '30 pages, linen cover', price: 380, only: ['wedding', 'family'] },
  { id: 'prints', name: 'Fine-art print set', note: 'Ten 8×10 prints', price: 120, only: ['wedding', 'portrait', 'family', 'brand'] },
  { id: 'drone', name: 'Aerial photography', note: 'Licensed drone pilot', price: 250, only: ['wedding', 'brand'] },
  { id: 'rush', name: 'Rush editing', note: 'Gallery in half the time', price: 150, only: ['wedding', 'portrait', 'family', 'brand'] },
];
const build = $<HTMLFormElement>('[data-build]');
const hrs = $<HTMLInputElement>('#hrs');
const picked = new Set<string>();
let kind = 'wedding';
const kindVal = () => (build.elements.namedItem('kind') as RadioNodeList).value;
function setKind(k: string) {
  kind = k;
  const p = PKG[k];
  hrs.min = String(p.min); hrs.max = String(p.max); hrs.value = String(p.def);
  ADDONS.forEach((a) => { if (!a.only.includes(k)) picked.delete(a.id); });
  paintAddons();
}
function paintAddons() {
  $('[data-addons]').innerHTML = ADDONS.map((a) => { const ok = a.only.includes(kind); return `<label class="hc-addon${ok ? '' : ' is-off'}"><input type="checkbox" value="${a.id}" ${picked.has(a.id) ? 'checked' : ''} ${ok ? '' : 'disabled'}/><span>${a.name}<small>${a.note}${ok ? '' : ' · not available for this shoot'}</small></span><em>+£${a.price}</em></label>`; }).join('');
  paintPkg();
}
function paintPkg() {
  const p = PKG[kind];
  const h = Number(hrs.value);
  const extraH = Math.max(0, h - p.incl);
  const lines: [string, number][] = [[`${p.name}, ${p.incl} h included`, p.base]];
  if (extraH) lines.push([`${extraH} extra hour${extraH > 1 ? 's' : ''} × ${gbp(p.extra)}`, extraH * p.extra]);
  ADDONS.filter((a) => picked.has(a.id)).forEach((a) => lines.push([a.name, a.price]));
  const total = lines.reduce((s, l) => s + l[1], 0);
  $('[data-hrs-out]').textContent = `${h} h`;
  $('[data-total]').textContent = gbp(total);
  $('[data-lines]').innerHTML = lines.map(([l, v]) => `<li><span>${l}</span><span>${gbp(v)}</span></li>`).join('');
  $('[data-incl]').innerHTML = p.items.map((i) => `<li>${i}</li>`).join('');
  $('[data-dep]').textContent = gbp(total * 0.3);
  const days = picked.has('rush') ? Math.ceil(p.days / 2) : p.days;
  $('[data-delivery]').textContent = days >= 14 ? `${Math.round(days / 7)} weeks` : `${days} days`;
  build.dataset.summary = `${p.name} package, ${h} h, ${lines.slice(1).map((l) => l[0]).join(', ') || 'no add-ons'}. Estimate ${gbp(total)}.`;
}
build.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  if (t.name === 'kind') { setKind(t.value); return; }
  if (t.type === 'checkbox') { t.checked ? picked.add(t.value) : picked.delete(t.value); }
  paintPkg();
});
build.addEventListener('input', (e) => { if ((e.target as HTMLElement).id === 'hrs') paintPkg(); });
build.addEventListener('submit', (e) => e.preventDefault());
$('[data-pack-go]').addEventListener('click', () => {
  $<HTMLSelectElement>('#e-kind').value = PKG[kind].name;
  $<HTMLTextAreaElement>('[data-note]').value = build.dataset.summary ?? '';
});
setKind(kindVal());

/* ---------- Process line & step reveal ---------- */
const steps = $('[data-steps]');
const fill = $('[data-steps-fill]');
function paintSteps() {
  const r = steps.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / (r.height + 40)));
  fill.parentElement!.style.setProperty('--p', `${(p * 100).toFixed(1)}%`);
  fill.style.setProperty('width', `${(p * 100).toFixed(1)}%`);
}
addEventListener('scroll', paintSteps, { passive: true });
paintSteps();
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.4 });
$$('[data-step]').forEach((s, i) => { s.style.transitionDelay = reduce ? '0s' : `${i * 80}ms`; io.observe(s); });

/* ---------- Turnaround ---------- */
const turn = $<HTMLFormElement>('[data-turn]');
const tKind = $<HTMLSelectElement>('#t-kind');
const tDate = $<HTMLInputElement>('#t-date');
const rush = $<HTMLInputElement>('[data-rush]');
function paintTurn() {
  if (!tDate.value) { $('[data-turn-out]').textContent = 'Pick a date'; return; }
  let days = Number(tKind.value);
  if (rush.checked) days = Math.ceil(days / 2);
  const d = new Date(tDate.value + 'T00:00'); d.setDate(d.getDate() + days);
  $('[data-turn-out]').textContent = `${long(d)}${rush.checked ? ' (rush)' : ''}`;
}
turn.addEventListener('input', paintTurn);
turn.addEventListener('submit', (e) => e.preventDefault());
paintTurn();

/* ---------- Availability calendar ---------- */
const today = new Date(); today.setHours(0, 0, 0, 0);
let view = new Date(today.getFullYear(), today.getMonth(), 1);
let sel = '';
function status(d: Date) {
  let h = 2166136261;
  for (const c of iso(d)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const r = (h >>> 0) % 100;
  const sat = d.getDay() === 6, peak = d.getMonth() >= 4 && d.getMonth() <= 8;
  const bookedCut = sat ? (peak ? 70 : 45) : d.getDay() === 0 ? 30 : 18;
  return r < bookedCut ? 'booked' : r < bookedCut + 14 ? 'one' : 'free';
}
function paintCal() {
  $('[data-month]').textContent = view.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  $<HTMLButtonElement>('[data-prev]').disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
  const last = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const lead = (view.getDay() + 6) % 7;
  let html = '<span class="hc-blank"></span>'.repeat(lead);
  for (let day = 1; day <= last; day++) {
    const d = new Date(view.getFullYear(), view.getMonth(), day);
    const past = d < today;
    const st = past ? 'past' : status(d);
    html += `<button type="button" class="hc-day${st === 'booked' ? ' is-booked' : ''}${st === 'one' ? ' is-one' : ''}${iso(d) === sel ? ' is-sel' : ''}" data-d="${iso(d)}" ${st === 'booked' || past ? 'disabled' : ''} aria-pressed="${iso(d) === sel}" aria-label="${long(d)}, ${past ? 'past' : st === 'booked' ? 'booked' : st === 'one' ? 'one slot left' : 'available'}">${day}</button>`;
  }
  $('[data-grid]').innerHTML = html;
}
$('[data-prev]').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); paintCal(); });
$('[data-next]').addEventListener('click', () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); paintCal(); });
$('[data-grid]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-d]');
  if (!b || b.disabled) return;
  sel = b.dataset.d!;
  const d = new Date(sel + 'T00:00');
  $('[data-picked]').textContent = `${long(d)}: ${status(d) === 'one' ? 'one slot left, so move quickly' : 'available'}`;
  $<HTMLInputElement>('#e-date').value = sel;
  tDate.value = sel; paintTurn();
  paintCal();
  $<HTMLButtonElement>(`[data-d="${sel}"]`)?.focus();
});
paintCal();

/* ---------- Enquiry ---------- */
const form = $<HTMLFormElement>('[data-enquire]');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function valid(i: HTMLInputElement) { const ok = i.type === 'email' ? EMAIL.test(i.value.trim()) : i.value.trim().length > 1; i.setAttribute('aria-invalid', String(!ok)); $(`#${i.id}-e`).hidden = ok; return ok; }
$$<HTMLInputElement>('[data-req]', form).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !valid(i));
  if (bad.length) { bad[0].focus(); return; }
  const date = $<HTMLInputElement>('#e-date').value;
  $('[data-done-name]').textContent = $<HTMLInputElement>('#e-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = `We’ve got your ${$<HTMLSelectElement>('#e-kind').value.toLowerCase()} enquiry${date ? ` for ${long(new Date(date + 'T00:00'))}` : ''}. One of us will reply personally within a day.`;
  $('[data-ref]').textContent = 'HC-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
