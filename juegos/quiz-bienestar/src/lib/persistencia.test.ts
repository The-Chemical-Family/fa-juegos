// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { CLAVE, cargar, guardar, borrar, almacenamientoDisponible, type Almacen } from './persistencia'
import type { Guardado } from './tipos'

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

const TODOS = new Set(['a', 'b', 'c'])

const VALIDO: Guardado = {
  version: 1,
  villanoActivo: 2,
  completada: false,
  ultimaBatalla: 'victoria',
  simbolos: { casa: 6, zanahoria: 3, hospital: 4, moneda: 8 },
  historial: ['a', 'b']
}

describe('persistencia', () => {
  it('guarda y recupera el progreso', () => {
    const almacen = new AlmacenFalso()
    guardar(almacen, VALIDO)
    expect(cargar(almacen, TODOS)).toEqual(VALIDO)
  })

  it('sin datos guardados devuelve null', () => {
    expect(cargar(new AlmacenFalso(), TODOS)).toBeNull()
  })

  it('una versión distinta descarta el progreso', () => {
    const almacen = new AlmacenFalso()
    almacen.setItem(CLAVE, JSON.stringify({ ...VALIDO, version: 99 }))
    expect(cargar(almacen, TODOS)).toBeNull()
  })

  it('un JSON corrupto descarta sin romper', () => {
    const almacen = new AlmacenFalso()
    almacen.setItem(CLAVE, '{ esto no es json')
    expect(() => cargar(almacen, TODOS)).not.toThrow()
    expect(cargar(almacen, TODOS)).toBeNull()
  })

  it('filtra del historial los identificadores que ya no existen', () => {
    const almacen = new AlmacenFalso()
    almacen.setItem(CLAVE, JSON.stringify({ ...VALIDO, historial: ['a', 'fantasma', 42] }))
    expect(cargar(almacen, TODOS)?.historial).toEqual(['a'])
  })

  it('limita y corrige campos manipulados', () => {
    const almacen = new AlmacenFalso()
    almacen.setItem(
      CLAVE,
      JSON.stringify({
        version: 1,
        villanoActivo: 99,
        completada: 'sí',
        ultimaBatalla: 'inventado',
        simbolos: { casa: -5, zanahoria: 42, hospital: null, moneda: 3.7 },
        historial: 'no es un arreglo'
      })
    )
    const cargado = cargar(almacen, TODOS)
    expect(cargado).not.toBeNull()
    expect(cargado?.villanoActivo).toBe(3)
    expect(cargado?.completada).toBe(false)
    expect(cargado?.ultimaBatalla).toBeNull()
    expect(cargado?.simbolos).toEqual({ casa: 0, zanahoria: 8, hospital: 4, moneda: 3 })
    expect(cargado?.historial).toEqual([])
  })

  it('borra la clave', () => {
    const almacen = new AlmacenFalso()
    guardar(almacen, VALIDO)
    borrar(almacen)
    expect(cargar(almacen, TODOS)).toBeNull()
  })

  it('un almacenamiento que lanza no rompe ni impide jugar', () => {
    const almacenQueLanza: Almacen = {
      getItem() {
        throw new Error('sin almacenamiento')
      },
      setItem() {
        throw new Error('sin almacenamiento')
      },
      removeItem() {
        throw new Error('sin almacenamiento')
      }
    }
    expect(() => cargar(almacenQueLanza, TODOS)).not.toThrow()
    expect(cargar(almacenQueLanza, TODOS)).toBeNull()
    expect(() => guardar(almacenQueLanza, VALIDO)).not.toThrow()
    expect(() => borrar(almacenQueLanza)).not.toThrow()
  })

  it('sin almacenamiento la bandera queda desactivada', () => {
    expect(almacenamientoDisponible(null)).toBe(false)
    expect(almacenamientoDisponible(new AlmacenFalso())).toBe(true)
  })
})
