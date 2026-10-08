/**
 * Day 039 · Wayfarer Journeys · interactions.
 * Trip matcher · climate-aware destination cards · swappable day-by-day itinerary · price maths · smart packing list · expert enquiry.
 */
type Dest = { id: string; name: string; country: string; vibes: string[]; from: number; flight: number; temps: number[]; rain: number[]; best: number[]; acts: [string, string][] };

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.wf');
const DEST: Dest[] = JSON.parse(root.dataset.dest!);
const MONTHS: string[] = JSON.parse(root.dataset.months!);
const byId = (id: string) => DEST.find((d) => d.id === id)!;
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const store = {
  get<T>(k: string, d: T): T { try { return JSON.parse(localStorage.getItem(k) ?? '') as T; } catch { return d; } },
  set(k: string, v: unknown) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
};
function rng(seed: string) { let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = (Math.imul(h, 1664525) + 1013904223) >>> 0) / 2 ** 32); }

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Matcher & destination cards ---------- */
const vibes = new Set<string>();
const mMonth = $<HTMLSelectElement>('#m-month');
const mBudget = $<HTMLSelectElement>('#m-budget');
function matchList() {
  const month = Number(mMonth.value), budget = Number(mBudget.value);
  return DEST.map((d) => {
    const overlap = [...vibes].filter((v) => d.vibes.includes(v)).length;
    const inSeason = month ? d.best.includes(month) : false;
    return { d, overlap, inSeason, score: overlap * 3 + (month ? (inSeason ? 2 : -1) : 0) - d.from / 5000, ok: d.from <= budget && (!vibes.size || overlap > 0) };
  }).sort((a, b) => b.score - a.score);
}
const bestText = (d: Dest) => 'Best: ' + d.best.map((m) => MONTHS[m - 1].slice(0, 3)).join(', ');
function paintPlaces() {
  const month = Number(mMonth.value);
  const list = matchList();
  const grid = $('[data-grid]');
  let n = 0;
  list.forEach((m) => {
    const card = $(`[data-dest-id="${m.d.id}"]`);
    card.hidden = !m.ok;
    if (m.ok) { n++; grid.append(card); card.style.animationDelay = `${n * 60}ms`; }
    const badge = $('[data-badge]', card);
    badge.hidden = !(m.ok && month && m.inSeason);
    badge.textContent = month ? `Great in ${MONTHS[month - 1]}` : '';
    $$('.wf-climate i', card).forEach((i) => i.classList.toggle('is-sel', Number(i.dataset.m) === month));
    $('[data-avg]', card).textContent = month ? `${MONTHS[month - 1]}: about ${m.d.temps[month - 1]}°C, ${m.d.rain[month - 1]} mm of rain` : bestText(m.d);
  });
  $('[data-count]').textContent = `${n} destination${n === 1 ? '' : 's'} match${n === 1 ? 'es' : ''} your trip`;
  $('[data-empty]').hidden = n > 0;
  const top = list.filter((m) => m.ok).slice(0, 3);
  $('[data-match-sum]').textContent = !vibes.size && !month && mBudget.value === '99999' ? 'Pick a few things you love…' : top.length ? `${list.filter((m) => m.ok).length} match${list.filter((m) => m.ok).length === 1 ? '' : 'es'}. Top picks:` : 'No matches yet. Try a bigger budget.';
  $('[data-match-chips]').innerHTML = (vibes.size || month || mBudget.value !== '99999' ? top : []).map((m) => `<li>${esc(m.d.name)}</li>`).join('');
}
$$<HTMLButtonElement>('[data-vibe]').forEach((b) => b.addEventListener('click', () => {
  const v = b.dataset.vibe!;
  vibes.has(v) ? vibes.delete(v) : vibes.add(v);
  b.setAttribute('aria-pressed', String(vibes.has(v)));
  paintPlaces();
}));
[mMonth, mBudget].forEach((el) => el.addEventListener('change', () => { if (mMonth.value !== '0') ePriceMonth.value = mMonth.value; paintPlaces(); paintPrice(); paintPack(); }));
$<HTMLFormElement>('[data-matcher]').addEventListener('submit', (e) => e.preventDefault());
$$<HTMLAnchorElement>('[data-plan-dest]').forEach((a) => a.addEventListener('click', () => { pDest.value = a.dataset.planDest!; gen(); paintPrice(); paintPack(); }));

