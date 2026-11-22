// @vitest-environment node
import { beforeEach, describe, expect, it } from 'vitest'
import { get } from 'svelte/store'
import {
  cerrarBatalla,
  empezarPartida,
  entrarBatalla,
  iniciar,
  mensajeDePartida,
  partida,
  reiniciar,
  reiniciarModulo,
  responder,
  verFinal,
  volverAlMapa
} from './estado'
import { generadorFijo } from './azar'
import { crearPregunta, textosValidos } from './pruebas-ayuda'
import { guardar, type Almacen } from './persistencia'
import type { Efecto } from './tipos'

const BANCO = [crearPregunta('q1')]

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

function indiceConEfecto(efecto: Efecto): number {
  const batalla = get(partida).batalla
  if (!batalla) throw new Error('no hay batalla en curso')
  return batalla.ordenOpciones.findIndex((i) => batalla.pregunta.opciones[i].efecto === efecto)
}

function responderCon(efecto: Efecto): void {
  responder(indiceConEfecto(efecto))
}

function ganarBatalla(): void {
  entrarBatalla()
  responderCon(2)
  responderCon(2)
  responderCon(2)
}

beforeEach(() => {
  reiniciarModulo()
})

describe('flujo de la partida', () => {
  it('sin progreso guardado empieza en la intro', () => {
    arrancar()
    expect(get(partida).pantalla).toBe('intro')
    expect(get(partida).almacenamientoDisponible).toBe(false)
  })

  it('empezar partida lleva al mapa con el progreso inicial', () => {
    arrancar()
    empezarPartida()
    const estado = get(partida)
    expect(estado.pantalla).toBe('mapa')
    expect(estado.villanoActivo).toBe(0)
    expect(estado.simbolos).toEqual({ casa: 4, zanahoria: 4, hospital: 4, moneda: 4 })
    expect(estado.historial).toEqual([])
  })

  it('ganar desbloquea al villano siguiente y marca un perfect', () => {
    arrancar()
    empezarPartida()
    ganarBatalla()
    const estado = get(partida)
    expect(estado.pantalla).toBe('resultado')
    expect(estado.batalla?.resultado).toBe('perfect')
    expect(estado.villanoActivo).toBe(1)
    expect(estado.ultimaBatalla).toBe('perfect')
    expect(estado.simbolos.casa).toBe(8)
  })

  it('perder no desbloquea y resta al símbolo', () => {
    arrancar()
    empezarPartida()
    entrarBatalla()
    responderCon(-2)
    responderCon(-2)
    responderCon(-2)
    const estado = get(partida)
    expect(estado.batalla?.resultado).toBe('derrota')
    expect(estado.villanoActivo).toBe(0)
    expect(estado.completada).toBe(false)
    expect(estado.simbolos.casa).toBe(2)
  })

  it('el empate no cambia símbolos ni desbloquea', () => {
    arrancar()
    empezarPartida()
    entrarBatalla()
    const antes = get(partida).simbolos
    cerrarBatalla('tiempo')
    const estado = get(partida)
    expect(estado.batalla?.resultado).toBe('empate')
    expect(estado.simbolos).toEqual(antes)
    expect(estado.villanoActivo).toBe(0)
  })

  it('la tercera victoria marca la partida como completa y lleva al final', () => {
    arrancar()
    empezarPartida()
    for (let i = 0; i < 3; i += 1) {
      ganarBatalla()
      if (i < 2) volverAlMapa()
    }
    expect(get(partida).villanoActivo).toBe(3)
    expect(get(partida).completada).toBe(true)
    verFinal()
    expect(get(partida).pantalla).toBe('final')
  })

  it('volver a jugar deja el estado inicial y borra el guardado', () => {
    const almacen = new AlmacenFalso()
    arrancar(almacen)
    empezarPartida()
    ganarBatalla()
    expect(almacen.datos.size).toBe(1)

    reiniciar()
    const estado = get(partida)
    expect(estado.pantalla).toBe('intro')
    expect(estado.villanoActivo).toBe(0)
    expect(estado.historial).toEqual([])
    expect(almacen.datos.size).toBe(0)
  })

  it('una batalla cerrada no acepta más respuestas', () => {
    arrancar()
    empezarPartida()
    ganarBatalla()
    const energiaVillano = get(partida).batalla?.energiaVillano
    responderCon(2)
    expect(get(partida).batalla?.energiaVillano).toBe(energiaVillano)
  })

  it('una pulsación llegada después del límite cierra por tiempo', () => {
    let ahora = 0
    arrancar(null, () => ahora)
    empezarPartida()
    entrarBatalla()
    ahora = 120_001
    responderCon(2)
    expect(get(partida).batalla?.resultado).toBe('empate')
    expect(get(partida).pantalla).toBe('resultado')
  })
})

