/**
 * Day 038 · Ember & Oak Coffee Roasters · interactions.
 * Roast dial · filterable beans with a working bag · brew guide with live timer · taste-quiz radar · subscription maths · open-now & wholesale.
 */
import { bean } from './art';

type Coffee = { id: string; name: string; origin: string; roast: number; price: number; notes: string[]; flavor: Record<'sweet' | 'acid' | 'body' | 'bitter' | 'fruit', number>; brews: string[] };
type Method = { id: string; name: string; ratio: number; temp: number; grind: string; dose: number; steps: [string, number, number][] };
type Roast = { name: string; notes: string; acid: number; body: number };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.eo');
const COFFEES: Coffee[] = JSON.parse(root.dataset.coffees!);
const METHODS: Method[] = JSON.parse(root.dataset.methods!);
const ROASTS: Roast[] = JSON.parse(root.dataset.roasts!);
const COLORS: string[] = JSON.parse(root.dataset.colors!);
const byId = (id: string) => COFFEES.find((c) => c.id === id)!;
const gbp = (n: number) => '£' + n.toFixed(2);
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Roast days ---------- */
(function roasted() {
  const d = new Date().getDay();
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const isRoast = d === 2 || d === 4;
  let next = 0; for (let i = 1; i < 8; i++) { const w = (d + i) % 7; if (w === 2 || w === 4) { next = i; break; } }
  $('[data-roasted]').textContent = isRoast ? '🔥 Roasting today: fresh bags go out this afternoon' : `🔥 Next roast: ${next === 1 ? 'tomorrow' : names[(d + next) % 7]}`;
})();

/* ---------- Roast dial ---------- */
const roast = $<HTMLInputElement>('#roast');
function paintRoast() {
  const r = Number(roast.value);
  const info = ROASTS[r - 1];
  $('[data-dial-art]').innerHTML = bean(COLORS[r - 1]).repeat(3);
  $('[data-roast-name]').textContent = info.name;
  $('[data-roast-notes]').textContent = info.notes;
  $('[data-m-acid]').style.setProperty('--w', `${info.acid * 20}%`);
  $('[data-m-body]').style.setProperty('--w', `${info.body * 20}%`);
  roast.setAttribute('aria-valuetext', info.name);
}
roast.addEventListener('input', paintRoast);
$('[data-roast-go]').addEventListener('click', () => { const r = Number(roast.value); setRoastFilter(r <= 2 ? 'light' : r === 3 ? 'medium' : 'dark'); });
paintRoast();

/* ---------- Beans & bag ---------- */
const group = (c: Coffee) => (c.roast <= 2 ? 'light' : c.roast === 3 ? 'medium' : 'dark');
let roastF = 'all';
const brewF = $<HTMLSelectElement>('[data-brew-filter]');
function setRoastFilter(r: string) {
  roastF = r;
  $$('[data-roast-filter] button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.r === r)));
  paintShop();
}
function paintShop() {
  let n = 0;
  COFFEES.forEach((c, i) => {
    const ok = (roastF === 'all' || group(c) === roastF) && (brewF.value === 'all' || c.brews.includes(brewF.value));
    const card = $(`[data-coffee="${c.id}"]`);
    card.hidden = !ok;
    if (ok) { n++; card.style.animationDelay = `${n * 50}ms`; }
    void i;
  });
  $('[data-count]').textContent = `${n} of ${COFFEES.length} coffees`;
  $('[data-empty]').hidden = n > 0;
}
$('[data-roast-filter]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button'); if (b) { setRoastFilter(b.dataset.r!); if (b.dataset.r !== 'all') document.getElementById('beans')!.scrollIntoView({ behavior: smooth }); } });
brewF.addEventListener('change', paintShop);
$$('[data-coffee]').forEach((card) => {
  const c = byId(card.dataset.coffee!);
  const size = $<HTMLSelectElement>('[data-size]', card);
  size.addEventListener('change', () => { $('[data-price]', card).textContent = gbp(c.price * Number(size.value)); });
  $('[data-add]', card).addEventListener('click', () => addToBag(c.id, size.value, $<HTMLSelectElement>('[data-grind]', card).value));
});
paintShop();

