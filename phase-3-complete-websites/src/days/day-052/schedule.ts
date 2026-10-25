/**
 * Day 052 · Stillwater · the weekly timetable and the booking store.
 * The timetable is a fixed week (Monday = 1 … Sunday = 0 like Date.getDay()), repeated forever.
 * Each concrete class is an occurrence: a session on a real date, with a stable id like "2026-10-06|vinyasa-flow|18:30".
 */
export interface Session { dow: number; time: string; cls: string; room: 'Sky' | 'Garden'; cap: number }

export const WEEK: Session[] = [
  { dow: 1, time: '07:00', cls: 'morning-mobility', room: 'Sky', cap: 14 },
  { dow: 1, time: '12:15', cls: 'pilates-mat', room: 'Garden', cap: 10 },
  { dow: 1, time: '18:30', cls: 'vinyasa-flow', room: 'Sky', cap: 16 },
  { dow: 2, time: '07:00', cls: 'power-vinyasa', room: 'Sky', cap: 14 },
  { dow: 2, time: '12:15', cls: 'hatha-basics', room: 'Garden', cap: 10 },
  { dow: 2, time: '19:00', cls: 'yin-restore', room: 'Garden', cap: 12 },
  { dow: 3, time: '07:00', cls: 'morning-mobility', room: 'Sky', cap: 14 },
  { dow: 3, time: '12:15', cls: 'meditation', room: 'Garden', cap: 12 },
  { dow: 3, time: '18:30', cls: 'power-vinyasa', room: 'Sky', cap: 14 },
  { dow: 4, time: '07:00', cls: 'vinyasa-flow', room: 'Sky', cap: 16 },
  { dow: 4, time: '17:45', cls: 'prenatal', room: 'Garden', cap: 8 },
  { dow: 4, time: '19:15', cls: 'pilates-mat', room: 'Sky', cap: 12 },
  { dow: 5, time: '07:00', cls: 'hatha-basics', room: 'Garden', cap: 10 },
  { dow: 5, time: '12:15', cls: 'yin-restore', room: 'Garden', cap: 12 },
  { dow: 5, time: '18:00', cls: 'vinyasa-flow', room: 'Sky', cap: 16 },
  { dow: 6, time: '09:00', cls: 'power-vinyasa', room: 'Sky', cap: 14 },
  { dow: 6, time: '10:30', cls: 'hatha-basics', room: 'Garden', cap: 10 },
  { dow: 6, time: '12:00', cls: 'meditation', room: 'Garden', cap: 12 },
  { dow: 0, time: '09:30', cls: 'vinyasa-flow', room: 'Sky', cap: 16 },
  { dow: 0, time: '11:00', cls: 'prenatal', room: 'Garden', cap: 8 },
  { dow: 0, time: '17:00', cls: 'yin-restore', room: 'Sky', cap: 14 },
];

export interface Occurrence extends Session { id: string; date: string; booked: number }

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; // taste-skill-ignore: a clock

/** Seeded "already booked" count so the timetable looks lived-in but never changes between visits. */
function seeded(id: string, cap: number): number {
  let h = 5381;
  for (const c of id) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
  return Math.min(cap, Math.round(cap * (0.35 + (h % 70) / 100)));
}

/** The next `n` days from `from` (default today), each with its classes. Classes already started today are dropped. */
export function upcoming(from = new Date(), n = 7): { date: Date; key: string; items: Occurrence[] }[] {
  const out = [];
  for (let i = 0; i < n; i++) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i);
    const key = iso(date);
    const items = WEEK.filter((s) => s.dow === date.getDay())
      .filter((s) => i > 0 || s.time > `${String(from.getHours()).padStart(2, '0')}:${String(from.getMinutes()).padStart(2, '0')}`) // taste-skill-ignore: a clock
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((s) => { const id = `${key}|${s.cls}|${s.time}`; return { ...s, id, date: key, booked: seeded(id, s.cap) }; });
    out.push({ date, key, items });
  }
  return out;
}

/* ---------- Bookings ---------- */
const KEY = 'stillwater-bookings';
let memory: string[] = [];
const read = (): string[] => { try { const r = localStorage.getItem(KEY); if (r === null) return memory; const v = JSON.parse(r); return Array.isArray(v) ? v : []; } catch { return memory; } };

export const bookings = {
  all: read,
  has: (id: string) => read().includes(id),
  add(id: string) { if (!read().includes(id)) bookings.write([...read(), id]); },
  remove(id: string) { bookings.write(read().filter((x) => x !== id)); },
  write(v: string[]) {
    memory = v;
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* private mode: lasts for this visit */ }
    dispatchEvent(new CustomEvent('bookings:change'));
  },
};

export const dayLabel = (d: Date, short = false) => d.toLocaleDateString('en-GB', { weekday: short ? 'short' : 'long', day: 'numeric', month: short ? 'short' : 'long' });
