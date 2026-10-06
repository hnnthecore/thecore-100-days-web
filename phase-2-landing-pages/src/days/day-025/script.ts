/**
 * Day 025 · Pace Logistics · interactions.
 * Header state · live counters · shipment tracking · instant quote · network map · sustainability count-up · contact tabs & forms.
 */
import { ROUTES, hub, roadKm, type Hub } from './data';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n: number) => n.toLocaleString('en-GB');
const gbp = (n: number) => '£' + fmt(Math.round(n));
const clock = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const day = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Live counters (hero) ---------- */
const onRoad = $('[data-on-road]');
const today = $('[data-today]');
const now = new Date();
let trucks = 380 + Math.round(Math.random() * 60);
let delivered = Math.round((now.getHours() * 60 + now.getMinutes()) * 31.4) + 1200;
const paint = () => { onRoad.textContent = String(trucks); today.textContent = fmt(delivered); };
paint();
setInterval(() => {
  trucks = Math.min(470, Math.max(360, trucks + Math.round((Math.random() - 0.5) * 6)));
  delivered += 1 + Math.round(Math.random() * 2);
  paint();
}, 1800);

/* ---------- Tracking ---------- */
const trkForm = $<HTMLFormElement>('[data-track-form]');
const trkInput = $<HTMLInputElement>('[data-trk]');
const trkMsg = $('[data-trk-msg]');
const trkResult = $('[data-trk-result]');
const trkEmpty = $('[data-trk-empty]');
const FORMAT = /^PCE-?(\d{3})-?(\d{3})$/i;

type Shipment = { from: Hub; to: Hub; progress: number; status: string; eta: string; events: { t: string; text: string; state: 'done' | 'now' | 'todo' }[] };

/** Same number → same shipment, so a reload shows the same journey. */
function shipmentFor(digits: string): Shipment {
  let seed = [...digits].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  let from = hub('man');
  let to = hub('lon');
  let stage = 3; // 0 collected · 1 at origin hub · 2 trunked overnight · 3 out for delivery · 4 delivered
  if (digits !== '482193') {
    const route = ROUTES[Math.floor(rnd() * ROUTES.length)];
    [from, to] = rnd() > 0.5 ? [hub(route[0]), hub(route[1])] : [hub(route[1]), hub(route[0])];
    stage = Math.floor(rnd() * 5);
  }
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const at = (dayOffset: number, h: number, m: number) => { const d = new Date(base); d.setDate(d.getDate() + dayOffset); d.setHours(h, m); return d; };
  const steps = [
    { d: at(-1, 14, 22), text: `Collected from sender, ${from.name}` },
    { d: at(-1, 17, 48), text: `Scanned in at ${from.name} hub` },
    { d: at(-1, 23, 5), text: `Trunked overnight ${from.name} → ${to.name} (${roadKm(from, to)} km)` },
    { d: at(0, 6, 41), text: `Out for delivery from ${to.name} hub, driver Sam K.` },
    { d: at(0, 11, 18), text: 'Delivered, signed for by “J. Patel”' },
  ];
  const progress = [8, 22, 55, 72, 100][stage];
  const etaWindow = `${clock(at(0, 10, 30))}–${clock(at(0, 12, 30))}`;
  return {
    from, to, progress,
    status: ['Collected', 'At origin hub', 'In transit', 'Out for delivery', 'Delivered'][stage],
    eta: stage === 4 ? `Delivered ${clock(steps[4].d)}` : stage >= 2 ? `Today ${etaWindow}` : `${day(at(1, 0, 0))}, by 5 pm`,
    events: steps.map((s, i) => ({ t: i <= stage ? `${i === 4 || s.d.getDate() === base.getDate() ? '' : 'Yday '}${clock(s.d)}` : '—', text: s.text, state: i < stage ? 'done' : i === stage ? (stage === 4 ? 'done' : 'now') : 'todo' })),
  };
}

function track(raw: string) {
  const value = raw.trim().toUpperCase();
  const m = value.match(FORMAT);
  if (!m) {
    trkInput.setAttribute('aria-invalid', 'true');
    trkMsg.textContent = value ? 'That doesn’t look like a Pace number. It should look like PCE-123-456.' : 'Enter a tracking number first.';
    trkMsg.style.color = '#d93036';
    trkResult.hidden = true;
    trkEmpty.hidden = false;
    trkInput.focus();
    return;
  }
  const code = `PCE-${m[1]}-${m[2]}`;
  trkInput.value = code;
  trkInput.removeAttribute('aria-invalid');
  trkMsg.style.color = '';
  const s = shipmentFor(m[1] + m[2]);
  $('[data-trk-status]').textContent = s.status;
  $('[data-trk-eta]').textContent = s.eta;
  $('[data-trk-from]').textContent = s.from.name;
  $('[data-trk-to]').textContent = s.to.name;
  const bar = $('[data-trk-bar]');
  const truck = $('[data-trk-truck]');
  bar.style.setProperty('--p', '0%');
  truck.style.setProperty('--p', '0%');
  $('[data-trk-events]').innerHTML = s.events
    .map((e) => `<li class="${e.state === 'done' ? 'is-done' : e.state === 'now' ? 'is-done is-now' : ''}"><time>${e.t}</time><span>${e.text}</span></li>`)
    .join('');
  trkEmpty.hidden = true;
  trkResult.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.setProperty('--p', `${s.progress}%`);
    truck.style.setProperty('--p', `${s.progress}%`);
  }));
  trkMsg.textContent = `${code}: ${s.status.toLowerCase()}, ${s.from.name} to ${s.to.name}. ${s.eta}.`;
}

