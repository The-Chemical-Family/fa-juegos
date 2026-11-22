<script lang="ts">
  import { nivelDesenfoque } from '../lib/config'

  let {
    emoji,
    nombre,
    valor,
    etiqueta
  }: {
    emoji: string
    nombre: string
    valor: number
    etiqueta: string
  } = $props()

  // Cuanto mejor es el estado, más nítido se ve el símbolo: el desenfoque
  // crece cuando el valor baja, no cuando sube.
  const nivel = $derived(nivelDesenfoque(valor))
</script>

<div class="simbolo desenfoque-{nivel}">
  <span class="emoji" aria-hidden="true">{emoji}</span>
  <span class="etiqueta">{nombre}: {etiqueta}</span>
</div>
