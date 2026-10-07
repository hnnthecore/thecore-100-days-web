/**
 * Day 032 · Lemon & Linen · interactions.
 * Instant quote (postcode coverage, home size, frequency, extras) · room-by-room checklist · booking with live slots · counters · callback form.
 */
type Addon = { id: string; name: string; price: number };
type RoomDef = { id: string; name: string; mins: number; std: string[]; deep: string[] };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.ll');
const ADDONS: Addon[] = JSON.parse(root.dataset.addons!);
const ROOMS: RoomDef[] = JSON.parse(root.dataset.rooms!);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- State ---------- */
const state = { beds: 2, baths: 1, svc: 'regular', freq: 'once', addons: new Set<string>(), covered: false, date: '', slot: '' };
const SVC = { regular: { name: 'Regular clean', f: 1, rate: 19 }, deep: { name: 'Deep clean', f: 1.8, rate: 24 }, tenancy: { name: 'End of tenancy', f: 2.2, rate: 26 } } as const;
const FREQ = { once: { name: 'One-off', off: 0, per: 'one-off visit' }, weekly: { name: 'Weekly', off: 0.2, per: 'per weekly visit' }, fort: { name: 'Fortnightly', off: 0.15, per: 'per fortnightly visit' }, four: { name: 'Every 4 weeks', off: 0.08, per: 'per visit, every 4 weeks' } } as const;

function calc() {
  const svc = SVC[state.svc as keyof typeof SVC];
  const work = Math.round((state.beds * 0.9 + state.baths * 0.7 + 1.5) * svc.f * 2) / 2;
  const cleaners = work > 4.5 ? 2 : 1;
  const hours = Math.ceil((work / cleaners) * 2) / 2;
  const base = Math.max(45, work * svc.rate);
  const off = state.svc === 'regular' ? FREQ[state.freq as keyof typeof FREQ].off : 0;
  const extras = ADDONS.filter((a) => state.addons.has(a.id)).reduce((s, a) => s + a.price, 0);
  return { work, cleaners, hours, base, off, extras, price: Math.round(base * (1 - off) + extras), svc };
}

/* ---------- Quote ---------- */
const COVER: Record<string, string> = { LS: 'Leeds', BD: 'Bradford', YO: 'York', HG: 'Harrogate', WF: 'Wakefield', HX: 'Halifax', S: 'Sheffield', M: 'Manchester', SK: 'Stockport', OL: 'Oldham', BL: 'Bolton', WA: 'Warrington' };
const PC = /^([A-Z]{1,2})(\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;
const pcIn = $<HTMLInputElement>('[data-pc]');
const pcMsg = $('[data-pc-msg]');
function checkPostcode() {
  const v = pcIn.value.trim().toUpperCase();
  pcMsg.className = 'll-msg';
  state.covered = false;
  if (!v) { pcMsg.textContent = 'We’ll check we cover your area.'; pcIn.removeAttribute('aria-invalid'); return false; }
  const m = v.match(PC);
  if (!m) { pcMsg.textContent = 'That doesn’t look like a UK postcode, e.g. LS1 4AP.'; pcMsg.classList.add('is-bad'); pcIn.setAttribute('aria-invalid', 'true'); return false; }
  pcIn.removeAttribute('aria-invalid');
  const town = COVER[m[1]];
  if (!town) { pcMsg.textContent = `We don’t cover ${m[1]}${m[2]} yet. Leave your number at the bottom and we’ll tell you when we do.`; pcMsg.classList.add('is-bad'); return false; }
  state.covered = true;
  pcMsg.textContent = `Great news, we cover ${town} (${m[1]}${m[2]}).`;
  pcMsg.classList.add('is-ok');
  return true;
}
pcIn.addEventListener('input', () => { checkPostcode(); });

function paintQuote() {
  const c = calc();
  $('[data-out="beds"]').textContent = String(state.beds);
  $('[data-out="baths"]').textContent = String(state.baths);
  $$<HTMLButtonElement>('[data-step]').forEach((b) => {
    const [k, d] = b.dataset.step!.split(':');
    const v = state[k as 'beds' | 'baths'];
    b.disabled = (d === '-1' && v <= (k === 'beds' ? 0 : 1)) || (d === '1' && v >= (k === 'beds' ? 6 : 4));
  });
  const once = state.svc !== 'regular';
  $$<HTMLInputElement>('[name="freq"]').forEach((r) => { r.disabled = once && r.value !== 'once'; });
  if (once && state.freq !== 'once') { state.freq = 'once'; $<HTMLInputElement>('[name="freq"][value="once"]').checked = true; }
  $('[data-price]').textContent = gbp(c.price);
  $('[data-per]').textContent = FREQ[state.freq as keyof typeof FREQ].per;
  $('[data-meta]').textContent = `${c.cleaners} cleaner${c.cleaners > 1 ? 's' : ''} · about ${c.hours} hour${c.hours > 1 ? 's' : ''}${c.extras ? ` · includes ${gbp(c.extras)} extras` : ''}`;
  $('[data-save]').textContent = c.off ? `You save ${gbp(c.base * c.off)} every visit` : once ? 'Deep and tenancy cleans are one-off' : 'Switch to weekly and save 20%';
  paintAddons(); paintSummary(); paintRoom();
}
$$<HTMLButtonElement>('[data-step]').forEach((b) => b.addEventListener('click', () => {
  const [k, d] = b.dataset.step!.split(':');
  state[k as 'beds' | 'baths'] += Number(d);
  paintQuote();
}));
$<HTMLSelectElement>('[data-svc]').addEventListener('change', (e) => { state.svc = (e.target as HTMLSelectElement).value; paintQuote(); });
$$<HTMLInputElement>('[name="freq"]').forEach((r) => r.addEventListener('change', () => { state.freq = r.value; paintQuote(); }));
$<HTMLFormElement>('[data-quote]').addEventListener('submit', (e) => e.preventDefault());
$('[data-go]').addEventListener('click', (e) => {
  if (pcIn.value.trim() && !state.covered) { e.preventDefault(); pcIn.focus(); return; }
  if (!pcIn.value.trim()) { e.preventDefault(); pcMsg.textContent = 'Add your postcode first so we can check we cover you.'; pcMsg.className = 'll-msg is-bad'; pcIn.focus(); return; }
  $<HTMLInputElement>('#b-addr').value ||= pcIn.value.trim().toUpperCase();
});

/* ---------- Add-ons ---------- */
function paintAddons() {
  $$<HTMLButtonElement>('[data-addon]').forEach((b) => b.setAttribute('aria-pressed', String(state.addons.has(b.dataset.addon!))));
  const n = state.addons.size;
  const sum = ADDONS.filter((a) => state.addons.has(a.id)).reduce((s, a) => s + a.price, 0);
  $('[data-addons-sum]').textContent = n ? `${n} extra${n > 1 ? 's' : ''} added, ${gbp(sum)} on top of your clean. Your quote above is updated.` : 'Tap to add. They’re included in your quote.';
}
$('[data-addons-list]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-addon]');
  if (!b) return;
  const id = b.dataset.addon!;
  state.addons.has(id) ? state.addons.delete(id) : state.addons.add(id);
  paintQuote();
});

