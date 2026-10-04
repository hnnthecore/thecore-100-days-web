/*!
 * Thecore Showcase Shell
 * Shared behaviour for every day's demo page: theme toggle, device-width
 * switching for demo frames, OS-aware shortcut labels, and placeholder links.
 * Exposes a tiny `window.Thecore` API that day scripts can use.
 */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const THEME_KEY = 'thecore-theme';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  /* ---------- Theme ---------- */
  function applyTheme(next) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* storage unavailable (private mode): theme still applies for this visit */
    }
  }

  const systemDark = matchMedia('(prefers-color-scheme: dark)');

  /** Read the saved preference: 'light', 'dark' or 'system'. */
  function getThemePreference() {
    try {
      return localStorage.getItem(THEME_KEY) || 'system';
    } catch (e) {
      return 'system';
    }
  }

  function withTransition(update) {
    // Cross-fade the whole page when the browser supports View Transitions.
    if (document.startViewTransition && !reducedMotion.matches) document.startViewTransition(update);
    else update();
  }

  /** Set 'light', 'dark' or 'system' (follow the OS). */
  function setTheme(mode) {
    withTransition(() => {
      if (mode === 'system') {
        document.documentElement.dataset.theme = systemDark.matches ? 'dark' : 'light';
        try {
          localStorage.removeItem(THEME_KEY);
        } catch (e) {
          /* storage unavailable */
        }
      } else {
        applyTheme(mode);
      }
      document.dispatchEvent(new CustomEvent('thecore:themechange', { detail: { mode } }));
    });
  }

  function toggleTheme() {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  }

  // When following the system, react live to OS theme changes.
  systemDark.addEventListener('change', () => {
    if (getThemePreference() === 'system') {
      document.documentElement.dataset.theme = systemDark.matches ? 'dark' : 'light';
    }
  });

  /* ---------- Page wiring ---------- */
  // Device-width switchers for each demo frame
  $$('.viewport-switch').forEach((group) => {
    const frame = $('[data-frame]', group.closest('.demo'));
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-viewport]');
      if (!btn || !frame) return;
      $$('button', group).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      frame.dataset.viewport = btn.dataset.viewport;
    });
  });

  $$('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', toggleTheme));

  // Show the right modifier key for the visitor's OS.
  $$('[data-mod]').forEach((el) => {
    el.textContent = isMac ? '⌘' : 'Ctrl';
  });

  // Demo links point to "#"; stop them from jumping the page.
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[href="#"]')) e.preventDefault();
  });

  window.Thecore = { $, $$, toggleTheme, setTheme, getThemePreference, reducedMotion, isMac };
})();
