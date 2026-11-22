import {
  cambioDerrota,
  cambioPerfect,
  cambioVictoria,
  energiaInicial as energiaInicialConfig,
  escalaMaximo,
  escalaMinimo,
  duracionBatallaMs
} from './config'
import type {
  ClaveFrase,
  Efecto,
  EstadoBatalla,
  MotivoCierre,
  Pregunta,
  Respuesta,
  Resultado,
  Simbolos,
  Tema,
  Textos
} from './tipos'

const ORDEN_TEMAS: readonly Tema[] = ['casa', 'zanahoria', 'hospital', 'moneda']
const EPSILON = 1e-9

export function limitar(valor: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, valor))
}

export interface Energias {
  energiaJugador: number
  energiaVillano: number
}

/**
 * `efecto` es una cantidad con signo: positivo quita energía al villano,
 * negativo quita energía a quien juega, y 0 no hace nada.
 */
export function aplicarRespuesta(
  energias: Energias,
  efecto: Efecto,
  energiaInicial: number = energiaInicialConfig
): Energias {
  const siguiente: Energias = { ...energias }
  if (efecto > 0) {
    siguiente.energiaVillano = limitar(energias.energiaVillano - efecto, 0, energiaInicial)
  } else if (efecto < 0) {
    siguiente.energiaJugador = limitar(energias.energiaJugador + efecto, 0, energiaInicial)
  }
  return siguiente
}

export function esPerfect(respuestas: readonly Respuesta[]): boolean {
  return respuestas.length === 3 && respuestas.every((r) => r.efecto === 2)
}

/**
 * `motivo` lo aporta quien cierra la batalla: la energía se deduce del estado,
 * pero que el plazo haya vencido depende del reloj.
 */
export function resultado(estado: EstadoBatalla, motivo: MotivoCierre): Resultado {
  if (estado.energiaJugador === 0) return 'derrota'
  if (estado.energiaVillano === 0) return esPerfect(estado.respuestas) ? 'perfect' : 'victoria'
  if (motivo === 'tiempo') {
    if (estado.energiaVillano < estado.energiaJugador) return 'victoria'
    if (estado.energiaVillano > estado.energiaJugador) return 'derrota'
    return 'empate'
  }
  return 'empate'
}

export function cambioBase(res: Resultado): number {
  switch (res) {
    case 'perfect':
      return cambioPerfect
    case 'victoria':
      return cambioVictoria
    case 'derrota':
      return cambioDerrota
    case 'empate':
      return 0
  }
}

function pesosPorTema(respuestas: readonly Respuesta[]): Record<Tema, number> {
  const peso: Record<Tema, number> = { casa: 0, zanahoria: 0, hospital: 0, moneda: 0 }
  const n = respuestas.length
  if (n === 0) return peso
  for (const respuesta of respuestas) {
    if (respuesta.temas.length === 0) continue
    const parte = 1 / respuesta.temas.length
    for (const tema of respuesta.temas) peso[tema] += parte
  }
  for (const tema of ORDEN_TEMAS) peso[tema] /= n
  return peso
}

/**
 * Reparte el cambio base entre los símbolos con el método del mayor resto.
 * Los pesos suman 1, así que la suma de los enteros repartidos es `base`
 * salvo que actúe el límite 0–8, que se aplica al final y tiene la última palabra.
 */
export function repartirCambio(
  simbolos: Simbolos,
  respuestas: readonly Respuesta[],
  res: Resultado
): Simbolos {
  if (respuestas.length === 0) return { ...simbolos }

  const base = cambioBase(res)
  const peso = pesosPorTema(respuestas)

  const cuota: Record<Tema, number> = { casa: 0, zanahoria: 0, hospital: 0, moneda: 0 }
  const entero: Record<Tema, number> = { casa: 0, zanahoria: 0, hospital: 0, moneda: 0 }
  for (const tema of ORDEN_TEMAS) {
    cuota[tema] = base * peso[tema]
    entero[tema] = Math.trunc(cuota[tema])
  }

  let resto = base - ORDEN_TEMAS.reduce((suma, tema) => suma + entero[tema], 0)

  while (resto !== 0) {
    let candidato = ORDEN_TEMAS[0]
    for (const tema of ORDEN_TEMAS) {
      const fraccion = Math.abs(cuota[tema] - entero[tema])
      const mejorFraccion = Math.abs(cuota[candidato] - entero[candidato])
      if (fraccion > mejorFraccion + EPSILON) candidato = tema
    }
    const signo = resto > 0 ? 1 : -1
    entero[candidato] += signo
    resto -= signo
  }

  const siguiente: Simbolos = { ...simbolos }
  for (const tema of ORDEN_TEMAS) {
    siguiente[tema] = limitar(simbolos[tema] + entero[tema], escalaMinimo, escalaMaximo)
  }
  return siguiente
}

export interface Mensaje {
  frase: string
  propuesta?: string
  pregunta?: string
}

function claveFrase(res: Resultado, huboRespuestas: boolean): ClaveFrase {
  if (res === 'empate') return huboRespuestas ? 'empateConRespuestas' : 'empateSinRespuestas'
  return res
}

/**
 * La propuesta la aporta la última pregunta respondida del tema ganador que no sea
 * comodín; si ese tema solo tiene comodines, la aporta el último comodín respondido.
 * Los comodines nunca ganan un tema frente a preguntas con tema propio.
 */
export function componerMensaje(
  textos: Textos,
  respuestas: readonly Respuesta[],
  res: Resultado,
  preguntasPorId: ReadonlyMap<string, Pregunta>
): Mensaje {
  const frase = textos.frases[claveFrase(res, respuestas.length > 0)]
  if (respuestas.length === 0) return { frase }

  const esComodin = (r: Respuesta) => preguntasPorId.get(r.preguntaId)?.comodin === true
  const conTemaPropio = respuestas.filter((r) => !esComodin(r))
  const baseConteo = conTemaPropio.length > 0 ? conTemaPropio : respuestas

  const conteo: Record<Tema, number> = { casa: 0, zanahoria: 0, hospital: 0, moneda: 0 }
  for (const respuesta of baseConteo) {
    for (const tema of respuesta.temas) conteo[tema] += 1
  }

  let ganador: Tema | null = null
  for (const tema of ORDEN_TEMAS) {
    if (conteo[tema] === 0) continue
    if (ganador === null || conteo[tema] > conteo[ganador]) ganador = tema
  }
  if (ganador === null) return { frase }

  const delTema = respuestas.filter((r) => r.temas.includes(ganador as Tema))
  const fuente =
    [...delTema].reverse().find((r) => !esComodin(r)) ?? [...delTema].reverse().find(esComodin)

  const reflexion = fuente ? preguntasPorId.get(fuente.preguntaId)?.reflexion : undefined
  if (!reflexion) return { frase }

  return { frase, propuesta: reflexion.propuesta, pregunta: reflexion.pregunta }
}

export function calcularLimite(ahora: number, duracionMs: number = duracionBatallaMs): number {
  return ahora + duracionMs
}

export function estaVencida(limiteMs: number, ahora: number): boolean {
  return ahora >= limiteMs
}
