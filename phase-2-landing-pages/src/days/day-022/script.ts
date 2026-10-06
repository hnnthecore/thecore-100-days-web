/**
 * Day 022 · Forno Rosso · interactions: basket, pizza builder, delivery checker.
 * The basket is saved in localStorage so it survives a page reload.
 */
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
const gbp = (n: number) => `£${n.toFixed(2)}`;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Toast ---------- */
const toastEl = $('[data-toast]');
let toastTimer = 0;
function toast(msg: string) {
  toastEl.textContent = msg;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl.classList.remove('is-on'), 2600);
}

/* ---------- Basket (with persistence) ---------- */
type Line = { key: string; name: string; detail: string; price: number; qty: number };
const KEY = 'forno-rosso-basket';
let lines: Line[] = [];
try { lines = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { lines = []; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode */ } };

const FREE_FROM = 25;
const FEE = 2.5;
const countEl = $('[data-cart-count]');
const cartBtn = $<HTMLButtonElement>('[data-cart-open]');

function addLine(line: Omit<Line, 'qty'>) {
  const found = lines.find((l) => l.key === line.key);
  if (found) found.qty += 1; else lines.push({ ...line, qty: 1 });
  save();
  renderCart();
  cartBtn.classList.remove('is-bump');
  void cartBtn.offsetWidth;
  cartBtn.classList.add('is-bump');
  toast(`${line.name} added 🍕`);
}

function renderCart() {
  const items = lines.reduce((s, l) => s + l.qty, 0);
  const sub = lines.reduce((s, l) => s + l.qty * l.price, 0);
  countEl.textContent = String(items);
  $('[data-cart-label]').textContent = `, ${items} ${items === 1 ? 'item' : 'items'}`;
  const list = $('[data-lines]');
  list.innerHTML = lines.map((l, i) => `
    <li class="fr-line">
      <b>${l.name}</b><span class="fr-line__price">${gbp(l.price * l.qty)}</span>
      ${l.detail ? `<small>${l.detail}</small>` : ''}
      <div class="fr-qty" role="group" aria-label="Quantity of ${l.name}">
        <button type="button" data-q="${i}" data-d="-1" aria-label="One fewer ${l.name}">−</button>
        <output>${l.qty}</output>
        <button type="button" data-q="${i}" data-d="1" aria-label="One more ${l.name}">+</button>
        <button type="button" class="fr-remove" data-remove="${i}">Remove</button>
      </div>
    </li>`).join('');
  const empty = !lines.length;
  $('[data-cart-empty]').hidden = !empty;
  $('[data-totals]').hidden = empty;
  $('[data-checkout]').hidden = empty;
  const fee = sub >= FREE_FROM ? 0 : FEE;
  $('[data-subtotal]').textContent = gbp(sub);
  $('[data-delivery]').textContent = fee ? gbp(fee) : 'Free';
  $('[data-total]').textContent = gbp(sub + fee);
  $('[data-free-hint]').textContent = !empty && fee ? `Add ${gbp(FREE_FROM - sub)} more for free delivery.` : !empty ? '🎉 You’ve unlocked free delivery.' : '';
}

$('[data-lines]').addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const q = t.closest<HTMLElement>('[data-q]');
  const r = t.closest<HTMLElement>('[data-remove]');
  if (q) {
    const i = Number(q.dataset.q);
    lines[i].qty += Number(q.dataset.d);
    const removed = lines[i].qty <= 0 ? lines.splice(i, 1)[0] : null;
    save(); renderCart();
    // Keep focus on the same control, or move to the panel if the line is gone.
    if (removed) $<HTMLButtonElement>('.fr-x').focus();
    else $<HTMLButtonElement>(`[data-q="${i}"][data-d="${q.dataset.d}"]`).focus();
  }
  if (r) { lines.splice(Number(r.dataset.remove), 1); save(); renderCart(); $<HTMLButtonElement>('.fr-x').focus(); }
});

