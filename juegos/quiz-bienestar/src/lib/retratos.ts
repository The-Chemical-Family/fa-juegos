import type { Villano } from './tipos'

// Los retratos viven en static/villanos y se sirven tal cual; juego.json los
// declara en "assets" para que la verificación compruebe que llegan a dist/.
const RETRATOS = ['el_rey_del_ladrillo', 'el_empresario_buitre', 'la_presidenta_del_miedo'] as const

export function retratoDeVillano(id: Villano['id']): string {
  return `${import.meta.env.BASE_URL}villanos/${RETRATOS[id]}.gif`
}
