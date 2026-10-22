/** Day 046 · Wildcombe Herbal · contact form: checks the fields, then thanks the sender by name. */
const form = document.querySelector<HTMLFormElement>('[data-contact]');
if (form) {
  const $ = (id: string) => form.querySelector<HTMLInputElement>('#' + id)!;
  const err = (n: string, m: string) => { form.querySelector<HTMLElement>(`[data-err="${n}"]`)!.textContent = m; };
  const ok = form.querySelector<HTMLElement>('[data-ok]')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('m-name').value.trim(), email = $('m-email').value.trim(), msg = $('m-msg').value.trim();
    const goodEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    err('name', name ? '' : 'Please enter your name.');
    err('email', goodEmail ? '' : 'Please enter a valid email address.');
    err('msg', msg.length > 9 ? '' : 'Please write a little more.');
    if (!name || !goodEmail || msg.length < 10) { ok.textContent = ''; (!name ? $('m-name') : !goodEmail ? $('m-email') : $('m-msg')).focus(); return; }
    ok.textContent = `Thank you, ${name.split(/\s+/)[0]}. We have your message and will reply to ${email}, usually within a day.`;
    form.reset();
  });
}
