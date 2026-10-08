/**
 * Day 038 · Ember & Oak Coffee Roasters · coffee bags and beans drawn in code.
 */
export const ROAST_COLORS = ['#a8703f', '#8a5630', '#6d3f21', '#4b2a16', '#2c180d'];

export function bag(name: string, origin: string, roast: number, accent: string, label = '') {
  const id = 'b' + Math.random().toString(36).slice(2, 7);
  const body = ROAST_COLORS[roast - 1];
  return `<svg viewBox="0 0 200 250" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".25" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>
    <ellipse cx="100" cy="240" rx="72" ry="7" fill="#000" opacity=".16"/>
    <path d="M42 36 158 36 168 226Q100 236 32 226z" fill="#efe3cc"/>
    <path d="M42 36 158 36 160 52 40 52z" fill="#d8c7a6"/><path d="M48 44h104" stroke="#bda97f" stroke-width="1.5" stroke-dasharray="3 4"/>
    <path d="M38 60 162 60 170 226Q100 236 30 226z" fill="${body}"/>
    <rect x="58" y="92" width="84" height="104" rx="6" fill="#f6ecd9"/>
    <circle cx="100" cy="114" r="12" fill="${accent}"/><path d="M94 114q3-8 6-8t6 8q-3 8-6 8t-6-8z" fill="#f6ecd9" opacity=".9"/>
    <text x="100" y="150" text-anchor="middle" font-family="Syne Variable, sans-serif" font-weight="800" font-size="10" fill="#2b1a10" textLength="${Math.min(76, name.length * 6.6).toFixed(0)}" lengthAdjust="spacingAndGlyphs">${name.toUpperCase().slice(0, 22)}</text>
    <text x="100" y="166" text-anchor="middle" font-family="Figtree Variable, sans-serif" font-size="8.5" fill="#6b5a46" letter-spacing="1.4">${origin.toUpperCase()}</text>
    <g>${[1, 2, 3, 4, 5].map((i) => `<circle cx="${74 + i * 10.5}" cy="184" r="3.1" fill="${i <= roast ? '#2b1a10' : '#d9c7a4'}"/>`).join('')}</g>
    <path d="M38 60 162 60 170 226Q100 236 30 226z" fill="url(#${id})"/>
  </svg>`;
}

export function bean(color: string) {
  return `<svg viewBox="0 0 120 150" aria-hidden="true"><ellipse cx="60" cy="75" rx="46" ry="62" fill="${color}" transform="rotate(18 60 75)"/><path d="M60 14C40 52 80 98 60 136" stroke="rgba(0,0,0,.35)" stroke-width="7" stroke-linecap="round" fill="none" transform="rotate(18 60 75)"/><ellipse cx="46" cy="50" rx="10" ry="22" fill="#fff" opacity=".12" transform="rotate(18 60 75)"/></svg>`;
}
