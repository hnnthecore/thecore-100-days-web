/** Day 046 · Wildcombe Herbal · tea club sign-up: checks the name and email, then confirms the plan. */
const form = document.querySelector<HTMLFormElement>('[data-club]');
if (form) {
  const $ = (id: string) => form.querySelector<HTMLInputElement>('#' + id)!;
  const err = (n: string, m: string) => { form.querySelector<HTMLElement>(`[data-err="${n}"]`)!.textContent = m; };
  const ok = form.querySelector<HTMLElement>('[data-ok]')!;
  const NAMES: Record<string, string> = { two: 'Two teas, £12 a month', three: 'Three teas, £17 a month', plus: 'Three teas and a treat, £24 a month' };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('q-name').value.trim(), email = $('q-email').value.trim();
    err('name', name ? '' : 'Please enter your name.');
    err('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Please enter a valid email address.');
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { ok.textContent = ''; (name ? $('q-email') : $('q-name')).focus(); return; }
    const plan = form.querySelector<HTMLInputElement>('input[name="plan"]:checked')!.value;
    const first = new Date(); first.setMonth(first.getMonth() + 1, 1); while (first.getDay() !== 1) first.setDate(first.getDate() + 1);
    ok.textContent = `Welcome to the club, ${name.split(/\s+/)[0]}. Your first box (${NAMES[plan]}) goes out on Monday ${first.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}. We have sent the details to ${email}.${$('q-gift').checked ? ' We will add a handwritten card.' : ''}`;
  });
}
