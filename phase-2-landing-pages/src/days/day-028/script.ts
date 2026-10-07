/**
 * Day 028 · Stackwell · interactions.
 * Ticket console · live plan pricing · public status board · client-result tabs with count-ups · IT health check score.
 */
type Addon = { id: string; name: string; price: number };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.sw');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const clock = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Ticket console ---------- */
const ISSUES: Record<string, { id: string; lines: string[]; mins: number }> = {
  slow: { id: 'Laptop slow', mins: 25, lines: ['Ticket created from your message', 'Triage: priority P3, device LAT-0291', 'Remote scan started, found 14 GB of old update cache', 'Cache cleared and startup apps trimmed', 'Reboot scheduled for your next lunch break'] },
  login: { id: 'Account locked', mins: 6, lines: ['Ticket created, flagged P2 (user blocked)', 'Identity check passed, MFA verified by call-back', 'Account unlocked, password reset link sent', 'Sign-in tested from your location'] },
  mail: { id: 'Email delay', mins: 18, lines: ['Ticket created, flagged P2', 'Mail trace: 3 messages held by spam filter', 'Sender allow-listed, messages released', 'Rule added so this sender is never held again'] },
  start: { id: 'New starter', mins: 120, lines: ['Ticket created: new starter on Monday', 'Laptop picked from stock and enrolled in management', 'Accounts, licences and shared drives created', 'Courier booked for Friday, tracked delivery', 'Welcome call with your new colleague on day one'] },
};
const log = $('[data-log]');
const eta = $('[data-eta]');
let timers: number[] = [];
const issueBtns = $$<HTMLButtonElement>('[data-issue]');

function runIssue(key: string) {
  timers.forEach(clearTimeout);
  timers = [];
  const issue = ISSUES[key];
  issueBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.issue === key)));
  const ref = `STW-${4000 + Math.floor(Math.random() * 999)}`;
  log.innerHTML = '';
  eta.hidden = true;
  const lines = [`${ref} · ${issue.id}`, ...issue.lines];
  const add = (text: string, ok: boolean) => { const li = document.createElement('li'); li.textContent = text; if (ok) li.className = 'ok'; log.append(li); };
  lines.forEach((l, i) => {
    const show = () => {
      add(l, i > 0);
      if (i === lines.length - 1) {
        const t = new Date(Date.now() + issue.mins * 60000);
        $('[data-eta-time]').textContent = `by ${clock(t)} (about ${issue.mins >= 60 ? `${issue.mins / 60} h` : `${issue.mins} min`})`;
        eta.hidden = false;
        issueBtns.forEach((b) => (b.disabled = false));
      }
    };
    if (reduce) show(); else timers.push(window.setTimeout(show, i * 650));
  });
  if (!reduce) issueBtns.forEach((b) => (b.disabled = true));
}
issueBtns.forEach((b) => b.addEventListener('click', () => runIssue(b.dataset.issue!)));

/* ---------- Plan builder ---------- */
const ADDONS: Addon[] = JSON.parse(root.dataset.addons!);
const CORE = 32;
const plan = $<HTMLFormElement>('[data-plan]');
const usersIn = $<HTMLInputElement>('[data-users]');
const annual = $<HTMLInputElement>('[data-annual]');
let planText = '';

function price() {
  const users = Number(usersIn.value);
  const picked = ADDONS.filter((a) => $<HTMLInputElement>(`[data-addon][value="${a.id}"]`).checked);
  const lines: [string, number][] = [[`Core plan × ${users}`, CORE * users], ...picked.map((a): [string, number] => [`${a.name} × ${users}`, a.price * users])];
  const sub = lines.reduce((s, l) => s + l[1], 0);
  const disc = users >= 100 ? 0.15 : users >= 50 ? 0.12 : users >= 25 ? 0.08 : 0;
  const volume = -sub * disc;
  const yearly = annual.checked ? -(sub + volume) * 0.1 : 0;
  const total = sub + volume + yearly;

  $('[data-users-out]').textContent = String(users);
  usersIn.setAttribute('aria-valuetext', `${users} people`);
  const next = [[25, 8], [50, 12], [100, 15]].find(([n]) => users < n);
  $('[data-tier]').textContent = disc ? `${disc * 100}% volume discount applied.${next ? ` Reach ${next[0]} people for ${next[1]}%.` : ''}` : `Reach ${next![0]} people for ${next![1]}% off.`;
  $('[data-total]').textContent = gbp(total);
  $('[data-per]').textContent = gbp(total / users);
  $('[data-bill]').textContent = annual.checked ? 'annually' : 'monthly';
  const rows = [...lines, ...(volume ? [[`Volume discount ${disc * 100}%`, volume] as [string, number]] : []), ...(yearly ? [['Annual billing −10%', yearly] as [string, number]] : [])];
  $('[data-lines]').innerHTML = rows.map(([l, v]) => `<li><span>${l}</span><span>${v < 0 ? '−' : ''}${gbp(Math.abs(v))}</span></li>`).join('');
  const inhouse = 4200;
  $('[data-save]').textContent = total < inhouse
    ? `${gbp(inhouse - total)} a month less than one in-house technician, and you get a whole team.`
    : `A whole team and a 24-hour rota, for about the cost of ${(total / inhouse).toFixed(1)} in-house technicians.`;
  planText = `${users} people, ${picked.length ? picked.map((a) => a.name.toLowerCase()).join(', ') + ' added' : 'core plan'}, ${gbp(total)}/month${annual.checked ? ' billed annually' : ''}`;
}
plan.addEventListener('input', price);
plan.addEventListener('submit', (e) => e.preventDefault());
price();

