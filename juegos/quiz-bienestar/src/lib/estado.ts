import { get, writable } from 'svelte/store'
import { energiaInicial, escalaInicial } from './config'
import { mezclar, type Generador } from './azar'
import {
  aplicarRespuesta,
  calcularLimite,
  componerMensaje,
  estaVencida,
  repartirCambio,
  resultado as calcularResultado,
  type Mensaje
} from './reglas'
import {
  almacenamientoDelNavegador,
  borrar,
  cargar,
  guardar,
  type Almacen
} from './persistencia'
import { bolsaDesdeHistorial, crearSeleccion, sacarPregunta, type EstadoSeleccion } from './seleccion'
import type {
  EstadoBatalla,
  EstadoPartida,
  Guardado,
  MotivoCierre,
  Pregunta,
  Textos
} from './tipos'

function progresoInicial(): Guardado {
  return {
    version: 1,
    villanoActivo: 0,
    completada: false,
    ultimaBatalla: null,
    simbolos: {
      casa: escalaInicial,
      zanahoria: escalaInicial,
      hospital: escalaInicial,
      moneda: escalaInicial
    },
    historial: []
  }
}

function estadoInicial(): EstadoPartida {
  return { ...progresoInicial(), pantalla: 'intro', batalla: null, almacenamientoDisponible: false }
}

let banco: Pregunta[] = []
let porId = new Map<string, Pregunta>()
let textosActuales: Textos | null = null
let almacenActual: Almacen | null = null
let rngActual: Generador = Math.random
let ahoraActual: () => number = () => Date.now()
let seleccionActual: EstadoSeleccion = { bolsa: [], historial: [] }
let comodinesEnBatalla = 0

/**
 * Hay partida en curso cuando ya se ha respondido o desbloqueado a un villano.
 * El guardado que solo registra el mapa recién abierto no cuenta: la intro no
 * debe saltarse al recargar.
 */
function hayProgreso(guardado: Guardado): boolean {
  return guardado.villanoActivo > 0 || guardado.historial.length > 0
}

export const partida = writable<EstadoPartida>(estadoInicial())

export interface OpcionesInicio {
  preguntas: Pregunta[]
  textos: Textos
  almacen?: Almacen | null
  rng?: Generador
  ahora?: () => number
}

/** Arranque: hidrata desde el almacenamiento y decide la pantalla de entrada. */
export function iniciar(opciones: OpcionesInicio): void {
  banco = opciones.preguntas
  porId = new Map(banco.map((p) => [p.id, p]))
  textosActuales = opciones.textos
  almacenActual = opciones.almacen === undefined ? almacenamientoDelNavegador() : opciones.almacen
  rngActual = opciones.rng ?? Math.random
  ahoraActual = opciones.ahora ?? (() => Date.now())
  comodinesEnBatalla = 0

  const ids = new Set(porId.keys())
  const guardado = cargar(almacenActual, ids)

  // La pantalla no se guarda: se decide al cargar. La intro y el final no se
  // recuperan nunca; el mapa solo aparece si hay una partida empezada de verdad.
  if (guardado && !guardado.completada && hayProgreso(guardado)) {
    seleccionActual = {
      bolsa: bolsaDesdeHistorial(banco, guardado.historial, rngActual),
      historial: guardado.historial
    }
    partida.set({
      ...guardado,
      pantalla: 'mapa',
      batalla: null,
      almacenamientoDisponible: almacenActual !== null
    })
    return
  }

  seleccionActual = crearSeleccion(banco, rngActual)
  partida.set({
    ...progresoInicial(),
    pantalla: 'intro',
    batalla: null,
    almacenamientoDisponible: almacenActual !== null
  })
}

export function textosDeLaPartida(): Textos | null {
  return textosActuales
}

function persistirProgreso(): void {
  const estado = get(partida)
  guardar(almacenActual, {
    version: 1,
    villanoActivo: estado.villanoActivo,
    completada: estado.completada,
    ultimaBatalla: estado.ultimaBatalla,
    simbolos: estado.simbolos,
    historial: seleccionActual.historial
  })
}

function sacarDeLaBolsa(): EstadoBatalla {
  const sacada = sacarPregunta(seleccionActual, porId, comodinesEnBatalla, rngActual)
  seleccionActual = sacada.seleccion
  if (sacada.esComodin) comodinesEnBatalla += 1
  return {
    pregunta: sacada.pregunta,
    ordenOpciones: mezclar([0, 1, 2, 3, 4], rngActual),
    respuestas: [],
    energiaJugador: energiaInicial,
    energiaVillano: energiaInicial,
    limiteMs: calcularLimite(ahoraActual()),
    resultado: null
  }
}

