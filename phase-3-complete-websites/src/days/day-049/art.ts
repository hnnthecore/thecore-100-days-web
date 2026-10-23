/** Day 049 · Brightside Dental · icons for the eight treatments and the hero smile illustration, all drawn in code. */
const P: Record<string, string> = {
  tooth: '<path d="M7 4c-2.5 0-4 2-4 4.5 0 2.4 1 3.8 1.5 6.2.4 2 .9 5.3 2.2 5.3 1.4 0 1.1-3.6 2.3-3.6S10.4 20 12 20s.5-2 1.8-2 .9 3.6 2.3 3.6c1.3 0 1.800-3.300 2.200-5.300.5-2.400 1.500-3.800 1.500-6.200C19.800 6 18.300 4 16 4c-1.500 0-2.300.8-4 .8S8.500 4 7 4z"/>',
  spark: '<path d="M12 3l1.8 5.2L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/><path d="M19 16l.7 1.800L21.500 18.500l-1.800.7L19 21l-.7-1.800L16.500 18.500l1.800-.7z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900l2.100 2.100M17 17l2.100 2.100M4.900 19.100L7 17M17 7l2.100-2.100"/>',
  align: '<path d="M4 15c0-4 3-8 8-8s8 4 8 8"/><path d="M6 15v3M10 14v4M14 14v4M18 15v3"/>',
  anchor: '<circle cx="12" cy="5" r="2.200"/><path d="M12 7.200V21M7 11h10M4 14c0 4 3.500 7 8 7s8-3 8-7"/>',
  shield: '<path d="M12 3l8 3v6c0 4.500-3.300 8-8 9-4.700-1-8-4.500-8-9V6z"/><path d="M8.500 12l2.500 2.500 4.500-5"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.800 2.500 2.500 4 2.500s3-.7 4-2.500"/><path d="M9 9.500v.5M15 9.500v.5"/>',
  bolt: '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
};
export function icon(name: string, size = 26): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] ?? ''}</svg>`;
}

/** The hero picture: a big friendly smile with floating sparkles and a toothbrush, on a soft blob. */
export function heroSmile(): string {
  return `<svg viewBox="0 0 440 400" role="img" aria-label="Illustration of a bright, happy smile" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="bdb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfeef0"/><stop offset="1" stop-color="#ffd9cd"/></linearGradient></defs>
  <path d="M60 210C40 110 140 30 240 40s170 80 150 180-100 170-190 160S80 310 60 210z" fill="url(#bdb)"/>
  <path d="M110 205c28 62 82 96 110 96s82-34 110-96c-62 22-158 22-220 0z" fill="#fff" stroke="#0f2a3d" stroke-width="5" stroke-linejoin="round"/>
  <path d="M110 205c62 22 158 22 220 0" fill="none" stroke="#0f2a3d" stroke-width="5" stroke-linecap="round"/>
  <g stroke="#0f2a3d" stroke-width="3" stroke-linecap="round" opacity=".55"><path d="M150 226v30M185 232v42M220 234v46M255 232v42M290 226v30"/></g>
  <path d="M130 150c10-24 34-34 54-30M310 150c-10-24-34-34-54-30" fill="none" stroke="#0f2a3d" stroke-width="6" stroke-linecap="round"/>
  <circle cx="155" cy="170" r="9" fill="#0f2a3d"/><circle cx="285" cy="170" r="9" fill="#0f2a3d"/>
  <g fill="#ff7a59"><path d="M360 70l6 16 16 6-16 6-6 16-6-16-16-6 16-6z"/><path d="M70 90l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#0e7c86"/><path d="M350 300l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#0e7c86"/></g>
  <g transform="rotate(-24 90 320)"><rect x="40" y="312" width="130" height="16" rx="8" fill="#0e7c86"/><rect x="150" y="296" width="44" height="24" rx="6" fill="#fff" stroke="#0f2a3d" stroke-width="3"/><g stroke="#ff7a59" stroke-width="4" stroke-linecap="round"><path d="M158 296v-8M168 296v-8M178 296v-8M188 296v-8"/></g></g>
</svg>`;
}
