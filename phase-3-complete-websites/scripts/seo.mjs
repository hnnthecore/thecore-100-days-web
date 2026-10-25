/**
 * Post-build for every site folder in ./site: writes sitemap.xml, robots.txt and a 404.html.
 *
 * - sitemap.xml lists every page. Its addresses use SITE_ORIGIN, so set that (or edit ORIGIN below) when a site moves to its own domain.
 * - robots.txt allows everything and points to the sitemap.
 * - 404.html is a copy of the 404/ page with its relative links moved up one level, because most hosts look for /404.html.
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../site/', import.meta.url));
const ORIGIN = process.env.SITE_ORIGIN || 'https://hnnthecore.github.io/thecore-100-days-web/phase-3-complete-websites/site';
const posix = (p) => p.split(sep).join('/');

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else yield p;
  }
}

let sites = 0;
for (const entry of await readdir(OUT, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.startsWith('day-')) continue;
  const dir = join(OUT, entry.name);
  const pages = [];
  for await (const f of walk(dir)) {
    if (!f.endsWith('index.html')) continue;
    const rel = posix(relative(dir, f)).replace(/index\.html$/, '');
    if (rel.startsWith('404')) continue;
    pages.push(rel);
  }
  pages.sort();
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.map((p) => `  <url><loc>${ORIGIN}/${entry.name}/${p}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  await writeFile(join(dir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeFile(join(dir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/${entry.name}/sitemap.xml\n`);
  try {
    await stat(join(dir, '404/index.html'));
    const html = await readFile(join(dir, '404/index.html'), 'utf8');
    await writeFile(join(dir, '404.html'), html.replace(/(["'(])\.\.\//g, '$1'));
  } catch { /* this site has no 404 page yet */ }
  sites++;
}
console.log('seo: sitemap, robots and 404 written for', sites, 'site(s)');
