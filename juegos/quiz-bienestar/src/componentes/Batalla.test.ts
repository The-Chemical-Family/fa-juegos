import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { fireEvent } from '@testing-library/svelte'
import Batalla from './Batalla.svelte'
import type { EstadoBatalla, Efecto, Opcion } from '../lib/tipos'

const OPCIONES: Opcion[] = [
  { texto: 'opción de efecto 2', efecto: 2 as Efecto },
  { texto: 'opción de efecto 1', efecto: 1 as Efecto },
  { texto: 'opción de efecto 0', efecto: 0 as Efecto },
  { texto: 'opción de efecto -1', efecto: -1 as Efecto },
  { texto: 'opción de efecto -2', efecto: -2 as Efecto }
]

function crearBatalla(ordenOpciones: number[]): EstadoBatalla {
  return {
    pregunta: {
      id: 'q1',
      temas: ['casa'],
      comodin: false,
      enunciado: 'enunciado de prueba',
      opciones: OPCIONES,
      reflexion: { propuesta: 'p', pregunta: 'q' }
    },
    ordenOpciones,
    respuestas: [],
    energiaJugador: 5,
    energiaVillano: 5,
    limiteMs: Date.now() + 60_000,
    resultado: null
  }
}

const VILLANO = { id: 0 as const, nombre: 'La Especulación', emoji: '🦈', textoIntro: 'intro' }

function props(batalla: EstadoBatalla, alResponder = vi.fn()) {
  return { batalla, villano: VILLANO, alResponder, alCerrarPorTiempo: vi.fn() }
}

describe('Batalla', () => {
  it('la opción de efecto 2 conserva su texto y su efecto aunque cambie de posición', async () => {
    const alResponder = vi.fn()
    render(Batalla, { props: props(crearBatalla([3, 0, 4, 1, 2]), alResponder) })

    await fireEvent.click(screen.getByText('opción de efecto 2'))
    expect(alResponder).toHaveBeenCalledWith(1)
  })

  it('en otra permutación la misma opción sigue siendo la de efecto 2', async () => {
    const alResponder = vi.fn()
    render(Batalla, { props: props(crearBatalla([4, 3, 2, 1, 0]), alResponder) })

    await fireEvent.click(screen.getByText('opción de efecto 2'))
    expect(alResponder).toHaveBeenCalledWith(4)
  })

  it('la segunda pulsación de la misma pregunta no dispara otra respuesta', async () => {
    const alResponder = vi.fn()
    render(Batalla, { props: props(crearBatalla([0, 1, 2, 3, 4]), alResponder) })

    const boton = screen.getByText('opción de efecto 2')
    await fireEvent.click(boton)
    await fireEvent.click(boton)

    expect(alResponder).toHaveBeenCalledTimes(1)
  })

  it('muestra la situación cuando existe y la omite cuando no', () => {
    render(Batalla, { props: props(crearBatalla([0, 1, 2, 3, 4])) })
    expect(screen.queryByText('una situación de prueba')).toBeNull()
  })

  it('las barras llevan su valor en texto y el nombre de quien las tiene', () => {
    render(Batalla, { props: props(crearBatalla([0, 1, 2, 3, 4])) })
    expect(screen.getByText('Tú')).toBeTruthy()
    expect(screen.getByText('La Especulación')).toBeTruthy()
    expect(screen.getAllByText('5/5')).toHaveLength(2)
  })
})

describe('Batalla: anuncio para lectores de pantalla', () => {
  function batallaCon(efecto: Efecto, energiaJugador: number, energiaVillano: number): EstadoBatalla {
    const batalla = crearBatalla([0, 1, 2, 3, 4])
    return {
      ...batalla,
      energiaJugador,
      energiaVillano,
      respuestas: [{ preguntaId: 'q1', temas: ['casa'], efecto }]
    }
  }

  it('anuncia cuánta energía pierde el villano y cuánta le queda', () => {
    render(Batalla, { props: props(batallaCon(2, 5, 3)) })
    expect(screen.getByText('El villano pierde 2 de energía: le quedan 3.')).toBeTruthy()
  })

  it('anuncia la energía que pierde el jugador', () => {
    render(Batalla, { props: props(batallaCon(-2, 3, 5)) })
    expect(screen.getByText('Pierdes 2 de energía: te quedan 3.')).toBeTruthy()
  })

  it('sin respuestas no hay nada que anunciar', () => {
    render(Batalla, { props: props(crearBatalla([0, 1, 2, 3, 4])) })
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe('')
  })

  it('el anuncio vive en una región activa oculta a la vista', () => {
    render(Batalla, { props: props(batallaCon(1, 5, 4)) })
    const region = document.querySelector('.solo-lectores[aria-live="polite"]')
    expect(region).toBeTruthy()
    expect(region?.textContent).toContain('El villano pierde 1 de energía')
  })
})
