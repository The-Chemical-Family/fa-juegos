<script lang="ts">
  import type { Textos } from '../lib/tipos'

  let { textos, alEmpezar }: { textos: Textos; alEmpezar: () => void } = $props()
</script>

<main class="pantalla intro">
  <h1>Juego de preguntas y bienestar</h1>
  <p class="mision">{textos.mision}</p>

  <ul class="villanos">
    {#each textos.villanos as villano (villano.id)}
      <li>
        <span aria-hidden="true">{villano.emoji}</span>
        <strong> {villano.nombre}.</strong>
        {villano.textoIntro}
      </li>
    {/each}
  </ul>

  <p class="regla">{textos.regla}</p>

  <button onclick={alEmpezar}>Empezar</button>
</main>
