/*!
 * Thecore · 100 Days of Web Development
 * Day 016: Profile pages
 */
(() => {
  'use strict';

  const { $, $$ } = window.Thecore;
  const num = new Intl.NumberFormat('en-GB');
  const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const initials = (n) => n.trim().split(/\s+/).slice(0, 2).map((p) => p[0] || '').join('').toUpperCase() || '?';

  /* Small seeded random generator so demo data looks random but never changes between visits. */
  function seeded(seed) {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }

  /* WAI-ARIA tabs: arrow keys / Home / End move between tabs, selection follows focus. */
  function tabs(list, onSelect) {
    const items = $$('[role="tab"]', list);
    function select(tab, focus = true) {
      items.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel && !onSelect) panel.hidden = !on;
      });
      onSelect?.(tab);
      if (focus) tab.focus();
    }
    items.forEach((t) => t.addEventListener('click', () => select(t)));
    list.addEventListener('keydown', (e) => {
      const i = items.indexOf(document.activeElement);
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: items.length - 1 }[e.key];
      if (i === -1 || next === undefined) return;
      e.preventDefault();
      select(items[(next + items.length) % items.length]);
    });
    return select;
  }

  /* ======================================================================
     01 · Creator profile
     ====================================================================== */
  (() => {
    const root = $('[data-creator]');
    const follow = $('[data-follow]', root);
    const followers = $('[data-followers]', root);
    const grid = $('[data-posts]', root);
    let count = 12480;

    tabs($('[data-tabs]', root));

    follow.addEventListener('click', () => {
      const on = follow.getAttribute('aria-pressed') !== 'true';
      follow.setAttribute('aria-pressed', String(on));
      $('[data-follow-label]', follow).textContent = on ? 'Following' : 'Follow';
      count += on ? 1 : -1;
      followers.textContent = num.format(count);
    });

    const POSTS = [
      ['Alfama at dusk', 1204, 'linear-gradient(160deg, oklch(70% 0.14 50), oklch(40% 0.1 300))'],
      ['Morning tram', 856, 'linear-gradient(200deg, oklch(80% 0.12 85), oklch(55% 0.12 30))'],
      ['Atlantic swimmers', 2301, 'linear-gradient(180deg, oklch(78% 0.08 220), oklch(45% 0.12 240))'],
      ['Portrait: Ade', 1688, 'radial-gradient(circle at 50% 38%, oklch(55% 0.09 50) 0 18%, transparent 19%), linear-gradient(oklch(30% 0.03 260), oklch(22% 0.02 260))'],
      ['Lagos market', 977, 'linear-gradient(135deg, oklch(72% 0.17 60), oklch(60% 0.18 20) 60%, oklch(45% 0.12 330))'],
      ['Cabo da Roca', 3140, 'linear-gradient(180deg, oklch(85% 0.05 220) 0 45%, oklch(55% 0.1 230) 45% 70%, oklch(45% 0.06 140) 70%)'],
      ['Studio light', 640, 'radial-gradient(circle at 70% 30%, oklch(95% 0.03 90), oklch(60% 0.03 60) 60%)'],
      ['Blue hour', 1450, 'linear-gradient(180deg, oklch(45% 0.12 270), oklch(25% 0.08 260))'],
      ['Sintra fog', 1102, 'linear-gradient(180deg, oklch(88% 0.01 150), oklch(55% 0.06 150))'],
    ].map(([title, likes, bg]) => ({ title, likes, bg, liked: false }));

    function render(focusIndex) {
      grid.innerHTML = POSTS.map((p, i) => `
        <li class="post" style="--bg:${p.bg}">
          <span class="sr-only">${p.title}</span>
          <button class="post__like" type="button" data-i="${i}" aria-pressed="${p.liked}" aria-label="Like “${p.title}”, ${num.format(p.likes)} likes"><svg class="icon" aria-hidden="true"><use href="#i-heart"/></svg>${num.format(p.likes)}</button>
        </li>`).join('');
      if (focusIndex !== undefined) $(`[data-i="${focusIndex}"]`, grid).focus();
    }
    grid.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      const p = POSTS[b.dataset.i];
      p.liked = !p.liked;
      p.likes += p.liked ? 1 : -1;
      render(Number(b.dataset.i));
    });
    render();
  })();

  /* ======================================================================
     02 · Professional profile
     ====================================================================== */
  (() => {
    const root = $('[data-cv]');
    const status = $('[data-cv-status]', root);
    const more = $('[data-more]', root);
    const skillsEl = $('[data-skills]', root);

    const SKILLS = [['Design systems', 48], ['Product strategy', 31], ['Figma', 57], ['Prototyping', 26], ['User research', 19], ['Accessibility', 22]]
      .map(([name, n]) => ({ name, n, mine: false }));

    function renderSkills(focus) {
      skillsEl.innerHTML = SKILLS.map((s, i) => `
        <li><span>${s.name}</span><small>${s.n}</small>
          <button class="endorse" type="button" data-i="${i}" aria-pressed="${s.mine}" aria-label="${s.mine ? 'Remove endorsement' : 'Endorse'} ${s.name} (${s.n} endorsements)"><svg class="icon" aria-hidden="true"><use href="#${s.mine ? 'i-check' : 'i-plus'}"/></svg></button></li>`).join('');
      if (focus !== undefined) $(`[data-i="${focus}"]`, skillsEl).focus();
    }
    skillsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      const s = SKILLS[b.dataset.i];
      s.mine = !s.mine;
      s.n += s.mine ? 1 : -1;
      renderSkills(Number(b.dataset.i));
      status.textContent = s.mine ? `You endorsed Sofia for ${s.name}.` : `Endorsement for ${s.name} removed.`;
    });
    renderSkills();

    more.addEventListener('click', () => {
      const open = more.getAttribute('aria-expanded') !== 'true';
      $$('[data-older]', root).forEach((li) => { li.hidden = !open; });
      more.setAttribute('aria-expanded', String(open));
      more.textContent = open ? 'Show fewer roles' : 'Show 2 earlier roles';
    });

    const copyBtn = $('[data-copy-email]', root);
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.copyEmail;
      const label = $('span', copyBtn);
      try {
        await navigator.clipboard.writeText(email);
        label.textContent = 'Email copied';
      } catch (err) {
        label.textContent = email; // can't copy: at least show it so it can be selected
      }
      copyBtn.classList.add('is-copied');
      status.textContent = `Email address ${email} copied.`;
      clearTimeout(copyBtn._t);
      copyBtn._t = setTimeout(() => { label.textContent = 'Copy email'; copyBtn.classList.remove('is-copied'); }, 2200);
    });
  })();

  /* ======================================================================
     03 · Edit profile with live preview
     ====================================================================== */
  (() => {
    const root = $('[data-editor]');
    const form = $('[data-edit-form]', root);
    const card = $('[data-pcard]', root);
    const user = $('[data-user]', root);
    const userBox = user.closest('.input-prefix');
    const userMsg = $('[data-user-msg]', root);
    const bio = $('#ed-bio', root);
    const counter = $('[data-counter]', root);
    const counterSr = $('[data-counter-sr]', root);
    const photo = $('[data-photo]', root);
    const pPhoto = $('[data-p-photo]', root);
    const photoInput = $('[data-photo-input]', root);
    const photoRemove = $('[data-photo-remove]', root);
    const photoHint = $('[data-photo-hint]', root);
    const saved = $('[data-saved]', root);

    const CURRENT = 'riya';
    const TAKEN = ['admin', 'tom', 'kai', 'support', 'atlas', 'root', 'help', 'riya.sharma'];
    let userState = 'own';
    let photoUrl = null;
    let checkTimer = 0;

    // Live preview of text fields.
    function sync() {
      $$('[data-bind]', form).forEach((f) => {
        const out = $(`[data-p="${f.dataset.bind}"]`, card);
        out.textContent = f.value.trim() || (f.dataset.bind === 'name' ? 'Your name' : '');
      });
      $('[data-p="user"]', card).textContent = user.value.trim().toLowerCase() || 'username';
      if (!photoUrl) {
        const ini = initials($('#ed-name', form).value);
        photo.textContent = ini;
        pPhoto.textContent = ini;
      }
      const n = bio.value.length;
      counter.textContent = `${n}/160`;
      counter.classList.toggle('is-near', n > 140);
      counterSr.textContent = n > 140 ? `${160 - n} characters left` : '';
    }
    form.addEventListener('input', (e) => { saved.textContent = ''; if (e.target !== user) sync(); });

    // Username: format check now, availability check after a pause.
    function setUser(state, text) {
      userState = state;
      userBox.classList.toggle('is-taken', state === 'taken' || state === 'invalid');
      userBox.classList.toggle('is-free', state === 'free');
      userMsg.className = `fld__hint user-msg is-${state === 'invalid' ? 'taken' : state}`;
      userMsg.textContent = text;
      user.setAttribute('aria-invalid', String(state === 'taken' || state === 'invalid'));
    }
    user.addEventListener('input', () => {
      clearTimeout(checkTimer);
      const v = user.value.trim().toLowerCase();
      sync();
      if (v === CURRENT) { setUser('own', "That's your current username."); return; }
      if (!/^[a-z0-9._]{3,20}$/.test(v)) {
        setUser('invalid', v.length < 3 ? 'At least 3 characters.' : 'Use only letters, numbers, dots and underscores (max 20).');
        return;
      }
      setUser('checking', 'Checking availability…');
      checkTimer = setTimeout(() => {
        if (TAKEN.includes(v)) {
          const ideas = [`${v}.designs`, `${v}_${new Date().getFullYear() % 100}`];
          setUser('taken', `“${v}” is taken. Try ${ideas.join(' or ')}.`);
        } else {
          setUser('free', `“${v}” is available.`);
        }
      }, 500);
    });

    // Photo: read the file locally and preview it. Nothing is uploaded.
    function setPhoto(url) {
      photoUrl = url;
      [photo, pPhoto].forEach((el) => {
        el.style.backgroundImage = url ? `url("${url}")` : '';
        el.textContent = url ? '' : initials($('#ed-name', form).value);
      });
      photoRemove.hidden = !url;
    }
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (!file) return;
      photoHint.classList.remove('is-error');
      if (!file.type.startsWith('image/')) { photoHint.textContent = "That file isn’t an image. Please choose a JPG or PNG."; photoHint.classList.add('is-error'); return; }
      if (file.size > 5 * 1024 * 1024) { photoHint.textContent = 'That image is over 5 MB. Please choose a smaller one.'; photoHint.classList.add('is-error'); return; }
      const reader = new FileReader();
      reader.onload = () => { setPhoto(reader.result); photoHint.textContent = `${file.name} · preview only, not uploaded.`; };
      reader.readAsDataURL(file);
      photoInput.value = '';
    });
    photoRemove.addEventListener('click', () => {
      setPhoto(null);
      photoHint.textContent = 'Photo removed.';
      $('.photo__btn', root).focus();
    });

    $$('[name="accent"]', form).forEach((r) => r.addEventListener('change', () => card.style.setProperty('--h', r.value)));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saved.classList.remove('is-error');
      if (userState === 'taken' || userState === 'invalid' || userState === 'checking') {
        saved.classList.add('is-error');
        saved.textContent = userState === 'checking' ? 'Still checking the username… try again in a moment.' : 'Please choose an available username first.';
        user.focus();
        return;
      }
      if (!$('#ed-name', form).value.trim()) {
        saved.classList.add('is-error');
        saved.textContent = 'Please add a display name.';
        $('#ed-name', form).focus();
        return;
      }
      saved.textContent = '✓ Profile saved';
    });

    $('[data-reset]', form).addEventListener('click', () => {
      form.reset();
      card.style.setProperty('--h', '285');
      setPhoto(null);
      photoHint.textContent = 'JPG or PNG, up to 5 MB. Stays on your device in this demo.';
      photoHint.classList.remove('is-error');
      setUser('own', "That's your current username.");
      saved.textContent = 'Changes reset.';
      sync();
    });

    sync();
  })();

  /* ======================================================================
     04 · Freelancer profile
     ====================================================================== */
  (() => {
    const root = $('[data-gig]');
    const panel = $('[data-pkg-panel]', root);
    const msg = $('[data-hire-msg]', root);
    const reviewsEl = $('[data-reviews]', root);
    let pkg = 1;

    const FEATURES = ['Logo animation', 'Sound design', 'Source files', '4K export', 'Social media cuts'];
    const PKGS = [
      { name: 'Basic', price: 180, days: 3, revisions: '1 revision', desc: 'A clean 5-second logo reveal for your intro or outro.', has: [0, 3] },
      { name: 'Standard', price: 420, days: 5, revisions: '3 revisions', desc: 'Logo animation with custom sound, plus source files.', has: [0, 1, 2, 3] },
      { name: 'Premium', price: 890, days: 7, revisions: 'Unlimited revisions', desc: 'The full package, including 9:16 and 1:1 cuts for social media.', has: [0, 1, 2, 3, 4] },
    ];

    function renderPkg() {
      const p = PKGS[pkg];
      panel.setAttribute('aria-labelledby', `pk-${pkg}`);
      panel.innerHTML = `
        <div class="hire__price"><span>${p.name}</span><strong>£${p.price}</strong></div>
        <p>${p.desc}</p>
        <div class="hire__meta"><span><svg class="icon" aria-hidden="true"><use href="#i-clock"/></svg>${p.days}-day delivery</span><span>${p.revisions}</span></div>
        <ul class="hire__list" role="list">${FEATURES.map((f, i) => `<li class="${p.has.includes(i) ? '' : 'is-off'}"><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>${f}${p.has.includes(i) ? '' : '<span class="sr-only"> (not included)</span>'}</li>`).join('')}</ul>`;
      $('[data-hire]', root).textContent = `Continue (£${p.price})`;
      msg.textContent = '';
    }
    tabs($('[data-pkg-tabs]', root), (tab) => { pkg = Number(tab.dataset.pkg); renderPkg(); });
    renderPkg();

    $('[data-hire]', root).addEventListener('click', () => {
      const p = PKGS[pkg];
      msg.textContent = `${p.name} package selected: £${p.price}. You won't be charged until Kai accepts.`;
    });

    const REVIEWS = [
      ['Lea Moreau', 'France', 5, '2 weeks ago', 'Kai turned our static logo into something that feels alive. Fast, kind, and the sound design was a lovely surprise.', 14, 330],
      ['Tom Ashby', 'United Kingdom', 5, '1 month ago', 'Third project together. Delivers early, explains every choice and the files are beautifully organised.', 9, 150],
      ['Priya Nair', 'India', 4, '2 months ago', 'Great result. One revision took a little longer than expected, but the final animation was worth it.', 4, 20],
    ].map(([name, country, stars, when, text, helpful, h]) => ({ name, country, stars, when, text, helpful, h, mine: false }));

    function renderReviews(focus) {
      reviewsEl.innerHTML = REVIEWS.map((r, i) => `
        <li class="review">
          <div class="review__head"><span class="avatar" style="--h:${r.h}" aria-hidden="true">${initials(r.name)}</span><div><strong>${r.name}</strong><small>${r.country} · ${r.when}</small></div><span class="stars" style="--r:${r.stars}" role="img" aria-label="${r.stars} out of 5 stars"></span></div>
          <p>${escape(r.text)}</p>
          <button class="helpful" type="button" data-i="${i}" aria-pressed="${r.mine}">Helpful · ${r.helpful}</button>
        </li>`).join('');
      if (focus !== undefined) $(`[data-i="${focus}"]`, reviewsEl).focus();
    }
    reviewsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (!b) return;
      const r = REVIEWS[b.dataset.i];
      r.mine = !r.mine;
      r.helpful += r.mine ? 1 : -1;
      renderReviews(Number(b.dataset.i));
    });
    renderReviews();
  })();

  /* ======================================================================
     05 · Developer profile
     ====================================================================== */
  (() => {
    const root = $('[data-dev]');
    const reposEl = $('[data-repos]', root);
    const heat = $('[data-heat]', root);
    const scroller = heat.parentElement;
    const tip = $('[data-heat-tip]', root);
    const title = $('[data-contrib-title]', root);
    const fmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

    const REPOS = [
      ['tiny-router', 'A 2 kB router for modern single-page apps. Zero dependencies.', 'TypeScript', 'oklch(60% 0.15 250)', 1840, 96],
      ['rustfmt-action', 'GitHub Action that formats Rust code and suggests fixes in pull requests.', 'Rust', 'oklch(62% 0.15 40)', 412, 37],
      ['pg-snapshot', 'Instant, copy-on-write Postgres snapshots for local development.', 'Go', 'oklch(70% 0.12 200)', 287, 21],
      ['dotfiles', 'My terminal, editor and shell setup. Steal anything.', 'Shell', 'oklch(65% 0.12 140)', 64, 12],
    ].map(([name, desc, lang, c, stars, forks]) => ({ name, desc, lang, c, stars, forks, starred: false }));

    function renderRepos(focus) {
      reposEl.innerHTML = REPOS.map((r, i) => `
        <li class="repo">
          <div class="repo__top"><svg class="icon" aria-hidden="true"><use href="#i-repo"/></svg><a href="#">${r.name}</a><span class="repo__vis">Public</span></div>
          <p>${r.desc}</p>
          <div class="repo__meta">
            <span class="repo__lang" style="--c:${r.c}">${r.lang}</span>
            <button class="star-btn" type="button" data-i="${i}" aria-pressed="${r.starred}" aria-label="${r.starred ? 'Unstar' : 'Star'} ${r.name}, ${num.format(r.stars)} stars"><svg class="icon" aria-hidden="true"><use href="#i-star"/></svg>${num.format(r.stars)}</button>
            <span><svg class="icon" aria-hidden="true"><use href="#i-fork"/></svg>${r.forks}</span>
          </div>
        </li>`).join('');
      if (focus !== undefined) $(`[data-i="${focus}"]`, reposEl).focus();
    }
    reposEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-i]');
      if (b) { const r = REPOS[b.dataset.i]; r.starred = !r.starred; r.stars += r.starred ? 1 : -1; renderRepos(Number(b.dataset.i)); }
      if (e.target.closest('a')) e.preventDefault();
    });
    renderRepos();

    // Contribution heatmap: one column per week, Sunday at the top.
    let days = [];
    let cursor = -1;
    const level = (n) => (n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4);

    function build(year) {
      const rand = seeded(year * 7919);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const start = new Date(year, 0, 1);
      start.setDate(start.getDate() - start.getDay()); // back to Sunday
      const end = new Date(year, 11, 31);
      days = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const inYear = d.getFullYear() === year;
        const future = d > today;
        const weekend = d.getDay() === 0 || d.getDay() === 6;
        const r = rand();
        const n = !inYear || future ? 0 : r < (weekend ? 0.55 : 0.18) ? 0 : Math.floor(r * r * (weekend ? 8 : 16));
        days.push({ date: new Date(d), n, inYear, future });
      }
      const total = days.reduce((s, x) => s + x.n, 0);
      title.textContent = `${num.format(total)} contributions in ${year}`;
      heat.setAttribute('aria-label', `Contribution graph: ${num.format(total)} contributions in ${year}. Use the arrow keys to read individual days.`);
      heat.innerHTML = days.map((x, i) => `<i data-i="${i}" data-l="${level(x.n)}"${!x.inYear || x.future ? ' class="is-future"' : ''}></i>`).join('');
      cursor = -1;
      tip.textContent = 'Hover or focus the graph to see a day.';
    }

    function describe(i) {
      const x = days[i];
      if (!x || !x.inYear || x.future) return;
      tip.textContent = `${x.n === 0 ? 'No' : x.n} contribution${x.n === 1 ? '' : 's'} on ${fmt.format(x.date)}`;
    }

    heat.addEventListener('pointerover', (e) => { const c = e.target.closest('i'); if (c) describe(Number(c.dataset.i)); });

    // Keyboard: arrows move a highlighted day (←/→ = week, ↑/↓ = day).
    scroller.addEventListener('keydown', (e) => {
      const step = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[e.key];
      if (!step) return;
      e.preventDefault();
      if (cursor === -1) cursor = days.findLastIndex((x) => x.inYear && !x.future);
      else {
        let next = cursor + step;
        while (days[next] && (!days[next].inYear || days[next].future)) next += step > 0 ? 1 : -1;
        if (days[next]) cursor = next;
      }
      $$('.is-cursor', heat).forEach((c) => c.classList.remove('is-cursor'));
      const cell = $(`[data-i="${cursor}"]`, heat);
      cell.classList.add('is-cursor');
      cell.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      describe(cursor);
    });
    scroller.addEventListener('blur', () => $$('.is-cursor', heat).forEach((c) => c.classList.remove('is-cursor')));

    $$('[name="year"]', root).forEach((r) => r.addEventListener('change', () => {
      build(Number(r.value));
      scroller.scrollLeft = scroller.scrollWidth;
    }));
    const thisYear = new Date().getFullYear();
    $$('[name="year"]', root).forEach((r, i) => { r.value = thisYear - i; r.parentElement.lastChild.textContent = thisYear - i; });
    build(thisYear);
    requestAnimationFrame(() => { scroller.scrollLeft = scroller.scrollWidth; }); // show the most recent weeks first
  })();

  /* ======================================================================
     06 · Doctor profile & booking
     ====================================================================== */
  (() => {
    const root = $('[data-book]');
    const form = $('[data-book-form]', root);
    const daysEl = $('[data-days]', root);
    const slotsEl = $('[data-slots]', root);
    const count = $('[data-slot-count]', root);
    const btn = $('[data-book-btn]', root);
    const booked = $('[data-booked]', root);
    const SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
    const longFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

    // Next five clinic days (Monday to Saturday).
    const days = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (days.length < 5) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) days.push(new Date(d));
    }
    // Which slots are taken is "random" but stable per day.
    const taken = days.map((day, i) => {
      const rand = seeded(day.getDate() * 31 + day.getMonth() * 7 + 3);
      return i === 2 ? SLOTS.slice() : SLOTS.filter(() => rand() < 0.45); // the 3rd day is fully booked
    });

    daysEl.innerHTML = days.map((day, i) => {
      const full = taken[i].length === SLOTS.length;
      return `<label><input type="radio" name="bkday" value="${i}" ${full ? 'disabled' : ''}><small>${dayFmt.format(day)}</small><strong>${day.getDate()}</strong><span class="sr-only">${longFmt.format(day)}${full ? ', fully booked' : ''}</span></label>`;
    }).join('');

    const visit = () => $('[name="vtype"]:checked', form).value;
    const dayIndex = () => Number($('[name="bkday"]:checked', form)?.value ?? -1);

    function renderSlots() {
      const i = dayIndex();
      if (i < 0) { slotsEl.innerHTML = '<p class="muted" style="grid-column:1/-1;font-size:.8rem">Choose a day first.</p>'; count.textContent = ''; return; }
      // Video consultations are only offered in the afternoon.
      const list = visit() === 'Video' ? SLOTS.filter((t) => t >= '14:00') : SLOTS;
      const free = list.filter((t) => !taken[i].includes(t)).length;
      count.textContent = `(${free} free)`;
      slotsEl.innerHTML = list.map((t) => {
        const busy = taken[i].includes(t);
        return `<label><input type="radio" name="bkslot" value="${t}" ${busy ? 'disabled' : ''}>${t}${busy ? '<span class="sr-only"> (taken)</span>' : ''}</label>`;
      }).join('');
      update();
    }

    function update() {
      const slot = $('[name="bkslot"]:checked', form)?.value;
      const i = dayIndex();
      btn.disabled = !slot;
      btn.textContent = slot ? `Book ${dayFmt.format(days[i])} ${days[i].getDate()} at ${slot}` : 'Choose a time';
    }

    form.addEventListener('change', (e) => {
      if (e.target.name === 'bkday' || e.target.name === 'vtype') renderSlots();
      else update();
    });

    btn.addEventListener('click', () => {
      const slot = $('[name="bkslot"]:checked', form).value;
      const i = dayIndex();
      $('[data-booked-text]', root).textContent = `${visit()} appointment with Dr. Lea Moreau on ${longFmt.format(days[i])} at ${slot}. ${visit() === 'Video' ? 'We\'ll email you a video link.' : 'Please arrive 5 minutes early.'}`;
      form.hidden = true;
      booked.hidden = false;
      booked.focus();
    });

    $('[data-rebook]', root).addEventListener('click', () => {
      booked.hidden = true;
      form.hidden = false;
      btn.focus();
    });

    // Start on the first available day.
    const first = $('[name="bkday"]:not(:disabled)', form);
    if (first) first.checked = true;
    renderSlots();
  })();
})();
