import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Comprueba que un juego publicado se puede servir en /<slug>/.
 *
 * La regla se limita a las cargas de subrecursos del `index.html`: nunca se
 * escanea el JavaScript, porque ahí viven URLs legítimas (dominio del sitio,
 * PDF del programa, WhatsApp) que no son rutas de carga.
 */
export function verificarJuego({ slug, distDir, assets = [] }) {
	const problemas = [];
	const indice = join(distDir, 'index.html');

	if (!existsSync(indice)) {
		return [`${slug}: falta dist/index.html`];
	}

	const html = readFileSync(indice, 'utf8');

	for (const ruta of assets) {
		const absoluta = join(distDir, ruta);
		if (!existsSync(absoluta)) {
			problemas.push(`${slug}: el recurso declarado "${ruta}" no existe en dist/`);
		} else if (statSync(absoluta).isDirectory() && !existsSync(join(absoluta, 'index.html'))) {
			problemas.push(`${slug}: el recurso declarado "${ruta}" es una carpeta sin index.html`);
		}
	}

	for (const valor of cargasDelDocumento(html)) {
		if (!rutaPermitida(valor, slug)) {
			problemas.push(`${slug}: "${valor}" no se puede servir desde /${slug}/`);
		}
	}

	return problemas;
}

function cargasDelDocumento(html) {
	const valores = new Set();

	for (const coincidencia of html.matchAll(
		/<(?:link|script|img|iframe|source|video|audio)\b[^>]*?\b(?:src|href)\s*=\s*("([^"]*)"|'([^']*)')/gi
	)) {
		valores.add((coincidencia[2] ?? coincidencia[3] ?? '').trim());
	}

	for (const coincidencia of html.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^'")\s]+))\s*\)/gi)) {
		valores.add((coincidencia[1] ?? coincidencia[2] ?? coincidencia[3] ?? '').trim());
	}

	for (const coincidencia of html.matchAll(/@import\s+(?:"([^"]*)"|'([^']*)')/gi)) {
		valores.add((coincidencia[1] ?? coincidencia[2] ?? '').trim());
	}

	return [...valores].filter((v) => v !== '');
}

function rutaPermitida(valor, slug) {
	if (valor.startsWith('#')) return true;
	if (/^(https?:|data:|mailto:|tel:|blob:)/i.test(valor)) return true;
	// La sirve la plataforma, no el juego; la inyecta el paso de ensamblado.
	if (valor.startsWith('/_vercel/')) return true;
	if (valor.startsWith('//')) return false;
	if (valor.startsWith('/')) return valor === `/${slug}` || valor.startsWith(`/${slug}/`);

	return !valor.split('/').includes('..');
}
