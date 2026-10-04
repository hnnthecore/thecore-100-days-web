/*!
 * Thecore · 100 Days of Web Development
 * Day 006: Pricing Sections
 *
 * Every price on the page is calculated from small, readable data tables at
 * the top of each section. To change real prices, edit those tables only.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;

  /* ======================================================================
     Shared helpers
     ====================================================================== */
  const announcer = $('[data-announce]');
  const announce = (text) => {
    announcer.textContent = '';
    requestAnimationFrame(() => { announcer.textContent = text; });
  };

  const money = (currency, { decimals = 0, locale = 'en-US' } = {}) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  /** Smoothly count a number from its current value to a new one. */
  function animateNumber(el, to, format, duration = 450) {
    const from = el._value ?? to;
    el._value = to;
    if (reducedMotion.matches || from === to) {
      el.textContent = format(to);
      return;
    }
    cancelAnimationFrame(el._raf);
    const start = performance.now();
    const ease = (t) => 1 - (1 - t) ** 3;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = format(from + (to - from) * ease(t));
      if (t < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  /* ======================================================================
     01 · Lumen: SaaS plans
     ====================================================================== */
  (() => {
    const root = $('[data-tiers]');
    // Hand-set prices per currency: [monthly, yearly-per-month]
    const PRICES = {
      USD: { pro: [12, 10], business: [24, 19], locale: 'en-US' },
      EUR: { pro: [11, 9], business: [22, 18], locale: 'de-DE' },
      GBP: { pro: [10, 8], business: [20, 16], locale: 'en-GB' },
    };
    const FREE_LIMIT = 3;
    const seatsInput = $('[data-seats]', root);
    const seatsOut = $('[data-seats-out]', root);
    const currencySelect = $('[data-currency]', root);

    const state = () => ({
      yearly: $('input[name="billing"]:checked', root).value === 'yearly',
      currency: currencySelect.value,
      seats: Number(seatsInput.value),
    });

    function render({ announceChange = false } = {}) {
      const { yearly, currency, seats } = state();
      const table = PRICES[currency];
      const fmt = money(currency, { locale: table.locale });
      seatsOut.textContent = `${seats} ${seats === 1 ? 'person' : 'people'}`;
      const pct = ((seats - 1) / 99) * 100;
      seatsInput.style.setProperty('--fill', `${pct}%`);

      $$('[data-plan]', root).forEach((card) => {
        const plan = card.dataset.plan;
        const amount = $('[data-amount]', card);
        const total = $('[data-total]', card);

        if (plan === 'free') {
          amount.textContent = fmt.format(0);
          const tooBig = seats > FREE_LIMIT;
          card.classList.toggle('is-unavailable', tooBig);
          total.textContent = tooBig ? `Not available for teams over ${FREE_LIMIT}` : `Up to ${FREE_LIMIT} people`;
          const cta = $('[data-cta]', card);
          cta.setAttribute('aria-disabled', String(tooBig));
          cta.tabIndex = tooBig ? -1 : 0;
          return;
        }

        const [monthly, yearlyRate] = table[plan];
        const per = yearly ? yearlyRate : monthly;
        animateNumber(amount, per, (v) => fmt.format(Math.round(v)));
        total.textContent = yearly
          ? `${fmt.format(per * seats)}/mo for ${seats} · billed ${fmt.format(per * seats * 12)} yearly`
          : `${fmt.format(per * seats)}/mo for ${seats} people`;
      });

      if (announceChange) {
        const [m, y] = table.pro;
        announce(`Prices shown ${yearly ? 'billed yearly' : 'billed monthly'} in ${currency}. Pro is ${fmt.format(yearly ? y : m)} per person per month.`);
      }
    }

    root.addEventListener('change', (e) => {
      if (e.target.matches('input[name="billing"], [data-currency]')) render({ announceChange: true });
    });
    seatsInput.addEventListener('input', () => render());
    $('[data-plan="free"] [data-cta]', root).addEventListener('click', (e) => {
      if (e.currentTarget.getAttribute('aria-disabled') === 'true') e.preventDefault();
    });
    render();
  })();

  /* ======================================================================
     02 · Atlas: comparison table
     ====================================================================== */
  (() => {
    const root = $('[data-compare]');
    const table = $('.ctable', root);

    // Highlight the column under the pointer
    table.addEventListener('pointerover', (e) => {
      const cell = e.target.closest('td, thead th');
      if (!cell || cell.cellIndex === 0) {
        table.removeAttribute('data-hover-col');
        return;
      }
      table.dataset.hoverCol = cell.cellIndex + 1;
    });
    table.addEventListener('pointerleave', () => table.removeAttribute('data-hover-col'));

    // Collapsible feature groups
    $$('.ctable__group button', table).forEach((btn) => {
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        btn.closest('tbody').classList.toggle('is-collapsed', open);
      });
    });

    // Narrow screens: choose which plan column to show
    const buttons = $$('.compare__tabs button', root);
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        table.dataset.mobileCol = btn.dataset.col;
      });
    });

    // Escape closes a focused tooltip by moving focus back to the row
    table.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && e.target.matches('.tip')) e.target.blur();
    });
  })();

  /* ======================================================================
     03 · Nova: usage calculator
     ====================================================================== */
  (() => {
    const root = $('[data-usage]');
    const REQUEST_STEPS = [0, 100_000, 250_000, 500_000, 1_000_000, 2_500_000, 5_000_000, 10_000_000, 25_000_000];
    const FREE = { requests: 100_000, storage: 5, seats: 3 };
    // Request pricing per 10k, by volume band
    const BANDS = [
      { upTo: 1_000_000, rate: 0.5 },
      { upTo: 5_000_000, rate: 0.35 },
      { upTo: Infinity, rate: 0.2 },
    ];
    const LIST_RATE = 0.5;
    const STORAGE_RATE = 0.1;
    const SEAT_RATE = 8;
    const ENTERPRISE_THRESHOLD = 300;
    const ENTERPRISE_SAVING = 0.18;

    const usd = money('USD');
    const usd2 = money('USD', { decimals: 2 });
    const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

    const inputs = Object.fromEntries($$('[data-input]', root).map((i) => [i.dataset.input, i]));
    const outs = Object.fromEntries($$('[data-out]', root).map((o) => [o.dataset.out, o]));
    const totalEl = $('[data-total]', root);
    const lines = $('[data-lines]', root);
    const nudge = $('[data-nudge]', root);
    const segs = Object.fromEntries($$('[data-seg]', root).map((s) => [s.dataset.seg, s]));

    function requestCost(requests) {
      let cost = 0;
      let from = FREE.requests;
      for (const band of BANDS) {
        if (requests <= from) break;
        const units = Math.min(requests, band.upTo) - from;
        cost += (units / 10_000) * band.rate;
        from = band.upTo;
      }
      return cost;
    }

    function render() {
      const requests = REQUEST_STEPS[Number(inputs.requests.value)];
      const storage = Number(inputs.storage.value);
      const seats = Number(inputs.seats.value);

      const req = requestCost(requests);
      const reqList = (Math.max(0, requests - FREE.requests) / 10_000) * LIST_RATE;
      const discount = reqList - req;
      const sto = Math.max(0, storage - FREE.storage) * STORAGE_RATE;
      const seat = Math.max(0, seats - FREE.seats) * SEAT_RATE;
      const total = req + sto + seat;

      outs.requests.textContent = requests ? compact.format(requests) : '0';
      outs.storage.textContent = `${storage} GB`;
      outs.seats.textContent = seats;
      Object.values(inputs).forEach((i) => i.style.setProperty('--fill', `${((i.value - i.min) / (i.max - i.min)) * 100}%`));

      animateNumber(totalEl, total, (v) => usd2.format(v));

      const row = (label, note, value, dot, cls = '') =>
        `<div class="${cls}"><dt style="--dot:${dot}">${label}${note ? ` <small>${note}</small>` : ''}</dt><dd>${value}</dd></div>`;
      lines.innerHTML = [
        row('API requests', `${compact.format(Math.max(0, requests - FREE.requests))} billable`, usd2.format(reqList), 'var(--c-req)'),
        discount > 0.005 ? row('Volume discount', 'above 1M requests', `−${usd2.format(discount)}`, 'var(--color-success)', 'is-discount') : '',
        row('Storage', `${Math.max(0, storage - FREE.storage)} GB billable`, usd2.format(sto), 'var(--c-sto)'),
        row('Seats', `${Math.max(0, seats - FREE.seats)} paid`, usd2.format(seat), 'var(--c-seat)'),
        row('Free tier', '100k requests, 5 GB, 3 seats', usd2.format(0), 'var(--color-border-strong)'),
      ].join('');

      const safe = total || 1;
      segs.requests.style.setProperty('--w', req / safe);
      segs.storage.style.setProperty('--w', sto / safe);
      segs.seats.style.setProperty('--w', seat / safe);

      nudge.hidden = total < ENTERPRISE_THRESHOLD;
      if (!nudge.hidden) $('[data-saving]', nudge).textContent = usd.format(total * ENTERPRISE_SAVING);
    }

    Object.values(inputs).forEach((i) => i.addEventListener('input', render));
    render();
  })();

  /* ======================================================================
     04 · Forge: gym memberships
     ====================================================================== */
  (() => {
    const root = $('[data-gym]');
    const commit = $('[data-commit]', root);
    const commitWrap = $('[data-commit-wrap]', root);
    const views = $$('[data-gym-view]', root);
    const COMMIT_DISCOUNT = 5;
    const DROP_IN = 15;
    const gbp = money('GBP', { locale: 'en-GB' });
    const gbp2 = money('GBP', { decimals: 2, locale: 'en-GB' });

    function render() {
      const mode = $('input[name="gymMode"]:checked', root).value;
      views.forEach((v) => { v.hidden = v.dataset.gymView !== mode; });
      commitWrap.classList.toggle('is-disabled', mode !== 'membership');
      commit.disabled = mode !== 'membership';

      $$('[data-gplan]', root).forEach((card) => {
        const price = Number(card.dataset.month) - (commit.checked ? COMMIT_DISCOUNT : 0);
        animateNumber($('[data-amount]', card), price, (v) => gbp.format(Math.round(v)));
        $('[data-week]', card).textContent = `≈ ${gbp2.format((price * 12) / 52)} a week`;
      });

      $$('[data-pack]', root).forEach((card) => {
        const each = Number(card.dataset.price) / Number(card.dataset.classes);
        const saving = Math.round((1 - each / DROP_IN) * 100);
        $('[data-each]', card).textContent = `${gbp2.format(each)} per class · save ${saving}% vs drop-in`;
      });
    }

    root.addEventListener('change', render);
    render();
  })();

  /* ======================================================================
     05 · Halden: package builder
     ====================================================================== */
  (() => {
    const root = $('[data-builder]');
    const eur = money('EUR', { locale: 'en-IE' });
    const totalEl = $('[data-b-total]', root);
    const monthlyEl = $('[data-b-monthly]', root);
    const weeksEl = $('[data-b-weeks]', root);
    const items = $('[data-b-items]', root);
    const savingEl = $('[data-b-saving]', root);

    function render() {
      const base = $('input[name="base"]:checked', root);
      const addons = $$('input[name="addon"]:checked', root);
      const support = $('input[name="support"]', root);

      let total = Number(base.dataset.price);
      let weeks = Number(base.dataset.weeks);
      const lines = [[base.closest('label').querySelector('strong').textContent, eur.format(total)]];

      addons.forEach((a) => {
        total += Number(a.dataset.price);
        weeks += Number(a.dataset.weeks || 0);
        lines.push([a.value, `+${eur.format(Number(a.dataset.price))}`]);
      });

      animateNumber(totalEl, total, (v) => eur.format(Math.round(v / 10) * 10));
      weeksEl.textContent = `About ${weeks} weeks`;

      monthlyEl.hidden = !support.checked;
      monthlyEl.textContent = support.checked ? `+ ${eur.format(Number(support.dataset.monthly))}/month care plan after launch` : '';

      items.innerHTML = '';
      lines.forEach(([label, value]) => {
        const li = document.createElement('li');
        li.append(Object.assign(document.createElement('span'), { textContent: label }), Object.assign(document.createElement('span'), { textContent: value }));
        items.append(li);
      });

      const saving = Number(base.dataset.saving || 0);
      savingEl.hidden = !saving;
      savingEl.textContent = saving ? `You save ${eur.format(saving)} by bundling brand and website.` : '';
    }

    root.addEventListener('change', render);
    root.addEventListener('submit', (e) => e.preventDefault());
    render();
  })();

  /* ======================================================================
     06 · Ember: private dining quote
     ====================================================================== */
  (() => {
    const root = $('[data-dining]');
    const guests = $('[data-guests]', root);
    const down = $('[data-d-down]', root);
    const up = $('[data-d-up]', root);
    const note = $('[data-guests-note]', root);
    const wine = $('[data-wine-toggle]', root);
    const winePrice = $('[data-wine-price]', root);
    const lines = $('[data-d-lines]', root);
    const totalEl = $('[data-d-total]', root);
    const ppEl = $('[data-d-pp]', root);
    const depositEl = $('[data-d-deposit]', root);
    const MIN = 6;
    const SERVICE = 0.125;
    const DEPOSIT = 0.25;
    const gbp = money('GBP', { locale: 'en-GB' });
    const gbp2 = money('GBP', { decimals: 2, locale: 'en-GB' });

    function render(changed) {
      const menu = $('input[name="menu"]:checked', root);
      const max = Number(menu.dataset.max);
      let n = Math.round(Number(guests.value)) || MIN;
      const wasAdjusted = n > max;
      n = Math.min(max, Math.max(MIN, n));
      guests.value = n;
      guests.max = max;
      down.disabled = n <= MIN;
      up.disabled = n >= max;

      note.classList.toggle('is-warning', wasAdjusted && changed === 'menu');
      note.textContent = wasAdjusted && changed === 'menu'
        ? `${menu.value} seats up to ${max}, so we've adjusted your party.`
        : `Groups of ${MIN}–${max}.`;

      const pp = Number(menu.dataset.pp);
      const winePp = Number(menu.dataset.wine);
      winePrice.textContent = `(${gbp.format(winePp)} pp)`;

      const food = pp * n;
      const drinks = wine.checked ? winePp * n : 0;
      const service = (food + drinks) * SERVICE;
      const total = food + drinks + service;

      const row = (label, value) => `<div><dt>${label}</dt><dd>${value}</dd></div>`;
      lines.innerHTML = [
        row(`${menu.value} × ${n}`, gbp.format(food)),
        wine.checked ? row(`Wine pairing × ${n}`, gbp.format(drinks)) : '',
        row('Service (12.5%)', gbp2.format(service)),
      ].join('');

      animateNumber(totalEl, total, (v) => gbp.format(Math.round(v)));
      ppEl.textContent = `${gbp2.format(total / n)} per guest, all in`;
      depositEl.textContent = `A ${DEPOSIT * 100}% deposit of ${gbp.format(Math.round(total * DEPOSIT))} secures your date. Fully refundable up to 14 days before.`;
    }

    down.addEventListener('click', () => { guests.value = Number(guests.value) - 1; render(); });
    up.addEventListener('click', () => { guests.value = Number(guests.value) + 1; render(); });
    guests.addEventListener('change', () => render());
    root.addEventListener('change', (e) => {
      if (e.target.name === 'menu') render('menu');
      else if (e.target === wine) render();
    });
    root.addEventListener('submit', (e) => e.preventDefault());
    render();
  })();
})();
