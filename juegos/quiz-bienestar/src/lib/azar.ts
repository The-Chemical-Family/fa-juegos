export type Generador = () => number

/** Fisher-Yates con generador inyectado, para que las pruebas sean deterministas. */
export function mezclar<T>(lista: readonly T[], rng: Generador): T[] {
  const copia = lista.slice()
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    const temporal = copia[i]
    copia[i] = copia[j]
    copia[j] = temporal
  }
  return copia
}

/** Generador reproducible, solo para pruebas. */
export function generadorFijo(semilla = 1): Generador {
  let estado = semilla >>> 0
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0
    return estado / 0x100000000
  }
}
