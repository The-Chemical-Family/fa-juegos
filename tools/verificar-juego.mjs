import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { leerManifiestos } from './manifiestos.mjs';

// `url(...)` de CSS, pero no `createObjectURL(...)` de JavaScript: el segundo
// aparece en juegos de un solo fichero y no es una ruta.
const URL_EN_CSS = /(?<![.\w])url\(\s*(?:"([^"]*)"|'([^']*)'|([^'")\s]+))\s*\)/gi;

/**
 * Comprueba que un juego se puede servir en /<slug>/.
 *
 * En el `index.html` los subrecursos deben ser absolutos: la URL sin barra
 * final resuelve las rutas relativas contra la raíz del dominio. En el CSS se
 * admiten relativas, porque se resuelven contra la hoja de estilos.
 *
 * Cada ruta se comprueba en disco. Una ruta que existe en el HTML pero no en
 * los archivos es el fallo más frecuente al incorporar un juego.
 */
export function verificarJuego({ slug, distDir, assets = [] }) {
	const problemas = [];
	const indice = join(distDir, 'index.html');

	if (!existsSync(indice)) {
		return [`${slug}: falta ${relative(process.cwd(), indice) || indice}`];
	}

	const html = readFileSync(indice, 'utf8');

	if (!/<\/head>/i.test(html)) {
		problemas.push(`${slug}: index.html no tiene </head>, el ensamblado no puede inyectar la analítica`);
	}

	for (const ruta of assets) {
		const absoluta = join(distDir, ruta);
		if (!existsSync(absoluta)) {
			problemas.push(`${slug}: el recurso declarado "${ruta}" no existe en ${relative(process.cwd(), distDir)}/`);
		} else if (statSync(absoluta).isDirectory() && !existsSync(join(absoluta, 'index.html'))) {
			problemas.push(`${slug}: el recurso declarado "${ruta}" es una carpeta sin index.html`);
		}
	}

	for (const valor of cargasDelDocumento(html)) {
		const problema = comprobarReferencia({ valor, slug, distDir, base: distDir, relativa: false });
		if (problema) problemas.push(problema);
	}

	for (const hoja of hojasDeEstilo(distDir)) {
		for (const valor of cargasDeCss(readFileSync(hoja, 'utf8'))) {
			const problema = comprobarReferencia({
				valor,
				slug,
				distDir,
				base: dirname(hoja),
				relativa: true
			});
			if (problema) problemas.push(`${problema} (en ${relative(distDir, hoja)})`);
		}
	}

	return problemas;
}

export function cargasDelDocumento(html) {
	const valores = new Set();

	for (const coincidencia of html.matchAll(
		/<(?:link|script|img|iframe|source|video|audio)\b[^>]*?\b(?:src|href|poster)\s*=\s*("([^"]*)"|'([^']*)')/gi
	)) {
		valores.add((coincidencia[2] ?? coincidencia[3] ?? '').trim());
	}

	for (const coincidencia of html.matchAll(URL_EN_CSS)) {
		valores.add((coincidencia[1] ?? coincidencia[2] ?? coincidencia[3] ?? '').trim());
	}

	for (const coincidencia of html.matchAll(/@import\s+(?:"([^"]*)"|'([^']*)')/gi)) {
		valores.add((coincidencia[1] ?? coincidencia[2] ?? '').trim());
	}

	return [...valores].filter((v) => v !== '');
}

export function cargasDeCss(css) {
	const valores = new Set();

	for (const coincidencia of css.matchAll(URL_EN_CSS)) {
		valores.add((coincidencia[1] ?? coincidencia[2] ?? coincidencia[3] ?? '').trim());
	}

	for (const coincidencia of css.matchAll(/@import\s+(?:"([^"]*)"|'([^']*)')/gi)) {
		valores.add((coincidencia[1] ?? coincidencia[2] ?? '').trim());
	}

	return [...valores].filter((v) => v !== '');
}

/**
 * `base` es el directorio contra el que se resuelve una ruta relativa: el
 * propio juego en el HTML, la hoja de estilos en CSS.
 */
function comprobarReferencia({ valor, slug, distDir, base, relativa }) {
	if (valor.startsWith('#')) return null;
	if (/^(https?:|data:|mailto:|tel:|blob:)/i.test(valor)) return null;
	if (valor.startsWith('/_vercel/')) return null;
	if (valor.startsWith('//')) return `${slug}: "${valor}" se sirve por protocolo relativo y no existe en el despliegue`;

	const limpia = valor.split('#')[0].split('?')[0];
	if (limpia === '') return null;

	if (limpia.startsWith('/')) {
		const prefijo = `/${slug}`;
		if (limpia !== prefijo && !limpia.startsWith(`${prefijo}/`)) {
			return `${slug}: "${valor}" no se sirve desde /${slug}/`;
		}
		const dentro = limpia.slice(prefijo.length).replace(/^\/+/, '');
		if (dentro === '') return null;

		const fichero = join(distDir, dentro);
		if (!existeFichero(fichero)) return `${slug}: "${valor}" no existe en los archivos del juego`;
		return null;
	}

	if (!relativa) {
		return `${slug}: "${valor}" es una ruta relativa; usa /${slug}/${limpia.replace(/^\.\//, '')}`;
	}

	if (valor.split('/').includes('..') && !resolve(base, limpia).startsWith(resolve(distDir))) {
		return `${slug}: "${valor}" sale de la carpeta del juego`;
	}

	if (!existeFichero(join(base, limpia))) return `${slug}: "${valor}" no existe en los archivos del juego`;
	return null;
}

function existeFichero(ruta) {
	if (!existsSync(ruta)) return false;
	const datos = statSync(ruta);
	if (datos.isFile()) return true;
	return datos.isDirectory() && existsSync(join(ruta, 'index.html'));
}

function hojasDeEstilo(directorio) {
	const hojas = [];
	const pendientes = [directorio];

	while (pendientes.length > 0) {
		const actual = pendientes.pop();
		for (const entrada of readdirSync(actual, { withFileTypes: true })) {
			if (entrada.name === 'node_modules' || entrada.name.startsWith('.')) continue;
			const ruta = join(actual, entrada.name);
			if (entrada.isDirectory()) pendientes.push(ruta);
			else if (entrada.name.endsWith('.css')) hojas.push(ruta);
		}
	}

	return hojas;
}

function esEjecutableDirecto() {
	return process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

if (esEjecutableDirecto()) {
	const ruta = resolve(process.argv[2] ?? '');
	if (!process.argv[2] || !existsSync(ruta)) {
		console.error('Uso: node tools/verificar-juego.mjs <ruta del juego>');
		process.exit(1);
	}

	const slug = basename(ruta);
	const manifiesto = leerManifiestos().find((juego) => juego.slug === slug);
	if (!manifiesto) {
		console.error(`${slug}: no hay juego.json en esa carpeta`);
		process.exit(1);
	}

	const distDir = manifiesto.tipo === 'svelte' ? join(ruta, 'dist') : ruta;
	const problemas = verificarJuego({
		slug,
		distDir,
		assets: manifiesto.assets
	});

	if (problemas.length > 0) {
		console.error(`✖ ${slug}`);
		for (const problema of problemas) console.error(`  - ${problema}`);
		process.exit(1);
	}

	console.log(`✔ ${slug}: se puede servir en /${slug}/`);
}
