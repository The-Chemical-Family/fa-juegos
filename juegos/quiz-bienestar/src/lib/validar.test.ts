// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { validarPreguntas, validarTextos } from './validar'
import { campos, conEfectos, preguntaValida } from './pruebas-ayuda'

const textrosValidos = {
  regla: 'Regla del juego',
  mision: 'Misión',
  villanos: [
    { id: 0, nombre: 'Uno', emoji: '🦈', textoIntro: 'uno' },
    { id: 1, nombre: 'Dos', emoji: '🕸️', textoIntro: 'dos' },
    { id: 2, nombre: 'Tres', emoji: '🐌', textoIntro: 'tres' }
  ],
  frases: {
    victoria: '¡Has ganado!',
    perfect: 'PERFECT!',
    derrota: 'Esta vez has perdido.',
    empateConRespuestas: '¡Empate!',
    empateSinRespuestas: 'Aquí no ha pasado nada.'
  },
  credito: 'Crédito',
  fuente: 'https://ejemplo.test',
  fuentePreguntas: 'https://ejemplo.test/preguntas'
}

describe('validarPreguntas: contenido válido', () => {
  it('acepta una pregunta bien formada', () => {
    const { preguntas, errores } = validarPreguntas([preguntaValida()])
    expect(errores).toEqual([])
    expect(preguntas).toHaveLength(1)
    expect(preguntas[0].id).toBe('vivienda-01')
  })

  it('acepta moneda con comodin en false', () => {
    const { errores } = validarPreguntas([preguntaValida({ temas: ['moneda'], comodin: false })])
    expect(errores).toEqual([])
  })

  it('acepta un comodín que incluye moneda', () => {
    const { errores } = validarPreguntas([preguntaValida({ temas: ['moneda'], comodin: true })])
    expect(errores).toEqual([])
  })

  it('acepta dos temas', () => {
    const { errores } = validarPreguntas([preguntaValida({ temas: ['casa', 'moneda'] })])
    expect(errores).toEqual([])
  })

  it('una situacion vacía se trata como ausente, no como error', () => {
    const { preguntas, errores } = validarPreguntas([preguntaValida({ situacion: '   ' })])
    expect(errores).toEqual([])
    expect(preguntas[0].situacion).toBeUndefined()
  })
})

describe('validarPreguntas: errores de forma', () => {
  it('rechaza un archivo que no es un arreglo', () => {
    const { errores } = validarPreguntas({})
    expect(campos(errores)).toContain('raíz')
  })

  it('rechaza identificador repetido', () => {
    const { errores } = validarPreguntas([preguntaValida(), preguntaValida()])
    expect(campos(errores)).toContain('id')
    expect(errores[0].mensaje).toMatch(/repetido/)
  })

  it('rechaza cuatro opciones', () => {
    const { errores } = validarPreguntas([preguntaValida({ opciones: conEfectos([2, 1, 0, -1]) })])
    expect(campos(errores)).toContain('opciones')
  })

  it('rechaza efectos repetidos', () => {
    const { errores } = validarPreguntas([preguntaValida({ opciones: conEfectos([2, 2, 0, -1, -2]) })])
    expect(campos(errores)).toContain('opciones')
    expect(errores.some((e) => e.mensaje.includes('2, 1, 0, -1 y -2'))).toBe(true)
  })

  it('rechaza un tema desconocido', () => {
    const { errores } = validarPreguntas([
      preguntaValida({ temas: ['playa'] as never })
    ])
    expect(campos(errores)).toContain('temas')
  })

  it('rechaza cero temas y tres temas', () => {
    expect(campos(validarPreguntas([preguntaValida({ temas: [] })]).errores)).toContain('temas')
    expect(
      campos(validarPreguntas([preguntaValida({ temas: ['casa', 'moneda', 'hospital'] })]).errores)
    ).toContain('temas')
  })

  it('rechaza un comodín sin moneda', () => {
    const { errores } = validarPreguntas([preguntaValida({ temas: ['casa'], comodin: true })])
    expect(campos(errores)).toContain('comodin')
  })

  it('rechaza un enunciado vacío', () => {
    expect(campos(validarPreguntas([preguntaValida({ enunciado: '  ' })]).errores)).toContain('enunciado')
  })

  it('rechaza un identificador vacío', () => {
    expect(campos(validarPreguntas([preguntaValida({ id: '' })]).errores)).toContain('id')
  })

  it('rechaza una reflexión incompleta', () => {
    const { errores } = validarPreguntas([
      preguntaValida({ reflexion: { propuesta: '', pregunta: 'algo' } })
    ])
    expect(campos(errores)).toContain('reflexion.propuesta')
  })

  it('acumula varios errores a la vez en lugar de detenerse en el primero', () => {
    const { errores } = validarPreguntas([
      preguntaValida({ id: '', temas: [], enunciado: '', opciones: conEfectos([2, 1, 0, -1]) })
    ])
    expect(errores.length).toBeGreaterThanOrEqual(3)
    expect(campos(errores)).toEqual(
      expect.arrayContaining(['id', 'temas', 'enunciado', 'opciones'])
    )
  })

  it('descarta la pregunta inválida y conserva las válidas', () => {
    const { preguntas, errores } = validarPreguntas([
      preguntaValida({ id: 'buena' }),
      preguntaValida({ id: 'mala', enunciado: '' })
    ])
    expect(errores).toHaveLength(1)
    expect(preguntas.map((p) => p.id)).toEqual(['buena'])
  })
})

describe('validarTextos', () => {
  it('acepta un archivo de textos bien formado', () => {
    const { textos, errores } = validarTextos(textrosValidos)
    expect(errores).toEqual([])
    expect(textos?.villanos).toHaveLength(3)
  })

  it('rechaza un número de villanos distinto de tres', () => {
    const { errores } = validarTextos({ ...textrosValidos, villanos: [textrosValidos.villanos[0]] })
    expect(campos(errores)).toContain('villanos')
  })

  it('rechaza identificadores de villano no correlativos', () => {
    const villanos = textrosValidos.villanos.map((v) => ({ ...v }))
    villanos[1].id = 5
    const { errores } = validarTextos({ ...textrosValidos, villanos })
    expect(campos(errores)).toContain('villanos[1].id')
  })

  it('rechaza un campo de villano vacío', () => {
    const villanos = textrosValidos.villanos.map((v) => ({ ...v }))
    villanos[0].nombre = ''
    expect(campos(validarTextos({ ...textrosValidos, villanos }).errores)).toContain('villanos[0].nombre')
  })

  it('rechaza una frase ausente', () => {
    const frases = { ...textrosValidos.frases } as Record<string, string>
    delete frases.empateSinRespuestas
    const { errores } = validarTextos({ ...textrosValidos, frases })
    expect(campos(errores)).toContain('frases.empateSinRespuestas')
  })

  it('rechaza un campo de nivel superior vacío', () => {
    expect(campos(validarTextos({ ...textrosValidos, fuente: '' }).errores)).toContain('fuente')
    expect(campos(validarTextos({ ...textrosValidos, fuentePreguntas: '' }).errores)).toContain(
      'fuentePreguntas'
    )
  })
})
