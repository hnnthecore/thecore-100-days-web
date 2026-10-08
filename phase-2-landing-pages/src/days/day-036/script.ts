/**
 * Day 036 · Latch & Lane · interactions.
 * Buy / rent search with a live map · saved homes · affordability maths · postcode valuation with trend · area guide · viewing booking.
 */
import { home, type Kind } from './art';

type Prop = { id: string; mode: 'buy' | 'rent'; title: string; area: string; kind: Kind; price: number; beds: number; baths: number; sqft: number; tag: string; epc: string; x: number; y: number; wall: string; roof: string };
type Hood = { id: string; blurb: string; price: number; rent: number; commute: number; schools: number; green: number; night: number; tags: string[] };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.ll');
const PROPS: Prop[] = JSON.parse(root.dataset.props!);
const HOODS: Hood[] = JSON.parse(root.dataset.hoods!);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth = reduce ? 'auto' : 'smooth';
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const store = {
  get<T>(k: string, d: T): T { try { return JSON.parse(localStorage.getItem(k) ?? '') as T; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Search & listings ---------- */
let mode: 'buy' | 'rent' = 'buy';
const fArea = $<HTMLSelectElement>('#f-area');
const fBeds = $<HTMLSelectElement>('#f-beds');
const fPrice = $<HTMLInputElement>('#f-price');
const fSort = $<HTMLSelectElement>('#f-sort');
const list = $('[data-list]');
const pins = $('[data-pins]');
const saved = new Set<string>(store.get<string[]>('latch-saved', []));
let selected = '';

function setMode(m: 'buy' | 'rent', resetPrice = true) {
  mode = m;
  $$('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
  if (m === 'buy') { fPrice.min = '150000'; fPrice.max = '800000'; fPrice.step = '5000'; } else { fPrice.min = '800'; fPrice.max = '2500'; fPrice.step = '50'; }
  if (resetPrice) fPrice.value = fPrice.max;
  $('[data-pl]').textContent = m === 'buy' ? 'price' : 'rent';
  paint();
}
const short = (p: Prop) => (p.mode === 'buy' ? `£${Math.round(p.price / 1000)}k` : `£${p.price.toLocaleString('en-GB')}`);
function paint() {
  const max = Number(fPrice.value);
  $('[data-price-out]').textContent = gbp(max) + (mode === 'rent' ? ' pcm' : '');
  const visible = PROPS.filter((p) => p.mode === mode && (fArea.value === 'all' || p.area === fArea.value) && p.beds >= Number(fBeds.value) && p.price <= max);
  if (fSort.value === 'asc') visible.sort((a, b) => a.price - b.price);
  else if (fSort.value === 'desc') visible.sort((a, b) => b.price - a.price);
  const ids = new Set(visible.map((p) => p.id));
  PROPS.forEach((p) => { $(`[data-prop="${p.id}"]`).hidden = !ids.has(p.id); });
  visible.forEach((p) => list.append($(`[data-prop="${p.id}"]`)));
  $('[data-count]').textContent = `${visible.length} ${visible.length === 1 ? 'home' : 'homes'} ${mode === 'buy' ? 'for sale' : 'to rent'}${fArea.value !== 'all' ? ' in ' + fArea.value : ''}${saved.size ? ` · ${saved.size} saved` : ''}`;
  $('[data-empty]').hidden = visible.length > 0;
  pins.innerHTML = visible.map((p, i) => `<button type="button" class="ll-pin${selected === p.id ? ' is-sel' : ''}" data-pin="${p.id}" style="left:${p.x}%;top:${p.y}%;animation-delay:${reduce ? 0 : i * 70}ms" aria-label="${esc(p.title)}, ${esc(p.area)}, ${gbp(p.price)}${p.mode === 'rent' ? ' per month' : ''}">${short(p)}</button>`).join('');
  $$('[data-heart]').forEach((b) => b.setAttribute('aria-pressed', String(saved.has(b.dataset.heart!))));
}
$$<HTMLButtonElement>('[data-mode]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode as 'buy' | 'rent')));
[fArea, fBeds, fPrice, fSort].forEach((el) => el.addEventListener('input', paint));
$<HTMLFormElement>('[data-filters]').addEventListener('submit', (e) => e.preventDefault());
$<HTMLFormElement>('[data-search]').addEventListener('submit', (e) => {
  e.preventDefault();
  fArea.value = $<HTMLSelectElement>('#h-area').value;
  fBeds.value = $<HTMLSelectElement>('#h-beds').value;
  paint();
  $('#homes').scrollIntoView({ behavior: smooth });
});

/* Map ⇄ card sync */
const hot = (id: string, on: boolean) => { $(`[data-prop="${id}"]`)?.classList.toggle('is-hot', on); $(`[data-pin="${id}"]`)?.classList.toggle('is-hot', on); };
pins.addEventListener('mouseover', (e) => { const p = (e.target as HTMLElement).closest<HTMLElement>('[data-pin]'); if (p) hot(p.dataset.pin!, true); });
pins.addEventListener('mouseout', (e) => { const p = (e.target as HTMLElement).closest<HTMLElement>('[data-pin]'); if (p) hot(p.dataset.pin!, false); });
pins.addEventListener('focusin', (e) => { const p = (e.target as HTMLElement).closest<HTMLElement>('[data-pin]'); if (p) hot(p.dataset.pin!, true); });
pins.addEventListener('focusout', (e) => { const p = (e.target as HTMLElement).closest<HTMLElement>('[data-pin]'); if (p) hot(p.dataset.pin!, false); });
pins.addEventListener('click', (e) => {
  const p = (e.target as HTMLElement).closest<HTMLElement>('[data-pin]');
  if (!p) return;
  selected = p.dataset.pin!;
  $$('[data-prop]').forEach((c) => c.classList.toggle('is-sel', c.dataset.prop === selected));
  $$('[data-pin]').forEach((x) => x.classList.toggle('is-sel', x.dataset.pin === selected));
  const card = $(`[data-prop="${selected}"]`);
  card.scrollIntoView({ block: 'center', behavior: smooth });
  card.focus({ preventScroll: true });
});
list.addEventListener('mouseover', (e) => { const c = (e.target as HTMLElement).closest<HTMLElement>('[data-prop]'); if (c) hot(c.dataset.prop!, true); });
list.addEventListener('mouseout', (e) => { const c = (e.target as HTMLElement).closest<HTMLElement>('[data-prop]'); if (c) hot(c.dataset.prop!, false); });
list.addEventListener('click', (e) => {
  const h = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-heart]');
  if (h) { const id = h.dataset.heart!; saved.has(id) ? saved.delete(id) : saved.add(id); store.set('latch-saved', [...saved]); paint(); return; }
  const v = (e.target as HTMLElement).closest<HTMLAnchorElement>('[data-view]');
  if (v) { propSel.value = v.dataset.view!; paintBook(); }
});

/* ---------- Affordability ---------- */
const af = $<HTMLFormElement>('[data-afford]');
const inc = $<HTMLInputElement>('#a-inc'), dep = $<HTMLInputElement>('#a-dep'), debt = $<HTMLInputElement>('#a-debt');
const rate = $<HTMLSelectElement>('#a-rate'), term = $<HTMLSelectElement>('#a-term');
let budget = 0;
function pmt(loan: number, r: number, n: number) { const m = r / 100 / 12; return m === 0 ? loan / n : (loan * m) / (1 - (1 + m) ** -n); }
function pv(payment: number, r: number, n: number) { const m = r / 100 / 12; return m === 0 ? payment * n : (payment * (1 - (1 + m) ** -n)) / m; }
function paintAfford() {
  const income = Number(inc.value), deposit = Number(dep.value), d = Number(debt.value);
  const years = Number(term.value), r = Number(rate.value);
  $('[data-inc-out]').textContent = gbp(income); $('[data-dep-out]').textContent = gbp(deposit); $('[data-debt-out]').textContent = gbp(d);
  const byMultiple = Math.max(0, 4.5 * income - 60 * d);
  const maxPay = Math.max(0, 0.35 * ((income * 0.72) / 12) - d);
  const loan = Math.min(byMultiple, pv(maxPay, r, years * 12));
  budget = loan + deposit;
  const n = PROPS.filter((p) => p.mode === 'buy' && p.price <= budget).length;
  const total = PROPS.filter((p) => p.mode === 'buy').length;
  $('[data-budget]').textContent = gbp(Math.round(budget / 1000) * 1000);
  $('[data-loan]').textContent = gbp(loan);
  $('[data-monthly]').textContent = gbp(pmt(loan, r, years * 12));
  $('[data-ltv]').textContent = budget ? Math.round((deposit / budget) * 100) + '%' : '–';
  $('[data-afford-n]').textContent = `${n} of ${total}`;
  const pct = budget ? deposit / budget : 0;
  $('[data-afford-note]').textContent = pct < 0.05 ? 'Most lenders ask for a deposit of at least 5%. A bigger deposit widens your options and lowers your rate.' : n === 0 ? 'Nothing in our current listings fits yet. Try a bigger deposit, or look at rentals while you save.' : pct >= 0.4 ? 'A deposit this size gets you our best mortgage rates.' : 'You’re in a good position. A mortgage-in-principle takes about 10 minutes.';
  $<HTMLButtonElement>('[data-show-homes]').disabled = false;
}
af.addEventListener('input', paintAfford);
af.addEventListener('submit', (e) => e.preventDefault());
$('[data-show-homes]').addEventListener('click', () => {
  setMode('buy', false);
  fPrice.value = String(Math.max(150000, Math.min(800000, Math.ceil(budget / 5000) * 5000)));
  fArea.value = 'all'; fBeds.value = '0';
  paint();
  $('#homes').scrollIntoView({ behavior: smooth });
});
paintAfford();

/* ---------- Valuation ---------- */
const valForm = $<HTMLFormElement>('[data-value]');
const AREA_MEAN: Record<string, [string, number]> = { M20: ['Didsbury', 560000], M21: ['Chorlton', 380000], M4: ['Ancoats', 420000], M50: ['Salford Quays', 300000], M25: ['Prestwich', 330000] };
const COVER = ['M', 'SK', 'OL', 'BL', 'WA'];
let valNote = '';
valForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const el = $<HTMLInputElement>('#v-pc');
  const err = $('#v-pc-e');
  const m = el.value.trim().toUpperCase().match(/^([A-Z]{1,2})(\d[A-Z\d]?)\s*(\d[A-Z]{2})$/);
  const fail = (t: string) => { el.setAttribute('aria-invalid', 'true'); err.textContent = t; err.hidden = false; $('[data-est]').hidden = true; $('[data-est-empty]').hidden = false; el.focus(); };
  if (!m) return fail(el.value.trim() ? 'That doesn’t look like a UK postcode, e.g. M20 2WN.' : 'Enter your postcode first.');
  if (!COVER.includes(m[1])) return fail(`We don’t cover ${m[1]}${m[2]} yet. We work across Manchester, Stockport, Oldham, Bolton and Warrington.`);
  el.removeAttribute('aria-invalid'); err.hidden = true;
  const out = m[1] + m[2];
  const [area, mean] = AREA_MEAN[out] ?? ['Greater Manchester', 310000];
  const f = { house: 1, terrace: 0.9, flat: 0.85, bungalow: 1.05 }[$<HTMLSelectElement>('#v-kind').value] ?? 1;
  const b = { 1: 0.55, 2: 0.75, 3: 1, 4: 1.3, 5: 1.65 }[Number($<HTMLSelectElement>('#v-beds').value) as 1 | 2 | 3 | 4 | 5];
  const mid = mean * f * b * Number($<HTMLSelectElement>('#v-cond').value);
  const lo = Math.round((mid * 0.95) / 2500) * 2500, hi = Math.round((mid * 1.05) / 2500) * 2500;
  const h = hash(out);
  const yoy = 0.025 + (h % 40) / 1000;
  const pts = Array.from({ length: 12 }, (_, i) => 100 * (1 + yoy * (i / 11)) + Math.sin(i * 1.7 + (h % 7)) * 0.9);
  const mn = Math.min(...pts), mx = Math.max(...pts);
  const xy = pts.map((v, i) => `${((i * 300) / 11).toFixed(1)} ${(88 - ((v - mn) / (mx - mn)) * 74).toFixed(1)}`);
  $('[data-spark-line]').setAttribute('d', 'M' + xy.join('L'));
  $('[data-spark-area]').setAttribute('d', `M${xy.join('L')}L300 100L0 100Z`);
  $('[data-trend]').textContent = `+${(yoy * 100).toFixed(1)}%`;
  $('[data-est-area]').textContent = `${out} · ${area}`;
  $('[data-est-range]').textContent = `${gbp(lo)} – ${gbp(hi)}`;
  $('[data-est-sub]').textContent = `Homes like yours typically sell in ${18 + (h % 14)} days here. A free visit gives you the exact figure.`;
  $('[data-est]').hidden = false; $('[data-est-empty]').hidden = true;
  valNote = `Valuation request: ${$<HTMLSelectElement>('#v-beds').value}-bed ${$<HTMLSelectElement>('#v-kind').value} at ${out} ${m[3]}. Online estimate ${gbp(lo)} to ${gbp(hi)}.`;
});
$('[data-est-go]').addEventListener('click', () => { propSel.value = 'valuation'; $<HTMLTextAreaElement>('[data-note]').value = valNote; paintBook(); });

/* ---------- Areas ---------- */
const tabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-tabs]'));
const hoodEl = $('[data-hood]');
function paintHood(i: number, focus = false) {
  const h = HOODS[i];
  tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; if (i === j && focus) t.focus(); });
  hoodEl.setAttribute('aria-labelledby', tabs[i].id);
  const bar = (label: string, v: number) => `<li><span>${label}</span><i style="--w:${(v / 5) * 100}%"></i><b>${v.toFixed(1)}</b></li>`;
  hoodEl.innerHTML = `<div><h3>${esc(h.id)}</h3><p class="ll-hood__p">${esc(h.blurb)}</p>
    <ul class="ll-hood__tags" role="list">${h.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    <dl class="ll-hood__nums"><div><dt>Average price</dt><dd>${gbp(h.price)}</dd></div><div><dt>Average rent</dt><dd>${gbp(h.rent)}</dd></div><div><dt>To city centre</dt><dd>${h.commute} min</dd></div></dl></div>
    <ul class="ll-bars" role="list" aria-label="Area scores out of 5">${bar('Schools', h.schools)}${bar('Green space', h.green)}${bar('Nightlife', h.night)}</ul>
    <div class="ll-hood__cta"><button type="button" class="ll-btn ll-btn--ink" data-see-area="${esc(h.id)}">See homes in ${esc(h.id)}</button><p class="text-sm" style="color:#5b6679">Scores are our agents’ ratings (demo data).</p></div>`;
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => paintHood(i));
  t.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 } as Record<string, number>)[e.key];
    if (n === undefined) return;
    e.preventDefault(); paintHood((n + tabs.length) % tabs.length, true);
  });
});
hoodEl.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-see-area]');
  if (!b) return;
  setMode('buy');
  fArea.value = b.dataset.seeArea!; fBeds.value = '0';
  paint();
  $('#homes').scrollIntoView({ behavior: smooth });
});
paintHood(0);

