// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ccmdv.com',
  base: '/',
  output: 'static', // Ensure all pages are pre-rendered for social media crawlers
  adapter: netlify({
    edgeMiddleware: true,
  }),
  integrations: [react()],
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