/* ---------- Classics: add buttons ---------- */
$$<HTMLButtonElement>('[data-add]').forEach((b) => b.addEventListener('click', () => {
  addLine({ key: b.dataset.add!, name: b.dataset.name!, detail: '12″', price: Number(b.dataset.price) });
  const label = b.innerHTML;
  b.classList.add('is-added');
  b.innerHTML = '✓ Added';
  setTimeout(() => { b.classList.remove('is-added'); b.innerHTML = label; }, 1400);
}));

/* ---------- Cart drawer (modal dialog) ---------- */
const cart = $('[data-cart]');
const viewItems = $('[data-cart-view="items"]');
const viewTrack = $('[data-cart-view="track"]');
let lastFocus: HTMLElement | null = null;
function openCart() {
  lastFocus = document.activeElement as HTMLElement;
  cart.hidden = false;
  document.documentElement.style.overflow = 'hidden';
  $<HTMLButtonElement>('.fr-x').focus();
}
function closeCart() {
  cart.hidden = true;
  document.documentElement.style.overflow = '';
  (lastFocus && lastFocus !== document.body ? lastFocus : cartBtn).focus();
}
cartBtn.addEventListener('click', openCart);
cart.addEventListener('click', (e) => { if ((e.target as Element).closest('[data-cart-close]')) closeCart(); });
cart.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { e.preventDefault(); closeCart(); return; }
  if (e.key !== 'Tab') return;
  const items = $$<HTMLElement>('button, a[href], [tabindex="0"]', $('.fr-cart__panel')).filter((el) => el.offsetParent !== null);
  const first = items[0]; const last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

$('[data-checkout]').addEventListener('click', () => {
  $('[data-order-ref]').textContent = `#FR-${Math.floor(1000 + Math.random() * 9000)}`;
  viewItems.hidden = true;
  viewTrack.hidden = false;
  viewTrack.focus();
  const steps = $$('[data-track] li');
  steps.forEach((s) => s.classList.remove('is-done', 'is-now'));
  steps.forEach((s, i) => setTimeout(() => {
    steps.forEach((x, n) => { x.classList.toggle('is-done', n < i || (i === steps.length - 1 && n === i)); x.classList.toggle('is-now', n === i && i < steps.length - 1); });
    if (i === steps.length - 1) toast('Buon appetito! 🇮🇹');
  }, reduced.matches ? 0 : i * 1400));
  lines = []; save(); renderCart();
});
$('[data-new-order]').addEventListener('click', () => { viewTrack.hidden = true; viewItems.hidden = false; closeCart(); location.hash = '#classics'; });

/* ---------- Build your own ---------- */
const builder = $<HTMLFormElement>('[data-builder]');
const plate = $('[data-plate]');
const pizzaSvg = $('svg', plate);
const MAX = 5;
const NAMES = ['La Semplice', 'La Classica', 'La Doppia', 'La Tripla', 'La Golosa', 'La Bomba'];

function buildState() {
  const sauce = ($<HTMLInputElement>('[name="sauce"]:checked', builder)).value;
  const size = $<HTMLInputElement>('[name="size"]:checked', builder);
  const tops = $$<HTMLInputElement>('[name="topping"]:checked', builder);
  const price = Number(size.dataset.price) + tops.reduce((s, t) => s + Number(t.dataset.price), 0);
  const names = tops.map((t) => (t.closest('label')!.querySelector('b') as HTMLElement).textContent!);
  const hasPine = tops.some((t) => t.value === 'pineapple');
  const name = hasPine ? 'L’Hawaiana Ribelle' : NAMES[tops.length] ?? 'La Bomba';
  return { sauce, size: size.value, sizeLabel: size.nextElementSibling!.firstChild!.textContent!.trim(), tops, names, price, name: `${name}${sauce === 'bianca' ? ' Bianca' : ''}` };
}

