import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/svelte'

/**
 * Este archivo corre como `setupFiles` para todas las suites, incluidas las de
 * lógica pura que declaran el entorno `node`. Ahí no hay DOM, así que todo lo
 * que toque `document` o `HTMLMediaElement` se salta.
 */
const hayDom = typeof document !== 'undefined' && typeof HTMLMediaElement !== 'undefined'

/**
 * jsdom no implementa `HTMLMediaElement.play()`: devuelve `undefined` y avisa por
 * consola. Sin un simulador, la rama de fallo de la pantalla final sería inalcanzable.
 */
export function simularPlayQueFunciona(): void {
  if (!hayDom) return
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: () => Promise.resolve()
  })
}

export function simularPlayQueRechaza(): void {
  if (!hayDom) return
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: () => Promise.reject(new DOMException('bloqueado', 'NotAllowedError'))
  })
}

simularPlayQueFunciona()

// Sin `globals: true`, testing-library no registra su propia limpieza.
afterEach(() => {
  if (hayDom) cleanup()
})
