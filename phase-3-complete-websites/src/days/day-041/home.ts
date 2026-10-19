/** Day 041 · Pagebound Books · home page: newsletter form. */
import { wire } from './forms';

const form = document.querySelector<HTMLFormElement>('[data-news]')!;
const check = wire(form);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = document.querySelector<HTMLElement>('[data-news-ok]')!;
  if (!check()) { ok.textContent = ''; return; }
  ok.textContent = 'Thank you! Look out for the next letter. (Demo: nothing was sent.)';
  form.reset();
});
