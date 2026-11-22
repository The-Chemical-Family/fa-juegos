import type {
  ClaveFrase,
  Efecto,
  ErrorContenido,
  Opcion,
  Pregunta,
  Reflexion,
  Tema,
  Textos,
  Villano
} from './tipos'

const TEMAS: readonly Tema[] = ['casa', 'zanahoria', 'hospital', 'moneda']
const EFECTOS: readonly Efecto[] = [2, 1, 0, -1, -2]
const CLAVES_FRASE: readonly ClaveFrase[] = [
  'victoria',
  'perfect',
  'derrota',
  'empateConRespuestas',
  'empateSinRespuestas'
]

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function esTexto(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.trim().length > 0
}

function esTema(valor: unknown): valor is Tema {
  return typeof valor === 'string' && (TEMAS as readonly string[]).includes(valor)
}

function esEfecto(valor: unknown): valor is Efecto {
  return typeof valor === 'number' && (EFECTOS as readonly number[]).includes(valor)
}

function leerOpcion(crudo: unknown, id: string, indice: number, errores: ErrorContenido[]): Opcion | null {
  const campo = `opciones[${indice}]`
  if (!esObjeto(crudo)) {
    errores.push({ id, campo, mensaje: 'debe ser un objeto con texto y efecto' })
    return null
  }
  let ok = true
  if (!esTexto(crudo.texto)) {
    errores.push({ id, campo: `${campo}.texto`, mensaje: 'texto vacío' })
    ok = false
  }
  if (!esEfecto(crudo.efecto)) {
    errores.push({ id, campo: `${campo}.efecto`, mensaje: 'efecto debe ser 2, 1, 0, -1 o -2' })
    ok = false
  }
  if (!ok) return null
  return { texto: crudo.texto as string, efecto: crudo.efecto as Efecto }
}

function leerReflexion(crudo: unknown, id: string, errores: ErrorContenido[]): Reflexion | null {
  if (!esObjeto(crudo)) {
    errores.push({ id, campo: 'reflexion', mensaje: 'debe ser un objeto con propuesta y pregunta' })
    return null
  }
  let ok = true
  if (!esTexto(crudo.propuesta)) {
    errores.push({ id, campo: 'reflexion.propuesta', mensaje: 'propuesta vacía' })
    ok = false
  }
  if (!esTexto(crudo.pregunta)) {
    errores.push({ id, campo: 'reflexion.pregunta', mensaje: 'pregunta vacía' })
    ok = false
  }
  if (!ok) return null
  return { propuesta: crudo.propuesta as string, pregunta: crudo.pregunta as string }
}

function leerPregunta(
  crudo: unknown,
  indice: number,
  vistos: Set<string>,
  errores: ErrorContenido[]
): Pregunta | null {
  const id = esObjeto(crudo) && esTexto(crudo.id) ? (crudo.id as string) : `<índice ${indice}>`

  if (!esObjeto(crudo)) {
    errores.push({ id, campo: 'raíz', mensaje: 'la entrada debe ser un objeto' })
    return null
  }

  const antes = errores.length
  if (!esTexto(crudo.id)) {
    errores.push({ id, campo: 'id', mensaje: 'identificador vacío o ausente' })
  } else if (vistos.has(crudo.id as string)) {
    errores.push({ id, campo: 'id', mensaje: 'identificador repetido' })
  }

  const temas: Tema[] = []
  if (!Array.isArray(crudo.temas) || crudo.temas.length < 1 || crudo.temas.length > 2) {
    errores.push({ id, campo: 'temas', mensaje: 'debe tener uno o dos temas' })
  } else {
    for (const tema of crudo.temas) {
      if (!esTema(tema)) {
        errores.push({ id, campo: 'temas', mensaje: `tema desconocido: ${String(tema)}` })
      } else if (!temas.includes(tema)) {
        temas.push(tema)
      }
    }
  }

  const comodin = crudo.comodin === true
  if (comodin && !temas.includes('moneda')) {
    errores.push({ id, campo: 'comodin', mensaje: 'un comodín debe incluir moneda entre sus temas' })
  }

  // `situacion` vacía se trata como ausente, no como error.
  const situacion = esTexto(crudo.situacion) ? (crudo.situacion as string) : undefined

  if (!esTexto(crudo.enunciado)) {
    errores.push({ id, campo: 'enunciado', mensaje: 'enunciado vacío' })
  }

  const opciones: Opcion[] = []
  if (!Array.isArray(crudo.opciones) || crudo.opciones.length !== 5) {
    errores.push({ id, campo: 'opciones', mensaje: 'debe haber exactamente cinco opciones' })
  } else {
    crudo.opciones.forEach((opcion, i) => {
      const leida = leerOpcion(opcion, id, i, errores)
      if (leida) opciones.push(leida)
    })
  }

  if (opciones.length === 5) {
    const ordenados = opciones.map((o) => o.efecto).sort((a, b) => b - a)
    if (ordenados.join(',') !== EFECTOS.join(',')) {
      errores.push({
        id,
        campo: 'opciones',
        mensaje: `los efectos deben ser 2, 1, 0, -1 y -2; son ${ordenados.join(', ')}`
      })
    }
  }

  const reflexion = leerReflexion(crudo.reflexion, id, errores)

  if (errores.length > antes) {
    return null
  }

  if (esTexto(crudo.id)) vistos.add(crudo.id as string)

  const pregunta: Pregunta = {
    id: crudo.id as string,
    temas,
    comodin,
    enunciado: crudo.enunciado as string,
    opciones,
    reflexion: reflexion as Reflexion
  }
  if (situacion) pregunta.situacion = situacion
  return pregunta
}

