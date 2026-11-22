<script lang="ts">
	import type { PageProps } from './$types';
	import { alternarSilencio, estaSilenciado } from '../lib/audio-entrada';
	import estrella from '#lib/assets/estrella.png';
	import ada from '#lib/assets/ada.png';
	import emilio from '#lib/assets/emilio.png';
	import sonidoActivado from '#lib/assets/sonido-activado.png';
	import sonidoSilenciado from '#lib/assets/sonido-silenciado.png';

	let { data }: PageProps = $props();

	let silenciado = $state(estaSilenciado());
</script>

<svelte:head>
	<title>Juega FrenteAmplio</title>
	<meta name="description" content="Juegos de campaña del Frente Amplio." />
</svelte:head>

<main>
	<button
		class="sonido"
		type="button"
		aria-label={silenciado ? 'Activar el sonido' : 'Silenciar el sonido'}
		title={silenciado ? 'Activar el sonido' : 'Silenciar el sonido'}
		onclick={() => (silenciado = alternarSilencio())}
	>
		<img
			class="sonido__icono"
			src={silenciado ? sonidoSilenciado : sonidoActivado}
			alt=""
			width={silenciado ? 364 : 411}
			height="351"
		/>
	</button>

	<header class="cabecera">
		<img class="logo" src={estrella} alt="Frente Amplio" width="276" height="214" />
	</header>

	<h1 class="banda">Juega FrenteAmplio</h1>

	{#if data.juegos.length === 0}
		<p class="vacio">Todavía no hay juegos publicados.</p>
	{:else}
		<nav class="juegos" aria-label="Juegos" style="--n: {data.juegos.length}">
			{#each data.juegos as juego (juego.slug)}
				<a class="juego" href="/{juego.slug}/" data-sveltekit-reload>
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
		--display: 'Impact Web', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
	}

	main {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		background: var(--negro);
		color: var(--blanco);
	}

	/* La altura dinámica descuenta las barras del navegador móvil: con `vh` la
	   portada quedaría más alta que la ventana y pediría scroll. */
	@supports (height: 100dvh) {
		main {
			height: 100dvh;
		}
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
		flex: none;
		display: flex;
		justify-content: center;
		padding: clamp(0.4rem, 3.5vh, 3rem) 1rem clamp(0.3rem, 2vh, 1.75rem);
	}

	.sonido {
		position: absolute;
		top: clamp(0.5rem, 2vh, 1.25rem);
		right: clamp(0.5rem, 2vw, 1.5rem);
		z-index: 2;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		padding: 0;
		background: none;
		border: 0;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}

	.sonido__icono {
		display: block;
		height: clamp(1.9rem, 2.4vw, 2.4rem);
		width: auto;
		/* Los originales son negros; en la portada oscura se ven en blanco. */
		filter: invert(1);
		transition: opacity 120ms ease;
	}

	.sonido:hover .sonido__icono {
		opacity: 0.7;
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
		flex: none;
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

	/* La rejilla ocupa todo el alto que sobra entre la cabecera y los
	   protagonistas. El número de columnas se elige por proporción de la
	   ventana y nunca pasa del número de juegos, así que no quedan huecos. */
	.juegos {
		--holgura: clamp(0.4rem, 2.2vh, 2rem);
		--cols: min(var(--n, 1), 2);
		flex: 1 1 0;
		min-height: 0;
		display: grid;
		grid-template-columns: repeat(var(--cols), minmax(0, 1fr));
		grid-auto-rows: minmax(0, 1fr);
		gap: var(--holgura);
		padding: clamp(0.4rem, 2.5vh, 2rem) clamp(0.5rem, 3vw, 2.5rem);
	}

	@media (min-width: 20rem) and (min-aspect-ratio: 1 / 2) {
		.juegos {
			--cols: min(var(--n, 1), 3);
		}
	}

	/* En apaisado caben todos en una sola fila y los luceros salen mayores. */
	@media (min-aspect-ratio: 6 / 5) {
		.juegos {
			--cols: min(var(--n, 1), 6);
		}
	}

	/* El enlace ocupa su celda entera y es la propia celda la que se consulta:
	   `--lado` es el mayor lucero que entra en ella, así que se ajusta al ancho
	   y al alto disponibles sin deformarse ni desbordar. En navegadores sin
	   unidades de contenedor, el lucero ocupa la celda entera, como respaldo. */
	.juego {
		--lado: 100%;
		position: relative;
		display: grid;
		place-items: center;
		text-decoration: none;
		transition: transform 180ms ease;
		-webkit-tap-highlight-color: transparent;
	}

	@supports (container-type: size) {
		.juego {
			--lado: min(100cqw, calc(100cqh * 1.08));
			container-type: size;
		}
	}

	.juego__estrella {
		position: absolute;
		top: 50%;
		left: 50%;
		width: var(--lado);
		height: calc(var(--lado) / 1.08);
		translate: -50% -50%;
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
		width: calc(var(--lado) * 0.58);
		color: var(--blanco);
		font-family: var(--display);
		font-size: 1rem;
		font-weight: 400;
		line-height: 0.94;
		letter-spacing: 0.01em;
		text-align: center;
		text-transform: uppercase;
		hyphens: auto;
		text-wrap: balance;
	}

	@supports (container-type: size) {
		.juego__nombre {
			font-size: calc(var(--lado) * 0.13);
		}
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
		outline: none;
	}

	.juego:focus-visible .juego__estrella {
		outline: 3px solid var(--verde);
		outline-offset: 6px;
		border-radius: 1rem;
	}

	.vacio {
		flex: 1 1 0;
		min-height: 0;
		display: grid;
		place-items: center;
		margin: 0;
		padding: 3rem 1.5rem;
		color: var(--verde);
		font-size: 1.125rem;
		text-align: center;
	}

	.protagonistas {
		flex: none;
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
