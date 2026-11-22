<script lang="ts">
  let {
    valor,
    maximo,
    nombre,
    bando
  }: {
    valor: number
    maximo: number
    nombre: string
    bando: 'jugador' | 'villano'
  } = $props()

  const porcentaje = $derived(maximo > 0 ? Math.round((valor / maximo) * 100) : 0)
</script>

<div class="barra {bando}" role="group" aria-label="{nombre}: {valor} de {maximo}">
  <span class="nombre">{nombre}</span>
  <div class="pista">
    <div class="relleno" style="width: {porcentaje}%"></div>
  </div>
  <span class="valor">{valor}/{maximo}</span>
</div>
