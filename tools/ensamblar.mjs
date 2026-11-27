import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { leerManifiestos } from './manifiestos.mjs';
import { snippetAnalitica } from './analitica.mjs';
import { bloqueCompartir, FIN as FIN_COMPARTIR, INICIO as INICIO_COMPARTIR } from './compartir.mjs';
import { verificarJuego } from './verificar-juego.mjs';
import { prepararVercel } from './preparar-vercel.mjs';

const INICIO = '<!-- analitica:start -->';
const FIN = '<!-- analitica:end -->';
const SNIPPET = [
	'<script defer src="/_vercel/insights/script.js"></script>',
	snippetAnalitica()
].join('');
const NO_SE_SIRVEN = new Set(['juego.json', 'README.md', 'dist', 'node_modules']);
const EXTENSIONES_IMAGEN = ['.png', '.jpg', '.jpeg', '.webp'];

const raiz = process.cwd();
const contenedor = join(raiz, 'apps', 'contenedor');
const estatico = join(contenedor, 'static');

const manifiestos = leerManifiestos(raiz);
const publicados = manifiestos.filter((juego) => juego.publicar);
const ocultos = manifiestos.filter((juego) => !juego.publicar);

limpiarPublicados();
copiarImagen('og');
copiarImagen('historias');

for (const juego of publicados) {
	const destino = join(estatico, juego.slug);

	if (juego.tipo === 'svelte') {
		console.log(`\n▶ ${juego.slug}: construyendo`);
		ejecutar('npm', ['run', 'build', '-w', join('juegos', juego.slug)]);

		const origen = join(juego.directorio, 'dist');
		if (!existsSync(join(origen, 'index.html'))) {
			throw new Error(`${juego.slug}: el build no ha generado dist/index.html`);
		}

		cpSync(origen, destino, { recursive: true });
	} else {
		// Juego estático ya construido: la carpeta del juego es el artefacto. Se
		// copia tal cual y solo se deja fuera lo que no debe servirse.
		console.log(`\n▶ ${juego.slug}: copiando (sin build)`);
		copiarEstatico(juego.directorio, destino);
	}

	inyectarAnalitica(join(destino, 'index.html'));
	inyectarCompartir(join(destino, 'index.html'), juego.nombre, `/historias/${juego.slug}.png`);
}

const problemas = publicados.flatMap((juego) => [
	...verificarJuego({
		slug: juego.slug,
		distDir: join(estatico, juego.slug),
		assets: juego.assets
	}),
	...comprobarImagen(juego, 'og'),
	...comprobarImagen(juego, 'historias'),
	...(existsSync(join(raiz, 'designs', 'historias', 'portada.png'))
		? []
		: ['portada: falta designs/historias/portada.png, la imagen de Instagram de la portada'])
]);

if (problemas.length > 0) {
	console.error('\n✖ La verificación ha fallado:\n');
	for (const problema of problemas) console.error(`  - ${problema}`);
	process.exit(1);
}

console.log('\n▶ contenedor: construyendo');
ejecutar('npm', ['run', 'build', '-w', 'apps/contenedor']);

console.log('\n▶ Vercel: preparando .vercel/output en la raíz');
prepararVercel(raiz, publicados);

console.log('\n✔ Ensamblado terminado');
for (const juego of publicados) console.log(`  publicado: /${juego.slug}/ — ${juego.nombre}`);
for (const juego of ocultos) console.log(`  oculto:    ${juego.slug} (publicar: false)`);

function copiarEstatico(origen, destino) {
	cpSync(origen, destino, {
		recursive: true,
		filter: (ruta) => {
			const partes = ruta.slice(origen.length).split(/[/\\]+/).filter(Boolean);
			return partes.every((parte) => !NO_SE_SIRVEN.has(parte) && !parte.startsWith('.'));
		}
	});
}

function limpiarPublicados() {
	if (!existsSync(estatico)) return;
	for (const entrada of readdirSync(estatico, { withFileTypes: true })) {
		if (entrada.isDirectory()) rmSync(join(estatico, entrada.name), { recursive: true, force: true });
	}
}

// Las imágenes compartibles viven en el repositorio (`designs/og` y
// `designs/historias`) porque `static/` se genera en cada ensamblado. Se sirven
// en la raíz del dominio: `/og/<slug>.png` (o `.jpg`) para `og:image` y
// `/historias/<slug>.png` para compartir en Instagram.
function copiarImagen(carpeta) {
	const origen = join(raiz, 'designs', carpeta);
	if (!existsSync(origen)) return;

	const destino = join(estatico, carpeta);
	mkdirSync(destino, { recursive: true });

	for (const entrada of readdirSync(origen, { withFileTypes: true })) {
		if (entrada.isFile() && EXTENSIONES_IMAGEN.some((ext) => entrada.name.endsWith(ext))) {
			cpSync(join(origen, entrada.name), join(destino, entrada.name));
		}
	}
}

function comprobarImagen(juego, carpeta) {
	const existe = EXTENSIONES_IMAGEN.some((ext) =>
		existsSync(join(raiz, 'designs', carpeta, `${juego.slug}${ext}`))
	);
	return existe
		? []
		: [`${juego.slug}: falta designs/${carpeta}/${juego.slug}.png (o .jpg)`];
}

function inyectarCompartir(ruta, nombre, historia) {
	const html = readFileSync(ruta, 'utf8');
	const limpio = quitarBloque(html, INICIO_COMPARTIR, FIN_COMPARTIR);

	if (!/<\/body>/i.test(limpio)) {
		throw new Error(`${ruta}: no hay </body> donde inyectar el botón de compartir`);
	}

	const bloque = bloqueCompartir(nombre, historia);
	const conBoton = limpio.replace(/<\/body>/i, `${bloque}\n</body>`);

	if (conBoton.split(bloque).length - 1 !== 1) {
		throw new Error(`${ruta}: el botón de compartir se ha inyectado más de una vez`);
	}

	writeFileSync(ruta, conBoton);
}

function quitarBloque(html, inicio, fin) {
	let resultado = html;
	let desde = resultado.indexOf(inicio);

	while (desde !== -1) {
		const hasta = resultado.indexOf(fin, desde);
		if (hasta === -1) break;
		resultado = resultado.slice(0, desde) + resultado.slice(hasta + fin.length);
		desde = resultado.indexOf(inicio);
	}

	return resultado;
}

function inyectarAnalitica(ruta) {
	const html = readFileSync(ruta, 'utf8');
	const limpio = quitarBloque(html, INICIO, FIN);

	if (!/<\/head>/i.test(limpio)) {
		throw new Error(`${ruta}: no hay </head> donde inyectar la analítica`);
	}

	const conSnippet = limpio.replace(/<\/head>/i, `${INICIO}${SNIPPET}${FIN}\n</head>`);

	if (conSnippet.split(SNIPPET).length - 1 !== 1) {
		throw new Error(`${ruta}: la analítica se ha inyectado más de una vez`);
	}

	writeFileSync(ruta, conSnippet);
}

function ejecutar(comando, argumentos) {
	execFileSync(comando, argumentos, { cwd: raiz, stdio: 'inherit' });
}
