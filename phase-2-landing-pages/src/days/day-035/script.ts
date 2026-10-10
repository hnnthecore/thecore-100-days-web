/**
 * Day 035 · Apex Motor Group · interactions.
 * Colour studio · filterable stock with compare · HP/PCP finance maths · part-exchange valuation · 100-point ring · test-drive booking.
 */
import { car, type Body } from './art';
import { CAR_THUMBS, CAR_ALTS } from './photos';

type Car = { id: string; make: string; model: string; year: number; body: Body; fuel: string; price: number; miles: number; gear: string; color: string; colorName: string; spec: string };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.ax');
const CARS: Car[] = JSON.parse(root.dataset.cars!);
const byId = (id: string) => CARS.find((c) => c.id === id)!;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const smooth = reduce ? 'auto' : 'smooth';

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Finance maths ---------- */
function payment(price: number, deposit: number, months: number, apr: number, pcp: boolean) {
  const loan = Math.max(0, price - deposit);
  const balloon = pcp ? price * 0.4 : 0;
  const r = apr / 100 / 12;
  const pv = loan - balloon / (1 + r) ** months;
  const monthly = r === 0 ? (loan - balloon) / months : (pv * r) / (1 - (1 + r) ** -months);
  const total = deposit + monthly * months + balloon;
  return { monthly: Math.max(0, monthly), total, balloon, interest: Math.max(0, total - price) };
}

/* ---------- Hero studio ---------- */
let heroBody: Body = 'hatch';
let heroColor = '#3f6fb5';
const stage = $('[data-hero-car]');
function paintHero() { stage.innerHTML = car(heroBody, heroColor, `A ${heroBody} car in the selected colour`); }
$('[data-hero-body]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  heroBody = b.dataset.b as Body;
  $$('[data-hero-body] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paintHero();
});
$('[data-hero-colors]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  heroColor = b.dataset.c!;
  $('[data-hero-colname]').textContent = b.dataset.n!;
  $$('[data-hero-colors] button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paintHero();
});
$('[data-see-body]').addEventListener('click', () => setBody(heroBody));
paintHero();

/* ---------- Stock ---------- */
let bodyF = 'all';
const fuelSel = $<HTMLSelectElement>('#f-fuel');
const priceIn = $<HTMLInputElement>('#f-price');
const sortSel = $<HTMLSelectElement>('#f-sort');
const grid = $('[data-grid]');
const cmp = new Set<string>();
const cmpBar = $('[data-cmpbar]');