export interface ResultadoValidacionPreguntas {
  preguntas: Pregunta[]
  errores: ErrorContenido[]
}

export function validarPreguntas(datos: unknown): ResultadoValidacionPreguntas {
  const errores: ErrorContenido[] = []
  const preguntas: Pregunta[] = []

  if (!Array.isArray(datos)) {
    return {
      preguntas,
      errores: [{ id: '<archivo>', campo: 'raíz', mensaje: 'el archivo debe ser un arreglo de preguntas' }]
    }
  }

  const vistos = new Set<string>()
  datos.forEach((crudo, indice) => {
    const pregunta = leerPregunta(crudo, indice, vistos, errores)
    if (pregunta) preguntas.push(pregunta)
  })

  return { preguntas, errores }
}

function leerVillano(crudo: unknown, indice: number, errores: ErrorContenido[]): Villano | null {
  if (!esObjeto(crudo)) {
    errores.push({ id: '<textos>', campo: `villanos[${indice}]`, mensaje: 'debe ser un objeto' })
    return null
  }
  const campo = `villanos[${indice}]`
  let ok = true
  if (crudo.id !== indice) {
    errores.push({ id: '<textos>', campo: `${campo}.id`, mensaje: `debe ser ${indice}` })
    ok = false
  }
  for (const clave of ['nombre', 'emoji', 'textoIntro'] as const) {
    if (!esTexto(crudo[clave])) {
      errores.push({ id: '<textos>', campo: `${campo}.${clave}`, mensaje: 'vacío' })
      ok = false
    }
  }
  if (!ok) return null
  return {
    id: indice as 0 | 1 | 2,
    nombre: crudo.nombre as string,
    emoji: crudo.emoji as string,
    textoIntro: crudo.textoIntro as string
  }
}

export interface ResultadoValidacionTextos {
  textos: Textos | null
  errores: ErrorContenido[]
}

export function validarTextos(datos: unknown): ResultadoValidacionTextos {
  const errores: ErrorContenido[] = []

  if (!esObjeto(datos)) {
    return { textos: null, errores: [{ id: '<textos>', campo: 'raíz', mensaje: 'el archivo debe ser un objeto' }] }
  }

  for (const clave of ['regla', 'mision', 'credito', 'fuente', 'fuentePreguntas'] as const) {
    if (!esTexto(datos[clave])) {
      errores.push({ id: '<textos>', campo: clave, mensaje: 'vacío' })
    }
  }

  const villanos: Villano[] = []
  if (!Array.isArray(datos.villanos) || datos.villanos.length !== 3) {
    errores.push({ id: '<textos>', campo: 'villanos', mensaje: 'debe haber exactamente tres villanos' })
  } else {
    datos.villanos.forEach((crudo, i) => {
      const villano = leerVillano(crudo, i, errores)
      if (villano) villanos.push(villano)
    })
  }

  const frases = {} as Record<ClaveFrase, string>
  const crudoFrases = datos.frases
  if (!esObjeto(crudoFrases)) {
    errores.push({ id: '<textos>', campo: 'frases', mensaje: 'debe ser un objeto con las cinco frases' })
  } else {
    for (const clave of CLAVES_FRASE) {
      if (!esTexto(crudoFrases[clave])) {
        errores.push({ id: '<textos>', campo: `frases.${clave}`, mensaje: 'vacía o ausente' })
      } else {
        frases[clave] = crudoFrases[clave] as string
      }
    }
  }

  if (errores.length > 0) {
    return { textos: null, errores }
  }

  return {
    textos: {
      regla: datos.regla as string,
      mision: datos.mision as string,
      villanos,
      frases,
      credito: datos.credito as string,
      fuente: datos.fuente as string,
      fuentePreguntas: datos.fuentePreguntas as string
    },
    errores
  }
}