type Line = { id: string; size: string; grind: string; qty: number };
let lines: Line[] = [];
const drawer = $('[data-drawer]');
const panel = $('.eo-drawer__panel', drawer);
let opener: HTMLElement | null = null;
const lineTotal = (l: Line) => byId(l.id).price * Number(l.size) * l.qty;
function paintBag() {
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + lineTotal(l), 0);
  $('[data-bag-count]').textContent = String(count);
  $('[data-bag-open]').setAttribute('aria-label', `Your bag: ${count} item${count === 1 ? '' : 's'}`);
  $('[data-lines]').innerHTML = lines.map((l, i) => `<li class="eo-line"><b>${esc(byId(l.id).name)}</b><span>${gbp(lineTotal(l))}</span><small>${l.size === '1' ? '250 g' : '1 kg'} · ${esc(l.grind)} · ×${l.qty}</small><button type="button" data-rm="${i}">Remove</button></li>`).join('');
  $('[data-bag-empty]').hidden = lines.length > 0;
  const ship = total >= 25 ? 0 : 3.5;
  $('[data-ship]').textContent = !lines.length ? 'Free delivery over £25' : total >= 25 ? 'You’ve unlocked free delivery 🎉' : `Add ${gbp(25 - total)} more for free delivery`;
  $('[data-ship-bar]').style.setProperty('--w', `${Math.min(100, (total / 25) * 100)}%`);
  $('[data-bag-total]').textContent = gbp(total + (lines.length ? ship : 0));
  $<HTMLButtonElement>('[data-checkout]').disabled = !lines.length;
}
function addToBag(id: string, size: string, grind: string) {
  const ex = lines.find((l) => l.id === id && l.size === size && l.grind === grind);
  ex ? ex.qty++ : lines.push({ id, size, grind, qty: 1 });
  paintBag();
  $('[data-bag-open]').animate?.([{ scale: 1 }, { scale: 1.2 }, { scale: 1 }], { duration: 300 });
}
function openBag() { opener = document.activeElement as HTMLElement; drawer.hidden = false; panel.focus(); document.body.style.overflow = 'hidden'; }
function closeBag() { drawer.hidden = true; document.body.style.overflow = ''; opener?.focus(); }
$('[data-bag-open]').addEventListener('click', openBag);
$('[data-bag-close]').addEventListener('click', closeBag);
drawer.addEventListener('click', (e) => { if (e.target === drawer) closeBag(); });
drawer.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeBag(); return; }
  if (e.key !== 'Tab') return;
  const f = $$<HTMLElement>('button:not(:disabled)', panel);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
$('[data-lines]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-rm]'); if (b) { lines.splice(Number(b.dataset.rm), 1); paintBag(); } });
$('[data-checkout]').addEventListener('click', () => { $('[data-checkout-msg]').textContent = 'Thank you! This is a demo, so nothing was charged.'; lines = []; paintBag(); });
paintBag();

