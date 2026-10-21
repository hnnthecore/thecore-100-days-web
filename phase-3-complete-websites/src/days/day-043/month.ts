/** Day 043 · Rootwork · home page: read today's date, then let the month buttons scrub the year (ground colour, word, crops and note change together). */
import { NOTES, seasonOf } from './season';

const root = document.querySelector<HTMLElement>('.rw')!;
const hero = document.querySelector<HTMLElement>('[data-sn]');
if (hero) {
  const LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const word = hero.querySelector<HTMLElement>('[data-month]')!;
  const note = hero.querySelector<HTMLElement>('[data-note]')!;
  const crops = [...hero.querySelectorAll<HTMLElement>('[data-crops] > li')];
  const buttons = [...hero.querySelectorAll<HTMLButtonElement>('[data-months] button')];
  const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const GROUND = { spring: '#c9e27a', summer: '#f1de4b', autumn: '#f4a63a', winter: '#c3d5df' };
  const inSeason = (from: number, to: number, m: number) => (from <= to ? m >= from && m <= to : m >= from || m <= to);
  const today = new Date().getMonth() + 1;
  /* Size the word so it spans the width of the page, but never takes more than about half the screen height. */
  function fit() {
    word.style.fontSize = '100px';
    const room = hero!.clientWidth - 2 * parseFloat(getComputedStyle(hero!).paddingLeft);
    word.style.fontSize = Math.max(56, Math.min((100 * room) / word.scrollWidth, (innerHeight * 0.36) / 0.84, 440)) + 'px';
  }

  function show(m: number, first = false) {
    const s = seasonOf(m);
    root.dataset.season = s;
    theme?.setAttribute('content', GROUND[s]);
    word.textContent = LONG[m - 1];
    fit();
    note.textContent = NOTES[m - 1] + (m === today ? ' (This month.)' : '');
    crops.forEach((li) => { li.hidden = !inSeason(Number(li.dataset.from), Number(li.dataset.to), m); });
    buttons.forEach((b) => { b.setAttribute('aria-pressed', String(Number(b.dataset.m) === m)); b.classList.toggle('is-today', Number(b.dataset.m) === today); });
    if (!first) { word.classList.remove('is-swap'); void word.offsetWidth; word.classList.add('is-swap'); }
  }
  hero.querySelector('[data-months]')!.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button');
    if (b) show(Number(b.dataset.m));
  });
  show(today, true);
  addEventListener('resize', fit);
  document.fonts?.ready.then(fit);
}