/* ---------- Room checklist ---------- */
const rtabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-rtabs]'));
const deepSw = $<HTMLInputElement>('[data-deep]');
const panel = $('[data-checklist]');
let roomIdx = 0;
function paintRoom() {
  const r = ROOMS[roomIdx];
  const count = r.id === 'bed' ? Math.max(state.beds, 1) : r.id === 'bath' ? state.baths : 1;
  const tasks = [...r.std.map((t) => [t, false] as const), ...(deepSw.checked ? r.deep.map((t) => [t, true] as const) : [])];
  panel.setAttribute('aria-labelledby', rtabs[roomIdx].id);
  panel.innerHTML = `<div class="ll-checklist__top"><h3>${esc(r.name)}</h3><p>About ${Math.round(r.mins * count * (deepSw.checked ? 1.8 : 1))} min${count > 1 ? ` for your ${count}` : ''}</p></div>
    <ul class="ll-tasks" role="list">${tasks.map(([t, deep], i) => `<li class="ll-task${deep ? ' is-deep' : ''}" style="--i:${i}"><i aria-hidden="true">✓</i>${esc(t)}${deep ? ' <small>(deep)</small>' : ''}</li>`).join('')}</ul>`;
}
function selectRoom(i: number, focus = false) {
  roomIdx = i;
  rtabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; if (i === j && focus) t.focus(); });
  paintRoom();
}
rtabs.forEach((t, i) => {
  t.addEventListener('click', () => selectRoom(i));
  t.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: rtabs.length - 1 } as Record<string, number>)[e.key];
    if (n === undefined) return;
    e.preventDefault(); selectRoom((n + rtabs.length) % rtabs.length, true);
  });
});
deepSw.addEventListener('change', paintRoom);

