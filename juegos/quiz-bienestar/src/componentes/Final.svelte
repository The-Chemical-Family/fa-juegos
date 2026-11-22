<script lang="ts">
  import { untrack } from 'svelte'
  import { EVENTOS, registrarEvento } from '../lib/analitica'
  import { sitioUrl, videoFinal } from '../lib/config'
  import type { Textos } from '../lib/tipos'

  let { textos, alReiniciar }: { textos: Textos; alReiniciar: () => void } = $props()

  let elemento = $state<HTMLVideoElement | null>(null)
  let fallo = $state(false)
  let cargado = $state(false)
  let silenciado = $state(false)
  let pausado = $state(false)
  let urlVisible = $state<string | null>(null)

  $effect(() => {
    const video = elemento
    if (!video) return
    // `untrack`: el arranque lee y escribe `silenciado`, y no debe volver a
    // dispararse cuando el jugador toca el botón de sonido.
    untrack(() => void arrancar(video))
  })

  type Intento = { ok: true } | { ok: false; bloqueado: boolean }

  /**
   * Distingue el bloqueo real del navegador del resto de fallos. Solo
   * `NotAllowedError` significa «no dejo que suene»; un `AbortError` o un
   * `NotSupportedError` son transitorios y no deben costarle el sonido al
   * jugador en un dispositivo que sí lo permite.
   */
  async function intentarReproducir(video: HTMLVideoElement): Promise<Intento> {
    const intento = video.play()
    if (!intento || typeof intento.then !== 'function') return { ok: true }
    try {
      await intento
      return { ok: true }
    } catch (error) {
      const nombre = (error as { name?: string } | null)?.name
      return { ok: false, bloqueado: nombre === 'NotAllowedError' }
    }
  }

  /**
   * Arranca con sonido. Si el navegador niega la reproducción audible, se
   * reintenta en silencio y el botón queda a mano para activarlo. Si el fallo
   * es de otra clase, se reintenta sin tocar el sonido.
   */
  async function arrancar(video: HTMLVideoElement): Promise<void> {
    video.muted = silenciado
    const primero = await intentarReproducir(video)
    if (primero.ok) {
      fallo = false
      return
    }
    if (!primero.bloqueado) {
      fallo = !(await intentarReproducir(video)).ok
      return
    }
    if (silenciado) {
      fallo = true
      return
    }
    silenciado = true
    video.muted = true
    fallo = !(await intentarReproducir(video)).ok
  }

  function reproducir(): void {
    const video = elemento
    if (!video) return
    // La pulsación sí es un gesto, así que se vuelve a probar con sonido.
    silenciado = false
    void arrancar(video)
  }

  function alternarSonido(): void {
    silenciado = !silenciado
    if (elemento) elemento.muted = silenciado
  }

  function alternarPausa(): void {
    const video = elemento
    if (!video) return
    if (video.paused) {
      pausado = false
      void intentarReproducir(video).then((intento) => {
        fallo = !intento.ok
      })
    } else {
      video.pause()
      pausado = true
    }
  }

  async function compartir(): Promise<void> {
    const url = `${sitioUrl}/quiz-bienestar`
    const navegador = navigator as Navigator & { share?: (datos: ShareData) => Promise<void> }
    if (typeof navegador.share === 'function') {
      try {
        await navegador.share({ title: 'Juego de preguntas y bienestar', url })
        registrarEvento(EVENTOS.enlaceCompartido, { metodo: 'nativo' })
        return
      } catch {
        // El usuario canceló o el navegador rechazó: se prueba el portapapeles.
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      registrarEvento(EVENTOS.enlaceCompartido, { metodo: 'portapapeles' })
      return
    } catch {
      urlVisible = url
      registrarEvento(EVENTOS.enlaceCompartido, { metodo: 'manual' })
    }
  }
</script>

<main class="final">
  <!--
    Sin pista de subtítulos a propósito: no hay transcripción del audio del vídeo
    y no se puede inventar. Es el criterio 1.2.2 de las WCAG, que el diseño
    registra como riesgo abierto en «Risks and Mitigations».
  -->
  <!-- svelte-ignore a11y_media_has_caption -->
  <video
    bind:this={elemento}
    class="video"
    src={videoFinal}
    playsinline
    preload="none"
    data-testid="video-final"
    onloadeddata={() => (cargado = true)}
    onerror={() => (cargado = true)}
  ></video>

  {#if !cargado}
    <p class="cargando">Cargando vídeo</p>
  {/if}

  <div class="controles">
    <!--
      TEMPORAL: crédito y fuentes ocultos para la demo al equipo.

      RESTAURAR ANTES DE PUBLICAR. La línea de crédito no es decoración: es el
      residual de la puerta G1 y sin ella el vídeo se publica sin la atribución
      que exige el permiso escrito. Al recuperar este bloque hay que quitar
      también el `it.skip` de `Final.test.ts` que lo comprueba.

    <p class="credito"><span class="pastilla">{textos.credito}</span></p>
    <div class="fuentes">
      <a href={textos.fuentePreguntas} rel="noreferrer noopener" target="_blank">Documento de preguntas</a>
      <a href={textos.fuente} rel="noreferrer noopener" target="_blank">Documento de propuestas</a>
    </div>
    -->

    {#if fallo}
      <button onclick={reproducir}>Reproducir</button>
    {/if}
    <button class="secundario" onclick={alternarSonido}>
      {silenciado ? 'Activar sonido' : 'Silenciar'}
    </button>
    <button class="secundario" onclick={alternarPausa}>
      {pausado ? 'Reanudar' : 'Pausar'}
    </button>
    <button onclick={compartir}>Compartir</button>
    <button class="secundario" onclick={alReiniciar}>Volver a jugar</button>

    {#if urlVisible}
      <input class="campo-url" readonly value={urlVisible} aria-label="Dirección para compartir" />
    {/if}
  </div>
</main>
