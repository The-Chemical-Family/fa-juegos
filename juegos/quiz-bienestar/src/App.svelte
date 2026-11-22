<script lang="ts">
  import {
    cerrarBatalla,
    empezarPartida,
    entrarBatalla,
    mensajeDePartida,
    partida,
    reiniciar,
    responder,
    textosDeLaPartida,
    verFinal,
    volverAlMapa
  } from './lib/estado'
  import Batalla from './componentes/Batalla.svelte'
  import Final from './componentes/Final.svelte'
  import Intro from './componentes/Intro.svelte'
  import Mapa from './componentes/Mapa.svelte'
  import Resultado from './componentes/Resultado.svelte'

  const textos = textosDeLaPartida()

  // Batalla y resultado necesitan datos que pueden faltar; si faltan, se cae al
  // mapa, que es la regla de entrada del documento. Se resuelve una vez aquí
  // para no repetir el bloque del mapa en la plantilla.
  const pantalla = $derived.by(() => {
    const actual = $partida.pantalla
    if (actual === 'batalla' && (!$partida.batalla || !textos?.villanos[$partida.villanoActivo])) {
      return 'mapa'
    }
    if (actual === 'resultado' && !$partida.batalla?.resultado) return 'mapa'
    return actual
  })

  const villanoActual = $derived(textos?.villanos[$partida.villanoActivo] ?? null)

  // En la victoria el índice ya ha avanzado al siguiente villano; en la derrota
  // o el empate se queda donde estaba. Así el resultado enseña a quien se ha
  // peleado, no a quien viene después.
  const villanoDeLaBatalla = $derived.by(() => {
    const lista = textos?.villanos
    if (!lista) return null
    const gano = $partida.ultimaBatalla === 'victoria' || $partida.ultimaBatalla === 'perfect'
    return lista[gano ? $partida.villanoActivo - 1 : $partida.villanoActivo] ?? null
  })

  const desbloqueado = $derived.by(() => {
    const gano = $partida.ultimaBatalla === 'victoria' || $partida.ultimaBatalla === 'perfect'
    if (!gano || $partida.villanoActivo >= (textos?.villanos.length ?? 0)) return null
    return villanoActual?.nombre ?? null
  })
</script>

{#if textos === null}
  <main class="error">
    <h1>Falta el contenido</h1>
    <p>No se han cargado los textos del juego.</p>
  </main>
{:else if pantalla === 'intro'}
  <Intro {textos} alEmpezar={empezarPartida} />
{:else if pantalla === 'mapa'}
  <Mapa
    simbolos={$partida.simbolos}
    {textos}
    villanoActivo={$partida.villanoActivo}
    ultimaBatalla={$partida.ultimaBatalla}
    almacenamientoDisponible={$partida.almacenamientoDisponible}
    alEntrar={entrarBatalla}
  />
{:else if pantalla === 'batalla' && $partida.batalla && villanoActual}
  <Batalla
    batalla={$partida.batalla}
    villano={villanoActual}
    alResponder={responder}
    alCerrarPorTiempo={() => cerrarBatalla('tiempo')}
  />
{:else if pantalla === 'resultado' && $partida.batalla?.resultado}
  <Resultado
    mensaje={mensajeDePartida($partida)}
    villano={villanoDeLaBatalla}
    {desbloqueado}
    esFinal={$partida.villanoActivo >= textos.villanos.length}
    alVolver={volverAlMapa}
    alVerFinal={verFinal}
  />
{:else if pantalla === 'final'}
  <Final {textos} alReiniciar={reiniciar} />
{/if}
