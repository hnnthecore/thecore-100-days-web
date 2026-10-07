/**
 * Day 029 · Ironveil · interactions.
 * Threat radar · attack simulator · spot-the-phish quiz · live SOC feed · simulated domain scan.
 * Everything is generated in the browser: no request is ever made to a domain the visitor types.
 */
type Stage = { id: string; t: string; name: string; text: string };
type Mail = { from: string; addr: string; subject: string; body: string; phish: boolean; flags: string[] };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.iv');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const clock = (d = new Date()) => d.toLocaleTimeString('en-GB', { hour12: false });
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Radar ---------- */
const blips = $('[data-blips]', root) as unknown as SVGGElement;
const blockedEl = $('[data-blocked]');
const CODES = ['RU', 'CN', 'BR', 'IR', 'KP', 'NG', 'VN', 'UA', 'IN', 'US'];
const now = new Date();
let blocked = (now.getHours() * 60 + now.getMinutes()) * 9 + 412;
const paintBlocked = () => { blockedEl.textContent = blocked.toLocaleString('en-GB'); };
paintBlocked();
function addBlip(isStatic = false) {
  const a = Math.random() * Math.PI * 2;
  const r = 20 + Math.random() * 72;
  const x = Math.cos(a) * r, y = Math.sin(a) * r;
  const stopped = Math.random() < 0.82;
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', `iv-blip${stopped ? ' is-blocked' : ''}`);
  g.innerHTML = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6"/><circle class="iv-blip__r" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/><text x="${(x + 5).toFixed(1)}" y="${(y + 2).toFixed(1)}">${CODES[Math.floor(Math.random() * CODES.length)]}</text>`;
  blips.append(g);
  if (!isStatic) setTimeout(() => g.remove(), 4000);
  if (stopped) { blocked++; paintBlocked(); }
}
if (reduce) for (let i = 0; i < 7; i++) addBlip(true);
else { for (let i = 0; i < 3; i++) addBlip(); setInterval(addBlip, 1000); }

/* ---------- Attack simulator ---------- */
const STAGES: Stage[] = JSON.parse(root.dataset.stages!);
const protect = $<HTMLInputElement>('[data-protect]');
const runBtn = $<HTMLButtonElement>('[data-run]');
const outcome = $('[data-outcome]');
const stageEls = STAGES.map((s) => $(`[data-stage="${s.id}"]`));
protect.addEventListener('change', () => { $('[data-protect-label]').textContent = protect.checked ? 'ON' : 'OFF'; resetSim(); });

function resetSim() {
  stageEls.forEach((el) => { el.className = 'iv-stage'; $('.iv-stage__state', el).textContent = ''; });
  outcome.hidden = true;
}
async function runSim() {
  resetSim();
  runBtn.disabled = true;
  const on = protect.checked;
  const step = reduce ? 0 : 750;
  for (let i = 0; i < STAGES.length; i++) {
    const el = stageEls[i];
    if (on && i === 1) {
      el.classList.add('is-stopped');
      $('.iv-stage__state', el).textContent = 'DETECTED T+00:09 · ISOLATED';
      stageEls.slice(2).forEach((s) => { s.classList.add('is-skipped'); $('.iv-stage__state', s).textContent = 'PREVENTED'; });
      break;
    }
    el.classList.add('is-hit');
    $('.iv-stage__state', el).textContent = on ? 'CLICKED' : 'COMPROMISED';
    await wait(step);
  }
  outcome.hidden = false;
  outcome.className = `iv-outcome ${on ? 'is-good' : 'is-bad'}`;
  $('[data-outcome-title]').textContent = on ? 'Contained 9 minutes in. No data lost.' : 'Total compromise in 3 h 20 min.';
  $('[data-o-files]').textContent = on ? '0' : '48,213';
  $('[data-o-cost]').textContent = on ? '£0' : '£184,000';
  $('[data-o-down]').textContent = on ? '0 days' : '11 days';
  runBtn.disabled = false;
  runBtn.textContent = '↻ Run it again';
}
runBtn.addEventListener('click', runSim);

