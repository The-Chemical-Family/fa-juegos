<script lang="ts">
  import { retratoDeVillano } from '../lib/retratos'
  import type { Textos } from '../lib/tipos'

  let { textos, alEmpezar }: { textos: Textos; alEmpezar: () => void } = $props()
</script>

<main class="intro">
  <header>
    <h1>Fight los malos</h1>
    <p class="mision">{textos.mision}</p>
  </header>

  <ul class="villanos">
    {#each textos.villanos as villano (villano.id)}
      <li>
        <img class="retrato" src={retratoDeVillano(villano.id)} alt="" />
        <strong class="nombre">{villano.nombre}</strong>
      </li>
    {/each}
  </ul>

  <p class="regla">{textos.regla}</p>

  <button class="flecha empezar" onclick={alEmpezar}>Empezar</button>
</main>
