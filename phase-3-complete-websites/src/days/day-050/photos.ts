/** One real photograph per recipe (Pexels, free to use). Keys are the recipe slugs from the content collection. */
import pancakes from '../../assets/day-050-cards/banana-oat-pancakes.jpg';
import dal from '../../assets/day-050-cards/coconut-red-lentil-dal.jpg';
import salmon from '../../assets/day-050-cards/crispy-salmon-rice-bowl.jpg';
import spaghetti from '../../assets/day-050-cards/lemon-garlic-spaghetti.jpg';
import ramen from '../../assets/day-050-cards/mushroom-miso-ramen.jpg';
import tacos from '../../assets/day-050-cards/roasted-cauliflower-tacos.jpg';
import chicken from '../../assets/day-050-cards/sheet-pan-harissa-chicken.jpg';
import stew from '../../assets/day-050-cards/smoky-chickpea-stew.jpg';
import crumble from '../../assets/day-050-cards/spiced-apple-crumble.jpg';
import toast from '../../assets/day-050-cards/tomato-burrata-toast.jpg';

export const RECIPE_PHOTOS: Record<string, ImageMetadata> = {
  'banana-oat-pancakes': pancakes, 'coconut-red-lentil-dal': dal, 'crispy-salmon-rice-bowl': salmon, 'lemon-garlic-spaghetti': spaghetti,
  'mushroom-miso-ramen': ramen, 'roasted-cauliflower-tacos': tacos, 'sheet-pan-harissa-chicken': chicken, 'smoky-chickpea-stew': stew,
  'spiced-apple-crumble': crumble, 'tomato-burrata-toast': toast,
};