/* ---------- Status board ---------- */
const SYSTEMS: string[] = JSON.parse(root.dataset.systems!);
const board = $('[data-status]');
const cap = $('[data-status-cap]');
const rnd = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
const incidents: string[] = [];
board.innerHTML = SYSTEMS.map((name, s) => {
  const r = rnd(s * 977 + 13);
  const days = Array.from({ length: 90 }, (_, i) => {
    const v = r();
    const state = v > 0.992 ? 'major' : v > 0.965 ? 'minor' : 'ok';
    const d = new Date(); d.setDate(d.getDate() - (89 - i));
    const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const text = state === 'ok' ? `${label}: operational` : state === 'minor' ? `${label}: slowdown, ${8 + Math.floor(r() * 20)} min` : `${label}: outage, ${25 + Math.floor(r() * 40)} min`;
    if (state !== 'ok') incidents.push(`${name}, ${text}`);
    return { state, text };
  });
  const minor = days.filter((d) => d.state === 'minor').length;
  const major = days.filter((d) => d.state === 'major').length;
  const pct = (100 - (minor * 0.12 + major * 0.5) / 0.9 * 0.1).toFixed(2);
  return `<div class="sw-sys"><p class="sw-sys__name"><i></i>${name}</p>
    <div class="sw-bars" role="img" aria-label="${name}: ${pct}% uptime over 90 days, ${minor + major} incident${minor + major === 1 ? '' : 's'}">${days.map((d) => `<span class="${d.state === 'ok' ? '' : 'is-' + d.state}" data-day="${name} · ${d.text}"></span>`).join('')}</div>
    <p class="sw-sys__pct sw-mono">${pct}%</p></div>`;
}).join('') + `<ul class="sr-only" aria-label="Incidents in the last 90 days">${incidents.map((i) => `<li>${i}</li>`).join('')}</ul>`;
const show = (e: Event) => { const t = (e.target as HTMLElement).closest<HTMLElement>("[data-day]"); if (t) cap.textContent = t.dataset.day!; };
board.addEventListener('mouseover', show);
board.addEventListener('click', show);

/* ---------- Results tabs & count-ups ---------- */
function countUp(el: HTMLElement) {
  const text = el.dataset.count!;
  const m = text.match(/[\d.]+/);
  if (!m || reduce) { el.textContent = text; return; }
  const target = Number(m[0]);
  const dec = (m[0].split('.')[1] ?? '').length;
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / 1100);
    const v = target * (1 - (1 - p) ** 3);
    el.textContent = text.replace(m[0], v.toFixed(dec));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const tabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-tabs]'));
function selectTab(i: number, focus = false) {
  tabs.forEach((t, j) => {
    const on = i === j;
    t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
    const panel = $(`#${t.getAttribute('aria-controls')}`);
    panel.hidden = !on;
    if (on) { $$('[data-count]', panel).forEach(countUp); if (focus) t.focus(); }
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(i));
  t.addEventListener('keydown', (e) => {
    const n = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 } as Record<string, number>)[e.key];
    if (n === undefined) return;
    e.preventDefault(); selectTab((n + tabs.length) % tabs.length, true);
  });
});
new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { io.disconnect(); $$('[data-count]', $('#cp-law')).forEach(countUp); } }, { threshold: 0.4 }).observe($('#results'));

/* ---------- Health check ---------- */
const quiz = $<HTMLFormElement>('[data-quiz]');
const questions = $$('legend', quiz).map((l) => l.textContent!.replace(/^\d+\.\s*/, ''));
let score = 0;
function grade() {
  const answers = questions.map((_, i) => (quiz.elements.namedItem(`q${i}`) as RadioNodeList).value);
  const answered = answers.filter((a) => a !== '').length;
  const yes = answers.filter((a) => a === '1').length;
  score = Math.round((yes / questions.length) * 100);
  const g = $('[data-gauge]');
  g.setAttribute('stroke-dasharray', `${score} 100`);
  g.setAttribute('stroke', score >= 84 ? 'var(--mint)' : score >= 50 ? 'var(--amber)' : 'var(--red)');
  $('[data-score]').textContent = String(score);
  $('[data-label]').textContent = !answered ? 'Answer the questions to see your score.' : answered < questions.length ? `${answered} of ${questions.length} answered…` : score >= 84 ? 'Strong foundations' : score >= 50 ? 'Some gaps worth closing' : 'Exposed. Let’s fix that.';
  const gap = answers.findIndex((a) => a === '0');
  $('[data-tip]').textContent = answered && gap >= 0 ? `Biggest gap: “${questions[gap].replace(/\?$/, '')}” was a no.` : answered === questions.length ? 'Nothing urgent. We’ll still check the details in the full report.' : '';
}
quiz.addEventListener('change', grade);
quiz.addEventListener('submit', (e) => e.preventDefault());
grade();

const contact = $<HTMLFormElement>('[data-contact]');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const valid = (i: HTMLInputElement) => {
  const ok = i.type === 'email' ? EMAIL.test(i.value.trim()) : i.value.trim().length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
};
$$<HTMLInputElement>('[data-req]', contact).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
contact.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-req]', contact).filter((i) => !valid(i));
  if (bad.length) { $('[data-ok]').textContent = ''; bad[0].focus(); return; }
  const first = $<HTMLInputElement>('#c-name').value.trim().split(/\s+/)[0];
  $('[data-ok]').textContent = `Thanks ${first}. Your report (score ${score}/100) and a quote for “${planText}” will arrive within one working day. (Demo: nothing was sent.)`;
});
