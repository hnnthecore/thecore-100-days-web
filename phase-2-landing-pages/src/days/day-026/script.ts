/**
 * Day 026 · Atelier Vesper · interactions.
 * Menu tabs & basket · stylist shortcuts · before/after slider · 3-step booking with live availability · open-now status.
 */
type Item = { id: string; name: string; price: number; mins: number; note: string };
type Cat = { id: string; name: string; items: Item[] };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

const root = $('.av');
const CATS: Cat[] = JSON.parse(root.dataset.services!);
const STYLISTS: { id: string; name: string }[] = [{ id: 'any', name: 'Any stylist' }, ...JSON.parse(root.dataset.stylists!)];
const ITEMS = new Map(CATS.flatMap((c) => c.items).map((i) => [i.id, i]));
const gbp = (n: number) => '£' + n;
const dur = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayLong = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const dayShort = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short' });

/* ---------- Opening hours: read once from the table, so page and booking always agree ---------- */
const HOURS: Record<number, [number, number] | null> = {};
$$('.av-hours tr').forEach((tr) => {
  const t = $('td', tr).textContent!;
  const m = t.match(/(\d\d):(\d\d)\s*–\s*(\d\d):(\d\d)/);
  HOURS[Number(tr.dataset.day)] = m ? [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])] : null;
});
const hm = (mins: number) => `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;

/** Deterministic "is this slot taken" so a reload shows the same diary. */
function taken(date: string, stylist: string, t: number) {
  let h = 2166136261;
  for (const c of `${date}|${stylist}|${t}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 100) < 38;
}
function slotsFor(d: Date, stylist: string, mins: number) {
  const hrs = HOURS[d.getDay()];
  if (!hrs) return [];
  const now = new Date();
  const out: { t: string; ok: boolean }[] = [];
  for (let t = hrs[0]; t + mins <= hrs[1]; t += 30) {
    const at = new Date(d); at.setHours(0, t, 0, 0);
    const future = at.getTime() > now.getTime() + 60 * 60 * 1000;
    const pool = stylist === 'any' ? STYLISTS.slice(1).map((s) => s.id) : [stylist];
    const free = pool.some((s) => !taken(iso(d), s, t));
    out.push({ t: hm(t), ok: future && free });
  }
  return out;
}
const dayList = () => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return d; });

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- Hero: next appointment & open-now ---------- */
function paintNext() {
  for (const d of dayList()) {
    const s = slotsFor(d, 'any', 60).find((x) => x.ok);
    if (s) {
      const today = iso(d) === iso(new Date());
      $('[data-next]').textContent = `Next appointment: ${today ? 'today' : dayShort(d) + ' ' + d.getDate() + ' ' + d.toLocaleDateString('en-GB', { month: 'short' })} at ${s.t}`;
      return;
    }
  }
  $('[data-next]').textContent = 'Fully booked for two weeks, call us for cancellations';
}
paintNext();

function paintOpen() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const hrs = HOURS[now.getDay()];
  $$('.av-hours tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === now.getDay()));
  const open = !!hrs && mins >= hrs[0] && mins < hrs[1];
  $('[data-open-dot]').classList.toggle('is-closed', !open);
  if (open) { $('[data-open-text]').textContent = `Open now · until ${hm(hrs![1])}`; return; }
  for (let i = 0; i < 8; i++) {
    const d = new Date(now); d.setDate(d.getDate() + i);
    const h = HOURS[d.getDay()];
    if (h && (i > 0 || mins < h[0])) { $('[data-open-text]').textContent = `Closed · opens ${i === 0 ? 'today' : i === 1 ? 'tomorrow' : dayShort(d)} at ${hm(h[0])}`; return; }
  }
}
paintOpen();

/* ---------- Menu tabs ---------- */
const mtabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-mtabs]'));
function selectMenu(i: number, focus = false) {
  mtabs.forEach((t, j) => {
    const on = i === j;
    t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
    $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    if (on && focus) t.focus();
  });
}
mtabs.forEach((t, i) => {
  t.addEventListener('click', () => selectMenu(i));
  t.addEventListener('keydown', (e) => {
    const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: mtabs.length - 1 }[e.key];
    if (n === undefined) return;
    e.preventDefault(); selectMenu((n + mtabs.length) % mtabs.length, true);
  });
});

/* ---------- Shared booking state ---------- */
const state = { services: new Set<string>(), stylist: 'any', date: '', time: '', step: 1 };
const chosen = () => [...state.services].map((id) => ITEMS.get(id)!);
const totals = () => chosen().reduce((a, s) => ({ price: a.price + s.price, mins: a.mins + s.mins }), { price: 0, mins: 0 });

function paintBasket() {
  const t = totals();
  const basket = $('[data-basket]');
  basket.hidden = state.services.size === 0;
  $('[data-basket-count]').textContent = String(state.services.size);
  $('[data-basket-total]').textContent = gbp(t.price);
  $('[data-basket-time]').textContent = dur(t.mins);
  $$<HTMLButtonElement>('[data-add]').forEach((b) => b.setAttribute('aria-pressed', String(state.services.has(b.dataset.add!))));
}

