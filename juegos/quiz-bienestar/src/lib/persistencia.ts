import { escalaInicial, escalaMaximo, escalaMinimo } from './config'
import { limitar } from './reglas'
import type { Guardado, Resultado, Simbolos } from './tipos'

export const CLAVE = 'juego-bienestar:v1'
export const VERSION_ESPERADA = 1

export interface Almacen {
  getItem(clave: string): string | null
  setItem(clave: string, valor: string): void
  removeItem(clave: string): void
}

export function almacenamientoDelNavegador(): Almacen | null {
  try {
    const prueba = '__prueba__'
    globalThis.localStorage.setItem(prueba, '1')
    globalThis.localStorage.removeItem(prueba)
    return globalThis.localStorage
  } catch {
    return null
  }
}

export function almacenamientoDisponible(almacen: Almacen | null): boolean {
  return almacen !== null
}

const RESULTADOS: readonly Resultado[] = ['victoria', 'perfect', 'derrota', 'empate']

function entero(valor: unknown, porDefecto: number, minimo: number, maximo: number): number {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) return porDefecto
  return limitar(Math.trunc(valor), minimo, maximo)
}

function leerSimbolos(crudo: unknown): Simbolos {
  const fuente = typeof crudo === 'object' && crudo !== null ? (crudo as Record<string, unknown>) : {}
  return {
    casa: entero(fuente.casa, escalaInicial, escalaMinimo, escalaMaximo),
    zanahoria: entero(fuente.zanahoria, escalaInicial, escalaMinimo, escalaMaximo),
    hospital: entero(fuente.hospital, escalaInicial, escalaMinimo, escalaMaximo),
    moneda: entero(fuente.moneda, escalaInicial, escalaMinimo, escalaMaximo)
  }
}

/**
 * Carga el progreso. Devuelve `null` si no hay datos, si la versión no coincide,
 * si el JSON está corrupto o si el almacenamiento falla. Los identificadores del
 * historial que ya no existen en el banco se descartan.
 */
export function cargar(almacen: Almacen | null, idsConocidos: ReadonlySet<string>): Guardado | null {
  if (!almacen) return null

  let crudo: unknown
  try {
    const texto = almacen.getItem(CLAVE)
    if (texto === null) return null
    crudo = JSON.parse(texto)
  } catch {
    return null
  }

  if (typeof crudo !== 'object' || crudo === null) return null
  const datos = crudo as Record<string, unknown>
  if (datos.version !== VERSION_ESPERADA) return null

  const historial = Array.isArray(datos.historial)
    ? datos.historial.filter((id): id is string => typeof id === 'string' && idsConocidos.has(id))
    : []

  const ultima = datos.ultimaBatalla
  const ultimaBatalla =
    typeof ultima === 'string' && (RESULTADOS as readonly string[]).includes(ultima)
      ? (ultima as Resultado)
      : null

  return {
    version: VERSION_ESPERADA,
    villanoActivo: entero(datos.villanoActivo, 0, 0, 3),
    completada: datos.completada === true,
    ultimaBatalla,
    simbolos: leerSimbolos(datos.simbolos),
    historial
  }
}

export function guardar(almacen: Almacen | null, datos: Guardado): void {
  if (!almacen) return
  try {
    almacen.setItem(CLAVE, JSON.stringify(datos))
  } catch {
    // El juego sigue en memoria; el mapa avisa por su cuenta.
  }
}

export function borrar(almacen: Almacen | null): void {
  if (!almacen) return
  try {
    almacen.removeItem(CLAVE)
  } catch {
    // Sin almacenamiento no hay nada que borrar.
  }
}