/* ---------- Spot the phish ---------- */
const MAILS: Mail[] = JSON.parse(root.dataset.emails!);
let mi = 0, score = 0, answered = false;
const verdict = $('[data-verdict]');
const actions = $('[data-m-actions]');
const nextMail = $<HTMLButtonElement>('[data-next-mail]');
function renderMail() {
  answered = false;
  verdict.hidden = true;
  actions.hidden = false;
  if (mi >= MAILS.length) {
    $('[data-m-from]').textContent = 'Ironveil Awareness';
    $('[data-m-addr]').textContent = '';
    $('[data-m-subject]').textContent = `Your result: ${score} / ${MAILS.length}`;
    $('[data-m-body]').textContent = score === MAILS.length ? 'Perfect. You’d make our job boring, which is the highest compliment. Your team could still benefit from regular practice though.' : score >= 3 ? 'Good instincts. A couple slipped through, and that’s exactly how real attackers get in. Short, regular simulations close that gap.' : 'Most people struggle with these. It’s not about being careless: attackers are professionals. Training and a second pair of eyes make the difference.';
    $('[data-m-count]').textContent = 'Finished';
    actions.hidden = true;
    verdict.hidden = false;
    verdict.classList.remove('is-wrong');
    $('[data-verdict-title]').textContent = '';
    $('[data-flags]').innerHTML = '';
    nextMail.textContent = '↻ Play again';
    return;
  }
  const m = MAILS[mi];
  $('[data-m-from]').textContent = m.from;
  $('[data-m-addr]').textContent = `<${m.addr}>`;
  $('[data-m-subject]').textContent = m.subject;
  $('[data-m-body]').textContent = m.body;
  $('[data-m-count]').textContent = `Email ${mi + 1} of ${MAILS.length}`;
  $$<HTMLButtonElement>('[data-vote]').forEach((b) => (b.disabled = false));
}
function vote(v: string) {
  if (answered) return;
  answered = true;
  const m = MAILS[mi];
  const right = (v === 'phish') === m.phish;
  if (right) score++;
  $('[data-phish-score]').textContent = `Score ${score} / ${MAILS.length}`;
  $$<HTMLButtonElement>('[data-vote]').forEach((b) => (b.disabled = true));
  verdict.hidden = false;
  verdict.classList.toggle('is-wrong', !right);
  $('[data-verdict-title]').textContent = `${right ? '✓ Correct.' : '✗ Not quite.'} This is ${m.phish ? 'phishing' : 'legitimate'}.`;
  $('[data-flags]').innerHTML = m.flags.map((f) => `<li>${esc(f)}</li>`).join('');
  nextMail.textContent = mi === MAILS.length - 1 ? 'See my score →' : 'Next email →';
  nextMail.focus();
}
$$<HTMLButtonElement>('[data-vote]').forEach((b) => b.addEventListener('click', () => vote(b.dataset.vote!)));
nextMail.addEventListener('click', () => {
  if (mi >= MAILS.length) { mi = 0; score = 0; $('[data-phish-score]').textContent = `Score 0 / ${MAILS.length}`; } else mi++;
  renderMail();
  $<HTMLButtonElement>('[data-vote]').focus();
});
$('[data-phish-score]').textContent = `Score 0 / ${MAILS.length}`;
renderMail();

