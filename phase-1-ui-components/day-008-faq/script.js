/*!
 * Thecore · 100 Days of Web Development
 * Day 008: FAQ Sections
 *
 * Every question is real HTML (mostly native <details>), so the FAQs work
 * and are searchable by Google even without JavaScript. Scripts add search,
 * suggestions, votes, the chat flow and tabs.
 */
(() => {
  'use strict';

  const { $, $$, reducedMotion } = window.Thecore;
  const { enhance, fakeRequest, showSuccess } = window.FormKit;

  const wait = (ms) => new Promise((r) => setTimeout(r, reducedMotion.matches ? 0 : ms));
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  /** Wire a tablist + panels (WAI-ARIA tabs with arrow keys). */
  function wireTabs(tablist, onSelect) {
    const tabs = $$('[role="tab"]', tablist);
    const select = (tab, focus = false) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      onSelect?.(tab);
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in keys)) return;
        e.preventDefault();
        select(tabs[(keys[e.key] + tabs.length) % tabs.length], true);
      });
    });
  }

  /* ======================================================================
     01 · Lumen: searchable FAQ with categories, votes and copy-link
     ====================================================================== */
  (() => {
    const root = $('[data-sfaq]');
    const search = $('[data-sfaq-search]', root);
    const status = $('[data-sfaq-status]', root);
    const items = $$('.qa', root);
    const cats = $$('[data-cat]', $('.sfaq__cats', root));
    const empty = $('[data-sfaq-empty]', root);
    let category = 'all';

    // Keep each question's original text so highlighting can be undone
    items.forEach((item) => {
      const q = $('.qa__q', item);
      q.dataset.text = q.textContent;

      // Add the vote + copy-link footer to every answer
      const foot = document.createElement('div');
      foot.className = 'qa__foot';
      foot.innerHTML = `
        <span class="qa__vote">Was this helpful?
          <button type="button" aria-pressed="false" data-vote="yes"><svg class="icon"><use href="#i-thumb"/></svg>Yes</button>
          <button type="button" aria-pressed="false" data-vote="no"><svg class="icon"><use href="#i-thumb-down"/></svg>No</button>
        </span>
        <button class="qa__link" type="button" data-copy-link><svg class="icon"><use href="#i-link"/></svg><span>Copy link</span></button>`;
      $('.qa__a', item).append(foot);
    });

    function render() {
      const query = search.value.trim();
      const re = query ? new RegExp(`(${escapeRegExp(query)})`, 'gi') : null; // for splitting/highlighting
      const test = query ? new RegExp(escapeRegExp(query), 'i') : null; // for matching (no shared state)
      let shown = 0;

      items.forEach((item) => {
        const q = $('.qa__q', item);
        const text = q.dataset.text;
        const answer = $('.qa__a p', item).textContent;
        const inCat = category === 'all' || item.dataset.cat === category;
        const matches = !test || test.test(text) || test.test(answer);

        item.hidden = !(inCat && matches);
        if (!item.hidden) shown += 1;

        // Highlight matching words in the question (text only, so it's safe)
        q.textContent = '';
        if (re && matches) {
          text.split(re).forEach((part, i) => {
            q.append(i % 2 ? Object.assign(document.createElement('mark'), { textContent: part }) : part);
          });
          // Open answers whose body matched but the question didn't, so the reason is visible
          if (!test.test(text)) item.open = true;
        } else {
          q.textContent = text;
        }
      });

      empty.hidden = shown > 0;
      $('span', empty).textContent = query;
      status.textContent = query ? `${shown} result${shown === 1 ? '' : 's'} for “${query}”` : '';
    }

    search.addEventListener('input', render);
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        search.value = '';
        render();
      }
    });

    cats.forEach((btn) => {
      btn.addEventListener('click', () => {
        category = btn.dataset.cat;
        cats.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        render();
      });
    });

    root.addEventListener('click', async (e) => {
      const vote = e.target.closest('[data-vote]');
      if (vote) {
        const group = vote.closest('.qa__vote');
        $$('[data-vote]', group).forEach((b) => b.setAttribute('aria-pressed', String(b === vote)));
        let thanks = $('.qa__thanks', group.parentElement);
        if (!thanks) {
          thanks = Object.assign(document.createElement('span'), { className: 'qa__thanks' });
          thanks.setAttribute('role', 'status');
          group.after(thanks);
        }
        thanks.textContent = vote.dataset.vote === 'yes' ? 'Thanks for letting us know!' : 'Thanks. We’ll improve this answer.';
        return;
      }

      const link = e.target.closest('[data-copy-link]');
      if (link) {
        const id = link.closest('.qa').id;
        const url = `${location.origin}${location.pathname}#${id}`;
        try { await navigator.clipboard.writeText(url); } catch (err) { /* clipboard unavailable */ }
        $('span', link).textContent = 'Link copied';
        setTimeout(() => { $('span', link).textContent = 'Copy link'; }, 1800);
      }
    });

    // Opening the page with #faq-refund opens that answer
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (target?.matches('.qa')) target.open = true;

    render();
  })();

  /* ======================================================================
     02 · Atlas: help-centre search with suggestions (ARIA combobox)
     ====================================================================== */
  (() => {
    const root = $('[data-help]');
    const home = $('[data-help-home]', root);
    const article = $('[data-help-article]', root);
    const input = $('[data-help-input]', root);
    const list = $('[data-help-suggest]', root);
    const topicList = $('[data-topic-list]', root);

    const ARTICLES = [
      { id: 'deploy', topic: 'Getting started', title: 'Deploy your first project', body: '<p>Connect your Git repository and Atlas builds and deploys every push automatically.</p><ol><li>Click <strong>New project</strong>.</li><li>Choose your repository.</li><li>Press <strong>Deploy</strong>. Your site is live in under a minute.</li></ol>' },
      { id: 'domain', topic: 'Getting started', title: 'Add a custom domain', body: '<p>Go to <strong>Project → Domains</strong>, enter your domain and add the DNS record we show you. HTTPS certificates are issued automatically.</p>' },
      { id: 'rollback', topic: 'Getting started', title: 'Roll back a deployment', body: '<p>Open <strong>Deployments</strong>, find a previous version and choose <strong>Promote to production</strong>. It takes effect instantly.</p>' },
      { id: 'invite', topic: 'Teams', title: 'Invite your team', body: '<p>In <strong>Settings → Members</strong>, enter email addresses and pick a role. Invites expire after 7 days.</p>' },
      { id: 'roles', topic: 'Teams', title: 'Understand roles and permissions', body: '<p><strong>Viewers</strong> can see projects, <strong>Developers</strong> can deploy previews, and <strong>Admins</strong> manage billing and members.</p>' },
      { id: 'sso', topic: 'Teams', title: 'Set up SAML single sign-on', body: '<p>Available on Team and Enterprise. Add Atlas as an app in your identity provider, then paste the metadata URL in <strong>Settings → Security</strong>.</p>' },
      { id: 'invoices', topic: 'Billing', title: 'Download invoices', body: '<p>Every invoice is in <strong>Settings → Billing → History</strong>, as a PDF with your VAT number.</p>' },
      { id: 'usage', topic: 'Billing', title: 'How usage is calculated', body: '<p>Bandwidth and build minutes are measured per calendar month and reset on the 1st. You get an email at 80% of your limit.</p>' },
      { id: 'webhooks', topic: 'Integrations', title: 'Send deploy events with webhooks', body: '<p>Add an endpoint in <strong>Project → Webhooks</strong>. Every request is signed so you can verify it came from Atlas.</p>' },
      { id: 'slack', topic: 'Integrations', title: 'Get deploy alerts in Slack', body: '<p>Install the Atlas Slack app and pick a channel. You’ll see every production deploy and failed build.</p>' },
    ];

    let results = [];
    let active = -1;

    const close = () => {
      list.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    };

    function suggest() {
      const q = input.value.trim().toLowerCase();
      if (!q) return close();
      results = ARTICLES.filter((a) => `${a.title} ${a.topic} ${a.body}`.toLowerCase().includes(q)).slice(0, 5);
      list.innerHTML = '';
      if (!results.length) {
        list.innerHTML = '<li class="is-empty" role="option" aria-disabled="true">No articles found. Try fewer words.</li>';
      }
      results.forEach((a, i) => {
        const li = document.createElement('li');
        li.id = `help-opt-${a.id}`;
        li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', 'false');
        li.innerHTML = `<strong></strong><small>${a.topic}</small>`;
        $('strong', li).textContent = a.title;
        li.addEventListener('pointerdown', (e) => { e.preventDefault(); open(a); });
        li.addEventListener('pointermove', () => highlight(i));
        list.append(li);
      });
      list.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      highlight(-1);
    }

    function highlight(i) {
      const options = $$('[role="option"]:not(.is-empty)', list);
      active = i;
      options.forEach((o, n) => o.setAttribute('aria-selected', String(n === i)));
      if (options[i]) input.setAttribute('aria-activedescendant', options[i].id);
      else input.removeAttribute('aria-activedescendant');
    }

    function open(a) {
      close();
      $('[data-article-topic]', article).textContent = a.topic;
      $('[data-article-title]', article).textContent = a.title;
      $('[data-article-body]', article).innerHTML = a.body;
      const related = $('[data-article-related]', article);
      related.innerHTML = '';
      ARTICLES.filter((x) => x.topic === a.topic && x.id !== a.id).slice(0, 3).forEach((r) => {
        const li = document.createElement('li');
        const btn = Object.assign(document.createElement('button'), { type: 'button', textContent: r.title });
        btn.addEventListener('click', () => open(r));
        li.append(btn);
        related.append(li);
      });
      home.hidden = true;
      article.hidden = false;
      article.focus();
    }

    input.addEventListener('input', suggest);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (list.hidden) suggest();
        highlight(Math.min(active + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlight(Math.max(active - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[active]) open(results[active]);
        else if (results[0]) open(results[0]);
      } else if (e.key === 'Escape') {
        close();
      }
    });
    input.addEventListener('blur', () => setTimeout(close, 120));

    $$('[data-help-try]', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        input.value = btn.dataset.helpTry;
        input.focus();
        suggest();
      });
    });

    $$('[data-help-topic]', root).forEach((btn) => {
      btn.addEventListener('click', () => {
        const topic = btn.dataset.helpTopic;
        topicList.innerHTML = `<strong>${btn.querySelector('strong').textContent}:</strong> `;
        ARTICLES.filter((a) => a.topic === topic).forEach((a) => {
          const b = Object.assign(document.createElement('button'), { type: 'button', textContent: a.title });
          b.addEventListener('click', () => open(a));
          topicList.append(b);
        });
      });
    });

    $('[data-help-back]', article).addEventListener('click', () => {
      article.hidden = true;
      home.hidden = false;
      input.value = '';
      input.focus();
    });
  })();

  /* ======================================================================
     03 · Forma: expand / collapse all
     ====================================================================== */
  (() => {
    const root = $('[data-stages]');
    const all = $$('details', root);
    $('[data-expand-all]', root).addEventListener('click', () => all.forEach((d) => { d.open = true; }));
    $('[data-collapse-all]', root).addEventListener('click', () => all.forEach((d) => { d.open = false; }));
  })();

  /* 04 · Halden needs no JavaScript: <details name="…"> keeps one answer open. */

  /* ======================================================================
     05 · Forge: chat-style FAQ
     ====================================================================== */
  (() => {
    const root = $('[data-chat]');
    const log = $('[data-chat-log]', root);
    const chips = $('[data-chat-chips]', root);
    const ANSWERS = {
      cancel: 'Yes. Monthly memberships have no contract, so you can cancel any time with 30 days’ notice in the app. 12-month plans can be cancelled early for a small fee.',
      guest: 'Absolutely. Unlimited members get a free guest pass every month, and extra guest passes are £10.',
      beginner: 'You’re in the right place! Book a free intro session and a coach will show you around, set your starting weights and suggest beginner-friendly classes.',
      parking: 'Ancoats and Didsbury have free parking for 2 hours. Spinningfields is a 3-minute walk from Deansgate station.',
      freeze: 'Yes. You can freeze your membership for 1–3 months a year for £5 a month, which is handy for holidays or injuries.',
    };
    let busy = false;

    const scrollDown = () => {
      const scroller = root.closest('[data-scroll-root]');
      scroller?.scrollTo({ top: scroller.scrollHeight, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    };

    chips.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-ask]');
      if (!btn || busy) return;
      busy = true;

      log.insertAdjacentHTML('beforeend', `<div class="bubble bubble--me"></div>`);
      log.lastElementChild.textContent = btn.textContent;
      btn.remove();
      scrollDown();

      const typing = document.createElement('div');
      typing.className = 'bubble bubble--bot typing';
      typing.setAttribute('aria-label', 'Forge help is typing');
      typing.innerHTML = '<i></i><i></i><i></i>';
      await wait(350);
      log.append(typing);
      scrollDown();
      await wait(900);

      typing.remove();
      const reply = document.createElement('div');
      reply.className = 'bubble bubble--bot';
      reply.textContent = ANSWERS[btn.dataset.ask];
      log.append(reply);
      scrollDown();

      if (!chips.children.length) {
        await wait(500);
        log.insertAdjacentHTML('beforeend', '<div class="bubble bubble--bot">That’s all my quick answers. For anything else, a coach is happy to help 👇</div>');
        scrollDown();
      }
      busy = false;
    });
  })();

  /* ======================================================================
     06 · Ember: tabs + ask a question
     ====================================================================== */
  (() => {
    const root = $('[data-tfaq]');
    wireTabs($('[role="tablist"]', root));
    const form = $('#ask-form', root);
    enhance(form, {
      onSubmit: () => fakeRequest(1000),
      onSuccess: () => showSuccess(form),
    });
  })();
})();
