// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://davidcorrea.github.io',
  base: '/CCMDV',
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    routing: {
      prefixDefaultLocale: false, // Don't prefix default locale (Spanish)
    },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});