function setBody(b: string) {
  bodyF = b;
  $$('[data-body]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.body === b)));
  paintStock();
}
function paintStock() {
  const max = Number(priceIn.value);
  $('[data-price-out]').textContent = gbp(max);
  const list = CARS.filter((c) => (bodyF === 'all' || c.body === bodyF) && (fuelSel.value === 'All' || c.fuel === fuelSel.value) && c.price <= max);
  const key = sortSel.value;
  list.sort((a, b) => key === 'price-asc' ? a.price - b.price : key === 'price-desc' ? b.price - a.price : key === 'miles' ? a.miles - b.miles : b.year - a.year);
  const ids = new Set(list.map((c) => c.id));
  CARS.forEach((c) => { $(`[data-car="${c.id}"]`).hidden = !ids.has(c.id); });
  list.forEach((c) => grid.append($(`[data-car="${c.id}"]`)));
  $('[data-count]').textContent = `${list.length} of ${CARS.length} cars`;
  $('[data-empty]').hidden = list.length > 0;
  CARS.forEach((c) => { const p = payment(c.price, c.price * 0.1, 48, 7.9, false); $('[data-pm]', $(`[data-car="${c.id}"]`)).textContent = `from ${gbp(p.monthly)}/mo`; });
}
$('[data-body-filter]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) setBody(b.dataset.body!); });
[fuelSel, priceIn, sortSel].forEach((el) => el.addEventListener('input', paintStock));
$<HTMLFormElement>('[data-filters]').addEventListener('submit', (e) => e.preventDefault());

/* Compare */
const dlg = $<HTMLDialogElement>('[data-dialog]');
let lastOpener: HTMLElement | null = null;
function paintCmp() {
  $$<HTMLInputElement>('[data-cmp]').forEach((i) => { i.checked = cmp.has(i.dataset.cmp!); i.disabled = !i.checked && cmp.size >= 3; $(`[data-car="${i.dataset.cmp}"]`).classList.toggle('is-cmp', i.checked); });
  cmpBar.hidden = cmp.size === 0;
  $('[data-cmp-n]').textContent = String(cmp.size);
  $<HTMLButtonElement>('[data-cmp-open]').disabled = cmp.size < 2;
}
grid.addEventListener('change', (e) => { const i = e.target as HTMLInputElement; if (!i.dataset.cmp) return; i.checked ? cmp.add(i.dataset.cmp) : cmp.delete(i.dataset.cmp); paintCmp(); });
$('[data-cmp-clear]').addEventListener('click', () => { cmp.clear(); paintCmp(); });
$('[data-cmp-open]').addEventListener('click', (e) => {
  const cs = [...cmp].map(byId);
  const best = (f: (c: Car) => number, low = true) => { const v = cs.map(f); return low ? Math.min(...v) : Math.max(...v); };
  const row = (label: string, f: (c: Car) => string, mark?: (c: Car) => boolean) => `<tr><th scope="row">${label}</th>${cs.map((c) => `<td${mark?.(c) ? ' class="best"' : ''}>${f(c)}</td>`).join('')}</tr>`;
  $('[data-cmp-table]').innerHTML = `<table class="ax-table"><thead><tr><td></td>${cs.map((c) => `<th scope="col">${esc(c.make)} ${esc(c.model)}</th>`).join('')}</tr></thead><tbody>
    ${row('Price', (c) => gbp(c.price), (c) => c.price === best((x) => x.price))}
    ${row('Year', (c) => String(c.year), (c) => c.year === best((x) => x.year, false))}
    ${row('Mileage', (c) => c.miles.toLocaleString('en-GB') + ' mi', (c) => c.miles === best((x) => x.miles))}
    ${row('Fuel', (c) => c.fuel)}${row('Gearbox', (c) => c.gear)}${row('Efficiency', (c) => esc(c.spec))}${row('Colour', (c) => esc(c.colorName))}
    ${row('From per month', (c) => gbp(payment(c.price, c.price * 0.1, 48, 7.9, false).monthly), (c) => c.price === best((x) => x.price))}
  </tbody></table><p class="ax-fine" style="margin-top:1rem;color:#62646b;font-size:.8rem">Green marks the best value in each row. Monthly figures: 10% deposit, 48 months, 7.9% APR (illustrative).</p>`;
  lastOpener = e.currentTarget as HTMLElement;
  dlg.showModal();
});
$('[data-dialog-close]').addEventListener('click', () => dlg.close());
dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('close', () => lastOpener?.focus());
grid.addEventListener('click', (e) => { const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-drive]'); if (a) { carSel.value = a.dataset.drive!; paintDrive(); } });
paintStock(); paintCmp();

/* ---------- Finance ---------- */
const fin = $<HTMLFormElement>('[data-fin]');
const finCar = $<HTMLSelectElement>('#fi-car');
const dep = $<HTMLInputElement>('#fi-dep');
const term = $<HTMLInputElement>('#fi-term');
const apr = $<HTMLInputElement>('#fi-apr');
function paintFin() {
  const c = byId(finCar.value);
  const pcp = (fin.elements.namedItem('ftype') as RadioNodeList).value === 'pcp';
  term.max = pcp ? '48' : '60';
  if (Number(term.value) > Number(term.max)) term.value = term.max;
  dep.max = String(Math.round((c.price * 0.5) / 250) * 250);
  if (Number(dep.value) > Number(dep.max)) dep.value = dep.max;
  const d = Number(dep.value), n = Number(term.value), a = Number(apr.value);
  const p = payment(c.price, d, n, a, pcp);
  $('[data-dep-out]').textContent = gbp(d);
  $('[data-term-out]').textContent = `${n} months`;
  $('[data-apr-out]').textContent = a.toFixed(1) + '%';
  $('[data-monthly]').textContent = gbp(p.monthly);
  $('[data-total]').textContent = gbp(p.total);
  $('[data-balloon-row]').hidden = !pcp;
  $('[data-balloon]').textContent = gbp(p.balloon);
  const pct = (v: number) => (v / p.total) * 100;
  const depP = pct(d), prinP = pct(c.price - d), intP = Math.max(0, 100 - depP - prinP);
  const seg = (name: string, len: number, off: number) => { const el = $(`[data-seg="${name}"]`); el.setAttribute('stroke-dasharray', `${len.toFixed(2)} ${(100 - len).toFixed(2)}`); el.setAttribute('stroke-dashoffset', String(-off.toFixed(2))); };
  seg('dep', depP, 0); seg('prin', prinP, depP); seg('int', intP, depP + prinP);
  $('[data-l-dep]').textContent = gbp(d); $('[data-l-prin]').textContent = gbp(c.price - d); $('[data-l-int]').textContent = gbp(p.interest);
}
fin.addEventListener('input', paintFin);
fin.addEventListener('submit', (e) => e.preventDefault());
$('[data-fin-go]').addEventListener('click', () => { carSel.value = finCar.value; paintDrive(); });
paintFin();

/* ---------- Part-exchange ---------- */
const val = $<HTMLFormElement>('[data-val]');
const reg = $<HTMLInputElement>('#v-reg');
let partex = '';
const MODELS: [string, number][] = [['Ford Focus', 21000], ['Vauxhall Corsa', 16500], ['Nissan Qashqai', 28000], ['Honda Civic', 24500], ['Skoda Octavia', 26000], ['Peugeot 208', 18500], ['MINI Cooper', 22500], ['Hyundai i30', 20500]];
val.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = reg.value.trim().toUpperCase().replace(/\s+/g, '');
  const m = v.match(/^([A-Z]{2})(\d{2})([A-Z]{3})$/);
  const nowY = new Date().getFullYear();
  const n = m ? Number(m[2]) : 0;
  const yr = n >= 51 ? 2000 + n - 50 : 2000 + n;
  const ok = !!m && yr >= 2001 && yr <= nowY;
  reg.setAttribute('aria-invalid', String(!ok));
  $('#v-reg-e').hidden = ok;
  if (!ok) { reg.focus(); $('[data-val-out]').hidden = true; return; }
  const h = [...v].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
  const [name, base] = MODELS[h % MODELS.length];
  const age = Math.max(0, nowY - yr);
  const miles = Number($<HTMLInputElement>('#v-miles').value) || 0;
  const cond = Number($<HTMLSelectElement>('#v-cond').value);
  const sh = $<HTMLInputElement>('#v-sh').checked ? 1 : 0.95;
  const excess = Math.max(0, miles - age * 9000);
  const mid = Math.max(500, base * 0.82 ** age * (1 - Math.min(0.35, excess / 250000)) * cond * sh);
  const lo = Math.round((mid * 0.95) / 50) * 50, hi = Math.round((mid * 1.05) / 50) * 50;
  $('[data-val-out]').hidden = false;
  $('[data-val-car]').textContent = `${yr} ${name} · ${miles.toLocaleString('en-GB')} mi · ${v.slice(0, 4)} ${v.slice(4)}`;
  $('[data-val-range]').textContent = `${gbp(lo)} – ${gbp(hi)}`;
  $('[data-val-note]').textContent = 'Guaranteed for 7 days, subject to a quick in-person check. Demo valuation: the make and model are generated, not looked up.';
  partex = `Part-exchange: ${yr} ${name}, ${miles.toLocaleString('en-GB')} miles, valued ${gbp(lo)} to ${gbp(hi)}.`;
});
$('[data-val-go]').addEventListener('click', () => { $<HTMLTextAreaElement>('[data-note]').value = partex; $('[data-sum-px]').textContent = partex.replace('Part-exchange: ', '').split(', valued')[0]; });

/* ---------- 100-point ring ---------- */
const arc = $('[data-ring-arc]');
const ringN = $('[data-ring-n]');
new IntersectionObserver((es, io) => {
  if (!es[0].isIntersecting) return;
  io.disconnect();
  if (reduce) { arc.setAttribute('stroke-dasharray', '100 0'); ringN.textContent = '100'; return; }
  arc.setAttribute('stroke-dasharray', '100 0');
  const t0 = performance.now();
  const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1600); ringN.textContent = String(Math.round(100 * (1 - (1 - p) ** 3))); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}, { threshold: 0.5 }).observe($('[data-ring]'));

