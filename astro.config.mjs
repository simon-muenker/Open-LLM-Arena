import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite'

import svelte from '@astrojs/svelte';

export default defineConfig({
  site: 'https://simon-muenker.github.io',
  base: '/Open-LLM-Arena',

  vite: {
    plugins: [
      tailwindcss(), 
      Icons({compiler: 'svelte'}),
      Icons({compiler: 'astro'}),
    ],
  },

  integrations: [svelte()],
})