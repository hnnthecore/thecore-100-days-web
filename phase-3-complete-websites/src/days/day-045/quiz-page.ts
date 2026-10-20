/** Day 045 · Lingua Lane · the level test: one question at a time, instant feedback, then a CEFR level. */
import { QUIZ, levelFor } from './quiz';

const root = document.querySelector<HTMLElement>('[data-quiz]')!;
const $ = <T extends HTMLElement>(s: string) => root.querySelector<T>(s)!;
const panes = { pick: $('[data-pick]'), run: $('[data-run]'), result: $('[data-result]') };
const show = (k: keyof typeof panes) => (Object.keys(panes) as (keyof typeof panes)[]).forEach((p) => (panes[p].hidden = p !== k));

let lang = '', i = 0, score = 0, locked = false;

function ask() {
  const { qs } = QUIZ[lang];
  const q = qs[i];
  $('[data-q]').textContent = q.q;
  $('[data-step]').textContent = `${i + 1} / ${qs.length}`;
  const bar = $('[data-bar]');
  bar.setAttribute('aria-valuenow', String(i));
  bar.querySelector<HTMLElement>('i')!.style.width = `${(i / qs.length) * 100}%`;
  const box = $('[data-opts]');
  box.innerHTML = '';
  q.opts.forEach((o, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = o; b.dataset.n = String(n);
    box.appendChild(b);
  });
  locked = false;
  $('[data-q]').focus();
}

function answer(n: number) {
  if (locked) return;
  locked = true;
  const q = QUIZ[lang].qs[i];
  if (n === q.a) score++;
  const btns = [...$('[data-opts]').querySelectorAll('button')];
  btns.forEach((b, k) => { b.disabled = true; if (k === q.a) b.classList.add('is-right'); else if (k === n) b.classList.add('is-wrong'); });
  setTimeout(() => (++i < QUIZ[lang].qs.length ? ask() : finish()), 900);
}

function finish() {
  const { level, name } = levelFor(score);
  $('[data-lvl]').textContent = level;
  $('[data-name]').textContent = `${name} ${QUIZ[lang].label}`;
  $('[data-text]').textContent = `You scored ${score} out of ${QUIZ[lang].qs.length}. ${score >= 5 ? 'Brilliant! You are ready for a challenge.' : score >= 3 ? 'A solid foundation to build on.' : 'A great place to start, and the fastest progress comes early.'}`;
  $<HTMLAnchorElement>('[data-enrol]').href = $<HTMLAnchorElement>('[data-enrol]').href.split('?')[0] + `?course=${lang}&level=${level}`;
  show('result');
  panes.result.focus();
}

root.addEventListener('click', (e) => {
  const t = e.target as HTMLElement;
  const l = t.closest<HTMLElement>('[data-lang]');
  if (l) { lang = l.dataset.lang!; i = 0; score = 0; show('run'); ask(); return; }
  const o = t.closest<HTMLButtonElement>('[data-opts] button');
  if (o) { answer(Number(o.dataset.n)); return; }
  if (t.closest('[data-again]')) show('pick');
});
