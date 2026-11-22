export type Pantalla = 'intro' | 'mapa' | 'batalla' | 'resultado' | 'final'
export type Tema = 'casa' | 'zanahoria' | 'hospital' | 'moneda'
export type Efecto = -2 | -1 | 0 | 1 | 2
export type Resultado = 'victoria' | 'perfect' | 'derrota' | 'empate'
export type MotivoCierre = 'energia' | 'tiempo'
export type Simbolos = Record<Tema, number>

export interface Opcion {
  texto: string
  efecto: Efecto
}

export interface Reflexion {
  propuesta: string
  pregunta: string
}

export interface Pregunta {
  id: string
  temas: Tema[]
  comodin: boolean
  situacion?: string
  enunciado: string
  opciones: Opcion[]
  reflexion: Reflexion
}

export interface Respuesta {
  preguntaId: string
  temas: Tema[]
  efecto: Efecto
}

export interface ErrorContenido {
  id: string
  campo: string
  mensaje: string
}

export interface Villano {
  id: 0 | 1 | 2
  nombre: string
  emoji: string
  textoIntro: string
}

export type ClaveFrase = 'victoria' | 'perfect' | 'derrota' | 'empateConRespuestas' | 'empateSinRespuestas'

export interface Textos {
  regla: string
  mision: string
  villanos: Villano[]
  frases: Record<ClaveFrase, string>
  credito: string
  fuente: string
  fuentePreguntas: string
}

export interface EstadoBatalla {
  pregunta: Pregunta
  ordenOpciones: number[]
  respuestas: Respuesta[]
  energiaJugador: number
  energiaVillano: number
  limiteMs: number
  resultado: Resultado | null
}

export interface Guardado {
  version: 1
  villanoActivo: number
  completada: boolean
  ultimaBatalla: Resultado | null
  simbolos: Simbolos
  historial: string[]
}

export interface EstadoPartida extends Guardado {
  pantalla: Pantalla
  batalla: EstadoBatalla | null
  almacenamientoDisponible: boolean
}