describe('recarga', () => {
  it('al recargar en mitad de una batalla se vuelve al mapa con el historial conservado', () => {
    const almacen = new AlmacenFalso()
    arrancar(almacen)
    empezarPartida()
    entrarBatalla()
    responderCon(1)

    reiniciarModulo()
    arrancar(almacen)

    const estado = get(partida)
    expect(estado.pantalla).toBe('mapa')
    expect(estado.batalla).toBeNull()
    // El historial registra cada pregunta extraída: con un banco de una sola
    // pregunta, la primera se responde y la segunda se extrae al continuar la batalla.
    expect(estado.historial).toEqual(['q1', 'q1'])
  })

  it('al recargar en el mapa sin haber jugado se vuelve a la intro', () => {
    const almacen = new AlmacenFalso()
    arrancar(almacen)
    empezarPartida()
    // Empezar no guarda nada: no hay progreso que recordar.
    expect(almacen.datos.size).toBe(0)

    reiniciarModulo()
    arrancar(almacen)

    expect(get(partida).pantalla).toBe('intro')
  })

  it('al recargar después de entrar en batalla sin responder se vuelve a la intro', () => {
    const almacen = new AlmacenFalso()
    arrancar(almacen)
    empezarPartida()
    entrarBatalla()

    reiniciarModulo()
    arrancar(almacen)

    expect(get(partida).pantalla).toBe('intro')
  })

  it('un guardado antiguo sin progreso vuelve a la intro', () => {
    const almacen = new AlmacenFalso()
    guardar(almacen, {
      version: 1,
      villanoActivo: 0,
      completada: false,
      ultimaBatalla: null,
      simbolos: { casa: 4, zanahoria: 4, hospital: 4, moneda: 4 },
      historial: []
    })

    arrancar(almacen)

    expect(get(partida).pantalla).toBe('intro')
    expect(get(partida).historial).toEqual([])
  })

  it('una partida completa guardada vuelve a la intro', () => {
    const almacen = new AlmacenFalso()
    arrancar(almacen)
    empezarPartida()
    for (let i = 0; i < 3; i += 1) {
      ganarBatalla()
      if (i < 2) volverAlMapa()
    }
    expect(get(partida).completada).toBe(true)

    reiniciarModulo()
    arrancar(almacen)

    const estado = get(partida)
    expect(estado.pantalla).toBe('intro')
    expect(estado.completada).toBe(false)
    expect(estado.villanoActivo).toBe(0)
  })
})

describe('mensaje de reflexión', () => {
  it('compone la frase y la propuesta de la pregunta respondida', () => {
    arrancar()
    empezarPartida()
    ganarBatalla()
    const mensaje = mensajeDePartida(get(partida))
    expect(mensaje?.frase).toBe('PERFECT!')
    expect(mensaje?.propuesta).toBe('propuesta q1')
    expect(mensaje?.pregunta).toBe('pregunta q1')
  })

  it('sin batalla cerrada no hay mensaje', () => {
    arrancar()
    expect(mensajeDePartida(get(partida))).toBeNull()
  })
})
