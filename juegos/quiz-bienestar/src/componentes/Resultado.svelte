<script lang="ts">
  import { retratoDeVillano } from '../lib/retratos'
  import type { Mensaje } from '../lib/reglas'
  import type { Villano } from '../lib/tipos'

  let {
    mensaje,
    villano,
    desbloqueado,
    esFinal,
    alVolver,
    alVerFinal
  }: {
    mensaje: Mensaje | null
    villano: Villano | null
    desbloqueado: string | null
    esFinal: boolean
    alVolver: () => void
    alVerFinal: () => void
  } = $props()
</script>

<main class="resultado">
  <h1>Resultado de la batalla</h1>

  <div class="mensaje" aria-live="polite">
    {#if villano}
      <img class="retrato" src={retratoDeVillano(villano.id)} alt="" />
    {/if}
    <p class="frase">{mensaje?.frase ?? ''}</p>
    {#if mensaje?.propuesta}
      <p>{mensaje.propuesta}</p>
    {/if}
    {#if mensaje?.pregunta}
      <p class="situacion">{mensaje.pregunta}</p>
    {/if}
    {#if desbloqueado}
      <p class="solo-lectores">Se ha desbloqueado {desbloqueado}.</p>
    {/if}
  </div>

  <div class="acciones">
    {#if esFinal}
      <button class="flecha" onclick={alVerFinal}>Ver el final</button>
    {:else}
      <button class="flecha" onclick={alVolver}>Volver al mapa</button>
    {/if}
  </div>
</main>
