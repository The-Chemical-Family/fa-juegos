import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { TIPOS } from './manifiestos.mjs';
import { verificarJuego } from './verificar-juego.mjs';

// Extensiones que se reescriben al sustituir __SLUG__, __NOMBRE__ y
// __DESCRIPCION__. El resto (vídeos, imágenes, fuentes) se copia sin tocar.
const TEXTO = new Set(['.md', '.html', '.svelte', '.ts', '.js', '.mjs', '.css', '.json', '.txt', '.svg']);
const HTML = new Set(['.html', '.svelte']);

// El slug es a la vez carpeta, nombre del paquete npm y segmento de la URL.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const NO_SE_COPIAN = new Set([
	'package.json',
	'package-lock.json',
	'pnpm-lock.yaml',
	'yarn.lock',
	'node_modules',
	'dist'
]);

const AYUDA = `Uso: node tools/nuevo-juego.mjs --tipo <svelte|estatico> --slug <slug> --nombre "<nombre>" [opciones]

Obligatorio:
  --tipo svelte|estatico   Tipo de juego (juego.json).
  --slug <slug>            Carpeta, paquete npm y URL: minúsculas, números y guiones.
  --nombre "<texto>"       Nombre visible en la lista del sitio.

Opcional:
  --descripcion "<texto>"  Meta description; por defecto, el nombre.
  --orden <número>         Posición en la lista; por defecto 100.
  --publicar               Nace publicado; por defecto se crea oculto.
  --origen <ruta>          Solo estatico: carpeta ya construida que se copia.
  --prefijo-anterior <p>   Solo estatico: prefijo con el que se construyó (por
                           ejemplo "mi-juego"); se reescribe a /<slug>/.
  -h, --ayuda              Muestra esta ayuda.`;

let opciones;
try {
	opciones = parseArgs({
		args: process.argv.slice(2),
		allowPositionals: false,
		options: {
			tipo: { type: 'string' },
			slug: { type: 'string' },
			nombre: { type: 'string' },
			descripcion: { type: 'string' },
			orden: { type: 'string' },
			publicar: { type: 'boolean', default: false },
			origen: { type: 'string' },
			'prefijo-anterior': { type: 'string' },
			ayuda: { type: 'boolean', short: 'h', default: false }
		}
	}).values;
} catch (error) {
	fallar(`${error.message}\n\n${AYUDA}`);
}

if (opciones.ayuda) {
	console.log(AYUDA);
	process.exit(0);
}

const raiz = resolverRaiz();

const tipo = exigirTipo(opciones.tipo);
const slug = exigirSlug(opciones.slug);
const nombre = exigirNombre(opciones.nombre);
const descripcion = limpiar(opciones.descripcion) || nombre;
const orden = exigirOrden(opciones.orden);
const publicar = opciones.publicar === true;
const origen = opciones.origen ? resolve(process.cwd(), opciones.origen) : null;
const prefijoAnterior = opciones['prefijo-anterior'];

if (tipo === 'svelte' && origen) {
	fallar('--origen solo vale para juegos "estatico": un juego svelte se crea desde la plantilla.');
}
if (tipo === 'svelte' && prefijoAnterior !== undefined) {
	fallar('--prefijo-anterior solo vale para juegos "estatico".');
}

const destino = join(raiz, 'juegos', slug);
if (existsSync(destino)) {
	fallar(`ya existe juegos/${slug}/. Elige otro slug o borra la carpeta a mano si de verdad quieres empezar de cero.`);
}

const plantilla = join(raiz, 'tools', 'plantillas', tipo);

if (tipo === 'svelte') {
	cpSync(plantilla, destino, { recursive: true });
} else if (origen) {
	const fuente = carpetaConstruida(origen);
	console.log(`▶ copiando ${relative(raiz, fuente) || fuente} → juegos/${slug}`);
	cpSync(fuente, destino, { recursive: true, filter: (ruta) => seCopia(fuente, ruta) });
} else {
	cpSync(plantilla, destino, { recursive: true });
}

sustituirPlaceholders(destino, { __SLUG__: slug, __NOMBRE__: nombre, __DESCRIPCION__: descripcion });

if (prefijoAnterior !== undefined) {
	const anterior = normalizarPrefijo(prefijoAnterior);
	console.log(`▶ reescribiendo /${anterior}/ → /${slug}/`);
	reescribirPrefijo(destino, anterior, slug);
}

const manifiesto = { nombre, tipo, publicar };
if (orden !== undefined) manifiesto.orden = orden;
writeFileSync(join(destino, 'juego.json'), `${JSON.stringify(manifiesto, null, 2)}\n`);

console.log(`✔ juegos/${slug} creado (tipo ${tipo}, publicar: ${publicar})`);

const problemas = tipo === 'estatico' ? verificarJuego({ slug, distDir: destino, assets: [] }) : [];

if (problemas.length > 0) {
	console.log(`\n⚠ Todavía no se sirve en /${slug}/. Corrige esto antes de publicar:\n`);
	for (const problema of problemas) console.log(`  - ${problema}`);
}

console.log('\nSiguiente:');
if (tipo === 'svelte') {
	console.log('  1. npm install                 # enlaza el workspace nuevo');
	console.log(`  2. npm run check -w juegos/${slug}`);
	console.log(`  3. npm run dev:todo            # http://localhost:5173/${slug}/`);
} else {
	console.log('  1. npm run check               # valida el manifiesto y la carpeta');
	console.log(`  2. npm run dev:todo            # http://localhost:5173/${slug}/`);
}
console.log(`  ${tipo === 'svelte' ? 4 : 3}. publicar: true en juegos/${slug}/juego.json cuando esté listo`);

