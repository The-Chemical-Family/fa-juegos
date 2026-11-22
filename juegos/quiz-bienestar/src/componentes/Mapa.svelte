<script lang="ts">
  import { etiquetaDeValor } from '../lib/config'
  import { retratoDeVillano } from '../lib/retratos'
  import type { Resultado, Simbolos, Textos } from '../lib/tipos'
  import SimboloMapa from './SimboloMapa.svelte'

  let {
    simbolos,
    textos,
    villanoActivo,
    ultimaBatalla,
    almacenamientoDisponible,
    alEntrar
  }: {
    simbolos: Simbolos
    textos: Textos
    villanoActivo: number
    ultimaBatalla: Resultado | null
    almacenamientoDisponible: boolean
    alEntrar: () => void
  } = $props()

  const SIMBOLOS: { tema: keyof Simbolos; emoji: string; nombre: string }[] = [
    { tema: 'casa', emoji: '🏠', nombre: 'Casa' },
    { tema: 'zanahoria', emoji: '🥕', nombre: 'Alimentación' },
    { tema: 'hospital', emoji: '🏥', nombre: 'Sanidad' },
    { tema: 'moneda', emoji: '🪙', nombre: 'Salario' }
  ]

  const etiquetaBoton = $derived(
    ultimaBatalla === 'derrota' || ultimaBatalla === 'empate' ? 'Reintentar' : 'Luchar'
  )

  function estadoDe(id: number): 'derrotado' | 'activo' | 'bloqueado' {
    if (id < villanoActivo) return 'derrotado'
    if (id === villanoActivo) return 'activo'
    return 'bloqueado'
  }

  const TEXTO_ESTADO: Record<'derrotado' | 'activo' | 'bloqueado', string> = {
    derrotado: 'derrotado',
    activo: 'activo',
    bloqueado: 'bloqueado'
  }
</script>

<main class="mapa">
  <header>
    <h1>Fight los malos</h1>
    <p class="subtitulo">El bienestar de la clase trabajadora</p>
  </header>

  {#if !almacenamientoDisponible}
    <p class="aviso" role="status">
      Este navegador no permite guardar el progreso. Puedes jugar, pero se perderá al cerrar.
    </p>
  {/if}

  <section class="simbolos" aria-label="Estado del bienestar">
    {#each SIMBOLOS as simbolo (simbolo.tema)}
      <SimboloMapa
        emoji={simbolo.emoji}
        nombre={simbolo.nombre}
        valor={simbolos[simbolo.tema]}
        etiqueta={etiquetaDeValor(simbolos[simbolo.tema])}
      />
    {/each}
  </section>

  <section class="rivales" aria-label="Villanos">
    {#each textos.villanos as villano (villano.id)}
      {@const estado = estadoDe(villano.id)}
      <div class="rival {estado}">
        <img class="retrato" src={retratoDeVillano(villano.id)} alt="" />
        {#if estado === 'activo'}
          <span class="accion">
            <button
              class="flecha"
              onclick={alEntrar}
              aria-label="{etiquetaBoton} contra {villano.nombre}"
            >
              {etiquetaBoton}
            </button>
          </span>
        {:else}
          <span class="flecha apagada">{TEXTO_ESTADO[estado]}</span>
        {/if}
      </div>
    {/each}
  </section>
</main>
