<script lang="ts">
	import { onMount } from 'svelte';

	// Mismo botón que el ensamblado inyecta en los juegos (tools/compartir.mjs):
	// aquí cubre la portada y la página de error. El texto sigue la plantilla de
	// campaña y toma el nombre del juego de la ruta actual.
	type DatosCompartir = { title?: string; text?: string; url?: string; files?: File[] };

	let { nombre, historia }: { nombre: string; historia: string } = $props();

	// Plantilla del mensaje; debe coincidir con `tools/compartir.mjs`. El resultado:
	//
	//   👾👾👾👾👾👾👾
	//   ¡¡Muchachada, llegó el faquin momento!!
	//
	//   💥 ¿A qué esperas para jugar a <nombre> ?. Mueve el culo …
	//
	//   <url del juego>
	//   👾👾👾👾👾👾👾
	const APERTURA = '👾👾👾👾👾👾👾';
	const PRIMERA = '¡¡Muchachada, llegó el faquin momento!!';
	const ANTES = '💥 ¿A qué esperas para jugar a ';
	const DESPUES =
		' ? Mueve el culo y pásalo a los indecisos, que el 29N está al caer. O voto útil o nos comen vivos. ¡¡A reventar encuestas, a POR ELLOS!!';
	const CIERRE = '👾👾👾👾👾👾👾';

	let aviso = $state('');
	let temporizador: ReturnType<typeof setTimeout> | undefined;
	let archivo = $state<File | null>(null);
	let puedeInstagram = $state(false);

	// Instagram solo acepta imagen o vídeo: con texto únicamente abre Direct.
	// Se comprueba el soporte de ficheros y se deja la historia preparada como
	// File antes del clic, porque `navigator.share()` exige activación transitoria.
	onMount(() => {
		let cancelado = false;

		const prueba = new File([new Blob([''], { type: 'image/png' })], 'prueba.png', {
			type: 'image/png'
		});
		const navegador = navigator as Navigator & {
			canShare?: (datos?: DatosCompartir) => boolean;
		};

		if (typeof navegador.canShare !== 'function' || !navegador.canShare({ files: [prueba] })) {
			return;
		}

		puedeInstagram = true;

		// La imagen solo se descarga cuando el navegador está libre: no retrasa la página.
		const cargar = () => {
			fetch(historia)
				.then((respuesta) => (respuesta.ok ? respuesta.blob() : Promise.reject(new Error('sin imagen'))))
				.then((blob) => {
					if (cancelado) return;
					archivo = new File([blob], historia.split('/').pop() ?? 'historia.png', {
						type: 'image/png'
					});
				})
				.catch(() => {
					if (!cancelado) puedeInstagram = false;
				});
		};

		if ('requestIdleCallback' in window) requestIdleCallback(cargar, { timeout: 3000 });
		else setTimeout(cargar, 1200);

		return () => {
			cancelado = true;
		};
	});

	function direccion(): string {
		return window.location.origin + window.location.pathname;
	}

	function texto(): string {
		return `${APERTURA}\n${PRIMERA}\n\n${ANTES}${nombre}${DESPUES}\n\n${direccion()}\n${CIERRE}`;
	}

	function avisar(mensaje: string): void {
		aviso = mensaje;
		clearTimeout(temporizador);
		temporizador = setTimeout(() => (aviso = ''), 5000);
	}

	async function compartirInstagram(): Promise<void> {
		if (!archivo) return;

		const navegador = navigator as Navigator & { share?: (datos: DatosCompartir) => Promise<void> };

		try {
			await navegador.share?.({ title: nombre, text: texto(), files: [archivo] });
		} catch {
			// El usuario ha cancelado la hoja de compartir: no hay nada que hacer.
		}
	}

	async function compartir(): Promise<void> {
		const navegador = navigator as Navigator & { share?: (datos: DatosCompartir) => Promise<void> };

		if (typeof navegador.share === 'function') {
			try {
				await navegador.share({ title: nombre, text: texto() });
			} catch {
				// El usuario ha cancelado la hoja de compartir: no hay nada que hacer.
			}
			return;
		}

		const copiado = await copiarTexto();
		avisar(
			copiado
				? 'Texto copiado: pégalo donde quieras compartirlo.'
				: 'No se ha podido compartir este juego.'
		);
	}

	function copiarTexto(): Promise<boolean> {
		const contenido = texto();

		if (navigator.clipboard?.writeText) {
			return navigator.clipboard.writeText(contenido).then(
				() => true,
				() => copiarAntiguo(contenido)
			);
		}

		return Promise.resolve(copiarAntiguo(contenido));
	}

	function copiarAntiguo(contenido: string): boolean {
		const campo = document.createElement('textarea');
		campo.value = contenido;
		campo.setAttribute('readonly', '');
		campo.style.position = 'fixed';
		campo.style.top = '0';
		campo.style.opacity = '0';
		document.body.appendChild(campo);
		campo.select();

		let copiado = false;
		try {
			copiado = document.execCommand('copy');
		} catch {
			copiado = false;
		}

		document.body.removeChild(campo);
		return copiado;
	}
</script>

<div class="compartir">
	<div class="acciones">
		<button class="boton" type="button" title="Compartir" aria-label="Compartir" onclick={compartir}>
			<svg
				viewBox="0 0 24 24"
				width="22"
				height="22"
				aria-hidden="true"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="18" cy="5" r="3" />
				<circle cx="6" cy="12" r="3" />
				<circle cx="18" cy="19" r="3" />
				<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
				<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
			</svg>
		</button>

		{#if puedeInstagram}
			<button
				class="boton boton--instagram"
				type="button"
				title="Compartir en Instagram"
				aria-label="Compartir en Instagram"
				disabled={!archivo}
				onclick={compartirInstagram}
			>
				<svg
					viewBox="0 0 24 24"
					width="22"
					height="22"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
					<circle cx="12" cy="12" r="4.5" />
					<circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
				</svg>
			</button>
		{/if}
	</div>

	{#if aviso}
		<p class="aviso" role="status">{aviso}</p>
	{/if}
</div>

<style>
	.compartir {
		position: fixed;
		top: calc(10px + env(safe-area-inset-top, 0px));
		left: calc(10px + env(safe-area-inset-left, 0px));
		z-index: 2147483647;
		font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
		font-size: 15px;
		line-height: 1.3;
		color: #fff;
		text-align: left;
	}

	.acciones {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.boton {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		min-width: 0;
		min-height: 0;
		margin: 0;
		padding: 0;
		font: inherit;
		border: 1px solid rgba(255, 255, 255, 0.35);
		border-radius: 50%;
		background: rgba(16, 9, 12, 0.75);
		color: #fff;
		cursor: pointer;
		-webkit-backdrop-filter: blur(6px);
		backdrop-filter: blur(6px);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
	}

	.boton:hover {
		background: rgba(16, 9, 12, 0.92);
	}

	.boton:focus-visible {
		outline: 2px solid #cce876;
		outline-offset: 2px;
	}

	.boton--instagram:disabled {
		cursor: progress;
		opacity: 0.55;
	}

	.aviso {
		position: absolute;
		top: 52px;
		left: 0;
		width: max-content;
		max-width: min(272px, calc(100vw - 20px));
		margin: 0;
		padding: 8px 10px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 10px;
		background: #160d11;
		font-size: 13px;
		font-weight: 600;
		color: #cce876;
		box-shadow: 0 10px 26px rgba(0, 0, 0, 0.45);
	}
</style>
