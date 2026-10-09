/**
 * Day 027 · Maison Aurelle · interactions.
 * Filterable shop with metal swatches & saved pieces · live ring designer with pricing · interactive 4Cs · reveal on scroll · appointment form.
 */
import { ring, earrings, necklace, bracelet, stoneOnly, METALS, STONES, type Metal, type Stone, type Shape, type Setting } from './art';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const root = $('.ma');
root.classList.add('ma-js');
const gbp = (n: number) => '£' + Math.round(n).toLocaleString('en-GB');
const smooth = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/* ---------- Header ---------- */
const header = $('[data-header]');
const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Shop ---------- */
type Piece = { id: string; name: string; type: string; price: number; metal: Metal; stone: Stone; shape: Shape; setting: Setting; carat: number; note: string };
const PIECES: Piece[] = JSON.parse(root.dataset.pieces!);
const chosenMetal = new Map(PIECES.map((p) => [p.id, p.metal]));
const PLATINUM = 1.08;
/** Listed prices are for each piece's default metal; platinum costs 8% more than the gold versions. */
const priceOf = (p: Piece, m: Metal) => Math.round((p.price * (m === 'white' ? PLATINUM : 1)) / (p.metal === 'white' ? PLATINUM : 1) / 10) * 10;

function art(p: Piece, metal: Metal) {
  const o = { metal, stone: p.stone, shape: p.shape, label: `${p.name}, ${METALS[metal].name}` };
  return p.type === 'rings' ? ring({ ...o, setting: p.setting, carat: p.carat }) : p.type === 'earrings' ? earrings(o) : p.type === 'necklaces' ? necklace(o) : bracelet(o);
}

let saved = new Set<string>();
try { saved = new Set(JSON.parse(localStorage.getItem('aurelle-saved') ?? '[]')); } catch { /* storage unavailable */ }
const persist = () => { try { localStorage.setItem('aurelle-saved', JSON.stringify([...saved])); } catch { /* ignore */ } };

let filter = 'all';
function paintShop() {
  let shown = 0;
  $$('[data-piece]').forEach((li) => {
    const id = li.dataset.piece!;
    const ok = filter === 'all' || (filter === 'saved' ? saved.has(id) : li.dataset.type === filter);
    li.hidden = !ok;
    if (ok) shown++;
    $<HTMLButtonElement>('[data-heart]', li).setAttribute('aria-pressed', String(saved.has(id)));
  });
  $('[data-shop-count]').textContent = `${shown} piece${shown === 1 ? '' : 's'}`;
  $('[data-empty]').classList.toggle('hidden', !(filter === 'saved' && shown === 0));
  $('[data-saved-count]').textContent = String(saved.size);
  $('[data-saved-btn]').setAttribute('aria-label', `Saved pieces: ${saved.size}`);
}
function paintPiece(li: HTMLElement) {
  const p = PIECES.find((x) => x.id === li.dataset.piece)!;
  const metal = chosenMetal.get(p.id)!;
  const artEl = $('[data-art]', li);
  if (artEl.querySelector('img')) artEl.dataset.metal = metal; else artEl.innerHTML = art(p, metal);
  $('[data-price]', li).textContent = gbp(priceOf(p, metal));
  $('[data-metal-name]', li).textContent = METALS[metal].name;
  $$<HTMLButtonElement>('[data-metal]', li).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.metal === metal)));
}
$$('[data-piece]').forEach((li) => {
  const id = li.dataset.piece!;
  $('[data-metal-name]', li).textContent = METALS[chosenMetal.get(id)!].name;
  $$<HTMLButtonElement>('[data-metal]', li).forEach((b) => b.addEventListener('click', () => { chosenMetal.set(id, b.dataset.metal as Metal); paintPiece(li); }));
  $('[data-heart]', li).addEventListener('click', () => { saved.has(id) ? saved.delete(id) : saved.add(id); persist(); paintShop(); });
});
function setFilter(f: string) {
  filter = f;
  $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.filter === f)));
  paintShop();
}
$$<HTMLButtonElement>('[data-filter]').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.filter!)));
$('[data-saved-btn]').addEventListener('click', () => { setFilter('saved'); $('#shop').scrollIntoView({ behavior: smooth }); });
paintShop();

