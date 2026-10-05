/*!
 * Thecore mini charts: tiny, dependency-free SVG charts for dashboards.
 *
 *   Charts.area(el, { labels, series: [{ name, values, color }], format })
 *   Charts.bars(el, { labels, values, color, format, highlight })
 *   Charts.donut(el, { segments: [{ label, value, color }], center })
 *   Charts.spark(el, values, color)
 *
 * Every chart re-renders on resize (crisp text, no distortion), shows a
 * tooltip on hover/touch, and includes a visually hidden data table so
 * screen-reader users get the same information.
 */
(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function niceMax(v) {
    if (v <= 0) return 1;
    const pow = 10 ** Math.floor(Math.log10(v));
    const n = v / pow;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow;
  }

  /* How many grid steps give round labels: 5 for 5·10ⁿ (0, 1k, 2k…), else 4 (0, 250, 500…). */
  function gridSteps(max) {
    const lead = max / 10 ** Math.floor(Math.log10(max));
    return Math.round(lead) === 5 ? 5 : 4;
  }

  function srTable(caption, headers, rows) {
    return `<table class="sr-only"><caption>${esc(caption)}</caption><thead><tr>${headers.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td>${esc(c)}</td>` : `<th scope="row">${esc(c)}</th>`)).join('')}</tr>`).join('')}</tbody></table>`;
  }

  /** Re-render on size changes. Returns an update(data) function. */
  function responsive(el, draw) {
    let data = null;
    const ro = new ResizeObserver(() => data && draw(data));
    ro.observe(el);
    return (next) => { data = next; draw(data); };
  }

  function tooltip(el) {
    let tip = el.querySelector(':scope > .chart-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'chart-tip';
      tip.hidden = true;
      el.append(tip);
    }
    return tip;
  }

  /* ---------------------------------------------------------------- area */
  function area(el, initial) {
    el.classList.add('chart');
    const update = responsive(el, (d) => {
      const fmt = d.format || ((v) => v);
      const W = Math.max(el.clientWidth, 200);
      const H = el.clientHeight || 220;
      const pad = { t: 12, r: 12, b: 26, l: 44 };
      const iw = W - pad.l - pad.r;
      const ih = H - pad.t - pad.b;
      const all = d.series.flatMap((s) => s.values);
      const max = niceMax(Math.max(...all) * 1.1);
      const n = d.labels.length;
      const x = (i) => pad.l + (n === 1 ? iw / 2 : (i * iw) / (n - 1));
      const y = (v) => pad.t + ih - (v / max) * ih;

      let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
      const gs = gridSteps(max);
      for (let g = 0; g <= gs; g++) {
        const v = (max / gs) * g;
        svg += `<line class="chart-grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/>`;
        svg += `<text class="chart-axis" x="${pad.l - 8}" y="${y(v) + 4}" text-anchor="end">${esc(fmt(v, true))}</text>`;
      }
      const step = Math.ceil(n / Math.max(2, Math.floor(iw / 70)));
      d.labels.forEach((l, i) => {
        if (i % step === 0 || i === n - 1) svg += `<text class="chart-axis" x="${x(i)}" y="${H - 6}" text-anchor="middle">${esc(l)}</text>`;
      });
      d.series.forEach((s, si) => {
        const pts = s.values.map((v, i) => [x(i), y(v)]);
        const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
        const gid = `g${Math.random().toString(36).slice(2, 8)}`;
        if (si === 0) {
          svg += `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".28"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs>`;
          svg += `<path d="${line} L${x(n - 1)} ${pad.t + ih} L${x(0)} ${pad.t + ih}Z" fill="url(#${gid})"/>`;
        }
        svg += `<path class="chart-line" d="${line}" style="stroke:${s.color}"${s.dashed ? ' stroke-dasharray="5 5"' : ''}/>`;
      });
      svg += `<line class="chart-cursor" x1="0" x2="0" y1="${pad.t}" y2="${pad.t + ih}" visibility="hidden"/>`;
      d.series.forEach((s) => { svg += `<circle class="chart-dot" r="4.5" style="fill:${s.color}" visibility="hidden"/>`; });
      svg += '</svg>';

      el.innerHTML = svg + srTable(d.caption || 'Chart data', ['Period', ...d.series.map((s) => s.name)], d.labels.map((l, i) => [l, ...d.series.map((s) => fmt(s.values[i]))]));
      const tip = tooltip(el);
      const svgEl = el.querySelector('svg');
      const cursor = svgEl.querySelector('.chart-cursor');
      const dots = [...svgEl.querySelectorAll('.chart-dot')];

      const move = (clientX) => {
        const r = svgEl.getBoundingClientRect();
        const px = clientX - r.left;
        const i = Math.max(0, Math.min(n - 1, Math.round(((px - pad.l) / iw) * (n - 1))));
        cursor.setAttribute('x1', x(i));
        cursor.setAttribute('x2', x(i));
        cursor.setAttribute('visibility', 'visible');
        dots.forEach((dot, si) => {
          dot.setAttribute('cx', x(i));
          dot.setAttribute('cy', y(d.series[si].values[i]));
          dot.setAttribute('visibility', 'visible');
        });
        tip.innerHTML = `<strong>${esc(d.labels[i])}</strong>${d.series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)} <b>${esc(fmt(s.values[i]))}</b></span>`).join('')}`;
        tip.hidden = false;
        const left = Math.min(Math.max(x(i) + 12, 0), W - tip.offsetWidth - 4);
        tip.style.left = `${x(i) > W * 0.65 ? x(i) - tip.offsetWidth - 12 : left}px`;
        tip.style.top = `${pad.t}px`;
      };
      const hide = () => {
        tip.hidden = true;
        cursor.setAttribute('visibility', 'hidden');
        dots.forEach((dot) => dot.setAttribute('visibility', 'hidden'));
      };
      svgEl.addEventListener('pointermove', (e) => move(e.clientX));
      svgEl.addEventListener('pointerleave', hide);
    });
    update(initial);
    return update;
  }

  /* ---------------------------------------------------------------- bars */
  function bars(el, initial) {
    el.classList.add('chart');
    const update = responsive(el, (d) => {
      const fmt = d.format || ((v) => v);
      const W = Math.max(el.clientWidth, 160);
      const H = el.clientHeight || 180;
      const pad = { t: 10, r: 6, b: 24, l: d.axis === false ? 6 : 36 };
      const iw = W - pad.l - pad.r;
      const ih = H - pad.t - pad.b;
      const max = niceMax(Math.max(...d.values) * 1.08);
      const n = d.values.length;
      const slot = iw / n;
      const bw = Math.max(4, Math.min(38, slot * 0.62));
      let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">`;
      if (d.axis !== false) {
        const gs = gridSteps(max);
        for (let g = 0; g <= gs; g++) {
          const v = (max / gs) * g;
          const yy = pad.t + ih - (v / max) * ih;
          svg += `<line class="chart-grid" x1="${pad.l}" x2="${W - pad.r}" y1="${yy}" y2="${yy}"/><text class="chart-axis" x="${pad.l - 6}" y="${yy + 4}" text-anchor="end">${esc(fmt(v, true))}</text>`;
        }
      }
      const step = Math.ceil(n / Math.max(2, Math.floor(iw / 40)));
      d.values.forEach((v, i) => {
        const h = Math.max(2, (v / max) * ih);
        const xx = pad.l + slot * i + (slot - bw) / 2;
        const hl = d.highlight === i;
        svg += `<rect class="chart-bar${hl ? ' is-hl' : ''}" data-i="${i}" x="${xx}" y="${pad.t + ih - h}" width="${bw}" height="${h}" rx="${Math.min(6, bw / 3)}" style="fill:${hl ? d.highlightColor || d.color : d.color}"/>`;
        if (i % step === 0) svg += `<text class="chart-axis" x="${xx + bw / 2}" y="${H - 6}" text-anchor="middle">${esc(d.labels[i])}</text>`;
      });
      svg += '</svg>';
      el.innerHTML = svg + srTable(d.caption || 'Chart data', ['Item', d.name || 'Value'], d.labels.map((l, i) => [l, fmt(d.values[i])]));
      const tip = tooltip(el);
      el.querySelectorAll('.chart-bar').forEach((bar) => {
        bar.addEventListener('pointerenter', () => {
          const i = Number(bar.dataset.i);
          tip.innerHTML = `<strong>${esc(d.labels[i])}</strong><span>${esc(d.name || '')} <b>${esc(fmt(d.values[i]))}</b></span>`;
          tip.hidden = false;
          const bx = Number(bar.getAttribute('x'));
          tip.style.left = `${Math.min(bx, W - tip.offsetWidth - 4)}px`;
          tip.style.top = `${Math.max(0, Number(bar.getAttribute('y')) - tip.offsetHeight - 6)}px`;
        });
        bar.addEventListener('pointerleave', () => { tip.hidden = true; });
      });
    });
    update(initial);
    return update;
  }

  /* ---------------------------------------------------------------- donut */
  function donut(el, initial) {
    el.classList.add('chart', 'chart--donut');
    const update = responsive(el, (d) => {
      const size = Math.min(el.clientWidth || 180, el.clientHeight || 180);
      const r = size / 2 - 10;
      const c = 2 * Math.PI * r;
      const total = d.segments.reduce((s, x) => s + x.value, 0) || 1;
      let offset = 0;
      let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><g transform="rotate(-90 ${size / 2} ${size / 2})">`;
      svg += `<circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" class="chart-track" stroke-width="16"/>`;
      d.segments.forEach((s, i) => {
        const len = (s.value / total) * c;
        svg += `<circle class="chart-seg" data-i="${i}" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" style="stroke:${s.color}" stroke-width="16" stroke-dasharray="${Math.max(0, len - 2)} ${c}" stroke-dashoffset="${-offset}" stroke-linecap="butt"/>`;
        offset += len;
      });
      svg += '</g></svg>';
      const center = d.center ? `<div class="chart-center"><strong>${esc(d.center.value)}</strong><span>${esc(d.center.label)}</span></div>` : '';
      el.innerHTML = svg + center + srTable(d.caption || 'Breakdown', ['Segment', 'Value'], d.segments.map((s) => [s.label, `${s.value} (${Math.round((s.value / total) * 100)}%)`]));
      const tip = tooltip(el);
      el.querySelectorAll('.chart-seg').forEach((seg) => {
        seg.addEventListener('pointerenter', () => {
          const s = d.segments[seg.dataset.i];
          tip.innerHTML = `<span><i style="background:${s.color}"></i>${esc(s.label)} <b>${s.value} · ${Math.round((s.value / total) * 100)}%</b></span>`;
          tip.hidden = false;
          tip.style.left = '50%';
          tip.style.top = '0';
          tip.style.translate = '-50% 0';
        });
        seg.addEventListener('pointerleave', () => { tip.hidden = true; });
      });
    });
    update(initial);
    return update;
  }

  /* ---------------------------------------------------------------- spark */
  function spark(el, values, color) {
    const W = 100;
    const H = 30;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const pts = values.map((v, i) => `${((i / (values.length - 1)) * W).toFixed(1)},${(H - 2 - ((v - min) / (max - min || 1)) * (H - 4)).toFixed(1)}`);
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>`;
  }

  /** Seeded random series for demos. */
  function series(seed, n, base, spread, trend = 0) {
    let s = seed;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    let v = base;
    return Array.from({ length: n }, (_, i) => {
      v = Math.max(base * 0.3, v + (r() - 0.45) * spread + trend);
      return Math.round(v + Math.sin(i / 2) * spread * 0.3);
    });
  }

  window.Charts = { area, bars, donut, spark, series };
})();
