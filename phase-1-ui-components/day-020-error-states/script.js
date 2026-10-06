/*!
 * Thecore · 100 Days of Web Development
 * Day 020: Error & empty states
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;
  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function focusSoon(el, tries = 10) {
    if (!el) return;
    el.focus({ preventScroll: true });
    if (document.activeElement !== el && tries > 0) requestAnimationFrame(() => focusSoon(el, tries - 1));
  }

  /* Call back once when an element first scrolls into view. */
  function onFirstView(el, fn) {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); fn(); } }, { threshold: 0.3 });
    io.observe(el);
  }

  /* Edit distance, used for “did you mean”. */
  function distance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
  }

  /* ======================================================================
     01 · Halden: helpful 404
     ====================================================================== */
  (() => {
    const root = $('[data-404]');
    const eyes = $('[data-eyes]', root);
    const badPath = $('[data-bad-path]', root).textContent;
    const PAGES = [
      ['/work/nordlys-identity', 'Nordlys: brand identity', 'Project'],
      ['/work/museum-of-light', 'Museum of Light: wayfinding', 'Project'],
      ['/work/fjord-packaging', 'Fjord & Co. packaging', 'Project'],
      ['/journal/how-we-name-brands', 'How we name brands', 'Journal'],
      ['/journal/brand-guidelines', 'Brand guidelines people actually use', 'Journal'],
      ['/studio', 'Our studio & team', 'Page'],
      ['/contact', 'Start a project', 'Page'],
    ];

    // Did you mean: the known page whose address is closest to the broken one.
    const best = PAGES.map(([path, title]) => ({ path, title, d: distance(badPath, path) })).sort((a, b) => a.d - b.d)[0];
    if (best.d <= Math.max(4, badPath.length * 0.3)) {
      $('[data-dym]', root).innerHTML = `Did you mean <a href="#" data-go="${best.path}">${escape(best.title)}</a>?`;
    }
    root.addEventListener('click', (e) => {
      const a = e.target.closest('[data-go], [data-home], .err__links a');
      if (!a) return;
      e.preventDefault();
      $('[data-404-result]', root).textContent = `In a real site this would open ${a.dataset.go || 'that page'}.`;
    });

    // Eyes follow the pointer (skipped when motion is reduced).
    const pupils = $$('i', eyes);
    root.addEventListener('pointermove', (e) => {
      if (reducedMotion.matches) return;
      pupils.forEach((p) => {
        const r = p.parentElement.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const len = Math.hypot(dx, dy) || 1;
        const reach = Math.min(9, len / 12);
        p.style.setProperty('--ex', `${(dx / len) * reach}px`);
        p.style.setProperty('--ey', `${(dy / len) * reach}px`);
      });
    });
    root.addEventListener('pointerleave', () => pupils.forEach((p) => { p.style.removeProperty('--ex'); p.style.removeProperty('--ey'); }));
    setInterval(() => {
      if (document.hidden || reducedMotion.matches) return;
      eyes.classList.remove('is-blink');
      eyes.getBoundingClientRect();
      eyes.classList.add('is-blink');
    }, 4200);

    $('[data-404-search]', root).addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('[data-404-q]', root).value.trim().toLowerCase();
      const out = $('[data-404-result]', root);
      if (!q) { out.textContent = 'Type something to search for.'; return; }
      const hits = PAGES.filter(([path, title, kind]) => `${path} ${title} ${kind}`.toLowerCase().includes(q));
      out.innerHTML = hits.length
        ? `Found: ${hits.slice(0, 3).map(([path, title]) => `<a href="#" data-go="${path}">${escape(title)}</a>`).join(', ')}${hits.length > 3 ? ` and ${hits.length - 3} more` : ''}.`
        : `Nothing for “${escape(q)}”. Try “brand” or “packaging”.`;
    });

    $('[data-report]', root).addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      btn.textContent = 'Reported';
      $('[data-reported]', root).textContent = `✓ Thanks! We've told our web team about ${badPath}.`;
    });
  })();

  /* ======================================================================
     02 · Atlas: server error with auto-retry (exponential backoff)
     ====================================================================== */
  (() => {
    const root = $('[data-500]');
    const errorPanel = $('[data-500-error]', root);
    const okPanel = $('[data-500-ok]', root);
    const status = $('[data-retry-status]', root);
    const text = $('[data-retry-text]', root);
    const ring = $('[data-ring]', root);
    const now = $('[data-retry-now]', root);
    const SUCCEEDS_ON = 3;
    let attempt = 0;
    let timer = 0;
    let busy = false;

    const id = () => `ATL-503-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    function reset() {
      clearInterval(timer);
      attempt = 0;
      busy = false;
      const ref = id();
      $('[data-err-id]', root).textContent = ref;
      $('[data-tech]', root).textContent = `status:   503 Service Unavailable\nrequest:  ${ref}\nendpoint: GET /api/projects/website/deployments\nregion:   eu-west-2\ntime:     ${new Date().toISOString()}`;
      errorPanel.hidden = false;
      okPanel.hidden = true;
      schedule();
    }

    // Wait 2 s, then 4 s, then 8 s… between tries, so a struggling server isn't flooded.
    function schedule() {
      clearInterval(timer);
      const delay = 2000 * 2 ** attempt;
      const started = Date.now();
      status.classList.remove('is-trying');
      const update = () => {
        const left = Math.max(0, delay - (Date.now() - started));
        ring.parentElement.parentElement.style.setProperty('--p', String(1 - left / delay));
        text.textContent = `${attempt ? `Attempt ${attempt} failed. ` : ''}Trying again in ${Math.ceil(left / 1000)} s…`;
        if (left <= 0) { clearInterval(timer); tryNow(); }
      };
      update();
      timer = setInterval(update, 250);
    }

    async function tryNow() {
      if (busy) return;
      busy = true;
      clearInterval(timer);
      attempt += 1;
      status.classList.add('is-trying');
      text.textContent = `Trying again (attempt ${attempt})…`;
      now.disabled = true;
      await wait(900);
      now.disabled = false;
      busy = false;
      if (attempt >= SUCCEEDS_ON) {
        errorPanel.hidden = true;
        okPanel.hidden = false;
        $('[data-attempts]', root).textContent = attempt;
        focusSoon(okPanel);
        return;
      }
      schedule();
    }

    now.addEventListener('click', tryNow);
    $('[data-500-reset]', root).addEventListener('click', () => { reset(); focusSoon(now); });
    $('[data-copy-id]', root).addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const ok = await copyText($('[data-err-id]', root).textContent);
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', ok ? 'Reference copied' : 'Select the code to copy it');
      if (!ok) getSelection().selectAllChildren($('[data-err-id]', root));
      setTimeout(() => { btn.classList.remove('is-copied'); btn.setAttribute('aria-label', 'Copy reference code'); }, 2000);
    });

    // Only start counting once someone can see it.
    $('[data-err-id]', root).textContent = '…';
    onFirstView(root, reset);
  })();

  /* ======================================================================
     03 · Lumen: offline mode with a change queue
     ====================================================================== */
  (() => {
    const root = $('[data-offline]');
    const sim = $('[data-sim-online]', root);
    const bar = $('[data-netbar]', root);
    const list = $('[data-tasks]', root);
    const input = $('[data-newtask]', root);
    const info = $('[data-syncinfo]', root);
    let uid = 0;
    let lastSync = new Date();
    let syncing = false;
    let okTimer = 0;
    const tasks = ['Send Nordlys invoice', 'Review pricing page copy', 'Book photographer for Friday'].map((t, i) => ({ id: ++uid, text: t, done: i === 1, state: 'synced' }));

    const online = () => sim.checked && navigator.onLine;
    const pending = () => tasks.filter((t) => t.state === 'pending').length;
    const ICONS = { synced: ['i-cloud', 'Saved'], pending: ['i-wifi-off', 'Waiting to sync'], syncing: ['i-retry', 'Syncing…'] };

    function render(focusId) {
      list.innerHTML = tasks.map((t) => `
        <li class="task is-${t.state}${t.done ? ' is-done' : ''}">
          <input type="checkbox" id="task-${t.id}" data-id="${t.id}" ${t.done ? 'checked' : ''}>
          <label for="task-${t.id}">${escape(t.text)}</label>
          <span class="task__state"><svg class="icon" aria-hidden="true"><use href="#${ICONS[t.state][0]}"/></svg>${ICONS[t.state][1]}</span>
        </li>`).join('');
      info.textContent = `Last synced ${lastSync.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}${pending() ? ` · ${pending()} ${pending() === 1 ? 'change' : 'changes'} waiting` : ''}`;
      if (focusId) $(`[data-id="${focusId}"]`, list)?.focus();
    }

    function banner(kind, html) {
      clearTimeout(okTimer);
      bar.hidden = !kind;
      if (!kind) return;
      bar.className = `netbar netbar--${kind}`;
      bar.innerHTML = html;
      if (kind === 'ok') okTimer = setTimeout(() => { bar.hidden = true; }, 3500);
    }

    function offlineBanner() {
      const n = pending();
      banner('off', `<svg class="icon" aria-hidden="true"><use href="#i-wifi-off"/></svg>You're offline. Keep working: changes are saved on this device.${n ? `<small>${n} waiting</small>` : ''}`);
    }

    async function sync() {
      if (syncing || !online()) return;
      const queue = tasks.filter((t) => t.state === 'pending');
      if (!queue.length) { banner('ok', '<svg class="icon" aria-hidden="true"><use href="#i-wifi"/></svg>Back online.'); return; }
      syncing = true;
      banner('sync', `<svg class="icon" aria-hidden="true"><use href="#i-retry"/></svg>Back online. Syncing ${queue.length} ${queue.length === 1 ? 'change' : 'changes'}…`);
      for (const t of queue) {
        if (!online()) break; // lost the connection again mid-sync: stop, keep the rest queued
        t.state = 'syncing';
        render(document.activeElement?.dataset?.id);
        await wait(450);
        t.state = 'synced';
        lastSync = new Date();
        render(document.activeElement?.dataset?.id);
      }
      syncing = false;
      if (online()) banner('ok', `<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>All changes synced.`);
      else offlineBanner();
    }

    // Each change saves straight away when online, or joins the queue when offline.
    function save(t) {
      if (online()) {
        t.state = 'syncing';
        setTimeout(() => { t.state = 'synced'; lastSync = new Date(); render(document.activeElement?.dataset?.id); }, 400);
      } else {
        t.state = 'pending';
      }
    }

    function connectionChanged() {
      if (online()) sync(); else offlineBanner();
      render();
    }

    $('[data-addtask]', root).addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      const t = { id: ++uid, text, done: false, state: 'synced' };
      tasks.unshift(t);
      save(t);
      input.value = '';
      render();
      if (!online()) offlineBanner();
    });
    list.addEventListener('change', (e) => {
      const t = tasks.find((x) => x.id === Number(e.target.dataset.id));
      t.done = e.target.checked;
      save(t);
      render(t.id);
      if (!online()) offlineBanner();
    });
    sim.addEventListener('change', connectionChanged);
    window.addEventListener('online', connectionChanged);
    window.addEventListener('offline', connectionChanged);

    render();
    if (!navigator.onLine) offlineBanner();
  })();

  /* ======================================================================
     04 · Forma: empty states
     ====================================================================== */
  (() => {
    const root = $('[data-empties]');
    const tabs = $$('[role="tab"]', root);

    tabs.forEach((t, i) => {
      const select = () => {
        tabs.forEach((x) => {
          const on = x === t;
          x.setAttribute('aria-selected', String(on));
          x.tabIndex = on ? 0 : -1;
          document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
        });
        t.focus();
      };
      t.addEventListener('click', select);
      t.addEventListener('keydown', (e) => {
        const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (n === undefined) return;
        e.preventDefault();
        tabs[(n + tabs.length) % tabs.length].click();
      });
    });

    // First use → projects list (and back to empty when the last one is removed)
    const empty = $('[data-empty-projects]', root);
    const plist = $('[data-plist]', root);
    const projects = [];
    function renderProjects(focusLast) {
      empty.hidden = projects.length > 0;
      plist.hidden = !projects.length;
      plist.innerHTML = projects.map((p, i) => `<li><svg class="icon" aria-hidden="true"><use href="#i-folder"/></svg><span>${escape(p)}</span><small>Just now</small><button type="button" class="link-btn" data-remove="${i}" aria-label="Delete ${escape(p)}">Delete</button></li>`).join('')
        + (projects.length ? '<li><button type="button" class="link-btn" data-template="Untitled project">+ New project</button></li>' : '');
      if (focusLast && projects.length) $('[data-remove]', plist)?.focus();
      if (!projects.length) focusSoon($('[data-template]', empty));
    }
    $('[data-projects-panel]', root).addEventListener('click', (e) => {
      const tpl = e.target.closest('[data-template]');
      const rm = e.target.closest('[data-remove]');
      if (tpl) { projects.unshift(tpl.dataset.template); renderProjects(true); }
      if (rm) { projects.splice(Number(rm.dataset.remove), 1); renderProjects(projects.length > 0); }
    });

    // No results → real filtering over a tiny dataset, with honest suggestions
    const HOMES = [
      [3, 'Brighton', 420, true], [3, 'Brighton', 395, true], [3, 'Brighton', 340, false], [2, 'Brighton', 310, true], [3, 'Brighton', 365, true],
      [4, 'Brighton', 520, true], [3, 'Hove', 330, true], [2, 'Brighton', 280, false], [3, 'Brighton', 450, true], [3, 'Brighton', 380, true],
      [3, 'Lewes', 320, true], [3, 'Brighton', 399, true], [3, 'Brighton', 410, true], [2, 'Hove', 290, true], [3, 'Brighton', 375, true],
      [3, 'Brighton', 349, false], [3, 'Brighton', 430, true], [3, 'Brighton', 360, true], [3, 'Brighton', 385, true], [3, 'Worthing', 300, true],
    ].map(([beds, city, price, garden]) => ({ beds, city, price, garden }));
    const FILTERS = {
      '3 beds': (h) => h.beds >= 3,
      Brighton: (h) => h.city === 'Brighton',
      'Under £350k': (h) => h.price < 350,
      Garden: (h) => h.garden,
    };
    let active = Object.keys(FILTERS);
    const chipsEl = $('[data-echips]', root);
    const box = $('[data-noresults]', root);
    const count = (filters) => HOMES.filter((h) => filters.every((f) => FILTERS[f](h))).length;

    function renderSearch(focusIndex) {
      chipsEl.innerHTML = active.map((f) => `<li><button type="button" data-filter="${f}" aria-label="Remove filter ${f}">${f} ×</button></li>`).join('');
      const n = count(active);
      if (n === 0) {
        const tips = active.map((f) => ({ f, n: count(active.filter((x) => x !== f)) })).filter((t) => t.n > 0).sort((a, b) => b.n - a.n).slice(0, 2);
        box.innerHTML = `<div class="empty__art empty__art--search" aria-hidden="true"><span></span><span></span></div>
          <h3 tabindex="-1">No homes match all ${active.length} filters</h3>
          <p>${tips.map((t, i) => `${i ? '' : 'Removing '}<strong>${t.f}</strong> would show <strong>${t.n} ${t.n === 1 ? 'home' : 'homes'}</strong>`).join('. Removing ')}.</p>
          <div class="empty__actions">${tips[0] ? `<button class="btn btn--primary" type="button" data-filter="${tips[0].f}">Remove “${tips[0].f}”</button>` : ''}<button class="btn btn--ghost" type="button" data-save-search>Save search &amp; alert me</button></div>
          <p class="empty__msg" role="status" data-search-msg></p>`;
      } else {
        const shown = HOMES.filter((h) => active.every((f) => FILTERS[f](h))).slice(0, 4);
        box.innerHTML = `<h3 tabindex="-1">${n} ${n === 1 ? 'home' : 'homes'} found</h3>
          <ul class="results-found" role="list">${shown.map((h) => `<li><strong>£${h.price}k</strong> · ${h.beds}-bed in ${h.city} <small>${h.garden ? '· garden' : ''}</small></li>`).join('')}</ul>
          ${active.length < 4 ? '<button class="btn btn--ghost btn--sm" type="button" data-reset-filters>Reset to my original search</button>' : ''}`;
      }
      if (focusIndex !== undefined) ($$('[data-filter]', chipsEl)[Math.min(focusIndex, active.length - 1)] || $('h3', box))?.focus();
    }
    root.addEventListener('click', (e) => {
      const f = e.target.closest('[data-filter]');
      if (f) {
        const i = active.indexOf(f.dataset.filter);
        active = active.filter((x) => x !== f.dataset.filter);
        renderSearch(f.closest('[data-echips]') ? i : undefined);
        if (!f.closest('[data-echips]')) $('h3', box).focus();
      }
      if (e.target.closest('[data-reset-filters]')) { active = Object.keys(FILTERS); renderSearch(0); }
      if (e.target.closest('[data-save-search]')) $('[data-search-msg]', root).textContent = "✓ Saved. We'll email you as soon as a match is listed.";
    });
    renderSearch();

    // All done → a little celebration (skipped with reduced motion)
    const confettiBox = $('[data-confetti-box]', root);
    $('[data-confetti]', root).addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.textContent = '🎉 Celebrated!';
      setTimeout(() => { btn.textContent = 'Celebrate'; }, 2500);
      if (reducedMotion.matches) return; // the message is enough; no falling confetti
      const colours = ['oklch(70% 0.18 25)', 'oklch(78% 0.16 75)', 'oklch(65% 0.15 160)', 'oklch(62% 0.18 285)', 'oklch(70% 0.15 220)'];
      confettiBox.innerHTML = Array.from({ length: 48 }, (_, i) => `<i style="left:${Math.random() * 100}%;--c:${colours[i % 5]};--d:${1.4 + Math.random() * 1.4}s;--x:${(Math.random() - 0.5) * 160}px;--r:${Math.random() * 720}deg;animation-delay:${Math.random() * 0.3}s"></i>`).join('');
      setTimeout(() => { confettiBox.innerHTML = ''; }, 3200);
    });
  })();

  /* ======================================================================
     05 · Atlas: access request (403)
     ====================================================================== */
  (() => {
    const root = $('[data-403]');
    const form = $('[data-req-form]', root);
    const pending = $('[data-pending]', root);
    const acct = $('[data-acct]', root);
    const ACCOUNTS = ['riya@freelance.dev', 'riya@atlas.dev'];

    function showPending(level) {
      form.hidden = true;
      pending.hidden = false;
      pending.classList.remove('is-granted');
      $('.pending__title', pending).innerHTML = '<span class="pulse" aria-hidden="true"></span>Request sent to Tom';
      $('[data-pending-text]', pending).textContent = `Tom usually replies within 2 hours. We'll email ${acct.textContent} when you can ${level === 'comment' ? 'comment on' : level} this document.`;
      $('.steps', pending).innerHTML = '<li class="is-done">Requested</li><li class="is-current" aria-current="step">Waiting for Tom</li><li>Access granted</li>';
      $('.pending__actions', pending).innerHTML = '<button class="btn btn--outline btn--sm" type="button" data-simulate-approve>Simulate Tom approving</button><button class="link-btn" type="button" data-cancel-req>Cancel request</button>';
      focusSoon(pending);
    }
    function granted(text) {
      form.hidden = true;
      pending.hidden = false;
      pending.classList.add('is-granted');
      $('.pending__title', pending).textContent = '✓ Access granted';
      $('[data-pending-text]', pending).textContent = text;
      $('.steps', pending).innerHTML = '<li class="is-done">Requested</li><li class="is-done">Approved</li><li class="is-done" aria-current="step">Access granted</li>';
      $('.pending__actions', pending).innerHTML = '<a class="btn btn--primary btn--sm" href="#" data-open-doc>Open “Q4 roadmap”</a>';
      focusSoon(pending);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showPending($('[name="level"]:checked', form).value);
    });
    pending.addEventListener('click', (e) => {
      if (e.target.closest('[data-simulate-approve]')) granted(`Tom gave you ${$('[name="level"]:checked', form).value} access. He also said: “Welcome aboard!”`);
      if (e.target.closest('[data-cancel-req]')) { pending.hidden = true; form.hidden = false; focusSoon($('[data-req-msg]', form)); }
      if (e.target.closest('[data-open-doc]')) { e.preventDefault(); $('[data-pending-text]', pending).textContent = 'Opening the document…'; }
    });
    $('[data-switch]', root).addEventListener('click', () => {
      const next = ACCOUNTS[(ACCOUNTS.indexOf(acct.textContent) + 1) % ACCOUNTS.length];
      acct.textContent = next;
      if (next.endsWith('@atlas.dev')) granted(`Your ${next} account is in the Atlas Product team, so you already have access.`);
      else { pending.hidden = true; form.hidden = false; }
    });
  })();

  /* ======================================================================
     06 · Ember: partial failure dashboard
     ====================================================================== */
  (() => {
    const root = $('[data-partial]');
    const live = $('[data-partial-live]', root);
    const widgets = $$('[data-widget]', root);
    let run = 0;

    const CONTENT = {
      sales: () => '<p class="big">£4,286</p><p class="delta">▲ 12% vs last Saturday</p>',
      covers: () => '<p class="big">142</p><p class="muted" style="font-size:.8rem;color:var(--color-text-subtle)">38 walk-ins · 104 bookings</p>',
      delivery: () => '<p class="big">27</p><p class="delta">Avg. 31 min to door</p>',
      reviews: (stale) => `${stale ? '<p class="stale">Showing saved data from 2 hours ago. <button type="button" data-refresh>Refresh</button></p>' : ''}<ul class="revlist" role="list"><li><b>★★★★★</b>“The short rib was unreal.”</li><li><b>★★★★★</b>“Lovely staff, great wine list.”</li><li><b>★★★★☆</b>“A little loud, but the food made up for it.”</li></ul>`,
      stock: () => '<ul class="stocklist" role="list"><li>Burrata <span>4 left</span></li><li>Hispi cabbage <span>6 left</span></li><li>House red <span>2 bottles</span></li></ul>',
    };
    // How each widget behaves on the first load: delay and outcome.
    const PLAN = { sales: [600, 'ok'], covers: [900, 'ok'], delivery: [1300, 'fail'], reviews: [1600, 'stale'], stock: [800, 'ok'] };

    function skeleton(w) {
      w.setAttribute('aria-busy', 'true');
      $('[data-body]', w).innerHTML = '<div class="skel" aria-hidden="true"><span></span><span></span><span></span></div><span class="sr-only">Loading…</span>';
    }

    async function load(w, outcome, delay, myRun) {
      skeleton(w);
      await wait(delay);
      if (myRun !== run) return null; // a newer “reload all” started
      const name = w.dataset.widget;
      const body = $('[data-body]', w);
      w.setAttribute('aria-busy', 'false');
      if (outcome === 'fail') {
        body.innerHTML = `<div class="werr" role="alert"><strong><svg class="icon" aria-hidden="true"><use href="#i-alert"/></svg>Couldn't load delivery orders</strong>Deliveroo isn't responding. Everything else is fine.<button class="btn btn--outline btn--sm" type="button" data-retry-widget>Retry</button></div>`;
        return 'fail';
      }
      body.innerHTML = CONTENT[name](outcome === 'stale');
      return outcome;
    }

    async function loadAll() {
      run += 1;
      const myRun = run;
      live.textContent = 'Loading dashboard…';
      const results = await Promise.all(widgets.map((w) => { const [d, o] = PLAN[w.dataset.widget]; return load(w, o, d, myRun); }));
      if (myRun !== run) return;
      const failed = results.filter((r) => r === 'fail').length;
      live.textContent = `${widgets.length - failed} of ${widgets.length} widgets loaded.${failed ? ' Delivery orders couldn’t load; you can retry it.' : ''}`;
    }

    root.addEventListener('click', async (e) => {
      const retry = e.target.closest('[data-retry-widget]');
      const refresh = e.target.closest('[data-refresh]');
      if (retry || refresh) {
        const w = e.target.closest('[data-widget]');
        const r = await load(w, 'ok', 900, run); // the retry works
        if (r) { live.textContent = `${$('h4', w).textContent} loaded.`; focusSoon($('h4', w).closest('section')); }
      }
      if (e.target.closest('[data-reload-all]')) loadAll();
    });
    widgets.forEach((w) => { w.tabIndex = -1; skeleton(w); });
    onFirstView(root, loadAll);
  })();
})();
