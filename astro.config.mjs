// @ts-check
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { redirects } from './src/data/redirects.ts';

const SITE = 'https://thehawaiiagency.com';

/** Static hosts get meta-refresh pages from `redirects`; hosts that read `_redirects` get real 301s. */
const netlifyStyleRedirects = () => ({
  name: 'tha:redirects-file',
  hooks: {
    /** @param {{ dir: URL }} options */
    'astro:build:done': ({ dir }) => {
      const lines = Object.entries(redirects).map(([from, to]) => `${from} ${to} 301`);
      // also match the old URLs without a trailing slash
      const bare = Object.entries(redirects).map(([from, to]) => `${from.replace(/\/$/, '')} ${to} 301`);
      fs.writeFileSync(new URL('./_redirects', dir), [...lines, ...bare].join('\n') + '\n');
    },
  },
});

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  // decode so the one ʻokina slug becomes a real folder name
  redirects: Object.fromEntries(Object.entries(redirects).map(([f, t]) => [decodeURIComponent(f), t])),
  integrations: [
    sitemap({
      filter: (page) => !Object.keys(redirects).some((from) => page === SITE + decodeURIComponent(from)) && !page.endsWith('/404/'),
    }),
    netlifyStyleRedirects(),
  ],
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Google Sans',
      cssVariable: '--font-google-sans',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  image: {
    responsiveStyles: false,
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  vite: {
    resolve: {
      alias: { '~': fileURLToPath(new URL('./src', import.meta.url)) },
    },
  },
});