function renderBuilder(changed?: HTMLInputElement) {
  const s = buildState();
  $$('[data-sauce]', pizzaSvg).forEach((g) => g.setAttribute('opacity', g.getAttribute('data-sauce') === s.sauce ? '1' : '0'));
  const on = new Set(s.tops.map((t) => t.value));
  // SVG elements have no .hidden property, so set the attribute itself.
  $$('[data-topping]', pizzaSvg).forEach((g) => g.toggleAttribute('hidden', !on.has(g.getAttribute('data-topping')!)));
  plate.dataset.size = s.size;
  $$<HTMLInputElement>('[name="topping"]', builder).forEach((t) => { t.disabled = !t.checked && s.tops.length >= MAX; });
  $('[data-top-count]').textContent = `(${s.tops.length} of ${MAX})`;
  const msg = $('[data-top-msg]');
  if (changed?.value === 'pineapple' && changed.checked) msg.textContent = 'Bold choice. We respect it. 🍍';
  else if (s.tops.length >= MAX) msg.textContent = 'That’s the maximum: more and it won’t cook properly in 90 seconds.';
  else msg.textContent = '';
  $('[data-build-price]').textContent = gbp(s.price);
  $('[data-pizza-name]').textContent = s.name;
}
builder.addEventListener('change', (e) => renderBuilder(e.target as HTMLInputElement));
builder.addEventListener('submit', (e) => {
  e.preventDefault();
  const s = buildState();
  const detail = `${s.sizeLabel} · ${s.sauce === 'rossa' ? 'Rossa' : 'Bianca'}${s.names.length ? ` · ${s.names.join(', ')}` : ''}`;
  addLine({ key: `custom:${s.sauce}:${s.size}:${s.tops.map((t) => t.value).join('+')}`, name: s.name, detail, price: s.price });
});
renderBuilder();

/* ---------- Delivery checker ---------- */
const ZONE1 = ['E8', 'E9', 'E2', 'N16', 'N1'];
const ZONE2 = ['E5', 'E3', 'E1', 'EC1', 'EC2', 'N4', 'N5', 'E10', 'E17'];
const pcForm = $<HTMLFormElement>('[data-postcode]');
const pcInput = $<HTMLInputElement>('[data-pc-input]');
const pcOut = $('[data-pc-result]');
function checkPostcode() {
  const raw = pcInput.value.toUpperCase().replace(/\s+/g, ' ').trim();
  const m = raw.match(/^([A-Z]{1,2}\d[A-Z\d]?)(?:\s?(\d[A-Z]{2}))?$/);
  pcInput.setAttribute('aria-invalid', String(!m));
  if (!m) { pcOut.innerHTML = '<div class="is-error"><span aria-hidden="true">🤔</span><span>That doesn’t look like a UK postcode. Try something like <b>E8 3PB</b>.</span></div>'; return; }
  const area = m[1];
  const label = m[2] ? `${area} ${m[2]}` : area;
  if (ZONE1.includes(area)) pcOut.innerHTML = `<div class="is-yes"><span aria-hidden="true">🛵</span><span><b>Yes! We deliver to ${label}.</b><br>25–35 minutes · £2.50 delivery, free over £25.</span></div>`;
  else if (ZONE2.includes(area)) pcOut.innerHTML = `<div class="is-maybe"><span aria-hidden="true">🛵</span><span><b>We deliver to ${label}.</b><br>A little further: 35–50 minutes · £3.95 delivery.</span></div>`;
  else pcOut.innerHTML = `<div class="is-no"><span aria-hidden="true">🥲</span><span><b>Sorry, ${label} is outside our delivery area.</b><br>Collection from Mare Street is always available.</span></div>`;
}
pcForm.addEventListener('submit', (e) => { e.preventDefault(); checkPostcode(); });
$$<HTMLButtonElement>('[data-try]').forEach((b) => b.addEventListener('click', () => { pcInput.value = b.dataset.try!; checkPostcode(); }));

/* ---------- Pizza of the month: days left ---------- */
const now = new Date();
const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
$('[data-month-left]').textContent = `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`;

/* ---------- Dough journey: progress follows scroll ---------- */
const dough = $('#dough');
const bar = $('[data-dough-bar]');
function doughProgress() {
  const r = dough.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height * 0.4)));
  bar.style.setProperty('--p', `${Math.round(p * 100)}%`);
}
addEventListener('scroll', doughProgress, { passive: true });
doughProgress();

renderCart();
