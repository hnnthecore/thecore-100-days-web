/**
 * Day 053 · Static · the player. This is a simulated player (the episodes have no real audio), but it behaves like a real one:
 * play / pause, skip, speed and seeking all work, and it KEEPS ITS PLACE as you move between pages.
 *
 * How: the position is never ticked in memory. We store { pos, playing, since, speed } in localStorage, and
 * work out the current position as pos + (now - since) × speed. Every page reads the same truth, so a new page
 * simply carries on from where the last one stopped.
 */
export interface State { id: string; title: string; show: string; url: string; dur: number; hue: number; pos: number; playing: boolean; since: number; speed: number }
export interface EpisodeRef { id: string; title: string; show: string; url: string; dur: number; hue: number }

const KEY = 'static-player', HIST = 'static-history', FOLLOW = 'static-follow';
let mem: State | null = null;

function read(): State | null {
  try { const r = localStorage.getItem(KEY); if (r === null) return mem; return JSON.parse(r) as State; } catch { return mem; }
}
function write(s: State | null) {
  mem = s;
  try { s ? localStorage.setItem(KEY, JSON.stringify(s)) : localStorage.removeItem(KEY); } catch { /* private mode: lasts for this visit */ }
  dispatchEvent(new CustomEvent('player:change'));
}

export const fmt = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return (h ? `${h}:${String(m).padStart(2, '0')}` : String(m)) + ':' + String(r).padStart(2, '0');
};

/** The current playback position in seconds, worked out from the stored state. */
export function position(s: State | null = read()): number {
  if (!s) return 0;
  const p = s.playing ? s.pos + ((Date.now() - s.since) / 1000) * s.speed : s.pos;
  return Math.min(s.dur, Math.max(0, p));
}

export const player = {
  state: read,
  position,
  isCurrent: (id: string) => read()?.id === id,
  isPlaying: (id?: string) => { const s = read(); return !!s && s.playing && position(s) < s.dur && (!id || s.id === id); },
  /** Start an episode, or toggle it if it is already loaded. */
  play(ep: EpisodeRef) {
    const s = read();
    if (s && s.id === ep.id) return player.toggle();
    const prior = readHistory().find((h) => h.id === ep.id);
    write({ ...ep, pos: prior && prior.pos < ep.dur - 5 ? prior.pos : 0, playing: true, since: Date.now(), speed: s?.speed ?? 1 });
    addHistory(ep.id);
  },
  toggle() {
    const s = read(); if (!s) return;
    const p = position(s);
    if (s.playing) write({ ...s, pos: p, playing: false });
    else write({ ...s, pos: p >= s.dur ? 0 : p, playing: true, since: Date.now() });
  },
  seek(sec: number) {
    const s = read(); if (!s) return;
    write({ ...s, pos: Math.min(s.dur, Math.max(0, sec)), since: Date.now() });
  },
  skip(d: number) { player.seek(position() + d); },
  speed(x: number) {
    const s = read(); if (!s) return;
    write({ ...s, pos: position(s), since: Date.now(), speed: x });
  },
  close() { saveProgress(); write(null); },
};

/* ---------- Listening history (remembers where you stopped) ---------- */
interface Hist { id: string; pos: number; at: number }
function readHistory(): Hist[] { try { const v = JSON.parse(localStorage.getItem(HIST) ?? '[]'); return Array.isArray(v) ? v : []; } catch { return []; } }
function addHistory(id: string) {
  const h = readHistory().filter((x) => x.id !== id);
  h.unshift({ id, pos: 0, at: Date.now() });
  try { localStorage.setItem(HIST, JSON.stringify(h.slice(0, 12))); } catch { /* ignore */ }
}
/** Remembers the current position so the episode resumes later. */
export function saveProgress() {
  const s = read(); if (!s) return;
  const h = readHistory().filter((x) => x.id !== s.id);
  h.unshift({ id: s.id, pos: Math.floor(position(s)), at: Date.now() });
  try { localStorage.setItem(HIST, JSON.stringify(h.slice(0, 12))); } catch { /* ignore */ }
}
export const history = { all: readHistory, clear() { try { localStorage.removeItem(HIST); } catch { /* ignore */ } dispatchEvent(new CustomEvent('player:change')); } };
addEventListener('pagehide', saveProgress);
addEventListener('player:change', () => { if (!read()?.playing) saveProgress(); });

/* ---------- Followed shows ---------- */
let memFollow: string[] = [];
const readFollow = (): string[] => { try { const r = localStorage.getItem(FOLLOW); if (r === null) return memFollow; const v = JSON.parse(r); return Array.isArray(v) ? v : []; } catch { return memFollow; } };
export const follows = {
  all: readFollow,
  has: (id: string) => readFollow().includes(id),
  toggle(id: string) {
    const c = readFollow(); memFollow = c.includes(id) ? c.filter((x) => x !== id) : [...c, id];
    try { localStorage.setItem(FOLLOW, JSON.stringify(memFollow)); } catch { /* ignore */ }
    dispatchEvent(new CustomEvent('follow:change'));
  },
};

/** Wires [data-play] buttons and [data-follow] buttons on any page. Buttons carry the episode details as data attributes. */
export function wirePage() {
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const p = t.closest<HTMLElement>('[data-play]');
    if (p) player.play({ id: p.dataset.play!, title: p.dataset.title!, show: p.dataset.show!, url: p.dataset.url!, dur: Number(p.dataset.dur), hue: Number(p.dataset.hue) });
    const f = t.closest<HTMLElement>('[data-follow]');
    if (f) follows.toggle(f.dataset.follow!);
  });
  const paint = () => {
    document.querySelectorAll<HTMLButtonElement>('[data-play]').forEach((b) => {
      const on = player.isPlaying(b.dataset.play);
      b.setAttribute('aria-pressed', String(on));
      if (b.dataset.label !== undefined) b.textContent = on ? 'Pause' : player.isCurrent(b.dataset.play!) ? 'Resume' : (b.dataset.idle || 'Play episode');
      else { b.textContent = ''; b.dataset.state = on ? 'pause' : 'play'; }
      b.setAttribute('aria-label', `${on ? 'Pause' : 'Play'} ${b.dataset.title}`);
    });
    document.querySelectorAll<HTMLButtonElement>('[data-follow]').forEach((b) => {
      const on = follows.has(b.dataset.follow!);
      b.setAttribute('aria-pressed', String(on));
      b.textContent = on ? 'Following' : 'Follow';
    });
  };
  addEventListener('player:change', paint);
  addEventListener('follow:change', paint);
  paint();
}
