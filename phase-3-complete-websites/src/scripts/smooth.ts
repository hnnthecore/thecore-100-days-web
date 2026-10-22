/**
 * Smooth scrolling with Lenis, used on every page of every site.
 * It is switched off for visitors who ask their system for reduced motion, and parts of the page that scroll on their own
 * (dialogs, menus, the basket drawer) are left alone with data-lenis-prevent so wheel and touch behave normally inside them.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

declare global { interface Window { __lenis?: Lenis } }

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    anchors: true,
  });
  window.__lenis = lenis;
  const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
  document.querySelectorAll('dialog, [role="dialog"], [aria-modal="true"], .mm-panel, textarea').forEach((el) => el.setAttribute('data-lenis-prevent', ''));
  /* A modal dialog that is open freezes the page behind it. */
  const sync = () => (document.querySelector('dialog[open]') ? lenis.stop() : lenis.start());
  new MutationObserver(sync).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
}
