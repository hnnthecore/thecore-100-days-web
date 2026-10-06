// Thecore · Phase 2 landing pages (Days 21–40)
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
