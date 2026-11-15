import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { satteriKatex } from './src/lib/satteri-katex.mjs';

// Served at the root of nagho.github.io, so no base path. Set SITE when
// moving to a custom domain, or when deploying somewhere else (Cloudflare
// Pages sets CF_PAGES_URL itself).
const site = process.env.SITE ?? process.env.CF_PAGES_URL ?? 'https://nagho.github.io';
const base = process.env.BASE ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    // Sätteri is Astro's default Markdown processor; it parses $..$ and
    // $$..$$ natively, and satteriKatex renders them to HTML at build time.
    processor: satteri({
      features: { math: true },
      hastPlugins: [satteriKatex()],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },
});
