<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Página no encontrada</title>
</svelte:head>

<main>
	<h1>{page.status === 404 ? 'Página no encontrada' : 'Algo ha fallado'}</h1>
	<p><a href="/">Volver a la lista de juegos</a></p>
</main>

<style>
	:global(html) {
		background: #faf8f4;
		color: #141414;
	}

	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
	}

	main {
		max-width: 32rem;
		margin: 0 auto;
		padding: 6rem 1.5rem 4rem;
	}

	h1 {
		font-size: 1.75rem;
		margin: 0 0 1rem;
	}

	a {
		color: #141414;
	}
</style>
