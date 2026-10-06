/**
 * Day 021 · Sol y Sal · interactions.
 * The page is fully readable without JS; everything here is an enhancement.
 */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const root = $('.sys');

/* ---------- Header: solid on scroll, mobile drawer, current section ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 12);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const burger = $<HTMLButtonElement>('[data-burger]');
const drawer = $('[data-drawer]');
function setDrawer(open: boolean, focusBurger = false) {
  drawer.hidden = !open;
  burger.setAttribute('aria-expanded', String(open));
  if (open) $<HTMLAnchorElement>('a', drawer).focus();
  else if (focusBurger) burger.focus();
}
burger.addEventListener('click', () => setDrawer(drawer.hidden));
drawer.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) setDrawer(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) setDrawer(false, true); });
matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setDrawer(false); });

const navLinks = $$<HTMLAnchorElement>('.sys-navlink');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    navLinks.forEach((a) => a.toggleAttribute('aria-current', a.hash === `#${en.target.id}`));
    navLinks.forEach((a) => { if (a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'true'); });
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['menu', 'story', 'experiences', 'reviews', 'visit'].forEach((id) => { const el = document.getElementById(id); if (el) spy.observe(el); });

/* ---------- Opening hours: live “open now” in London time ---------- */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const rows = $$<HTMLTableRowElement>('.sys-hours tr');
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
function londonNow() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', weekday: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  return { day: parts.weekday as string, min: Number(parts.hour) * 60 + Number(parts.minute) };
}
function updateHours() {
  const { day, min } = londonNow();
  rows.forEach((r) => r.classList.toggle('is-today', r.dataset.day === day));
  const today = rows.find((r) => r.dataset.day === day)!;
  const open = today.dataset.open ? toMin(today.dataset.open) : null;
  const close = today.dataset.close ? toMin(today.dataset.close) : null;
  const isOpen = open !== null && close !== null && min >= open && min < close;
  let text: string;
  if (isOpen) text = `Open now · until ${today.dataset.close === '24:00' ? 'midnight' : today.dataset.close}`;
  else if (open !== null && min < open) text = `Closed · opens today at ${today.dataset.open}`;
  else {
    let i = DAYS.indexOf(day);
    let next: HTMLTableRowElement | undefined;
    for (let k = 1; k <= 7 && !next; k++) { const r = rows.find((x) => x.dataset.day === DAYS[(i + k) % 7]); if (r?.dataset.open) next = r; }
    text = `Closed · opens ${next!.dataset.day} ${next!.dataset.open}`;
  }
  $('[data-open-text]').textContent = text;
  $('[data-open-pill]').classList.toggle('is-open', isOpen);
  $('[data-open-line]').textContent = `${isOpen ? '🟢' : '🔴'} ${text} (London time)`;
}
updateHours();
setInterval(updateHours, 60_000);

/* ---------- Marquee pause (WCAG 2.2.2) ---------- */
const marquee = $('[data-marquee]');
$('[data-marquee-pause]').addEventListener('click', (e) => {
  const btn = e.currentTarget as HTMLButtonElement;
  const paused = marquee.classList.toggle('is-paused');
  btn.setAttribute('aria-pressed', String(paused));
  btn.innerHTML = `<span class="sr-only">${paused ? 'Play' : 'Pause'} scrolling text</span><span aria-hidden="true">${paused ? '▶' : '❚❚'}</span>`;
});

