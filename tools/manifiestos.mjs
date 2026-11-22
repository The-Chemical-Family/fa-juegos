import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const JUEGOS = 'juegos';

/**
 * Lee y valida `juegos/<slug>/juego.json`. Falla con un mensaje que nombra el
 * fichero culpable en lugar de seguir con datos a medias.
 */
export function leerManifiestos(raiz = process.cwd()) {
	const directorio = join(raiz, JUEGOS);
	if (!existsSync(directorio)) throw new Error(`no existe ${JUEGOS}/`);

	const manifiestos = [];

	for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
		if (!entrada.isDirectory() || entrada.name.startsWith('.')) continue;

		const ruta = join(directorio, entrada.name, 'juego.json');
		if (!existsSync(ruta)) continue;

		let datos;
		try {
			datos = JSON.parse(readFileSync(ruta, 'utf8'));
		} catch (error) {
			throw new Error(`${ruta}: JSON inválido (${error.message})`);
		}

		if (typeof datos.nombre !== 'string' || datos.nombre.trim() === '') {
			throw new Error(`${ruta}: "nombre" debe ser un texto no vacío`);
		}
		if (typeof datos.publicar !== 'boolean') {
			throw new Error(`${ruta}: "publicar" debe ser true o false`);
		}
		if (datos.orden !== undefined && typeof datos.orden !== 'number') {
			throw new Error(`${ruta}: "orden" debe ser un número`);
		}
		if (datos.assets !== undefined) {
			if (!Array.isArray(datos.assets) || datos.assets.some((a) => typeof a !== 'string')) {
				throw new Error(`${ruta}: "assets" debe ser una lista de rutas`);
			}
		}

		manifiestos.push({
			slug: entrada.name,
			nombre: datos.nombre.trim(),
			publicar: datos.publicar,
			orden: datos.orden ?? 100,
			assets: datos.assets ?? [],
			directorio: join(directorio, entrada.name)
		});
	}

	return manifiestos.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
}
