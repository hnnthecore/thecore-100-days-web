// Content collections for the Phase 3 sites. Each day keeps its own folder under src/content/.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-041/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    genre: z.enum(['Fiction', 'Crime', 'Sci-fi & fantasy', 'Non-fiction', 'Children’s', 'Poetry & essays']),
    price: z.number(),
    pages: z.number(),
    year: z.number(),
    isbn: z.string(),
    publisher: z.string(),
    stock: z.number(),
    featured: z.boolean().default(false),
    palette: z.number().min(0).max(5),
    pattern: z.number().min(0).max(5),
    staffPick: z.string().optional(),
    staff: z.string().optional(),
    opening: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-041/events' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    time: z.string(),
    kind: z.enum(['Author talk', 'Book club', 'Kids', 'Workshop', 'Launch']),
    price: z.number(),
    seats: z.number(),
    taken: z.number(),
    blurb: z.string(),
    host: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-042/projects' }),
  schema: z.object({
    lat: z.number().optional(),
    lon: z.number().optional(),
    title: z.string(), location: z.string(),
    type: z.enum(['Residential', 'Cultural', 'Education', 'Workplace']),
    year: z.number(), area: z.number(), status: z.string(), client: z.string(),
    kind: z.enum(['cabin', 'courtyard', 'library', 'school', 'tower', 'pavilion']),
    variant: z.number(), featured: z.boolean().default(false),
    materials: z.array(z.string()), summary: z.string(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-042/journal' }),
  schema: z.object({ title: z.string(), date: z.string(), author: z.string(), category: z.string(), excerpt: z.string() }),
});

const programmes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-043/programmes' }),
  schema: z.object({
    title: z.string(), tagline: z.string(), scene: z.enum(['beds', 'kitchen', 'kids', 'greenhouse']), when: z.string(), who: z.string(),
    stat: z.object({ value: z.number(), label: z.string() }),
    months: z.tuple([z.number(), z.number()]),
    schedule: z.array(z.object({ time: z.string(), what: z.string(), detail: z.string() })),
  }),
});
const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-043/stories' }),
  schema: z.object({ title: z.string(), date: z.string(), author: z.string(), category: z.string(), excerpt: z.string() }),
});
const shifts = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-043/shifts' }),
  schema: z.object({ date: z.string(), time: z.string(), title: z.string(), kind: z.enum(['Growing', 'Cooking', 'Building', 'Events']), spots: z.number(), taken: z.number(), where: z.string() }),
});

const herbJournal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-046/journal' }),
  schema: z.object({ title: z.string(), date: z.string(), category: z.string(), excerpt: z.string(), read: z.string() }),
});

const features = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-044/features' }),
  schema: z.object({ title: z.string(), tagline: z.string(), icon: z.enum(['line', 'branch', 'mail', 'bell', 'chart', 'users']), order: z.number(), lede: z.string() }),
});
const customers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-044/customers' }),
  schema: z.object({
    name: z.string(), sector: z.string(), size: z.string(), tag: z.string(), person: z.string(), role: z.string(), colour: z.string(), quote: z.string(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
});
const releases = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-044/releases' }),
  schema: z.object({ date: z.string(), version: z.string(), kind: z.enum(['feature', 'improvement', 'fix']), title: z.string(), text: z.string() }),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-045/courses' }),
  schema: z.object({
    language: z.string(), greeting: z.string(), native: z.string(), colour: z.string(), ink: z.string(), speakers: z.string(), tagline: z.string(), teacher: z.string(),
    schedule: z.array(z.string()), intro: z.string(), highlights: z.array(z.string()),
  }),
});
const teachers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-045/teachers' }),
  schema: z.object({ name: z.string(), languages: z.array(z.string()), from: z.string(), years: z.number(), colour: z.string(), quote: z.string() }),
});

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-047/artists' }),
  schema: z.object({
    name: z.string(), day: z.enum(['Fri', 'Sat', 'Sun']), stage: z.enum(['Sunset', 'Forest', 'Dome']), genre: z.string(), start: z.string(), end: z.string(),
    headliner: z.boolean(), hue: z.number(), origin: z.string(), blurb: z.string(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-048/articles' }),
  schema: z.object({
    title: z.string(), dek: z.string(), section: z.enum(['Science', 'Culture', 'Cities', 'Food']), author: z.string(), date: z.string(), hue: z.number(), reads: z.number(), quote: z.string(),
  }),
});
const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-048/authors' }),
  schema: z.object({ name: z.string(), role: z.string() }),
});

const treatments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-049/treatments' }),
  schema: z.object({
    title: z.string(), category: z.enum(['Everyday', 'Cosmetic', 'Restorative', 'Family', 'Urgent']), price: z.number(), minutes: z.number(),
    icon: z.enum(['tooth', 'spark', 'sun', 'align', 'anchor', 'shield', 'smile', 'bolt']), summary: z.string(),
  }),
});
const dentists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-049/dentists' }),
  schema: z.object({ name: z.string(), role: z.string(), special: z.string(), years: z.number(), colour: z.string(), treatments: z.array(z.string()) }),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-050/recipes' }),
  schema: z.object({
    title: z.string(), tagline: z.string(), cuisine: z.string(), minutes: z.number(), serves: z.number(), difficulty: z.enum(['Easy', 'Medium', 'Hard']), kcal: z.number(),
    diets: z.array(z.string()), hue: z.number(), tip: z.string(),
    ingredients: z.array(z.object({ q: z.number(), u: z.string(), n: z.string() })),
    steps: z.array(z.object({ t: z.string(), m: z.number() })),
  }),
});

