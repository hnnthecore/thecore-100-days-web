/** Day 046 · Wildcombe Herbal · the catalogue as plain data (no images), so the basket and the choosers can use it in the browser. */
export type Cat = 'teas' | 'salves' | 'syrups' | 'bath' | 'gifts';
export type Time = 'morning' | 'afternoon' | 'evening';
export type Taste = 'floral' | 'minty' | 'green' | 'citrus' | 'honeyed';
export interface Size { id: string; label: string; price: number }
export interface Product {
  id: string; name: string; latin: string; cat: Cat; plate: string; field: string;
  time: Time[]; taste: Taste[];
  line: string; about: string[]; ingredients: string; use: string; note: string;
  sizes: Size[]; weightNote: string; pack: 'tin' | 'pouch' | 'jar' | 'bottle' | 'box';
  mix?: string[];
}

export const CATS: Record<Cat, { name: string; line: string }> = {
  teas: { name: 'Loose-leaf teas', line: 'Whole leaves and flowers, dried on the farm and packed by hand.' },
  salves: { name: 'Salves and balms', line: 'Beeswax and herb-infused oils for hands, feet and anywhere that works hard.' },
  syrups: { name: 'Syrups and tinctures', line: 'Slow-made in small batches from our own hedgerow and garden.' },
  bath: { name: 'Bath', line: 'Salts and herbs for a long soak.' },
  gifts: { name: 'Gifts and kits', line: 'Sets and things to grow, ready to give.' },
};

export const TIMES: Record<Time, string> = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };
export const TASTES: Record<Taste, string> = { floral: 'Floral', minty: 'Minty', green: 'Green', citrus: 'Citrus', honeyed: 'Honeyed' };

