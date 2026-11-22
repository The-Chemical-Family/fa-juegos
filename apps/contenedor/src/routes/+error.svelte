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
		background: #10090c;
		color: #fff;
	}

	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
	}

	main {
		max-width: 32rem;
		margin: 0 auto;
		padding: 6rem 1.5rem 4rem;
		text-align: center;
	}

	h1 {
		margin: 0 0 1rem;
		font-family: 'Anton', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
		font-size: 2.5rem;
		font-weight: 400;
		line-height: 1;
		text-transform: uppercase;
	}

	a {
		color: #cce876;
		text-underline-offset: 0.2em;
	}
</style>
