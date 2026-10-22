/** Day 046 · Wildcombe Herbal · checkout: live summary, field checks (email, UK postcode, card number, expiry, security code) and a confirmation. */
import { cart, totals, unitOf, money, DELIVERY } from './cart';
import { byId } from './catalogue';

const root = document.querySelector<HTMLElement>('[data-checkout]');
if (root) {
  const flow = root.querySelector<HTMLElement>('[data-flow]')!, empty = root.querySelector<HTMLElement>('[data-empty]')!, done = root.querySelector<HTMLElement>('[data-done]')!;
  const form = root.querySelector<HTMLFormElement>('[data-form]')!, linesEl = root.querySelector<HTMLElement>('[data-lines]')!, sumEl = root.querySelector<HTMLElement>('[data-sum]')!;
  const msg = root.querySelector<HTMLElement>('[data-form-msg]')!;
  const val = (n: string) => (form.elements.namedItem(n) as HTMLInputElement).value.trim();
  const method = () => (form.querySelector<HTMLInputElement>('input[name="ship"]:checked')!.value as keyof typeof DELIVERY);

  const render = () => {
    const ls = cart.lines();
    empty.hidden = ls.length > 0; flow.hidden = ls.length === 0;
    const t = totals(method());
    linesEl.innerHTML = ls.map((l) => { const p = byId(l.id), s = p.sizes.find((x) => x.id === l.size)!; return `<div class="wh-sum wk__sline"><span>${p.name}, ${s.label} × ${l.qty}</span><span>${money(unitOf(l) * l.qty)}</span></div>`; }).join('');
    sumEl.innerHTML = `<div class="wh-sum"><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.promoOk ? `<div class="wh-sum"><span>WILD10</span><span>−${money(t.discount)}</span></div>` : ''}<div class="wh-sum"><span>Delivery</span><span>${t.ship === 0 ? 'Free' : money(t.ship)}</span></div><div class="wh-sum wh-sum--total"><span>Total</span><span>${money(t.total)}</span></div>`;
  };
  form.addEventListener('change', render);
  addEventListener('cart:change', render);

  /* Card number and expiry are formatted as you type. */
  const card = form.elements.namedItem('card') as HTMLInputElement, exp = form.elements.namedItem('exp') as HTMLInputElement;
  card.addEventListener('input', () => { card.value = card.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
  exp.addEventListener('input', () => { const d = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; });

  const luhn = (n: string) => { let s = 0; n.split('').reverse().forEach((c, i) => { let d = Number(c); if (i % 2) { d *= 2; if (d > 9) d -= 9; } s += d; }); return s % 10 === 0; };
  const checks: Record<string, (v: string) => string> = {
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Please enter a valid email address.'),
    first: (v) => (v ? '' : 'Please enter your first name.'),
    last: (v) => (v ? '' : 'Please enter your last name.'),
    phone: (v) => (!v || /^[\d\s+()-]{9,16}$/.test(v) ? '' : 'Please enter a phone number we can reach.'),
    addr: (v) => (v.length > 4 ? '' : 'Please enter your address.'),
    city: (v) => (v ? '' : 'Please enter your town or city.'),
    post: (v) => (/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(v) ? '' : 'Please enter a UK postcode, like TQ9 7UT.'),
    card: (v) => { const n = v.replace(/\s/g, ''); return n.length >= 13 && luhn(n) ? '' : 'That card number does not look right.'; },
    exp: (v) => { const m = /^(\d{2}) \/ (\d{2})$/.exec(v); if (!m) return 'Enter the expiry as MM / YY.'; const mo = Number(m[1]), yr = 2000 + Number(m[2]), now = new Date(); return mo >= 1 && mo <= 12 && (yr > now.getFullYear() || (yr === now.getFullYear() && mo >= now.getMonth() + 1)) ? '' : 'That card has expired.'; },
    cvc: (v) => (/^\d{3,4}$/.test(v) ? '' : 'Enter the 3 or 4 digit code on your card.'),
    cname: (v) => (v ? '' : 'Please enter the name on the card.'),
  };
  const field = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
  const show = (n: string, e: string) => { form.querySelector<HTMLElement>(`[data-err="${n}"]`)!.textContent = e; if (e) field(n).setAttribute('aria-invalid', 'true'); else field(n).removeAttribute('aria-invalid'); };
  Object.keys(checks).forEach((n) => field(n).addEventListener('blur', () => show(n, checks[n](val(n)))));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let first: string | null = null;
    for (const n of Object.keys(checks)) { const err = checks[n](val(n)); show(n, err); if (err && !first) first = n; }
    if (first) { msg.textContent = 'Please fix the highlighted fields.'; field(first).focus(); return; }
    msg.textContent = '';
    const t = totals(method()), ref = 'WH-' + String(Math.floor(100000 + Math.random() * 899999));
    root.querySelector('[data-d-name]')!.textContent = val('first');
    root.querySelector('[data-d-text]')!.textContent = `Your order of ${money(t.total)} is paid. We will pick and pack it at the farm, and a confirmation is on its way to ${val('email')}. ${method() === 'next' ? 'It will be with you the next working day.' : 'It should reach you within two to four working days.'}`;
    root.querySelector('[data-d-ref]')!.textContent = ref;
    cart.clear(); cart.setPromo('');
    flow.hidden = true; empty.hidden = true; done.hidden = false; done.focus();
  });
  render();
}
