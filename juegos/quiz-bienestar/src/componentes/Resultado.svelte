<script lang="ts">
  import type { Mensaje } from '../lib/reglas'

  let {
    mensaje,
    desbloqueado,
    esFinal,
    alVolver,
    alVerFinal
  }: {
    mensaje: Mensaje | null
    desbloqueado: string | null
    esFinal: boolean
    alVolver: () => void
    alVerFinal: () => void
  } = $props()
</script>

<main class="pantalla resultado">
  <h1>Resultado de la batalla</h1>

  <div class="mensaje" aria-live="polite">
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

  {#if esFinal}
    <button onclick={alVerFinal}>Ver el final</button>
  {:else}
    <button onclick={alVolver}>Volver al mapa</button>
  {/if}
</main>
