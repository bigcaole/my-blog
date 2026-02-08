import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import { SITE } from './src/config/site';

export default defineConfig({
  site: SITE.url,
  output: 'static',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
    smartypants: true,
  },
});
