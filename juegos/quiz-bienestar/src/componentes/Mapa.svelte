<script lang="ts">
  import { etiquetaDeValor } from '../lib/config'
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

<main class="pantalla mapa">
  <h1>El mapa</h1>

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

  <div class="camino" aria-hidden="true">
    <span class="tramo"></span>
    <span class="tramo"></span>
    <span class="oasis"><span class="copa"></span></span>
  </div>

  <section class="villanos" aria-label="Villanos">
    {#each textos.villanos as villano (villano.id)}
      {@const estado = estadoDe(villano.id)}
      <div class="villano {estado}">
        <span class="emoji" aria-hidden="true">{villano.emoji}</span>
        <span class="datos">
          <strong>{villano.nombre}</strong>
          <span class="estado">{TEXTO_ESTADO[estado]}</span>
        </span>
        {#if estado === 'activo'}
          <button onclick={alEntrar} aria-label="{etiquetaBoton} contra {villano.nombre}">
            {etiquetaBoton}
          </button>
        {/if}
      </div>
    {/each}
  </section>
</main>