/* ---------- Ring designer ---------- */
const form = $<HTMLFormElement>('[data-designer]');
const sizeSel = $<HTMLSelectElement>('[name="size"]');
sizeSel.innerHTML = 'HIJKLMNOPQRSTUVWXYZ'.split('').map((c) => `<option ${c === 'M' ? 'selected' : ''}>${c}</option>`).join('');
const val = (n: string) => (form.elements.namedItem(n) as RadioNodeList | HTMLInputElement).value;

const SETTING_PRICE: Record<string, number> = { solitaire: 900, halo: 1500, three: 2100 };
const SETTING_NAME: Record<string, string> = { solitaire: 'Solitaire', halo: 'Halo', three: 'Three-stone' };
const STONE_PER_CT: Record<Stone, number> = { diamond: 3300, sapphire: 1500, emerald: 1900, ruby: 2300 };
const SHAPE_F: Record<Shape, number> = { round: 1.12, oval: 1, emerald: 0.94 };
const METAL_F: Record<Metal, number> = { yellow: 1, rose: 1, white: 1.1 };

function design() {
  const d = { metal: val('metal') as Metal, stone: val('stone') as Stone, shape: val('shape') as Shape, setting: val('setting') as Setting, carat: Number(val('carat')) };
  $('[data-d-carat]').textContent = d.carat.toFixed(1);
  $('[data-ring-art]').innerHTML = ring({ ...d, label: 'Your ring design' });
  const stone = STONE_PER_CT[d.stone] * d.carat ** 1.7 * SHAPE_F[d.shape];
  const side = d.setting === 'three' ? stone * 0.18 : d.setting === 'halo' ? stone * 0.06 : 0;
  const total = Math.round(((SETTING_PRICE[d.setting] + stone + side) * METAL_F[d.metal]) / 10) * 10;
  $('[data-d-price]').textContent = gbp(total);
  const shapeName = d.shape === 'emerald' ? 'emerald-cut' : d.shape;
  const text = `${d.carat.toFixed(1)} ct ${shapeName} ${STONES[d.stone].name.toLowerCase()}, ${SETTING_NAME[d.setting].toLowerCase()} setting in ${METALS[d.metal].name}, size ${sizeSel.value}.`;
  $('[data-d-sum]').textContent = text;
  return { total, text };
}
form.addEventListener('input', design);
form.addEventListener('change', design);
form.addEventListener('submit', (e) => e.preventDefault());
$('[data-request]').addEventListener('click', () => {
  const d = design();
  $<HTMLInputElement>('[name="kind"][value="Bespoke consultation"]').checked = true;
  $<HTMLTextAreaElement>('[data-note]').value = `I’d like to talk about this design: ${d.text} Estimated ${gbp(d.total)}.`;
});
design();

/* ---------- The 4Cs ---------- */
const CUT = ['Good', 'Very good', 'Excellent'];
const CUT_HELP = ['Reflects most light, with a little leaking from the sides. A kind choice for a smaller budget.', 'Bright and lively. Almost indistinguishable from Excellent to the eye.', 'Every facet is angled to return light through the top. This is where the sparkle comes from.'];
const COLOURS = ['D', 'E', 'F', 'G', 'H', 'I', 'J'];
const COLOUR_HELP = ['Absolutely colourless. The rarest grade, and an ice-white stone.', 'Colourless. Only an expert can tell it from D, side by side.', 'Colourless. Exceptional value, and our most-chosen grade.', 'Near-colourless. Looks white once set in a ring.', 'Near-colourless. A hint of warmth, lovely in yellow gold.', 'Slightly warm. Best paired with yellow or rose gold.', 'Faintly warm. A soft, vintage character at a gentler price.'];
const CLARITY = ['FL / IF', 'VVS', 'VS1', 'VS2', 'SI1'];
const CLARITY_HELP = ['Flawless inside and out. Collectors’ stones.', 'Inclusions only visible under 10× magnification by a grader.', 'Minor inclusions, invisible to the naked eye. A sweet spot.', 'Slightly larger inclusions, still eye-clean. Great value.', 'Small inclusions that may be just visible. Choose carefully, and let us select the stone.'];
const caratHelp = (ct: number) => `About ${(6.5 * ct ** (1 / 3)).toFixed(1)} mm across. ${ct < 0.5 ? 'Delicate and understated.' : ct < 1 ? 'A popular, elegant size.' : ct < 2 ? 'Substantial and unmistakable.' : 'A statement piece.'}`;

