/**
 * Day 023 · Northgate Motorworks · interactions:
 * registration lookup → fixed-price quote, digital health check approvals, booking.
 * All “lookups” are simulated locally; nothing leaves the browser.
 */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
const gbp = (n: number) => `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const LABOUR = 85;

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Count-up ---------- */
new IntersectionObserver((entries, io) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  io.unobserve(en.target);
  if (reduced.matches) return;
  const el = en.target as HTMLElement;
  const target = Number(el.dataset.count);
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / 1500);
    el.textContent = Math.round(target * (1 - (1 - p) ** 3)).toLocaleString('en-GB');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  setTimeout(() => { el.textContent = target.toLocaleString('en-GB'); }, 1700);
}), { threshold: 0.6 }).observe($('[data-count]'));

/* ---------- Registration lookup ---------- */
type Vehicle = { name: string; spec: string; factor: number; ev?: boolean };
const KNOWN: Record<string, Vehicle> = {
  AB19XYZ: { name: '2019 Volkswagen Golf', spec: '1.5 TSI EVO · Petrol · Manual · 48,200 mi', factor: 1 },
  LS21KTE: { name: '2021 Tesla Model 3', spec: 'Long Range AWD · Electric · 31,900 mi', factor: 0.8, ev: true },
};
const POOL: Vehicle[] = [
  { name: '2017 Ford Focus', spec: '1.0 EcoBoost · Petrol · Manual', factor: 0.95 },
  { name: '2020 BMW 320d', spec: '2.0 Diesel · Automatic', factor: 1.3 },
  { name: '2018 Toyota Yaris Hybrid', spec: '1.5 Hybrid · Automatic', factor: 0.9 },
  { name: '2022 Škoda Octavia', spec: '2.0 TDI · Diesel · DSG', factor: 1.1 },
  { name: '2016 Mercedes-Benz C220', spec: '2.1 Diesel · Automatic', factor: 1.35 },
  { name: '2019 Mini Cooper', spec: '1.5 Petrol · Manual', factor: 1.05 },
];
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const lookup = $<HTMLFormElement>('[data-lookup]');
const regInput = $<HTMLInputElement>('[data-reg]');
const regMsg = $('[data-reg-msg]');
const quote = $<HTMLFormElement>('[data-quote]');
let vehicle: Vehicle | null = null;

function normalise(v: string) { return v.toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function formatPlate(v: string) { return /^[A-Z]{2}\d{2}[A-Z]{3}$/.test(v) ? `${v.slice(0, 4)} ${v.slice(4)}` : v; }

regInput.addEventListener('input', () => { regInput.value = regInput.value.toUpperCase(); });
lookup.addEventListener('submit', (e) => {
  e.preventDefault();
  const reg = normalise(regInput.value);
  // Current-style (AB19XYZ) or older/private plates of 2–7 characters.
  if (!/^[A-Z]{2}\d{2}[A-Z]{3}$/.test(reg) && !/^(?=.*\d)(?=.*[A-Z])[A-Z0-9]{2,7}$/.test(reg)) {
    regMsg.innerHTML = '<span style="color:var(--bad)">That doesn’t look like a UK registration. Try something like AB19 XYZ.</span>';
    regInput.setAttribute('aria-invalid', 'true');
    regInput.focus();
    return;
  }
  regInput.removeAttribute('aria-invalid');
  regInput.value = formatPlate(reg);
  const btn = $<HTMLButtonElement>('.nm-plate__go', lookup);
  btn.setAttribute('aria-busy', 'true');
  btn.textContent = 'Searching…';
  regMsg.textContent = 'Checking DVLA & parts catalogues…';
  setTimeout(() => {
    vehicle = KNOWN[reg] ?? POOL[hash(reg) % POOL.length];
    btn.removeAttribute('aria-busy');
    btn.textContent = 'Find my car';
    $('[data-vehicle]').hidden = false;
    $('[data-veh-name]').textContent = vehicle.name;
    $('[data-veh-spec]').textContent = vehicle.spec;
    regMsg.textContent = `Found it. Prices below are for your ${vehicle.name.replace(/^\d+ /, '')}.`;
    quote.inert = false;
    renderQuote();
  }, reduced.matches ? 150 : 750);
});
$$<HTMLButtonElement>('[data-try-reg]').forEach((b) => b.addEventListener('click', () => { regInput.value = b.dataset.tryReg!; lookup.requestSubmit(); }));

/* ---------- Quote ---------- */
function currentJob() { return $<HTMLInputElement>('[name="job"]:checked', quote); }
function renderQuote() {
  const job = currentJob();
  const name = job.nextElementSibling!.textContent!;
  $('[data-booking-job]').innerHTML = `Job: <b>${name}</b> <span class="text-(--muted)">${vehicle ? `· ${vehicle.name}` : '(change it in the quote above)'}</span>`;
  if (!vehicle) return;
  const f = vehicle.factor;
  const extras = $$<HTMLInputElement>('[name="extra"]:checked', quote).reduce((s, x) => s + Number(x.dataset.price), 0) / 1.2; // add-on prices include VAT
  const set = (k: string, v: string) => { $(`[data-b="${k}"]`, quote).textContent = v; };
  if (job.dataset.fixed) {
    const total = Number(job.dataset.fixed) + extras * 1.2;
    set('parts', '–'); set('hours', ''); set('labour', gbp(Number(job.dataset.fixed)));
    set('extras', extras ? gbp(extras) : '–'); set('vat', extras ? gbp(extras * 0.2) : 'MOTs are VAT-exempt');
    set('total', gbp(total));
    set('note', 'The MOT fee is the legal maximum: we never charge more. Free retest within 10 working days.');
    return;
  }
  let hours = Number(job.dataset.labour) * f;
  let parts = Number(job.dataset.parts) * f;
  let note = `Includes ${hours.toFixed(1)} h labour at £${LABOUR}/h. Typically ready the same day.`;
  if (vehicle.ev && (job.value === 'interim' || job.value === 'full')) {
    parts *= 0.35; hours *= 0.7;
    note = 'Electric car: no oil or spark plugs, so the service is shorter and cheaper. We check brakes, coolant, tyres and the high-voltage system.';
  }
  if (vehicle.ev && job.value === 'clutch') {
    $('[data-b="total"]', quote).textContent = 'N/A';
    set('parts', '–'); set('labour', '–'); set('extras', '–'); set('vat', '–'); set('hours', '');
    set('note', 'Your Tesla doesn’t have a clutch. Choose another job.');
    return;
  }
  const labour = hours * LABOUR;
  const net = parts + labour + extras;
  set('parts', parts ? gbp(parts) : '–');
  set('hours', `(${hours.toFixed(1)} h)`);
  set('labour', gbp(labour));
  set('extras', extras ? gbp(extras) : '–');
  set('vat', gbp(net * 0.2));
  set('total', gbp(net * 1.2));
  set('note', note);
}
quote.addEventListener('change', renderQuote);
$$<HTMLAnchorElement>('[data-quote-for]').forEach((a) => a.addEventListener('click', () => {
  const r = $<HTMLInputElement>(`[name="job"][value="${a.dataset.quoteFor}"]`, quote);
  if (r) { r.checked = true; renderQuote(); }
  setTimeout(() => (quote.inert ? regInput : r)?.focus({ preventScroll: true }), 400);
}));
renderQuote();

/* ---------- Digital health check ---------- */
const report = $('[data-report]');
const items = $$('[data-status]', report);
const filterBtns = $$<HTMLButtonElement>('[data-filter] [role="tab"]', report);
filterBtns.forEach((b, i) => {
  const select = () => {
    filterBtns.forEach((x) => { x.setAttribute('aria-selected', String(x === b)); x.tabIndex = x === b ? 0 : -1; });
    items.forEach((it) => { it.hidden = b.dataset.f !== 'all' && it.dataset.status !== b.dataset.f; });
    b.focus();
  };
  b.addEventListener('click', select);
  b.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1 } as Record<string, number>)[e.key];
    if (n !== undefined) { e.preventDefault(); filterBtns[(n + filterBtns.length) % filterBtns.length].click(); }
  });
});
const approvedEl = $('[data-approved]');
const sendBtn = $<HTMLButtonElement>('[data-send-approval]');
function renderApprovals() {
  let total = 0; let decided = 0;
  $$<HTMLElement>('.nm-decide', report).forEach((d) => {
    const yes = $<HTMLButtonElement>('[data-decide="yes"]', d);
    const no = $<HTMLButtonElement>('[data-decide="no"]', d);
    if (yes.getAttribute('aria-pressed') === 'true') { total += Number(yes.dataset.price); decided++; }
    if (no.getAttribute('aria-pressed') === 'true') decided++;
  });
  approvedEl.textContent = gbp(total).replace('.00', '');
  sendBtn.disabled = decided === 0;
  $('[data-approval-msg]').textContent = '';
}
report.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-decide]');
  if (!b) return;
  const group = b.closest('.nm-decide')!;
  const on = b.getAttribute('aria-pressed') !== 'true';
  $$<HTMLButtonElement>('[data-decide]', group).forEach((x) => x.setAttribute('aria-pressed', String(x === b && on)));
  renderApprovals();
});
sendBtn.addEventListener('click', () => {
  const yes = $$<HTMLButtonElement>('[data-decide="yes"][aria-pressed="true"]', report);
  const declinedRed = $$('.is-red', report).some((r) => $('[data-decide="no"]', r)?.getAttribute('aria-pressed') === 'true');
  $('[data-approval-msg]').textContent = yes.length
    ? `✓ ${yes.length} job${yes.length > 1 ? 's' : ''} approved. We'll start now and text you when it's ready.${declinedRed ? ' Note: the front pads are below the legal safe limit.' : ''}`
    : `✓ Noted, no extra work. We'll remind you about these at your next visit.${declinedRed ? ' Please don’t leave the front pads too long.' : ''}`;
});
renderApprovals();

