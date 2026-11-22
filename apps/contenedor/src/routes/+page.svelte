<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Juegos</title>
	<meta name="description" content="Juegos de campaña del Frente Amplio." />
</svelte:head>

<main>
	<h1>Juegos</h1>

	{#if data.juegos.length === 0}
		<p>Todavía no hay juegos publicados.</p>
	{:else}
		<ul>
			{#each data.juegos as juego (juego.slug)}
				<li><a href="/{juego.slug}/">{juego.nombre}</a></li>
			{/each}
		</ul>
	{/if}
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
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 2rem;
		letter-spacing: -0.02em;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li + li {
		border-top: 1px solid #e3ded4;
	}

	a {
		display: block;
		padding: 1rem 0;
		color: #141414;
		font-size: 1.25rem;
		text-decoration: none;
		text-underline-offset: 0.2em;
	}

	a:hover,
	a:focus-visible {
		text-decoration: underline;
	}

	p {
		color: #5a5449;
	}
</style>
