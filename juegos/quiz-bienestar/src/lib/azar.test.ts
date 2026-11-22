// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { generadorFijo, mezclar } from './azar'

describe('mezclar', () => {
  it('devuelve una lista nueva y no toca la original', () => {
    const original = [1, 2, 3, 4, 5]
    const mezclada = mezclar(original, generadorFijo(7))
    expect(original).toEqual([1, 2, 3, 4, 5])
    expect(mezclada).not.toBe(original)
  })

  it('conserva todos los elementos', () => {
    const mezclada = mezclar([1, 2, 3, 4, 5], generadorFijo(3))
    expect([...mezclada].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('con el mismo generador produce el mismo orden', () => {
    expect(mezclar([1, 2, 3, 4, 5], generadorFijo(42))).toEqual(
      mezclar([1, 2, 3, 4, 5], generadorFijo(42))
    )
  })

  it('no se queda siempre en el mismo orden', () => {
    const vistos = new Set<string>()
    for (let semilla = 1; semilla <= 200; semilla += 1) {
      vistos.add(mezclar([0, 1, 2, 3, 4], generadorFijo(semilla)).join(''))
    }
    expect(vistos.size).toBeGreaterThan(10)
  })
})

describe('generadorFijo', () => {
  it('se queda siempre en el intervalo [0, 1)', () => {
    const rng = generadorFijo(9)
    for (let i = 0; i < 500; i += 1) {
      const valor = rng()
      expect(valor).toBeGreaterThanOrEqual(0)
      expect(valor).toBeLessThan(1)
    }
  })
})
