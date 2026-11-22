import { cpSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { verificarJuego } from './verificar-juego.mjs';

// El adapter se ejecuta dentro del workspace. Vercel, en cambio, busca la
// Build Output API en la raíz del proyecto que se despliega (el monorepo).
export function prepararVercel(raiz, publicados) {
	const origen = join(raiz, 'apps', 'contenedor', '.vercel', 'output');
	const destino = join(raiz, '.vercel', 'output');
	const config = JSON.parse(readFileSync(join(origen, 'config.json'), 'utf8'));
	const filesystem = config.routes?.findIndex((ruta) => ruta.handle === 'filesystem');
	if (config.version !== 3 || filesystem === undefined || filesystem < 0) {
		throw new Error('El adapter no ha generado la configuración esperada de Vercel');
	}

	const problemas = publicados.flatMap((juego) =>
		verificarJuego({
			slug: juego.slug,
			distDir: join(origen, 'static', juego.slug),
			assets: juego.assets
		})
	);
	if (problemas.length > 0) {
		throw new Error(`Faltan recursos en la salida de Vercel:\n${problemas.join('\n')}`);
	}

	// Los juegos no son páginas de SvelteKit. Resolver solo sus URLs de entrada
	// antes del filesystem/catchall; los assets y las URLs desconocidas conservan
	// las reglas del adapter. Los slugs se escapan porque src es una regex.
	config.routes.splice(filesystem, 0, ...publicados.map(({ slug }) => ({
		src: `^/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`,
		dest: `/${slug}/index.html`
	})));

	// Limpiar solo el artefacto generado, conservando .vercel/project.json.
	rmSync(destino, { recursive: true, force: true });
	cpSync(origen, destino, { recursive: true, verbatimSymlinks: true });
	writeFileSync(join(destino, 'config.json'), `${JSON.stringify(config, null, 2)}\n`);
}