export const PRODUCTS: Product[] = [
  {
    id: 'chamomile', name: 'Chamomile Flowers', latin: 'Matricaria recutita', cat: 'teas', plate: 'chamomile', field: '#f3dd6b', pack: 'tin',
    time: ['evening', 'afternoon'], taste: ['floral', 'honeyed'],
    line: 'Whole daisy heads, soft and apple-sweet.',
    about: ['We pick chamomile on dry mornings in June and July, when the heads are fully open, and have them on the drying racks within the hour. Whole flowers keep their oils, which is why a cup smells of apples and hay before you taste it.', 'It is a gentle, golden cup that is good on its own at the end of the day or with a spoon of honey.'],
    ingredients: 'Chamomile flowers (Matricaria recutita). Grown and dried at Wildcombe.', use: 'One heaped teaspoon per cup. Pour over water just off the boil and cover for five minutes. Strain and enjoy.',
    note: 'Related to daisies and ragweed. If you are allergic to plants in the daisy family, choose another tea.',
    sizes: [{ id: '50', label: '50 g', price: 5.5 }, { id: '100', label: '100 g', price: 9.5 }], weightNote: 'About 25 cups in 50 g',
  },
  {
    id: 'nettle', name: 'Stinging Nettle Leaf', latin: 'Urtica dioica', cat: 'teas', plate: 'nettle', field: '#8fc27a', pack: 'pouch',
    time: ['morning', 'afternoon'], taste: ['green'],
    line: 'Picked in May before flowering. Deep, green and clean.',
    about: ['Nettles are the first herb to come up on the combe and the one we wait for. We cut the tops in May, before they flower, and dry them in a single layer so they stay green.', 'The flavour is like a good spring broth: grassy, mineral and a little sweet. It is our morning cup, and the one regulars reorder most.'],
    ingredients: 'Nettle leaf (Urtica dioica). Grown and dried at Wildcombe.', use: 'One heaped teaspoon per cup. Pour over freshly boiled water and leave for five to seven minutes.',
    note: 'If you are pregnant or take regular medication, ask your pharmacist before adding new herbal teas.',
    sizes: [{ id: '50', label: '50 g', price: 4.8 }, { id: '100', label: '100 g', price: 8.2 }], weightNote: 'About 30 cups in 50 g',
  },
  {
    id: 'lemon-balm', name: 'Lemon Balm', latin: 'Melissa officinalis', cat: 'teas', plate: 'lemon-balm', field: '#d7e46b', pack: 'tin',
    time: ['afternoon', 'evening'], taste: ['citrus', 'green'],
    line: 'A bright lemony leaf that smells like summer.',
    about: ['Lemon balm grows like a weed in our top beds and bees will not leave it alone. We cut it twice a summer and dry it gently, so the leaves keep their colour and their scent.', 'It makes a clear, citrusy tea that is lovely hot, and even better iced with a slice of cucumber.'],
    ingredients: 'Lemon balm leaf (Melissa officinalis). Grown and dried at Wildcombe.', use: 'One heaped teaspoon per cup, freshly boiled water, five minutes. For iced tea, use double and chill.',
    note: 'If you are pregnant or take regular medication, ask your pharmacist before adding new herbal teas.',
    sizes: [{ id: '40', label: '40 g', price: 5.2 }, { id: '80', label: '80 g', price: 9 }], weightNote: 'About 25 cups in 40 g',
  },
  {
    id: 'peppermint', name: 'Peppermint', latin: 'Mentha × piperita', cat: 'teas', plate: 'peppermint', field: '#7fd1b9', pack: 'pouch',
    time: ['morning', 'afternoon'], taste: ['minty', 'green'],
    line: 'Cool, sweet and proper minty, from leaves we dry whole.',
    about: ['Most peppermint tea is dust. Ours is whole leaf, cut just before the plants flower and dried on racks with the barn doors open, so the oil stays in the leaf until you brew.', 'It is the cup for after a meal, or mid-afternoon when you want something clean and cool.'],
    ingredients: 'Peppermint leaf (Mentha × piperita). Grown and dried at Wildcombe.', use: 'One heaped teaspoon per cup, just-boiled water, four minutes. Cover the cup so the oils stay in.',
    note: 'If you are pregnant or take regular medication, ask your pharmacist before adding new herbal teas.',
    sizes: [{ id: '50', label: '50 g', price: 4.9 }, { id: '100', label: '100 g', price: 8.4 }], weightNote: 'About 30 cups in 50 g',
  },
  {
    id: 'lime-blossom', name: 'Lime Blossom', latin: 'Tilia cordata', cat: 'teas', plate: 'lime', field: '#e9e19a', pack: 'tin',
    time: ['evening'], taste: ['floral', 'honeyed'],
    line: 'Pale, honeyed flowers from the lime trees by the lane.',
    about: ['For about ten days in July the lime trees along our lane hum so loudly you can hear them from the house. We pick the flowers with their little leafy wings and dry them on muslin.', 'The tea is pale gold, soft and honeyed, with a floral note that is a lot like drinking the smell of a warm evening.'],
    ingredients: 'Lime blossom (Tilia cordata), with bracts. Picked and dried at Wildcombe.', use: 'Two teaspoons per cup, freshly boiled water, five to six minutes.',
    note: 'If you are pregnant or take regular medication, ask your pharmacist before adding new herbal teas.',
    sizes: [{ id: '40', label: '40 g', price: 6.2 }, { id: '80', label: '80 g', price: 10.8 }], weightNote: 'About 20 cups in 40 g',
  },
  {
    id: 'quiet-hours', name: 'Quiet Hours Blend', latin: 'Valeriana officinalis and friends', cat: 'teas', plate: 'valerian', field: '#c4bdeb', pack: 'tin',
    time: ['evening'], taste: ['floral', 'honeyed'],
    line: 'Chamomile, lemon balm, lime blossom and a little valerian root.',
    about: ['Our evening cup. The base is the three gentlest teas we grow, with a small amount of valerian root for depth. The flavour is floral and a little earthy, softened by honey notes from the lime blossom.', 'We blend it in small batches every few weeks, so it is always fresh.'],
    ingredients: 'Chamomile flowers, lemon balm leaf, lime blossom, valerian root. All grown at Wildcombe except the valerian, which comes from a grower in Herefordshire.', use: 'One heaped teaspoon per cup, just-boiled water, six minutes, covered.',
    note: 'Not for children, and not recommended if you are pregnant or breastfeeding or take sedative medication. Valerian has a strong earthy smell.',
    sizes: [{ id: '50', label: '50 g', price: 6.8 }, { id: '100', label: '100 g', price: 11.8 }], weightNote: 'About 25 cups in 50 g', mix: ['chamomile', 'lemon-balm', 'lime-blossom'],
  },
  {
    id: 'calendula-salve', name: 'Calendula Salve', latin: 'Calendula officinalis', cat: 'salves', plate: 'calendula', field: '#f5a623', pack: 'jar',
    time: ['morning', 'evening'], taste: [],
    line: 'Marigold petals steeped in sunflower oil, set with beeswax.',
    about: ['We steep a season of calendula petals in sunflower oil on the warm shelf above the kitchen range, strain it, and set it with beeswax from the hives on the next farm. That is the whole recipe.', 'It is a plain, softly golden salve for dry hands, rough elbows and chapped lips. It melts as it touches skin and leaves no film.'],
    ingredients: 'Helianthus annuus (sunflower) seed oil infused with Calendula officinalis flowers, Cera alba (beeswax), tocopherol (vitamin E).', use: 'Warm a little between your fingers and rub in. Use as often as you like.',
    note: 'For external use only. Patch test if you have sensitive skin. Not suitable for vegans (contains beeswax).',
    sizes: [{ id: '30', label: '30 ml', price: 8.5 }, { id: '60', label: '60 ml', price: 14 }], weightNote: 'Glass jar with a tin lid',
  },
  {
    id: 'comfrey-balm', name: 'Comfrey Balm', latin: 'Symphytum officinale', cat: 'salves', plate: 'comfrey', field: '#8db4ec', pack: 'jar',
    time: ['evening'], taste: [],
    line: 'A firm balm for hardworking hands, from comfrey leaf and root.',
    about: ['Comfrey grows in the wet corner of the field and is one of the plants gardeners and herbalists have valued longest. We infuse leaf and root separately in olive oil, then blend and set with beeswax for a firmer balm than our calendula salve.', 'It is the one our own family keep by the back door.'],
    ingredients: 'Olea europaea (olive) fruit oil infused with Symphytum officinale leaf and root, Cera alba (beeswax), Rosmarinus officinalis extract.', use: 'Massage a small amount into clean, unbroken skin. Do not use on broken skin or open wounds.',
    note: 'For external use only. Not for use on broken skin, during pregnancy or breastfeeding, or on children.',
    sizes: [{ id: '30', label: '30 ml', price: 9 }, { id: '60', label: '60 ml', price: 15 }], weightNote: 'Glass jar with a tin lid',
  },
  {
    id: 'elderberry-syrup', name: 'Elderberry Syrup', latin: 'Sambucus nigra', cat: 'syrups', plate: 'elder', field: '#c98bc2', pack: 'bottle',
    time: ['morning'], taste: ['honeyed', 'citrus'],
    line: 'Hedgerow elderberries simmered with ginger, cloves and local honey.',
    about: ['Every September the whole family spends a weekend picking elderberries from the hedges around the combe. They are simmered slowly with fresh ginger, cloves and a little cinnamon, then sweetened with honey from the next valley.', 'Stir a spoonful into hot water, pour over yoghurt or pancakes, or drink it in a glass of sparkling water. It is rich, dark and not too sweet.'],
    ingredients: 'Elderberries (Sambucus nigra), local honey, water, ginger, cloves, cinnamon, lemon juice.', use: 'One to two tablespoons, diluted or as you like. Keep in the fridge once opened and use within eight weeks.',
    note: 'Contains honey. Not suitable for children under 12 months.',
    sizes: [{ id: '250', label: '250 ml', price: 11.5 }], weightNote: 'Glass bottle, cork stopper',
  },
  {
    id: 'echinacea-tincture', name: 'Echinacea Tincture', latin: 'Echinacea purpurea', cat: 'syrups', plate: 'echinacea', field: '#f48fb1', pack: 'bottle',
    time: ['morning'], taste: [],
    line: 'A traditional herbal tincture made from our own coneflowers.',
    about: ['The coneflowers by our polytunnel are the last thing to bloom each year. We harvest the roots and flower heads in October and steep them in organic grain alcohol for six weeks before pressing.', 'A traditional herbal tincture, made in a small batch and bottled by hand.'],
    ingredients: 'Echinacea purpurea root and flower, organic grain alcohol (45%), water.', use: 'As directed on the label. Dilute in a little water.',
    note: 'A traditional herbal product. Contains alcohol. Not for children, in pregnancy or breastfeeding, or if you are allergic to plants in the daisy family. If symptoms persist, speak to a healthcare professional.',
    sizes: [{ id: '50', label: '50 ml', price: 12.5 }], weightNote: 'Amber glass dropper bottle',
  },
  {
    id: 'thyme-honey', name: 'Thyme Honey', latin: 'Thymus vulgaris', cat: 'syrups', plate: 'thyme', field: '#f6b49a', pack: 'jar',
    time: ['morning', 'afternoon'], taste: ['honeyed', 'green'],
    line: 'Raw local honey, left to steep with fresh thyme.',
    about: ['Thyme grows in the dry stone wall behind the barn, and the bees go straight to it in June. We steep the sprigs in raw honey from the next valley for three weeks and strain it clear.', 'A savoury, floral honey that is good on toast, in hot lemon, and spooned over goat cheese.'],
    ingredients: 'Raw honey, fresh thyme (Thymus vulgaris).', use: 'Straight from the jar, or stirred into tea.',
    note: 'Contains honey. Not suitable for children under 12 months.',
    sizes: [{ id: '227', label: '227 g', price: 8.9 }], weightNote: 'Glass jar',
  },
  {
    id: 'lavender-bath-salts', name: 'Lavender Bath Salts', latin: 'Lavandula angustifolia', cat: 'bath', plate: 'lavender', field: '#a994ee', pack: 'jar',
    time: ['evening'], taste: ['floral'],
    line: 'Epsom and sea salt with our own dried lavender buds.',
    about: ['Our lavender is the narrow-leaved English kind, cut when about half of each spike is open and hung in bunches in the barn. The buds go into a mix of Epsom and fine sea salt with a little almond oil.', 'Two handfuls under a running tap is all it takes.'],
    ingredients: 'Magnesium sulfate (Epsom salt), sodium chloride (sea salt), lavender buds (Lavandula angustifolia), almond oil, lavender essential oil.', use: 'Add two to three tablespoons to a warm bath and stir to dissolve.',
    note: 'Contains almond oil. Bath may be slippery. Keep away from eyes.',
    sizes: [{ id: '300', label: '300 g', price: 10.5 }, { id: '600', label: '600 g', price: 17.5 }], weightNote: 'Glass jar with a cork lid',
  },
  {
    id: 'tea-discovery-set', name: 'Tea Discovery Set', latin: 'Six herbs, six cups', cat: 'gifts', plate: 'lemon-balm', field: '#d7e46b', pack: 'box',
    time: ['morning', 'afternoon', 'evening'], taste: ['floral', 'minty', 'green', 'citrus'],
    line: 'Six 15 g pouches: chamomile, nettle, lemon balm, peppermint, lime blossom and Quiet Hours.',
    about: ['A way to try the range, or a present for someone who is thinking about drinking less coffee. Each 15 g pouch makes about eight cups, so there are nearly fifty cups in the box.', 'Packed in a card sleeve printed with the plates, and tucked with a card on how to brew. We will write a gift note if you ask at checkout.'],
    ingredients: 'Chamomile, stinging nettle, lemon balm, peppermint, lime blossom, Quiet Hours blend (see each tea for ingredients).', use: 'See the card in the box.',
    note: 'Contains the Quiet Hours blend: see that product for cautions.',
    sizes: [{ id: 'set', label: 'Set of six', price: 19.5 }], weightNote: 'Card sleeve, 6 × 15 g', mix: ['chamomile', 'nettle', 'lemon-balm', 'peppermint', 'lime-blossom', 'quiet-hours'],
  },
  {
    id: 'herb-garden-kit', name: 'Herb Garden Seed Kit', latin: 'Four herbs to grow', cat: 'gifts', plate: 'peppermint', field: '#7fd1b9', pack: 'box',
    time: ['afternoon'], taste: ['minty', 'citrus', 'floral'],
    line: 'Seeds for lemon balm, chamomile, thyme and mint, with pots and a sowing guide.',
    about: ['Everything for a windowsill tea garden: four packets of seed saved or sourced from our own plants, four biodegradable pots, compost discs and a sowing guide with a calendar.', 'Sow in spring, pick in summer, dry for winter.'],
    ingredients: 'Seed: lemon balm, German chamomile, thyme, spearmint. Four coir pots, four compost discs, sowing guide.', use: 'Follow the guide in the box. Sow from March to June.',
    note: 'Small parts: not suitable for children under 3.',
    sizes: [{ id: 'kit', label: 'One kit', price: 14 }], weightNote: 'Card box',
  },
];

export const byId = (id: string) => PRODUCTS.find((p) => p.id === id)!;
export const fromPrice = (p: Product) => Math.min(...p.sizes.map((s) => s.price));
export const money = (n: number) => '£' + n.toFixed(2).replace(/\.00$/, '');
export const catOf = (c: Cat) => PRODUCTS.filter((p) => p.cat === c);
