import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  // Absoluta: el juego se sirve en /__SLUG__/ del contenedor y la URL sin barra
  // final resolvería los recursos contra la raíz del dominio.
  base: '/__SLUG__/'
})
