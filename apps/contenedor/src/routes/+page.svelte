<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import estrella from '#lib/assets/estrella.png';
	import ada from '#lib/assets/ada.png';
	import emilio from '#lib/assets/emilio.png';
	import audioEntrada from '#lib/assets/audio_entrada.mp3';

	let { data }: PageProps = $props();

	// El audio de entrada suena en cada visita salvo que el visitante lo
	// silencie; el botón recuerda esa decisión entre visitas.
	const CLAVE_SILENCIO = 'fa-audio-silenciado';

	let silenciado = $state(false);
	let audio: HTMLAudioElement | null = null;
	let quitarGestos: (() => void) | null = null;

	function leerSilencio(): boolean {
		try {
			return localStorage.getItem(CLAVE_SILENCIO) === '1';
		} catch {
			return false;
		}
	}

	function guardarSilencio(valor: boolean) {
		try {
			if (valor) localStorage.setItem(CLAVE_SILENCIO, '1');
			else localStorage.removeItem(CLAVE_SILENCIO);
		} catch {
			// Sin almacenamiento el botón funciona igual, solo no recuerda.
		}
	}

	function crearAudio(): HTMLAudioElement {
		if (!audio) {
			audio = new Audio(audioEntrada);
			audio.preload = 'auto';
			audio.muted = silenciado;
		}
		return audio;
	}

	// Si el navegador bloquea el autoplay, el audio espera al primer gesto.
	function esperarPrimerGesto() {
		if (quitarGestos) return;

		const alGesto = () => {
			quitarGestos?.();
			quitarGestos = null;
			audio?.play().catch(() => {});
		};

		quitarGestos = () => {
			window.removeEventListener('pointerdown', alGesto);
			window.removeEventListener('keydown', alGesto);
		};

		window.addEventListener('pointerdown', alGesto);
		window.addEventListener('keydown', alGesto);
	}

	function reproducir() {
		if (silenciado) return;
		crearAudio()
			.play()
			.catch(() => esperarPrimerGesto());
	}

	function alternarSilencio() {
		silenciado = !silenciado;
		guardarSilencio(silenciado);

		quitarGestos?.();
		quitarGestos = null;

		if (silenciado) {
			audio?.pause();
			return;
		}

		if (!audio) {
			reproducir();
			return;
		}

		audio.muted = false;
		audio.play().catch(() => {});
	}

	onMount(() => {
		silenciado = leerSilencio();
		if (!silenciado) reproducir();

		return () => {
			quitarGestos?.();
			if (!audio) return;
			audio.pause();
			audio.removeAttribute('src');
			audio.load();
			audio = null;
		};
	});
</script>

<svelte:head>
	<title>Juega FrenteAmplio</title>
	<meta name="description" content="Juegos de campaña del Frente Amplio." />
</svelte:head>

