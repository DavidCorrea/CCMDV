// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ccmdv.com',
  base: '/',
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