function resolverRaiz() {
	let actual = dirname(fileURLToPath(import.meta.url));

	while (true) {
		const paquete = join(actual, 'package.json');
		if (existsSync(paquete) && leerJson(paquete)?.name === 'fa-juegos') return actual;
		const padre = dirname(actual);
		if (padre === actual) break;
		actual = padre;
	}

	// Fallback: el directorio desde el que se invoca, si es dentro del monorepo.
	actual = process.cwd();
	while (true) {
		const paquete = join(actual, 'package.json');
		if (existsSync(paquete) && leerJson(paquete)?.name === 'fa-juegos') return actual;
		const padre = dirname(actual);
		if (padre === actual) break;
		actual = padre;
	}

	fallar('no encuentro la raíz del monorepo (package.json con name "fa-juegos").');
}

function leerJson(ruta) {
	try {
		return JSON.parse(readFileSync(ruta, 'utf8'));
	} catch {
		return null;
	}
}

function exigirTipo(valor) {
	if (valor === undefined) fallar(`falta --tipo.\n\n${AYUDA}`);
	if (!TIPOS.includes(valor)) fallar(`--tipo debe ser ${TIPOS.map((t) => `"${t}"`).join(' o ')}.`);
	return valor;
}

function exigirSlug(valor) {
	if (valor === undefined) fallar(`falta --slug.\n\n${AYUDA}`);
	if (!SLUG.test(valor)) {
		fallar(`--slug "${valor}" no vale: usa minúsculas, números y guiones, sin acentos ni espacios (por ejemplo "trivia-clima").`);
	}
	if (valor.length > 60) fallar('--slug no puede pasar de 60 caracteres.');
	return valor;
}

function exigirNombre(valor) {
	const nombre = limpiar(valor);
	if (!nombre) fallar(`falta --nombre.\n\n${AYUDA}`);
	return nombre;
}

function exigirOrden(valor) {
	if (valor === undefined) return undefined;
	const numero = Number(valor);
	if (!Number.isFinite(numero)) fallar(`--orden "${valor}" no es un número.`);
	return numero;
}

function limpiar(valor) {
	return typeof valor === 'string' ? valor.trim() : '';
}

/**
 * Un `--origen` puede ser el resultado construido (dist/) o el proyecto que lo
 * contiene. Se prefiere dist/ porque es lo que se publica.
 */
function carpetaConstruida(ruta) {
	if (!existsSync(ruta) || !statSync(ruta).isDirectory()) fallar(`--origen ${ruta} no es una carpeta.`);
	if (existsSync(join(ruta, 'dist', 'index.html'))) return join(ruta, 'dist');
	if (existsSync(join(ruta, 'index.html'))) return ruta;
	fallar(`--origen ${ruta} no tiene index.html ni dist/index.html: no es un juego construido.`);
}

function seCopia(fuente, ruta) {
	const partes = relative(fuente, ruta).split(/[/\\]+/).filter(Boolean);
	if (partes.length === 0) return true;
	return partes.every((parte) => !parte.startsWith('.') && !NO_SE_COPIAN.has(parte));
}

function sustituirPlaceholders(directorio, valores) {
	for (const archivo of listarArchivos(directorio)) {
		const extension = extname(archivo).toLowerCase();
		if (!TEXTO.has(extension)) continue;

		const original = readFileSync(archivo, 'utf8');
		if (!Object.keys(valores).some((clave) => original.includes(clave))) continue;

		let texto = original;
		for (const [clave, valor] of Object.entries(valores)) {
			texto = texto.split(clave).join(HTML.has(extension) ? escaparHtml(valor) : valor);
		}
		writeFileSync(archivo, texto);
	}
}

function listarArchivos(directorio) {
	const archivos = [];
	const pendientes = [directorio];

	while (pendientes.length > 0) {
		for (const entrada of readdirSync(pendientes.pop(), { withFileTypes: true })) {
			const ruta = join(entrada.parentPath ?? entrada.path, entrada.name);
			if (entrada.isDirectory()) pendientes.push(ruta);
			else if (entrada.isFile()) archivos.push(ruta);
		}
	}

	return archivos;
}

function escaparHtml(valor) {
	return valor
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

/**
 * El prefijo con el que se construyó el juego (el `base` de su empaquetador).
 * Se acepta con o sin barras y se rechaza la raíz: reescribir "/" afectaría a
 * todas las rutas del juego, incluidas las que ya son correctas.
 */
function normalizarPrefijo(valor) {
	const limpio = String(valor).trim().replace(/^\/+/, '').replace(/\/+$/, '');
	if (limpio === '') {
		fallar('--prefijo-anterior no puede ser "/": indica el segmento con el que se sirvió el juego (por ejemplo "mi-juego").');
	}
	if (/[\s"'<>]/.test(limpio)) fallar(`--prefijo-anterior "${valor}" no parece una ruta.`);
	return limpio;
}

function reescribirPrefijo(directorio, anterior, slug) {
	const reemplazos = [
		[`/${anterior}/`, `/${slug}/`],
		[`"/${anterior}"`, `"/${slug}"`],
		[`'/${anterior}'`, `'/${slug}'`]
	];

	for (const archivo of listarArchivos(directorio)) {
		if (!TEXTO.has(extname(archivo).toLowerCase())) continue;

		const original = readFileSync(archivo, 'utf8');
		if (!reemplazos.some(([buscar]) => original.includes(buscar))) continue;

		let texto = original;
		for (const [buscar, poner] of reemplazos) texto = texto.split(buscar).join(poner);
		writeFileSync(archivo, texto);
	}
}

function fallar(mensaje) {
	console.error(`✖ ${mensaje}`);
	process.exit(1);
}
