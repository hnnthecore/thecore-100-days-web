/**
 * Day 031 · The Saltmarsh · interactions.
 * Availability search · live room pricing by date · rate calendar with range picking · extras · reservation.
 * Prices and availability are generated from the date (seasonality, weekends) so the diary is stable between reloads.
 */
type Room = { id: string; name: string; sleeps: number; price: number };
type Extra = { id: string; name: string; price: number; unit: 'pp' | 'pn' };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.hl');
const ROOMS: Room[] = JSON.parse(root.dataset.rooms!);
const EXTRAS: Extra[] = JSON.parse(root.dataset.extras!);
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string) => new Date(s + 'T00:00');
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-GB', o);
const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Prices & availability ---------- */
const SEASON = [0.8, 0.85, 0.9, 1, 1.05, 1.15, 1.35, 1.4, 1.1, 0.95, 0.85, 1];
function nightPrice(r: Room, d: Date) {
  let f = SEASON[d.getMonth()];
  if (d.getMonth() === 11 && d.getDate() >= 23) f = 1.35;
  if (d.getDay() === 5 || d.getDay() === 6) f *= 1.22;
  return Math.round((r.price * f) / 5) * 5;
}
function taken(r: Room, d: Date) {
  let h = 2166136261;
  for (const c of `${r.id}|${iso(d)}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const weekend = d.getDay() === 5 || d.getDay() === 6;
  return ((h >>> 0) % 100) < (weekend ? 34 : 18);
}
const today = new Date(); today.setHours(0, 0, 0, 0);
const nightsOf = (ci: Date, co: Date) => Math.round((co.getTime() - ci.getTime()) / 864e5);
function nightList(ci: Date, co: Date) { return Array.from({ length: nightsOf(ci, co) }, (_, i) => addDays(ci, i)); }

/* ---------- State & search ---------- */
let ci = addDays(today, 10);
let co = addDays(ci, 2);
let guests = 2;
let picking = false;
let selected: string | null = null;
const extras = new Set<string>();
const inIn = $<HTMLInputElement>('#h-in');
const outIn = $<HTMLInputElement>('#h-out');
inIn.min = iso(today);
outIn.min = iso(addDays(today, 1));

function syncInputs() { inIn.value = iso(ci); outIn.value = iso(co); outIn.min = iso(addDays(ci, 1)); }
function setDates(a: Date, b: Date) {
  ci = a < today ? today : a;
  co = b <= ci ? addDays(ci, 1) : b;
  if (nightsOf(ci, co) > 14) co = addDays(ci, 14);
  syncInputs();
  refresh();
}
inIn.addEventListener('change', () => { if (inIn.value) { picking = false; setDates(parse(inIn.value), co <= parse(inIn.value) ? addDays(parse(inIn.value), 2) : co); } });
outIn.addEventListener('change', () => { if (outIn.value) { picking = false; setDates(ci, parse(outIn.value)); } });
$$<HTMLButtonElement>('[data-g]').forEach((b) => b.addEventListener('click', () => {
  guests = Math.min(6, Math.max(1, guests + Number(b.dataset.g)));
  refresh();
}));
$<HTMLFormElement>('[data-search]').addEventListener('submit', (e) => { e.preventDefault(); $('#rooms').scrollIntoView({ behavior: smooth }); });

/* ---------- Rooms ---------- */
const stayInfo = () => nightList(ci, co);
function roomQuote(r: Room) {
  const nights = stayInfo();
  const ok = guests <= r.sleeps && nights.every((d) => !taken(r, d));
  const total = nights.reduce((s, d) => s + nightPrice(r, d), 0);
  return { ok, total, nights: nights.length, reason: guests > r.sleeps ? `Sleeps ${r.sleeps}` : 'Not available for these dates' };
}
function paintRooms() {
  let n = 0;
  ROOMS.forEach((r) => {
    const card = $(`[data-room="${r.id}"]`);
    const q = roomQuote(r);
    if (q.ok) n++;
    card.classList.toggle('is-off', !q.ok);
    card.classList.toggle('is-picked', selected === r.id);
    $('[data-room-price]', card).textContent = q.ok ? gbp(q.total) : '–';
    $('[data-room-note]', card).textContent = q.ok ? `${q.nights} night${q.nights > 1 ? 's' : ''}, ${gbp(q.total / q.nights)} avg` : q.reason;
    const btn = $<HTMLButtonElement>('[data-pick]', card);
    btn.disabled = !q.ok;
    btn.textContent = !q.ok ? 'Unavailable' : selected === r.id ? 'Selected ✓' : 'Select';
    btn.setAttribute('aria-pressed', String(selected === r.id));
  });
  const nights = stayInfo().length;
  $('[data-avail]').textContent = `${n} of ${ROOMS.length} rooms available · ${nights} night${nights > 1 ? 's' : ''}, ${fmt(ci, { weekday: 'short', day: 'numeric', month: 'short' })} to ${fmt(co, { weekday: 'short', day: 'numeric', month: 'short' })} · ${guests} guest${guests > 1 ? 's' : ''}`;
  $('[data-search-msg]').textContent = n ? `${n} room${n > 1 ? 's' : ''} free for your dates.` : 'Nothing free on those dates. Try the rate calendar below.';
}
$$<HTMLButtonElement>('[data-pick]').forEach((b) => b.addEventListener('click', () => {
  selected = selected === b.dataset.pick ? null : b.dataset.pick!;
  paintRooms(); paintSummary();
  if (selected) $('[data-avail]').innerHTML = `Selected the ${ROOMS.find((r) => r.id === selected)!.name}. <a href="#stay" class="underline">Add extras</a> or <a href="#reserve" class="underline">go to reserve</a>.`;
}));

/* ---------- Rate calendar ---------- */
const cals = $('[data-cals]');
function minPrice(d: Date) {
  const opts = ROOMS.filter((r) => guests <= r.sleeps && !taken(r, d)).map((r) => nightPrice(r, d));
  return opts.length ? Math.min(...opts) : 0;
}
const level = (p: number) => (p <= 155 ? 1 : p <= 185 ? 2 : p <= 215 ? 3 : 4);
function paintCal() {
  const months = [0, 1, 2].map((m) => new Date(today.getFullYear(), today.getMonth() + m, 1));
  cals.innerHTML = months.map((first) => {
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7;
    const cells: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => `<span class="hl-dow" aria-hidden="true">${d}</span>`);
    for (let i = 0; i < lead; i++) cells.push('<span class="hl-blank"></span>');
    for (let day = 1; day <= last; day++) {
      const d = new Date(first.getFullYear(), first.getMonth(), day);
      const past = d < today;
      const p = past ? 0 : minPrice(d);
      const edge = iso(d) === iso(ci) || iso(d) === iso(co);
      const inside = d >= ci && d < co;
      const dis = past || (!p && !edge);
      cells.push(`<button type="button" class="hl-day${inside ? ' in-range' : ''}${edge ? ' is-edge' : ''}" data-l="${p ? level(p) : 0}" data-date="${iso(d)}" ${dis ? 'disabled' : ''} aria-pressed="${edge}" aria-label="${fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })}${p ? `, from ${gbp(p)}` : ', not available'}">${day}<small>${p ? gbp(p) : ''}</small></button>`);
    }
    return `<div class="hl-month"><h3>${fmt(first, { month: 'long', year: 'numeric' })}</h3><div class="hl-grid">${cells.join('')}</div></div>`;
  }).join('');
}
cals.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-date]');
  if (!b || b.disabled) return;
  const d = parse(b.dataset.date!);
  if (!picking || d <= ci) { picking = true; ci = d; co = addDays(d, 1); }
  else { picking = false; co = d; }
  if (nightsOf(ci, co) > 14) co = addDays(ci, 14);
  syncInputs(); refresh();
  $('[data-cal-help]').textContent = picking ? `Arriving ${fmt(ci, { weekday: 'long', day: 'numeric', month: 'long' })}. Now pick your departure date.` : `${nightsOf(ci, co)} night${nightsOf(ci, co) > 1 ? 's' : ''}: ${fmt(ci, { day: 'numeric', month: 'short' })} to ${fmt(co, { day: 'numeric', month: 'short' })}. See the rooms above for these dates.`;
  $<HTMLButtonElement>(`[data-date="${b.dataset.date}"]`)?.focus();
});

/* ---------- Extras ---------- */
const xtabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-tabs]'));
function selectX(i: number, focus = false) {
  xtabs.forEach((t, j) => {
    const on = i === j;
    t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
    $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    if (on && focus) t.focus();
  });
}
xtabs.forEach((t, i) => {
  t.addEventListener('click', () => selectX(i));
  t.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: xtabs.length - 1 } as Record<string, number>)[e.key];
    if (n === undefined) return;
    e.preventDefault(); selectX((n + xtabs.length) % xtabs.length, true);
  });
});
const extraCost = (x: Extra) => x.price * (x.unit === 'pp' ? guests : stayInfo().length);
$$<HTMLButtonElement>('[data-extra]').forEach((b) => b.addEventListener('click', () => {
  const id = b.dataset.extra!;
  extras.has(id) ? extras.delete(id) : extras.add(id);
  b.setAttribute('aria-pressed', String(extras.has(id)));
  paintExtras(); paintSummary();
}));
function paintExtras() {
  const list = EXTRAS.filter((x) => extras.has(x.id));
  $('[data-extras-sum]').textContent = list.length ? `${list.length} extra${list.length > 1 ? 's' : ''} added: ${gbp(list.reduce((s, x) => s + extraCost(x), 0))} for ${guests} guest${guests > 1 ? 's' : ''}, ${stayInfo().length} night${stayInfo().length > 1 ? 's' : ''}.` : 'Nothing added yet. Everything here is optional and can be changed later.';
}

/* ---------- Summary & reservation ---------- */
const form = $<HTMLFormElement>('[data-form]');
function paintSummary() {
  const r = ROOMS.find((x) => x.id === selected);
  const nights = stayInfo().length;
  $('[data-sum-dates]').textContent = `${fmt(ci, { weekday: 'short', day: 'numeric', month: 'short' })} to ${fmt(co, { weekday: 'short', day: 'numeric', month: 'short' })} · ${nights} night${nights > 1 ? 's' : ''} · ${guests} guest${guests > 1 ? 's' : ''}`;
  $('[data-sum-room]').textContent = r ? r.name : 'No room selected';
  const lines: [string, number][] = [];
  if (r) lines.push([`Room, ${nights} night${nights > 1 ? 's' : ''}`, roomQuote(r).total]);
  EXTRAS.filter((x) => extras.has(x.id)).forEach((x) => lines.push([x.name, extraCost(x)]));
  $('[data-sum-lines]').innerHTML = lines.map(([l, v]) => `<li><span>${l}</span><span>${gbp(v)}</span></li>`).join('');
  const total = lines.reduce((s, l) => s + l[1], 0);
  $('[data-sum-total]').textContent = gbp(total);
  $('[data-sum-dep]').textContent = r ? `Deposit today: ${gbp(total * 0.2)} (20%). Balance on arrival. Free cancellation up to 7 days before.` : '';
  $<HTMLFieldSetElement>('[data-fields]').disabled = !r;
  $('[data-lock]').hidden = !!r;
}
function refresh() {
  if (selected) { const r = ROOMS.find((x) => x.id === selected)!; if (!roomQuote(r).ok) selected = null; }
  paintRooms(); paintCal(); paintExtras(); paintSummary();
  $('[data-guests]').textContent = String(guests);
  $$<HTMLButtonElement>('[data-g]').forEach((b) => (b.disabled = (b.dataset.g === '-1' && guests <= 1) || (b.dataset.g === '1' && guests >= 6)));
}

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
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !valid(i));
  if (bad.length) { bad[0].focus(); return; }
  const r = ROOMS.find((x) => x.id === selected)!;
  const total = $('[data-sum-total]').textContent;
  $('[data-done-name]').textContent = $<HTMLInputElement>('#r-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = `The ${r.name}, ${fmt(ci, { weekday: 'long', day: 'numeric', month: 'long' })} to ${fmt(co, { weekday: 'long', day: 'numeric', month: 'long' })}, for ${guests} guest${guests > 1 ? 's' : ''}. Total ${total}. We’ll expect you ${$<HTMLSelectElement>('#r-time').value.toLowerCase()}.`;
  $('[data-ref]').textContent = 'SM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-sum]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
$('[data-again]').addEventListener('click', () => {
  selected = null; extras.clear(); form.reset();
  $$<HTMLInputElement>('[data-req]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  $$<HTMLButtonElement>('[data-extra]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
  form.hidden = false; $('[data-sum]').hidden = false; $('[data-done]').hidden = true;
  refresh();
  $('#rooms').scrollIntoView({ behavior: smooth });
});

syncInputs();
refresh();
