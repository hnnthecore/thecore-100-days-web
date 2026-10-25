/** Day 053 · Static · the sticky mini-player at the bottom of every page. It reads the shared player state, so it carries on across pages. */
import { player, position, fmt, wirePage } from './player';

wirePage();

/* The site root, worked out from the address so links work on a server and from disk. */
const root = location.pathname.slice(0, location.pathname.indexOf('day-053-podcast-network/') + 'day-053-podcast-network/'.length);
const bar = document.querySelector<HTMLElement>('[data-mini]')!;
const $ = <T extends HTMLElement>(s: string) => bar.querySelector<T>(s)!;
let shownId = '';
let dragging = false;

function paint() {
  const s = player.state();
  bar.hidden = !s;
  bar.classList.toggle('is-on', !!s);
  if (!s) { shownId = ''; return; }
  if (shownId !== s.id) {
    shownId = s.id;
    const cv = document.querySelector<HTMLImageElement>(`[data-stitle="${s.show}"]`)?.src;
    $('[data-m-art]').innerHTML = cv ? `<img src="${cv}" alt="" width="48" height="48" />` : "";
    $('[data-m-title]').textContent = s.title;
    $('[data-m-show]').textContent = s.show;
    $<HTMLAnchorElement>('[data-m-link]').href = `${root}episodes/${s.id}/index.html`;
  }
  const pos = position(s);
  const ended = pos >= s.dur;
  const playing = s.playing && !ended;
  const play = $('[data-m-play]');
  play.textContent = ''; play.dataset.state = playing ? 'pause' : 'play';
  play.setAttribute('aria-label', playing ? 'Pause' : ended ? 'Replay' : 'Play');
  $('[data-m-speed]').textContent = `${s.speed}×`;
  $('[data-m-pos]').textContent = fmt(pos);
  $('[data-m-dur]').textContent = fmt(s.dur);
  if (!dragging) {
    const r = $<HTMLInputElement>('[data-m-range]');
    r.max = String(s.dur); r.value = String(Math.floor(pos));
    r.setAttribute('aria-valuetext', `${fmt(pos)} of ${fmt(s.dur)}`);
  }
}

$('[data-m-play]').addEventListener('click', () => player.toggle());
$('[data-m-back]').addEventListener('click', () => player.skip(-15));
$('[data-m-fwd]').addEventListener('click', () => player.skip(30));
$('[data-m-speed]').addEventListener('click', () => { const sp = [1, 1.25, 1.5, 2]; const s = player.state()!; player.speed(sp[(sp.indexOf(s.speed) + 1) % sp.length]); });
$('[data-m-close]').addEventListener('click', () => player.close());
const range = $<HTMLInputElement>('[data-m-range]');
range.addEventListener('input', () => { dragging = true; $('[data-m-pos]').textContent = fmt(Number(range.value)); });
range.addEventListener('change', () => { dragging = false; player.seek(Number(range.value)); });

addEventListener('player:change', paint);
addEventListener('storage', paint);
setInterval(paint, 250);
paint();