/* ---------- Booking ---------- */
const book = $<HTMLFormElement>('[data-book]');
const daysEl = $('[data-days]');
const seed = (n: number) => { const x = Math.sin(n * 9301 + 49297) * 233280; return x - Math.floor(x); };
const today = new Date(); today.setHours(0, 0, 0, 0);
const days: { d: Date; full: boolean; cars: number }[] = [];
for (let i = 1; days.length < 12; i++) {
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
  if (d.getDay() === 0) continue;
  const r = seed(d.getDate() + d.getMonth() * 31);
  days.push({ d, full: r < 0.15, cars: Math.floor(seed(d.getDate() * 7) * 4) });
}
const short = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const long = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
daysEl.innerHTML = days.map(({ d, full }, i) => `<label><input type="radio" name="day" value="${i}" ${full ? 'disabled' : ''}><span><small>${short.format(d)}</small><b>${d.getDate()}</b><span class="sr-only">${long.format(d)}${full ? ', fully booked' : d.getDay() === 6 ? ', Saturday morning only' : ''}</span></span></label>`).join('');
const firstFree = days.findIndex((x) => !x.full);
($<HTMLInputElement>(`[name="day"][value="${firstFree}"]`, book)).checked = true;

const courtesy = $<HTMLInputElement>('[data-courtesy]', book);
function renderCourtesy() {
  const i = Number(($<HTMLInputElement>('[name="day"]:checked', book)).value);
  const left = days[i].cars;
  courtesy.disabled = left === 0;
  if (!left) courtesy.checked = false;
  $('[data-courtesy-left]', book).textContent = left ? `(${left} left that day)` : '(none left that day, try another day)';
}
const collectBox = $('[data-collect]', book);
const pcInput = $<HTMLInputElement>('#bk-pc', book);
const NEAR = ['LS2', 'LS6', 'LS7', 'LS8', 'LS17'];
function checkPc() {
  const v = pcInput.value.toUpperCase().replace(/\s+/g, ' ').trim();
  const m = v.match(/^([A-Z]{1,2}\d[A-Z\d]?)\s?(\d[A-Z]{2})?$/);
  const out = $('[data-pc-msg]', book);
  if (!m) { out.innerHTML = '<span style="color:var(--bad)">Please enter a valid postcode.</span>'; pcInput.setAttribute('aria-invalid', 'true'); return false; }
  pcInput.removeAttribute('aria-invalid');
  out.innerHTML = NEAR.includes(m[1]) ? '<span style="color:var(--ok)">✓ Free collection and delivery.</span>' : '<span style="color:var(--warn)">A little outside our free zone: collection is £15.</span>';
  return true;
}
pcInput.addEventListener('change', checkPc);
book.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  if (t.name === 'day') renderCourtesy();
  if (t.name === 'how') { collectBox.hidden = t.value !== 'collect'; if (t.value === 'collect') pcInput.focus(); }
});
renderCourtesy();

