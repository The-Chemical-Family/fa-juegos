import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Los enlaces a los juegos apuntan a ficheros estáticos, no a rutas de
// SvelteKit: el rastreador de prerender las sigue y recibe un 404. Se ignoran
// sólo los 404 de primer segmento que corresponde a un juego ya copiado.
function juegosCopiados(): string[] {
	const directorio = join(process.cwd(), 'static');
	if (!existsSync(directorio)) return [];
	return readdirSync(directorio, { withFileTypes: true })
		.filter((entrada) => entrada.isDirectory())
		.map((entrada) => entrada.name);
}

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			prerender: {
				handleHttpError({ path, status, message }) {
					const primero = path.split('/').filter(Boolean)[0];
					if (status === 404 && primero && juegosCopiados().includes(primero)) return;
					throw new Error(message);
				}
			},

			// Despliegue en Vercel. La lista y el 404 se prerenderizan, así que no
			// hay función de servidor en el camino de las visitas.
			adapter: adapter()
		})
	]
});
