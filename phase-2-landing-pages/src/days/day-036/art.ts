/**
 * Day 036 · Latch & Lane · building facades drawn in code, one per property type.
 */
export type Kind = 'house' | 'terrace' | 'flat' | 'bungalow' | 'townhouse';

const win = (x: number, y: number, w = 22, h = 26, lit = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${lit ? '#ffe9a8' : '#cfe3ee'}" stroke="#14213d" stroke-width="2"/><path d="M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}" stroke="#14213d" stroke-width="1.5"/>`;

export function home(kind: Kind, wall: string, roof: string, label = '') {
  const door = (x: number, c = '#ff6b5b') => `<rect x="${x}" y="130" width="22" height="40" rx="3" fill="${c}" stroke="#14213d" stroke-width="2"/><circle cx="${x + 17}" cy="152" r="1.8" fill="#14213d"/>`;
  let b = '';
  if (kind === 'house') b = `<path d="M70 90 160 40 250 90z" fill="${roof}" stroke="#14213d" stroke-width="2.5"/><rect x="224" y="40" width="14" height="34" fill="#a85b4a" stroke="#14213d" stroke-width="2"/><rect x="80" y="90" width="160" height="80" fill="${wall}" stroke="#14213d" stroke-width="2.5"/>${win(96, 106)}${win(202, 106)}${door(149)}<path d="M140 70h40" stroke="#14213d" stroke-width="2"/>${win(148, 58, 24, 20, true)}`;
  if (kind === 'terrace') b = [0, 1, 2].map((i) => { const x = 40 + i * 80; const c = ['#d98a6c', wall, '#c47a60'][i]; return `<rect x="${x}" y="70" width="80" height="100" fill="${c}" stroke="#14213d" stroke-width="2.5"/><path d="M${x} 70 ${x + 40} 44 ${x + 80} 70z" fill="${roof}" stroke="#14213d" stroke-width="2"/>${win(x + 12, 84, 20, 22, i === 1)}${win(x + 46, 84, 20, 22)}${win(x + 12, 128, 22, 26)}${door(x + 46, ['#2f5d8a', '#ff6b5b', '#3b7d5a'][i])}`; }).join('');
  if (kind === 'flat') b = `<rect x="90" y="20" width="140" height="150" fill="${wall}" stroke="#14213d" stroke-width="2.5"/><rect x="90" y="20" width="140" height="10" fill="${roof}"/>${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => win(102 + c * 42, 40 + r * 32, 24, 20, (r + c) % 3 === 0)).join('') + `<rect x="${100}" y="${62 + r * 32}" width="124" height="3" fill="#14213d" opacity=".35"/>`).join('')}<rect x="145" y="140" width="30" height="30" fill="#14213d"/><rect x="149" y="144" width="22" height="26" fill="#cfe3ee"/>`;
  if (kind === 'bungalow') b = `<path d="M50 104 160 62 270 104z" fill="${roof}" stroke="#14213d" stroke-width="2.5"/><rect x="62" y="104" width="196" height="66" fill="${wall}" stroke="#14213d" stroke-width="2.5"/>${win(78, 118, 26, 26)}${win(216, 118, 26, 26)}${door(149)}<rect x="70" y="164" width="180" height="6" fill="#8a8f98"/>`;
  if (kind === 'townhouse') b = `<rect x="110" y="26" width="100" height="144" fill="${wall}" stroke="#14213d" stroke-width="2.5"/><path d="M104 26h112l-12-14H116z" fill="${roof}" stroke="#14213d" stroke-width="2"/>${win(124, 42, 26, 24, true)}${win(168, 42, 26, 24)}${win(124, 82, 26, 24)}${win(168, 82, 26, 24, true)}${win(124, 122, 22, 26)}${door(170, '#14213d')}`;
  return `<svg viewBox="0 0 320 200" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} preserveAspectRatio="xMidYMid slice">
    <rect width="320" height="200" fill="#dbe9f2"/><circle cx="270" cy="38" r="16" fill="#fff4cf"/><path d="M0 170h320v30H0z" fill="#9fc08c"/><path d="M0 172h320" stroke="#14213d" stroke-width="2" opacity=".4"/>
    <circle cx="36" cy="150" r="22" fill="#6f9f67"/><rect x="33" y="165" width="6" height="8" fill="#7b5b3a"/><circle cx="290" cy="156" r="16" fill="#7fae72"/>
    ${b}
  </svg>`;
}
