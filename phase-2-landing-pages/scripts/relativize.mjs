/**
 * Post-build for GitHub Pages and double-click opening.
 *
 * 1. Root-absolute URLs ("/_astro/x.css") become relative ("../_astro/x.css"),
 *    so the site works from file://, from any GitHub Pages sub-path, and from
 *    a plain static server.
 * 2. Directory links ("../day-022/") get an explicit "index.html".
 * 3. Browsers refuse <script type="module"> on file:// pages. If a bundle has no
 *    import/export, it is wrapped in an IIFE (variables stay private) and loaded
 *    as a classic `defer` script, which behaves the same way.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../site/', import.meta.url));
const toPosix = (p) => p.split(sep).join('/');

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

/** True when the code can run as a classic script (no static import/export). */
function isClassicSafe(js) {
  try { new Function(js); return true; } catch { return false; }
}

let rewritten = 0;
const wrapped = new Set();

for await (const file of walk(OUT)) {
  if (!/\.(html|css)$/.test(file)) continue;
  const prefix = toPosix(relative(dirname(file), OUT)) || '.';
  let text = await readFile(file, 'utf8');
  const before = text;

  text = text.replace(/(\b(?:href|src|srcset|action)=")\/(?!\/)/g, `$1${prefix}/`);
  text = text.replace(/url\((["']?)\/(?!\/)/g, `url($1${prefix}/`);

  if (file.endsWith('.html')) {
    text = text.replace(/(href=")([^"#?:]*\/)(["#?])/g, '$1$2index.html$3');

    const tags = [...text.matchAll(/<script type="module" src="([^"]+)"><\/script>/g)];
    for (const [tag, src] of tags) {
      const jsPath = join(dirname(file), src);
      let js = await readFile(jsPath, 'utf8');
      if (!wrapped.has(jsPath)) {
        if (js.startsWith('/*iife*/')) wrapped.add(jsPath);
        else if (isClassicSafe(js)) {
          await writeFile(jsPath, `/*iife*/(()=>{${js}\n})();`);
          wrapped.add(jsPath);
        }
      }
      if (wrapped.has(jsPath)) text = text.replace(tag, `<script defer src="${src}"></script>`);
    }
  }

  if (text !== before) { await writeFile(file, text); rewritten++; }
}

console.log(`relativize: ${rewritten} file(s) rewritten, ${wrapped.size} script(s) made file://-friendly`);