function check(input: HTMLInputElement) {
  const v = input.value.trim();
  const ok = input.type === 'tel' ? /^(?:\+44|0)7\d{9}$/.test(v.replace(/\s/g, '')) : v.length > 1;
  input.setAttribute('aria-invalid', String(!ok));
  (document.getElementById(input.getAttribute('aria-describedby')!) as HTMLElement).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]', book).forEach((i) => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') check(i); }));

book.addEventListener('submit', (e) => {
  e.preventDefault();
  const err = $('[data-book-err]', book);
  const bad = $$<HTMLInputElement>('[data-req]', book).filter((i) => !check(i));
  const collect = ($<HTMLInputElement>('[name="how"]:checked', book)).value === 'collect';
  if (collect && !checkPc()) { err.textContent = 'Please check your collection postcode.'; pcInput.focus(); return; }
  if (bad.length) { err.textContent = 'Please check the highlighted fields.'; bad[0].focus(); return; }
  err.textContent = '';
  const day = days[Number(($<HTMLInputElement>('[name="day"]:checked', book)).value)].d;
  const job = currentJob().nextElementSibling!.textContent;
  $('[data-done-title]').textContent = `${job}, ${long.format(day)}`;
  $('[data-done-text]').textContent = `${collect ? `We'll collect from ${pcInput.value.toUpperCase()} between 08:00 and 09:30` : 'Drop off between 08:00 and 09:30'}${courtesy.checked ? ', with a courtesy car waiting' : ''}. Your health check will be texted to ${($<HTMLInputElement>('#bk-phone')).value} during the day.`;
  book.hidden = true;
  const done = $('[data-done]');
  done.hidden = false;
  done.focus();
});
$('[data-rebook]').addEventListener('click', () => { $('[data-done]').hidden = true; book.hidden = false; $<HTMLInputElement>('#bk-name').focus(); });

/* ---------- Open now (Leeds time) ---------- */
function openNow() {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
  const m = Number(p.hour) * 60 + Number(p.minute);
  const wk = p.weekday as string;
  const [o, c] = wk === 'Sun' ? [0, 0] : wk === 'Sat' ? [480, 780] : [465, 1080];
  const open = m >= o && m < c;
  $('[data-open-now]').innerHTML = `<span class="nm-dot" style="${open ? '' : 'background:var(--bad);box-shadow:none;animation:none'}"></span>${open ? `Open now · until ${wk === 'Sat' ? '13:00' : '18:00'}` : 'Closed now · book online any time'}`;
}
openNow();
setInterval(openNow, 60_000);
