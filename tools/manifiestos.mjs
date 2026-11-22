import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const JUEGOS = 'juegos';

// Los dos únicos tipos de juego que admite el monorepo:
// - svelte:   aplicación Svelte + Vite que se compila a dist/.
// - estatico: juego ya construido (HTML, CSS, JS y assets) que se sirve tal cual.
export const TIPOS = ['svelte', 'estatico'];

/**
 * Lee y valida `juegos/<slug>/juego.json`. Falla con un mensaje que nombra el
 * fichero culpable en lugar de seguir con datos a medias. Las reglas de cada
 * tipo se comprueban aquí, antes de construir nada.
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
		if (!TIPOS.includes(datos.tipo)) {
			throw new Error(`${ruta}: "tipo" debe ser ${TIPOS.map((tipo) => `"${tipo}"`).join(' o ')}`);
		}
		if (datos.orden !== undefined && typeof datos.orden !== 'number') {
			throw new Error(`${ruta}: "orden" debe ser un número`);
		}
		if (datos.assets !== undefined) {
			if (!Array.isArray(datos.assets) || datos.assets.some((a) => typeof a !== 'string')) {
				throw new Error(`${ruta}: "assets" debe ser una lista de rutas`);
			}
		}

		const juegoDirectorio = join(directorio, entrada.name);
		comprobarEstructura({ ruta, slug: entrada.name, tipo: datos.tipo, directorio: juegoDirectorio });

		manifiestos.push({
			slug: entrada.name,
			nombre: datos.nombre.trim(),
			tipo: datos.tipo,
			publicar: datos.publicar,
			orden: datos.orden ?? 100,
			assets: datos.assets ?? [],
			directorio: juegoDirectorio
		});
	}

	return manifiestos.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
}

function comprobarEstructura({ ruta, slug, tipo, directorio }) {
	const paquete = join(directorio, 'package.json');

	if (!existsSync(join(directorio, 'index.html'))) {
		throw new Error(`${ruta}: falta juegos/${slug}/index.html`);
	}

	if (tipo === 'estatico') {
		if (existsSync(paquete)) {
			throw new Error(
				`${ruta}: un juego "estatico" no puede tener package.json; se sirve tal cual, sin compilar`
			);
		}
		return;
	}

	if (!existsSync(paquete)) {
		throw new Error(`${ruta}: un juego "svelte" necesita package.json con svelte y un script "build"`);
	}

	let datos;
	try {
		datos = JSON.parse(readFileSync(paquete, 'utf8'));
	} catch (error) {
		throw new Error(`${paquete}: JSON inválido (${error.message})`);
	}

	const dependencias = { ...datos.dependencies, ...datos.devDependencies };
	if (typeof dependencias.svelte !== 'string') {
		throw new Error(`${paquete}: un juego "svelte" debe declarar la dependencia "svelte"`);
	}
	if (typeof datos.scripts?.build !== 'string') {
		throw new Error(`${paquete}: un juego "svelte" debe tener un script "build" que genere dist/`);
	}
	if (typeof datos.scripts?.dev !== 'string') {
		throw new Error(`${paquete}: un juego "svelte" debe tener un script "dev" para npm run dev:todo`);
	}
}
