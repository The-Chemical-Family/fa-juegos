<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import Compartir from '#lib/Compartir.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	const PORTADA = 'FrenteAmplio';

	// Los juegos son documentos independientes: este layout solo envuelve la
	// portada y el 404. Cuando la ruta es la de un juego (un 404 suele serlo) se
	// usa su nombre y su imagen de Instagram; si no, los de la portada.
	const juego = $derived.by(() => {
		const slug = page.url.pathname.split('/').filter(Boolean)[0];
		if (!slug) return undefined;

		const juegos = page.data.juegos as { slug: string; nombre: string }[] | undefined;
		return juegos?.find((candidato) => candidato.slug === slug);
	});

	const nombre = $derived(juego?.nombre ?? PORTADA);
	const historia = $derived(juego ? `/historias/${juego.slug}.png` : '/historias/portada.png');
</script>

<Compartir {nombre} {historia} />

{@render children()}

