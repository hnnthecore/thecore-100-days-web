/** Day 043 · Rootwork · donation widgets (home and Get involved): amounts with their impact, Gift Aid maths and a thank-you. */
const IMPACT: Record<number, string> = {
  5: 'feeds a family’s fruit and veg box for a week.',
  12: 'plants out 20 seedlings in the community beds.',
  25: 'pays for one child’s whole term at Little Sprouts.',
  50: 'buys tools and boots for four new volunteers.',
  100: 'covers a Green Jobs trainee’s materials for a month.',
};
const gbp = (n: number) => '£' + (Number.isInteger(n) ? n.toString() : n.toFixed(2));
function impactFor(a: number) {
  if (IMPACT[a]) return IMPACT[a];
  if (a < 5) return 'helps keep the tea urn on at every growing session.';
  if (a < 12) return 'feeds a family’s veg box for a week, and then some.';
  if (a < 25) return 'plants dozens of seedlings in the community beds.';
  if (a < 50) return 'sends a child to Little Sprouts for a term.';
  if (a < 100) return 'kits out several new volunteers with tools and boots.';
  return 'helps a trainee to get a job in horticulture.';
}

document.querySelectorAll<HTMLFormElement>('[data-donate]').forEach((form) => {
  const q = <T extends Element>(s: string) => form.querySelector<T>(s)!;
  const radio = (suffix: string) => [...form.querySelectorAll<HTMLInputElement>(`input[name$="-${suffix}"]`)];
  const other = q<HTMLElement>('[data-other]'), otherIn = q<HTMLInputElement>('[data-other-in]'), err = q<HTMLElement>(`#${otherIn.id}-e`);
  const amount = () => { const v = radio('a').find((r) => r.checked)!.value; return v === 'other' ? Math.floor(Number(otherIn.value)) : Number(v); };
  const monthly = () => radio('f').find((r) => r.checked)!.value === 'monthly';
  const ok = () => { const a = amount(); return a >= 1 && a <= 5000; };

  function paint() {
    other.hidden = radio('a').find((r) => r.checked)!.value !== 'other';
    const a = amount(), valid = ok();
    q('[data-impact]').textContent = valid ? `${gbp(a)}${monthly() ? ' a month' : ''} ${impactFor(a)}` : 'Enter an amount to see what it does.';
    q('[data-gift-amt]').textContent = valid ? gbp(a) : '£0';
    q('[data-gift-tot]').textContent = valid ? gbp(a * 1.25) : '£0';
    const go = q<HTMLButtonElement>('[data-go]');
    go.textContent = valid ? `Donate ${gbp(a)}${monthly() ? ' every month' : ''}` : 'Donate';
    go.disabled = !valid;
  }
  form.addEventListener('input', () => { err.hidden = true; q('[data-ok]').textContent = ''; paint(); });
  otherIn.addEventListener('blur', () => { if (otherIn.value) { err.hidden = ok(); otherIn.setAttribute('aria-invalid', String(!ok())); } });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!ok()) { err.hidden = false; otherIn.setAttribute('aria-invalid', 'true'); otherIn.focus(); return; }
    const a = amount(), gift = q<HTMLInputElement>('[data-gift]').checked;
    q('[data-ok]').textContent = `Thank you! Your ${gbp(a)}${monthly() ? ' monthly gift' : ' gift'} ${impactFor(a)}${gift ? ` With Gift Aid it's worth ${gbp(a * 1.25)}.` : ''} (Demo: no money was taken.)`;
  });
  paint();
});