/* ---------- Booking ---------- */
const SLOTS = ['08:00', '10:30', '13:00', '15:30'];
const today = new Date(); today.setHours(0, 0, 0, 0);
const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
function slotFree(d: Date, s: string) {
  let h = 2166136261;
  for (const c of `${iso(d)}|${s}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 100) >= (d.getDay() === 0 ? 55 : 28);
}
const daysEl = $('[data-days]');
const slotsEl = $('[data-slots]');
function paintDays() {
  daysEl.innerHTML = days.map((d) => {
    const free = SLOTS.some((s) => slotFree(d, s));
    return `<label class="ll-pick"><input type="radio" name="day" value="${iso(d)}" ${free ? '' : 'disabled'} ${state.date === iso(d) ? 'checked' : ''} /><span><small>${d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></span></label>`;
  }).join('');
}
function paintSlots() {
  const msg = $('[data-slot-msg]');
  if (!state.date) { slotsEl.innerHTML = ''; msg.textContent = 'Choose a day to see times.'; return; }
  const d = new Date(state.date + 'T00:00');
  const free = SLOTS.filter((s) => slotFree(d, s));
  if (state.slot && !free.includes(state.slot)) state.slot = '';
  slotsEl.innerHTML = SLOTS.map((s) => `<label class="ll-pick"><input type="radio" name="slot" value="${s}" ${free.includes(s) ? '' : 'disabled'} ${state.slot === s ? 'checked' : ''} /><span><b style="font-size:1.2rem">${s}</b><small>${free.includes(s) ? 'Available' : 'Taken'}</small></span></label>`).join('');
  msg.textContent = `${free.length} slot${free.length > 1 ? 's' : ''} free on ${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}.`;
}
daysEl.addEventListener('change', (e) => { state.date = (e.target as HTMLInputElement).value; paintSlots(); paintSummary(); });
slotsEl.addEventListener('change', (e) => { state.slot = (e.target as HTMLInputElement).value; paintSummary(); });
function paintSummary() {
  const c = calc();
  $('[data-s-svc]').textContent = c.svc.name;
  $('[data-s-home]').textContent = `${state.beds ? state.beds + ' bed' : 'Studio'}, ${state.baths} bath`;
  $('[data-s-team]').textContent = `${c.cleaners} cleaner${c.cleaners > 1 ? 's' : ''}, ~${c.hours} h`;
  $('[data-s-freq]').textContent = FREQ[state.freq as keyof typeof FREQ].name;
  $('[data-s-extras]').textContent = state.addons.size ? ADDONS.filter((a) => state.addons.has(a.id)).map((a) => a.name).join(', ') : 'None';
  $('[data-s-price]').textContent = gbp(c.price);
  $('[data-s-when]').textContent = state.date && state.slot ? `${new Date(state.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${state.slot}` : 'Not chosen';
}

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
  const fail = (msg: string, el?: HTMLElement | null) => { bookErr.textContent = msg; bookErr.hidden = false; el?.focus(); };
  if (!state.covered) return fail('Please enter a covered postcode in the quote box at the top first.', pcIn);
  if (!state.date) return fail('Choose a day for your clean.', $('[name="day"]:not(:disabled)'));
  if (!state.slot) return fail('Choose a time.', $('[name="slot"]:not(:disabled)'));
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !valid(i));
  if (bad.length) return fail('Please fix the highlighted fields.', bad[0]);
  const c = calc();
  const d = new Date(state.date + 'T00:00');
  $('[data-done-name]').textContent = $<HTMLInputElement>('#b-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = `${c.svc.name} on ${d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at ${state.slot}. ${c.cleaners} cleaner${c.cleaners > 1 ? 's' : ''}, about ${c.hours} hours, ${gbp(c.price)} payable after the clean.`;
  $('[data-ref]').textContent = 'LL-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-sum]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
$('[data-again]').addEventListener('click', () => {
  state.date = ''; state.slot = ''; form.reset();
  $$<HTMLInputElement>('[data-req]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  form.hidden = false; $('[data-sum]').hidden = false; $('[data-done]').hidden = true;
  paintDays(); paintSlots(); paintSummary();
});

/* ---------- Counters ---------- */
function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count);
  const dec = Number(el.dataset.dec ?? 0);
  const suffix = el.dataset.suffix ?? '';
  const fmt = (v: number) => v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
  if (reduce) { el.textContent = fmt(to); return; }
  const start = performance.now();
  const tick = (t: number) => { const p = Math.min(1, (t - start) / 1400); el.textContent = fmt(to * (1 - (1 - p) ** 3)); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); $$('[data-count]').forEach(countUp); } }, { threshold: 0.4 }).observe($('#team'));

/* ---------- Callback ---------- */
const call = $<HTMLFormElement>('[data-call]');
$$<HTMLInputElement>('[data-creq]', call).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
call.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-creq]', call).filter((i) => !valid(i));
  if (bad.length) { $('[data-call-ok]').textContent = ''; bad[0].focus(); return; }
  $('[data-call-ok]').textContent = `Thanks ${$<HTMLInputElement>('#c-name').value.trim().split(/\s+/)[0]}! We’ll ring ${$<HTMLSelectElement>('#c-when').value.toLowerCase()}. (Demo: nothing was sent.)`;
});

paintDays(); paintSlots(); selectRoom(0); checkPostcode(); paintQuote();