/* ---------- SOC feed ---------- */
type Sev = 'critical' | 'high' | 'medium' | 'low';
type Ev = { sev: Sev; t: string; msg: string; act: string; warn: boolean };
const POOL: Record<Sev, { w: number; msgs: string[]; acts: [string, boolean][] }> = {
  critical: { w: 8, msgs: ['Ransomware behaviour on FIN-LT-014 (mass file rename)', 'Domain-admin login from an unrecognised country', 'Credential dumping tool run on SRV-DC-02'], acts: [['Isolated', false], ['Escalated to IR', true]] },
  high: { w: 22, msgs: ['Credential stuffing: 4,200 logins from 37 IPs', 'Malicious macro blocked in invoice.xlsm', 'New inbox rule forwarding mail to an external address', 'Cobalt Strike beacon pattern on LT-0219'], acts: [['Blocked', false], ['Escalated', true], ['Isolated', false]] },
  medium: { w: 30, msgs: ['Impossible travel: Leeds and Lagos 4 min apart', 'Unpatched VPN appliance detected', 'Encoded PowerShell command observed', 'MFA fatigue: 11 push prompts in 2 min'], acts: [['Investigating', true], ['User contacted', false], ['Blocked', false]] },
  low: { w: 40, msgs: ['Port scan from a known research scanner', 'Failed login ×3 for j.patel', 'USB storage device connected to RECEPTION-PC', 'Outdated browser version on 2 devices'], acts: [['Logged', false], ['Auto-closed', false]] },
};
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
function makeEvent(): Ev {
  let r = Math.random() * 100;
  let sev: Sev = 'low';
  for (const k of ['critical', 'high', 'medium', 'low'] as Sev[]) { r -= POOL[k].w; if (r <= 0) { sev = k; break; } }
  const [act, warn] = pick(POOL[sev].acts);
  return { sev, t: clock(), msg: pick(POOL[sev].msgs), act, warn };
}
const feedEl = $('[data-feed]');
const countsEl = $('[data-counts]');
const events: Ev[] = [];
const totals: Record<Sev, number> = { critical: 0, high: 0, medium: 0, low: 0 };
let sevFilter = 'all';
let paused = reduce;

function renderFeed(fresh = false) {
  const list = events.filter((e) => sevFilter === 'all' || e.sev === sevFilter).slice(0, 10);
  feedEl.innerHTML = list.map((e, i) => `<li class="iv-ev"${fresh && i === 0 ? '' : ' style="animation:none"'}><time>${e.t}</time><span class="iv-ev__sev"><i class="iv-sevdot s-${e.sev}"></i>${e.sev}</span><span class="iv-ev__msg">${esc(e.msg)}</span><span class="iv-ev__act${e.warn ? ' is-warn' : ''}">${e.act}</span></li>`).join('') || '<li class="iv-ev"><span class="iv-ev__msg">No events at this severity yet…</span></li>';
  countsEl.innerHTML = (Object.keys(totals) as Sev[]).map((k) => `<span><i class="iv-sevdot s-${k}"></i> ${k} <b>${totals[k]}</b></span>`).join('');
}
function pushEvent(fresh = true) {
  const e = makeEvent();
  events.unshift(e); totals[e.sev]++;
  if (events.length > 60) events.pop();
  renderFeed(fresh);
}
for (let i = 0; i < 10; i++) pushEvent(false);
setInterval(() => { if (!paused) pushEvent(); }, 1500);
$$<HTMLButtonElement>('[data-sev]', $('[data-sev]')).forEach((b) => b.addEventListener('click', () => {
  sevFilter = b.dataset.sev!;
  $$('[data-sev]', $('[data-sev]')).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  renderFeed();
}));
const pauseBtn = $<HTMLButtonElement>('[data-pause]');
const paintPause = () => { pauseBtn.setAttribute('aria-pressed', String(paused)); pauseBtn.textContent = paused ? '▶ Resume' : '❚❚ Pause'; };
pauseBtn.addEventListener('click', () => { paused = !paused; paintPause(); });
paintPause();

