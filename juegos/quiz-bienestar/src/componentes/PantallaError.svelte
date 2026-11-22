<script lang="ts">
  import type { ErrorContenido } from '../lib/tipos'

  let { errores }: { errores: ErrorContenido[] } = $props()
</script>

<main class="pantalla error">
  <h1>El contenido no es válido</h1>
  <p>El juego no puede empezar hasta corregir estos problemas en los archivos de contenido.</p>
  <ul class="lista-errores">
    {#each errores as error, indice (`${error.id}-${error.campo}-${indice}`)}
      <li>{error.id} · {error.campo}: {error.mensaje}</li>
    {/each}
  </ul>
</main>
