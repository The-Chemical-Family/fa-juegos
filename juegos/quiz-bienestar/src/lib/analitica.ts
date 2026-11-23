// Eventos de Google Analytics 4. El snippet de GA se inyecta en el `index.html`
// servido (ver `tools/analitica.mjs`); en desarrollo y en las pruebas no existe
// `gtag`, así que registrar un evento no hace nada.

export type Parametros = Record<string, string | number | boolean>

/**
 * Nombres de los eventos. Están documentados en el README junto con los
 * embudos de GA4, así que cualquier cambio aquí debe actualizar también esa
 * tabla.
 */
export const EVENTOS = {
  partidaIniciada: 'partida_iniciada',
  partidaRetomada: 'partida_retomada',
  batallaIniciada: 'batalla_iniciada',
  respuestaEnviada: 'respuesta_enviada',
  batallaTerminada: 'batalla_terminada',
  partidaCompletada: 'partida_completada',
  mapaAbierto: 'mapa_abierto',
  finalVisto: 'final_visto',
  partidaReiniciada: 'partida_reiniciada'
} as const

type Gtag = (orden: 'event', nombre: string, parametros?: Parametros) => void

function gtagDelNavegador(): Gtag | null {
  const global = globalThis as { gtag?: unknown }
  return typeof global.gtag === 'function' ? (global.gtag as Gtag) : null
}

export function registrarEvento(nombre: string, parametros: Parametros = {}): void {
  gtagDelNavegador()?.('event', nombre, parametros)
}