/* ---------- Domain scan (simulated) ---------- */
const scanForm = $<HTMLFormElement>('[data-scan]');
const domainIn = $<HTMLInputElement>('#s-domain');
const domainErr = $('#s-domain-e');
const checksEl = $('[data-checks]');
const gradeEl = $('[data-grade]');
const report = $<HTMLFormElement>('[data-report]');
const DOMAIN = /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,}$/i;
const CHECKS: { name: string; msgs: [string, string, string] }[] = [
  { name: 'SPF', msgs: ['SPF record found and strict (-all).', 'SPF found but uses soft-fail (~all).', 'No SPF record: anyone can spoof your email.'] },
  { name: 'DKIM', msgs: ['DKIM signing enabled with a 2048-bit key.', 'DKIM key is only 1024-bit; upgrade recommended.', 'No DKIM selector found.'] },
  { name: 'DMARC', msgs: ['DMARC policy is “reject”.', 'DMARC is monitor-only (p=none).', 'No DMARC record published.'] },
  { name: 'TLS', msgs: ['TLS 1.3 with a valid certificate.', 'Certificate expires in 12 days.', 'TLS 1.0 is still accepted.'] },
  { name: 'Open ports', msgs: ['Only ports 80 and 443 are exposed.', 'SSH (22) is open to the internet.', 'RDP (3389) is open to the internet.'] },
  { name: 'Breach exposure', msgs: ['No staff emails in known breach sets.', '3 addresses found in old breaches.', '27 addresses found, 9 with passwords.'] },
];
const GRADES: Record<string, [string, string]> = { A: ['Excellent posture', 'Only small improvements to make. Keep monitoring.'], B: ['Good, with a few gaps', 'Close the amber items and you’re in a strong place.'], C: ['Needs attention', 'Several issues attackers actively look for.'], D: ['Exposed', 'Fix the red items this week, starting with email authentication and open ports.'], F: ['Seriously exposed', 'Call us today. Attackers can likely reach you with little effort.'] };
let scanning = false;

scanForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (scanning) return;
  const domain = domainIn.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
  if (!DOMAIN.test(domain)) {
    domainIn.setAttribute('aria-invalid', 'true');
    domainErr.textContent = domain ? 'That doesn’t look like a domain. Try yourcompany.co.uk.' : 'Enter your company’s domain first.';
    domainErr.hidden = false;
    domainIn.focus();
    return;
  }
  domainIn.removeAttribute('aria-invalid'); domainErr.hidden = true;
  scanning = true;
  $<HTMLButtonElement>('[data-scan-btn]').disabled = true;
  checksEl.innerHTML = ''; gradeEl.hidden = true; report.hidden = true;
  let seed = [...domain].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 11);
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  let penalty = 0;
  for (const c of CHECKS) {
    const r = rnd();
    const k = r < 0.52 ? 0 : r < 0.8 ? 1 : 2;
    penalty += k;
    const cls = ['pass', 'warn', 'fail'][k];
    const li = document.createElement('li');
    li.className = `iv-check ${cls}`;
    li.innerHTML = `<span class="iv-check__icon">${['✓', '!', '✗'][k]}</span><div><p class="iv-check__name">${c.name}</p><p class="iv-check__msg">${c.msgs[k]}</p></div><span class="iv-check__res">${cls}</span>`;
    checksEl.append(li);
    await wait(reduce ? 0 : 450);
  }
  const g = penalty === 0 ? 'A' : penalty <= 2 ? 'B' : penalty <= 4 ? 'C' : penalty <= 6 ? 'D' : 'F';
  gradeEl.hidden = false; gradeEl.dataset.g = g;
  $('[data-grade-letter]').textContent = g;
  $('[data-grade-title]').textContent = `${domain}: ${GRADES[g][0]}`;
  $('[data-grade-text]').textContent = GRADES[g][1];
  report.hidden = false;
  scanning = false;
  $<HTMLButtonElement>('[data-scan-btn]').disabled = false;
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
report.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $<HTMLInputElement>('#s-email');
  const ok = EMAIL.test(email.value.trim());
  email.setAttribute('aria-invalid', String(!ok));
  $('#s-email-e').hidden = ok;
  if (!ok) { email.focus(); return; }
  $('[data-report-ok]').textContent = `Done. A full report for ${domainIn.value.trim()} is on its way to ${email.value.trim()}. (Demo: nothing was sent.)`;
});
