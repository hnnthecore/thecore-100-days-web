/**
 * Day 037 · Pawprint Veterinary Care · interactions.
 * Open-now status · animated pet picker · life-stage care timeline · symptom triage · feeding maths · vet finder · booking.
 */
import { pet, type Pet } from './art';

type Step = [string, string, string];

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.vt');
const TIMELINE: Record<Pet, Record<'young' | 'adult' | 'senior', Step[]>> = JSON.parse(root.dataset.timeline!);
const SYMPTOMS: [string, string, 'emergency' | 'urgent' | 'soon' | 'monitor'][] = JSON.parse(root.dataset.symptoms!);
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const BG: Record<Pet, string> = { dog: '#ffe3b5', cat: '#dfe6f5', rabbit: '#fde1e5' };
const NAME: Record<Pet, string> = { dog: 'dog', cat: 'cat', rabbit: 'rabbit' };

/* ---------- Header & open status ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
const HOURS: Record<number, [number, number] | null> = { 0: [10, 16], 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 20], 6: [9, 17] };
function paintOpen() {
  const now = new Date();
  const h = HOURS[now.getDay()]!;
  const t = now.getHours() + now.getMinutes() / 60;
  const open = t >= h[0] && t < h[1];
  $('[data-open-dot]').classList.toggle('is-closed', !open);
  $('[data-open-text]').textContent = open ? `Open now until ${h[1] > 12 ? h[1] - 12 + ' pm' : h[1] + ' am'} · 24/7 emergency line` : 'Closed for appointments · 24/7 emergency line open';
}
paintOpen();

/* ---------- Hero pets ---------- */
const TIPS: Record<Pet, string> = { dog: 'Dogs: a yearly booster and health check keeps tails wagging.', cat: 'Cats: hide pain brilliantly. A yearly check catches what you can’t see.', rabbit: 'Rabbits: need two vaccines a year and hay for 85% of their diet.' };
let heroPet: Pet = 'dog';
function setHero(p: Pet) {
  heroPet = p;
  const stage = $('[data-pet-stage]');
  stage.style.setProperty('--bg', BG[p]);
  stage.innerHTML = pet(p, `Illustration of a friendly ${p}`);
  $('[data-pet-tip]').textContent = TIPS[p];
  $$('[data-pet-pick] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pet === p)));
}
$('[data-pet-pick]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) { setHero(b.dataset.pet as Pet); setCare(b.dataset.pet as Pet, careStage); } });
setHero('dog');

/* ---------- Timeline ---------- */
let carePet: Pet = 'dog';
let careStage: 'young' | 'adult' | 'senior' = 'young';
function setCare(p: Pet, s: 'young' | 'adult' | 'senior') {
  carePet = p; careStage = s;
  $$('[data-care-pet] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === p)));
  $$('[data-care-stage] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.s === s)));
  $('[data-care-stage] [data-s="young"]').textContent = p === 'dog' ? 'Puppy' : p === 'cat' ? 'Kitten' : 'Young rabbit';
  $('[data-care-who]').textContent = `your ${NAME[p]}`;
  $('[data-timeline-list]').innerHTML = TIMELINE[p][s].map(([when, t, d], i) => `<li class="vt-step" style="animation-delay:${i * 70}ms"><p class="vt-step__when">${esc(when)}</p><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join('');
}
$('[data-care-pet]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) setCare(b.dataset.p as Pet, careStage); });
$('[data-care-stage]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) setCare(carePet, b.dataset.s as 'young' | 'adult' | 'senior'); });
setCare('dog', 'young');

/* ---------- Symptom checker ---------- */
const check = $<HTMLFormElement>('[data-check]');
const ORDER = ['monitor', 'soon', 'urgent', 'emergency'] as const;
const ADVICE = {
  emergency: { t: 'This is an emergency. Call us now.', p: 'These signs need a vet immediately, day or night.', steps: ['Call our 24/7 emergency line: 0800 000 7777 (demo number).', 'Keep your pet warm, calm and still.', 'Don’t give food, water or human medicine unless a vet tells you to.', 'If it might be poison, bring the packaging with you.'], cta: 'Call the emergency line', href: 'tel:08000007777' },
  urgent: { t: 'See a vet today.', p: 'Not a 999-style emergency, but it shouldn’t wait until tomorrow.', steps: ['Ring us as soon as we open, or book a same-day slot below.', 'Note when it started and anything they’ve eaten.', 'Take photos or a short video of what you’re seeing.', 'If it gets worse, switch to the emergency line.'], cta: 'Book a same-day visit', href: '#book' },
  soon: { t: 'Book a visit this week.', p: 'Worth checking, and usually very treatable when caught early.', steps: ['Book an appointment in the next few days.', 'Keep an eye on appetite, energy and toilet habits.', 'Ring us if anything changes.'], cta: 'Book a visit', href: '#book' },
  monitor: { t: 'Keep an eye on them.', p: 'This is usually nothing to worry about.', steps: ['Watch them for the next 24 hours.', 'Make sure fresh water is always available.', 'Ring our free nurse line if it continues or you feel uneasy.'], cta: 'Ask a nurse (free)', href: '#book' },
} as const;
let adviceLevel: keyof typeof ADVICE | null = null;
function paintCheck() {
  const sp = (check.elements.namedItem('sp') as RadioNodeList).value as Pet;
  const ticked = $$<HTMLInputElement>('input[type="checkbox"]', check).filter((c) => c.checked);
  let top = -1;
  ticked.forEach((c) => {
    let lvl = ORDER.indexOf(c.dataset.level as (typeof ORDER)[number]);
    if (sp === 'rabbit' && c.value === 'eating') lvl = 3; // a rabbit that stops eating is an emergency
    top = Math.max(top, lvl);
  });
  const body = $('[data-advice-body]');
  $('.vt-advice__idle').hidden = top >= 0;
  body.hidden = top < 0;
  if (top < 0) { adviceLevel = null; return; }
  adviceLevel = ORDER[top];
  const a = ADVICE[adviceLevel];
  const lvl = $('[data-lvl]');
  lvl.dataset.lv = adviceLevel;
  lvl.textContent = { emergency: 'Emergency', urgent: 'Urgent: today', soon: 'Book soon', monitor: 'Monitor' }[adviceLevel];
  $('[data-adv-t]').textContent = a.t;
  $('[data-adv-p]').textContent = sp === 'rabbit' && ticked.some((c) => c.value === 'eating') ? 'A rabbit that stops eating can become critically ill within hours. ' + a.p : a.p;
  $('[data-adv-steps]').innerHTML = a.steps.map((s) => `<li>${esc(s)}</li>`).join('');
  const cta = $<HTMLAnchorElement>('[data-adv-cta]');
  cta.textContent = a.cta; cta.href = a.href;
}
check.addEventListener('change', paintCheck);
check.addEventListener('submit', (e) => e.preventDefault());
$('[data-adv-cta]').addEventListener('click', () => {
  if (!adviceLevel || adviceLevel === 'emergency') return;
  const sp = (check.elements.namedItem('sp') as RadioNodeList).value;
  $<HTMLSelectElement>('#b-sp').value = sp;
  $<HTMLInputElement>('[data-urgent]').checked = adviceLevel === 'urgent';
  $<HTMLSelectElement>('#b-why').value = adviceLevel === 'monitor' ? 'Nurse clinic (weight, nails)' : 'Not well / worried';
  $<HTMLTextAreaElement>('[data-note]').value = `Symptoms: ${$$<HTMLInputElement>('input[type="checkbox"]', check).filter((c) => c.checked).map((c) => c.nextElementSibling!.textContent).join('; ')}.`;
  paintBook();
});
paintCheck();

/* ---------- Feeding ---------- */
const feed = $<HTMLFormElement>('[data-feed]');
const fw = $<HTMLInputElement>('#fw');
const RANGE: Record<Pet, [number, number, number, number]> = { dog: [1, 45, 0.5, 12], cat: [2, 8, 0.1, 4.2], rabbit: [1, 5, 0.1, 2] };
const MULT: Record<'dog' | 'cat', Record<string, number>> = { dog: { young: 2.5, adult: 1.6, intact: 1.8, senior: 1.4 }, cat: { young: 2.5, adult: 1.2, intact: 1.4, senior: 1.1 } };
let feedPet: Pet = 'dog';
function paintFeed() {
  const p = (feed.elements.namedItem('fp') as RadioNodeList).value as Pet;
  if (p !== feedPet) { feedPet = p; const [mn, mx, st, df] = RANGE[p]; fw.min = String(mn); fw.max = String(mx); fw.step = String(st); fw.value = String(df); }
  const kg = Number(fw.value);
  const stage = $<HTMLSelectElement>('#fs').value;
  const shape = Number($<HTMLSelectElement>('#fc').value);
  $('[data-w-out]').textContent = `${kg.toFixed(kg % 1 ? 1 : 0)} kg`;
  let kcal: number, dry: number, wet: number;
  const fillEl = $('[data-bowl-fill]');
  if (p === 'rabbit') {
    dry = (stage === 'young' ? 40 : stage === 'senior' ? 20 : 25) * kg * (shape === 0.85 ? 0.8 : 1);
    kcal = dry * 2.3; wet = 0;
    $('[data-dry-l]').textContent = 'Pellets';
    $('[data-wet]').textContent = 'Unlimited hay + greens';
    $('[data-feed-note]').textContent = 'Rabbits should eat a pile of hay the size of their body every day. Pellets are just a small extra.';
  } else {
    const rer = 70 * kg ** 0.75;
    kcal = rer * MULT[p][stage] * shape;
    dry = kcal / (p === 'dog' ? 3.6 : 3.8);
    wet = kcal / (p === 'dog' ? 1.0 : 0.9);
    $('[data-dry-l]').textContent = 'Dry food';
    $('[data-wet]').textContent = `${Math.round(wet / 5) * 5} g`;
    $('[data-feed-note]').textContent = 'A starting point based on the standard energy formula. Adjust by looking at your pet’s waistline every fortnight, and ask us about a weight plan.';
  }
  $('[data-kcal]').textContent = String(Math.round(kcal / 5) * 5);
  $('[data-dry]').textContent = `${Math.round(dry / 5) * 5} g`;
  $('[data-treat]').textContent = p === 'rabbit' ? 'A slice of apple' : `${Math.round((kcal * 0.1) / 5) * 5} kcal`;
  const level = Math.min(1, dry / (p === 'dog' ? 450 : p === 'cat' ? 90 : 120));
  fillEl.style.setProperty('y', `${140 - level * 62}px`);
  $('[data-kibble]').innerHTML = Array.from({ length: Math.round(level * 34) }, (_, i) => `<circle cx="${(52 + ((i * 47) % 136)).toFixed(0)}" cy="${(132 - level * 62 + ((i * 29) % 14)).toFixed(0)}" r="4.2" fill="${['#a8682d', '#c68a4a', '#8d5522'][i % 3]}"/>`).join('');
}
feed.addEventListener('input', paintFeed);
feed.addEventListener('submit', (e) => e.preventDefault());
paintFeed();

/* ---------- Vet finder ---------- */
const vetChips = $('[data-vet-filter]');
vetChips.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  $$('button', vetChips).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  let n = 0;
  $$('[data-vet]').forEach((v) => { const ok = b.dataset.skill === 'all' || v.dataset.skills!.split(' ').includes(b.dataset.skill!); v.classList.toggle('is-dim', !ok); if (ok) n++; });
  $('[data-vets-none]').hidden = n > 0;
});
$$<HTMLAnchorElement>('[data-pick-vet]').forEach((a) => a.addEventListener('click', () => { $<HTMLSelectElement>('#b-vet').value = a.dataset.pickVet!; paintBook(); }));

/* ---------- Booking ---------- */
const VETNAME: Record<string, string> = { amara: 'Dr Osei', will: 'Dr Hartley', nina: 'Dr Kowalski', sam: 'Sam (nurse)' };
const st = { date: '', slot: '' };
const today = new Date(); today.setHours(0, 0, 0, 0);
const days = Array.from({ length: 10 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + 1); return d; });
const SLOTS = ['09:00', '09:40', '10:20', '11:00', '14:00', '14:40', '15:20', '16:00', '17:00', '18:00'];
const slotsFor = (d: Date) => (d.getDay() === 0 ? SLOTS.slice(0, 4) : d.getDay() === 6 ? SLOTS.slice(0, 7) : SLOTS);
function free(d: Date, s: string) { let h = 2166136261; for (const c of `${$<HTMLSelectElement>('#b-vet').value}|${iso(d)}|${s}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return ((h >>> 0) % 100) >= 30; }
const daysEl = $('[data-days]');
const slotsEl = $('[data-slots]');
const urgent = $<HTMLInputElement>('[data-urgent]');
function paintDays() { daysEl.innerHTML = days.map((d) => `<label class="vt-pick"><input type="radio" name="day" value="${iso(d)}" ${slotsFor(d).some((s) => free(d, s)) ? '' : 'disabled'} ${st.date === iso(d) ? 'checked' : ''}/><span><small>${d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></span></label>`).join(''); }
function paintSlots() {
  if (!st.date) { slotsEl.innerHTML = '<p class="text-sm" style="color:#5e6f66">Choose a day first.</p>'; return; }
  const d = new Date(st.date + 'T00:00');
  if (st.slot && !free(d, st.slot)) st.slot = '';
  slotsEl.innerHTML = slotsFor(d).map((s) => `<label class="vt-pick"><input type="radio" name="slot" value="${s}" ${free(d, s) ? '' : 'disabled'} ${st.slot === s ? 'checked' : ''}/><span style="padding-block:.8rem">${s}</span></label>`).join('');
}
function paintBook() {
  const sp = $<HTMLSelectElement>('#b-sp').value as Pet;
  const name = $<HTMLInputElement>('#b-pet').value.trim();
  $('[data-when]').hidden = urgent.checked;
  paintDays(); paintSlots();
  const av = $('[data-sum-av]');
  av.style.setProperty('--bg', BG[sp]);
  av.innerHTML = pet(sp, `Illustration of a ${sp}`);
  $('[data-sum-name]').textContent = name || 'Your pet';
  $('[data-sum-why]').textContent = $<HTMLSelectElement>('#b-why').value;
  $('[data-sum-vet]').textContent = VETNAME[$<HTMLSelectElement>('#b-vet').value] ?? 'First available';
  $('[data-sum-when]').textContent = urgent.checked ? 'Today, first emergency slot' : st.date && st.slot ? `${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${st.slot}` : 'Not chosen';
  $('[data-book-btn]').textContent = urgent.checked ? 'Hold an urgent slot' : 'Book appointment';
}
['#b-sp', '#b-why', '#b-vet'].forEach((s) => $(s).addEventListener('change', paintBook));
$('#b-pet').addEventListener('input', paintBook);
urgent.addEventListener('change', paintBook);
daysEl.addEventListener('change', (e) => { st.date = (e.target as HTMLInputElement).value; paintSlots(); paintBook(); });
slotsEl.addEventListener('change', (e) => { st.slot = (e.target as HTMLInputElement).value; paintBook(); });

const form = $<HTMLFormElement>('[data-book]');
const bookErr = $('[data-book-err]');
function valid(i: HTMLInputElement) {
  const v = i.value.trim();
  const ok = i.type === 'tel' ? v.replace(/\D/g, '').length >= 10 : v.length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]', form).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  bookErr.hidden = true;
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !valid(i));
  if (!urgent.checked && (!st.date || !st.slot)) { bookErr.textContent = !st.date ? 'Pick a day.' : 'Pick a time.'; bookErr.hidden = false; $<HTMLElement>(!st.date ? '[name="day"]:not(:disabled)' : '[name="slot"]:not(:disabled)').focus(); return; }
  if (bad.length) { bookErr.textContent = 'Please fix the highlighted fields.'; bookErr.hidden = false; bad[0].focus(); return; }
  const petName = $<HTMLInputElement>('#b-pet').value.trim();
  $('[data-done-pet]').textContent = petName;
  $('[data-done-text]').textContent = urgent.checked
    ? `We’re holding the next emergency slot for ${petName} and will call ${$<HTMLInputElement>('#b-phone').value.trim()} within a few minutes. If they get worse, call the 24/7 line straight away.`
    : `${petName} is booked in (${$<HTMLSelectElement>('#b-why').value.toLowerCase()}) on ${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} at ${st.slot}. Pop a few treats in your pocket!`;
  $('[data-ref]').textContent = 'PP-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-sum]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
$('[data-again]').addEventListener('click', () => {
  st.date = ''; st.slot = ''; form.reset();
  $$<HTMLInputElement>('[data-req]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  form.hidden = false; $('[data-sum]').hidden = false; $('[data-done]').hidden = true;
  paintBook();
});
paintBook();