<main>
	<button
		class="sonido"
		type="button"
		data-silenciado={silenciado}
		aria-label={silenciado ? 'Activar el sonido' : 'Silenciar el sonido'}
		title={silenciado ? 'Activar el sonido' : 'Silenciar el sonido'}
		onclick={alternarSilencio}
	>
		{#if silenciado}
			<svg class="sonido__icono" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
				<path class="sonido__cuerpo" d="M3 11.5h6L18 4v24l-9-7.5H3z" />
				<path class="sonido__onda" d="M21.5 11l8 10M29.5 11l-8 10" />
			</svg>
		{:else}
			<svg class="sonido__icono" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
				<path class="sonido__cuerpo" d="M3 11.5h6L18 4v24l-9-7.5H3z" />
				<path class="sonido__onda" d="M22 11.5a6.5 6.5 0 0 1 0 9" />
				<path class="sonido__onda" d="M26.5 7.5a11.5 11.5 0 0 1 0 17" />
			</svg>
		{/if}
	</button>

	<header class="cabecera">
		<img class="logo" src={estrella} alt="Frente Amplio" width="276" height="214" />
	</header>

	<h1 class="banda">Juega FrenteAmplio</h1>

	{#if data.juegos.length === 0}
		<p class="vacio">Todavía no hay juegos publicados.</p>
	{:else}
		<nav class="juegos" aria-label="Juegos">
			{#each data.juegos as juego (juego.slug)}
				<a class="juego" href="/{juego.slug}/">
					<span class="juego__estrella" aria-hidden="true"></span>
					<span class="juego__nombre">{juego.nombre}</span>
				</a>
			{/each}
		</nav>
	{/if}

	<footer class="protagonistas">
		<img class="ada" src={ada} alt="" width="188" height="153" />
		<img class="emilio" src={emilio} alt="" width="220" height="200" />
	</footer>
</main>

<style>
	:global(:root) {
		--negro: #10090c;
		--naranja: #f03c01;
		--verde: #cce876;
		--blanco: #fff;
		--display: 'Anton', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	}

	main {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 100svh;
		overflow: hidden;
		background: var(--negro);
		color: var(--blanco);
	}

	:global(html) {
		background: var(--negro);
	}

	:global(body) {
		margin: 0;
		background: var(--negro);
		color: var(--blanco);
	}

	.cabecera {
		display: flex;
		justify-content: center;
		padding: clamp(1rem, 3.5vh, 3rem) 1rem clamp(0.6rem, 2vh, 1.75rem);
	}

	.sonido {
		position: absolute;
		top: clamp(0.35rem, 1.5vh, 1rem);
		right: clamp(0.35rem, 1.5vw, 1.25rem);
		z-index: 2;
		display: grid;
		place-items: center;
		width: clamp(3.5rem, 4.5vw, 4.5rem);
		height: clamp(3.5rem, 4.5vw, 4.5rem);
		padding: 0;
		background: none;
		border: 0;
		color: var(--verde);
		cursor: pointer;
		transform: rotate(-9deg);
		-webkit-tap-highlight-color: transparent;
		/* Recorte mal impreso: sombra dura desplazada, sin fondo. */
		filter: drop-shadow(0.18em 0.18em 0 var(--naranja));
		transition:
			transform 120ms ease,
			color 120ms ease,
			filter 120ms ease;
	}

	.sonido__icono {
		width: 66%;
		height: 66%;
	}

	.sonido__cuerpo {
		fill: currentColor;
	}

	.sonido__onda {
		fill: none;
		stroke: currentColor;
		stroke-width: 3;
		stroke-linecap: butt;
		stroke-linejoin: miter;
	}

	.sonido[data-silenciado='true'] {
		color: var(--naranja);
		transform: rotate(9deg);
		filter: drop-shadow(0.18em 0.18em 0 var(--verde));
	}

	.sonido:hover {
		transform: rotate(3deg) scale(1.15);
	}

	.sonido[data-silenciado='true']:hover {
		transform: rotate(-3deg) scale(1.15);
	}

	.sonido:active {
		transform: scale(0.9);
	}

	.sonido:focus-visible {
		outline: 3px solid var(--blanco);
		outline-offset: 2px;
		border-radius: 0.5rem;
	}

	.logo {
		display: block;
		width: min(64vw, 32vh, 29rem);
		height: auto;
	}

	.banda {
		margin: 0;
		padding: 0.1em 1rem 0.16em;
		background: var(--verde);
		color: var(--naranja);
		font-family: var(--display);
		font-size: min(8.8vw, 9vh, 4.5rem);
		font-weight: 400;
		line-height: 1;
		letter-spacing: 0.005em;
		text-align: center;
		text-transform: uppercase;
	}

	.juegos {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		align-content: center;
		justify-content: center;
		gap: clamp(0.5rem, 3.5vw, 2.5rem);
		padding: clamp(1rem, 4vh, 3rem) clamp(0.75rem, 4vw, 3rem);
	}

	.juego {
		position: relative;
		display: grid;
		place-items: center;
		width: min(38vw, 24vh, 18rem);
		aspect-ratio: 1.08;
		container-type: inline-size;
		text-decoration: none;
		transition: transform 180ms ease;
		-webkit-tap-highlight-color: transparent;
	}

	.juego__estrella {
		position: absolute;
		inset: 0;
		background: var(--naranja);
		clip-path: polygon(
			50% 21%,
			69.13% 3.81%,
			70.51% 29.49%,
			96.19% 30.87%,
			79% 50%,
			96.19% 69.13%,
			70.51% 70.51%,
			69.13% 96.19%,
			50% 79%,
			30.87% 96.19%,
			29.49% 70.51%,
			3.81% 69.13%,
			21% 50%,
			3.81% 30.87%,
			29.49% 29.49%,
			30.87% 3.81%
		);
		transition: background 180ms ease;
	}

	.juego__nombre {
		position: relative;
		width: 58%;
		color: var(--blanco);
		font-family: var(--display);
		font-size: 13cqw;
		font-weight: 400;
		line-height: 0.94;
		letter-spacing: 0.01em;
		text-align: center;
		text-transform: uppercase;
		hyphens: auto;
		text-wrap: balance;
	}

	.juego:hover {
		transform: scale(1.05);
	}

	.juego:hover .juego__estrella {
		background: #ff5416;
	}

	.juego:active {
		transform: scale(0.98);
	}

	.juego:focus-visible {
		outline: 3px solid var(--verde);
		outline-offset: 6px;
		border-radius: 1rem;
	}

	.vacio {
		flex: 1;
		display: grid;
		place-items: center;
		margin: 0;
		padding: 3rem 1.5rem;
		color: var(--verde);
		font-size: 1.125rem;
		text-align: center;
	}

	.protagonistas {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: clamp(0.75rem, 2vw, 2rem);
		height: min(46vw, 24vh, 26rem);
		padding: 0 clamp(0.5rem, 2vw, 2rem);
		pointer-events: none;
	}

	.protagonistas img {
		display: block;
		height: 100%;
		width: auto;
		max-width: 52vw;
		object-fit: contain;
		object-position: 50% 100%;
	}

	.protagonistas .ada {
		height: 80%;
		max-width: 40vw;
	}

	@media (prefers-reduced-motion: reduce) {
		.juego,
		.juego__estrella {
			transition: none;
		}

		.juego:hover,
		.juego:active {
			transform: none;
		}
	}
</style>