/* ---------- Booking: step 1 (services) ---------- */
$('[data-service-list]').innerHTML = CATS.map((c) => `
  <div class="av-group"><h4>${c.name}</h4>
  ${c.items.map((s) => `<label class="av-check"><input type="checkbox" value="${s.id}" /><span><span>${s.name}</span><small>${gbp(s.price)} · ${dur(s.mins)}</small></span></label>`).join('')}
  </div>`).join('');

function setService(id: string, on: boolean) {
  on ? state.services.add(id) : state.services.delete(id);
  const box = $<HTMLInputElement>(`[data-service-list] input[value="${id}"]`);
  box.checked = on;
  paintBasket(); paintSummary();
  if (state.time) validateSlot();
}
$$<HTMLInputElement>('[data-service-list] input').forEach((i) => i.addEventListener('change', () => setService(i.value, i.checked)));
$$<HTMLButtonElement>('[data-add]').forEach((b) => b.addEventListener('click', () => setService(b.dataset.add!, !state.services.has(b.dataset.add!))));

/* ---------- Booking: step 2 (stylist, day, time) ---------- */
$('[data-stylist-list]').innerHTML = STYLISTS.map((s) => `<label class="av-radio"><input type="radio" name="stylist" value="${s.id}" ${s.id === 'any' ? 'checked' : ''} /><span>${s.name}</span></label>`).join('');
$$<HTMLInputElement>('[name="stylist"]').forEach((r) => r.addEventListener('change', () => { state.stylist = r.value; paintDays(); paintSlots(); paintSummary(); }));

function paintDays() {
  const mins = Math.max(totals().mins, 30);
  if (state.date && !slotsFor(new Date(state.date + 'T00:00'), state.stylist, mins).some((s) => s.ok)) { state.date = ''; state.time = ''; }
  $('[data-day-list]').innerHTML = dayList().map((d) => {
    const any = slotsFor(d, state.stylist, mins).some((s) => s.ok);
    return `<label class="av-radio"><input type="radio" name="day" value="${iso(d)}" ${any ? '' : 'disabled'} ${state.date === iso(d) ? 'checked' : ''} /><span><small>${dayShort(d)}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></span></label>`;
  }).join('');
  $$<HTMLInputElement>('[name="day"]').forEach((r) => r.addEventListener('change', () => { state.date = r.value; state.time = ''; paintSlots(); paintSummary(); }));
}
function paintSlots() {
  const list = $('[data-slot-list]');
  const msg = $('[data-slot-msg]');
  if (!state.date) { list.innerHTML = ''; msg.textContent = 'Choose a day to see available times.'; return; }
  const slots = slotsFor(new Date(state.date + 'T00:00'), state.stylist, Math.max(totals().mins, 30));
  if (state.time && !slots.some((s) => s.t === state.time && s.ok)) state.time = '';
  list.innerHTML = slots.map((s) => `<label class="av-radio"><input type="radio" name="time" value="${s.t}" ${s.ok ? '' : 'disabled'} ${state.time === s.t ? 'checked' : ''} /><span>${s.t}</span></label>`).join('');
  msg.textContent = `${slots.filter((s) => s.ok).length} times free for ${dur(totals().mins || 30)}.`;
  $$<HTMLInputElement>('[name="time"]').forEach((r) => r.addEventListener('change', () => { state.time = r.value; paintSummary(); }));
}
/** If services change after a time was picked, drop it when it no longer fits. */
function validateSlot() {
  paintDays();
  if (state.date) paintSlots();
  paintSummary();
}

/* ---------- Summary ---------- */
function paintSummary() {
  const t = totals();
  $('[data-sum-list]').innerHTML = state.services.size
    ? chosen().map((s) => `<li><span>${s.name}</span><b>${gbp(s.price)}</b></li>`).join('')
    : '<li class="opacity-60">Nothing selected yet.</li>';
  $('[data-sum-who]').textContent = STYLISTS.find((s) => s.id === state.stylist)!.name;
  $('[data-sum-when]').textContent = state.date && state.time ? `${dayShort(new Date(state.date + 'T00:00'))} ${new Date(state.date + 'T00:00').getDate()} ${new Date(state.date + 'T00:00').toLocaleDateString('en-GB', { month: 'short' })}, ${state.time}` : 'Not chosen';
  $('[data-sum-time]').textContent = t.mins ? dur(t.mins) : '–';
  $('[data-sum-total]').textContent = gbp(t.price);
}

/* ---------- Stylist shortcut ---------- */
$$<HTMLButtonElement>('[data-pick-stylist]').forEach((b) => b.addEventListener('click', () => {
  state.stylist = b.dataset.pickStylist!;
  $<HTMLInputElement>(`[name="stylist"][value="${state.stylist}"]`).checked = true;
  paintDays(); paintSlots(); paintSummary();
  $('#book').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}));