const companies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-051/companies' }),
  schema: z.object({ name: z.string(), tagline: z.string(), industry: z.string(), size: z.string(), colour: z.string(), city: z.string() }),
});
const jobs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-051/jobs' }),
  schema: z.object({
    title: z.string(), company: z.string(), location: z.string(), mode: z.enum(['Remote', 'Hybrid', 'On-site']), type: z.enum(['Full-time', 'Part-time', 'Contract']),
    level: z.enum(['Junior', 'Mid', 'Senior']), min: z.number(), max: z.number(), category: z.string(), posted: z.string(), tags: z.array(z.string()), summary: z.string(),
  }),
});

const yogaClasses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-052/classes' }),
  schema: z.object({
    title: z.string(), tagline: z.string(), level: z.enum(['Beginner', 'All levels', 'Intermediate']), minutes: z.number(), intensity: z.number(), hue: z.number(),
    teacher: z.string(), benefits: z.array(z.string()),
  }),
});
const yogaTeachers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-052/teachers' }),
  schema: z.object({ name: z.string(), role: z.string(), years: z.number(), colour: z.string(), styles: z.string() }),
});

const shows = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-053/shows' }),
  schema: z.object({ title: z.string(), tagline: z.string(), category: z.string(), host: z.string(), typical: z.number(), colour: z.string() }),
});
const episodes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-053/episodes' }),
  schema: z.object({
    title: z.string(), show: z.string(), number: z.number(), date: z.string(), minutes: z.number(), summary: z.string(), guest: z.string(),
    chapters: z.array(z.object({ t: z.number(), title: z.string() })),
  }),
});

const collegeCourses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-054/courses' }),
  schema: z.object({
    title: z.string(), award: z.string(), subject: z.string(), level: z.enum(['Foundation', 'Undergraduate', 'Postgraduate']), mode: z.enum(['Full-time', 'Part-time', 'Online']),
    years: z.number(), fee: z.number(), intl: z.number(), start: z.string(), entry: z.string(), hue: z.number(), salary: z.number(), summary: z.string(),
    careers: z.array(z.string()), modules: z.array(z.object({ year: z.number(), names: z.array(z.string()) })),
  }),
});
const openDays = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-054/opendays' }),
  schema: z.object({ date: z.string(), weekday: z.string(), time: z.string(), kind: z.string(), capacity: z.number(), booked: z.number() }),
});

const packages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-055/packages' }),
  schema: z.object({ title: z.string(), price: z.number(), guests: z.number(), tagline: z.string(), kind: z.enum(['day', 'weekend', 'full']), hue: z.number(), includes: z.array(z.string()) }),
});
const weddings = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-055/weddings' }),
  schema: z.object({ title: z.string(), date: z.string(), season: z.enum(['Spring', 'Summer', 'Autumn', 'Winter']), guests: z.number(), hue: z.number(), quote: z.string(), vendors: z.array(z.string()) }),
});

const objects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-056/objects' }),
  schema: z.object({
    title: z.string(), year: z.number(), era: z.enum(['Victorian', 'Edwardian', 'Interwar', 'Post-war', 'Modern']), material: z.string(),
    gallery: z.enum(['Home', 'Work', 'Communication', 'Light']), maker: z.string(), origin: z.string(), shape: z.string(), hue: z.number(), dims: z.string(), short: z.string(), facts: z.array(z.string()),
  }),
});
const timeline = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-056/timeline' }),
  schema: z.object({ year: z.number(), era: z.string(), title: z.string(), text: z.string(), object: z.string() }),
});
const exhibitions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-056/exhibitions' }),
  schema: z.object({ title: z.string(), start: z.string(), end: z.string(), text: z.string(), hue: z.number(), price: z.string() }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-057/guides' }),
  schema: z.object({ title: z.string(), category: z.enum(['Basics', 'Habits', 'Goals', 'Family']), minutes: z.number(), date: z.string(), dek: z.string(), tip: z.string() }),
});

const regions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-058/regions' }),
  schema: z.object({ name: z.string(), country: z.string(), wells: z.number(), people: z.number(), cost: z.number(), since: z.number(), gx: z.number(), gy: z.number(), note: z.string() }),
});
const reportStories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-058/stories' }),
  schema: z.object({ title: z.string(), place: z.string(), dek: z.string(), order: z.number() }),
});

const renoProjects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-059/projects' }),
  schema: z.object({
    title: z.string(), type: z.enum(['Extension', 'Loft', 'Kitchen', 'Bathroom', 'Garden room', 'Full refurb']), place: z.string(), year: z.number(), weeks: z.number(),
    cost: z.number(), sqm: z.number(), hue: z.number(), quote: z.string(), summary: z.string(),
  }),
});

const sites = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/day-060/sites' }),
  schema: z.object({
    day: z.number(), dir: z.string(), name: z.string(), kind: z.string(), group: z.string(), summary: z.string(), pages: z.number(),
    palette: z.array(z.string()), fonts: z.array(z.string()), patterns: z.array(z.string()), lesson: z.string(),
  }),
});

export const collections = { herbJournal, books, events, projects, journal, programmes, stories, shifts, features, customers, releases, courses, teachers, artists, articles, authors, treatments, dentists, recipes, companies, jobs, yogaClasses, yogaTeachers, shows, episodes, collegeCourses, openDays, packages, weddings, objects, timeline, exhibitions, guides, regions, reportStories, renoProjects, sites };
