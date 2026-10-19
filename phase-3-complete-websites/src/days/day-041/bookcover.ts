/** Day 041 · Pagebound Books · cover markup for the script-built basket. The same classes style the Astro BookCover component. */
import { BOOK_THUMBS } from './photos';
export const ACCENTS = ['#f2d8a7', '#f1e3c4', '#f4e4c1', '#fff0d2', '#f3e6c6', '#f6e0c3'];
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
export function bookCoverHtml(slug: string, title: string, author: string, palette: number, pattern: number): string {
  const src = BOOK_THUMBS[slug];
  return `<span class="pb-bc" data-lay="${pattern % 3}" style="--bc-a:${ACCENTS[palette % 6]}">${src ? `<img src="${src}" alt="" width="220" height="330" />` : ''}<span class="pb-bc__t">${esc(title)}</span><span class="pb-bc__a">${esc(author)}</span></span>`;
}
