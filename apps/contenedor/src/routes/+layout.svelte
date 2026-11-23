<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Compartir from '#lib/Compartir.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const PORTADA = 'FrenteAmplio';

	// Los juegos son documentos independientes: este layout solo envuelve la
	// portada y el 404. Cuando la ruta es la de un juego (un 404 suele serlo) se
	// usa su nombre real; si no, el de la portada.
	const nombre = $derived.by(() => {
		const slug = page.url.pathname.split('/').filter(Boolean)[0];
		if (!slug) return PORTADA;

		const juegos = page.data.juegos as { slug: string; nombre: string }[] | undefined;
		return juegos?.find((juego) => juego.slug === slug)?.nombre ?? PORTADA;
	});
</script>

<Compartir {nombre} />

{@render children()}

