/**
 * Day 037 · Pawprint Veterinary Care · pet portraits drawn in code (dog, cat, rabbit).
 */
export type Pet = 'dog' | 'cat' | 'rabbit';

const PALETTE: Record<Pet, { fur: string; dark: string; inner: string }> = {
  dog: { fur: '#d8a566', dark: '#9a6a34', inner: '#f3d9b0' },
  cat: { fur: '#9fa6b5', dark: '#5d6578', inner: '#f4c5cc' },
  rabbit: { fur: '#efe6da', dark: '#bfae98', inner: '#f6c9cf' },
};

export function pet(kind: Pet, label = '') {
  const c = PALETTE[kind];
  const eyes = `<g class="vt-eyes"><ellipse cx="78" cy="108" rx="7" ry="9" fill="#1b2a22"/><ellipse cx="122" cy="108" rx="7" ry="9" fill="#1b2a22"/><circle cx="80" cy="105" r="2.6" fill="#fff"/><circle cx="124" cy="105" r="2.6" fill="#fff"/></g>`;
  let body = '';
  if (kind === 'dog') body = `
    <g class="vt-ear vt-ear--l"><ellipse cx="46" cy="104" rx="22" ry="44" fill="${c.dark}" transform="rotate(14 46 104)"/></g>
    <g class="vt-ear vt-ear--r"><ellipse cx="154" cy="104" rx="22" ry="44" fill="${c.dark}" transform="rotate(-14 154 104)"/></g>
    <circle cx="100" cy="112" r="58" fill="${c.fur}"/>
    <ellipse cx="100" cy="134" rx="30" ry="24" fill="${c.inner}"/>
    ${eyes}
    <ellipse cx="100" cy="124" rx="11" ry="8" fill="#2a2320"/>
    <path d="M100 132v8M88 142q12 10 24 0" fill="none" stroke="#2a2320" stroke-width="3" stroke-linecap="round"/>
    <path class="vt-tongue" d="M94 146q6 16 12 0z" fill="#f0788a"/>`;
  if (kind === 'cat') body = `
    <path class="vt-ear vt-ear--l" d="M48 92 52 38 92 70z" fill="${c.fur}"/><path d="M56 80 58 52 80 68z" fill="${c.inner}"/>
    <path class="vt-ear vt-ear--r" d="M152 92 148 38 108 70z" fill="${c.fur}"/><path d="M144 80 142 52 120 68z" fill="${c.inner}"/>
    <ellipse cx="100" cy="112" rx="60" ry="54" fill="${c.fur}"/>
    <path d="M100 58v18M84 62l4 14M116 62l-4 14" stroke="${c.dark}" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="78" cy="108" rx="8" ry="10" fill="#e8f0a0"/><ellipse cx="122" cy="108" rx="8" ry="10" fill="#e8f0a0"/>
    <ellipse cx="78" cy="108" rx="2.6" ry="9" fill="#1b2a22"/><ellipse cx="122" cy="108" rx="2.6" ry="9" fill="#1b2a22"/>
    <path d="M94 126h12l-6 8z" fill="#e58f9c"/><path d="M100 134q-8 10-16 4M100 134q8 10 16 4" fill="none" stroke="#2a2320" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M60 128l-30-6M60 136l-30 4M140 128l30-6M140 136l30 4" stroke="${c.dark}" stroke-width="2" stroke-linecap="round"/>`;
  if (kind === 'rabbit') body = `
    <g class="vt-ear vt-ear--l"><ellipse cx="74" cy="46" rx="16" ry="48" fill="${c.fur}" transform="rotate(-8 74 46)"/><ellipse cx="74" cy="48" rx="8" ry="36" fill="${c.inner}" transform="rotate(-8 74 48)"/></g>
    <g class="vt-ear vt-ear--r"><ellipse cx="126" cy="46" rx="16" ry="48" fill="${c.fur}" transform="rotate(8 126 46)"/><ellipse cx="126" cy="48" rx="8" ry="36" fill="${c.inner}" transform="rotate(8 126 48)"/></g>
    <ellipse cx="100" cy="116" rx="58" ry="52" fill="${c.fur}"/>
    <ellipse cx="100" cy="132" rx="26" ry="20" fill="#fff" opacity=".7"/>
    ${eyes}
    <path d="M94 124h12l-6 7z" fill="#e58f9c"/><path d="M100 131v6M90 140q10 8 20 0" fill="none" stroke="#2a2320" stroke-width="2.6" stroke-linecap="round"/>
    <rect x="95" y="140" width="10" height="12" rx="2" fill="#fff" stroke="${c.dark}" stroke-width="1.5"/>`;
  return `<svg viewBox="0 0 200 190" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;
}
