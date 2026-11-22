import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { validarPreguntas, validarTextos } from '../src/lib/validar'
import type { ErrorContenido } from '../src/lib/tipos'

const raiz = resolve(import.meta.dirname, '..')

function leerJson(ruta: string): unknown {
  try {
    return JSON.parse(readFileSync(resolve(raiz, ruta), 'utf8'))
  } catch (error) {
    console.error(`No se pudo leer ${ruta}: ${(error as Error).message}`)
    process.exit(1)
  }
}

const preguntas = validarPreguntas(leerJson('src/lib/contenido/preguntas.json'))
const textos = validarTextos(leerJson('src/lib/contenido/textos.json'))

const errores: ErrorContenido[] = [...preguntas.errores, ...textos.errores]

if (errores.length > 0) {
  console.error(`Contenido inválido: ${errores.length} ${errores.length === 1 ? 'error' : 'errores'}`)
  for (const error of errores) {
    console.error(`  ${error.id} · ${error.campo}: ${error.mensaje}`)
  }
  process.exit(1)
}

console.log(
  `Contenido válido: ${preguntas.preguntas.length} preguntas y ${textos.textos?.villanos.length ?? 0} villanos.`
)
