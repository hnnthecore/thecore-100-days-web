/**
 * Day 030 · Rival Athletic Club · interactions.
 * Live busyness meter · bookable class timetable · membership pricing · week builder · 30-day leaderboard · free pass form.
 */
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.rv');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const CLUBS: string[] = JSON.parse(root.dataset.clubs!);
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const store = {
  get<T>(k: string, d: T): T { try { return JSON.parse(localStorage.getItem(k) ?? '') as T; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Live busyness ---------- */
const OFFSET = [0, 6, -9];
const hourLabel = (h: number) => (h === 12 ? '12 pm' : h > 12 ? `${h - 12} pm` : `${h} am`);
function busy(h: number, club: number) {
  const g = (c: number, w: number, a: number) => a * Math.exp(-(((h - c) / w) ** 2));
  const v = 14 + g(7, 1.3, 42) + g(12.8, 1.1, 34) + g(18, 1.9, 62) + OFFSET[club];
  return Math.max(6, Math.min(97, Math.round(v)));
}
let club = 0;
const clubBtns = $('[data-clubs-btn]');
clubBtns.innerHTML = CLUBS.map((c, i) => `<button type="button" aria-pressed="${i === 0}" data-i="${i}">${esc(c.split(' ')[0])}</button>`).join('');
function paintLive() {
  const d = new Date();
  const h = d.getHours() + d.getMinutes() / 60;
  const open = h >= 5 && h < 23;
  const pct = open ? Math.max(4, Math.min(99, busy(h, club) + Math.round(Math.sin(d.getTime() / 90000) * 3))) : 0;
  $('[data-live-pct]').textContent = String(pct);
  const bar = $('[data-live-bar]');
  bar.style.setProperty('--w', pct + '%');
  $('[data-live-text]').textContent = !open ? `${CLUBS[club]} is closed. Opens at 5 am.` : `${CLUBS[club]}: ${pct < 35 ? 'quiet, plenty of space' : pct < 65 ? 'moderate, all kit available' : 'busy, expect a wait on racks'}.`;
  let best = -1, bestV = 101;
  for (let t = Math.max(5, Math.ceil(h)); t < 22; t++) { const v = busy(t, club); if (v < bestV) { bestV = v; best = t; } }
  $('[data-live-tip]').textContent = !open ? '' : best < 0 ? 'Last hour of the day: quietest it gets.' : `Quietest time left today: ${hourLabel(best)} (about ${bestV}% full).`;
}
clubBtns.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  club = Number(b.dataset.i);
  $$('button', clubBtns).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  paintLive();
});
paintLive();
setInterval(paintLive, 30000);

/* ---------- Timetable ---------- */
type Tpl = { t: string; v: [string, string, string, number, number][] }; // time, variants [name, type, coach, mins, cap]
const WEEKDAY: Tpl[] = [
  { t: '06:30', v: [['Rise HIIT', 'hiit', 'Kai', 45, 24], ['Early Cycle', 'cycle', 'Dee', 45, 28], ['Boxing Bootcamp', 'boxing', 'Ray', 45, 20]] },
  { t: '09:15', v: [['Power Yoga', 'yoga', 'Mira', 60, 20], ['Lift Lab', 'strength', 'Jo', 60, 14], ['Flow & Stretch', 'yoga', 'Mira', 45, 22]] },
  { t: '12:15', v: [['Lunchtime Strength', 'strength', 'Jo', 45, 16], ['Express HIIT', 'hiit', 'Kai', 30, 24], ['Cycle 30', 'cycle', 'Dee', 30, 28]] },
  { t: '17:30', v: [['Cycle Rush', 'cycle', 'Dee', 45, 30], ['Metcon', 'hiit', 'Kai', 45, 24], ['Boxing Fundamentals', 'boxing', 'Ray', 60, 18]] },
  { t: '18:30', v: [['Boxing Fundamentals', 'boxing', 'Ray', 60, 18], ['Heavy Hour', 'strength', 'Jo', 60, 14], ['Power Yoga', 'yoga', 'Mira', 60, 20]] },
  { t: '19:30', v: [['Heavy Hour', 'strength', 'Jo', 60, 14], ['Sweat Circuit', 'hiit', 'Kai', 45, 24], ['Yin & Restore', 'yoga', 'Mira', 60, 20]] },
];
const WEEKEND: Tpl[] = ['09:00', '10:15', '11:30', '12:45', '14:00', '16:00'].map((t, i) => ({ t, v: [WEEKDAY[i].v[1], WEEKDAY[(i + 2) % 6].v[0], WEEKDAY[(i + 1) % 6].v[2]] }));

const today = new Date(); today.setHours(0, 0, 0, 0);
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i); return d; });
let dayIdx = 0, typeFilter = 'all';
const booked = new Set<string>(store.get<string[]>('rival-bookings', []).filter((id) => id >= iso(today)));
const persistBookings = () => store.set('rival-bookings', [...booked]);