/* ---------- Test drive ---------- */
const carSel = $<HTMLSelectElement>('#d-car');
const st = { date: '', slot: '' };
const today = new Date(); today.setHours(0, 0, 0, 0);
const days = Array.from({ length: 10 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
const slotsFor = (d: Date) => (d.getDay() === 0 ? ['11:00', '12:00', '13:00', '14:00', '15:00'] : ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']);
function free(d: Date, s: string) { let h = 2166136261; for (const c of `${carSel.value}|${iso(d)}|${s}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return ((h >>> 0) % 100) >= 30; }
const daysEl = $('[data-days]');
const slotsEl = $('[data-slots]');
function paintDays() {
  daysEl.innerHTML = days.map((d) => `<label class="ax-pick"><input type="radio" name="day" value="${iso(d)}" ${slotsFor(d).some((s) => free(d, s)) ? '' : 'disabled'} ${st.date === iso(d) ? 'checked' : ''}/><span><small>${d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></span></label>`).join('');
}
function paintSlots() {
  if (!st.date) { slotsEl.innerHTML = '<p class="text-sm" style="color:#62646b">Choose a day first.</p>'; return; }
  const d = new Date(st.date + 'T00:00');
  if (st.slot && !free(d, st.slot)) st.slot = '';
  slotsEl.innerHTML = slotsFor(d).map((s) => `<label class="ax-pick"><input type="radio" name="slot" value="${s}" ${free(d, s) ? '' : 'disabled'} ${st.slot === s ? 'checked' : ''}/><span style="padding-block:.8rem">${s}</span></label>`).join('');
}
function paintDrive() {
  const c = byId(carSel.value);
  paintDays(); paintSlots();
  $('[data-sum-art]').innerHTML = CAR_THUMBS[c.id] ? `<img class="ax-sum__photo" src="${CAR_THUMBS[c.id]}" alt="${CAR_ALTS[c.id]}" width="480" height="300" />` : car(c.body, c.color, `${c.make} ${c.model}`);
  $('[data-sum-name]').textContent = `${c.year} ${c.make} ${c.model}`;
  $('[data-sum-price]').textContent = gbp(c.price);
  $('[data-sum-when]').textContent = st.date && st.slot ? `${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${st.slot}` : 'Not chosen';
}
carSel.addEventListener('change', paintDrive);
daysEl.addEventListener('change', (e) => { st.date = (e.target as HTMLInputElement).value; paintSlots(); paintDrive(); });
slotsEl.addEventListener('change', (e) => { st.slot = (e.target as HTMLInputElement).value; paintDrive(); });

const form = $<HTMLFormElement>('[data-book]');
const bookErr = $('[data-book-err]');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function valid(i: HTMLInputElement) {
  const v = i.value.trim();
  const ok = i.type === 'email' ? EMAIL.test(v) : i.type === 'tel' ? v.replace(/\D/g, '').length >= 10 : v.length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]', form).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  bookErr.hidden = true;
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !valid(i));
  const lic = $<HTMLInputElement>('[data-licence]');
  $('#d-licence-e').hidden = lic.checked;
  if (!st.date || !st.slot) { bookErr.textContent = !st.date ? 'Pick a day.' : 'Pick a time.'; bookErr.hidden = false; $<HTMLElement>(!st.date ? '[name="day"]:not(:disabled)' : '[name="slot"]:not(:disabled)').focus(); return; }
  if (bad.length || !lic.checked) { (bad[0] ?? lic).focus(); return; }
  const c = byId(carSel.value);
  $('[data-done-name]').textContent = $<HTMLInputElement>('#d-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = `${c.year} ${c.make} ${c.model}, ${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at ${st.slot}. We’ll have it fuelled, warm and parked out front. Bring your licence.`;
  $('[data-ref]').textContent = 'AX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-sum]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
$('[data-again]').addEventListener('click', () => {
  st.date = ''; st.slot = ''; form.reset();
  $$<HTMLInputElement>('[data-req]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  form.hidden = false; $('[data-sum]').hidden = false; $('[data-done]').hidden = true;
  $('[data-sum-px]').textContent = 'Not added';
  paintDrive();
});
paintDrive();
