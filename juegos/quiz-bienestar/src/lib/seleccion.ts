import { maxComodinesPorBatalla } from './config'
import { mezclar, type Generador } from './azar'
import type { Pregunta } from './tipos'

export interface EstadoSeleccion {
  bolsa: string[]
  historial: string[]
}

export function crearSeleccion(banco: readonly Pregunta[], rng: Generador): EstadoSeleccion {
  return { bolsa: mezclar(banco.map((p) => p.id), rng), historial: [] }
}

/**
 * La bolsa se deduce del banco menos el historial. Al recargar en mitad de una
 * partida cambia el orden de las preguntas que quedan, porque la batalla se reinicia.
 */
export function bolsaDesdeHistorial(
  banco: readonly Pregunta[],
  historial: readonly string[],
  rng: Generador
): string[] {
  const usadas = new Set(historial)
  return mezclar(
    banco.filter((p) => !usadas.has(p.id)).map((p) => p.id),
    rng
  )
}

export interface SacarPreguntaResultado {
  pregunta: Pregunta
  seleccion: EstadoSeleccion
  esComodin: boolean
}

/**
 * Saca la siguiente pregunta de la bolsa. Si la bolsa está vacía, la vuelve a llenar
 * con el banco entero, incluidas las ya usadas: desde ese momento las repeticiones
 * son posibles. Si la extraída es comodín y la batalla ya mostró uno, se intercambia
 * por la siguiente no comodín de la bolsa; si no queda ninguna, se permite el segundo.
 */
export function sacarPregunta(
  seleccion: EstadoSeleccion,
  banco: ReadonlyMap<string, Pregunta>,
  comodinesUsados: number,
  rng: Generador
): SacarPreguntaResultado {
  let bolsa = seleccion.bolsa.slice()

  if (bolsa.length === 0) {
    bolsa = mezclar([...banco.keys()], rng)
  }

  const esComodin = (id: string) => banco.get(id)?.comodin === true

  if (esComodin(bolsa[0]) && comodinesUsados >= maxComodinesPorBatalla) {
    const indice = bolsa.findIndex((id, i) => i > 0 && !esComodin(id))
    if (indice > 0) {
      const temporal = bolsa[0]
      bolsa[0] = bolsa[indice]
      bolsa[indice] = temporal
    }
  }

  const id = bolsa[0]
  const pregunta = banco.get(id)
  if (!pregunta) {
    throw new Error(`La bolsa contiene un identificador desconocido: ${id}`)
  }

  return {
    pregunta,
    esComodin: pregunta.comodin,
    seleccion: {
      bolsa: bolsa.slice(1),
      historial: [...seleccion.historial, id]
    }
  }
}
