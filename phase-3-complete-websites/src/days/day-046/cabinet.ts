/** Day 046 · Wildcombe Herbal · the cabinet and its chooser: pick an hour and a taste, and the matching plates come forward. The choice lives in the URL hash. */
import { TIMES, TASTES } from './catalogue';

export function initCabinet(root: HTMLElement) {
  const cards = [...root.querySelectorAll<HTMLElement>("[data-card]")];
  const say = root.querySelector<HTMLElement>("[data-say]");
  const timeBtns = [...root.querySelectorAll<HTMLButtonElement>("button[data-time]")];
  const tasteBtns = [...root.querySelectorAll<HTMLButtonElement>("button[data-taste]")];
  if (!cards.length || !timeBtns.length) return;
  const total = cards.length;
  let time = "", taste = "";
  const has = (c: HTMLElement, key: "time" | "taste", v: string) => !v || (c.dataset[key] ?? "").split(" ").includes(v);
  const paint = () => {
    const on = !!(time || taste);
    let n = 0;
    cards.forEach((c) => { const m = has(c, "time", time) && has(c, "taste", taste); if (m) n++; c.classList.toggle("is-dim", on && !m); c.style.order = on && !m ? "1" : "0"; });
    timeBtns.forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.time ?? "") === time)));
    tasteBtns.forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.taste ?? "") === taste)));
    if (say) say.textContent = !on ? `${total} plates in the cabinet. Pick an hour or a taste and the right ones come forward.` : n === 0 ? "Nothing matches both. Try one at a time." : `${n} ${n === 1 ? "plate" : "plates"} ${time ? `for the ${time}` : "for any hour"}${taste ? `, tasting ${taste}` : ""}.`;
    const q = new URLSearchParams(location.hash.slice(1)); q.delete("time"); q.delete("taste"); if (time) q.set("time", time); if (taste) q.set("taste", taste);
    history.replaceState(null, "", q.toString() ? `#${q}` : location.pathname + location.search);
  };
  timeBtns.forEach((b) => b.addEventListener("click", () => { time = b.dataset.time ?? ""; paint(); }));
  tasteBtns.forEach((b) => b.addEventListener("click", () => { taste = b.dataset.taste ?? ""; paint(); }));
  const q = new URLSearchParams(location.hash.slice(1));
  if ((Object.keys(TIMES) as string[]).includes(q.get("time") ?? "")) time = q.get("time")!;
  if ((Object.keys(TASTES) as string[]).includes(q.get("taste") ?? "")) taste = q.get("taste")!;
  if (time || taste) paint();
}
