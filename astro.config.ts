import { defineConfig } from 'astro/config';

import { SITE } from './src/config/site';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  integrations: [],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
});