trkForm.addEventListener('submit', (e) => { e.preventDefault(); track(trkInput.value); });
$$('[data-try]').forEach((b) => b.addEventListener('click', () => { trkInput.value = b.dataset.try!; track(b.dataset.try!); }));

/* ---------- Instant quote ---------- */
const fromSel = $<HTMLSelectElement>('[data-from]');
const toSel = $<HTMLSelectElement>('[data-to]');
const weightSel = $<HTMLSelectElement>('[data-weight]');
const palOut = $('[data-pal-out]');
const summary = $('[data-q-summary]');
const optionsBox = $('[data-options]');
const bookBtn = $<HTMLAnchorElement>('[data-book-quote]');
let pallets = 2;
let chosen = 'standard';

const SERVICES = [
  { id: 'economy', name: 'Economy', factor: 0.78, co2: 0.8, eta: () => '2–3 working days', tag: 'Lowest CO₂' },
  { id: 'standard', name: 'Standard', factor: 1, co2: 1, eta: () => 'Next working day by 5 pm', tag: 'Most popular' },
  { id: 'express', name: 'Express AM', factor: 1.38, co2: 1.1, eta: () => 'Next working day before 10:30', tag: '' },
  { id: 'sameday', name: 'Same-day', factor: 2.6, co2: 1.6, eta: (km: number) => `Today, about ${Math.ceil(km / 70 + 1.5)} h after pickup`, tag: '' },
];

function quote() {
  const a = hub(fromSel.value);
  const b = hub(toSel.value);
  palOut.textContent = String(pallets);
  $$<HTMLButtonElement>('[data-pal]').forEach((btn) => { btn.disabled = (btn.dataset.pal === '-1' && pallets <= 1) || (btn.dataset.pal === '1' && pallets >= 26); });
  if (a.id === b.id) {
    summary.textContent = 'Collection and delivery are the same hub. Pick a different destination.';
    optionsBox.innerHTML = '';
    bookBtn.setAttribute('aria-disabled', 'true');
    return null;
  }
  bookBtn.removeAttribute('aria-disabled');
  const km = roadKm(a, b);
  const weight = Number(weightSel.value);
  // Per-pallet base plus distance, with a volume discount as pallets go up.
  const standard = (45 + km * 0.18) * pallets ** 0.86 * weight;
  const sameDayOk = pallets <= 2 && km <= 400;
  if (!SERVICES.some((s) => s.id === chosen) || (chosen === 'sameday' && !sameDayOk)) chosen = 'standard';
  summary.textContent = `${a.name} → ${b.name} · ${fmt(km)} km by road · ${pallets} pallet${pallets > 1 ? 's' : ''}`;
  optionsBox.innerHTML = SERVICES.map((s) => {
    const off = s.id === 'sameday' && !sameDayOk;
    const price = s.id === 'sameday' ? standard * s.factor + 90 : standard * s.factor;
    const co2 = Math.round(pallets * km * 0.09 * s.co2);
    return `<label class="pl-option">
      <input type="radio" name="svc" value="${s.id}" ${s.id === chosen ? 'checked' : ''} ${off ? 'disabled' : ''} />
      <span>
        ${s.tag ? `<em class="pl-option__tag">${s.tag}</em>` : ''}
        <b class="pl-option__name">${s.name}</b>
        <b class="pl-option__price">${off ? '—' : gbp(price)}</b>
        <small class="pl-option__meta">${off ? 'Up to 2 pallets and 400 km only' : s.eta(km)}</small>
        <small class="pl-option__meta">${off ? '&nbsp;' : `≈ ${fmt(co2)} kg CO₂e`}</small>
      </span>
    </label>`;
  }).join('');
  return { a, b, km };
}