/* ---------- Wizard ---------- */
const form = $<HTMLFormElement>('[data-book]');
const err = $('[data-step-err]');
const nextBtn = $<HTMLButtonElement>('[data-next-btn]');
const backBtn = $<HTMLButtonElement>('[data-back]');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^(?:\+44\s?7|07)\d{3}\s?\d{6}$|^(?:\+44\s?7|07)\d{3}\s?\d{3}\s?\d{3}$/;

function go(step: number) {
  state.step = step;
  $$('[data-step]').forEach((s) => (s.hidden = Number(s.dataset.step) !== step));
  $$('[data-stepper]').forEach((li) => {
    const n = Number(li.dataset.stepper);
    li.classList.toggle('is-now', n === step); li.classList.toggle('is-done', n < step);
    li.setAttribute('aria-current', n === step ? 'step' : 'false');
  });
  backBtn.hidden = step === 1;
  nextBtn.textContent = step === 3 ? 'Confirm booking' : 'Continue →';
  err.hidden = true;
  if (step === 2) { paintDays(); paintSlots(); }
  $(`[data-step="${step}"] h3`).scrollIntoView({ block: 'nearest' });
}
const fail = (msg: string, focus?: HTMLElement | null) => { err.textContent = msg; err.hidden = false; focus?.focus(); return false; };

function validateField(i: HTMLInputElement) {
  const v = i.value.trim();
  const ok = i.type === 'email' ? EMAIL.test(v) : i.type === 'tel' ? PHONE.test(v.replace(/[-()]/g, '')) : v.length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]').forEach((i) => i.addEventListener('blur', () => { if (i.value) validateField(i); }));

function valid(step: number) {
  if (step === 1) return state.services.size ? true : fail('Choose at least one service to continue.', $('[data-service-list] input'));
  if (step === 2) {
    if (!state.date) return fail('Pick a day.', $('[name="day"]:not(:disabled)'));
    if (!state.time) return fail('Pick a time.', $('[name="time"]:not(:disabled)'));
    return true;
  }
  const bad = $$<HTMLInputElement>('[data-req]').filter((i) => !validateField(i));
  return bad.length ? fail('Please fix the highlighted fields.', bad[0]) : true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!valid(state.step)) return;
  if (state.step < 3) { go(state.step + 1); return; }
  const d = new Date(state.date + 'T00:00');
  const t = totals();
  const first = $<HTMLInputElement>('#b-name').value.trim().split(/\s+/)[0];
  $('[data-done-name]').textContent = first;
  $('[data-done-text]').textContent = `${dayLong(d)} at ${state.time} with ${STYLISTS.find((s) => s.id === state.stylist)!.name.replace('Any stylist', 'the first available stylist')}. ${state.services.size} service${state.services.size > 1 ? 's' : ''}, ${dur(t.mins)}, ${gbp(t.price)}.`;
  $('[data-done-ref]').textContent = 'AV-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-summary]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
backBtn.addEventListener('click', () => go(state.step - 1));
$('[data-again]').addEventListener('click', () => {
  state.services.clear(); state.stylist = 'any'; state.date = ''; state.time = '';
  form.reset(); $$<HTMLInputElement>('[data-req]').forEach((i) => i.removeAttribute('aria-invalid'));
  $<HTMLInputElement>('[name="stylist"][value="any"]').checked = true;
  paintBasket(); paintSummary(); go(1);
  form.hidden = false; $('[data-summary]').hidden = false; $('[data-done]').hidden = true;
});
paintSummary(); paintBasket(); go(1);

/* ---------- Before / after ---------- */
const compare = $('[data-compare]');
const range = $<HTMLInputElement>('[data-range]');
const setPos = (v: number) => {
  const p = Math.min(100, Math.max(0, v));
  compare.style.setProperty('--pos', p + '%'); range.value = String(p);
  range.setAttribute('aria-valuetext', `${Math.round(p)}% after`);
};
range.addEventListener('input', () => setPos(Number(range.value)));
const drag = (e: PointerEvent) => { const r = compare.getBoundingClientRect(); setPos(((e.clientX - r.left) / r.width) * 100); };
compare.addEventListener('pointerdown', (e) => { compare.setPointerCapture(e.pointerId); drag(e); const move = (ev: PointerEvent) => drag(ev); compare.addEventListener('pointermove', move); compare.addEventListener('pointerup', () => compare.removeEventListener('pointermove', move), { once: true }); });

const caseTexts = JSON.parse(root.dataset.cases ?? '{}') as Record<string, string>;
$$<HTMLButtonElement>('[data-case]').forEach((b) => b.addEventListener('click', () => {
  $$('[data-case]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  $$('[data-set]').forEach((s) => (s.hidden = s.dataset.set !== b.dataset.case));
  if (caseTexts[b.dataset.case!]) $('[data-case-text]').textContent = caseTexts[b.dataset.case!];
  setPos(50);
}));
