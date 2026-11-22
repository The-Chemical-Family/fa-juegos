import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

const destino = document.getElementById('app')
if (!destino) throw new Error('falta el elemento #app en index.html')

mount(App, { target: destino })