/* ---------- Brew guide ---------- */
const tabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-tabs]'));
const dose = $<HTMLInputElement>('#dose');
let mi = 0;
let elapsed = 0, timer = 0, running = false, lastStep = -1;
const total = () => { const s = METHODS[mi].steps; return s[s.length - 1][1] + s[s.length - 1][2]; };
function stepText(m: Method, i: number, d: number, water: number) {
  const base = m.steps[i][0];
  if (m.id === 'v60') return i === 1 ? `${base} (to ${Math.round(d * 2)} g)` : i === 2 ? `${base} (to ${Math.round(water * 0.6)} g)` : i === 3 ? `${base} (to ${Math.round(water)} g)` : base;
  if (m.id === 'aero' && i === 1) return `${base} (${Math.round(water)} g)`;
  if (m.id === 'fp' && i === 0) return `${base} (${Math.round(water)} g)`;
  if (m.id === 'esp' && i === 2) return `${base} (about ${Math.round(water)} g in the cup)`;
  return base;
}
function paintBrew() {
  const m = METHODS[mi];
  const d = Number(dose.value);
  const water = d * m.ratio;
  $('[data-dose-out]').textContent = `${d} g`;
  $('[data-water]').textContent = m.id === 'esp' ? `${Math.round(water)} g out` : `${Math.round(water)} ml`;
  $('[data-ratio]').textContent = `1:${m.ratio}`;
  $('[data-temp]').textContent = `${m.temp}°C`;
  $('[data-total-time]').textContent = mmss(total());
  $('[data-grind-note]').textContent = m.grind;
  $('[data-steps]').innerHTML = m.steps.map((s, i) => `<li data-i="${i}"><time>${mmss(s[1])}</time><span>${esc(stepText(m, i, d, water))}</span></li>`).join('');
  paintTimer();
}
function selectMethod(i: number, focus = false) {
  mi = i;
  tabs.forEach((t, j) => { t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; if (i === j && focus) t.focus(); });
  const m = METHODS[i];
  dose.min = m.id === 'esp' ? '14' : m.id === 'moka' ? '10' : '8'; dose.max = m.id === 'esp' ? '24' : m.id === 'moka' ? '30' : '60';
  dose.value = String(m.dose);
  resetTimer();
  paintBrew();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectMethod(i));
  t.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 } as Record<string, number>)[e.key];
    if (n === undefined) return;
    e.preventDefault(); selectMethod((n + tabs.length) % tabs.length, true);
  });
});
dose.addEventListener('input', paintBrew);

function paintTimer() {
  const m = METHODS[mi];
  const t = total();
  const idx = elapsed >= t ? m.steps.length : m.steps.reduce((acc, s, i) => (elapsed >= s[1] ? i : acc), -1);
  $('[data-clock]').textContent = mmss(elapsed);
  $('[data-ring]').setAttribute('stroke-dasharray', `${Math.min(100, (elapsed / t) * 100).toFixed(1)} 100`);
  $$('[data-steps] li').forEach((li, i) => { li.classList.toggle('is-now', running && i === idx); li.classList.toggle('is-done', (running || elapsed > 0) && i < idx); });
  const label = elapsed >= t ? 'Done. Enjoy your coffee!' : elapsed === 0 && !running ? 'Ready when you are' : idx >= 0 ? m.steps[idx][0] : 'Get ready';
  $('[data-now-step]').textContent = label;
  if (idx !== lastStep) { lastStep = idx; if (running || elapsed >= t) $('[data-timer-live]').textContent = label; }
}
function tick() {
  elapsed += 0.1;
  if (elapsed >= total()) { elapsed = total(); stopTimer(); }
  paintTimer();
}
function stopTimer() { clearInterval(timer); running = false; $('[data-start]').textContent = elapsed >= total() ? '↻ Again' : elapsed > 0 ? '▶ Resume' : '▶ Start'; }
function resetTimer() { clearInterval(timer); running = false; elapsed = 0; lastStep = -1; $('[data-start]').textContent = '▶ Start'; paintTimer(); }
$('[data-start]').addEventListener('click', () => {
  if (running) { stopTimer(); paintTimer(); return; }
  if (elapsed >= total()) elapsed = 0;
  running = true; lastStep = -2;
  $('[data-start]').textContent = '❚❚ Pause';
  timer = window.setInterval(tick, 100);
  paintTimer();
});
$('[data-reset]').addEventListener('click', resetTimer);
selectMethod(0);

