import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig(({ mode }) => ({
  plugins: [svelte()],
  publicDir: 'static',
  // Absoluta: el juego se sirve siempre en /quiz-bienestar/ del contenedor.
  // Con base relativa, la URL sin barra final resuelve los recursos en la raíz
  // del dominio y el juego se queda sin JS ni vídeo.
  base: '/quiz-bienestar/',
  // Solo en pruebas: sin esta condición, Vitest resuelve Svelte a su build de
  // servidor y `mount` no existe. En producción no se toca la resolución.
  resolve: mode === 'test' ? { conditions: ['browser'] } : {},
  test: {
    environment: 'jsdom',
    setupFiles: ['src/pruebas/preparacion.ts'],
    include: ['src/**/*.test.ts']
  }
}))
