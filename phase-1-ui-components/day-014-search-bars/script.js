/*!
 * Thecore · 100 Days of Web Development
 * Day 014: Search bars
 *
 * `combobox()` below handles the keyboard and popup behaviour shared by
 * the autocomplete demos (WAI-ARIA combobox pattern). Each demo only
 * decides what to show and what happens when an option is picked.
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;

  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /* Wrap every search term found in `text` with <mark>. */
  function highlight(text, terms) {
    const list = terms.filter(Boolean).sort((a, b) => b.length - a.length);
    if (!list.length) return escape(text);
    const re = new RegExp(`(${list.map(escapeRe).join('|')})`, 'gi');
    return text.split(re).map((part, i) => (i % 2 ? `<mark>${escape(part)}</mark>` : escape(part))).join('');
  }

  function focusSoon(el, tries = 10) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /* Run fn only after the user pauses for `ms`. */
  function debounce(fn, ms) {
    let t = 0;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  /* ======================================================================
     Shared combobox behaviour
     ----------------------------------------------------------------------
     fill()      → writes options (role="option") into the popup; returns
                   false when there is nothing to show.
     pick(opt)   → called with the chosen option element.
     ====================================================================== */
  function combobox(input, pop, { fill, pick, root = input.parentElement }) {
    let active = -1;
    const options = () => $$('[role="option"]', pop);

    function setActive(i) {
      const opts = options();
      active = opts.length && i >= 0 ? i % opts.length : -1;
      opts.forEach((o, n) => o.setAttribute('aria-selected', String(n === active)));
      if (active > -1) {
        input.setAttribute('aria-activedescendant', opts[active].id);
        opts[active].scrollIntoView({ block: 'nearest' });
      } else {
        input.removeAttribute('aria-activedescendant');
      }
    }

    function open() {
      const has = fill() !== false;
      pop.hidden = !has;
      input.setAttribute('aria-expanded', String(has));
      setActive(-1);
    }

    function close() {
      pop.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      setActive(-1);
    }

    input.addEventListener('focus', open);
    input.addEventListener('input', open);
    input.addEventListener('keydown', (e) => {
      const opts = options();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (pop.hidden) open(); else setActive(active + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (pop.hidden) open();
        setActive(active <= 0 ? opts.length - 1 : active - 1);
      } else if (e.key === 'Enter' && !pop.hidden && active > -1) {
        e.preventDefault();
        pick(opts[active]);
      } else if (e.key === 'Escape' && !pop.hidden) {
        e.preventDefault();
        e.stopPropagation();
        close();
      } else if (e.key === 'Tab') {
        close();
      }
    });

    pop.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in the input
    pop.addEventListener('pointermove', (e) => {
      const o = e.target.closest('[role="option"]');
      if (o) { const i = options().indexOf(o); if (i !== active) setActive(i); }
    });
    pop.addEventListener('click', (e) => {
      const o = e.target.closest('[role="option"]');
      if (o && !e.target.closest('[data-fill]')) pick(o);
    });
    document.addEventListener('pointerdown', (e) => { if (!root.contains(e.target)) close(); });

    return { open, close, get active() { return active > -1 ? options()[active] : null; } };
  }

  /* ======================================================================
     01 · Nova: shop autocomplete
     ====================================================================== */
  (() => {
    const form = $('[data-shop]');
    const input = $('[data-q]', form);
    const pop = $('[data-pop]', form);
    const scope = $('[data-scope]', form);
    const clearBtn = $('[data-clear]', form);
    const result = $('[data-shop-result]');

    const PRODUCTS = [
      ['Cloudstride running shoe', 'Shoes', 120, 210], ['Trail runner GTX', 'Shoes', 145, 140], ['Everyday white trainer', 'Shoes', 95, 260],
      ['Suede chelsea boot', 'Shoes', 180, 50], ['Leather tote', 'Bags', 165, 45], ['Canvas weekend tote', 'Bags', 70, 90],
      ['Leather crossbody bag', 'Bags', 135, 30], ['Roll-top backpack', 'Bags', 110, 230], ['Minimalist leather wallet', 'Accessories', 55, 40],
      ['Leather belt', 'Accessories', 48, 35], ['Merino running socks (3)', 'Accessories', 24, 300], ['Polarised sunglasses', 'Accessories', 89, 200],
      ['Running shorts', 'Accessories', 40, 180], ['Running cap', 'Accessories', 28, 160],
    ].map(([name, cat, price, h]) => ({ name, cat, price, h }));
    const TERMS = ['running shoes', 'running shorts', 'running socks', 'running cap', 'leather tote', 'leather wallet', 'leather belt', 'leather crossbody bag',
      'canvas tote', 'trail runners', 'white trainers', 'chelsea boots', 'backpack', 'sunglasses', 'tote bag', 'minimalist wallet'];
    const TRENDING = ['trail runners', 'leather wallet', 'crossbody bag'];
    let recent = ['white trainers', 'tote bag'];

    const words = (s) => s.toLowerCase().split(/\s+/).filter(Boolean);
    const inScope = (p) => !scope.value || p.cat === scope.value;
    const matches = (p, q) => words(q).every((w) => `${p.name} ${p.cat}`.toLowerCase().includes(w.replace(/s$/, '')));

    // Completion text: typed part normal, the rest bold (what you'd get by picking it).
    function completion(term, q) {
      const i = term.indexOf(q);
      if (i !== 0) return highlight(term, [q]);
      return `${escape(term.slice(0, q.length))}<b>${escape(term.slice(q.length))}</b>`;
    }

    const termOpt = (term, i, icon, q) => `
      <div class="opt" role="option" id="shop-o${i}" aria-selected="false" data-kind="term" data-term="${escape(term)}">
        <svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg>
        <span class="opt__main">${q ? completion(term, q) : escape(term)}</span>
        <span class="opt__fill" data-fill aria-hidden="true" title="Fill in"><svg class="icon"><use href="#i-fill"/></svg></span>
      </div>`;

    function fill() {
      const q = input.value.trim().toLowerCase();
      clearBtn.hidden = !input.value;
      let html = '';
      let i = 0;
      if (!q) {
        if (recent.length) {
          html += '<div class="pop__group" role="presentation">Recent<button type="button" data-clear-recent>Clear</button></div>';
          recent.forEach((t) => { html += termOpt(t, i++, 'i-clock'); });
        }
        html += '<div class="pop__group" role="presentation">Trending</div>';
        TRENDING.forEach((t) => { html += termOpt(t, i++, 'i-trend'); });
      } else {
        const terms = TERMS.filter((t) => words(q).every((w) => t.includes(w))).slice(0, 4);
        const prods = PRODUCTS.filter((p) => inScope(p) && matches(p, q)).slice(0, 3);
        terms.forEach((t) => { html += termOpt(t, i++, 'i-search', q); });
        if (prods.length) {
          html += `<div class="pop__group" role="presentation">Products${scope.value ? ` in ${scope.value}` : ''}</div>`;
          prods.forEach((p) => {
            html += `<div class="opt prod-opt" role="option" id="shop-o${i++}" aria-selected="false" data-kind="product" data-name="${escape(p.name)}">
              <span class="thumb" style="--h:${p.h}" aria-hidden="true"></span>
              <span class="opt__main"><span>${highlight(p.name, words(q))}</span><small>${p.cat}</small></span>
              <span class="opt__side">£${p.price}</span></div>`;
          });
        }
        if (!terms.length && !prods.length) html += '<p class="pop__title" role="presentation">No suggestions</p>';
        html += `<div class="opt opt--all" role="option" id="shop-o${i++}" aria-selected="false" data-kind="all">See all results for “${escape(input.value.trim())}”</div>`;
      }
      pop.innerHTML = html;
      return true;
    }

    function search(term) {
      const t = term.trim();
      if (!t) return;
      input.value = t;
      clearBtn.hidden = false;
      recent = [t.toLowerCase(), ...recent.filter((r) => r !== t.toLowerCase())].slice(0, 4);
      cb.close();
      const n = PRODUCTS.filter((p) => inScope(p) && matches(p, t)).length;
      result.textContent = `${n} ${n === 1 ? 'result' : 'results'} for “${t}”${scope.value ? ` in ${scope.value}` : ''}`;
    }

    const cb = combobox(input, pop, {
      root: form,
      fill,
      pick(opt) {
        if (opt.dataset.kind === 'product') {
          cb.close();
          result.textContent = `Opened product: ${opt.dataset.name}`;
        } else if (opt.dataset.kind === 'all') {
          search(input.value);
        } else {
          search(opt.dataset.term);
        }
      },
    });

    // Fill-in arrow (mouse) and → key (keyboard) copy a suggestion into the box without searching.
    function fillIn(term) {
      input.value = `${term} `;
      input.dispatchEvent(new Event('input'));
      input.focus();
    }
    pop.addEventListener('click', (e) => {
      const f = e.target.closest('[data-fill]');
      if (f) fillIn(f.closest('[data-term]').dataset.term);
      if (e.target.closest('[data-clear-recent]')) { recent = []; fill(); }
    });
    input.addEventListener('keydown', (e) => {
      const opt = cb.active;
      if (e.key === 'ArrowRight' && opt?.dataset.term && input.selectionStart === input.value.length) {
        e.preventDefault();
        fillIn(opt.dataset.term);
      }
    });

    form.addEventListener('submit', (e) => { e.preventDefault(); search(input.value); });
    clearBtn.addEventListener('click', () => { input.value = ''; input.focus(); cb.open(); });
    scope.addEventListener('change', () => {
      input.placeholder = scope.value ? `Search ${scope.value.toLowerCase()}…` : 'Search trainers, totes, wallets…';
      if (input.value.trim()) search(input.value);
    });
  })();

  /* ======================================================================
     02 · Wander: travel booking search
     ====================================================================== */
  (() => {
    const form = $('[data-trip]');
    const where = $('[data-where]', form);
    const wherePop = $('[data-where-pop]', form);
    const whenBtn = $('[data-when-btn]', form);
    const whenPop = $('[data-when-pop]', form);
    const whoBtn = $('[data-who-btn]', form);
    const whoPop = $('[data-who-pop]', form);
    const dates = $$('[data-dates] [role="radio"]', form);
    const errorEl = $('[data-trip-error]');
    const summary = $('[data-trip-summary]');
    const counts = { nights: 3, adults: 2, children: 0 };
    const LIMITS = { nights: [1, 30], adults: [1, 16], children: [0, 10] };

    const PLACES = [
      ['Lisbon', 'Portugal', 'City break', 30], ['Lima', 'Peru', 'Food & culture', 20], ['Lille', 'France', 'City break', 260],
      ['Ljubljana', 'Slovenia', 'Lakes & mountains', 150], ['Lake Como', 'Italy', 'Lakes & mountains', 210], ['Kyoto', 'Japan', 'Culture', 350],
      ['Cape Town', 'South Africa', 'Coast', 40], ['Reykjavík', 'Iceland', 'Northern lights', 190], ['Marrakech', 'Morocco', 'Culture', 25],
      ['Copenhagen', 'Denmark', 'City break', 240], ['Barcelona', 'Spain', 'Beach & city', 60], ['Bali', 'Indonesia', 'Beach', 160],
    ].map(([name, country, kind, h]) => ({ name, country, kind, h }));
    let place = null;

    // --- Where (combobox) ---
    const cb = combobox(where, wherePop, {
      fill() {
        const q = where.value.trim().toLowerCase();
        const list = q
          ? PLACES.filter((p) => `${p.name} ${p.country}`.toLowerCase().split(/\s+/).some((w) => w.startsWith(q)) || p.name.toLowerCase().includes(q))
          : PLACES.slice(0, 5);
        wherePop.innerHTML = (q ? '' : '<p class="pop__title" role="presentation">Popular right now</p>') + (list.length
          ? list.map((p, i) => `<div class="opt place-opt" role="option" id="where-o${i}" aria-selected="false" data-name="${p.name}">
              <span class="thumb" style="--h:${p.h}" aria-hidden="true"><svg class="icon"><use href="#i-pin"/></svg></span>
              <span class="opt__main"><span>${highlight(p.name, [q])}</span><small>${p.country} · ${p.kind}</small></span></div>`).join('')
          : `<p class="pop__title" role="presentation">No places match “${escape(where.value.trim())}”</p>`);
        closePanels();
        return true;
      },
      pick(opt) {
        place = PLACES.find((p) => p.name === opt.dataset.name);
        where.value = place.name;
        cb.close();
        clearError();
        openPanel('when'); // finishing one part moves you to the next
      },
    });
    where.addEventListener('input', () => { place = null; clearError(); });

    // --- When / Who panels ---
    const panels = { when: [whenBtn, whenPop], who: [whoBtn, whoPop] };

    function openPanel(name) {
      closePanels();
      cb.close();
      const [btn, pop] = panels[name];
      pop.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.closest('.trip__part').classList.add('is-active');
      const first = name === 'when' ? (dates.find((d) => d.tabIndex === 0) || dates[0]) : $('button:not(:disabled)', pop);
      focusSoon(first);
    }
    function closePanels(returnTo) {
      Object.values(panels).forEach(([btn, pop]) => {
        pop.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.closest('.trip__part').classList.remove('is-active');
      });
      if (returnTo) returnTo.focus();
    }

    whenBtn.addEventListener('click', () => (whenPop.hidden ? openPanel('when') : closePanels()));
    whoBtn.addEventListener('click', () => (whoPop.hidden ? openPanel('who') : closePanels()));
    Object.entries(panels).forEach(([, [btn, pop]]) => {
      pop.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); closePanels(btn); } });
    });
    document.addEventListener('pointerdown', (e) => {
      if (!e.target.closest('[data-part="when"], [data-part="who"]')) closePanels();
    });

    // Date chips: a radio group (arrow keys move, Enter/Space/click choose).
    function chooseDate(d, advance = true) {
      dates.forEach((x) => { x.setAttribute('aria-checked', String(x === d)); x.tabIndex = x === d ? 0 : -1; });
      updateLabels();
      if (advance) openPanel('who');
    }
    dates.forEach((d, i) => {
      d.addEventListener('click', () => chooseDate(d));
      d.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = dates[(i + step + dates.length) % dates.length];
        dates.forEach((x) => { x.tabIndex = x === next ? 0 : -1; });
        next.focus();
      });
    });

    // Steppers
    $$('[data-step]', form).forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.step;
      const [min, max] = LIMITS[k];
      counts[k] = Math.max(min, Math.min(max, counts[k] + Number(b.dataset.d)));
      updateLabels();
    }));
    $('[data-pets]', form).addEventListener('change', updateLabels);

    function updateLabels() {
      Object.entries(counts).forEach(([k, v]) => {
        $(`[data-out="${k}"]`, form).textContent = v;
        const [min, max] = LIMITS[k];
        $(`[data-step="${k}"][data-d="-1"]`, form).disabled = v <= min;
        $(`[data-step="${k}"][data-d="1"]`, form).disabled = v >= max;
      });
      const date = dates.find((d) => d.getAttribute('aria-checked') === 'true');
      const whenVal = $('[data-when-val]', form);
      whenVal.textContent = date ? `${date.dataset.v} · ${counts.nights} ${counts.nights === 1 ? 'night' : 'nights'}` : 'Add dates';
      whenBtn.classList.toggle('is-empty', !date);
      const who = [`${counts.adults} ${counts.adults === 1 ? 'adult' : 'adults'}`];
      if (counts.children) who.push(`${counts.children} ${counts.children === 1 ? 'child' : 'children'}`);
      if ($('[data-pets]', form).checked) who.push('pet');
      $('[data-who-val]', form).textContent = who.join(', ');
    }

    function clearError() {
      errorEl.textContent = '';
      where.closest('.trip__part').classList.remove('has-error');
      where.removeAttribute('aria-invalid');
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closePanels();
      cb.close();
      const typed = where.value.trim();
      if (!typed) {
        errorEl.textContent = 'Where would you like to go? Choose a destination first.';
        where.closest('.trip__part').classList.add('has-error');
        where.setAttribute('aria-invalid', 'true');
        summary.textContent = '';
        where.focus();
        return;
      }
      clearError();
      const name = place?.name || PLACES.find((p) => p.name.toLowerCase() === typed.toLowerCase())?.name || typed;
      summary.innerHTML = `Searching stays in <strong>${escape(name)}</strong> · ${escape($('[data-when-val]', form).textContent === 'Add dates' ? 'Any dates' : $('[data-when-val]', form).textContent)} · ${escape($('[data-who-val]', form).textContent)}`;
    });

    updateLabels();
  })();

  /* ======================================================================
     03 · Halden: expanding header search
     ====================================================================== */
  (() => {
    const section = $('#q-header');
    const studio = $('[data-studio]', section);
    const form = $('[data-xsearch]', studio);
    const input = $('[data-xs-input]', studio);
    const toggle = $('[data-xs-toggle]', studio);
    const panel = $('[data-xs-panel]', studio);
    const title = $('[data-xs-title]', studio);
    const listEl = $('[data-xs-links]', studio);

    const LINKS = [
      ['Nordlys: brand identity', 'Project'], ['Museum of Light: wayfinding', 'Project'], ['Fjord & Co. packaging', 'Project'],
      ['How we name brands', 'Journal'], ['Brand guidelines people actually use', 'Journal'], ['Designing for slow reading', 'Journal'],
      ['Our studio & team', 'Page'], ['Start a project', 'Page'],
    ];
    const isOpen = () => studio.classList.contains('is-searching');

    function render() {
      const q = input.value.trim().toLowerCase();
      const words = q.split(/\s+/).filter(Boolean);
      const list = q ? LINKS.filter(([t, k]) => words.every((w) => `${t} ${k}`.toLowerCase().includes(w))) : LINKS.slice(0, 4);
      title.textContent = q ? `${list.length} ${list.length === 1 ? 'result' : 'results'}` : 'Popular';
      listEl.innerHTML = list.length
        ? list.map(([t, k]) => `<li><a href="#"><svg class="icon" aria-hidden="true"><use href="#${k === 'Journal' ? 'i-book' : 'i-chevron-right'}"/></svg><span>${highlight(t, words)}</span><small>${k}</small></a></li>`).join('')
        : `<li class="xsearch__none">Nothing for “${escape(input.value.trim())}”. Try “brand” or “packaging”.</li>`;
    }

    function open() {
      if (isOpen()) { input.focus(); return; }
      studio.classList.add('is-searching');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close search');
      input.tabIndex = 0;
      panel.hidden = false;
      render();
      focusSoon(input);
    }
    function close(focusToggle = true) {
      if (!isOpen()) return;
      studio.classList.remove('is-searching');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open search');
      input.tabIndex = -1;
      input.value = '';
      panel.hidden = true;
      if (focusToggle) toggle.focus();
    }

    toggle.addEventListener('click', () => (isOpen() ? close() : open()));
    input.addEventListener('input', render);
    form.addEventListener('submit', (e) => { e.preventDefault(); $('a', listEl)?.focus(); });

    // ↓ from the box goes into the results; ↑ ↓ move between them.
    studio.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      const links = $$('a', listEl);
      const i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && (document.activeElement === input || i > -1)) { e.preventDefault(); links[Math.min(i + 1, links.length - 1)]?.focus(); }
      if (e.key === 'ArrowUp' && i > -1) { e.preventDefault(); (i === 0 ? input : links[i - 1]).focus(); }
    });
    listEl.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      e.preventDefault();
      title.textContent = `Opening “${a.querySelector('span').textContent}”…`;
    });
    document.addEventListener('pointerdown', (e) => {
      if (isOpen() && !form.contains(e.target) && !panel.contains(e.target)) close(false);
    });

    // "/" opens search while the demo is on screen, unless you're typing somewhere.
    let inView = false;
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; }, { threshold: 0.5 }).observe($('.frame', section));
    document.addEventListener('keydown', (e) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || !inView) return;
      if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      open();
    });
  })();

  /* ======================================================================
     04 · Lumen: filter-token search
     ====================================================================== */
  (() => {
    const root = $('[data-issues]');
    const box = $('[data-tsearch]', root);
    const input = $('[data-tq]', root);
    const pop = $('[data-tpop]', root);
    const chipsEl = $('[data-tchips]', root);
    const clearBtn = $('[data-tclear]', root);
    const countEl = $('[data-tcount]', root);
    const listEl = $('[data-tlist]', root);

    const PEOPLE = { riya: ['Riya Sharma', 265], tom: ['Tom Ashby', 150], kai: ['Kai Nakamura', 210], ingrid: ['Ingrid Sørensen', 30] };
    const LABEL_C = { bug: 'oklch(60% 0.2 25)', feature: 'oklch(58% 0.17 285)', design: 'oklch(62% 0.16 330)', docs: 'oklch(60% 0.12 200)' };
    const PRI_C = { high: 'oklch(60% 0.2 25)', medium: 'oklch(70% 0.15 70)', low: 'oklch(65% 0.05 260)' };
    const KEYS = {
      status: { desc: 'open or closed', values: ['open', 'closed'] },
      owner: { desc: 'who it is assigned to', values: Object.keys(PEOPLE) },
      label: { desc: 'bug, feature, design, docs', values: Object.keys(LABEL_C) },
      priority: { desc: 'high, medium, low', values: Object.keys(PRI_C) },
    };
    const ISSUES = [
      [142, 'Login button unresponsive on Safari', 'open', 'tom', ['bug'], 'high'],
      [141, 'Add dark mode to the billing page', 'open', 'riya', ['feature', 'design'], 'medium'],
      [139, 'Password reset email arrives late', 'open', 'kai', ['bug'], 'high'],
      [138, 'Document the webhooks API', 'open', 'ingrid', ['docs'], 'low'],
      [136, 'Redesign the empty states', 'closed', 'riya', ['design'], 'medium'],
      [133, 'Login with Google on mobile', 'open', 'tom', ['feature'], 'medium'],
      [131, 'Chart tooltips cut off at small widths', 'closed', 'riya', ['bug', 'design'], 'low'],
      [128, 'Export reports as CSV', 'closed', 'kai', ['feature'], 'medium'],
      [126, 'Typos in the onboarding guide', 'closed', 'ingrid', ['docs'], 'low'],
      [124, 'Session expires during login on slow networks', 'open', 'kai', ['bug'], 'medium'],
      [121, 'Team invite links expire too quickly', 'open', 'tom', ['bug', 'feature'], 'low'],
      [119, 'New pricing page illustrations', 'open', 'riya', ['design'], 'low'],
    ].map(([n, title, status, owner, label, priority]) => ({ n, title, status, owner, label, priority }));

    let chips = [{ k: 'status', v: 'open' }];
    let pendingDelete = false;

    // --- Filtering: OR inside the same key, AND across keys and words. ---
    function render() {
      const byKey = {};
      const words = [];
      chips.forEach((c) => { if (c.k) (byKey[c.k] ||= []).push(c.v); else words.push(c.v); });
      const live = input.value.trim();
      if (live && !live.includes(':')) words.push(live.toLowerCase());
      const list = ISSUES.filter((it) =>
        Object.entries(byKey).every(([k, vs]) => vs.some((v) => [].concat(it[k]).includes(v))) &&
        words.every((w) => it.title.toLowerCase().includes(w)));

      countEl.textContent = `${list.length} ${list.length === 1 ? 'issue' : 'issues'}`;
      listEl.innerHTML = list.length ? list.map((it) => `
        <li class="issue issue--${it.status}">
          <svg class="icon" aria-label="${it.status}"><use href="#${it.status === 'open' ? 'i-circle-dot' : 'i-check-circle'}"/></svg>
          <div>
            <p class="issue__title">${highlight(it.title, words)}</p>
            <p class="issue__meta">#${it.n} · <span class="label" style="--c:${PRI_C[it.priority]}">${it.priority}</span>${it.label.map((l) => `<span class="label" style="--c:${LABEL_C[l]}">${l}</span>`).join('')}</p>
          </div>
          <span class="avatar" style="--h:${PEOPLE[it.owner][1]}" title="${PEOPLE[it.owner][0]}" aria-label="Owner: ${PEOPLE[it.owner][0]}">${PEOPLE[it.owner][0].split(' ').map((p) => p[0]).join('')}</span>
        </li>`).join('') : '<li class="issue-empty">No issues match these filters. Remove a chip to see more.</li>';

      chipsEl.innerHTML = chips.map((c, i) => `
        <li class="tchip${c.k ? '' : ' tchip--word'}${pendingDelete && i === chips.length - 1 ? ' is-pending' : ''}">
          ${c.k ? `<span class="tchip__k">${c.k}:</span>` : ''}<span class="tchip__v">${escape(c.v)}</span>
          <button type="button" data-i="${i}" aria-label="Remove filter ${escape(c.k ? `${c.k}:${c.v}` : c.v)}"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button>
        </li>`).join('');
      clearBtn.hidden = !chips.length && !input.value;
    }

    function addToken(raw) {
      const t = raw.trim();
      if (!t) return true;
      if (/^\w+:$/.test(t)) { countEl.textContent = `Choose a value for “${t}”.`; return false; }
      const m = t.match(/^(\w+):(.+)$/);
      if (m) {
        const k = m[1].toLowerCase();
        const v = m[2].toLowerCase();
        if (!KEYS[k] || !KEYS[k].values.includes(v)) {
          countEl.textContent = KEYS[k] ? `“${v}” isn't a valid ${k}. Try: ${KEYS[k].values.join(', ')}.` : `Unknown filter “${k}:”. Try status, owner, label or priority.`;
          input.setAttribute('aria-invalid', 'true');
          return false;
        }
        if (!chips.some((c) => c.k === k && c.v === v)) chips.push({ k, v });
      } else if (!chips.some((c) => !c.k && c.v === t.toLowerCase())) {
        chips.push({ v: t.toLowerCase() });
      }
      input.removeAttribute('aria-invalid');
      return true;
    }

    const cb = combobox(input, pop, {
      root: box,
      fill() {
        const t = input.value.trim().toLowerCase();
        const m = t.match(/^(\w+):(.*)$/);
        let opts = [];
        if (m && KEYS[m[1]]) {
          opts = KEYS[m[1]].values.filter((v) => v.startsWith(m[2])).map((v) => ({
            token: `${m[1]}:${v}`,
            html: `${m[1] === 'owner' ? `<span class="avatar" style="--h:${PEOPLE[v][1]};width:1.4rem;height:1.4rem;font-size:.5rem" aria-hidden="true">${PEOPLE[v][0].split(' ').map((p) => p[0]).join('')}</span>` : `<span class="dot" style="--c:${LABEL_C[v] || PRI_C[v] || (v === 'open' ? 'var(--color-success)' : 'oklch(58% 0.2 300)')}"></span>`}<span class="opt__main"><code>${m[1]}:</code><b>${v}</b></span>${m[1] === 'owner' ? `<span class="opt__side">${PEOPLE[v][0]}</span>` : ''}`,
          }));
        } else {
          opts = Object.entries(KEYS).filter(([k]) => k.startsWith(t)).map(([k, d]) => ({
            key: `${k}:`,
            html: `<span class="opt__main"><code>${k}:</code></span><span class="opt__side">${d.desc}</span>`,
          }));
          if (t && !t.includes(':')) opts.push({ word: t, html: `<svg class="icon" aria-hidden="true"><use href="#i-search"/></svg><span class="opt__main">Titles containing “${escape(t)}”</span>` });
        }
        if (!opts.length) return false;
        pop.innerHTML = opts.map((o, i) => `<div class="opt" role="option" id="ts-o${i}" aria-selected="false" ${o.token ? `data-token="${o.token}"` : o.key ? `data-key="${o.key}"` : `data-word="${escape(o.word)}"`}>${o.html}</div>`).join('');
        return true;
      },
      pick(opt) {
        if (opt.dataset.key) {
          input.value = opt.dataset.key; // keep going: now suggest values
          cb.open();
          input.focus();
          return;
        }
        addToken(opt.dataset.token || opt.dataset.word);
        input.value = '';
        render();
        cb.open();
        input.focus();
      },
    });

    input.addEventListener('input', () => {
      pendingDelete = false;
      input.removeAttribute('aria-invalid');
      // A space after a complete filter turns it into a chip.
      if (/\s$/.test(input.value) && /^\w+:\S+\s$/.test(input.value)) {
        if (addToken(input.value)) { input.value = ''; cb.open(); }
      }
      render();
    });

    input.addEventListener('keydown', (e) => {
      if (e.defaultPrevented) return; // the suggestion list already handled this key
      if (e.key === 'Enter' && input.value.trim() && !cb.active) {
        e.preventDefault();
        if (addToken(input.value)) { input.value = ''; render(); cb.open(); }
      } else if (e.key === 'Backspace' && !input.value && chips.length) {
        // First Backspace highlights the last chip, the second removes it.
        e.preventDefault();
        if (pendingDelete) { const c = chips.pop(); pendingDelete = false; render(); countEl.textContent += ` · removed ${c.k ? `${c.k}:${c.v}` : c.v}`; }
        else { pendingDelete = true; render(); }
      }
    });

    chipsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      chips.splice(Number(b.dataset.i), 1);
      render();
      input.focus();
    });
    box.addEventListener('click', (e) => { if (e.target === box || e.target === chipsEl) input.focus(); });
    clearBtn.addEventListener('click', () => { chips = []; input.value = ''; render(); input.focus(); });

    render();
  })();

  /* ======================================================================
     05 · Ember: live search + did you mean
     ====================================================================== */
  (() => {
    const root = $('[data-recipes]');
    const input = $('[data-rq]', root);
    const sortSel = $('[data-rsort]', root);
    const status = $('[data-rstatus]', root);
    const listEl = $('[data-rlist]', root);
    const quick = $$('[data-quick] button', root);

    const RECIPES = [
      ['Wild mushroom risotto', 'arborio rice, mushroom, parmesan, thyme', 40, 4.8, 'vegetarian'],
      ['Chicken & leek pie', 'chicken, leek, pastry, cream', 70, 4.7, ''],
      ['Lemon garlic spaghetti', 'spaghetti pasta, lemon, garlic, parsley', 20, 4.5, 'vegetarian'],
      ['Roast chicken with herbs', 'chicken, rosemary, garlic, lemon', 90, 4.9, ''],
      ['Butternut squash soup', 'squash, onion, ginger, coconut', 35, 4.4, 'vegetarian vegan'],
      ['Pea & mint risotto', 'arborio rice, peas, mint, parmesan', 30, 4.3, 'vegetarian'],
      ['Spicy chicken tacos', 'chicken, tortilla, chilli, lime', 25, 4.6, ''],
      ['Mushroom stroganoff', 'mushroom, paprika, cream, rice', 25, 4.5, 'vegetarian'],
      ['Salmon with crispy potatoes', 'salmon, potato, dill, lemon', 35, 4.7, ''],
      ['Tomato & basil pasta', 'penne pasta, tomato, basil, garlic', 15, 4.2, 'vegetarian vegan'],
      ['Beef ragù', 'beef, tomato, red wine, pappardelle pasta', 180, 4.9, ''],
      ['Thai green curry', 'chicken, coconut, green curry, rice', 30, 4.6, ''],
      ['Shakshuka', 'eggs, tomato, pepper, cumin', 25, 4.5, 'vegetarian'],
      ['Mushroom & spinach lasagne', 'mushroom, spinach, ricotta, lasagne pasta', 75, 4.6, 'vegetarian'],
      ['Chickpea & spinach curry', 'chickpea, spinach, tomato, garam masala', 30, 4.4, 'vegetarian vegan'],
      ['Crispy tofu stir-fry', 'tofu, broccoli, soy, noodles', 20, 4.3, 'vegetarian vegan'],
      ['Fish pie', 'cod, prawns, potato, cream', 60, 4.5, ''],
      ['Carbonara', 'spaghetti pasta, eggs, pecorino, guanciale', 20, 4.8, ''],
      ['Greek salad', 'tomato, cucumber, feta, olives', 10, 4.2, 'vegetarian'],
      ['Lamb tagine', 'lamb, apricot, chickpea, couscous', 150, 4.7, ''],
      ['Sweet potato fries', 'sweet potato, paprika, olive oil', 35, 4.1, 'vegetarian vegan'],
      ['Chocolate fondant', 'chocolate, butter, eggs, sugar', 25, 4.9, 'vegetarian dessert'],
      ['Apple crumble', 'apple, oats, butter, cinnamon', 50, 4.6, 'vegetarian dessert'],
      ['Banana bread', 'banana, flour, walnuts, eggs', 65, 4.4, 'vegetarian dessert'],
    ].map(([name, ing, time, rating, tags], i) => ({ name, ing, time, rating, tags, h: (i * 53) % 360 }));

    // Every word the search knows, for spelling suggestions.
    const VOCAB = [...new Set(RECIPES.flatMap((r) => `${r.name} ${r.ing} ${r.tags}`.toLowerCase().split(/[^a-zà-ÿ]+/)).filter((w) => w.length > 2))];

    function distance(a, b) {
      const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
      for (let j = 1; j <= b.length; j++) dp[0][j] = j;
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
          if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1); // swapped letters
        }
      }
      return dp[a.length][b.length];
    }
    function suggest(word) {
      const max = word.length < 5 ? 1 : 2;
      let best = null;
      VOCAB.forEach((v) => { const d = distance(word, v); if (d <= max && (!best || d < best.d)) best = { v, d }; });
      return best?.v;
    }

    function parse(q) {
      let text = q.toLowerCase();
      let maxTime = Infinity;
      text = text.replace(/under\s*(\d+)\s*(min|mins|minutes)?/, (_, n) => { maxTime = Number(n); return ''; });
      return { words: text.split(/\s+/).filter(Boolean), maxTime };
    }

    function run() {
      const q = input.value.trim();
      const { words, maxTime } = parse(q);
      quick.forEach((b) => b.setAttribute('aria-pressed', String(b.textContent === q.toLowerCase())));

      const scored = RECIPES.map((r) => {
        const name = r.name.toLowerCase();
        const all = `${name} ${r.ing} ${r.tags}`;
        if (r.time > maxTime || !words.every((w) => all.includes(w))) return null;
        const score = words.reduce((s, w) => s + (name.includes(w) ? 3 : 1), 0) + r.rating / 10;
        return { r, score };
      }).filter(Boolean);

      const sort = sortSel.value;
      scored.sort((a, b) => (sort === 'time' ? a.r.time - b.r.time : sort === 'rating' ? b.r.rating - a.r.rating : b.score - a.score));

      if (!q) status.innerHTML = `All <strong>${RECIPES.length}</strong> recipes`;
      else if (scored.length) status.innerHTML = `<strong>${scored.length}</strong> ${scored.length === 1 ? 'recipe' : 'recipes'} for “${escape(q)}”`;

      if (!scored.length) {
        // Try to fix each unknown word.
        const fixed = words.map((w) => (VOCAB.some((v) => v.includes(w)) ? w : suggest(w) || w));
        const fixedQ = fixed.join(' ') + (maxTime < Infinity ? ` under ${maxTime} min` : '');
        const changed = fixed.some((w, i) => w !== words[i]);
        status.innerHTML = changed
          ? `No recipes for “${escape(q)}”. Did you mean <button type="button" class="dym" data-dym="${escape(fixedQ)}">${escape(fixedQ)}</button>?`
          : `No recipes for “${escape(q)}”.`;
        listEl.innerHTML = `<li class="rempty"><p>Nothing matched${maxTime < Infinity ? ` in under ${maxTime} minutes` : ''}.</p><p>Try a single ingredient like <button type="button" class="dym" data-dym="mushroom">mushroom</button> or <button type="button" class="dym" data-dym="pasta">pasta</button>.</p></li>`;
        return;
      }

      listEl.innerHTML = scored.map(({ r }) => `
        <li class="rcard">
          <span class="thumb" style="--h:${r.h}" aria-hidden="true"></span>
          <div>
            <strong>${highlight(r.name, words)}</strong>
            <small>${highlight(r.ing, words)}</small>
            <span class="rmeta"><span>${r.time < 60 ? `${r.time} min` : `${Math.floor(r.time / 60)} h${r.time % 60 ? ` ${r.time % 60} min` : ''}`}</span><span>★ ${r.rating.toFixed(1)}</span>${r.tags.includes('vegan') ? '<span>Vegan</span>' : r.tags.includes('vegetarian') ? '<span>Vegetarian</span>' : ''}</span>
          </div>
        </li>`).join('');
    }

    const runSoon = debounce(run, 150);
    input.addEventListener('input', runSoon);
    sortSel.addEventListener('change', run);
    $('[data-rform]', root).addEventListener('submit', (e) => { e.preventDefault(); run(); });
    quick.forEach((b) => b.addEventListener('click', () => {
      input.value = b.getAttribute('aria-pressed') === 'true' ? '' : b.textContent;
      run();
    }));
    root.addEventListener('click', (e) => {
      const d = e.target.closest('[data-dym]');
      if (!d) return;
      input.value = d.dataset.dym;
      run();
      input.focus();
    });

    run();
  })();

  /* ======================================================================
     06 · Atlas: async help-centre search
     ====================================================================== */
  (() => {
    const root = $('[data-help]');
    const form = $('[data-hform]', root);
    const input = $('[data-hq]', root);
    const spin = $('[data-hspin]', root);
    const mic = $('[data-hmic]', root);
    const out = $('[data-hresults]', root);

    const ARTICLES = [
      ['Connect a custom domain', 'Point your domain at Atlas with an A record or CNAME, then verify it in Settings → Domains.', 'Domains'],
      ['Fix “domain not verified” errors', 'DNS changes can take up to 48 hours. Here is how to check propagation and common mistakes.', 'Domains'],
      ['Set up HTTPS certificates', 'Atlas issues free certificates automatically once your domain is verified.', 'Domains'],
      ['Roll back a deployment', 'Promote any previous deployment to production in one click, without rebuilding.', 'Deployments'],
      ['Environment variables', 'Store API keys and secrets per environment. They are encrypted at rest.', 'Deployments'],
      ['Why did my build fail?', 'Read the build log, check your Node version and make sure lock files are committed.', 'Deployments'],
      ['Invite your team', 'Add teammates by email and choose their role: Owner, Admin, Member or Viewer.', 'Teams'],
      ['Change your billing plan', 'Upgrade, downgrade or cancel at any time. Changes are prorated to the day.', 'Billing'],
      ['Download invoices', 'Every invoice is available as a PDF under Settings → Billing.', 'Billing'],
      ['Enable two-factor authentication', 'Protect your account with an authenticator app or a security key.', 'Account'],
    ].map(([title, body, cat]) => ({ title, body, cat }));
    const POPULAR = [0, 3, 6];

    // A pretend server: random delay, can be cancelled, fails the first time for "error".
    const failedOnce = new Set();
    function fakeSearch(q, signal) {
      return new Promise((resolve, reject) => {
        const t = setTimeout(() => {
          if (q.includes('error') && !failedOnce.has(q)) { failedOnce.add(q); reject(new Error('Server unavailable (503)')); return; }
          const words = q.toLowerCase().split(/\s+/).filter(Boolean);
          resolve(ARTICLES.filter((a) => words.every((w) => `${a.title} ${a.body} ${a.cat}`.toLowerCase().includes(w.replace(/s$/, '')))));
        }, 450 + Math.random() * 650);
        signal.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); });
      });
    }

    const article = (a, words) => `
      <a class="harticle" href="#">
        <svg class="icon" aria-hidden="true"><use href="#i-book"/></svg>
        <div><strong>${highlight(a.title, words)}</strong><p>${highlight(a.body, words)}</p><small>${a.cat}</small></div>
      </a>`;

    function showPopular() {
      out.innerHTML = `<p class="hresults__meta">Popular articles</p>${POPULAR.map((i) => article(ARTICLES[i], [])).join('')}`;
    }

    let controller = null;
    async function search(q) {
      controller?.abort(); // a newer search makes older answers irrelevant
      if (q.length < 2) { spin.hidden = true; out.setAttribute('aria-busy', 'false'); showPopular(); return; }
      controller = new AbortController();
      const mine = controller;
      spin.hidden = false;
      out.setAttribute('aria-busy', 'true');
      out.innerHTML = '<div class="hskel" aria-hidden="true"><span></span><span></span><span></span></div><span class="sr-only">Searching…</span>';
      const started = performance.now();
      try {
        const results = await fakeSearch(q, mine.signal);
        const secs = ((performance.now() - started) / 1000).toFixed(1);
        const words = q.toLowerCase().split(/\s+/).filter(Boolean);
        out.innerHTML = results.length
          ? `<p class="hresults__meta">${results.length} ${results.length === 1 ? 'article' : 'articles'} for “${escape(q)}” · ${secs} s</p>${results.map((a) => article(a, words)).join('')}`
          : `<div class="hstate"><svg class="icon" aria-hidden="true"><use href="#i-search"/></svg><p><strong>No articles for “${escape(q)}”.</strong></p><p>Try fewer words, or <a class="link-btn" href="#">contact support</a>, as we reply within a few hours.</p></div>`;
      } catch (err) {
        if (err.name === 'AbortError') return;
        out.innerHTML = `<div class="hstate hstate--error" role="alert"><svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg><p><strong>Search is having trouble.</strong> ${escape(err.message)}. Your search was kept.</p><button class="btn btn--outline btn--sm" type="button" data-retry>Retry</button></div>`;
      } finally {
        if (controller === mine) { spin.hidden = true; out.setAttribute('aria-busy', 'false'); }
      }
    }

    const searchSoon = debounce(() => search(input.value.trim()), 350);
    input.addEventListener('input', searchSoon);
    form.addEventListener('submit', (e) => { e.preventDefault(); search(input.value.trim()); });
    out.addEventListener('click', (e) => {
      if (e.target.closest('[data-retry]')) { search(input.value.trim()); input.focus(); return; }
      if (e.target.closest('a')) e.preventDefault();
    });
    $('[data-htry]', root).addEventListener('click', (e) => { input.value = e.currentTarget.dataset.htry; search(input.value); input.focus(); });

    // Voice input, only where the browser supports it.
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (Speech) {
      mic.hidden = false;
      let rec = null;
      mic.addEventListener('click', () => {
        if (rec) { rec.stop(); return; }
        rec = new Speech();
        rec.lang = document.documentElement.lang || 'en';
        rec.interimResults = true;
        rec.onresult = (ev) => {
          input.value = Array.from(ev.results).map((r) => r[0].transcript).join('');
          searchSoon();
        };
        rec.onerror = () => { input.placeholder = 'Voice search unavailable. Please type instead.'; };
        rec.onend = () => { rec = null; mic.setAttribute('aria-pressed', 'false'); };
        mic.setAttribute('aria-pressed', 'true');
        try { rec.start(); } catch (e) { rec = null; mic.setAttribute('aria-pressed', 'false'); }
      });
    }

    showPopular();
  })();
})();