/* ---------- Taste quiz ---------- */
const quiz = $<HTMLFormElement>('[data-quiz]');
const KEYS = ['sweet', 'acid', 'body', 'bitter', 'fruit'] as const;
const LABEL = { sweet: 'Sweet', acid: 'Acidity', body: 'Body', bitter: 'Bitter', fruit: 'Fruit' };
let matched: Coffee | null = null;
const MOOD: Record<string, Partial<Record<(typeof KEYS)[number], number>>> = { bright: { acid: 1, fruit: 1, sweet: 0.3 }, sweet: { sweet: 1.2, body: 0.5, acid: 0.3 }, bold: { bitter: 1, body: 1, sweet: 0.2 } };
const MILK: Record<string, Partial<Record<(typeof KEYS)[number], number>>> = { milk: { body: 0.6, bitter: 0.4, acid: -0.5 }, black: { sweet: 0.4, fruit: 0.3 } };
function radar(c: Coffee) {
  const pt = (i: number, r: number) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return [Math.cos(a) * r, Math.sin(a) * r]; };
  const ring = (k: number) => KEYS.map((_, i) => pt(i, k * 16).map((v) => v.toFixed(1)).join(',')).join(' ');
  const shape = KEYS.map((k, i) => pt(i, (c.flavor[k] / 5) * 80).map((v) => v.toFixed(1)).join(',')).join(' ');
  $('[data-radar]').innerHTML = `${[1, 2, 3, 4, 5].map((k) => `<polygon points="${ring(k)}" fill="none" stroke="rgb(255 255 255 / .14)"/>`).join('')}${KEYS.map((_, i) => `<line x1="0" y1="0" x2="${pt(i, 80)[0].toFixed(1)}" y2="${pt(i, 80)[1].toFixed(1)}" stroke="rgb(255 255 255 / .14)"/>`).join('')}<polygon class="shape" points="${shape}" fill="rgb(217 98 43 / .45)" stroke="#d9622b" stroke-width="2.5" stroke-linejoin="round"/>${KEYS.map((k, i) => { const [x, y] = pt(i, 94); return `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" text-anchor="middle">${LABEL[k]}</text>`; }).join('')}`;
}
function paintQuiz() {
  const a = ['q1', 'q2', 'q3'].map((n) => (quiz.elements.namedItem(n) as RadioNodeList).value);
  const done = a.every(Boolean);
  $('[data-match-idle]').hidden = done;
  $('[data-match-body]').hidden = !done;
  if (!done) return;
  const [brew, mood, milk] = a;
  const weights = { ...MOOD[mood] } as Record<string, number>;
  Object.entries(MILK[milk]).forEach(([k, v]) => (weights[k] = (weights[k] ?? 0) + (v ?? 0)));
  const score = (c: Coffee) => KEYS.reduce((s, k) => s + (weights[k] ?? 0) * c.flavor[k], 0) + (brew === 'any' ? 0 : c.brews.includes(brew) ? 3 : -3);
  matched = [...COFFEES].sort((x, y) => score(y) - score(x))[0];
  $('[data-match-name]').textContent = matched.name;
  $('[data-match-why]').textContent = `${matched.origin}, ${matched.notes.join(', ').toLowerCase()}. ${mood === 'bright' ? 'Bright and juicy' : mood === 'sweet' ? 'Sweet and rounded' : 'Bold and full-bodied'}, and it ${brew === 'any' ? 'works in any brewer' : `loves ${brew === 'espresso' ? 'the espresso machine' : 'filter brewing'}`}${milk === 'milk' ? ', with plenty of character to cut through milk' : ''}.`;
  radar(matched);
}
quiz.addEventListener('change', paintQuiz);
quiz.addEventListener('submit', (e) => e.preventDefault());
$('[data-match-add]').addEventListener('click', () => { if (matched) { addToBag(matched.id, '1', 'Whole bean'); openBag(); } });

