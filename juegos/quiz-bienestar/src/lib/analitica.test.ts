// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { get } from 'svelte/store'
import { EVENTOS, registrarEvento } from './analitica'
import {
  cerrarBatalla,
  empezarPartida,
  entrarBatalla,
  iniciar,
  partida,
  reiniciar,
  reiniciarModulo,
  responder,
  verFinal,
  volverAlMapa
} from './estado'
import { generadorFijo } from './azar'
import { crearPregunta, textosValidos } from './pruebas-ayuda'
import type { Almacen } from './persistencia'

const BANCO = Array.from({ length: 12 }, (_, i) => crearPregunta(`q${i + 1}`))

interface Llamada {
  nombre: string
  parametros: Record<string, unknown>
}

let llamadas: Llamada[] = []

const navegador = globalThis as { gtag?: unknown }

class AlmacenFalso implements Almacen {
  datos = new Map<string, string>()
  getItem(clave: string): string | null {
    return this.datos.get(clave) ?? null
  }
  setItem(clave: string, valor: string): void {
    this.datos.set(clave, valor)
  }
  removeItem(clave: string): void {
    this.datos.delete(clave)
  }
}

function arrancar(almacen: Almacen | null = null, ahora: () => number = () => 0): void {
  iniciar({ preguntas: BANCO, textos: textosValidos, almacen, rng: generadorFijo(1), ahora })
}

function nombres(): string[] {
  return llamadas.map((llamada) => llamada.nombre)
}

function de(nombre: string): Llamada[] {
  return llamadas.filter((llamada) => llamada.nombre === nombre)
}

function responderCon(efecto: number): void {
  const batalla = get(partida).batalla
  if (!batalla) throw new Error('no hay batalla en curso')
  const indice = batalla.ordenOpciones.findIndex(
    (i) => batalla.pregunta.opciones[i].efecto === efecto
  )
  responder(indice)
}

function ganarBatalla(): void {
  entrarBatalla()
  responderCon(2)
  responderCon(2)
  responderCon(2)
}

beforeEach(() => {
  llamadas = []
  reiniciarModulo()
  navegador.gtag = (
    orden: string,
    nombre: string,
    parametros: Record<string, unknown> = {}
  ): void => {
    if (orden === 'event') llamadas.push({ nombre, parametros })
  }
})

afterEach(() => {
  delete navegador.gtag
})

describe('registrarEvento', () => {
  it('no hace nada si gtag no existe (desarrollo y pruebas)', () => {
    delete navegador.gtag
    expect(() => registrarEvento(EVENTOS.partidaIniciada)).not.toThrow()
  })

  it('reenvía el nombre y los parámetros a gtag', () => {
    const enviados: Llamada[] = []
    navegador.gtag = (orden: string, nombre: string, parametros: Record<string, unknown>) => {
      enviados.push({ nombre: `${orden}:${nombre}`, parametros: parametros ?? {} })
    }
    registrarEvento(EVENTOS.mapaAbierto, { villano_activo: 2 })
    expect(enviados).toEqual([{ nombre: 'event:mapa_abierto', parametros: { villano_activo: 2 } }])
  })
})

describe('eventos de la partida', () => {
  it('emite la secuencia de un combate ganado', () => {
    arrancar()
    empezarPartida()
    ganarBatalla()

    expect(nombres()).toEqual([
      EVENTOS.partidaIniciada,
      EVENTOS.batallaIniciada,
      EVENTOS.respuestaEnviada,
      EVENTOS.respuestaEnviada,
      EVENTOS.respuestaEnviada,
      EVENTOS.batallaTerminada
    ])

    expect(de(EVENTOS.partidaIniciada)[0].parametros).toEqual({ origen: 'intro' })
    expect(de(EVENTOS.batallaIniciada)[0].parametros).toMatchObject({
      villano_id: 0,
      villano: 'Uno',
      comodin: false
    })

    const primera = de(EVENTOS.respuestaEnviada)[0].parametros
    expect(primera).toMatchObject({
      villano_id: 0,
      efecto: 2,
      valoracion: 'acierto',
      numero: 1,
      energia_jugador: 5,
      energia_villano: 3,
      comodin: false
    })
    expect(typeof primera.pregunta_id).toBe('string')
    expect(typeof primera.temas).toBe('string')

    const cierre = de(EVENTOS.batallaTerminada)[0].parametros
    expect(cierre).toMatchObject({
      villano_id: 0,
      resultado: 'perfect',
      ganada: true,
      motivo: 'energia',
      respuestas: 3,
      completada: false,
      energia_jugador: 5,
      energia_villano: 0
    })
    expect(cierre.duracion_s).toBe(0)
  })

  it('marca el fallo y el neutro en las respuestas', () => {
    arrancar()
    empezarPartida()
    entrarBatalla()
    responderCon(-2)
    responderCon(0)

    expect(de(EVENTOS.respuestaEnviada).map((l) => l.parametros.valoracion)).toEqual([
      'fallo',
      'neutro'
    ])
  })

  it('cierra por tiempo cuando vence el plazo', () => {
    arrancar()
    empezarPartida()
    entrarBatalla()
    cerrarBatalla('tiempo')

    expect(de(EVENTOS.batallaTerminada)[0].parametros).toMatchObject({
      resultado: 'empate',
      ganada: false,
      motivo: 'tiempo',
      respuestas: 0,
      completada: false
    })
  })

  it('no emite respuesta cuando la batalla ya está cerrada', () => {
    arrancar()
    empezarPartida()
    ganarBatalla()
    responderCon(2)

    expect(de(EVENTOS.respuestaEnviada)).toHaveLength(3)
  })

  it('emite partida_completada solo al ganar al tercer villano', () => {
    arrancar()
    empezarPartida()
    for (let i = 0; i < 3; i += 1) {
      ganarBatalla()
      if (i < 2) volverAlMapa()
    }

    const completadas = de(EVENTOS.partidaCompletada)
    expect(completadas).toHaveLength(1)
    expect(completadas[0].parametros).toMatchObject({ villano_id: 2, resultado: 'perfect' })
    expect(de(EVENTOS.mapaAbierto).map((l) => l.parametros.villano_activo)).toEqual([1, 2])
  })

  it('emite final_visto, partida_reiniciada y partida_iniciada al volver a jugar', () => {
    arrancar()
    empezarPartida()
    for (let i = 0; i < 3; i += 1) {
      ganarBatalla()
      if (i < 2) volverAlMapa()
    }
    verFinal()
    reiniciar()
    empezarPartida()

    expect(de(EVENTOS.finalVisto)[0].parametros).toEqual({ villano_activo: 3 })
    expect(nombres()).toContain(EVENTOS.partidaReiniciada)
    expect(de(EVENTOS.partidaIniciada)).toHaveLength(2)
  })

  it('emite partida_retomada al reabrir el juego con progreso guardado', () => {
    const almacen = new AlmacenFalso()
    arrancar(almacen)
    empezarPartida()
    ganarBatalla()

    reiniciarModulo()
    llamadas = []
    arrancar(almacen)

    const retomada = de(EVENTOS.partidaRetomada)
    expect(retomada).toHaveLength(1)
    expect(retomada[0].parametros).toEqual({ villano_activo: 1, respuestas: 3 })
    expect(get(partida).pantalla).toBe('mapa')
  })

  it('no emite partida_retomada al abrir sin progreso', () => {
    arrancar(new AlmacenFalso())
    expect(de(EVENTOS.partidaRetomada)).toHaveLength(0)
  })
})
