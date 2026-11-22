export const duracionBatallaMs = 120_000
export const energiaInicial = 5
export const escalaMinimo = 0
export const escalaMaximo = 8
export const escalaInicial = 4
export const cambioPerfect = 4
export const cambioVictoria = 2
export const cambioDerrota = -2
export const maxComodinesPorBatalla = 1

export const bandasEtiqueta = [
  { hasta: 1, etiqueta: 'muy deteriorado' },
  { hasta: 3, etiqueta: 'deteriorado' },
  { hasta: 4, etiqueta: 'sin cambios' },
  { hasta: 6, etiqueta: 'mejorado' },
  { hasta: 8, etiqueta: 'muy mejorado' }
] as const

export const sonidos = {
  acierto: '',
  neutro: '',
  fallo: '',
  victoria: ''
}

// El juego se sirve desde /quiz-bienestar/ del sitio contenedor.
export const sitioUrl = 'https://juegoamplista.es'

export const videoFinal = `${import.meta.env.BASE_URL}video/video_meme.mp4`

function indiceBanda(valor: number): number {
  const indice = bandasEtiqueta.findIndex((b) => valor <= b.hasta)
  return indice === -1 ? bandasEtiqueta.length - 1 : indice
}

export function etiquetaDeValor(valor: number): string {
  return bandasEtiqueta[indiceBanda(valor)].etiqueta
}

// Una sola banda por tramo: el símbolo se difumina más cuanto peor es el
// valor, con exactamente los mismos cortes que la etiqueta de texto.
export function nivelDesenfoque(valor: number): number {
  return bandasEtiqueta.length - 1 - indiceBanda(valor)
}