export function empezarPartida(): void {
  borrar(almacenActual)
  seleccionActual = crearSeleccion(banco, rngActual)
  comodinesEnBatalla = 0
  // No se guarda nada hasta la primera respuesta: si se recarga en el mapa sin
  // haber jugado, no hay progreso y se vuelve a la intro.
  partida.set({
    ...progresoInicial(),
    pantalla: 'mapa',
    batalla: null,
    almacenamientoDisponible: almacenActual !== null
  })
}

export function entrarBatalla(): void {
  const estado = get(partida)
  if (estado.batalla) return
  comodinesEnBatalla = 0
  partida.set({ ...estado, pantalla: 'batalla', batalla: sacarDeLaBolsa() })
}

export function responder(indiceVisible: number): void {
  const estado = get(partida)
  const batalla = estado.batalla
  if (!batalla || batalla.resultado !== null) return

  if (estaVencida(batalla.limiteMs, ahoraActual())) {
    cerrarBatalla('tiempo')
    return
  }

  const indiceOriginal = batalla.ordenOpciones[indiceVisible]
  const opcion = batalla.pregunta.opciones[indiceOriginal]
  if (!opcion) return

  const energias = aplicarRespuesta(
    { energiaJugador: batalla.energiaJugador, energiaVillano: batalla.energiaVillano },
    opcion.efecto
  )
  const respuestas = [
    ...batalla.respuestas,
    { preguntaId: batalla.pregunta.id, temas: batalla.pregunta.temas, efecto: opcion.efecto }
  ]

  partida.set({ ...estado, batalla: { ...batalla, ...energias, respuestas } })
  persistirProgreso()

  if (energias.energiaJugador === 0 || energias.energiaVillano === 0) {
    cerrarBatalla('energia')
    return
  }

  const actual = get(partida)
  const siguiente = sacarDeLaBolsa()
  partida.set({
    ...actual,
    batalla: {
      ...siguiente,
      respuestas,
      energiaJugador: energias.energiaJugador,
      energiaVillano: energias.energiaVillano,
      limiteMs: batalla.limiteMs
    }
  })
  persistirProgreso()
}

export function cerrarBatalla(motivo: MotivoCierre): void {
  const estado = get(partida)
  const batalla = estado.batalla
  if (!batalla || batalla.resultado !== null) return

  const res = calcularResultado(batalla, motivo)
  const gano = res === 'victoria' || res === 'perfect'
  const villanoActivo = gano ? Math.min(3, estado.villanoActivo + 1) : estado.villanoActivo

  partida.set({
    ...estado,
    pantalla: 'resultado',
    batalla: { ...batalla, resultado: res },
    simbolos: repartirCambio(estado.simbolos, batalla.respuestas, res),
    villanoActivo,
    completada: villanoActivo >= 3,
    ultimaBatalla: res
  })
  persistirProgreso()
}

export function volverAlMapa(): void {
  const estado = get(partida)
  partida.set({ ...estado, pantalla: 'mapa', batalla: null })
}

export function verFinal(): void {
  const estado = get(partida)
  partida.set({ ...estado, pantalla: 'final', batalla: null })
}

export function reiniciar(): void {
  borrar(almacenActual)
  seleccionActual = crearSeleccion(banco, rngActual)
  comodinesEnBatalla = 0
  partida.set({
    ...progresoInicial(),
    pantalla: 'intro',
    batalla: null,
    almacenamientoDisponible: almacenActual !== null
  })
}

export function mensajeDePartida(estado: EstadoPartida): Mensaje | null {
  if (!textosActuales) return null
  const batalla = estado.batalla
  if (!batalla || batalla.resultado === null) return null
  return componerMensaje(textosActuales, batalla.respuestas, batalla.resultado, porId)
}

/** Solo para pruebas: deja el módulo como recién importado. */
export function reiniciarModulo(): void {
  banco = []
  porId = new Map()
  textosActuales = null
  almacenActual = null
  rngActual = Math.random
  ahoraActual = () => Date.now()
  seleccionActual = { bolsa: [], historial: [] }
  comodinesEnBatalla = 0
  partida.set(estadoInicial())
}
