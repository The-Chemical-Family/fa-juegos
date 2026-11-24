<script lang="ts">
  import { tick } from 'svelte'
  import { energiaInicial } from '../lib/config'
  import { retratoDeVillano } from '../lib/retratos'
  import type { EstadoBatalla, Villano } from '../lib/tipos'
  import BarraEnergia from './BarraEnergia.svelte'

  let {
    batalla,
    villano,
    alResponder,
    alCerrarPorTiempo
  }: {
    batalla: EstadoBatalla
    villano: Villano
    alResponder: (indiceVisible: number) => void
    alCerrarPorTiempo: () => void
  } = $props()

  let restante = $state(0)
  let bloqueado = $state(false)
  let opcionesEl = $state<HTMLDivElement>()

  $effect(() => {
    batalla.respuestas.length
    bloqueado = false
  })

  $effect(() => {
    const limite = batalla.limiteMs
    const actualizar = () => {
      const ms = limite - Date.now()
      restante = Math.max(0, ms)
      if (ms <= 0) alCerrarPorTiempo()
    }
    actualizar()
    const intervalo = setInterval(actualizar, 250)
    return () => clearInterval(intervalo)
  })

  const segundos = $derived(Math.ceil(restante / 1000))

  // El anuncio sale de la última respuesta, no de comparar energías: así el
  // texto dice cuánta energía se movió, que es lo que el jugador necesita oír.
  const anuncio = $derived.by(() => {
    const ultima = batalla.respuestas.at(-1)
    if (!ultima) return ''
    if (ultima.efecto > 0) {
      return `El villano pierde ${ultima.efecto} de energía: le quedan ${batalla.energiaVillano}.`
    }
    if (ultima.efecto < 0) {
      return `Pierdes ${-ultima.efecto} de energía: te quedan ${batalla.energiaJugador}.`
    }
    return 'La respuesta no cambia ninguna energía.'
  })

  function elegir(indiceVisible: number, boton: HTMLButtonElement): void {
    if (bloqueado) return
    bloqueado = true
    // La lista se vuelve a montar con cada pregunta, así que el botón pulsado
    // desaparece: sin esto, quien navega con teclado perdería el foco. Se
    // devuelve al mismo puesto, que es donde estaba antes de responder.
    const teniaFoco = document.activeElement === boton
    alResponder(indiceVisible)
    if (teniaFoco) {
      tick().then(() => {
        const siguiente = opcionesEl?.children[indiceVisible]
        if (siguiente instanceof HTMLButtonElement) siguiente.focus()
      })
    }
  }
</script>

<section class="batalla">
  <header class="duelo">
    <img class="retrato" src={retratoDeVillano(villano.id)} alt="" style="width: 150px;"/>
    <div class="marcador">
      <div class="barras">
        <BarraEnergia
          valor={batalla.energiaJugador}
          maximo={energiaInicial}
          nombre="Tú"
          bando="jugador"
        />
        <BarraEnergia
          valor={batalla.energiaVillano}
          maximo={energiaInicial}
          nombre={villano.nombre}
          bando="villano"
        />
      </div>
      <p class="reloj" aria-live="off">{segundos} s</p>
    </div>
  </header>

  <p class="solo-lectores" aria-live="polite">{anuncio}</p>

  <div class="globo">
    {#if batalla.pregunta.situacion}
      <p class="situacion">{batalla.pregunta.situacion}</p>
    {/if}
    <p class="enunciado">{batalla.pregunta.enunciado}</p>
  </div>

  <div class="opciones" bind:this={opcionesEl}>
    {#each batalla.ordenOpciones as indiceOriginal, indiceVisible (`${batalla.pregunta.id}-${indiceVisible}`)}
      <button
        class="opcion"
        disabled={bloqueado}
        onclick={(evento) => elegir(indiceVisible, evento.currentTarget)}
      >
        {batalla.pregunta.opciones[indiceOriginal].texto}
      </button>
    {/each}
  </div>
</section>
