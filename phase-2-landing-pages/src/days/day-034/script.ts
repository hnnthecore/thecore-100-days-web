/**
 * Day 034 · Copperline Plumbing & Heating · interactions.
 * Today's availability · price list & quote basket · boiler advisor · leak cost bucket · care plans · booking.
 */
type Item = { id: string; name: string; price: number };
type Plan = { id: string; name: string; price: number };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.cp');
const PRICES: Record<string, Item[]> = JSON.parse(root.dataset.prices!);
const PLANS: Plan[] = JSON.parse(root.dataset.plans!);
const ITEMS = new Map(Object.values(PRICES).flat().map((i) => [i.id, i]));
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Availability model ---------- */
const WINDOWS = ['Morning · 8am to 12', 'Afternoon · 12 to 4pm', 'Evening · 4pm to 8'];
const ENG = ['Dan', 'Priya', 'Kofi', 'Megan'];
const today = new Date(); today.setHours(0, 0, 0, 0);
function seeded(key: string) { let h = 2166136261; for (const c of key) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0) % 100; }
const windowFree = (d: Date, w: number) => seeded(`${iso(d)}|w${w}`) >= (d.getDay() === 0 ? 55 : 25);

/* Today's board: next hourly arrivals still ahead of us, else tomorrow's. */
function paintToday() {
  const now = new Date();
  const out: { when: string; eng: string; tag: string }[] = [];
  for (let day = 0; day < 3 && out.length < 3; day++) {
    const d = new Date(today); d.setDate(d.getDate() + day);
    for (let h = 8; h <= 18 && out.length < 3; h++) {
      const at = new Date(d); at.setHours(h, 0, 0, 0);
      if (at.getTime() < now.getTime() + 90 * 60000) continue;
      if (seeded(`${iso(d)}|${h}`) < 45) continue;
      out.push({ when: `${day === 0 ? '' : day === 1 ? 'Tomorrow ' : ''}${pad(h)}:00`, eng: ENG[seeded(`${iso(d)}|e${h}`) % ENG.length], tag: day === 0 ? 'Today' : 'Free' });
    }
  }
  const first = out[0];
  $('[data-today-sub]').textContent = first && first.tag === 'Today' ? 'Next arrivals with a free engineer' : 'Today is fully booked, so here are the next free slots';
  $('[data-today]').innerHTML = out.map((o) => `<li><time>${o.when}</time><span>${o.eng} · Gas Safe</span><span>${o.tag}</span></li>`).join('');
}
paintToday();