const fourc = $<HTMLFormElement>('[data-fourc]');
const get = (k: string) => Number($<HTMLInputElement>(`[data-c="${k}"]`).value);
function lab() {
  const ct = get('carat'), cut = get('cut'), col = get('colour'), cla = get('clarity');
  $('[data-stone]').innerHTML = stoneOnly({ stone: 'diamond', shape: 'round', size: 30 + ct * 22, fire: [0.45, 0.75, 1][cut], tint: col * 0.045, flaws: [0, 1, 2, 4, 7][cla] });
  $('[data-v="carat"]').textContent = `${ct.toFixed(2)} ct`;
  $('[data-v="cut"]').textContent = CUT[cut];
  $('[data-v="colour"]').textContent = COLOURS[col];
  $('[data-v="clarity"]').textContent = CLARITY[cla];
  $('[data-h="carat"]').textContent = caratHelp(ct);
  $('[data-h="cut"]').textContent = CUT_HELP[cut];
  $('[data-h="colour"]').textContent = COLOUR_HELP[col];
  $('[data-h="clarity"]').textContent = CLARITY_HELP[cla];
  $('[data-lab-sum]').textContent = `${ct.toFixed(2)} ct · ${CUT[cut]} · ${COLOURS[col]} · ${CLARITY[cla]}`;
  const spoken: [string, string][] = [['carat', `${ct.toFixed(2)} carats`], ['cut', CUT[cut]], ['colour', `grade ${COLOURS[col]}`], ['clarity', CLARITY[cla]]];
  spoken.forEach(([k, t]) => $<HTMLInputElement>(`[data-c="${k}"]`).setAttribute('aria-valuetext', t));
}
fourc.addEventListener('input', lab);
fourc.addEventListener('submit', (e) => e.preventDefault());
lab();

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.25 });
$$('[data-reveal]').forEach((el, i) => { el.style.transitionDelay = `${i * 90}ms`; io.observe(el); });

/* ---------- Appointment ---------- */
const visit = $<HTMLFormElement>('[data-visit]');
const dateIn = $<HTMLInputElement>('#v-date');
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
dateIn.min = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function check(i: HTMLInputElement) {
  let ok: boolean;
  if (i.type === 'date') {
    const d = i.value ? new Date(i.value + 'T00:00') : null;
    ok = !!d && d >= new Date(i.min + 'T00:00') && d.getDay() >= 2 && d.getDay() <= 6;
  } else if (i.type === 'email') ok = EMAIL.test(i.value.trim());
  else ok = i.value.trim().length > 1;
  i.setAttribute('aria-invalid', String(!ok));
  $(`#${i.id}-e`).hidden = ok;
  return ok;
}
$$<HTMLInputElement>('[data-req]', visit).forEach((i) => i.addEventListener('blur', () => { if (i.value) check(i); }));
visit.addEventListener('submit', (e) => {
  e.preventDefault();
  const bad = $$<HTMLInputElement>('[data-req]', visit).filter((i) => !check(i));
  if (bad.length) { $('[data-visit-ok]').textContent = ''; bad[0].focus(); return; }
  const kind = (visit.elements.namedItem('kind') as RadioNodeList).value.toLowerCase();
  const when = new Date(dateIn.value + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  $('[data-visit-ok]').textContent = `Thank you, ${$<HTMLInputElement>('#v-name').value.trim().split(/\s+/)[0]}. We’ve pencilled in your ${kind} for ${when} at ${$<HTMLSelectElement>('#v-time').value}. (Demo: nothing was sent.)`;
});