function bookingText() {
  const q = quote();
  if (!q) return '';
  const opt = $<HTMLInputElement>('input[name="svc"]:checked', optionsBox);
  const label = opt?.closest('label');
  const name = label ? $('.pl-option__name', label).textContent : '';
  const price = label ? $('.pl-option__price', label).textContent : '';
  return `${name} shipment: ${pallets} pallet${pallets > 1 ? 's' : ''} (${weightSel.selectedOptions[0].text.toLowerCase()} each), ${q.a.name} → ${q.b.name}, ${fmt(q.km)} km. Quoted ${price} + VAT.`;
}

optionsBox.addEventListener('change', (e) => { chosen = (e.target as HTMLInputElement).value; });
[fromSel, toSel, weightSel].forEach((s) => s.addEventListener('change', quote));
$$('[data-pal]').forEach((b) => b.addEventListener('click', () => { pallets = Math.min(26, Math.max(1, pallets + Number(b.dataset.pal))); quote(); }));
$('[data-swap]').addEventListener('click', () => { [fromSel.value, toSel.value] = [toSel.value, fromSel.value]; quote(); });
bookBtn.addEventListener('click', (e) => {
  if (bookBtn.hasAttribute('aria-disabled')) { e.preventDefault(); toSel.focus(); return; }
  selectTab('ct-ship');
  const msg = $<HTMLTextAreaElement>('[data-f-msg]');
  msg.value = bookingText();
  setTimeout(() => $<HTMLInputElement>('#f-name').focus({ preventScroll: true }), 500);
});
quote();

/* ---------- Network map ---------- */
const routesFor = (id: string) => ROUTES.filter(([a, b]) => a === id || b === id);
function selectHub(id: string) {
  const h = hub(id);
  $$('[data-hub]').forEach((g) => g.setAttribute('aria-pressed', String(g.dataset.hub === id)));
  $$<SVGPathElement>('[data-route]').forEach((p) => p.classList.toggle('is-on', p.dataset.route!.split('-').includes(id)));
  $('[data-hub-name]').textContent = h.name;
  $('[data-hub-trucks]').textContent = String(h.trucks);
  $('[data-hub-size]').textContent = h.size;
  $('[data-hub-routes]').textContent = String(routesFor(id).length);
}
$$('[data-hub]').forEach((g) => {
  g.addEventListener('click', () => selectHub(g.dataset.hub!));
  g.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectHub(g.dataset.hub!); }
  });
});
selectHub('bhm');

/* ---------- Sustainability count-up ---------- */
function countUp(el: HTMLElement, to: number) {
  if (reduce) { el.textContent = fmt(to); return; }
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / 1600);
    el.textContent = fmt(Math.round(to * (1 - (1 - p) ** 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const green = $('#green');
new IntersectionObserver((entries, io) => {
  if (!entries[0].isIntersecting) return;
  io.disconnect();
  countUp($('[data-co2]'), 18640);
  countUp($('[data-cars]'), 4050);
}, { threshold: 0.3 }).observe(green);

/* ---------- Contact tabs ---------- */
const tabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-ctabs]'));
function selectTab(id: string, focus = false) {
  tabs.forEach((t) => {
    const on = t.id === id;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    if (on && focus) t.focus();
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t.id));
  t.addEventListener('keydown', (e) => {
    const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    selectTab(tabs[(next + tabs.length) % tabs.length].id, true);
  });
});

/* ---------- Contact form ---------- */
const contact = $<HTMLFormElement>('[data-contact]');
const okMsg = $('[data-contact-ok]');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const validField = (input: HTMLInputElement) => {
  const ok = input.type === 'email' ? EMAIL.test(input.value.trim()) : input.value.trim().length > 1;
  input.setAttribute('aria-invalid', String(!ok));
  $(`#${input.id}-e`).hidden = ok;
  return ok;
};
$$<HTMLInputElement>('[data-req]', contact).forEach((i) => i.addEventListener('blur', () => { if (i.value) validField(i); }));
contact.addEventListener('submit', (e) => {
  e.preventDefault();
  const fields = $$<HTMLInputElement>('[data-req]', contact);
  const bad = fields.filter((f) => !validField(f));
  if (bad.length) { okMsg.textContent = ''; bad[0].focus(); return; }
  const first = fields[0].value.trim().split(/\s+/)[0];
  okMsg.textContent = `Thanks ${first}, a logistics manager will call you back within 2 working hours. (Demo: nothing was sent.)`;
  contact.reset();
  fields.forEach((f) => f.removeAttribute('aria-invalid'));
});

/* ---------- Careers ---------- */
const applyOk = $('[data-apply-ok]');
$$<HTMLButtonElement>('[data-apply]').forEach((b) => b.addEventListener('click', () => {
  if (b.classList.contains('is-applied')) return;
  b.classList.add('is-applied');
  b.textContent = 'Application started ✓';
  applyOk.textContent = `Great choice. We’ve saved your place for “${b.dataset.apply}”. Our recruiter will text you a 2-minute form. (Demo: nothing was sent.)`;
}));
