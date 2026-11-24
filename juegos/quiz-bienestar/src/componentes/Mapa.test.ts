import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { fireEvent } from '@testing-library/svelte'
import Mapa from './Mapa.svelte'
import { textosValidos } from '../lib/pruebas-ayuda'
import type { Resultado, Simbolos } from '../lib/tipos'

const SIMBOLOS: Simbolos = { casa: 6, zanahoria: 3, hospital: 4, moneda: 8 }

function props(
  extra: Partial<{
    villanoActivo: number
    ultimaBatalla: Resultado | null
    almacenamientoDisponible: boolean
    simbolos: Simbolos
  }> = {}
) {
  return {
    simbolos: SIMBOLOS,
    textos: textosValidos,
    villanoActivo: 1,
    ultimaBatalla: null as Resultado | null,
    almacenamientoDisponible: true,
    alEntrar: vi.fn(),
    ...extra
  }
}

describe('Mapa', () => {
  it('solo el villano activo ofrece un control de avance', () => {
    render(Mapa, { props: props() })
    const botones = screen.getAllByRole('button')
    expect(botones).toHaveLength(1)
    expect(botones[0].textContent?.trim()).toBe('Luchar')
  })

  it('el villano bloqueado no es seleccionable y el derrotado tampoco', () => {
    render(Mapa, { props: props({ villanoActivo: 1 }) })
    expect(screen.getByLabelText('Luchar contra Dos')).toBeTruthy()
    expect(screen.queryByLabelText(/Tres/)).toBeNull()
    expect(screen.queryByLabelText(/contra Uno/)).toBeNull()
  })

  it('el estado de cada villano aparece en texto', () => {
    render(Mapa, { props: props({ villanoActivo: 1 }) })
    // Los villanos sin batalla posible dicen su estado en la flecha; el activo,
    // en la etiqueta de la acción.
    expect(screen.getByText('derrotado')).toBeTruthy()
    expect(screen.getByText('bloqueado')).toBeTruthy()
    expect(screen.getByLabelText('Luchar contra Dos')).toBeTruthy()
  })

  it('el botón pasa a Reintentar cuando la última batalla no desbloqueó', () => {
    render(Mapa, { props: props({ ultimaBatalla: 'derrota' }) })
    expect(screen.getByLabelText('Reintentar contra Dos')).toBeTruthy()
  })

  it('también pasa a Reintentar tras un empate', () => {
    render(Mapa, { props: props({ ultimaBatalla: 'empate' }) })
    expect(screen.getByLabelText('Reintentar contra Dos')).toBeTruthy()
  })

  it('pulsar el control entra en la batalla', async () => {
    const alEntrar = vi.fn()
    render(Mapa, { props: { ...props(), alEntrar } })
    await fireEvent.click(screen.getByLabelText('Luchar contra Dos'))
    expect(alEntrar).toHaveBeenCalledTimes(1)
  })

  it('cada símbolo lleva su etiqueta de texto con el estado', () => {
    render(Mapa, { props: props() })
    expect(screen.getByText('Casa: mejorado')).toBeTruthy()
    expect(screen.getByText('Alimentación: deteriorado')).toBeTruthy()
    expect(screen.getByText('Sanidad: sin cambios')).toBeTruthy()
    expect(screen.getByText('Salario: muy mejorado')).toBeTruthy()
  })

  it('avisa cuando el progreso no se puede guardar', () => {
    render(Mapa, { props: props({ almacenamientoDisponible: false }) })
    expect(screen.getByRole('status').textContent).toMatch(/no permite guardar/)
  })
})

describe('Mapa: dirección del desenfoque', () => {
  it('cuanto mejor es el valor, menos se difumina el símbolo', () => {
    render(Mapa, { props: props() })
    const simbolos = document.querySelectorAll('.simbolo')
    const nivelDe = (indice: number) => {
      const clase = [...simbolos[indice].classList].find((c) => c.startsWith('desenfoque-'))
      return clase ? Number(clase.split('-')[1]) : -1
    }
    // casa 6 (mejorado) frente a zanahoria 3 (deteriorado): la mejor, menos difuminada
    expect(nivelDe(0)).toBeLessThan(nivelDe(1))
  })

  it('el valor máximo sale nítido y el mínimo, muy difuminado', () => {
    render(Mapa, {
      props: props({ simbolos: { casa: 8, zanahoria: 0, hospital: 4, moneda: 4 } })
    })
    const simbolos = document.querySelectorAll('.simbolo')
    expect(simbolos[0].classList.contains('desenfoque-0')).toBe(true)
    expect(simbolos[1].classList.contains('desenfoque-4')).toBe(true)
  })

  it('cada tramo de la etiqueta tiene su propio nivel', () => {
    render(Mapa, {
      props: props({ simbolos: { casa: 1, zanahoria: 2, hospital: 4, moneda: 7 } })
    })
    const simbolos = document.querySelectorAll('.simbolo')
    const nivelDe = (indice: number) => {
      const clase = [...simbolos[indice].classList].find((c) => c.startsWith('desenfoque-'))
      return clase ? Number(clase.split('-')[1]) : -1
    }
    // «muy deteriorado» (1), «deteriorado» (2), «sin cambios» (4) y «muy mejorado» (7)
    expect([nivelDe(0), nivelDe(1), nivelDe(2), nivelDe(3)]).toEqual([4, 3, 2, 0])
  })
})

describe('Mapa: retratos de los villanos', () => {
  it('cada villano lleva el retrato dibujado de su ficha', () => {
    render(Mapa, { props: props() })
    const retratos = [...document.querySelectorAll<HTMLImageElement>('.rival .retrato')]
    const base = import.meta.env.BASE_URL
    expect(retratos).toHaveLength(3)
    expect(retratos.map((img) => img.getAttribute('src'))).toEqual([
      `${base}villanos/el_rey_del_ladrillo.gif`,
      `${base}villanos/el_empresario_buitre.gif`,
      `${base}villanos/la_presidenta_del_miedo.gif`
    ])
  })
})
