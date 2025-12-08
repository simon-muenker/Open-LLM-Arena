import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://simon-muenker.github.io',
  base: '/Open-LLM-Arena',

  vite: {
    plugins: [tailwindcss()],
  },
})