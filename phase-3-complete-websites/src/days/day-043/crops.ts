/** What's growing at Rootwork: one real photograph per crop (Pexels, free to use) and the months it is in season. */
import c0 from '../../assets/day-043-crops/salad-onions.jpg';
import c1 from '../../assets/day-043-crops/strawberries.jpg';
import c2 from '../../assets/day-043-crops/tomatoes.jpg';
import c3 from '../../assets/day-043-crops/courgettes.jpg';
import c4 from '../../assets/day-043-crops/beans.jpg';
import c5 from '../../assets/day-043-crops/potatoes.jpg';
import c6 from '../../assets/day-043-crops/carrots.jpg';
import c7 from '../../assets/day-043-crops/apples.jpg';
import c8 from '../../assets/day-043-crops/pumpkins.jpg';
import c9 from '../../assets/day-043-crops/kale.jpg';

export const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export interface Crop { id: string; name: string; from: number; to: number; note: string; alt: string; photo: ImageMetadata }
export const CROPS: Crop[] = [
  { id: "salad-onions", name: "Salad onions", from: 4, to: 6, note: "Sow in March under cloth, pull from April. Sweet, crunchy and ready in weeks.", alt: "A bunch of freshly pulled salad onions with their roots on", photo: c0 },
  { id: "strawberries", name: "Strawberries", from: 6, to: 7, note: "Picked warm by volunteers every Saturday in June. The first punnets always go to Little Sprouts.", alt: "A woven basket of ripe strawberries being picked by hand", photo: c1 },
  { id: "tomatoes", name: "Tomatoes", from: 7, to: 9, note: "Grown in the greenhouse from February seed. Sun-ripened, never refrigerated.", alt: "Ripe red tomatoes on the vine in a greenhouse", photo: c2 },
  { id: "courgettes", name: "Courgettes", from: 7, to: 9, note: "One plant feeds a street. Picked small and often so the plants keep going.", alt: "Hands holding three freshly picked courgettes", photo: c3 },
  { id: "beans", name: "Runner beans", from: 7, to: 9, note: "Climbing the wigwams by the gate. Pick every two days or they turn stringy.", alt: "Green runner beans hanging from the plant", photo: c4 },
  { id: "potatoes", name: "New potatoes", from: 7, to: 9, note: "Lifted with a fork on Tuesdays. Boil them within the hour for the best flavour.", alt: "Crates of freshly dug new potatoes", photo: c5 },
  { id: "carrots", name: "Carrots", from: 8, to: 11, note: "Sweetened by the first cold nights. Wonky ones go straight into the soup pot.", alt: "Four freshly pulled carrots with their tops laid on grey boards", photo: c6 },
  { id: "apples", name: "Apples", from: 9, to: 10, note: "From the old orchard behind the greenhouse. Windfalls are pressed into juice.", alt: "A woven basket of apples held in front of a person in a floral dress", photo: c7 },
  { id: "pumpkins", name: "Pumpkins", from: 9, to: 11, note: "Grown on the compost heap and cured in the sun. Soup, then lanterns.", alt: "A pile of red-orange pumpkins", photo: c8 },
  { id: "kale", name: "Kale", from: 10, to: 3, note: "Gets sweeter after frost and keeps cropping all winter. The hardest worker on the farm.", alt: "Rows of curly dark green kale", photo: c9 },
];
/** True when month m (1 to 12) falls inside the crop's season, including seasons that wrap past December. */
export const inSeason = (c: { from: number; to: number }, m: number) => (c.from <= c.to ? m >= c.from && m <= c.to : m >= c.from || m <= c.to);
