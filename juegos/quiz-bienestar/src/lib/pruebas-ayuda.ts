import type { Efecto, ErrorContenido, Opcion, Pregunta, Reflexion, Tema, Textos } from './tipos'

export function preguntaValida(extra: Partial<Pregunta> = {}): Record<string, unknown> {
  const opciones: Opcion[] = [
    { texto: 'A', efecto: 2 },
    { texto: 'B', efecto: 1 },
    { texto: 'C', efecto: 0 },
    { texto: 'D', efecto: -1 },
    { texto: 'E', efecto: -2 }
  ]
  const reflexion: Reflexion = { propuesta: 'una propuesta', pregunta: 'una pregunta' }
  const base: Pregunta = {
    id: 'vivienda-01',
    temas: ['casa'] as Tema[],
    comodin: false,
    situacion: 'una situación',
    enunciado: 'un enunciado',
    opciones,
    reflexion
  }
  return { ...base, ...extra } as unknown as Record<string, unknown>
}

export function conEfectos(efectos: Efecto[]): Opcion[] {
  return efectos.map((efecto, i) => ({ texto: `opción ${i}`, efecto }))
}

export function campos(errores: ErrorContenido[]): string[] {
  return errores.map((e) => e.campo)
}

/** Pregunta tipada, ya validada, para pruebas de reglas y estado. */
export function crearPregunta(id: string, comodin = false, tema: Tema = 'casa'): Pregunta {
  return {
    id,
    temas: [tema],
    comodin,
    enunciado: `enunciado ${id}`,
    opciones: [
      { texto: 'A', efecto: 2 },
      { texto: 'B', efecto: 1 },
      { texto: 'C', efecto: 0 },
      { texto: 'D', efecto: -1 },
      { texto: 'E', efecto: -2 }
    ],
    reflexion: { propuesta: `propuesta ${id}`, pregunta: `pregunta ${id}` }
  }
}

export const textosValidos: Textos = {
  regla: 'Regla del juego',
  mision: 'Misión',
  villanos: [
    { id: 0, nombre: 'Uno', emoji: '🦈', textoIntro: 'uno' },
    { id: 1, nombre: 'Dos', emoji: '🕸️', textoIntro: 'dos' },
    { id: 2, nombre: 'Tres', emoji: '🐌', textoIntro: 'tres' }
  ],
  frases: {
    victoria: '¡Has ganado!',
    perfect: 'PERFECT!',
    derrota: 'Esta vez has perdido.',
    empateConRespuestas: '¡Empate!',
    empateSinRespuestas: 'Aquí no ha pasado nada.'
  },
  credito: 'Crédito',
  fuente: 'https://ejemplo.test',
  fuentePreguntas: 'https://ejemplo.test/preguntas'
}
