/** Day 046 · Wildcombe Herbal · home page behaviour: the cabinet chooser and the plates settling into their panels. */
import { initCabinet } from './cabinet';

document.querySelectorAll<HTMLElement>('[data-cabinet]').forEach(initCabinet);

/* Each poster plate rises a little as its panel arrives. */
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.25 });
document.querySelectorAll('[data-panel]').forEach((el) => io.observe(el));

/* The pinned title sits on a band the colour of whichever plate is passing beneath it, so plate text slips under
   the band's lower edge instead of running through the lettering. */
const poster = document.querySelector<HTMLElement>('[data-poster]');
const band = poster?.querySelector<HTMLElement>('.wp__stick');
if (poster && band) {
  const panels = [...poster.querySelectorAll<HTMLElement>('[data-panel]')];
  const tint = () => {
    const edge = band.getBoundingClientRect().bottom;
    const under = panels.find((p) => { const r = p.getBoundingClientRect(); return r.top <= edge && r.bottom > edge; });
    if (under) band.style.setProperty('--cur', getComputedStyle(under).getPropertyValue('--f'));
    band.classList.toggle('is-on', !!under);
  };
  addEventListener('scroll', tint, { passive: true });
  addEventListener('resize', tint);
  tint();
}
