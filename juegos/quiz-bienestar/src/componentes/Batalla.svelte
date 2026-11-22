<script lang="ts">
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

  function elegir(indiceVisible: number): void {
    if (bloqueado) return
    bloqueado = true
    alResponder(indiceVisible)
  }
</script>

<section class="batalla">
  <header class="duelo">
    <img class="retrato" src={retratoDeVillano(villano.id)} alt="" />
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

  <div class="opciones">
    {#each batalla.ordenOpciones as indiceOriginal, indiceVisible (indiceVisible)}
      <button
        class="opcion"
        disabled={bloqueado}
        onclick={() => elegir(indiceVisible)}
      >
        {batalla.pregunta.opciones[indiceOriginal].texto}
      </button>
    {/each}
  </div>
</section>