type Cls = { id: string; time: string; name: string; type: string; coach: string; mins: number; cap: number; seeded: number; club: string; started: boolean };
function classesFor(d: Date): Cls[] {
  const wd = d.getDay();
  const tpls = wd === 0 || wd === 6 ? WEEKEND : WEEKDAY;
  return tpls.map((tp, i) => {
    const [name, type, coach, mins, cap] = tp.v[(wd + i) % tp.v.length];
    let h = 2166136261;
    for (const c of `${iso(d)}|${i}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    const frac = ((h >>> 0) % 1000) / 1000;
    const [hh, mm] = tp.t.split(':').map(Number);
    const start = new Date(d); start.setHours(hh, mm, 0, 0);
    return { id: `${iso(d)}-${i}`, time: tp.t, name, type, coach, mins, cap, seeded: Math.min(cap, Math.floor(cap * (0.35 + frac * 0.7))), club: CLUBS[(i + wd) % CLUBS.length], started: start.getTime() < Date.now() };
  });
}
const allClasses = () => days.flatMap((d) => classesFor(d));
const daysEl = $('[data-days]');
daysEl.innerHTML = days.map((d, i) => `<button type="button" data-d="${i}" aria-pressed="${i === 0}"><small>${i === 0 ? 'Today' : DOW[d.getDay()]}</small><b>${d.getDate()}</b></button>`).join('');
const listEl = $('[data-classes]');
const msgEl = $('[data-mybook]');

function renderClasses() {
  const list = classesFor(days[dayIdx]).filter((c) => typeFilter === 'all' || c.type === typeFilter);
  listEl.innerHTML = list.length ? list.map((c, i) => {
    const mine = booked.has(c.id);
    const taken = c.seeded + (mine && c.seeded < c.cap ? 1 : 0);
    const left = c.cap - taken;
    const full = left <= 0;
    const label = c.started ? 'Started' : mine ? (full ? 'On waitlist ✓' : 'Booked ✓') : full ? 'Join waitlist' : 'Book';
    return `<li class="rv-class${left > 0 && left <= 3 ? ' is-low' : ''}${c.started ? ' is-past' : ''}" style="animation-delay:${i * 50}ms">
      <p class="rv-class__time">${c.time}</p>
      <div><p class="rv-class__name">${esc(c.name)}</p><p class="rv-class__meta">${esc(c.coach)} · ${c.mins} min · ${esc(c.club)}</p></div>
      <p class="rv-class__spots">${full ? 'Full' : left <= 3 ? `Only ${left} left` : `${left} spots left`}<i style="--fill:${Math.round((taken / c.cap) * 100)}%"></i></p>
      <button type="button" class="rv-class__btn" data-book="${c.id}" aria-pressed="${mine}" ${c.started ? 'disabled' : ''} aria-label="${label}: ${esc(c.name)} at ${c.time}">${label}</button>
    </li>`;
  }).join('') : '<li class="rv-class" style="grid-template-columns:1fr"><p class="rv-class__name">No classes of this type on this day. Try another filter.</p></li>';
}
function paintMine(announce = '') {
  const mine = allClasses().filter((c) => booked.has(c.id));
  const bits = mine.slice(0, 3).map((c) => `${c.name} (${DOW[new Date(c.id.slice(0, 10) + 'T00:00').getDay()]} ${c.time})`);
  msgEl.textContent = announce || (mine.length ? `You have ${mine.length} booking${mine.length > 1 ? 's' : ''}: ${bits.join(', ')}${mine.length > 3 ? '…' : ''}.` : 'Tap Book on any class. Bookings are free to cancel up to 2 hours before.');
}
daysEl.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
  if (!b) return;
  dayIdx = Number(b.dataset.d);
  $$('button', daysEl).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderClasses();
});
$$<HTMLButtonElement>('[data-type]').forEach((b) => b.addEventListener('click', () => {
  typeFilter = b.dataset.type!;
  $$('[data-type]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderClasses();
}));
listEl.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-book]');
  if (!b) return;
  const id = b.dataset.book!;
  const c = allClasses().find((x) => x.id === id)!;
  const was = booked.has(id);
  was ? booked.delete(id) : booked.add(id);
  persistBookings();
  renderClasses();
  paintMine(`${was ? 'Cancelled' : c.seeded >= c.cap ? 'Added to the waitlist for' : 'Booked'} ${c.name} at ${c.time}.`);
  $<HTMLButtonElement>(`[data-book="${id}"]`)?.focus();
});
renderClasses();
paintMine();

/* ---------- Plans ---------- */
const annual = $<HTMLInputElement>('[data-annual]');
const plansEl = $('[data-plans]');
function paintPlans() {
  $$<HTMLElement>('[data-price]').forEach((b) => {
    const p = Number(b.dataset.price);
    b.textContent = '£' + (annual.checked ? ((p * 10) / 12).toFixed(p * 10 % 12 ? 2 : 0) : p);
  });
  $$('[data-per]').forEach((s) => (s.textContent = '/month'));
  const sel = $<HTMLInputElement>('input[name="plan"]:checked', plansEl);
  const card = sel.closest('label')!;
  const name = $('.rv-plan__name', card).textContent!;
  const p = Number($('[data-price]', card).dataset.price);
  $('[data-plan-sum]').textContent = annual.checked
    ? `${name}: £${p * 10} billed once a year (that’s two months free). No joining fee. 30-day money-back guarantee.`
    : `${name}: £${p} a month plus a £20 joining fee. Cancel any time with 30 days’ notice.`;
}
plansEl.addEventListener('change', paintPlans);
annual.addEventListener('change', paintPlans);
paintPlans();

/* ---------- Week builder ---------- */
type Lift = [string, 'c' | 'a'];
const SESSIONS: Record<string, { title: string; lifts: Lift[] }> = {
  push: { title: 'Push', lifts: [['Bench press', 'c'], ['Overhead press', 'c'], ['Incline dumbbell press', 'a'], ['Triceps pushdown', 'a'], ['Lateral raise', 'a']] },
  pull: { title: 'Pull', lifts: [['Barbell row', 'c'], ['Pull-up', 'c'], ['Seated cable row', 'a'], ['Face pull', 'a'], ['Biceps curl', 'a']] },
  legs: { title: 'Legs', lifts: [['Back squat', 'c'], ['Romanian deadlift', 'c'], ['Walking lunge', 'a'], ['Leg press', 'a'], ['Calf raise', 'a']] },
  upper: { title: 'Upper body', lifts: [['Bench press', 'c'], ['Barbell row', 'c'], ['Overhead press', 'a'], ['Lat pulldown', 'a'], ['Biceps curl', 'a']] },
  lower: { title: 'Lower body', lifts: [['Back squat', 'c'], ['Hip thrust', 'c'], ['Romanian deadlift', 'a'], ['Split squat', 'a'], ['Plank', 'a']] },
  fullA: { title: 'Full body A', lifts: [['Back squat', 'c'], ['Bench press', 'c'], ['Barbell row', 'a'], ['Walking lunge', 'a'], ['Plank', 'a']] },
  fullB: { title: 'Full body B', lifts: [['Deadlift', 'c'], ['Overhead press', 'c'], ['Lat pulldown', 'a'], ['Hip thrust', 'a'], ['Farmer’s carry', 'a']] },
  cond: { title: 'Conditioning', lifts: [['Bike intervals', 'a'], ['Rower 500 m reps', 'a'], ['Sled push', 'a'], ['Burpees', 'a'], ['Dead bug', 'a']] },
};
const SPLIT: Record<number, string[]> = { 2: ['fullA', 'fullB'], 3: ['push', 'pull', 'legs'], 4: ['upper', 'lower', 'upper', 'lower'], 5: ['push', 'pull', 'legs', 'upper', 'cond'], 6: ['push', 'pull', 'legs', 'push', 'pull', 'legs'] };
const SLOTS: Record<number, number[]> = { 2: [1, 4], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 4, 5], 6: [0, 1, 2, 3, 4, 5] }; // Mon = 0
const DAYNAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const GOALS: Record<string, { name: string; c: [number, string]; a: [number, string] }> = {
  strength: { name: 'Get stronger', c: [5, '5'], a: [3, '8'] },
  muscle: { name: 'Build muscle', c: [4, '8–10'], a: [3, '10–12'] },
  fat: { name: 'Lose fat', c: [3, '12'], a: [3, '15'] },
  endurance: { name: 'More energy', c: [3, '15'], a: [3, '20'] },
};
const LEVELS: Record<string, [string, number]> = { new: ['new to training', -1], some: ['some experience', 0], pro: ['experienced', 1] };
const builder = $<HTMLFormElement>('[data-builder]');
const weekEl = $('[data-week]');
let planText = '';
const get = (n: string) => (builder.elements.namedItem(n) as RadioNodeList).value;

function buildWeek() {
  const goal = GOALS[get('goal')];
  const n = Number(get('days'));
  const [levelName, delta] = LEVELS[get('level')];
  const split = SPLIT[n];
  const slots = SLOTS[n];
  const lines: string[] = [];
  weekEl.innerHTML = DAYNAMES.map((dn, i) => {
    const k = slots.indexOf(i);
    if (k < 0) return `<li class="rv-day rv-day--rest"><p class="rv-day__d">${dn}</p><p class="rv-day__t">Rest</p><ul><li><span>Walk 8,000 steps or stretch 15 min</span></li></ul></li>`;
    const s = SESSIONS[split[k]];
    const count = delta > 0 ? 5 : 4;
    const rows = s.lifts.slice(0, count).map(([name, kind]) => {
      const [sets, reps] = kind === 'c' ? goal.c : goal.a;
      return [name, `${Math.max(2, Math.min(6, sets + delta))} × ${reps}`];
    });
    if (get('goal') === 'fat' || get('goal') === 'endurance') rows.push(['Finisher', '10 min intervals']);
    lines.push(`${dn}: ${s.title}\n${rows.map(([a, b]) => `  - ${a}: ${b}`).join('\n')}`);
    return `<li class="rv-day${k === 0 ? ' rv-day--hot' : ''}" style="animation-delay:${i * 40}ms"><p class="rv-day__d">${dn}</p><p class="rv-day__t">${s.title}</p><ul>${rows.map(([a, b]) => `<li><span>${esc(a)}</span><span>${b}</span></li>`).join('')}</ul></li>`;
  }).join('');
  const mins = n * (get('goal') === 'fat' || get('goal') === 'endurance' ? 60 : 55);
  $('[data-build-sum]').textContent = `${n} sessions a week, about ${Math.floor(mins / 60)} h${mins % 60 ? ' ' + (mins % 60) + ' min' : ''} in total. Goal: ${goal.name.toLowerCase()}. Level: ${levelName}.`;
  planText = `My Rival week (${goal.name}, ${n} days, ${levelName})\n\n${lines.join('\n\n')}\n\nRest days: walk 8,000 steps or stretch 15 min.`;
}
builder.addEventListener('change', buildWeek);
builder.addEventListener('submit', (e) => e.preventDefault());
buildWeek();
$('[data-copy]').addEventListener('click', async () => {
  const msg = $('[data-copy-msg]');
  try { await navigator.clipboard.writeText(planText); msg.textContent = 'Copied. Paste it into your notes.'; }
  catch {
    const ta = document.createElement('textarea'); ta.value = planText; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select();
    try { document.execCommand('copy'); msg.textContent = 'Copied. Paste it into your notes.'; } catch { msg.textContent = 'Couldn’t copy automatically. Select the plan and copy it.'; }
    ta.remove();
  }
});

/* ---------- Leaderboard ---------- */
type Row = { name: string; pts: number; me?: boolean };
const rows: Row[] = (JSON.parse(root.dataset.members!) as [string, number][]).map(([name, pts]) => ({ name, pts }));
const board = $('[data-board]');
const els = new Map<string, HTMLLIElement>();
function renderBoard() {
  const sorted = [...rows].sort((a, b) => b.pts - a.pts);
  const max = sorted[0].pts || 1;
  const before = new Map([...els].map(([k, el]) => [k, el.getBoundingClientRect().top]));
  sorted.forEach((r) => {
    let el = els.get(r.name);
    if (!el) { el = document.createElement('li'); els.set(r.name, el); }
    el.className = r.me ? 'is-me' : '';
    el.innerHTML = `<span><span class="rv-board__name">${esc(r.name)}${r.me ? ' (you)' : ''}</span><span class="rv-board__bar"><i style="--p:${Math.round((r.pts / max) * 100)}%"></i></span></span><span class="rv-board__pts">${r.pts}</span>`;
    board.append(el);
  });
  if (!reduce) sorted.forEach((r) => {
    const el = els.get(r.name)!;
    const prev = before.get(r.name);
    if (prev === undefined) return;
    const dy = prev - el.getBoundingClientRect().top;
    if (!dy) return;
    el.style.transition = 'none'; el.style.transform = `translateY(${dy}px)`;
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ''; el.style.transform = ''; }));
  });
  return sorted;
}
renderBoard();
let me: Row | null = null;
function paintMe() {
  if (!me) return;
  const sorted = [...rows].sort((a, b) => b.pts - a.pts);
  const rank = sorted.indexOf(me) + 1;
  const ahead = sorted[rank - 2];
  $('[data-me-rank]').textContent = `#${rank} on the board`;
  $('[data-me-note]').textContent = rank === 1 ? 'You’re top. Everyone is coming for you.' : `${ahead.pts - me.pts + 1} points to overtake ${ahead.name}, which is ${Math.ceil((ahead.pts - me.pts + 1) / 10)} workout${Math.ceil((ahead.pts - me.pts + 1) / 10) > 1 ? 's' : ''}.`;
}
const join = $<HTMLFormElement>('[data-join]');
join.addEventListener('submit', (e) => {
  e.preventDefault();
  if (me) return;
  const input = $<HTMLInputElement>('#j-name');
  const name = input.value.trim();
  const ok = /^[A-Za-zÀ-ÿ' -]{2,14}$/.test(name);
  input.setAttribute('aria-invalid', String(!ok));
  $('#j-name-e').hidden = ok;
  if (!ok) { input.focus(); return; }
  me = { name: rows.some((r) => r.name === name) ? name + ' ✦' : name, pts: 0, me: true };
  rows.push(me);
  renderBoard();
  join.hidden = true;
  $('[data-me]').hidden = false;
  $('[data-me-name]').textContent = me.name;
  paintMe();
  $<HTMLButtonElement>('[data-log]').focus();
});
$('[data-log]').addEventListener('click', () => { if (!me) return; me.pts += 10; renderBoard(); paintMe(); });
if (!reduce) setInterval(() => { const r = rows.filter((x) => !x.me)[Math.floor(Math.random() * (rows.length - (me ? 1 : 0)))]; if (r && Math.random() < 0.6) { r.pts += 10; renderBoard(); paintMe(); } }, 5000);

/* ---------- Free pass ---------- */
const form = $<HTMLFormElement>('[data-pass]');
const dateIn = $<HTMLInputElement>('#p-date');
dateIn.min = iso(today);
dateIn.value = iso(today);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function check(i: HTMLInputElement) {
  const ok = i.type === 'email' ? EMAIL.test(i.value.trim()) : i.type === 'date' ? !!i.value && i.value >= i.min : i.value.trim().length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]', form).forEach((i) => i.addEventListener('blur', () => { if (i.value) check(i); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !check(i));
  const consent = $<HTMLInputElement>('[data-consent]');
  $('#p-consent-e').hidden = consent.checked;
  if (bad.length || !consent.checked) { (bad[0] ?? consent).focus(); return; }
  const code = 'RIV-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  const when = new Date(dateIn.value + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const planName = $('.rv-plan__name', $<HTMLInputElement>('input[name="plan"]:checked', plansEl).closest('label')!).textContent;
  const first = $<HTMLInputElement>('#p-name').value.trim().split(/\s+/)[0];
  const ticket = $('[data-ticket]');
  $('[data-code]').textContent = code;
  $('[data-ticket-text]').textContent = `${first}, your pass for ${$<HTMLSelectElement>('#p-club').value} starts ${when} and lasts 3 days. Show this code at reception. You’ve been eyeing the ${planName} plan, so we’ll have a coach talk you through it. (Demo: nothing was sent.)`;
  ticket.hidden = false;
  ticket.focus();
});
