import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

// `npm run dev:todo` escribe aquí el puerto de cada juego y activa el proxy.
// Sin ese archivo, el contenedor sirve las copias construidas de static/.
function proxyDeJuegos() {
	if (process.env.PROXY_JUEGOS !== '1') return undefined;

	const ruta = join(process.cwd(), '.juegos-dev.json');
	if (!existsSync(ruta)) return undefined;

	const mapa = JSON.parse(readFileSync(ruta, 'utf8'));
	const proxy: Record<string, object> = {};

	for (const [slug, datos] of Object.entries(mapa)) {
		const { puerto, quitarPrefijo } = datos as { puerto: number; quitarPrefijo: boolean };
		proxy[`/${slug}`] = {
			target: `http://localhost:${puerto}`,
			changeOrigin: true,
			ws: true,
			// Los servidores estáticos sirven en la raíz; Vite ya sirve en /<slug>/.
			rewrite: quitarPrefijo
				? (ruta: string) => ruta.replace(new RegExp(`^/${slug}/?`), '/')
				: (ruta: string) => (ruta === `/${slug}` ? `/${slug}/` : ruta)
		};
	}

	return proxy;
}

const proxy = proxyDeJuegos();

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
	],

	server: proxy ? { proxy } : undefined
});