/* ---------- Itinerary ---------- */
const pDest = $<HTMLSelectElement>('#p-dest');
const pDays = $<HTMLInputElement>('#p-days');
const planForm = $<HTMLFormElement>('[data-planform]');
const FILLER = ['Free time: follow your curiosity', 'Wander a neighbourhood you haven’t seen yet', 'Long café stop and people-watching', 'Revisit your favourite place from earlier', 'Local market and an unplanned lunch', 'Sunset viewpoint with a drink', 'Pick up souvenirs and gifts'];
type Slot = { label: string; text: string; locked?: boolean };
let itin: { title: string; slots: Slot[] }[] = [];
const pace = () => (planForm.elements.namedItem('pace') as RadioNodeList).value;
const cats = () => $$<HTMLInputElement>('[data-cats] input').filter((i) => i.checked).map((i) => i.value);
function pool() {
  const d = byId(pDest.value);
  const want = cats();
  const r = rng(`${d.id}|${pDays.value}|${pace()}|${want.join(',')}`);
  const items = d.acts.map(([t, c]) => ({ t, c, k: (want.includes(c) ? -10 : 0) + r() * 6 })).sort((a, b) => a.k - b.k);
  return items.map((i) => i.t);
}
function gen() {
  const days = Number(pDays.value);
  const p = pace();
  $('[data-days-out]').textContent = `${days} days`;
  const list = pool();
  let ptr = 0;
  const take = () => (ptr < list.length ? list[ptr++] : FILLER[(ptr++ - list.length) % FILLER.length]);
  itin = Array.from({ length: days }, (_, i) => {
    if (i === 0) return { title: 'Day 1 · Arrive', slots: [{ label: 'Evening', text: 'Check in, freshen up and a gentle first-evening stroll to find dinner.', locked: true }] };
    if (i === days - 1) return { title: `Day ${days} · Depart`, slots: [{ label: 'Morning', text: 'Slow breakfast, last-minute shopping, then your private transfer to the airport.', locked: true }] };
    const labels = p === 'relaxed' ? ['Morning', 'Evening'] : p === 'packed' ? ['Early', 'Morning', 'Afternoon', 'Evening'] : ['Morning', 'Afternoon', 'Evening'];
    return { title: `Day ${i + 1}`, slots: labels.map((label) => ({ label, text: take() })) };
  });
  paintItin();
  paintTrip();
}
function paintItin() {
  $('[data-itin]').innerHTML = itin.map((d, di) => `<li class="wf-day" style="animation-delay:${di * 40}ms"><h3>${esc(d.title)}${d.slots.length > 1 ? '' : ''}</h3><ul>${d.slots.map((s, si) => `<li class="wf-slot"><time>${s.label}</time><span>${esc(s.text)}</span>${s.locked ? '<span></span>' : `<button type="button" data-swap="${di}-${si}" aria-label="Swap this activity: ${esc(s.text)}">↻</button>`}</li>`).join('')}</ul></li>`).join('');
}
$('[data-itin]').addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-swap]');
  if (!b) return;
  const [di, si] = b.dataset.swap!.split('-').map(Number);
  const used = new Set(itin.flatMap((d) => d.slots.map((s) => s.text)));
  const spare = [...pool(), ...FILLER].filter((t) => !used.has(t));
  const slot = itin[di].slots[si];
  slot.text = spare.length ? spare[Math.floor(Math.random() * Math.min(spare.length, 4))] : FILLER[Math.floor(Math.random() * FILLER.length)];
  paintItin();
  $<HTMLButtonElement>(`[data-swap="${di}-${si}"]`)?.focus();
});
planForm.addEventListener('input', () => { gen(); paintPrice(); paintPack(); });
planForm.addEventListener('submit', (e) => e.preventDefault());
$('[data-copy]').addEventListener('click', async () => {
  const d = byId(pDest.value);
  const text = `${pDays.value} days in ${d.name}, ${d.country}\n\n` + itin.map((x) => `${x.title}\n${x.slots.map((s) => `  ${s.label}: ${s.text}`).join('\n')}`).join('\n\n');
  const msg = $('[data-copy-msg]');
  try { await navigator.clipboard.writeText(text); msg.textContent = 'Copied. Paste it into your notes.'; }
  catch { const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'; document.body.append(ta); ta.select(); try { document.execCommand('copy'); msg.textContent = 'Copied. Paste it into your notes.'; } catch { msg.textContent = 'Couldn’t copy automatically. Select the plan and copy it.'; } ta.remove(); }
});

/* ---------- Price ---------- */
const ePax = $<HTMLInputElement>('#e-pax');
const ePriceMonth = $<HTMLSelectElement>('#e-month');
const eHotel = $<HTMLSelectElement>('#e-hotel');
const eBoard = $<HTMLSelectElement>('#e-board');
const eFlights = $<HTMLInputElement>('[data-flights]');
let estimate = { total: 0, pp: 0 };
ePriceMonth.value = String(((new Date().getMonth() + 2) % 12) + 1);
function paintPrice() {
  const d = byId(pDest.value);
  const nights = Number(pDays.value) - 1;
  const pax = Number(ePax.value);
  const month = Number(ePriceMonth.value);
  const peak = d.best.includes(month);
  const shoulder = d.best.includes(((month + 10) % 12) + 1) || d.best.includes((month % 12) + 1);
  const f = peak ? 1.12 : shoulder ? 1 : 0.9;
  const base = d.from;
  const flights = eFlights.checked ? base * 0.38 * f : 0;
  const hotel = base * 0.42 * (nights / 7) * Number(eHotel.value) * Number(eBoard.value) * (pax === 1 ? 1.5 : 1) * f;
  const acts = base * 0.12 * (nights / 7);
  const transfers = base * 0.08;
  const pp = flights + hotel + acts + transfers;
  estimate = { total: pp * pax, pp };
  $('[data-pax-out]').textContent = String(pax);
  $('[data-price-trip]').textContent = `Based on your ${pDays.value}-day ${d.name} trip. Change the length or pace in the itinerary above.`;
  $('[data-who]').textContent = `${pax} ${pax === 1 ? 'traveller' : 'travellers'}, ${nights} nights`;
  $('[data-total]').textContent = gbp(pp * pax);
  $('[data-pp]').textContent = gbp(pp);
  $('[data-season]').textContent = peak ? `${MONTHS[month - 1]} is peak season` : shoulder ? `${MONTHS[month - 1]} is shoulder season` : `${MONTHS[month - 1]} is low season`;
  const parts: [string, number, string][] = [['Flights', flights, '#ff8a3d'], ['Hotels', hotel, '#e84d8a'], ['Activities', acts, '#b8a8f2'], ['Transfers', transfers, '#1bb5a6']];
  $('[data-split]').innerHTML = parts.map(([n, v, c]) => `<li><span>${n}</span><i style="--w:${(v / pp) * 100}%;--c:${c}"></i><span>${gbp(v)}</span></li>`).join('');
  $('[data-dep]').textContent = gbp(pp * pax * 0.2);
  paintTrip();
}
$<HTMLFormElement>('[data-price-form]').addEventListener('input', () => { paintPrice(); paintPack(); });
$<HTMLFormElement>('[data-price-form]').addEventListener('submit', (e) => e.preventDefault());

/* ---------- Packing ---------- */
type Group = [string, string[]];
function packList(): Group[] {
  const d = byId(pDest.value);
  const m = Number(ePriceMonth.value);
  const t = d.temps[m - 1], rain = d.rain[m - 1], days = Number(pDays.value);
  const clothes = [`${Math.min(days, 7) + 1} × underwear and socks`, `${Math.min(days, 7)} × tops`, '2–3 × trousers or shorts', 'Comfortable walking shoes'];
  if (t < 8) clothes.push('Warm coat', 'Thermal base layers', 'Hat, scarf and gloves');
  else if (t < 17) clothes.push('Light jacket', 'A warm jumper');
  else if (t < 26) clothes.push('Light layers for evenings', 'Sunglasses');
  else clothes.push('Light, breathable clothes', 'Sun hat', 'Sunglasses');
  if (rain > 100) clothes.push('Waterproof jacket', 'Compact umbrella');
  if (d.vibes.includes('beach') && t >= 20) clothes.push('Swimwear', 'Flip-flops');
  if (d.vibes.includes('mountains') || d.id === 'banff') clothes.push('Hiking boots', 'Quick-dry trousers');
  if (d.vibes.includes('wildlife') && d.id === 'serengeti') clothes.push('Neutral-coloured clothes (greens, khaki)', 'Binoculars');
  if (['kyoto', 'bali', 'marrakech'].includes(d.id)) clothes.push('Modest outfits for temples and mosques');
  const health = ['Any prescription medicines (in original packaging)', 'Basic first-aid kit', 'Reusable water bottle', 'Hand sanitiser'];
  if (t > 20) health.push('Sun cream (SPF 50)');
  if (['bali', 'serengeti'].includes(d.id)) health.push('Insect repellent', 'Ask a travel nurse about vaccines and malaria advice');
  return [
    ['Documents', ['Passport (check the expiry date)', 'Travel insurance details', 'Flight and hotel confirmations', 'Cards and a little local cash', 'Digital copies of key documents']],
    ['Clothing', clothes],
    ['Tech', ['Phone and charger', 'Travel plug adaptor', 'Power bank', 'Headphones', ...(d.vibes.length ? ['Camera or spare phone storage'] : [])]],
    ['Health', health],
    ['Extras', ['Daypack for outings', 'A book or e-reader', 'Eye mask and earplugs', 'Reusable shopping bag']],
  ];
}
let packChecked = new Set<string>();
function paintPack() {
  const d = byId(pDest.value);
  const m = Number(ePriceMonth.value);
  $('[data-pack-for]').textContent = d.name;
  $('[data-pack-weather]').textContent = `In ${MONTHS[m - 1]}, expect about ${d.temps[m - 1]}°C and ${d.rain[m - 1]} mm of rain. Always check official entry and health guidance for ${d.country} before you travel.`;
  const key = `wayfarer-pack-${d.id}`;
  packChecked = new Set(store.get<string[]>(key, []));
  const groups = packList();
  $('[data-pack]').innerHTML = groups.map(([g, items]) => `<section class="wf-group"><h3>${g}</h3><ul>${items.map((it) => `<li><label><input type="checkbox" data-it="${esc(it)}" ${packChecked.has(it) ? 'checked' : ''}/><span>${esc(it)}</span></label></li>`).join('')}</ul></section>`).join('');
  paintPackProgress();
}
function paintPackProgress() {
  const all = $$<HTMLInputElement>('[data-pack] input');
  const done = all.filter((i) => i.checked).length;
  const pct = all.length ? Math.round((done / all.length) * 100) : 0;
  $('[data-pack-pct]').textContent = pct + '%';
  $('[data-pack-n]').textContent = `${done} of ${all.length} packed`;
  $('[data-pack-ring]').setAttribute('stroke-dasharray', `${pct} 100`);
}
$('[data-pack]').addEventListener('change', (e) => {
  const i = e.target as HTMLInputElement;
  if (!i.dataset.it) return;
  i.checked ? packChecked.add(i.dataset.it) : packChecked.delete(i.dataset.it);
  store.set(`wayfarer-pack-${pDest.value}`, [...packChecked]);
  paintPackProgress();
});
$('[data-pack-reset]').addEventListener('click', () => { packChecked.clear(); store.set(`wayfarer-pack-${pDest.value}`, []); paintPack(); });

/* ---------- Expert enquiry ---------- */
function paintTrip() {
  const d = byId(pDest.value);
  const w = cats();
  $('[data-trip-card]').innerHTML = `<b>Your trip:</b> ${pDays.value} days in ${esc(d.name)}, ${esc(d.country)}, ${pace()} pace${w.length ? `, with more ${w.join(', ')}` : ''}.<br /><b>Estimate:</b> ${gbp(estimate.total)} for ${ePax.value} (${gbp(estimate.pp)} each).`;
}
const talk = $<HTMLFormElement>('[data-talk]');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function valid(i: HTMLInputElement) { const ok = i.type === 'email' ? EMAIL.test(i.value.trim()) : i.value.trim().length > 1; i.setAttribute('aria-invalid', String(!ok)); $(`#${i.id}-e`).hidden = ok; return ok; }
$$<HTMLInputElement>('[data-req]', talk).forEach((i) => i.addEventListener('blur', () => { if (i.value) valid(i); }));
talk.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-req]', talk).filter((i) => !valid(i));
  if (bad.length) { bad[0].focus(); return; }
  const d = byId(pDest.value);
  const expert = d.id === 'bali' || d.id === 'kyoto' ? 'Maya' : ['lisbon', 'santorini', 'marrakech'].includes(d.id) ? 'Tomás' : d.id === 'serengeti' ? 'Kwame' : 'Ingrid';
  $('[data-done-name]').textContent = $<HTMLInputElement>('#t-name').value.trim().split(/\s+/)[0] + '.';
  $('[data-done-text]').textContent = `${expert} has your ${pDays.value}-day ${d.name} plan and will ${$<HTMLSelectElement>('#t-call').value.toLowerCase().replace('email me a plan', 'email you a full plan')} within one working day.`;
  $('[data-ref]').textContent = 'WF-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  const done = $('[data-done]'); done.hidden = false; done.focus();
});

pDest.value = 'lisbon';
gen(); paintPlaces(); paintPrice(); paintPack();
