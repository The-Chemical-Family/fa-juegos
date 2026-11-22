// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { generadorFijo, mezclar } from './azar'
import { bolsaDesdeHistorial, crearSeleccion, sacarPregunta } from './seleccion'
import type { Pregunta, Tema } from './tipos'

function pregunta(id: string, comodin = false, tema: Tema = 'casa'): Pregunta {
  return {
    id,
    temas: [tema],
    comodin,
    enunciado: `enunciado ${id}`,
    opciones: [
      { texto: 'a', efecto: 2 },
      { texto: 'b', efecto: 1 },
      { texto: 'c', efecto: 0 },
      { texto: 'd', efecto: -1 },
      { texto: 'e', efecto: -2 }
    ],
    reflexion: { propuesta: `propuesta ${id}`, pregunta: `pregunta ${id}` }
  }
}

const BANCO = [
  pregunta('a'),
  pregunta('b'),
  pregunta('c'),
  pregunta('d'),
  pregunta('comodin', true, 'moneda')
]
const POR_ID = new Map(BANCO.map((p) => [p.id, p]))

describe('mezclar', () => {
  it('conserva todos los elementos', () => {
    const salida = mezclar([1, 2, 3, 4, 5], generadorFijo(3))
    expect(salida.slice().sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('es reproducible con el mismo generador', () => {
    expect(mezclar([1, 2, 3, 4, 5], generadorFijo(9))).toEqual(mezclar([1, 2, 3, 4, 5], generadorFijo(9)))
  })

  it('una lista vacía o de un elemento no falla', () => {
    expect(mezclar([], generadorFijo(1))).toEqual([])
    expect(mezclar(['x'], generadorFijo(1))).toEqual(['x'])
  })
})

describe('selección', () => {
  it('no repite mientras la bolsa tiene contenido', () => {
    let seleccion = crearSeleccion(BANCO, generadorFijo(1))
    const vistas: string[] = []
    for (let i = 0; i < BANCO.length; i += 1) {
      const sacada = sacarPregunta(seleccion, POR_ID, 0, generadorFijo(i + 1))
      seleccion = sacada.seleccion
      vistas.push(sacada.pregunta.id)
    }
    expect(new Set(vistas).size).toBe(BANCO.length)
  })

  it('al vaciarse vuelve a llenar la bolsa y permite repetir', () => {
    let seleccion = crearSeleccion(BANCO, generadorFijo(2))
    for (let i = 0; i < BANCO.length; i += 1) {
      seleccion = sacarPregunta(seleccion, POR_ID, 0, generadorFijo(i + 1)).seleccion
    }
    expect(seleccion.bolsa).toHaveLength(0)

    const sacada = sacarPregunta(seleccion, POR_ID, 0, generadorFijo(4))
    expect(sacada.pregunta.id).toBeTruthy()
    expect(sacada.seleccion.bolsa.length).toBe(BANCO.length - 1)
    expect(sacada.seleccion.historial.length).toBe(BANCO.length + 1)
  })

  it('un comodín no sale dos veces en la misma batalla si queda alguna no comodín', () => {
    const banco = [pregunta('comodin', true, 'moneda'), pregunta('normal')]
    const porId = new Map(banco.map((p) => [p.id, p]))
    const seleccion = { bolsa: ['comodin', 'normal'], historial: [] as string[] }

    const sacada = sacarPregunta(seleccion, porId, 1, generadorFijo(1))
    expect(sacada.pregunta.id).toBe('normal')
    expect(sacada.esComodin).toBe(false)
  })

  it('permite el segundo comodín si solo quedan comodines', () => {
    const banco = [pregunta('comodin1', true, 'moneda'), pregunta('comodin2', true, 'moneda')]
    const porId = new Map(banco.map((p) => [p.id, p]))
    const seleccion = { bolsa: ['comodin1', 'comodin2'], historial: [] as string[] }

    const sacada = sacarPregunta(seleccion, porId, 1, generadorFijo(1))
    expect(sacada.esComodin).toBe(true)
  })

  it('el historial se conserva entre batallas y se reinicia al empezar partida', () => {
    let seleccion = crearSeleccion(BANCO, generadorFijo(5))
    seleccion = sacarPregunta(seleccion, POR_ID, 0, generadorFijo(1)).seleccion
    seleccion = sacarPregunta(seleccion, POR_ID, 0, generadorFijo(2)).seleccion
    expect(seleccion.historial).toHaveLength(2)

    const reiniciada = crearSeleccion(BANCO, generadorFijo(5))
    expect(reiniciada.historial).toHaveLength(0)
    expect(reiniciada.bolsa).toHaveLength(BANCO.length)
  })

  it('la bolsa deducida del historial excluye las ya usadas', () => {
    const bolsa = bolsaDesdeHistorial(BANCO, ['a', 'b'], generadorFijo(1))
    expect(bolsa.slice().sort()).toEqual(['c', 'comodin', 'd'])
  })

  it('un identificador desconocido en el historial no rompe la bolsa', () => {
    const bolsa = bolsaDesdeHistorial(BANCO, ['a', 'fantasma'], generadorFijo(1))
    expect(bolsa).not.toContain('fantasma')
    expect(bolsa).not.toContain('a')
    expect(bolsa.slice().sort()).toEqual(['b', 'c', 'comodin', 'd'])
  })
})
