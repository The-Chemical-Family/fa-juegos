// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  aplicarRespuesta,
  calcularLimite,
  cambioBase,
  componerMensaje,
  esPerfect,
  estaVencida,
  limitar,
  repartirCambio,
  resultado
} from './reglas'
import { generadorFijo } from './azar'
import type { Efecto, Pregunta, Respuesta, Simbolos, Tema, Textos } from './tipos'

const SIN_CAMBIOS: Simbolos = { casa: 4, zanahoria: 4, hospital: 4, moneda: 4 }

function respuesta(id: string, temas: Tema[], efecto: Efecto): Respuesta {
  return { preguntaId: id, temas, efecto }
}

function pregunta(id: string, temas: Tema[], comodin = false, propuesta = `propuesta de ${id}`): Pregunta {
  return {
    id,
    temas,
    comodin,
    enunciado: `enunciado de ${id}`,
    opciones: [
      { texto: 'a', efecto: 2 },
      { texto: 'b', efecto: 1 },
      { texto: 'c', efecto: 0 },
      { texto: 'd', efecto: -1 },
      { texto: 'e', efecto: -2 }
    ],
    reflexion: { propuesta, pregunta: `pregunta abierta de ${id}` }
  }
}

const TEXTOS: Textos = {
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

describe('limitar', () => {
  it('recorta a los extremos', () => {
    expect(limitar(-3, 0, 8)).toBe(0)
    expect(limitar(12, 0, 8)).toBe(8)
    expect(limitar(5, 0, 8)).toBe(5)
  })
})

describe('aplicarRespuesta', () => {
  const inicio = { energiaJugador: 5, energiaVillano: 5 }

  it.each<[Efecto, number, number]>([
    [2, 5, 3],
    [1, 5, 4],
    [0, 5, 5],
    [-1, 4, 5],
    [-2, 3, 5]
  ])('con efecto %i deja jugador %i y villano %i', (efecto, jugador, villano) => {
    const salida = aplicarRespuesta(inicio, efecto)
    expect(salida.energiaJugador).toBe(jugador)
    expect(salida.energiaVillano).toBe(villano)
  })

  it('un efecto positivo nunca toca al jugador y uno negativo nunca toca al villano', () => {
    expect(aplicarRespuesta(inicio, 2).energiaJugador).toBe(5)
    expect(aplicarRespuesta(inicio, -2).energiaVillano).toBe(5)
  })

  it('no baja de cero ni pasa del máximo', () => {
    expect(aplicarRespuesta({ energiaJugador: 1, energiaVillano: 1 }, 2).energiaVillano).toBe(0)
    expect(aplicarRespuesta({ energiaJugador: 1, energiaVillano: 1 }, -2).energiaJugador).toBe(0)
    expect(aplicarRespuesta({ energiaJugador: 5, energiaVillano: 5 }, 1).energiaVillano).toBe(4)
  })

  it('es una función pura: no muta la entrada', () => {
    const entrada = { energiaJugador: 5, energiaVillano: 5 }
    aplicarRespuesta(entrada, -2)
    expect(entrada).toEqual({ energiaJugador: 5, energiaVillano: 5 })
  })
})

describe('resultado', () => {
  const base = {
    pregunta: pregunta('x', ['casa']),
    ordenOpciones: [0, 1, 2, 3, 4],
    limiteMs: 0
  }

  it('derrota cuando el jugador llega a cero, aunque el villano también', () => {
    expect(
      resultado({ ...base, respuestas: [], energiaJugador: 0, energiaVillano: 0, resultado: null }, 'energia')
    ).toBe('derrota')
  })

  it('perfect exige exactamente tres respuestas, todas de efecto 2', () => {
    const tres = [respuesta('a', ['casa'], 2), respuesta('b', ['casa'], 2), respuesta('c', ['casa'], 2)]
    expect(esPerfect(tres)).toBe(true)
    expect(
      resultado({ ...base, respuestas: tres, energiaJugador: 5, energiaVillano: 0, resultado: null }, 'energia')
    ).toBe('perfect')
  })

  it('cuatro respuestas con tres de efecto 2 son victoria, no perfect', () => {
    const cuatro = [
      respuesta('a', ['casa'], 2),
      respuesta('b', ['casa'], 2),
      respuesta('c', ['casa'], 2),
      respuesta('d', ['moneda'], 1)
    ]
    expect(
      resultado({ ...base, respuestas: cuatro, energiaJugador: 5, energiaVillano: 0, resultado: null }, 'energia')
    ).toBe('victoria')
  })

  it('una victoria por tiempo con menos de tres respuestas no es perfect', () => {
    expect(
      resultado(
        { ...base, respuestas: [respuesta('a', ['casa'], 2)], energiaJugador: 5, energiaVillano: 3, resultado: null },
        'tiempo'
      )
    ).toBe('victoria')
  })

  it('al agotarse el tiempo gana quien tiene más energía', () => {
    const estado = (jugador: number, villano: number) => ({
      ...base,
      respuestas: [respuesta('a', ['casa'], 0)],
      energiaJugador: jugador,
      energiaVillano: villano,
      resultado: null
    })
    expect(resultado(estado(5, 3), 'tiempo')).toBe('victoria')
    expect(resultado(estado(3, 5), 'tiempo')).toBe('derrota')
    expect(resultado(estado(4, 4), 'tiempo')).toBe('empate')
  })

  it('un empate sin respuestas sigue siendo empate', () => {
    expect(
      resultado({ ...base, respuestas: [], energiaJugador: 5, energiaVillano: 5, resultado: null }, 'tiempo')
    ).toBe('empate')
  })
})

describe('repartirCambio', () => {
  it('traza 1: victoria con perfect reparte 4 y el desempate va a casa', () => {
    const respuestas = [
      respuesta('a', ['casa'], 2),
      respuesta('b', ['moneda'], 2),
      respuesta('c', ['hospital'], 2)
    ]
    const salida = repartirCambio(SIN_CAMBIOS, respuestas, 'perfect')
    expect(salida).toEqual({ casa: 6, zanahoria: 4, hospital: 5, moneda: 5 })
    const suma = salida.casa + salida.zanahoria + salida.hospital + salida.moneda - 16
    expect(suma).toBe(cambioBase('perfect'))
  })

  it('traza 2: derrota con una pregunta de dos temas reparte −2', () => {
    const respuestas = [
      respuesta('a', ['casa', 'moneda'], -2),
      respuesta('b', ['casa'], -2),
      respuesta('c', ['casa'], -1)
    ]
    const salida = repartirCambio(SIN_CAMBIOS, respuestas, 'derrota')
    expect(salida).toEqual({ casa: 2, zanahoria: 4, hospital: 4, moneda: 4 })
  })

  it('traza 3: sin respuestas no cambia nada', () => {
    expect(repartirCambio(SIN_CAMBIOS, [], 'empate')).toEqual(SIN_CAMBIOS)
  })

  it('un solo tema recibe el cambio completo', () => {
    const respuestas = [respuesta('a', ['hospital'], -2)]
    expect(repartirCambio(SIN_CAMBIOS, respuestas, 'derrota')).toEqual({
      casa: 4,
      zanahoria: 4,
      hospital: 2,
      moneda: 4
    })
  })

  it('el límite 0–8 se aplica al final y rompe la suma, que es el único caso previsto', () => {
    const respuestas = [
      respuesta('a', ['casa'], 2),
      respuesta('b', ['casa'], 2),
      respuesta('c', ['casa'], 2)
    ]
    const salida = repartirCambio({ casa: 7, zanahoria: 4, hospital: 4, moneda: 4 }, respuestas, 'perfect')
    expect(salida.casa).toBe(8)
    const suma = salida.casa + salida.zanahoria + salida.hospital + salida.moneda - 19
    expect(suma).toBe(1)
    expect(suma).not.toBe(cambioBase('perfect'))
  })

  it('la suma coincide con el cambio base mientras no actúe el recorte', () => {
    const rng = generadorFijo(7)
    const temas: Tema[] = ['casa', 'zanahoria', 'hospital', 'moneda']
    const bases = ['perfect', 'victoria', 'derrota', 'empate'] as const

    for (let prueba = 0; prueba < 2000; prueba += 1) {
      const cuantas = 1 + Math.floor(rng() * 6)
      const respuestas: Respuesta[] = []
      for (let i = 0; i < cuantas; i += 1) {
        const tamano = rng() < 0.3 ? 2 : 1
        const elegidos = [...temas].sort(() => rng() - 0.5).slice(0, tamano)
        const efectos: Efecto[] = [-2, -1, 0, 1, 2]
        respuestas.push(respuesta(`q${i}`, elegidos, efectos[Math.floor(rng() * 5)]))
      }
      const res = bases[Math.floor(rng() * 4)]
      const salida = repartirCambio(SIN_CAMBIOS, respuestas, res)
      const suma = salida.casa + salida.zanahoria + salida.hospital + salida.moneda - 16
      expect(suma).toBe(cambioBase(res))
    }
  })
})

describe('componerMensaje', () => {
  const banco = new Map<string, Pregunta>([
    ['casa1', pregunta('casa1', ['casa'], false, 'propuesta casa 1')],
    ['casa2', pregunta('casa2', ['casa'], false, 'propuesta casa 2')],
    ['moneda1', pregunta('moneda1', ['moneda'], false, 'propuesta moneda')],
    ['comodin1', pregunta('comodin1', ['moneda'], true, 'propuesta comodín')]
  ])

  it('usa la última pregunta respondida del tema ganador', () => {
    const respuestas = [
      respuesta('casa1', ['casa'], 2),
      respuesta('casa2', ['casa'], 2),
      respuesta('moneda1', ['moneda'], 1)
    ]
    const mensaje = componerMensaje(TEXTOS, respuestas, 'victoria', banco)
    expect(mensaje.frase).toBe('¡Has ganado!')
    expect(mensaje.propuesta).toBe('propuesta casa 2')
  })

  it('desempata por el orden casa, zanahoria, hospital, moneda', () => {
    const respuestas = [respuesta('moneda1', ['moneda'], 2), respuesta('casa1', ['casa'], 2)]
    expect(componerMensaje(TEXTOS, respuestas, 'victoria', banco).propuesta).toBe('propuesta casa 1')
  })

  it('un comodín no gana el tema frente a una pregunta con tema propio', () => {
    const respuestas = [
      respuesta('comodin1', ['moneda'], 2),
      respuesta('comodin1', ['moneda'], 2),
      respuesta('casa1', ['casa'], 2)
    ]
    expect(componerMensaje(TEXTOS, respuestas, 'victoria', banco).propuesta).toBe('propuesta casa 1')
  })

  it('si solo se respondieron comodines, la propuesta viene del último comodín', () => {
    const respuestas = [respuesta('comodin1', ['moneda'], 2)]
    const mensaje = componerMensaje(TEXTOS, respuestas, 'victoria', banco)
    expect(mensaje.propuesta).toBe('propuesta comodín')
  })

  it('sin respuestas devuelve solo el texto del empate', () => {
    const mensaje = componerMensaje(TEXTOS, [], 'empate', banco)
    expect(mensaje).toEqual({ frase: 'Aquí no ha pasado nada.' })
  })

  it('el empate con respuestas usa la frase del empate', () => {
    const respuestas = [respuesta('casa1', ['casa'], 0)]
    expect(componerMensaje(TEXTOS, respuestas, 'empate', banco).frase).toBe('¡Empate!')
  })
})

describe('reloj', () => {
  it('el límite es el momento actual más la duración', () => {
    expect(calcularLimite(1000, 60_000)).toBe(61_000)
  })

  it('una pulsación justo en el límite ya no cuenta', () => {
    expect(estaVencida(61_000, 60_999)).toBe(false)
    expect(estaVencida(61_000, 61_000)).toBe(true)
    expect(estaVencida(61_000, 61_001)).toBe(true)
  })

  it('la duración es un parámetro y se puede variar sin tocar la configuración', () => {
    expect(calcularLimite(0, 5_000)).toBe(5_000)
    expect(calcularLimite(0)).toBe(120_000)
  })
})
