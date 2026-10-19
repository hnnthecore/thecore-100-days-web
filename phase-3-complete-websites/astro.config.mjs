// Thecore · Phase 3 complete websites (Days 41–60)
// Each day is a real multi-page site under src/pages/day-0xx-name/.
// Static output goes to ./site and is committed, so GitHub Pages serves it as-is.
// scripts/relativize.mjs then rewrites absolute links to relative ones, so every
// page also works when opened straight from disk or from any sub-folder.
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  outDir: './site',
  build: { format: 'directory', assets: '_astro', inlineStylesheets: 'never' },
  vite: { plugins: [tailwindcss()] },
  devToolbar: { enabled: false },
});
