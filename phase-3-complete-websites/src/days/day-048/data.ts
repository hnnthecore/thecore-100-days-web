/** Day 048 · The Meridian · build-time helpers: every page loads the same sorted articles and an author lookup. */
import { getCollection } from 'astro:content';

export const B = '/day-048-magazine';
export const SECTIONS = ['Science', 'Culture', 'Cities', 'Food'] as const;

export async function loadAll() {
  const articles = (await getCollection('articles')).sort((a, b) => b.data.date.localeCompare(a.data.date));
  const authorList = await getCollection('authors');
  const authors = Object.fromEntries(authorList.map((a) => [a.id, a.data.name]));
  /** Plain-JSON index handed to the browser for search and the Saved page. */
  const index = articles.map((a) => ({ id: a.id, title: a.data.title, dek: a.data.dek, section: a.data.section, author: authors[a.data.author], date: a.data.date, reads: a.data.reads, url: `${B}/articles/${a.id}/` }));
  return { articles, authorList, authors, index };
}

export const fmtDate = (d: string) => new Date(d + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
export const readMins = (body: string | undefined) => Math.max(2, Math.round((body ?? '').split(/\s+/).length / 200));