/* ---------- Viewing ---------- */
const propSel = $<HTMLSelectElement>('[data-prop-sel]');
const st = { date: '', slot: '' };
const today = new Date(); today.setHours(0, 0, 0, 0);
const days = Array.from({ length: 10 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
const SLOTS = ['10:00', '11:00', '12:00', '13:30', '14:30', '15:30', '16:30'];
const slotsFor = (d: Date) => (d.getDay() === 0 ? SLOTS.slice(1, 5) : SLOTS);
const free = (d: Date, s: string) => (hash(`${propSel.value}|${iso(d)}|${s}`) % 100) >= 28;
const daysEl = $('[data-days]');
const slotsEl = $('[data-slots]');
function paintDays() {
  daysEl.innerHTML = days.map((d) => `<label class="ll-pick"><input type="radio" name="day" value="${iso(d)}" ${slotsFor(d).some((s) => free(d, s)) ? '' : 'disabled'} ${st.date === iso(d) ? 'checked' : ''}/><span><small>${d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></span></label>`).join('');
}
function paintSlots() {
  if (!st.date) { slotsEl.innerHTML = '<p class="text-sm" style="color:#5b6679">Choose a day first.</p>'; return; }
  const d = new Date(st.date + 'T00:00');
  if (st.slot && !free(d, st.slot)) st.slot = '';
  slotsEl.innerHTML = slotsFor(d).map((s) => `<label class="ll-pick"><input type="radio" name="slot" value="${s}" ${free(d, s) ? '' : 'disabled'} ${st.slot === s ? 'checked' : ''}/><span style="padding-block:.8rem">${s}</span></label>`).join('');
}
function paintBook() {
  const p = PROPS.find((x) => x.id === propSel.value);
  paintDays(); paintSlots();
  $('[data-sum-img]').innerHTML = p ? home(p.kind, p.wall, p.roof, p.title) : home('house', '#efe3cf', '#3d5a80', 'A typical home');
  $('[data-sum-title]').textContent = p ? p.title : 'Free home valuation';
  $('[data-sum-area]').textContent = p ? `${p.area} · ${p.beds} bed · ${p.baths} bath` : 'At your address';
  $('[data-sum-price]').textContent = p ? gbp(p.price) + (p.mode === 'rent' ? ' pcm' : '') : 'Free';
  $('[data-sum-when]').textContent = st.date && st.slot ? `${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${st.slot}` : 'Not chosen';
}
propSel.addEventListener('change', paintBook);
daysEl.addEventListener('change', (e) => { st.date = (e.target as HTMLInputElement).value; paintSlots(); paintBook(); });
slotsEl.addEventListener('change', (e) => { st.slot = (e.target as HTMLInputElement).value; paintBook(); });

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
  if (!st.date || !st.slot) { bookErr.textContent = !st.date ? 'Pick a day.' : 'Pick a time.'; bookErr.hidden = false; $<HTMLElement>(!st.date ? '[name="day"]:not(:disabled)' : '[name="slot"]:not(:disabled)').focus(); return; }
  if (bad.length) { bookErr.textContent = 'Please fix the highlighted fields.'; bookErr.hidden = false; bad[0].focus(); return; }
  const p = PROPS.find((x) => x.id === propSel.value);
  $('[data-done-name]').textContent = $<HTMLInputElement>('#b-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = `${p ? `${p.title}, ${p.area}` : 'Your free valuation'} on ${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at ${st.slot}. A negotiator will confirm by text within the hour.`;
  $('[data-ref]').textContent = 'LL-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-sum]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
$('[data-again]').addEventListener('click', () => {
  st.date = ''; st.slot = ''; form.reset();
  $$<HTMLInputElement>('[data-req]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  form.hidden = false; $('[data-sum]').hidden = false; $('[data-done]').hidden = true;
  paintBook();
});

setMode('buy');
paintBook();