/* ---------- Count-ups (show the real number first, animate once in view) ---------- */
const counted = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  counted.unobserve(en.target);
  if (reduced.matches) return;
  const el = en.target as HTMLElement;
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? '';
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / 1400);
    el.textContent = `${Math.round(target * (1 - (1 - p) ** 3))}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  setTimeout(() => { el.textContent = `${target}${suffix}`; }, 1600);
}), { threshold: 0.6 });
$$('[data-count]').forEach((el) => counted.observe(el));

/* ---------- Reveal on scroll ---------- */
if (!reduced.matches) {
  const targets = $$('.sys-h2, .sys-dish, .sys-fact, .sys-exp__card, .sys-collage, .sys-book, .sys-info, .sys-carousel');
  targets.forEach((el) => el.setAttribute('data-reveal', ''));
  root.classList.add('js-reveal');
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  targets.forEach((el) => io.observe(el));
}

/* ---------- Menu: tabs + dietary filters ---------- */
const tabs = $$<HTMLButtonElement>('[data-menu-tabs] [role="tab"]');
const panel = $('[data-menu-panel]');
const dishes = $$('[data-dish]');
const chips = $$<HTMLButtonElement>('[data-diet] button');
const count = $('[data-menu-count]');
const empty = $('[data-menu-empty]');
let cat = 'tacos';

function renderMenu() {
  const need = chips.filter((c) => c.dataset.tag && c.getAttribute('aria-pressed') === 'true').map((c) => c.dataset.tag!);
  const mild = $('[data-mild]').getAttribute('aria-pressed') === 'true';
  let shown = 0;
  dishes.forEach((d) => {
    const tags = (d.dataset.tags ?? '').split(' ');
    const ok = d.dataset.cat === cat && need.every((t) => tags.includes(t)) && (!mild || d.dataset.heat === '0');
    d.hidden = !ok;
    if (ok) shown++;
  });
  empty.hidden = shown > 0;
  const label = tabs.find((t) => t.dataset.cat === cat)!.textContent;
  count.textContent = `${shown} ${shown === 1 ? 'dish' : 'dishes'} in ${label}${need.length || mild ? ' matching your filters' : ''}.`;
}
function selectTab(t: HTMLButtonElement, focus = true) {
  tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; });
  cat = t.dataset.cat!;
  panel.setAttribute('aria-labelledby', t.id);
  renderMenu();
  if (focus) t.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 } as Record<string, number>)[e.key];
    if (n === undefined) return;
    e.preventDefault();
    selectTab(tabs[(n + tabs.length) % tabs.length]);
  });
});
chips.forEach((c) => c.addEventListener('click', () => { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); renderMenu(); }));
$('[data-clear-diet]').addEventListener('click', () => { chips.forEach((c) => c.setAttribute('aria-pressed', 'false')); renderMenu(); chips[0].focus(); });

/* ---------- Experiences: gentle 3D tilt ---------- */
$$('[data-tilt]').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    if (reduced.matches || e.pointerType !== 'mouse') return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--tx', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
    card.style.setProperty('--ty', `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
  });
  card.addEventListener('pointerleave', () => { card.style.removeProperty('--tx'); card.style.removeProperty('--ty'); });
});

/* ---------- Reviews carousel (auto-advances, pauses on hover/focus/off-screen) ---------- */
const carousel = $('[data-carousel]');
const slides = $$('[data-slide]', carousel);
const dots = $$<HTMLButtonElement>('[data-go]', carousel);
let index = 0;
function show(i: number) {
  index = (i + slides.length) % slides.length;
  slides.forEach((s, n) => { s.hidden = n !== index; });
  dots.forEach((d, n) => d.setAttribute('aria-current', String(n === index)));
}
$('[data-prev]', carousel).addEventListener('click', () => show(index - 1));
$('[data-next]', carousel).addEventListener('click', () => show(index + 1));
dots.forEach((d) => d.addEventListener('click', () => show(Number(d.dataset.go))));
let hover = false;
let visible = false;
carousel.addEventListener('pointerenter', () => { hover = true; });
carousel.addEventListener('pointerleave', () => { hover = false; });
carousel.addEventListener('focusin', () => { hover = true; });
carousel.addEventListener('focusout', () => { hover = false; });
new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(carousel);
setInterval(() => { if (visible && !hover && !reduced.matches && !document.hidden) show(index + 1); }, 7000);

/* ---------- Booking ---------- */
const form = $<HTMLFormElement>('[data-book]');
const daysEl = $('[data-days]');
const slotsEl = $('[data-slots]');
const slotHint = $('[data-slot-hint]');
const summary = $('[data-book-summary]');
const errorEl = $('[data-book-error]');
const done = $('[data-book-done]');
const guestsOut = $('[data-guests-out]');
const guestsNote = $('[data-guests-note]');
const MAX_GUESTS = 8;
let guests = 2;

const HOURS: Record<number, [string, string] | null> = { 0: ['12:00', '22:00'], 1: null, 2: ['17:00', '23:00'], 3: ['17:00', '23:00'], 4: ['17:00', '23:00'], 5: ['12:00', '24:00'], 6: ['12:00', '24:00'] };
const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const longFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const today = new Date(); today.setHours(0, 0, 0, 0);
const days = Array.from({ length: 14 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i));
const seeded = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

daysEl.innerHTML = days.map((d, i) => {
  const closed = !HOURS[d.getDay()];
  return `<label><input type="radio" name="day" value="${i}" ${closed ? 'disabled' : ''}><span><small>${i === 0 ? 'Today' : dayFmt.format(d)}</small><b>${d.getDate()}</b><span class="sr-only">${longFmt.format(d)}${closed ? ', closed' : ''}</span></span></label>`;
}).join('');

function slotsFor(i: number) {
  const d = days[i];
  const h = HOURS[d.getDay()];
  if (!h) return [];
  const rand = seeded(d.getDate() * 97 + d.getMonth() * 13 + 7);
  const out: { t: string; taken: boolean }[] = [];
  const now = new Date();
  for (let m = toMin(h[0]); m <= toMin(h[1]) - 90; m += 30) {
    const t = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const past = i === 0 && m <= now.getHours() * 60 + now.getMinutes() + 30;
    out.push({ t, taken: past || rand() < 0.3 });
  }
  return out;
}

