import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import { fireEvent } from '@testing-library/svelte'
import Final from './Final.svelte'
import { simularPlayQueFunciona, simularPlayQueRechaza } from '../pruebas/preparacion'
import { textosValidos } from '../lib/pruebas-ayuda'

function esperarPromesas(): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, 0))
}

describe('Final', () => {
  it('si la reproducción automática falla aparece el botón de reproducir', async () => {
    simularPlayQueRechaza()
    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    await esperarPromesas()
    expect(screen.getByText('Reproducir')).toBeTruthy()
  })

  it('con reproducción correcta no aparece el botón de reproducir', async () => {
    simularPlayQueFunciona()
    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    await esperarPromesas()
    expect(screen.queryByText('Reproducir')).toBeNull()
  })

  it('volver a jugar sigue disponible aunque la reproducción falle', async () => {
    simularPlayQueRechaza()
    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    await esperarPromesas()
    expect(screen.queryByText('Compartir')).toBeNull()
    expect(screen.getByText('Volver a jugar')).toBeTruthy()
  })

  it('volver a jugar llama a la acción', async () => {
    simularPlayQueFunciona()
    const alReiniciar = vi.fn()
    render(Final, { props: { textos: textosValidos, alReiniciar } })
    await fireEvent.click(screen.getByText('Volver a jugar'))
    expect(alReiniciar).toHaveBeenCalledTimes(1)
  })

  it('con reproducción correcta arranca con sonido y ofrece silenciarlo', async () => {
    simularPlayQueFunciona()
    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    await esperarPromesas()
    expect(screen.getByText('Silenciar')).toBeTruthy()
    expect(screen.getByText('Pausar')).toBeTruthy()
    expect((screen.getByTestId('video-final') as HTMLVideoElement).muted).toBe(false)
  })

  it('si el navegador bloquea el sonido, reintenta en silencio y deja el botón para activarlo', async () => {
    const original = HTMLMediaElement.prototype.play
    const silenciadosEnCadaIntento: boolean[] = []
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value(this: HTMLMediaElement) {
        silenciadosEnCadaIntento.push(this.muted)
        if (silenciadosEnCadaIntento.length === 1) {
          return Promise.reject(new DOMException('bloqueado', 'NotAllowedError'))
        }
        return Promise.resolve()
      }
    })

    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    await esperarPromesas()
    await esperarPromesas()

    // Primero con sonido, después en silencio.
    expect(silenciadosEnCadaIntento).toEqual([false, true])
    expect(screen.queryByText('Reproducir')).toBeNull()
    expect(screen.getByText('Activar sonido')).toBeTruthy()
    expect((screen.getByTestId('video-final') as HTMLVideoElement).muted).toBe(true)

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value: original
    })
  })

  it('un fallo transitorio no cuesta el sonido: reintenta sin silenciar', async () => {
    const original = HTMLMediaElement.prototype.play
    const silenciadosEnCadaIntento: boolean[] = []
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value(this: HTMLMediaElement) {
        silenciadosEnCadaIntento.push(this.muted)
        if (silenciadosEnCadaIntento.length === 1) {
          return Promise.reject(new DOMException('cortado', 'AbortError'))
        }
        return Promise.resolve()
      }
    })

    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    await esperarPromesas()
    await esperarPromesas()

    // Las dos veces con sonido: un AbortError no es un bloqueo del navegador.
    expect(silenciadosEnCadaIntento).toEqual([false, false])
    expect((screen.getByTestId('video-final') as HTMLVideoElement).muted).toBe(false)
    expect(screen.getByText('Silenciar')).toBeTruthy()

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value: original
    })
  })

  it('el botón de sonido alterna y lo refleja en el elemento', async () => {
    simularPlayQueFunciona()
    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    await esperarPromesas()
    await fireEvent.click(screen.getByText('Silenciar'))
    expect((screen.getByTestId('video-final') as HTMLVideoElement).muted).toBe(true)
    expect(screen.getByText('Activar sonido')).toBeTruthy()
  })

  // TEMPORAL: crédito y fuentes ocultos para la demo. Volver a `it` al
  // restaurar el bloque correspondiente en `Final.svelte`.
  it.skip('muestra el crédito y los dos enlaces a los documentos', () => {
    simularPlayQueFunciona()
    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    expect(screen.getByText(textosValidos.credito)).toBeTruthy()
    expect(screen.getByText('Documento de propuestas').getAttribute('href')).toBe(
      textosValidos.fuente
    )
    expect(screen.getByText('Documento de preguntas').getAttribute('href')).toBe(
      textosValidos.fuentePreguntas
    )
  })

  it('dice «Cargando vídeo» hasta que hay fotograma', async () => {
    simularPlayQueFunciona()
    render(Final, { props: { textos: textosValidos, alReiniciar: vi.fn() } })
    expect(screen.getByText('Cargando vídeo')).toBeTruthy()

    await fireEvent(screen.getByTestId('video-final'), new Event('loadeddata'))
    expect(screen.queryByText('Cargando vídeo')).toBeNull()
  })
})
