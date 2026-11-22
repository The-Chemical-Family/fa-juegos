import { listarJuegosPublicados } from '../lib/juegos';

export function load() {
	return { juegos: listarJuegosPublicados() };
}