/* ---------- Price list & basket ---------- */
const tabs = $$<HTMLButtonElement>('[role="tab"]', $('[data-tabs]'));
function selectTab(i: number, focus = false) {
  tabs.forEach((t, j) => {
    const on = i === j;
    t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1;
    $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    if (on && focus) t.focus();
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
const basket = new Set<string>();
function paintBasket() {
  const items = [...basket].map((id) => ITEMS.get(id)!);
  $('[data-basket]').hidden = !items.length;
  $('[data-b-count]').textContent = String(items.length);
  $('[data-b-s]').textContent = items.length === 1 ? '' : 's';
  $('[data-b-total]').textContent = gbp(items.reduce((s, i) => s + i.price, 0));
  $$<HTMLButtonElement>('[data-add]').forEach((b) => b.setAttribute('aria-pressed', String(basket.has(b.dataset.add!))));
  $('[data-s-items]').textContent = items.length ? items.map((i) => i.name).slice(0, 3).join(', ') + (items.length > 3 ? ` +${items.length - 3} more` : '') : 'None';
}
$$<HTMLButtonElement>('[data-add]').forEach((b) => b.addEventListener('click', () => {
  const id = b.dataset.add!;
  basket.has(id) ? basket.delete(id) : basket.add(id);
  paintBasket();
}));
$('[data-b-go]').addEventListener('click', () => {
  const items = [...basket].map((id) => ITEMS.get(id)!);
  $<HTMLTextAreaElement>('[data-note]').value = `Quote request: ${items.map((i) => `${i.name} (from ${gbp(i.price)})`).join('; ')}.`;
});

/* ---------- Boiler advisor ---------- */
const boiler = $<HTMLFormElement>('[data-boiler]');
const age = $<HTMLInputElement>('#bo-age');
const rep = $<HTMLInputElement>('#bo-rep');
const bill = $<HTMLInputElement>('#bo-bill');
const NEW_COST = 2600;
const SYM_TEXT: Record<string, string> = { noise: 'banging or whistling', pilot: 'a pilot light that goes out', cold: 'radiators cold at the bottom', parts: 'obsolete parts' };
function paintBoiler() {
  const a = Number(age.value), r = Number(rep.value), b = Number(bill.value);
  const syms = $$<HTMLInputElement>('input[type="checkbox"]', boiler).filter((c) => c.checked).map((c) => c.value);
  const eff = Math.max(0.62, 0.88 - a * 0.012);
  const score = Math.min(55, a * 2.2) + r * 9 + syms.length * 8 + (syms.includes('parts') ? 17 : 0);
  const saving = Math.max(0, b * (1 - eff / 0.93));
  $('[data-age-out]').textContent = `${a} year${a > 1 ? 's' : ''}`;
  $('[data-rep-out]').textContent = String(r);
  $('[data-bill-out]').textContent = gbp(b);
  $('[data-verdict]').textContent = score < 35 ? 'Keep it. Service it every year.' : score < 60 ? 'Repair for now, plan to replace.' : 'Time to replace it.';
  $('[data-marker]').style.setProperty('--pos', `${Math.max(4, Math.min(96, score))}%`);
  const reasons = [
    `${a >= 12 ? 'A boiler this age is past its best' : a >= 8 ? 'Mid-life: manageable with regular servicing' : 'Still young, with plenty of life left'} (${a} years).`,
    r ? `${r} repair${r > 1 ? 's' : ''} in two years${r >= 3 ? ', which is usually the point where replacing costs less' : ''}.` : 'No repairs recently, which is a good sign.',
    syms.length ? `Warning signs: ${syms.map((s) => SYM_TEXT[s]).join(', ')}.` : 'No warning signs ticked.',
    `Boilers like yours typically run at about ${Math.round(eff * 100)}% efficiency, against 93% for a new A-rated one.`,
  ];
  $('[data-reasons]').innerHTML = reasons.map((t) => `<li>${esc(t)}</li>`).join('');
  $('[data-saving]').textContent = saving >= 60 ? `A new boiler could save about ${gbp(saving)} a year on gas, paying back its ${gbp(NEW_COST)} cost in roughly ${Math.max(1, Math.round(NEW_COST / saving))} years.` : 'Your boiler is efficient enough that the savings from replacing it would be small.';
  boiler.dataset.advice = `Boiler advice: ${$('[data-verdict]').textContent}`;
}
boiler.addEventListener('input', paintBoiler);
boiler.addEventListener('submit', (e) => e.preventDefault());
$('[data-b-advice]').addEventListener('click', () => {
  $<HTMLSelectElement>('#b-job').value = 'Boiler or heating';
  $<HTMLTextAreaElement>('[data-note]').value = `${boiler.dataset.advice}. Boiler age ${age.value} years, ${rep.value} repairs, yearly gas bill ${gbp(Number(bill.value))}.`;
});
paintBoiler();

/* ---------- Leak calculator ---------- */
const leak = $<HTMLFormElement>('[data-leak]');
const val = (n: string) => Number((leak.elements.namedItem(n) as RadioNodeList).value);
const LEAK_NAME: Record<string, string> = { '15': 'dripping tap', '200': 'running toilet', '500': 'leaking pipe' };
function paintLeak() {
  const days = Number($<HTMLInputElement>('#lk-days').value);
  const litres = val('leak') * val('sev') * days;
  const fill = Math.min(1, Math.log10(1 + litres) / 5.6);
  $('[data-days-out]').textContent = `${days} day${days > 1 ? 's' : ''}`;
  $('[data-litres]').textContent = Math.round(litres).toLocaleString('en-GB');
  $('[data-baths]').textContent = `That’s about ${Math.max(1, Math.round(litres / 80)).toLocaleString('en-GB')} bath${Math.round(litres / 80) === 1 ? '' : 's'} full.`;
  $('[data-cost]').textContent = '£' + (litres / 1000 * 3.8).toFixed(litres / 1000 * 3.8 < 10 ? 2 : 0);
  $('[data-fill]').style.setProperty('y', `${245 - fill * 175}px`);
  $('[data-wave]').style.transform = `translateY(${-fill * 175}px)`;
  leak.dataset.what = LEAK_NAME[String(val('leak'))];
}
leak.addEventListener('input', paintLeak);
leak.addEventListener('submit', (e) => e.preventDefault());
$('[data-leak-book]').addEventListener('click', () => {
  $<HTMLSelectElement>('#b-job').value = 'Leak or burst pipe';
  $<HTMLTextAreaElement>('[data-note]').value = `A ${leak.dataset.what} that has been going for ${$('[data-days-out]').textContent}.`;
});
paintLeak();

/* ---------- Care plans ---------- */
const annual = $<HTMLInputElement>('[data-annual]');
const planList = $('[data-plans-list]');
function paintPlans() {
  $$<HTMLElement>('[data-price]', planList).forEach((b) => {
    const p = Number(b.dataset.price);
    b.textContent = '£' + (annual.checked ? ((p * 10) / 12).toFixed(2).replace(/\.00$/, '') : p);
  });
  const sel = PLANS.find((p) => p.id === $<HTMLInputElement>('input[name="plan"]:checked', planList).value)!;
  $('[data-plan-sum]').innerHTML = annual.checked
    ? `${esc(sel.name)}: ${gbp(sel.price * 10)} paid once a year (two months free). Cancel any time within 14 days for a full refund. <a href="#book" class="underline font-bold" data-plan-go>Add it to my booking</a>`
    : `${esc(sel.name)}: ${gbp(sel.price)} a month, no contract, cancel any time. <a href="#book" class="underline font-bold" data-plan-go>Add it to my booking</a>`;
}
planList.addEventListener('change', paintPlans);
annual.addEventListener('change', paintPlans);
$('[data-plan-sum]').addEventListener('click', (e) => {
  if (!(e.target as HTMLElement).closest('[data-plan-go]')) return;
  const sel = PLANS.find((p) => p.id === $<HTMLInputElement>('input[name="plan"]:checked', planList).value)!;
  $<HTMLTextAreaElement>('[data-note]').value = `I’d like to join the ${sel.name} care plan (${annual.checked ? 'annual' : 'monthly'}).`;
  $<HTMLSelectElement>('#b-job').value = 'Boiler or heating';
});
paintPlans();

/* ---------- Booking ---------- */
const COVER: Record<string, string> = { BS: 'Bristol', BA: 'Bath', GL: 'Gloucestershire', TA: 'Somerset' };
const PC = /^([A-Z]{1,2})(\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;
const st = { date: '', win: -1 };
const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(d.getDate() + i + (new Date().getHours() >= 15 ? 1 : 0)); return d; });
const emerg = $<HTMLInputElement>('[data-emerg]');
const daysEl = $('[data-days]');
const winEl = $('[data-windows]');
function paintDays() {
  daysEl.innerHTML = days.map((d) => `<label class="cp-pick"><input type="radio" name="day" value="${iso(d)}" ${WINDOWS.some((_, w) => windowFree(d, w)) ? '' : 'disabled'} ${st.date === iso(d) ? 'checked' : ''}/><span><small>${d.toLocaleDateString('en-GB', { weekday: 'short' })}</small><b>${d.getDate()}</b><small>${d.toLocaleDateString('en-GB', { month: 'short' })}</small></span></label>`).join('');
}
function paintWins() {
  if (!st.date) { winEl.innerHTML = '<p class="text-sm opacity-70">Choose a day first.</p>'; return; }
  const d = new Date(st.date + 'T00:00');
  if (st.win >= 0 && !windowFree(d, st.win)) st.win = -1;
  winEl.innerHTML = WINDOWS.map((w, i) => `<label class="cp-pick"><input type="radio" name="win" value="${i}" ${windowFree(d, i) ? '' : 'disabled'} ${st.win === i ? 'checked' : ''}/><span style="padding-block:1rem">${w}</span></label>`).join('');
}
daysEl.addEventListener('change', (e) => { st.date = (e.target as HTMLInputElement).value; paintWins(); paintBook(); });
winEl.addEventListener('change', (e) => { st.win = Number((e.target as HTMLInputElement).value); paintBook(); });
const jobSel = $<HTMLSelectElement>('#b-job');
function paintBook() {
  $('[data-sched]').hidden = emerg.checked;
  $('[data-s-job]').textContent = jobSel.value;
  $('[data-s-when]').textContent = emerg.checked ? 'Within 60 minutes' : st.date && st.win >= 0 ? `${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}, ${WINDOWS[st.win].split(' · ')[0]}` : 'Not chosen';
  $('[data-s-fee]').textContent = emerg.checked ? '£60 emergency fee' : 'Free call-out';
  $('[data-book-btn]').textContent = emerg.checked ? 'Send an engineer now' : 'Book engineer';
}
emerg.addEventListener('change', paintBook);
jobSel.addEventListener('change', paintBook);

const form = $<HTMLFormElement>('[data-book]');
const bookErr = $('[data-book-err]');
function valid(i: HTMLInputElement) {
  const v = i.value.trim();
  let ok: boolean;
  if (i.type === 'tel') ok = v.replace(/\D/g, '').length >= 10;
  else if (i.id === 'b-pc') { const m = v.toUpperCase().match(PC); ok = !!m && !!COVER[m[1]]; }
  else ok = v.length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]', form).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
form.addEventListener('submit', (e) => {
  e.preventDefault();
  bookErr.hidden = true;
  const bad = $$<HTMLInputElement>('[data-req]', form).filter((i) => !valid(i));
  if (!emerg.checked && (st.date === '' || st.win < 0)) { bookErr.textContent = st.date === '' ? 'Pick a day.' : 'Pick an arrival window.'; bookErr.hidden = false; $<HTMLElement>(st.date === '' ? '[name="day"]:not(:disabled)' : '[name="win"]:not(:disabled)').focus(); return; }
  if (bad.length) { bookErr.textContent = 'Please fix the highlighted fields.'; bookErr.hidden = false; bad[0].focus(); return; }
  const pc = $<HTMLInputElement>('#b-pc').value.trim().toUpperCase().replace(/\s+/g, '');
  const area = COVER[pc.match(/^[A-Z]{1,2}/)![0]];
  const eng = ENG[seeded(pc) % ENG.length];
  $('[data-done-name]').textContent = $<HTMLInputElement>('#b-name').value.trim().split(/\s+/)[0];
  $('[data-done-text]').textContent = emerg.checked
    ? `${eng} is on the way to your ${area} address. We’ll ring you in the next few minutes with an arrival time. If water is escaping, turn off the stop tap if you can.`
    : `${eng} will arrive in the ${WINDOWS[st.win].split(' · ')[0].toLowerCase()} on ${new Date(st.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}. You’ll get a text 30 minutes before. ${basket.size ? 'We’ll send your quote beforehand.' : ''}`;
  $('[data-ref]').textContent = 'CL-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  form.hidden = true; $('[data-sum]').hidden = true;
  const done = $('[data-done]'); done.hidden = false; done.focus();
});
$('[data-again]').addEventListener('click', () => {
  st.date = ''; st.win = -1; form.reset(); basket.clear();
  $$<HTMLInputElement>('[data-req]', form).forEach((i) => i.removeAttribute('aria-invalid'));
  form.hidden = false; $('[data-sum]').hidden = false; $('[data-done]').hidden = true;
  paintDays(); paintWins(); paintBook(); paintBasket();
});
paintDays(); paintWins(); paintBook(); paintBasket();
