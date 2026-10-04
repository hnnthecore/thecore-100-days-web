/*!
 * Thecore · 100 Days of Web Development
 * Day 009: Galleries
 *
 * Every image is a normal <img>/<a href>, so without JavaScript each photo
 * still opens on its own. Scripts add the shared lightbox, filtering, the
 * viewer, before/after comparison, drag-to-scroll and the zoom lens.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;

  /* ======================================================================
     Shared lightbox
     Created inside the nearest demo frame (or <body> on a real page).
     ====================================================================== */
  function createLightbox(anchorEl) {
    const host = anchorEl.closest('[data-scroll-root]') || document.body;
    const scrollRoot = anchorEl.closest('[data-scroll-root]') || document.documentElement;
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Image viewer');
    box.innerHTML = `
      <div class="lightbox__bar">
        <span class="lightbox__count" aria-live="polite"></span>
        <button class="lightbox__btn" type="button" data-lb-close aria-label="Close viewer"><svg class="icon"><use href="#i-x"/></svg></button>
      </div>
      <div class="lightbox__stage">
        <button class="lightbox__btn lightbox__prev" type="button" data-lb-prev aria-label="Previous image"><svg class="icon"><use href="#i-chevron-left"/></svg></button>
        <img class="lightbox__img" alt="">
        <button class="lightbox__btn lightbox__next" type="button" data-lb-next aria-label="Next image"><svg class="icon"><use href="#i-chevron-right"/></svg></button>
      </div>
      <p class="lightbox__caption"></p>`;
    host.append(box);

    const img = $('.lightbox__img', box);
    const count = $('.lightbox__count', box);
    const caption = $('.lightbox__caption', box);
    const stage = $('.lightbox__stage', box);
    let items = [];
    let index = 0;
    let opener = null;

    function render(direction = 1) {
      const item = items[index];
      img.classList.remove('from-left');
      void img.offsetWidth;
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = '';
      if (direction < 0) img.classList.add('from-left');
      img.src = item.src;
      img.alt = item.alt || '';
      caption.textContent = item.caption || '';
      count.textContent = `${index + 1} / ${items.length}`;
      const single = items.length < 2;
      $('[data-lb-prev]', box).hidden = single;
      $('[data-lb-next]', box).hidden = single;
    }

    const go = (step) => {
      if (items.length < 2) return;
      index = (index + step + items.length) % items.length;
      render(step);
    };

    function open(list, start = 0, from = document.activeElement) {
      items = list;
      index = start;
      opener = from;
      render();
      box.hidden = false;
      scrollRoot.style.overflow = 'hidden';
      let tries = 12;
      const focusClose = () => {
        const btn = $('[data-lb-close]', box);
        btn.focus({ preventScroll: true });
        if (document.activeElement !== btn && tries-- > 0) requestAnimationFrame(focusClose);
      };
      focusClose();
    }

    function close() {
      box.hidden = true;
      scrollRoot.style.overflow = '';
      opener?.focus({ preventScroll: true });
    }

    $('[data-lb-close]', box).addEventListener('click', close);
    $('[data-lb-prev]', box).addEventListener('click', () => go(-1));
    $('[data-lb-next]', box).addEventListener('click', () => go(1));
    stage.addEventListener('click', (e) => { if (e.target === stage) close(); });

    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const f = $$('button:not([hidden])', box);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });

    // Swipe left/right
    let startX = null;
    stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });

    return { open, close };
  }

  /** Turn a set of <a data-lightbox> links into lightbox triggers. */
  function wireLinks(root, selector, getVisible = (links) => links) {
    const links = $$(selector, root);
    if (!links.length) return;
    const lightbox = createLightbox(root);
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const visible = getVisible(links);
        const list = visible.map((a) => ({ src: a.getAttribute('href'), alt: $('img', a)?.alt, caption: a.dataset.caption }));
        lightbox.open(list, visible.indexOf(link), link);
      });
    });
    return lightbox;
  }

  /* ======================================================================
     01 · Halden: filterable masonry portfolio (FLIP animation)
     ====================================================================== */
  (() => {
    const root = $('[data-portfolio]');
    const tiles = $$('.tile', root);
    const buttons = $$('[data-filter]', root);
    const status = $('[data-portfolio-status]', root);

    wireLinks(root, '.tile', (links) => links.filter((l) => !l.hidden));

    function filter(cat) {
      const visibleBefore = tiles.filter((t) => !t.hidden);
      const first = new Map(visibleBefore.map((t) => [t, t.getBoundingClientRect()]));

      tiles.forEach((t) => { t.hidden = !(cat === 'all' || t.dataset.cat === cat); });
      const shown = tiles.filter((t) => !t.hidden);
      status.textContent = `Showing ${shown.length} project${shown.length === 1 ? '' : 's'}`;
      if (reducedMotion.matches) return;

      // FLIP: animate each tile from where it was to where it is now
      shown.forEach((t) => {
        const last = t.getBoundingClientRect();
        const was = first.get(t);
        if (was) {
          t.animate(
            [{ transform: `translate(${was.left - last.left}px, ${was.top - last.top}px)` }, { transform: 'none' }],
            { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          );
        } else {
          t.animate([{ opacity: 0, transform: 'scale(0.94)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'ease-out' });
        }
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        filter(btn.dataset.filter);
      });
    });
  })();

  /* ======================================================================
     02 · Ember: menu wall with favourites
     ====================================================================== */
  (() => {
    const root = $('[data-food]');
    const saved = $('[data-saved]', root);
    wireLinks(root, '[data-lightbox="food"]');

    root.addEventListener('click', (e) => {
      const heart = e.target.closest('.heart');
      if (!heart) return;
      heart.setAttribute('aria-pressed', String(heart.getAttribute('aria-pressed') !== 'true'));
      const names = $$('.heart[aria-pressed="true"]', root).map((h) => $('strong', h.closest('.dish')).textContent);
      saved.textContent = names.length
        ? `Saved: ${names.join(', ')}. We'll remind you when you book.`
        : 'Tap ♥ to save dishes you’d like to try.';
    });
  })();

  /* ======================================================================
     03 · Forma: property photo viewer
     ====================================================================== */
  (() => {
    const root = $('[data-property]');
    const main = $('[data-main]', root);
    const label = $('[data-label]', root);
    const count = $('[data-count]', root);
    const thumbs = $$('[data-thumbs] [role="tab"]', root);
    const stage = $('[data-stage]', root);
    const lightbox = createLightbox(root);
    let index = 0;

    function show(i, { focusThumb = false } = {}) {
      index = (i + thumbs.length) % thumbs.length;
      const t = thumbs[index];
      main.src = t.dataset.src;
      main.alt = t.dataset.alt;
      main.style.animation = 'none';
      void main.offsetWidth;
      main.style.animation = '';
      label.textContent = t.dataset.room;
      count.textContent = `${index + 1} / ${thumbs.length}`;
      thumbs.forEach((b, n) => {
        b.setAttribute('aria-selected', String(n === index));
        b.tabIndex = n === index ? 0 : -1;
      });
      t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      if (focusThumb) t.focus();
    }

    thumbs.forEach((t, i) => {
      t.setAttribute('aria-label', t.dataset.room);
      t.addEventListener('click', () => show(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(i + 1, { focusThumb: true }); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(i - 1, { focusThumb: true }); }
      });
    });

    $('[data-v-prev]', root).addEventListener('click', () => show(index - 1));
    $('[data-v-next]', root).addEventListener('click', () => show(index + 1));

    let startX = null;
    stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') startX = e.clientX; });
    stage.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
    });

    $('[data-v-all]', root).addEventListener('click', (e) => {
      const list = thumbs.map((t) => ({ src: t.dataset.src, alt: t.dataset.alt, caption: t.dataset.room }));
      lightbox.open(list, index, e.currentTarget);
    });
  })();

  /* ======================================================================
     04 · Bygg & Co: before / after comparison
     ====================================================================== */
  (() => {
    const compare = $('[data-compare]');
    const range = $('[data-compare-range]', compare);
    const update = () => {
      compare.style.setProperty('--pos', `${range.value}%`);
      range.setAttribute('aria-valuetext', `${range.value}% before, ${100 - range.value}% after`);
    };
    range.addEventListener('input', update);
    update();
  })();

  /* ======================================================================
     05 · Nova: swipeable screenshots with mouse drag and dots
     ====================================================================== */
  (() => {
    const root = $('[data-screens]');
    const strip = $('[data-strip]', root);
    const shots = $$('.shot', strip);
    const dotsWrap = $('[data-dots]', root);
    const progress = $('[data-progress]', root);

    const dots = shots.map((shot, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Screenshot ${i + 1}: ${$('strong', shot).textContent}`);
      b.addEventListener('click', () => strip.scrollTo({ left: shot.offsetLeft - strip.offsetLeft - parseFloat(getComputedStyle(strip).paddingLeft), behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
      dotsWrap.append(b);
      return b;
    });

    function update() {
      const max = strip.scrollWidth - strip.clientWidth;
      progress.style.setProperty('--p', max > 0 ? strip.scrollLeft / max : 0);
      const center = strip.scrollLeft + strip.clientWidth / 3;
      let active = 0;
      shots.forEach((s, i) => { if (s.offsetLeft - strip.offsetLeft <= center) active = i; });
      dots.forEach((d, i) => d.setAttribute('aria-current', String(i === active)));
    }

    strip.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(strip);

    // Click-and-drag scrolling for mouse users (touch already swipes natively)
    let drag = null;
    strip.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: strip.scrollLeft, moved: false };
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) { drag.moved = true; strip.classList.add('is-dragging'); }
      strip.scrollLeft = drag.left - dx;
    });
    const end = () => {
      if (!drag) return;
      drag = null;
      // Snap to the nearest slide after a drag
      const width = shots[0].getBoundingClientRect().width + 20;
      const target = Math.round(strip.scrollLeft / width) * width;
      strip.classList.remove('is-dragging');
      strip.scrollTo({ left: target, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };
    strip.addEventListener('pointerup', end);
    strip.addEventListener('pointercancel', end);

    strip.addEventListener('keydown', (e) => {
      const width = shots[0].getBoundingClientRect().width + 20;
      if (e.key === 'ArrowRight') { e.preventDefault(); strip.scrollBy({ left: width, behavior: reducedMotion.matches ? 'auto' : 'smooth' }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); strip.scrollBy({ left: -width, behavior: reducedMotion.matches ? 'auto' : 'smooth' }); }
    });

    update();
  })();

  /* ======================================================================
     06 · Aurum: zoom lens + variant swatches
     ====================================================================== */
  (() => {
    const root = $('[data-jewel]');
    const zoom = $('[data-zoom]', root);
    const img = $('[data-zoom-img]', root);
    const lens = $('[data-lens]', root);
    const nameEl = $('[data-j-name]', root);
    const priceEl = $('[data-j-price]', root);
    const lightbox = createLightbox(root);
    const ZOOM = 2.5;
    const LENS = 180;

    const METALS = { gold: ['18k gold', 0], silver: ['Platinum', 600], rose: ['Rose gold', 0] };
    const GEMS = { emerald: ['Emerald', 0], sapphire: ['Sapphire', 350], ruby: ['Ruby', 500] };
    const BASE = 2450;
    let latest = 0;
    const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    const setLensImage = () => lens.style.setProperty('--src', `url("${img.currentSrc || img.src}")`);

    zoom.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = zoom.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      zoom.classList.add('is-zooming');
      lens.style.setProperty('--lx', `${x - LENS / 2}px`);
      lens.style.setProperty('--ly', `${y - LENS / 2}px`);
      lens.style.setProperty('--bg-size', `${r.width * ZOOM}px ${r.height * ZOOM}px`);
      lens.style.setProperty('--bg-pos', `${-(x * ZOOM - LENS / 2)}px ${-(y * ZOOM - LENS / 2)}px`);
    });
    zoom.addEventListener('pointerleave', () => zoom.classList.remove('is-zooming'));

    const openFull = () => lightbox.open([{ src: img.src, alt: img.alt, caption: nameEl.textContent }], 0, zoom);
    zoom.addEventListener('click', openFull);
    zoom.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFull(); }
    });

    function update() {
      const metal = $('input[name="metal"]:checked', root).value;
      const gem = $('input[name="gem"]:checked', root).value;
      const [metalName, metalExtra] = METALS[metal];
      const [gemName, gemExtra] = GEMS[gem];

      img.classList.add('is-swapping');
      const request = ++latest; // ignore older loads that finish late
      const next = new Image();
      next.onload = () => {
        if (request !== latest) return;
        img.src = next.src;
        img.alt = `Celeste ring in ${metalName.toLowerCase()} with ${gemName.toLowerCase()}`;
        img.classList.remove('is-swapping');
        setLensImage();
      };
      next.src = `images/ring-${metal}-${gem}.svg`;

      nameEl.textContent = `Celeste ring · ${metalName}, ${gemName.toLowerCase()}`;
      priceEl.textContent = eur.format(BASE + metalExtra + gemExtra);
      $('[data-metal-name]', root).textContent = metalName;
      $('[data-gem-name]', root).textContent = gemName;
    }

    root.addEventListener('change', update);
    setLensImage();
  })();
})();