function renderSlots() {
  const i = Number(($<HTMLInputElement>('[name="day"]:checked', form))?.value ?? -1);
  const list = i >= 0 ? slotsFor(i) : [];
  const free = list.filter((s) => !s.taken).length;
  slotHint.textContent = i >= 0 ? `(${free} free)` : '';
  slotsEl.innerHTML = list.length
    ? list.map((s) => `<label><input type="radio" name="time" value="${s.t}" ${s.taken ? 'disabled' : ''}><span>${s.t}${s.taken ? '<span class="sr-only"> (fully booked)</span>' : ''}</span></label>`).join('')
    : '<p class="col-span-full text-(--ink-soft)">Choose a day first.</p>';
  if (i >= 0 && !free) slotsEl.insertAdjacentHTML('beforeend', '<p class="col-span-full font-semibold text-(--pink)">Fully booked. Try another day or walk in: we keep the bar for walk-ins.</p>');
  updateSummary();
}

function updateSummary() {
  const i = ($<HTMLInputElement>('[name="day"]:checked', form))?.value;
  const t = ($<HTMLInputElement>('[name="time"]:checked', form))?.value;
  summary.textContent = i && t ? `${longFmt.format(days[Number(i)])} · ${t} · ${guests} ${guests === 1 ? 'guest' : 'guests'}` : '';
}

form.addEventListener('change', (e) => {
  const t = e.target as HTMLInputElement;
  if (t.name === 'day') renderSlots();
  else updateSummary();
  errorEl.textContent = '';
});

function setGuests(n: number) {
  guests = Math.max(1, Math.min(MAX_GUESTS, n));
  guestsOut.textContent = String(guests);
  ($<HTMLButtonElement>('[data-guests="-1"]', form)).disabled = guests <= 1;
  guestsNote.textContent = n > MAX_GUESTS ? 'For 9 or more guests, ask about our private cantina upstairs.' : '';
  updateSummary();
}
$$<HTMLButtonElement>('[data-guests]', form).forEach((b) => b.addEventListener('click', () => setGuests(guests + Number(b.dataset.guests))));

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function checkField(input: HTMLInputElement) {
  const ok = input.type === 'email' ? EMAIL.test(input.value.trim()) : input.value.trim().length > 1;
  input.setAttribute('aria-invalid', String(!ok));
  (document.getElementById(input.getAttribute('aria-describedby')!) as HTMLElement).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-field]', form).forEach((f) => f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') checkField(f); }));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const time = $<HTMLInputElement>('[name="time"]:checked', form);
  const fields = $$<HTMLInputElement>('[data-field]', form);
  const bad = fields.filter((f) => !checkField(f));
  if (!time) { errorEl.textContent = 'Please choose a time.'; slotsEl.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus(); return; }
  if (bad.length) { errorEl.textContent = 'Please check the highlighted fields.'; bad[0].focus(); return; }
  const btn = $<HTMLButtonElement>('[data-book-btn]', form);
  btn.disabled = true;
  btn.textContent = 'Booking…';
  setTimeout(() => {
    const ref = `SYS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const occasion = ($<HTMLSelectElement>('[data-occasion]', form)).value;
    $('[data-done-text]').textContent = `${fields[0].value.trim().split(' ')[0]}, your table for ${guests} is booked for ${summary.textContent?.split(' · ').slice(0, 2).join(' at ')}. Reference ${ref}.${occasion.startsWith('Birthday') ? ' We’ll have a candle ready 🎂' : ''}`;
    form.hidden = true;
    done.hidden = false;
    done.focus();
    btn.disabled = false;
    btn.textContent = 'Confirm booking';
  }, 900);
});
$('[data-book-again]').addEventListener('click', () => {
  form.reset();
  setGuests(2);
  done.hidden = true;
  form.hidden = false;
  selectFirstDay();
  ($<HTMLInputElement>('[name="day"]:checked', form)).focus();
});

function selectFirstDay() {
  const first = days.findIndex((_, i) => HOURS[days[i].getDay()] && slotsFor(i).some((s) => !s.taken));
  const input = $<HTMLInputElement>(`[name="day"][value="${first}"]`, form);
  if (input) input.checked = true;
  renderSlots();
}
selectFirstDay();
setGuests(2);

/* ---------- Newsletter ---------- */
const news = $<HTMLFormElement>('[data-news]');
news.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $<HTMLInputElement>('input', news);
  const ok = EMAIL.test(input.value.trim());
  input.setAttribute('aria-invalid', String(!ok));
  $('[data-news-msg]').textContent = ok ? '¡Gracias! You’re on the list (demo, so nothing was sent).' : 'Please enter a valid email address.';
  if (ok) input.value = '';
});
