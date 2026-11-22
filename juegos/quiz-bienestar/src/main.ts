import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import PantallaError from './componentes/PantallaError.svelte'
import preguntasCrudas from './lib/contenido/preguntas.json'
import textosCrudos from './lib/contenido/textos.json'
import { iniciar } from './lib/estado'
import type { ErrorContenido } from './lib/tipos'
import { validarPreguntas, validarTextos } from './lib/validar'

const preguntas = validarPreguntas(preguntasCrudas)
const textos = validarTextos(textosCrudos)

const errores: ErrorContenido[] = [...preguntas.errores, ...textos.errores]

const destino = document.getElementById('app')
if (!destino) throw new Error('falta el elemento #app en index.html')

if (textos.textos && preguntas.preguntas.length > 0) {
  if (errores.length > 0) {
    console.warn(`Se descartaron ${errores.length} entradas de contenido inválidas.`, errores)
  }
  iniciar({ preguntas: preguntas.preguntas, textos: textos.textos })
  mount(App, { target: destino })
} else {
  if (errores.length === 0) {
    errores.push({
      id: '<contenido>',
      campo: 'preguntas',
      mensaje: 'no queda ninguna pregunta válida para jugar'
    })
  }
  mount(PantallaError, { target: destino, props: { errores } })
}
