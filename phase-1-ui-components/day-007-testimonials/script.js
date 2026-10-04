/*!
 * Thecore · 100 Days of Web Development
 * Day 007: Testimonials & Reviews
 *
 * All content is plain HTML (good for SEO and screen readers); scripts add
 * filtering, sorting, the carousel, count-ups and the review form.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;
  const { enhance, fakeRequest } = window.FormKit;

  /* ======================================================================
     01 · Lumen: wall of love
     ====================================================================== */
  (() => {
    const root = $('[data-wall]');
    const cards = $$('.tcard', root);
    const buttons = $$('[data-filter]', root);
    const more = $('[data-wall-more]', root);
    const status = $('[data-wall-status]', root);
    let filter = 'all';
    let expanded = false;

    function render() {
      let shown = 0;
      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.role === filter;
        const allowed = expanded || !card.classList.contains('is-extra');
        card.hidden = !(matches && allowed);
        if (!card.hidden) shown += 1;
      });
      const hiddenExtras = cards.filter((c) => c.classList.contains('is-extra') && (filter === 'all' || c.dataset.role === filter));
      more.hidden = expanded || hiddenExtras.length === 0;
      status.textContent = `Showing ${shown} review${shown === 1 ? '' : 's'}`;
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        render();
      });
    });

    more.addEventListener('click', () => {
      expanded = true;
      render();
      const firstNew = cards.find((c) => c.classList.contains('is-extra') && !c.hidden);
      firstNew?.setAttribute('tabindex', '-1');
      firstNew?.focus();
    });

    $$('.tcard__more', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.tcard');
        const open = card.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Show less' : 'Read more';
      });
    });

    render();
  })();

  /* ======================================================================
     02 · Atlas: logo carousel (WAI-ARIA tabbed carousel)
     ====================================================================== */
  (() => {
    const root = $('[data-carousel]');
    const tabs = $$('[role="tab"]', root);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const toggle = $('[data-toggle]', root);
    const INTERVAL = 6000;
    let index = 0;
    let timer = 0;
    let userPaused = reducedMotion.matches; // never auto-play for reduced-motion users
    let hoverPaused = false;
    let offscreen = false;

    root.style.setProperty('--interval', `${INTERVAL}ms`);

    function show(i, { focus = false } = {}) {
      index = (i + tabs.length) % tabs.length;
      tabs.forEach((t, n) => {
        const on = n === index;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
      });
      if (focus) tabs[index].focus();
      restart();
    }

    function restart() {
      clearTimeout(timer);
      const playing = !userPaused && !hoverPaused && !offscreen;
      root.classList.toggle('is-playing', playing);
      root.classList.toggle('is-paused', !playing);
      // Restart the progress animation on the active logo
      const bar = $('[aria-selected="true"] .carousel__progress', root);
      bar.style.display = 'none';
      void bar.offsetWidth;
      bar.style.display = '';
      if (playing) timer = setTimeout(() => show(index + 1), INTERVAL);
    }

    function setUserPaused(paused) {
      userPaused = paused;
      toggle.setAttribute('aria-label', paused ? 'Start auto-play' : 'Pause auto-play');
      $('use', toggle).setAttribute('href', paused ? '#i-play' : '#i-pause');
      restart();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => show(i));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        show(keys[e.key], { focus: true });
      });
    });

    $('[data-prev]', root).addEventListener('click', () => show(index - 1));
    $('[data-next]', root).addEventListener('click', () => show(index + 1));
    toggle.addEventListener('click', () => setUserPaused(!userPaused));

    // Pause while the visitor is reading (hover) or using it (focus)
    const pauseIn = () => { hoverPaused = true; restart(); };
    const pauseOut = () => { hoverPaused = false; restart(); };
    root.addEventListener('pointerenter', pauseIn);
    root.addEventListener('pointerleave', pauseOut);
    root.addEventListener('focusin', pauseIn);
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) pauseOut(); });

    // Don't advance while scrolled out of view
    new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
      restart();
    }).observe(root);

    setUserPaused(userPaused);
    show(0);
  })();

  /* ======================================================================
     03 · Forma: review summary, filters, sort, helpful votes
     ====================================================================== */
  (() => {
    const root = $('[data-reviews]');
    const list = $('[data-list]', root);
    const items = $$('.review', root);
    const bars = $$('[data-star]', root);
    const sort = $('[data-sort]', root);
    const showing = $('[data-showing]', root);
    const empty = $('[data-empty]', root);
    const more = $('[data-more]', root);
    let star = null;
    let expanded = false;

    function render() {
      const sorters = {
        recent: (a, b) => b.dataset.date.localeCompare(a.dataset.date),
        high: (a, b) => b.dataset.rating - a.dataset.rating || b.dataset.date.localeCompare(a.dataset.date),
        low: (a, b) => a.dataset.rating - b.dataset.rating || b.dataset.date.localeCompare(a.dataset.date),
        helpful: (a, b) => b.dataset.helpful - a.dataset.helpful,
      };
      [...items].sort(sorters[sort.value]).forEach((el) => list.append(el));

      // When filtering by star, show every match; otherwise respect "load more"
      let shown = 0;
      let remaining = 0;
      items.forEach((el) => {
        const matches = !star || el.dataset.rating === star;
        const allowed = expanded || star || !el.classList.contains('is-extra');
        el.hidden = !(matches && allowed);
        if (!el.hidden) shown += 1;
        if (matches && !allowed) remaining += 1;
      });

      empty.hidden = shown > 0;
      more.hidden = remaining === 0;
      showing.textContent = star
        ? `${shown} ${star}-star review${shown === 1 ? '' : 's'}`
        : `Showing ${shown} of ${items.length} reviews`;
    }

    bars.forEach((btn) => {
      btn.addEventListener('click', () => {
        star = star === btn.dataset.star ? null : btn.dataset.star;
        bars.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.star === star)));
        render();
      });
    });

    sort.addEventListener('change', render);
    more.addEventListener('click', () => {
      expanded = true;
      render();
    });

    // Helpful votes: one per visitor per review, toggleable
    root.addEventListener('click', (e) => {
      const btn = e.target.closest('.helpful');
      if (!btn) return;
      const review = btn.closest('.review');
      const on = btn.getAttribute('aria-pressed') !== 'true';
      const count = Number(review.dataset.helpful) + (on ? 1 : -1);
      review.dataset.helpful = count;
      btn.setAttribute('aria-pressed', String(on));
      $('span', btn).textContent = `(${count})`;
    });

    render();
  })();

  /* ======================================================================
     04 · Halden: case-study tabs with count-up results
     ====================================================================== */
  (() => {
    const root = $('[data-cases]');
    const tabs = $$('[role="tab"]', root);

    function countUp(panel) {
      $$('[data-to]', panel).forEach((el) => {
        const to = Number(el.dataset.to);
        const decimals = Number(el.dataset.decimals || 0);
        if (reducedMotion.matches) {
          el.textContent = to.toFixed(decimals);
          return;
        }
        const start = performance.now();
        const step = (now) => {
          const t = Math.min(1, (now - start) / 1200);
          el.textContent = (to * (1 - (1 - t) ** 3)).toFixed(decimals);
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }

    function select(tab, { focus = false } = {}) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      countUp(document.getElementById(tab.getAttribute('aria-controls')));
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        select(tabs[(keys[e.key] + tabs.length) % tabs.length], { focus: true });
      });
    });

    // First count-up happens when the section scrolls into view
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      countUp($('[role="tabpanel"]:not([hidden])', root));
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(root);
  })();

  /* ======================================================================
     05 · Forge: member story cards
     ====================================================================== */
  (() => {
    const root = $('[data-stories]');
    const track = $('[data-s-track]', root);
    const prev = $('[data-s-prev]', root);
    const next = $('[data-s-next]', root);

    const step = () => track.firstElementChild.getBoundingClientRect().width + 16;
    const update = () => {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    const behavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: behavior() }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: behavior() }));
    track.addEventListener('scroll', update, { passive: true });
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: step(), behavior: behavior() }); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -step(), behavior: behavior() }); }
    });
    new ResizeObserver(update).observe(track);
    update();
  })();

  /* ======================================================================
     06 · Ember: star rating input + post a review
     ====================================================================== */
  (() => {
    const root = $('[data-guests]');
    const form = $('#review-form', root);
    const rate = $('[data-rate]', form);
    const word = $('[data-rate-word]', form);
    const list = $('[data-glist]', root);
    const thanks = $('[data-thanks]', root);
    const WORDS = ['Tap to rate', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

    const checked = () => Number($('input[name="rating"]:checked', rate)?.value || 0);
    const paint = (n) => {
      rate.dataset.show = n;
      word.textContent = WORDS[n];
    };

    $$('label', rate).forEach((label, i) => {
      label.addEventListener('pointerenter', () => paint(i + 1));
    });
    rate.addEventListener('pointerleave', () => paint(checked()));
    rate.addEventListener('change', () => paint(checked()));

    enhance(form, {
      onSubmit: () => fakeRequest(900),
      onSuccess: () => {
        const n = checked();
        const li = document.createElement('li');
        li.className = 'greview is-new';
        const stars = document.createElement('p');
        stars.className = 'stars';
        stars.setAttribute('aria-label', `${n} out of 5 stars`);
        stars.innerHTML = `${'★'.repeat(n)}<span class="stars__off">${'★'.repeat(5 - n)}</span>`;
        const text = Object.assign(document.createElement('p'), { textContent: form.elements.text.value.trim() });
        const who = Object.assign(document.createElement('span'), { textContent: `${form.elements.name.value.trim()} · just now` });
        li.append(stars, text, who);
        list.prepend(li);

        form.reset();
        paint(0);
        form.querySelector('.fld__counter').textContent = '0 / 280';
        thanks.hidden = false;
        thanks.focus();
        setTimeout(() => { thanks.hidden = true; }, 4000);
      },
    });

    paint(0);
  })();
})();
