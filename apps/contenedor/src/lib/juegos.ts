import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface Juego {
	slug: string;
	nombre: string;
	orden: number;
}

interface Manifiesto {
	nombre?: unknown;
	orden?: unknown;
}

// La lista sale de lo que el ensamblado copia de verdad a `static/`, no de los
// manifiestos: si un juego no está desplegado, no se enlaza.
export function listarJuegosPublicados(): Juego[] {
	const raiz = process.cwd();
	const directorioPublicado = join(raiz, 'static');
	const directorioJuegos = join(raiz, '..', '..', 'juegos');

	if (!existsSync(directorioPublicado)) return [];

	const juegos: Juego[] = [];

	for (const entrada of readdirSync(directorioPublicado, { withFileTypes: true })) {
		if (!entrada.isDirectory() || entrada.name.startsWith('.')) continue;
		if (!existsSync(join(directorioPublicado, entrada.name, 'index.html'))) continue;

		const manifiesto = leerManifiesto(join(directorioJuegos, entrada.name, 'juego.json'));
		if (manifiesto?.publicar !== true) continue;

		juegos.push({
			slug: entrada.name,
			nombre: typeof manifiesto.nombre === 'string' ? manifiesto.nombre : entrada.name,
			orden: typeof manifiesto.orden === 'number' ? manifiesto.orden : 100
		});
	}

	return juegos.sort((a, b) => a.orden - b.orden || a.nombre.localeCompare(b.nombre, 'es'));
}

function leerManifiesto(ruta: string): (Manifiesto & { publicar?: unknown }) | null {
	if (!existsSync(ruta)) return null;
	try {
		return JSON.parse(readFileSync(ruta, 'utf8')) as Manifiesto & { publicar?: unknown };
	} catch {
		return null;
	}
}
