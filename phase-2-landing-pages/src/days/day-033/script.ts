/**
 * Day 033 · Voltline Electrical · interactions.
 * Engineer ETA by postcode · house tour with job prices · emergency triage · EV charger savings · EICR due-date checker · booking.
 */
type Spot = { id: string; name: string; title: string; jobs: [string, string, string][] };
type Symptom = { id: string; label: string; level: 'danger' | 'urgent' | 'soon'; title: string; steps: string[] };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.ev');
const SPOTS: Spot[] = JSON.parse(root.dataset.spots!);
const SYMPTOMS: Symptom[] = JSON.parse(root.dataset.symptoms!);
const COVER: string[] = JSON.parse(root.dataset.cover!);
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const longDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Postcode helper ---------- */
const PC = /^([A-Z]{1,2})(\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;
function parsePostcode(raw: string) {
  const v = raw.trim().toUpperCase();
  const m = v.match(PC);
  if (!m) return { ok: false as const, v };
  return { ok: true as const, v: `${m[1]}${m[2]} ${m[3]}`, area: m[1], covered: COVER.includes(m[1]) };
}
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/* ---------- Hero ETA ---------- */
const ENGINEERS = ['Sam K.', 'Priya D.', 'Marcus T.', 'Hannah W.', 'Jo B.'];
const etaMsg = $('[data-eta-msg]');
const etaIn = $<HTMLInputElement>('#e-pc');
$<HTMLFormElement>('[data-eta]').addEventListener('submit', (e) => {
  e.preventDefault();
  etaMsg.className = 'ev-eta__msg';
  const p = parsePostcode(etaIn.value);
  if (!p.ok) { etaMsg.classList.add('is-bad'); etaMsg.innerHTML = etaIn.value.trim() ? 'That doesn’t look like a UK postcode, e.g. B1 1BB.' : 'Enter your postcode first.'; etaIn.focus(); return; }
  if (!p.covered) { etaMsg.classList.add('is-bad'); etaMsg.textContent = `We don’t cover ${p.area} yet. We work across Birmingham, Coventry, Walsall, Wolverhampton, Dudley and Stafford.`; return; }
  const h = hash(p.v);
  const mins = 12 + (h % 27);
  const eng = ENGINEERS[h % ENGINEERS.length];
  const t = new Date(Date.now() + mins * 60000);
  etaMsg.innerHTML = `<b>${eng}</b> is ${mins} minutes from ${p.v}. Could be with you by ${pad(t.getHours())}:${pad(t.getMinutes())}.`;
  $<HTMLInputElement>('#b-pc').value ||= p.v;
});

/* ---------- House tour ---------- */
const JOB_FOR: Record<string, string> = { kitchen: 'lighting', board: 'board', lounge: 'lighting', bath: 'lighting', loft: 'rewire', garage: 'ev' };
let spotId = 'board';
function paintSpot(id: string) {
  spotId = id;
  const s = SPOTS.find((x) => x.id === id)!;
  $$<HTMLButtonElement>('[data-spot]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.spot === id)));
  $('[data-job-k]').textContent = s.name;
  $('[data-job-t]').textContent = s.title;
  $('[data-job-list]').innerHTML = s.jobs.map(([j, p, t]) => `<li><b>${esc(j)}</b><em>${p}</em><small>Typical time: ${t}</small></li>`).join('');
}
$$<HTMLButtonElement>('[data-spot]').forEach((b) => b.addEventListener('click', () => paintSpot(b.dataset.spot!)));
$('[data-job-book]').addEventListener('click', () => { $<HTMLSelectElement>('#b-job').value = JOB_FOR[spotId]; paintBooking(); });
paintSpot('board');

/* ---------- Triage ---------- */
const LEVEL = { danger: 'Danger', urgent: 'Urgent', soon: 'Book soon' };
const body = $('[data-advice-body]');
const cta = $<HTMLAnchorElement>('[data-advice-cta]');
let advice: Symptom | null = null;
$('[data-symptoms]').addEventListener('change', (e) => {
  const s = SYMPTOMS.find((x) => x.id === (e.target as HTMLInputElement).value);
  if (!s) return;
  advice = s;
  $('[data-advice-empty]').hidden = true;
  body.hidden = false;
  const lv = $('[data-level]');
  lv.dataset.lv = s.level;
  lv.textContent = LEVEL[s.level];
  $('[data-advice-t]').textContent = s.title;
  $('[data-steps]').innerHTML = s.steps.map((t) => `<li>${esc(t)}</li>`).join('');
  if (s.level === 'danger') { cta.href = 'tel:999'; cta.textContent = 'Call 999 now'; }
  else if (s.level === 'urgent') { cta.href = '#book'; cta.textContent = 'Book an emergency engineer'; }
  else { cta.href = '#book'; cta.textContent = 'Book a fault-finding visit'; }
});
cta.addEventListener('click', () => {
  if (!advice || advice.level === 'danger') return;
  $<HTMLSelectElement>('#b-job').value = advice.level === 'urgent' ? 'emergency' : 'fault';
  paintBooking();
});

/* ---------- EV calculator ---------- */
const miles = $<HTMLInputElement>('#ev-miles');
const share = $<HTMLInputElement>('#ev-share');
const eff = $<HTMLSelectElement>('#ev-eff');
const tariff = $<HTMLSelectElement>('#ev-tariff');
const PUBLIC = 0.79;
const INSTALL = 949;
function paintEv() {
  const kwh = Number(miles.value) / Number(eff.value);
  const s = Number(share.value) / 100;
  const a = kwh * PUBLIC;
  const b = kwh * s * (Number(tariff.value) / 100) + kwh * (1 - s) * PUBLIC;
  const save = a - b;
  $('[data-miles-out]').textContent = Number(miles.value).toLocaleString('en-GB');
  $('[data-share-out]').textContent = share.value + '%';
  $('[data-save-year]').textContent = gbp(save * 12);
  $('[data-cost-a]').textContent = `${gbp(a)}/month`;
  $('[data-cost-b]').textContent = `${gbp(b)}/month`;
  $('[data-bar-a]').style.setProperty('--w', '100%');
  $('[data-bar-b]').style.setProperty('--w', `${Math.max(2, (b / a) * 100)}%`);
  const months = save > 0 ? Math.ceil(INSTALL / save) : 0;
  $('[data-payback]').textContent = save <= 0 ? 'Charging mostly in public, a home charger won’t save much. Try raising the share charged at home.' : months <= 24 ? `A ${gbp(INSTALL)} installed charger pays for itself in about ${months} month${months > 1 ? 's' : ''}.` : `A ${gbp(INSTALL)} installed charger pays for itself in about ${(months / 12).toFixed(1)} years.`;
}
$<HTMLFormElement>('[data-evcalc]').addEventListener('input', paintEv);
$<HTMLFormElement>('[data-evcalc]').addEventListener('submit', (e) => e.preventDefault());
$('[data-ev-book]').addEventListener('click', () => { $<HTMLSelectElement>('#b-job').value = 'ev'; paintBooking(); });
paintEv();

/* ---------- EICR checker ---------- */
const eicr = $<HTMLFormElement>('[data-eicr]');
const dateIn = $<HTMLInputElement>('#x-date');
const unknown = $<HTMLInputElement>('[data-unknown]');
const status = $('[data-status]');
const eicrBtn = $<HTMLAnchorElement>('[data-eicr-book]');
const today = new Date(); today.setHours(0, 0, 0, 0);
dateIn.max = iso(today);
const RULES = {
  landlord: { years: 5, note: 'Private landlords in England must have the electrics inspected at least every 5 years and give tenants a copy.' },
  home: { years: 10, note: 'For owner-occupied homes, an inspection every 10 years (or when you buy or sell) is recommended.' },
  biz: { years: 5, note: 'Most workplaces should be inspected about every 5 years. Your insurer may ask for more often.' },
} as const;
function paintEicr() {
  const kind = (eicr.elements.namedItem('kind') as RadioNodeList).value as keyof typeof RULES;
  const rule = RULES[kind];
  dateIn.disabled = unknown.checked;
  const set = (state: string, t: string, p: string, book = false) => { status.dataset.state = state; $('[data-status-t]').textContent = t; $('[data-status-p]').textContent = p; eicrBtn.hidden = !book; };
  if (unknown.checked) return set('over', 'No valid certificate on record', `${rule.note} Without one you can’t prove the installation is safe.`, true);
  if (!dateIn.value) return set('idle', 'Enter a date to check.', rule.note);
  const last = new Date(dateIn.value + 'T00:00');
  if (last > today) return set('idle', 'That date is in the future', 'Check the date on your certificate.');
  const due = new Date(last); due.setFullYear(due.getFullYear() + rule.years);
  const days = Math.round((due.getTime() - today.getTime()) / 864e5);
  if (days < 0) return set('over', `Overdue by ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''}`, `It was due on ${longDate(due)}. ${rule.note}`, true);
  if (days <= 180) return set('soon', `Due in ${days} day${days > 1 ? 's' : ''}`, `Next inspection due ${longDate(due)}. Book now to avoid a rush. ${rule.note}`, true);
  set('ok', 'In date', `Your next inspection is due by ${longDate(due)}, in ${days > 365 ? (days / 365).toFixed(1) + ' years' : days + ' days'}. ${rule.note}`);
}
eicr.addEventListener('change', paintEicr);
eicr.addEventListener('submit', (e) => e.preventDefault());
eicrBtn.addEventListener('click', () => { $<HTMLSelectElement>('#b-job').value = 'eicr'; paintBooking(); });
paintEicr();

/* ---------- Booking ---------- */
const JOBS: Record<string, string> = { emergency: 'Emergency callout', fault: 'Fault finding', board: 'Fuse board upgrade', rewire: 'Rewire', ev: 'EV charger install', lighting: 'Lighting & sockets', eicr: 'EICR safety certificate', other: 'General electrical work' };
const WINDOWS = ['8am – 10am', '10am – 12pm', '12pm – 2pm', '2pm – 4pm', '4pm – 6pm'];
const days = Array.from({ length: 10 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
const jobSel = $<HTMLSelectElement>('#b-job');
const daysEl = $('[data-days]');
const slotsEl = $('[data-slots]');
const st = { date: '', slot: '' };
function free(d: Date, w: string) {
  let h = 2166136261;
  for (const c of `${iso(d)}|${w}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return ((h >>> 0) % 100) >= (d.getDay() === 0 ? 60 : 30);
}
function paintDays() {
  daysEl.innerHTML = days.map((d) => `<label class="ev-pick"><input type="radio" name="day" value="${iso(d)}" ${WINDOWS.some((w) => free(d, w)) ? '' : 'disabled'} ${st.date === iso(d) ? 'checked' : ''}/><span><small>${d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></span></label>`).join('');
}
function paintSlots() {
  if (!st.date) { slotsEl.innerHTML = '<p class="ev-note">Choose a day first.</p>'; return; }
  const d = new Date(st.date + 'T00:00');
  if (st.slot && !free(d, st.slot)) st.slot = '';
  slotsEl.innerHTML = WINDOWS.map((w) => `<label class="ev-pick"><input type="radio" name="slot" value="${w}" ${free(d, w) ? '' : 'disabled'} ${st.slot === w ? 'checked' : ''}/><span style="padding-block:0.9rem">${w}</span></label>`).join('');
}
daysEl.addEventListener('change', (e) => { st.date = (e.target as HTMLInputElement).value; paintSlots(); paintBooking(); });
slotsEl.addEventListener('change', (e) => { st.slot = (e.target as HTMLInputElement).value; paintBooking(); });
const isEmergency = () => jobSel.value === 'emergency';
function paintBooking() {
  const em = isEmergency();
  $('[data-when-wrap]').hidden = em;
  $('[data-emerg]').hidden = !em;
  $('[data-s-job]').textContent = JOBS[jobSel.value];
  $('[data-s-when]').textContent = em ? 'Within 5 min call' : st.date && st.slot ? `${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${st.slot}` : 'Not chosen';
  $('[data-s-fee]').textContent = em ? '£90 (credited to job)' : 'Free quote visit';
  $('[data-book-btn]').textContent = em ? 'Send an engineer now' : 'Book now';
}
jobSel.addEventListener('change', paintBooking);

const form = $<HTMLFormElement>('[data-book]');
const bookErr = $('[data-book-err]');
const validField = (i: HTMLInputElement) => {
  const v = i.value.trim();
  let ok: boolean;
  if (i.type === 'tel') ok = v.replace(/\D/g, '').length >= 10;
  else if (i.id === 'b-pc') { const p = parsePostcode(v); ok = p.ok && p.covered; }
  else ok = v.length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
};
$$<HTMLInputElement>('[data-req]', form).forEach((i) => i.addEventListener('blur', () => { if (i.value) validField(i); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  bookErr.hidden = true;
  const em = isEmergency();
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !validField(i));
  if (!em && (!st.date || !st.slot)) { bookErr.textContent = !st.date ? 'Pick a day for the visit.' : 'Pick a time window.'; bookErr.hidden = false; $<HTMLElement>(st.date ? '[name="slot"]:not(:disabled)' : '[name="day"]:not(:disabled)').focus(); return; }
  if (bad.length) { bookErr.textContent = 'Please fix the highlighted fields.'; bookErr.hidden = false; bad[0].focus(); return; }
  const pc = parsePostcode($<HTMLInputElement>('#b-pc').value);
  const first = $<HTMLInputElement>('#b-name').value.trim().split(/\s+/)[0];
  const eng = ENGINEERS[hash(pc.v) % ENGINEERS.length];
  $('[data-done-name]').textContent = first;
  $('[data-done-text]').textContent = em
    ? `${eng} is being sent to ${pc.v}. We’ll call you on ${$<HTMLInputElement>('#b-phone').value.trim()} within 5 minutes. Please stay clear of anything unsafe.`
    : `${eng} will visit on ${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}, ${st.slot}, for: ${JOBS[jobSel.value].toLowerCase()}. You’ll get a fixed price before any work starts.`;
  $('[data-ref]').textContent = 'VL-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-sum]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
$('[data-again]').addEventListener('click', () => {
  st.date = ''; st.slot = ''; form.reset();
  $$<HTMLInputElement>('[data-req]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  form.hidden = false; $('[data-sum]').hidden = false; $('[data-done]').hidden = true;
  paintDays(); paintSlots(); paintBooking();
});
paintDays(); paintSlots(); paintBooking();