/* ---------- Subscription ---------- */
const sub = $<HTMLFormElement>('[data-sub]');
const skipped = new Set<number>();
function paintSub() {
  const c = byId($<HTMLSelectElement>('#s-coffee').value);
  const f = Number($<HTMLSelectElement>('#s-size').value);
  const freq = Number((sub.elements.namedItem('freq') as RadioNodeList).value);
  const full = c.price * f, price = full * 0.9;
  $('[data-s-price]').textContent = gbp(price);
  $('[data-s-was]').textContent = `Usually ${gbp(full)}, plus delivery under £25`;
  const per = 365 / freq;
  $('[data-s-save]').textContent = `You save about ${gbp((full - price) * per + 3.5 * per)} a year (10% off + free delivery).`;
  const d = new Date(); do { d.setDate(d.getDate() + 1); } while (d.getDay() !== 2 && d.getDay() !== 4);
  $('[data-deliv]').innerHTML = Array.from({ length: 4 }, (_, i) => { const x = new Date(d); x.setDate(x.getDate() + i * freq); const sk = skipped.has(i); return `<li class="${sk ? 'is-skipped' : ''}"><span>${x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span><span>${sk ? 'Skipped' : gbp(price)}</span><button type="button" data-skip="${i}" aria-pressed="${sk}">${sk ? 'Undo' : 'Skip'}</button></li>`; }).join('');
}
sub.addEventListener('input', paintSub);
$('[data-deliv]').addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-skip]'); if (!b) return; const i = Number(b.dataset.skip); skipped.has(i) ? skipped.delete(i) : skipped.add(i); paintSub(); });
sub.addEventListener('submit', (e) => {
  e.preventDefault();
  const c = byId($<HTMLSelectElement>('#s-coffee').value);
  $('[data-sub-msg]').textContent = `Subscribed: ${c.name}, ${$<HTMLSelectElement>('#s-size').selectedOptions[0].text}, ${$<HTMLSelectElement>('#s-grind').value.toLowerCase()}. First bag roasted for you next roast day. (Demo: nothing was charged.)`;
});
paintSub();

/* ---------- Visit ---------- */
const HOURS: Record<number, [number, number]> = {};
$$('.eo-hours tr').forEach((tr) => {
  const m = $('td', tr).textContent!.match(/(\d+):(\d+)\s*–\s*(\d+):(\d+)/)!;
  HOURS[Number(tr.dataset.day)] = [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])];
});
(function paintOpen() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const h = HOURS[now.getDay()];
  $$('.eo-hours tr').forEach((tr) => tr.classList.toggle('is-today', Number(tr.dataset.day) === now.getDay()));
  const open = mins >= h[0] && mins < h[1];
  $('[data-dot]').classList.toggle('is-closed', !open);
  const t = (m: number) => { const hh = Math.floor(m / 60); return `${hh > 12 ? hh - 12 : hh}${m % 60 ? ':' + String(m % 60).padStart(2, '0') : ''} ${hh >= 12 ? 'pm' : 'am'}`; };
  $('[data-open]').textContent = open ? `Open now, closes ${t(h[1])}` : mins < h[0] ? `Closed, opens today at ${t(h[0])}` : 'Closed, opens tomorrow';
})();
const cups = $<HTMLInputElement>('#w-cups');
const paintCups = () => { $('[data-cups-out]').textContent = cups.value; $('[data-kg-out]').textContent = `${((Number(cups.value) * 7 * 18) / 1000).toFixed(1)} kg`; };
cups.addEventListener('input', paintCups); paintCups();
const wf = $<HTMLFormElement>('[data-wholesale]');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function valid(i: HTMLInputElement) { const ok = i.type === 'email' ? EMAIL.test(i.value.trim()) : i.value.trim().length > 1; i.setAttribute('aria-invalid', String(!ok)); $(`#${i.id}-e`).hidden = ok; return ok; }
$$<HTMLInputElement>('[data-req]', wf).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
wf.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-req]', wf).filter((i) => !valid(i));
  if (bad.length) { $('[data-w-ok]').textContent = ''; bad[0].focus(); return; }
  $('[data-w-ok]').textContent = `Thanks ${$<HTMLInputElement>('#w-name').value.trim().split(/\s+/)[0]}! A tasting box for ${$<HTMLInputElement>('#w-biz').value.trim()} will be on its way, and we’ll call to talk through about ${$('[data-kg-out]').textContent} a week. (Demo: nothing was sent.)`;
});
